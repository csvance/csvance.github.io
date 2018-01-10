var hostname = "https://csvance.github.io";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Portfolio",
      category: null,
      content: "armchair-expert\n\n  Chatbot which uses several different types of machine learning to generate hilarious and surprisingly relevant responses to queries\n  Uses NLP to select the most optimal subjects for which to generate a response\n  \n    Learns new words in realtime like a typical Markov chain, but uses an RNN to structure and capitalize the output\n  \n  Github\n    LilTrumpyAI\n  \n  armchair-expert trained with all of Donald Trump’s tweets\n  Tweet or DM @LilTrumpyAI on Twitter\n    ML Models\n    Sentence Structure and Style Model\n  \n  Recurrent Neural Network with learns sentence structure and capitalization style\n  Multiple Classification\n  Can be used to generate a structure without being seeded with an initial sequence\n  Implemented in Keras\n  Github\n    Positional Vector Markov Chain\n  \n  Custom Markov Chain database which stores positional frequencies of word bi-grams\n  Each generated word is effected by n words around it, where n is the window size\n  Github\n\n\n",
      tags: [],
      id: 0
    });
    


var store = [{
    "title": "Portfolio",
    "link": "/portfolio.html",
    "image": null,
    "date": "January 9, 2018",
    "category": null,
    "excerpt": "armchair-expert Chatbot which uses several different types of machine learning to generate hilarious and surprisingly relevant responses to queries Uses..."
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