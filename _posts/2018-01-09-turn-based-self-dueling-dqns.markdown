---
layout: post
title:  "Turn Based Games and Agent vs. Agent DQNs"
date:   2018-01-09 12:04:00 -0600
author: Carroll Vance
comments: true
categories: blog
---
## Background
At this point, one would have to be living under a rock to have not heard of [DeepMind's][deepmind] success at teaching itself to play Go by playing itself without any feature engineering. However, most available tutorials online about [Deep Q Networks][dqn] are coming from an entirely different angle: learning how to play various single player games in the [OpenAI Gym][openai-gym]. If one simply applies these examples to turn based games in which the AI learns by playing itself, a world of hurt is in store for several reasons:

* In standard DQN learning, the target reward is retrieved by using the next state after an action is taken. However, the next state in a turned based dueling game is used by the enemy of the agent who took the action. To further complicate matters, the generated next state from an action is in the perspective of the agent taking the action. If we attempt to implement standard DQN, we are training the agent with data used in incorrect game contexts and assigning rewards for the wrong perspective.
* Many turn based dueling games only have a win condition rather than a score which can be used for rewards. This complicates both measuring a DQN's performance and assigning rewards.

## State and Perspective
First of all, in a game where an agent plays itself from multiple perspectives, we must be careful the correct perspective is provided when making predictions or training discounted future rewards. For example, let us consider the game [Connect Four][connect-four]. Instead of viewing the game as a battle between a red agent and a black agent, we could consider it from the perspective the agents viewpoint at the state being considered. For example, when the agent who takes the second turn blocks the agent who went first, the following next state is generated:

![perspective]({{ "/assets/img/perspective_a.png" | absolute_url }})

However, this next state wouldn't be used by the agent who went second to take an action. It is going to be used by the agent who went first, but it needs to be inverted to their perspective before it can be used:

![perspective]({{ "/assets/img/perspective_b.png" | absolute_url }})

However, this is not the only tweak needed to get DQN working with a dueling turn based game. Let us recall how the discounted future reward is calculated:
* `future_reward = reward + gamma * amax(predict(next_state))`
* gamma: discount factor, for example 0.9
* reward: the reward the agent recieved for taking an action
* next_state: the state generated from applying an action to the original state
* amax selects: highest value from the result

Remember, next_state will be the enemy agent's state. So if we simply implement this formula, we are predicting the discounted future reward that the enemy agent might receive, not our own. Fortunately, with a modified version of Anschel et al. (2016) [Averaged-DQN][averaged-dqn] we have a framework to address this. They proposed a DQN which looks K steps into the future, and averaged the rewards. When K=1, the Averaged DQN behaves like a standard DQN. To solve our problem, we will obviously use a K value higher than one. I have found a K value of 2 to be optimal, as any higher value potentially starts predicting game states which do not exist, leading to unintelligible behavior. Instead of adding all future rewards together and averaging them, we will put them into two different buckets: future_rewards_self and future_rewards_enemy. We will then average and subtract them from each other. Our discounted future reward now looks more like this:

{% highlight python %}
future_reward = reward + gamma * (avg(future_rewards_self)
                              - avg(future_rewards_enemy))
{% endhighlight %}


Keep in mind that for each step in [0, K], we will need to invert the perspective of next_state, make the reward prediction, then apply the maximum rewarded action to the state. If we do not do this, we will be training the DQN to play the other agents turn from a different perspective half of the time! Here is what the part of the training function which calculates discounted future reward might look like:

{% highlight python %}
 positive_reward_sum = 0.
 negative_reward_sum = 0.

 if not result.done:
     new_state = result.new_state.copy()
     for k in range(0, self.k):

         # Change the perspective
         new_state.invert_perspective()

         prediction = self._model.predict(
                      np.array(
                      [new_state.normalized()]
                      ))[0]
         reward = np.amax(prediction)
         action = C4Action(np.argmax(prediction))

         # Enemy reward
         if k % 2 == 0:
             negative_reward_sum += reward
         # Self Reward
         else:
             positive_reward_sum += reward

         # Apply the action
         move_result = new_state.move(action)

     target = result.reward + self.gamma * \
              (positive_reward_sum / self.k_self
    - negative_reward_sum / self.k_enemy)

 else:
     target = result.reward
{% endhighlight %}

## Win Conditions and Rewards
Another problem with certain board games such as Connect Four is that they have no objective way of keeping score, and if we plan on training the DQN to play itself without any feature engineering, making our own is off limits for games such as checkers and chess. There is only reward for victory, punishment, and a minute reward for surviving another turn. I have had luck using 1.0 for victory, -1.0 for failure, and 0.1 for all other moves as a slight encouragement for survival. Samples for duplicate games in a row and ties should be discarded as they don't contain any useful information and will only serve to pollute our replay memory.

## Measuring Performance
One major challenge of DQNs with only win / loss conditions is measuring the networks performance over time. I haven't found any single solution to this problem other than playing against the network and monitoring certain statistics such as the average number of turns taken to complete a game.

## Network Stability
While using an Averaged-DQN makes the network much more likely to converge, we still must make sure our training data and labels are formatted in a way to ensure stability. Rewards should be normalized in the [0., 1.] range, and any discounted future reward which is outside of this range should be clipped.

One other factor in network stability is our experience replay buffer size. Too small and our network will forget past things it learned, and too big and it will take excessive time to learn. I find it is generally its better to start smaller while testing if the network is able to learn simple gameplay, and increasing it as training time increases and expert strategies need to be learned. People smarter than I such as Schaul et al. (2017) have proposed methods to optimize the size of the experience replay buffer: [Prioritized Experience Replay][per] which may be worth investigating if you are unsure how to tune this.

## Conclusion
Deep Q Learning without feature engineering proves to be both extremely interesting and challenging. While I am not completely happy with my own results in training a DQN for Connect Four, I think it is at least worth posting some of the things I have learned from the experience. My current agent can be found at the link below.
* [Github: Averaged-DQN AI for Connect Four][dqn-connectfour]

[averaged-dqn]: https://arxiv.org/abs/1611.01929
[connect-four]: https://en.wikipedia.org/wiki/Connect_Four
[dqn-connectfour]: https://github.com/csvance/deep-learning-connect-four
[deepmind]: https://deepmind.com
[alphago]: https://deepmind.com/research/alphago/
[dqn]: https://deepmind.com/research/dqn/
[openai-gym]: https://github.com/openai/gym
[per]: https://arxiv.org/abs/1511.05952
