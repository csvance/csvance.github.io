---
layout: post
title:  "Turn Based Games and 1v1 DQNs"
date:   2018-01-09 12:04:00 -0600
author: Carroll Vance
comments: true
categories: blog
thumbnail: connectfour.jpg
---
## Background
At this point, one would have to be living under a rock to have not heard of [DeepMind's][deepmind] success at teaching itself to play Go by playing itself without any feature engineering. However, most available tutorials online about [Deep Q Networks][dqn] are coming from an entirely different angle: learning how to play various single player games in the [OpenAI Gym][openai-gym]. If one simply applies these examples to turn based games in which the AI learns by playing itself, a world of hurt is in store for several reasons:

* In standard DQN learning, the target reward is retrieved by using the next state after an action is taken. However, the next state in a turned based dueling game is used by the enemy of the agent who took the action. To further complicate matters, the generated next state from an action is in the perspective of the agent taking the action. If we attempt to implement standard DQN, we are training the agent with data used in incorrect game contexts and assigning rewards for the wrong perspective.
* Many turn based dueling games only have a win condition rather than a score which can be used for rewards. This complicates both measuring a DQN's performance and assigning rewards.

## State and Perspective
First of all, in a game where an agent plays itself from multiple perspectives, we must be careful the correct perspective is provided when making predictions or training discounted future rewards. For example, let us consider the game [Connect Four][connect-four]. Instead of viewing the game as a battle between a red agent and a black agent, we could consider it from the perspective the agents viewpoint at the state being considered. For example, when the agent who takes the second turn blocks the agent who went first, the following next state is generated:

![perspective]({{ "/assets/img/posts/perspective_a.png" | absolute_url }}){:class="img-fluid"}

However, this next state wouldn't be used by the agent who went second to take an action. It is going to be used by the agent who went first, but it needs to be inverted to their perspective before it can be used:

![perspective]({{ "/assets/img/posts/perspective_b.png" | absolute_url }}){:class="img-fluid"}

However, this is not the only tweak needed to get DQN working with a dueling turn based game. Let us recall how the discounted future reward is calculated:
* `future_reward = reward + gamma * amax(predict(next_state))`
* gamma: discount factor, for example 0.9
* reward: the reward the agent recieved for taking an action
* next_state: the state generated from applying an action to the original state
* amax selects: highest value from the result

Remember, next_state will be the enemy agent's state. So if we simply implement this formula, we are predicting the discounted future reward that the enemy agent might receive, not our own. We must predict one more state into the future in order to propagate the discounted future reward:

{% highlight python %}
# We must invert the perspective of next_state so it is in the perspective of the enemy of the player who took the action which resulted in next_state
next_state.invert_perspective()
# Predict the action the enemy is most likely to take
enemy_action = argmax(predict(next_state))
# Apply the action and invert the perspective back to the original one
true_next_state = next_state.apply(enemy_action)
true_next_state.invert_perspective()
# Finally calculate discounted future reward
future_reward = reward + gamma * amax(predict(true_next_state))
{% endhighlight %}

I have also tried subtracting the enemy reward from the reward that took the original action, but have not been able to measure good long or short term results with this policy.

## Win Conditions and Rewards
Another problem with certain board games such as Connect Four is that they have no objective way of keeping score. There is only reward for victory and punishment for failure. I have had luck using 1.0 for victory, -1.0 for failure, and 0.0 for all other moves. Samples for duplicate games in a row and ties should be discarded as they don't contain any useful information and will only serve to pollute our replay memory.

## Measuring Performance
One major challenge of DQNs with only win / loss conditions is measuring the networks performance over time. I have found a few ways to do this, including having the agent play a short term reward maximizing symbolic AI every N games as validation. If our agent cannot beat an agent that only thinks in the short term, then we need to continue making changes to the network structure, hyper-parameters, and feature representation. Beating this short sighted AI consistently should be our first goal.

## Network Stability
A common mistake creating a DQN is making the network have too few dimensions to begin with. This can cause serious aliasing in our predictions, resulting in an unstable network. Generally speaking, it is better to start with a wide network and testing how much the network can be slimmed down.

We must also make sure our training data and labels are formatted in a way to ensure stability. Rewards should be normalized in the [-1., 1.] range, and any discounted future reward which is outside of this range should be clipped.

Another factor in network stability is our experience replay buffer size. Too small and our network will forget past things it learned, and too big and it will take excessive time to learn. I find it is generally its better to start smaller while testing if the network is able to learn simple gameplay, and increasing it as training time increases and we want to insure network stability. People smarter than I such as Schaul et al. (2017) have proposed methods to optimize the size of the experience replay buffer: [Prioritized Experience Replay][per] which may be worth investigating if you are unsure how to tune this.

Another factor to consider is the optimizer learning rate. A high learning rate can create instabilities in the neural networks state approximation behavior, resulting in all kinds of catastrophic forgetfulness. Starting at 0.001 is a good idea, and if you note instabilities with this try decreasing it from there. I find that 0.0001 works optimally for longer training sessions.

Finally, techniques used in deep neural networks such as dropout and batchnorm have a negative impact on Deep-Q Learning. I suggest watching [Deep RL Bootcamp Lecture 3: Deep Q-Networks][deep-rl-bootcamp] if you are interested in more information on this.

## Conclusion
Deep Q Learning proves to be both extremely interesting and challenging. While I am not completely happy with my own results in training a DQN for Connect Four, I think it is at least worth posting some of the things I have learned from the experience. My current agent can be found at the link below.
* [Github: DQN AI for Connect Four][dqn-connectfour]

## References
* [Deep Q-Learning with Keras and Gym][keras-dqn]
* [Deep RL Bootcamp Lecture 3: Deep Q-Networks][deep-rl-bootcamp]

[deep-rl-bootcamp]: https://www.youtube.com/watch?v=fevMOp5TDQs
[averaged-dqn]: https://arxiv.org/abs/1611.01929
[connect-four]: https://en.wikipedia.org/wiki/Connect_Four
[dqn-connectfour]: https://github.com/csvance/deep-learning-connect-four
[deepmind]: https://deepmind.com
[alphago]: https://deepmind.com/research/alphago/
[dqn]: https://deepmind.com/research/dqn/
[openai-gym]: https://github.com/openai/gym
[per]: https://arxiv.org/abs/1511.05952

[keras-dqn]: https://keon.io/deep-q-learning/
