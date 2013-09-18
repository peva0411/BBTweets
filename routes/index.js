var ContentHandler =  require('./content');

module.exports = exports = function(app, db, io){

	var contentHandler = new ContentHandler(db);

	app.get('/', contentHandler.displayMainPage);

	app.get('/tweets-api/count/:sentimentStatus', contentHandler.displayCount);

	app.get('/tweets-api/tweets/:tweets', contentHandler.displayTweets);

	
}
