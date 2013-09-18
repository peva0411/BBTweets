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
		tweets.getTweets(numTweets, function(err, results){
		   if (err) return next(err);

		   return res.json(results);
		  });
	}	
}

module.exports = ContentHandler;
