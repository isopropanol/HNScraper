var nodeio = require('node.io');


module.exports = function(url,callback){
	var stories = [],
		titles = [],
		urls = [];
	var job = new nodeio.Job({
		input: [url],
		run: function(url){
			this.getHtml(url, function(err, $) {

			$('td.title a').each('href',function(href){
				urls.push(href);
			});
			$('td.title a').each(function(a){
				titles.push(a.text);
			});
			for (var i = 0;i<urls.length;i++){
				stories.push({url:urls[i],title:titles[i] });
			}
			this.emit(stories);
			})
		}
	});
	nodeio.start(job,{silent:true},callback,true);
};

