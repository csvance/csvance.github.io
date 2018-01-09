var hostname = "https://csvance.github.io";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Hello World!",
      category: null,
      content: "Hi, and welcome to my portfolio.\n",
      tags: [],
      id: 0
    });
    


var store = [{
    "title": "Hello World!",
    "link": "/update/hello-world.html",
    "image": null,
    "date": "December 9, 2017",
    "category": null,
    "excerpt": "Hi, and welcome to my portfolio.\n"
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