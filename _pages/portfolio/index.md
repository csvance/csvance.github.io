---
layout: page
title: Portfolio
permalink: /portfolio/
menu: main
---
## armchair-expert
- Chatbot which uses several different types of machine learning to generate hilarious and surprisingly relevant responses to queries
- Uses [NLP][nlp] to select several subjects for which to generate a response
- Uses sentiment analysis on reactions to replies which fuels reinforcement learning
- Learns input text and sentence structure along with capitalization styles
- [Github][armchair-expert]
## LilTrumpyAI
- [armchair-expert][armchair-expert] trained with all of Donald Trump's tweets
- Tweet or DM [@LilTrumpyAI][liltrumpy] on [Twitter][liltrumpy]

## ML Models

### Sentence Structure and Style Model
- [Recurrent Neural Network][rnn] with learns sentence structure and capitalization style
- Multiple Classification
- Can be used to generate a structure without being seeded with an initial sequence
- Implemented in [Keras][keras]
- 120 Classifications
- [Github][structure-model]

### Positional Vector Markov Chain
- Custom Markov Chain database which stores positional frequencies of word bi-grams
- Each generated word is effected by n words around it, where n is the window size
- [Github][markov-chain-ng]

### AOLReactionModel
- Determine whether a reaction to a message indicates amusement
- Binary Classification
- Implemented in [Keras][keras] and [Tensorflow][tensorflow]
- 8 Features, 1 Hidden Layer
- [Github][aol-reaction-model]


[structure-model]: https://github.com/csvance/armchair-expert/blob/master/structure_model.py
[armchair-expert]: https://github.com/csvance/armchair-expert

[aol-reaction-model]: https://github.com/csvance/armchair-expert/blob/master/reaction_model.py
[neighbor-markov-chain]: https://github.com/csvance/armchair-expert/blob/legacy-sql/markov.py
[markov-chain-ng]: https://github.com/csvance/armchair-expert/blob/master/markov.py

[keras]: https://keras.io
[tensorflow]: https://www.tensorflow.org

[nlp]: https://en.wikipedia.org/wiki/Natural_language_processing
[rdbms]: https://en.wikipedia.org/wiki/Relational_database_management_system
[markov-chain]: https://en.wikipedia.org/wiki/Markov_chain
[liltrumpy]: https://twitter.com/LilTrumpyAI
[twitter]: https://twitter.com
[rnn]: https://en.wikipedia.org/wiki/Recurrent_neural_network
