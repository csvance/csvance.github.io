---
layout: page
title: Portfolio
permalink: /portfolio/
---

## Projects

| Name | Domain | Description |
|---------------|--------|--------|
| [armchair-expert][armchair-expert] | AI\|ML\|NLP | Chatbot which uses several different types of machine learning to generate hilarious and surprisingly relevant responses to queries. Uses [NLP][nlp] to select a subject for which to generate a response. Does a form of sentiment analysis on potential reactions to its replies which fuels a reinforcement learning process. Learns input text and sentence structure along with capitalization styles. |

## Neural Networks

| Name | Type | Framework | Description | Technical |
|-------|--------|---------|---------|---------|
[AOLReactionModel][aol-reaction-model] | Classification | [Keras][keras], [Tensorflow][tensorflow] | Determine whether a reaction to a message indicates amusement | 8 Features, 1 Hidden Layer
[CapitalizationModel][capitalization-model] | Classification | [Keras][keras] | Learn and match capitalization styles based on PoS and sentence position | 23 Features, 4 Classifications

## Non-NN Machine Learning

| Name | Description |
|---------------|--------|
| [PoS Tree][pos-tree-model] | Sequential probability tree used by [armchair-expert][armchair-expert] which learns sentence / text format structures in order to generate more realistic output than with a Markov chain based approach. |
| [Neighbor Markov Chain][markov-chain] | [RDBMS][rdbms] based [Markov chain][markov-chain] used by [armchair-expert][armchair-expert]. In addition to simple a->b relationships, it uses a window function to relate to more distant words, capturing its context as a subject. While this algorithm has provided good results for its intended purpose, its performance has suffered with larger datasets and it may soon be replaced with an LSTM based recurrent neural network. |

[armchair-expert]: https://github.com/csvance/armchair-expert

[aol-reaction-model]: https://github.com/csvance/armchair-expert/blob/master/reaction_model.py
[capitalization-model]: https://github.com/csvance/armchair-expert/blob/master/capitalization_model.py
[pos-tree-model]: https://github.com/csvance/armchair-expert/blob/master/pos_tree_model.py
[markov-chain]: https://github.com/csvance/armchair-expert/blob/master/markov.py

[keras]: https://keras.io
[tensorflow]: https://www.tensorflow.org

[nlp]: https://en.wikipedia.org/wiki/Natural_language_processing
[rdbms]: https://en.wikipedia.org/wiki/Relational_database_management_system
[markov-chain]: https://en.wikipedia.org/wiki/Markov_chain
