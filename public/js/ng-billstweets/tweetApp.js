var ngBBTweets = angular.module("ngBBTweets", ['ngResource', ], function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	});

ngBBTweets.factory("Tweets", function($resource){
	return {
		tweets : $resource("/tweets-api/tweets/:tweets"),
		countPositive: $resource("/tweets-api/count/positive"),
		countNegative: $resource("/tweets-api/count/negative"),
        countTotal: $resource("/tweets-api/count/total")
	}
});

ngBBTweets.factory("socket", function($rootScope, $timeout){
	var socket = io.connect();
	return {
		on:function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		}
	};
});

ngBBTweets.controller("countCtrl", function countCtrl($scope, Tweets, socket){
	
	$scope.tweets = []; 
	$scope.tweets = Tweets.tweets.query({tweets:10});

	$scope.countPositive = Tweets.countPositive.get();
 	$scope.countNegative = Tweets.countNegative.get();
 	$scope.countTotal = Tweets.countTotal.get();

 	socket.on('send:count', function(data){
 		$scope.countTotal =  JSON.parse(data.count);
 	});
});