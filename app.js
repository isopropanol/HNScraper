


//Module dependencies
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
	scrapper('http://news.ycombinator.com',function(err,result){
		if (err){
			return next(err);
		}
		console.log(result);
		res.render('index',
		{title:"Hoos Working Where", data:result})
	});
	
})

app.listen(3001);