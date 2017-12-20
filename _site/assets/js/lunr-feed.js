var hostname = "https://csvance.github.io";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Next Steps: Recurrent Neural Networks",
      category: null,
      content: "Over a period of several years I have been gradually developing a Markov chain style chatbot called armchair-expert which is intended to emulate the patterns of speech it sees in chat messages, tweets, or even books over time. From its humble beginnings using a hack-eyed Markov chain engine, to its current fairly powerful yet inefficient RDBMS incarnation, it has been slowly improving over time. Now is the time to make what I think is the next step in accuracy and performance: LSTM based recurrent neural networks. However, there are certain potential problems I have been thinking about which make me hesitate fully committing to this approach when I could just create a trie style Markov chain which would have the same features as the current system with much higher performance.\n\nPotential Problems\n\n  New Words - One reason I have hesitated moving to a word embedding neural network based solution in general was the difficulty incorporating newly encountered words without retraining the entire neural net. In theory however, we can set aside many unused embeddings for this purpose, and train the network in real time when new data is encountered.\n  Performance - Certain word embedding models require millions of variables with just a 10,000 word vocabulary and 300 feature hidden layer. I need to do more investigation into whether this is also a problem for RNN style nets.\n  Another problem in my initial investigations was the amount of training data required for vectorization of words. Algorithms like Word2Vec (Mikolov et. al) partially overcame this problem using negative sampling, but in my limited experience I was unable to create a useful vector space with 32,000 tweets with various rates of negative sampling.\n  Subject Based Generation - Will an LSTM based RNN be able to generate a sentence based on several keywords or even a single subject? Sentences do not always start with a subject and are mostly built around it, rather than after it. What about multiple subject words?\n\n\n",
      tags: [],
      id: 0
    });
    

    index.add({
      title: "Hello World!",
      category: null,
      content: "Hi, and welcome to my portfolio and blog. I will be chronicling my explorations in machine learning, artificial intelligence, and software engineering here.\n",
      tags: [],
      id: 1
    });
    


var store = [{
    "title": "Next Steps: Recurrent Neural Networks",
    "link": "/update/armchair-expert/ml/ai/rnn/lstm/markov/armchair-expert-rnn.html",
    "image": null,
    "date": "December 9, 2017",
    "category": null,
    "excerpt": "Over a period of several years I have been gradually developing a Markov chain style chatbot called armchair-expert which is..."
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