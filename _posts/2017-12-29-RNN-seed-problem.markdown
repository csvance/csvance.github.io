---
layout: post
title:  "The RNN Sequence Prediction Seed Problem and How To Solve It"
date:   2017-12-29 12:04:00 -0600
author: Carroll Vance
categories: update keras rnn lstm sequence generation ml
---
## The Problem
There are many [tutorials][mlm] on how to create [Recurrent Neural Networks][rnn] and use them for sequence generation. However, most of these tutorials show an example where an initial seed value must be used to start the generation process. This is highly impractical for generating small and frequent sequences. Luckily, there is a fairly easy way to solve this involving how we format our training data.

## Solution
### Empty Item
First of all, we need to make sure we have a dummy value which represents an empty sequence item. It is convenient to use zero for this, because most padding functions are going to pad with zeros, and functions like np.zeros make it easy to initialize this. We will represent this value as NULL for simplicity.
### End of Sequence Item
We need a second special value for marking the end of a sequence. Call it EOS for short, and it can be whatever value you want provided it stays consistent.
### Sequence Steps
Instead of feeding entire sequences for training, we are going to step through each sequence, generating subsequences starting with all empty values and adding one more item in each step. The label for each sequence will simply be the next word in the sequence, or <EOS> if we reach the end of the sequence. For example, take the sequence "The quick brown fox jumps over the lazy dog. This will break down into the following sequences:
<pre><code class="python">
"NULL NULL NULL NULL NULL NULL NULL NULL NULL" -> The
"The NULL NULL NULL NULL NULL NULL NULL NULL" -> quick
"The quick NULL NULL NULL NULL NULL NULL NULL" -> brown
"The quick brown NULL NULL NULL NULL NULL NULL" -> fox
"The quick brown fox NULL NULL NULL NULL NULL" -> jumps
"The quick brown fox jumps NULL NULL NULL NULL" -> over
"The quick brown fox jumps over NULL NULL NULL" -> the
"The quick brown fox jumps over the NULL NULL" -> lazy
"The quick brown fox jumps over the lazy NULL" -> dog
"The quick brown fox jumps over the lazy dog" -> EOS
</code></pre>
### Sequence Size
If you have a sequence larger than your maximum size, start removing the first element before you append a new one. This will have no bearing on prediction because the network will learn how to handle this.
## Conclusion
We can now train the network and start by feeding it a sequence filled with NULLs to predict the first value. Here is an example doing this using [Keras][keras]:
- [Preprocessing & Model][model]

[mlm]: https://machinelearningmastery.com/text-generation-lstm-recurrent-neural-networks-python-keras/
[keras]: https://keras.io
[model]: https://github.com/csvance/armchair-expert/blob/master/models/structure.py
[rnn]: https://en.wikipedia.org/wiki/Recurrent_neural_network
