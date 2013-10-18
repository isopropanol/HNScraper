


//Module dependencies
var cheerio = require('cheerio') //html parser using jquery syntax
var scrapper = require('./scraper.js') //where the 'scrapper' function is
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
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
app.get('/',function(req,res){
	scrapper(false,'http://news.ycombinator.com',function(err,result){
		if (err){
			return next(err);
		}else{
			res.render('index',
			{title:"HN Top 30", urls:result}) //this is the basic list of the first 30 urls, hidden but rendered in the dom
		}
		})
		
		
});
app.post('/gethtml',function(req,res){
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

app.get('/datadog/dog.json',function(req,res){
	scrapper(false,'http://news.ycombinator.com',function(err,result){
		if (err){
			return next(err);
		}else{
			console.log('this is a request');
			res.send(result); //this is the basic list of the first 30 urls, hidden but rendered in the dom
		}
		})
		
		
});
app.get('/data/dog.json',function(req,res){
	scrapper(false,'http://news.ycombinator.com',function(err,result){
		if (err){
			return next(err);
		}else{
			console.log('a request!');
			 res.header("Access-Control-Allow-Origin", "*");
  			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			res.send([{
    "dog_id": 1,
    "name": "First dog",
    "description": "This is awesome."
  },
  {
    "dog_id": 2,
    "name": "Second dog",
    "description": "This is also okay."
  }]); //this is the basic list of the first 30 urls, hidden but rendered in the dom
		}
		})
		
		
});

var port = process.env.PORT || 3001;

app.listen(port, function() {
  console.log("Listening on " + port);
});