var ContentHandler =  require('./content');
var TweetsDAO = require('../tweets').TweetsDAO;

module.exports = exports = function(app, db, io){

	var contentHandler = new ContentHandler(db);

	app.get('/', contentHandler.displayMainPage);

	app.get('/tweets-api/count/:sentimentStatus', contentHandler.displayCount);

	app.get('/tweets-api/tweets/:tweets', contentHandler.displayTweets);

	io.sockets.on('connection', function(socket){
		var tweets = new TweetsDAO(db);

		var sendCount = function(err, data){
			console.log(data);
			socket.emit('send:count', {"count":data})
		};

		setInterval(function(){
			tweets.getTweetCount("total", sendCount);
	    }, 5000);
	});
}
