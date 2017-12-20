---
layout: post
title:  "Next Steps: Recurrent Neural Networks"
date:   2017-12-09 16:27:00 -0600
author: Carroll Vance
categories: update armchair-expert ml ai rnn lstm markov
---

Over a period of several years I have been gradually developing a [Markov chain][markov-chain] style chatbot called [armchair-expert][armchair-expert] which is intended to emulate the patterns of speech it sees in chat messages, tweets, or even books over time. From its humble beginnings using a hack-eyed Markov chain engine, to its current fairly powerful yet inefficient [RDBMS][rdbms] incarnation, it has been slowly improving over time. Now is the time to make what I think is the next step in accuracy and performance: [LSTM][lstm] based [recurrent neural networks][rnn]. However, there are certain potential problems I have been thinking about which make me hesitate fully committing to this approach when I could just create a [trie][trie] style Markov chain which would have the same features as the current system with much higher performance.

### Potential Problems
- New Words - One reason I have hesitated moving to a word embedding neural network based solution in general was the difficulty incorporating newly encountered words without retraining the entire neural net. In theory however, we can set aside many unused embeddings for this purpose, and train the network in real time when new data is encountered.
- Performance - Certain word embedding models require millions of variables with just a 10,000 word vocabulary and 300 feature hidden layer. I need to do more investigation into whether this is also a problem for RNN style nets.
- Another problem in my initial investigations was the amount of training data required for vectorization of words. Algorithms like [Word2Vec][word2vec] (Mikolov et. al) partially overcame this problem using negative sampling, but in my limited experience I was unable to create a useful vector space with 32,000 tweets with various rates of negative sampling.
- Subject Based Generation - Will an LSTM based RNN be able to generate a sentence based on several keywords or even a single subject? Sentences do not always start with a subject and are mostly built around it, rather than after it. What about multiple subject words?

[rdbms]: https://en.wikipedia.org/wiki/Relational_database_management_system
[rnn]: https://en.wikipedia.org/wiki/Recurrent_neural_network
[markov-chain]: https://en.wikipedia.org/wiki/Markov_chain
[lstm]: https://en.wikipedia.org/wiki/Long_short-term_memory
[trie]: https://en.wikipedia.org/wiki/Trie
[armchair-expert]: https://github.com/csvance/armchair-expert
[word2vec]: https://en.wikipedia.org/wiki/Word2vec
