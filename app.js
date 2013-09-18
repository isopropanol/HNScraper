


//Module dependencies
var cheerio = require('cheerio')
var scrapper = require('./scraper.js')
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
	var bodys = [];
	scrapper(false,'http://news.ycombinator.com',function(err,result){
		if (err){
			return next(err);
		}else{
			res.render('index',
			{title:"HN Top 30", urls:result})
		}
		})
		
		
});
app.post('/gethtml/0',function(req,res,next){
	url = req.body.url;
	scrapper(true,url,function(err,resultbod){
			$ = cheerio.load(resultbod);
			justbody = $('body').html();
			//console.log(justbody);
			console.log('done loading article');
			res.send({htmldata:justbody});
	});
});



app.listen(3001);