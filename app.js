


//Module dependencies
var cheerio = require('cheerio') //html parser using jquery syntax
var scrapper = require('./scraper.js') //where the 'scrapper' funciton is
var urlparse = require('url');
var express = require('express')
	, stylus = require('stylus')
	, nib = require('nib');
var app =express();
app.use(express.bodyParser());
function compile(str,path){
	return stylus(str)
		.set('filename',path)
		.use(nib());
}
app.set('views',__dirname+'/views');
app.set('view engine','jade');
app.use(stylus.middleware(
	{
	src: __dirname+'/public'
	, compile:compile
}));
app.use(express.static(__dirname+'/public'));

app.get('/',function(req,res,next){
	scrapper(false,'http://news.ycombinator.com',function(err,result){
		if (err){
			return next(err);
		}else{
			res.render('index',
			{title:"HN Top 30", urls:result}) //this is the basic list of the first 30 urls, hidden but rendered in the dom
		}
		})
		
		
});
app.post('/gethtml',function(req,res,next){
	url = req.body.url; //grab the url to be scraped
	parsedUrl = urlparse.parse(url);
	scrapper(true,url,function(err,resultbod){
			$ = cheerio.load(resultbod);
			$('html').find('script').remove(); //remove nasty scripts
			var csslinks = [];
			var cssstyles = [];
			$('link').each(function(i, element){
				var thislink =  $(this).attr('href');
				var parsedlink = thislink.split('.')
				var relvar = $(this).attr('rel');
				console.log(relvar);
				if(relvar == 'stylesheet'){
					if(urlparse.parse(thislink).protocol){
						csslinks.push(thislink)
					}
					else if(thislink.substring(0,2) == '//'){
						csslinks.push(parsedUrl.protocol+thislink);
					}
					else{
						csslinks.push(parsedUrl.protocol+'//'+parsedUrl.host+thislink);
					}

				}
			})
			$('style').each(function(i, element){
				var thisstyle =  $(this).text();
				cssstyles.push(thisstyle);
				
			})
			//$('a').each(function(i,element){
				//console.log($(this).attr('href'));
				//})
			var justbody = $('body').html();
			//console.log(justbody);
			console.log('done loading article');
			console.log(csslinks);
			res.send({htmldata:justbody,css:csslinks,style:cssstyles});
	});
});



app.listen(3001);