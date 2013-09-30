var ngBBTweets = angular.module("ngBBTweets", ['ngResource',"tweet.socket-io", 'infinite-scroll'], function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	});

ngBBTweets.factory("Tweets", function($resource){
	return {
		tweets : $resource("/tweets-api/tweets/:tweets/:skip/:milli"),
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
	$scope.countInit = {count: 0};
	$scope.count = 10;
	$scope.current = 0;
	$scope.startDate = new Date();
	$scope.tweets = []; 
	$scope.busy = false;
	$scope.difference = 0;
	// $scope.tweets = Tweets.tweets.query({tweets:$scope.count, skip:$scope.current}, function(){
	// 	$scope.current += $scope.count;
	// });

	$scope.loadMore = function(){
		 if ($scope.busy)return;
		 $scope.busy = true;
		 var milliTime = $scope.startDate.getTime();
		 var updateTweets = Tweets.tweets.query({tweets:$scope.count, skip:$scope.current, 
		 	  milli: milliTime}, function(){
			//console.log(updateTweets);
			var newTweets = $scope.tweets.concat(updateTweets);
			updateTweets = [];
			$scope.tweets = newTweets;
			$scope.current += $scope.count;
			$scope.busy = false;
		});
	};

	$scope.refreshTweets = function(){
		$scope.startDate = new Date();
		$scope.difference = 0;
		$scope.countInit.count = $scope.countTotal.count;
		$scope.loadMore();
	}

	$scope.countPositive = Tweets.countPositive.get();
 	$scope.countNegative = Tweets.countNegative.get();
 	$scope.countTotal = Tweets.countTotal.get({}, function(){
 		$scope.countInit.count = $scope.countTotal.count;
 	});
 	//$scope.countInit.count = $scope.countTotal.count;
 	
 	socket.on('send:count', function(data){
 		
 		$scope.countTotal.count = data.count;
 		$scope.difference = data.count - $scope.countInit.count;

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