var ngBBTweets = angular.module("ngBBTweets", ['ngResource',"tweet.socket-io"], function($interpolateProvider){
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

// ngBBTweets.factory("socket", function($rootScope, $timeout){
// 	var socket = io.connect();
// 	return {
// 		on:function(eventName, callback){
// 			socket.on(eventName, function(){
// 				var args = arguments;
// 				$rootScope.$apply(function(){
// 					if (callback){
// 						callback.apply(socket, args);
// 					}
// 				});
// 			});
// 		},
// 		emit: function(eventName, data, callback){
// 			socket.emit(eventName, data, function(){
// 				var args = arguments;
// 				$rootScope.$apply(function(){
// 					if (callback){
// 						callback.apply(socket, args);
// 					}
// 				});
// 			});
// 		}
// 	};
// });

ngBBTweets.controller("countCtrl", function countCtrl($scope, Tweets, socket){
	
	$scope.tweets = []; 
	$scope.tweets = Tweets.tweets.query({tweets:10});

	$scope.countPositive = Tweets.countPositive.get();
 	$scope.countNegative = Tweets.countNegative.get();
 	$scope.countTotal = Tweets.countTotal.get();

 	socket.on('send:count', function(data){
 		console.log("Total count Updated: " + JSON.parse(data.count));
 		$scope.countTotal = {};
 		$scope.countTotal = {"count":data.count};
 	});

 	socket.on('send:countNegative', function(data){
 		console.log("Negative Tweet Count Updated: " + data.count);
 		$scope.countNegative = {};
 		$scope.countNegative = {"count":data.count};
 	});

 	socket.on('send:countPositive', function(data){
 		console.log("Positive Tweet Count Updated: " + data.count);
 		$scope.countPositive = {};
 		$scope.countPositive = {"count":data.count};
 	});
});