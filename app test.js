var express = require( "express" );
var http = express();
var port = 1234;

http.configure( function (){

	this .use(express.cookieParser());
	this .use(express.session({secret : "@5%skdg" }));
});

http.listen(port);

http.get( "/" , function (req, res){

	req.session.cookie.maxAge = 5000;
	req.session.test = "Hello" ;
	req.session.test2 = "Hello2" ;
	if (req.session.test && req.session.test2){
		console.log(req.session.test);
		console.log(req.session.test2);
	}
	res.redirect( "/logout" );
});

http.get( "/logout" , function (req, res){
	req.session.destroy( function (error){
		res.send( "Delete Session" );
	});
});



console.log( "start express server" );