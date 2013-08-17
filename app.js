var nodeio = require('node.io'), options = {timeout:10};
exports.job = new nodeio.Job({
    input: false,
    run: function () {
        //var url = this.options.args[0];
        var url = "http://news.ycombinator.com";
        this.getHtml(url, function(err, $) {
        	var stories = [];
            $('td.title a').each(function(title){
            	stories.push(title.text);
            });
            this.emit(stories);
        });
    }
});