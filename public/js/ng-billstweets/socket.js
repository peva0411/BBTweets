angular.module('tweet.socket-io', [])
.factory('socket', function($rootScope){
	var socket = io.connect();
	return {
		on:function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					if (callback){
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});