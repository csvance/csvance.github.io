var hostname = "https://csvance.github.io";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Turn Based Games and Self Dueling DQNs",
      category: null,
      content: "Background\nAt this point, one would have to be living under a rock to have not heard of DeepMind’s success at teaching itself to play Go by playing itself without any feature engineering. However, most available tutorials online about Deep Q Networks are coming from an entirely different angle: learning how to play various single player games in the OpenAI Gym. If one simply applies these examples to turn based games in which the AI learns by playing itself, a world of hurt is in store for several reasons:\n\n\n  In standard DQN learning, the target reward is retrieved by using the next state after an action is taken. However, the next state in a turned based dueling game is used by the enemy of the agent who took the action. To further complicate matters, the generated next state from an action is in the perspective of the agent taking the action. If we attempt to implement standard DQN, we are training the agent with data used in incorrect game contexts and assigning rewards for the wrong perspective.\n  Many turn based dueling games only have a win condition rather than a score which can be used for rewards. This complicates both measuring a DQN’s performance and assigning rewards.\n\n\nState and Perspective\nFirst of all, in a game where an agent plays itself from multiple perspectives, we must be careful the correct perspective is provided when making predictions or training discounted future rewards. For example, let us consider the game Connect Four. Instead of viewing the game as a battle between a red agent and a black agent, we could consider it from the perspective the agents viewpoint at the state being considered. For example, when the agent who takes the second turn blocks the agent who went first, the following next state is generated:\n\n\n\nHowever, this next state wouldn’t be used by the agent who went second to take an action. It is going to be used by the agent who went first, but it needs to be inverted to their perspective before it can be used:\n\n\n\nHowever, this is not the only tweak needed to get DQN working with a dueling turn based game. Let us recall how the discounted future reward is calculated:\n\n# gamma: discount factor, for example 0.9\n# reward: the reward the agent recieved for taking an action\n# next_state: the state generated from applying an action to the original state\n# amax selects: highest value from the result\n\nfuture_reward = reward + gamma * amax(predict(next_state))\n\n\n\nRemember, next_state will be the enemy agent’s state. So if we simply implement this formula, we are predicting the discounted future reward that the enemy agent might receive, not our own. Fortunately, with a modified version of Anschel et al. (2016) Averaged-DQN we have a framework to address this. They proposed a DQN which looks K steps into the future, and averaged the rewards. When K=1, the Averaged DQN behaves like a standard DQN. To solve our problem, we will obviously use a K value higher than one. Instead of adding all future rewards together and averaging them, we will put them into two different buckets: future_rewards_self and future_rewards_enemy. We will then average each of these buckets separately and subtract future_rewards_enemy from future_rewards_self. Our discounted future reward now looks more like this:\n\nfuture_reward = reward + gamma * (avg(future_rewards_self) - avg(future_rewards_enemy))\n\n\n\nKeep in mind that for each step in [0, K], we will need to invert the perspective of next_state, make the reward prediction, then apply the maximum rewarded action to the state. If we do not do this, we will be training the DQN to play the other agents turn from a different perspective half of the time! Here is what the part of the training function which calculates discounted future reward might look like:\n\n positive_reward_sum = 0.\n negative_reward_sum = 0.\n\n if not result.done:\n     new_state = result.new_state.copy()\n     for k in range(0, self.k):\n\n         # Change the perspective\n         new_state.invert_perspective()\n\n         prediction = self._model.predict(\n                      np.array(\n                      [new_state.normalized()]\n                      ))[0]\n         reward = np.amax(prediction)\n         action = C4Action(np.argmax(prediction))\n\n         # Enemy reward\n         if k % 2 == 0:\n             negative_reward_sum += reward\n         # Self Reward\n         else:\n             positive_reward_sum += reward\n\n         # Apply the action\n         move_result = new_state.move(action)\n\n     target = result.reward + self.gamma * \\\n              (positive_reward_sum / self.k_self\n              - negative_reward_sum / self.k_enemy)\n\n else:\n     target = result.reward\n\n\n\nWin Conditions and Rewards\nAnother problem with certain board games such as Connect Four is that they have no objective way of keeping score, and if we plan on training the DQN to play itself without any feature engineering, making our own is off limits for games such as checkers and chess. There is only reward for victory, punishment, and a minute reward for surviving another turn. I have had luck using 1.0 for victory, -1.0 for failure, and 0.1 for all other moves as a slight encouragement for survival. Samples for duplicate games in a row and ties should be discarded as they don’t contain any useful information and will only serve to pollute our replay memory.\n\nMeasuring Performance\nOne major challenge of DQNs with only win / loss conditions is measuring the networks performance over time. I havn’t found any single solution to this problem other than playing against the network and monitoring certain statistics such as the average number of turns taken to complete a game.\n\nNetwork Stability\nWhile using an Averaged-DQN makes the network much more likely to converge, we still must make sure our training data and labels are formatted in a way to ensure stability. Rewards should be normalized in the [-1.0, 1.0] range, and any discounted future reward which is outside of this range should be clipped. However, significant clipping is generally a sign that something is not tuned correctly in your network, and will likely result in general instability and/or failure to converge. A stable DQN network will have a statistically stable mean, median, and standard deviation for the discounted future reward with minimal to no clipping:\n\n\n\nOne other factor in network stability is our experience replay buffer size. Too small and our network will forget past things it learned, and too big and it will take excessive time to learn. Generally its better to start smaller while testing if the network is able to learn simple gameplay, and increasing it as training time increases and expert strategies are learned.\n\nConclusion\nDeep Q Learning without feature engineering proves to be both extremely interesting and challenging. While I am not completely happy with my own results in training a DQN for Connect Four, I think it is at least worth posting some of the things I have learned from the experience. My current agent can be found at the link below.\n\n  Github: Averaged-DQN AI for Connect Four\n\n\n",
      tags: [],
      id: 0
    });
    

    index.add({
      title: "The RNN Sequence Prediction Seed Problem and How To Solve It",
      category: null,
      content: "The Problem\nThere are many tutorials on how to create Recurrent Neural Networks and use them for sequence generation. However, most of these tutorials show an example where an initial seed value must be used to start the generation process. This is highly impractical for a query response generation scheme. Luckily, there is a fairly easy way to solve this involving how we format our training data.\n\nSolution\nEmpty Item\nFirst of all, we need to make sure we have a dummy value which represents an empty sequence item. It is convenient to use zero for this, because most padding functions are going to pad with zeros, and functions like np.zeros make it easy to initialize this. We will represent this value as NULL for simplicity.\nEnd of Sequence Item\nWe need a second special value for marking the end of a sequence. Call it EOS for short, and it can be whatever value you want provided it stays consistent.\nSequence Steps\nInstead of feeding entire sequences for training, we are going to step through each sequence, generating subsequences starting with all empty values and adding one more item in each step. The label for each sequence will simply be the next word in the sequence, or  if we reach the end of the sequence. For example, take the sequence \"The quick brown fox jumps over the lazy dog. This will break down into the following sequences:\n\n\"NULL NULL NULL NULL NULL NULL NULL NULL NULL\" -&gt; The\n\"The NULL NULL NULL NULL NULL NULL NULL NULL\" -&gt; quick\n\"The quick NULL NULL NULL NULL NULL NULL NULL\" -&gt; brown\n\"The quick brown NULL NULL NULL NULL NULL NULL\" -&gt; fox\n\"The quick brown fox NULL NULL NULL NULL NULL\" -&gt; jumps\n\"The quick brown fox jumps NULL NULL NULL NULL\" -&gt; over\n\"The quick brown fox jumps over NULL NULL NULL\" -&gt; the\n\"The quick brown fox jumps over the NULL NULL\" -&gt; lazy\n\"The quick brown fox jumps over the lazy NULL\" -&gt; dog\n\"The quick brown fox jumps over the lazy dog\" -&gt; EOS\n\nSequence Size\nIf you have a sequence larger than your maximum size, start removing the first element before you append a new one. This will have no bearing on prediction because the network will learn how to handle this.\nConclusion\nWe can now train the network and start by feeding it a sequence filled with NULLs to predict the first value. Here is an example doing this using Keras:\n\n  Preprocessing &amp; Model\n\n\n",
      tags: [],
      id: 1
    });
    

    index.add({
      title: "Hello World!",
      category: null,
      content: "Hi, and welcome to my portfolio and blog. I will be chronicling my explorations in machine learning, artificial intelligence, and software engineering here.\n",
      tags: [],
      id: 2
    });
    


var store = [{
    "title": "Turn Based Games and Self Dueling DQNs",
    "link": "/update/dqn/keras/dueling/connectfour/ai/ml/turn-based-self-dueling-dqns.html",
    "image": null,
    "date": "January 9, 2018",
    "category": null,
    "excerpt": "Background At this point, one would have to be living under a rock to have not heard of DeepMind’s success..."
},{
    "title": "The RNN Sequence Prediction Seed Problem and How To Solve It",
    "link": "/update/keras/rnn/lstm/sequence/generation/ml/rnn-seed-problem.html",
    "image": null,
    "date": "December 29, 2017",
    "category": null,
    "excerpt": "The Problem There are many tutorials on how to create Recurrent Neural Networks and use them for sequence generation. However,..."
},{
    "title": "Hello World!",
    "link": "/update/hello-world.html",
    "image": null,
    "date": "December 9, 2017",
    "category": null,
    "excerpt": "Hi, and welcome to my portfolio and blog. I will be chronicling my explorations in machine learning, artificial intelligence, and..."
}]

$(document).ready(function() {
    $('#search-input').on('keyup', function () {
        var resultdiv = $('#results-container');
        if (!resultdiv.is(':visible'))
            resultdiv.show();
        var query = $(this).val();
        var result = index.search(query);
        resultdiv.empty();
        $('.show-results-count').text(result.length + ' Results');
        for (var item in result) {
            var ref = result[item].ref;
            var searchitem = '<li><a href="'+ hostname + store[ref].link+'">'+store[ref].title+'</a></li>';
            resultdiv.append(searchitem);
        }
    });
});