var ngBBTweets = angular.module("ngBBTweets", ['ngResource',"tweet.socket-io", 'infinite-scroll'], function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	});

ngBBTweets.config(['$routeProvider', 
	function($routeProvider){
		$routeProvider.when('/tweets',{
			templateUrl : 'js/ng-billstweets/partials/tweet-list.html',
			controller: 'countCtrl'
		}).
		when('/tweets/:tweetId', {
			templateUrl : 'js/ng-billstweets/partials/tweet-detail.html',
			controller : 'tweetDetailCtrl'
		}).
		otherwise({
			redirectTo: '/tweets'
		});
	}])

ngBBTweets.factory("Tweets", function($resource){
	return {
		tweet: $resource("/tweets-api/tweets/:id"),
		tweets : $resource("/tweets-api/tweets/:tweets/:skip/:milli"),
		countPositive: $resource("/tweets-api/count/positive"),
		countNegative: $resource("/tweets-api/count/negative"),
        countTotal: $resource("/tweets-api/count/total")
	}
});

ngBBTweets.directive("tweetText", function(){
	
	var validElement = angular.element("<div><p>[[tweet.text]]</p></div>")

	return {
		restrict:"E",
		replace: true,
		template:'<div><p>[[tweet.text]]</p></div>',
		link: function(scope, element, attrs){
			attrs.$observe('tweet', function(tweet){
				scope.tweet = tweet;
				// var tweetWords = scope.tweet.text.split(" ");
				
				// angular.forEach(tweetWords, function(word){
				// 	var newElement = angular.element('<span class="label label-success">' + word + '</span>');
				// 	element.childern(1).append(newElement);
				// });
			});
		}
	};
});

ngBBTweets.controller("tweetDetailCtrl", function tweetDetailCtrl($scope,$routeParams, Tweets){
	$scope.tweetId = $routeParams.tweetId

	$scope.tweet = Tweet.
});

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
		var milliTime = $scope.startDate.getTime();
		$scope.current = 0;
		$scope.difference = 0;
		$scope.countInit.count = $scope.countTotal.count;
		$scope.tweets = Tweets.tweets.query({tweets:$scope.count, skip:$scope.current, 
		 	  milli: milliTime});
	}

	$scope.needRefresh = function(){
		return ($scope.difference > 1);
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