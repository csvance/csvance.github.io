---
layout: page
title: Portfolio
permalink: /portfolio/
---

## Projects
### armchair-expert
- Chatbot which uses several different types of machine learning to generate hilarious and surprisingly relevant responses to queries
- Uses [NLP][nlp] to select a subject for which to generate a response
- Uses sentiment analysis on reactions to replies which fuels reinforcement learning
- Learns input text and sentence structure along with capitalization styles
- [Github][armchair-expert]

## Neural Networks

### AOLReactionModel
- Determine whether a reaction to a message indicates amusement
- Binary Classification
- Implemented in  [Keras][keras] and [Tensorflow][tensorflow]
- 8 Features, 1 Hidden Layer
- [Github][aol-reaction-model]

### CapitalizationModel
- Learn and match capitalization styles based on PoS and sentence position
- Multiple Classification
- Implemented in [Keras][keras]
- 23 Features, 4 Classifications
- [Github][capitalization-model]

## Non-NN Machine Learning

### PoS Tree
- Sequential probability tree used by [armchair-expert][armchair-expert] which learns sentence / text format structures in order to generate more realistic output than with a Markov chain based approach
- [Github][pos-tree-model]

### Neighbor Markov Chain
- [RDBMS][rdbms] based [Markov chain][markov-chain] used by [armchair-expert][armchair-expert]. In addition to simple a->b relationships, it uses a window function to relate to more distant words, capturing its context as a subject. While this algorithm has provided good results for its intended purpose, its performance has suffered with larger datasets and it may soon be replaced with an LSTM based recurrent neural network.
- [Github][neighbor-markov-chain]

[armchair-expert]: https://github.com/csvance/armchair-expert

[aol-reaction-model]: https://github.com/csvance/armchair-expert/blob/master/reaction_model.py
[capitalization-model]: https://github.com/csvance/armchair-expert/blob/master/capitalization_model.py
[pos-tree-model]: https://github.com/csvance/armchair-expert/blob/master/pos_tree_model.py
[neighbor-markov-chain]: https://github.com/csvance/armchair-expert/blob/master/markov.py

[keras]: https://keras.io
[tensorflow]: https://www.tensorflow.org

[nlp]: https://en.wikipedia.org/wiki/Natural_language_processing
[rdbms]: https://en.wikipedia.org/wiki/Relational_database_management_system
[markov-chain]: https://en.wikipedia.org/wiki/Markov_chain
