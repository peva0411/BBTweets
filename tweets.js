function TweetsDAO(db){
	"use strict";

	if (false === (this instanceof TweetsDAO)){
		console.log('Warning: TweetsDAO constructor called without "new" operator');
	}

	var tweets = db.collection("BillsTweets");

	this.getTweet = function(id, callback){
		tweets.findOne({'id':parseInt(id)}, function(err, result){
			if (err) return callback(err, null);

			callback(err, result);
		});
	}

	this.getUserTweets = function(id, callback){
		//limit 10 for now 
		tweets.find({"user.id":parseInt(id)}).limit(10).toArray(function(err, items){
			if (err) return callback(err, null);

			callback(err, items);
		});
	}

	this.getTweets = function(num, skip, startDate, callback){
		"use strict";
		//var isoStartDate = startDate.toISOString();
		//console.log("ISO Date " + isoStartDate);
		console.log("Date String " + startDate);
		console.log("Num Tweets: " + num + " , Skipped: " + skip + " StartDAte: " + startDate);

		var skipInt = parseInt(skip);
		var numInt = parseInt(num);
		tweets.find({'date':{$lt: startDate}}).sort('date', -1).skip(skipInt).limit(numInt).toArray(function(err, items){
			if (err) return callback(err, null);

			console.log("Found " + items.length + " tweets");

			callback(err, items);
		});
	}

	this.getTweetCount = function(sentimentStatus, callback){
		"use strict";
		var query = {};
		if (sentimentStatus === 'positive'){
		  query = {sentiment:{$gt:0}};
		} else if (sentimentStatus === 'negative'){
			query = {sentiment:{$lt:0}};
		}

		tweets.find(query).count(function(err, result){
			if (err) return callback(err, null);

			console.log("Tweet count: " + result);

			return callback(null, result);
		});
	}
}

module.exports.TweetsDAO = TweetsDAO;