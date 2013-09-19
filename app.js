var express = require("express")
    ,app = express() //web framework
    ,cons = require('consolidate')
    ,MongoClient = require('mongodb').MongoClient //mongo driver
    ,routes = require('./routes')
    ,server = require('http').createServer(app)
    ,io = require('socket.io').listen(server); //routes for application

//connect to mongo instance and db
MongoClient.connect('mongodb://peva0411-ubuntu.cloudapp.net:27017/twitter', function(err,db){
	"use strict";
	if (err) throw err;
	
	//register template engine here
	app.engine('html', cons.swig);
	app.set('view engine', 'html');
	app.use("/styles", express.static(__dirname + '/public/css'));
	app.use("/js", express.static(__dirname + '/public/js'));
	app.set('views', __dirname + '/views');

	//Express middleware to populate 'req.body' so we can access post variables
	app.use(express.bodyParser());
	app.use(express.errorHandler());

	routes(app, db, io);

	var port = process.env.PORT || 1337;
	server.listen(port, function(){
		console.log('Express server listening on port ' + port);
	})
});
