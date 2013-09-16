var ngBBTweets = angular.module("ngBBTweets", ['ngResource'], function($interpolateProvider){
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

ngBBTweets.controller("countCtrl", function countCtrl($scope, Tweets){
	
	$scope.tweets = []; 
	$scope.tweets = Tweets.tweets.query({tweets:10});

	$scope.countPositive = Tweets.countPositive.get();
 	$scope.countNegative = Tweets.countNegative.get();
 	$scope.countTotal = Tweets.countTotal.get();

});

