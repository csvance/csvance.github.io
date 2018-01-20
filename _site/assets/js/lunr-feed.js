var hostname = "https://csvance.github.io";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Turn Based Games and 1v1 DQNs",
      category: null,
      content: "Background\nAt this point, one would have to be living under a rock to have not heard of DeepMind’s success at teaching itself to play Go by playing itself without any feature engineering. However, most available tutorials online about Deep Q Networks are coming from an entirely different angle: learning how to play various single player games in the OpenAI Gym. If one simply applies these examples to turn based games in which the AI learns by playing itself, a world of hurt is in store for several reasons:\n\n\n  In standard DQN learning, the target reward is retrieved by using the next state after an action is taken. However, the next state in a turned based dueling game is used by the enemy of the agent who took the action. To further complicate matters, the generated next state from an action is in the perspective of the agent taking the action. If we attempt to implement standard DQN, we are training the agent with data used in incorrect game contexts and assigning rewards for the wrong perspective.\n  Many turn based dueling games only have a win condition rather than a score which can be used for rewards. This complicates both measuring a DQN’s performance and assigning rewards.\n\n\nState and Perspective\nFirst of all, in a game where an agent plays itself from multiple perspectives, we must be careful the correct perspective is provided when making predictions or training discounted future rewards. For example, let us consider the game Connect Four. Instead of viewing the game as a battle between a red agent and a black agent, we could consider it from the perspective the agents viewpoint at the state being considered. For example, when the agent who takes the second turn blocks the agent who went first, the following next state is generated:\n\n\n\nHowever, this next state wouldn’t be used by the agent who went second to take an action. It is going to be used by the agent who went first, but it needs to be inverted to their perspective before it can be used:\n\n\n\nHowever, this is not the only tweak needed to get DQN working with a dueling turn based game. Let us recall how the discounted future reward is calculated:\n\n  future_reward = reward + gamma * amax(predict(next_state))\n  gamma: discount factor, for example 0.9\n  reward: the reward the agent recieved for taking an action\n  next_state: the state generated from applying an action to the original state\n  amax selects: highest value from the result\n\n\nRemember, next_state will be the enemy agent’s state. So if we simply implement this formula, we are predicting the discounted future reward that the enemy agent might receive, not our own. We must predict one more state into the future in order to propagate the discounted future reward:\n\n# We must invert the perspective of next_state so it is in the perspective of the enemy of the player who took the action which resulted in next_state\nnext_state.invert_perspective()\n# Predict the action the enemy is most likely to take\nenemy_action = argmax(predict(next_state))\n# Apply the action and invert the perspective back to the original one\ntrue_next_state = next_state.apply(enemy_action)\ntrue_next_state.invert_perspective()\n# Finally calculate discounted future reward\nfuture_reward = reward + gamma * amax(predict(true_next_state))\n\nI have also tried subtracting the enemy reward from the reward that took the original action, but have not been able to measure good long or short term results with this policy.\n\nWin Conditions and Rewards\nAnother problem with certain board games such as Connect Four is that they have no objective way of keeping score. There is only reward for victory and punishment for failure. I have had luck using 0.5 for victory, -1.0 for failure, and 0.0 for all other moves. The reason to use 0.5 for a reward instead of 1.0 is it provides more headroom for more rewarding paths to propagate to previous states, allowing us to increase our gamma factor higher without significant clipping. Samples for duplicate games in a row and ties should be discarded as they don’t contain any useful information and will only serve to pollute our replay memory.\n\nMeasuring Performance\nOne major challenge of DQNs with only win / loss conditions is measuring the networks performance over time. I have found a few ways to do this, including having the agent play a short term reward maximizing AI every N games. If our agent cannot beat an agent that only thinks in the short term, there is no point in using a deep neural network for the task anyway. Beating this short sighted AI consistently should be our first goal.\n\nNetwork Stability\nWe must make sure our training data and labels are formatted in a way to ensure stability. Rewards should be normalized in the [-1., 1.] range, and any discounted future reward which is outside of this range should be clipped.\n\nOne other factor in network stability is our experience replay buffer size. Too small and our network will forget past things it learned, and too big and it will take excessive time to learn. I find it is generally its better to start smaller while testing if the network is able to learn simple gameplay, and increasing it as training time increases and expert strategies need to be learned. People smarter than I such as Schaul et al. (2017) have proposed methods to optimize the size of the experience replay buffer: Prioritized Experience Replay which may be worth investigating if you are unsure how to tune this.\n\nAnother important factor is the prioritization of events with reward. In a game such as Connect Four where only two rewards are given per game (win and lose), we must replay these events much more often to ensure that the network actually learns short term strategies. Without doing this, we can never hope to beat a short term maximizing agent, much less anything which can strategize many moves ahead.\n\nConclusion\nDeep Q Learning proves to be both extremely interesting and challenging. While I am not completely happy with my own results in training a DQN for Connect Four, I think it is at least worth posting some of the things I have learned from the experience. My current agent can be found at the link below.\n\n  Github: DQN AI for Connect Four\n\n\nReferences\n\n  Deep Q-Learning with Keras and Gym\n\n\n",
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
    "title": "Turn Based Games and 1v1 DQNs",
    "link": "/blog/turn-based-self-dueling-dqns.html",
    "image": null,
    "date": "January 9, 2018",
    "category": null,
    "excerpt": "Background At this point, one would have to be living under a rock to have not heard of DeepMind’s success..."
},{
    "title": "The RNN Sequence Prediction Seed Problem and How To Solve It",
    "link": "/blog/rnn-seed-problem.html",
    "image": null,
    "date": "December 29, 2017",
    "category": null,
    "excerpt": "The Problem There are many tutorials on how to create Recurrent Neural Networks and use them for sequence generation. However,..."
},{
    "title": "Hello World!",
    "link": "/blog/hello-world.html",
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