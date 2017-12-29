var hostname = "https://csvance.github.io";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Keras Embedding Layer Shape Problems",
      category: null,
      content: "The Problem\nThe Embedding layer in Keras is a great tool to simplify the formatting of our training data. However, a common issue many people run into is an error message stating that the Dense layer expected a different sized input, where the last dimension is your model’s number of features or classifications. You might think that because we used an embedding layer, we do not have to convert our labels into a “one hot” format, as the embedding layer takes care of this for us. However, this is not the case.\n\nSolution\nLuckily for us, the solution is relatively simple. We just need to convert each item in all sequences to a “one hot” format. Keras makes this easy for us.\n\nfrom keras.utils import np_utils\nlabels = [0, 1, 2, 3, 4]\none_hot_labels = np_utils.to_categorical(labels, num_classes=NUM_CLASSES)\n\nWe now have a “one hot” numpy ndarray which we can use for training purposes!\n\n",
      tags: [],
      id: 0
    });
    

    index.add({
      title: "The RNN Sequence Prediction Seed Problem and How To Solve It",
      category: null,
      content: "The Problem\nThere are many tutorials on how to create Recurrent Neural Networks and use them for sequence generation. However, most of these tutorials show an example where an initial seed value must be used to start the generation process. This is highly impractical for generating small and frequent sequences. Luckily, there is a fairly easy way to solve this involving how we format our training data.\n\nSolution\nEmpty Item\nFirst of all, we need to make sure we have a dummy value which represents an empty sequence item. It is convenient to use zero for this, because most padding functions are going to pad with zeros, and functions like np.zeros make it easy to initialize this. We will represent this value as NULL for simplicity.\nEnd of Sequence Item\nWe need a second special value for marking the end of a sequence. Call it EOS for short, and it can be whatever value you want provided it stays consistent.\nSequence Steps\nInstead of feeding entire sequences for training, we are going to step through each sequence, generating subsequences starting with all empty values and adding one more item in each step. The label for each sequence will simply be the next word in the sequence, or  if we reach the end of the sequence. For example, take the sequence \"The quick brown fox jumps over the lazy dog. This will break down into the following sequences:\n\n\"NULL NULL NULL NULL NULL NULL NULL NULL NULL\" -&gt; The\n\"The NULL NULL NULL NULL NULL NULL NULL NULL\" -&gt; quick\n\"The quick NULL NULL NULL NULL NULL NULL NULL\" -&gt; brown\n\"The quick brown NULL NULL NULL NULL NULL NULL\" -&gt; fox\n\"The quick brown fox NULL NULL NULL NULL NULL\" -&gt; jumps\n\"The quick brown fox jumps NULL NULL NULL NULL\" -&gt; over\n\"The quick brown fox jumps over NULL NULL NULL\" -&gt; the\n\"The quick brown fox jumps over the NULL NULL\" -&gt; lazy\n\"The quick brown fox jumps over the lazy NULL\" -&gt; dog\n\"The quick brown fox jumps over the lazy dog\" -&gt; EOS\n\nSequence Size\nIf you have a sequence larger than your maximum size, start removing the first element before you append a new one. This will have no bearing on prediction because the network will learn how to handle this.\nConclusion\nWe can now train the network and start by feeding it a sequence filled with NULLs to predict the first value. Here are some examples doing this using Keras:\n\n  Preprocessing\n  Training\n  Model\n\n\n",
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
    "title": "Keras Embedding Layer Shape Problems",
    "link": "/update/keras/embedding/rnn/shape/ml/keras-embedding-rnn-label-shape.html",
    "image": null,
    "date": "December 29, 2017",
    "category": null,
    "excerpt": "The Problem The Embedding layer in Keras is a great tool to simplify the formatting of our training data. However,..."
},{
    "title": "The RNN Sequence Prediction Seed Problem and How To Solve It",
    "link": "/update/keras/rnn/lstm/sequence/generation/ml/RNN-seed-problem.html",
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