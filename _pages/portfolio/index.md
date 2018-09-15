---
layout: page
title: Portfolio
permalink: /portfolio/
menu: main
---

## deep-connect-four (Finished)
- Deep Reinforcement Learning agent for the game "Connect Four" powered by a Deep Q-Network
- [Github][deep-connect-four]

## armchair-expert (Finished)
- Chatbot which uses several different types of machine learning to generate hilarious and surprisingly relevant responses to queries
- Learns new words in realtime like a typical [Markov chain][markov-chain], but uses an [RNN][rnn] to structure and capitalize the output

## EduBot (Current)
- Raspberry Pi powered autonomous robot implemented from scratch in Python
- Designed to teach robotics to newcomers by abstracting complexities with a simple python programming interface.

## Jetson TensorRT ROS Nodes (Current)
- TensorRT ROS nodes for Jetson TX1/TX2
- nVidia DIGITS Node (detection, classification, and segmentation)
- Tensorflow & Keras Node

## Machine Learning Models
### Sentence Structure and Style Model
- [Recurrent Neural Network][rnn] with learns sentence structure and capitalization style
- Multiple Classification
- Can be used to generate a structure without being seeded with an initial sequence
- Implemented in [Keras][keras]
- [Github][structure-model]
### Positional Vector Markov Chain
- Custom Markov Chain database which stores positional frequencies of word bi-grams
- Each generated word is effected by n words around it, where n is the window size
- [Github][markov-chain-ng]

[structure-model]: https://github.com/csvance/armchair-expert/blob/master/models/structure.py
[armchair-expert]: https://github.com/csvance/armchair-expert
[deep-hammy]: https://github.com/csvance/deep-hammy
[deep-connect-four]: https://github.com/csvance/deep-connect-four

[aol-reaction-model]: https://github.com/csvance/armchair-expert/blob/master/models/reaction.py
[neighbor-markov-chain]: https://github.com/csvance/armchair-expert/blob/legacy-sql/markov.py
[markov-chain-ng]: https://github.com/csvance/armchair-expert/blob/master/markov_engine.py

[keras]: https://keras.io
[tensorflow]: https://www.tensorflow.org

[nlp]: https://en.wikipedia.org/wiki/Natural_language_processing
[rdbms]: https://en.wikipedia.org/wiki/Relational_database_management_system
[markov-chain]: https://en.wikipedia.org/wiki/Markov_chain
[liltrumpy]: https://twitter.com/LilTrumpyAI
[twitter]: https://twitter.com
[rnn]: https://en.wikipedia.org/wiki/Recurrent_neural_network
