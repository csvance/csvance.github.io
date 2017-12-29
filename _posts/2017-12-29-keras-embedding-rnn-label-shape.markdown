---
layout: post
title:  "Keras Embedding Layer Shape Problems"
date:   2017-12-29 12:22:00 -0600
author: Carroll Vance
categories: update keras embedding rnn shape ml
---
## The Problem
The [Embedding][keras-embedding] layer in [Keras][keras] is a great tool to simplify the formatting of our training data. However, a common issue many people run into is an error message stating that the [Dense][keras-dense] layer expected a different sized input, where the last dimension is your model's number of features or classifications. You might think that because we used an embedding layer, we do not have to convert our labels into a "one hot" format, as the embedding layer takes care of this for us. However, this is not the case.

## Solution
Luckily for us, the solution is relatively simple. We just need to convert each item in all sequences to a "one hot" format. Keras makes this easy for us.
<pre><code class="python">
from keras.utils import np_utils
labels = [0, 1, 2, 3, 4]
one_hot_labels = np_utils.to_categorical(labels, num_classes=NUM_CLASSES)
</code></pre>
We now have a "one hot" numpy ndarray which we can use for training purposes!

[keras-embedding]: https://keras.io/layers/embeddings/
[keras-dense]: https://keras.io/layers/core/#dense
[keras]: https://keras.io
[rnn]: https://en.wikipedia.org/wiki/Recurrent_neural_network
