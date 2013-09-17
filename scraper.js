var nodeio = require('node.io');


module.exports = function(isBody,url,callback){
	var stories = [],
		titles = [],
		urls = [],
		bodys = [];
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

				stories.push({url:urls[i],title:titles[i],body:''});
			}
			this.emit(stories);
			});
		}
	});
	var job2 = new nodeio.Job({
		input: [url],
		run: function(url){
			this.get(url, function(err, data) {
			//console.log(url);
			if(err){
				this.exit(err);
			}else{
			
			this.emit(data);
			}
			});
		
		}
	});
	if(isBody){
		nodeio.start(job2,{silent:true},callback,true);
	}else{
	nodeio.start(job,{silent:true},callback,true);
	}
};

