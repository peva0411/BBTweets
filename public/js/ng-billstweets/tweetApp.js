var ngBBTweets = angular.module("ngBBTweets", ['ngResource',"tweet.socket-io", 'infinite-scroll'], function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	});

ngBBTweets.factory("Tweets", function($resource){
	return {
		tweets : $resource("/tweets-api/tweets/:tweets/:skip/:year/:month/:day/:hours/:minutes/:seconds"),
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
	
	$scope.count = 10;
	$scope.current = 0;
	$scope.startDate = new Date();
	$scope.tweets = []; 
	$scope.busy = false;
	// $scope.tweets = Tweets.tweets.query({tweets:$scope.count, skip:$scope.current}, function(){
	// 	$scope.current += $scope.count;
	// });

	$scope.loadMore = function(){
		 if ($scope.busy)return;
		 $scope.busy = true;
		 var updateTweets = Tweets.tweets.query({tweets:$scope.count, skip:$scope.current, 
		 	  year:$scope.startDate.getUTCFullYear(), 
		 	  month:$scope.startDate.getUTCMonth(),
		 	  day:$scope.startDate.getUTCDate(),
		 	  hours:$scope.startDate.getUTCHours(),
		 	  minutes:$scope.startDate.getUTCMinutes(),
		 	  seconds:$scope.startDate.getUTCSeconds()}, function(){
			//console.log(updateTweets);
			var newTweets = $scope.tweets.concat(updateTweets);
			updateTweets = [];
			$scope.tweets = newTweets;
			$scope.current += $scope.count;
			$scope.busy = false;
		});
	};

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