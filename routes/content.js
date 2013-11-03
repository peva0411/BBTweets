var TweetsDAO = require('../tweets').TweetsDAO;


//must be constructed with a connected db
function ContentHandler(db){
	var tweets = new TweetsDAO(db);

	this.displayMainPage = function(req, res, next){
	  "use strict";
       return res.render('welcome',{}); 
	}

	this.displayCount = function(req, res, next){
		"use strict";
		var sentimentStatus = req.params.sentimentStatus || "total";
		tweets.getTweetCount(sentimentStatus, function(err, results){
			if (err) return next(err);

			return res.json({count:results});
		});
	}

	this.displayTweets = function(req , res, next){
		"use strict";
		var numTweets = req.params.tweets;
		var skipTweets = req.params.skip;
		var startDate = new Date(req.params.year, req.params.month, req.params.day, req.params.hours, req.params.minutes, req.params.seconds);
		console.log(startDate);
		tweets.getTweets(numTweets, skipTweets, startDate, function(err, results){
		   if (err) return next(err);

		   return res.json(results);
		  });
	}

	this.displayTweetsByMilli = function(req, res, next){
		"use strict";

		var numTweets = req.params.tweets;
		var skipTweets = req.params.skip;
		var startDate = new Date(parseInt(req.params.milli));
		console.log(startDate);
		tweets.getTweets(numTweets, skipTweets, startDate, function(err, results){
		   if (err) return next(err);

		   return res.json(results);
		  });
	}

	this.getTweet = function(req, res, next){
		"use strict";

		tweets.getTweet(req.params.id, function(err, results){
			if (err) return next(err);

			return res.json(results);
		});
	}

	this.getUserTweets = function(req, res, next){
		"use strict";

		tweets.getUserTweets(req.params.id, function(err, results){
			if (err) return next(err);

			return res.json(results);
		});
	}

}

module.exports = ContentHandler;
