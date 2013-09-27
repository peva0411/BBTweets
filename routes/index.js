var ContentHandler =  require('./content');
var TweetsDAO = require('../tweets').TweetsDAO;

module.exports = exports = function(app, db, io){

	var contentHandler = new ContentHandler(db);

	app.get('/', contentHandler.displayMainPage);

	app.get('/tweets-api/count/:sentimentStatus', contentHandler.displayCount);

	app.get('/tweets-api/tweets/:tweets/:skip/:year/:month/:day/:hours/:minutes/:seconds', contentHandler.displayTweets);

	var connections = 0;

	io.sockets.on('connection', function(socket){
		var tweets = new TweetsDAO(db);

		connections++;

		var sendCount = function(err, data){
			console.log(data);
			socket.emit('send:count', {"count":data})
		};

		var sendPositiveCount = function(err, data){
			socket.emit('send:countPositive', {'count':data});
		};

		var sendNegativeCount = function(err, data){
			socket.emit('send:countNegative', {'count':data});
		};

		socket.on('disconnect', function(){
			console.log('client disconnected');
			connections--;
		});

		setInterval(function(){
			if (connections > 0) 
				tweets.getTweetCount("total", sendCount);
	    }, 10000);

	    setInterval(function () {
	    	if (connections > 0){
	    		tweets.getTweetCount("negative", sendNegativeCount);
	    		tweets.getTweetCount("positive", sendPositiveCount);
	    	}
	    }, 15000);
	});
}
