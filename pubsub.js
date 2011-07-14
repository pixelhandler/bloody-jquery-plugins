// check namespaces
if (!window.PXHLR) { var PXHLR = {}; }
/**
 * PXHLR Pub/Sub - callback system
 * fork based on jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)
 * https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
 * Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.
 * Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
 * http://dojofoundation.org/license for more information.
 */
(function(j$){

// the topic/subscription hash
var cache = {};

PXHLR.publish = function(/* String */topic, /* Array? */args){
	// summary: 
	//		Publish some data on a named topic.
	// topic: String
	//		The channel to publish on
	// args: Array?
	//		The data to publish. Each array item is converted into an ordered
	//		arguments on the subscribed functions. 
	//
	// example:
	//		Publish stuff on '/some/topic'. Anything subscribed will be called
	//		with a function signature like: function(a,b,c){ ... }
	//
	//	|		PXHLR.publish("/some/topic", ["a","b","c"]);
	var i = 0;
	if(cache[topic]){
		for(i; i < cache[topic].length; i++){
			try {
				cache[topic][i].apply(j$, args || []);
			} catch (e) {
				if (console) console.warn(e);
			}
		}
	}
};

PXHLR.subscribe = function(/* String */topic, /* Function */callback){
	// summary:
	//		Register a callback on a named topic.
	// topic: String
	//		The channel to subscribe to
	// callback: Function
	//		The handler event. Anytime something is PXHLR.publish'ed on a 
	//		subscribed channel, the callback will be called with the
	//		published array as ordered arguments.
	//
	// returns: Array
	//		A handle which can be used to unsubscribe this particular subscription.
	//	
	// example:
	//	|	PXHLR.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
	//
	if(!cache[topic]){
		cache[topic] = [];
	}
	cache[topic].push(callback);
	return [topic, callback]; // Array
};

PXHLR.unsubscribe = function(/* Array */handle){
	// summary:
	//		Disconnect a subscribed function for a topic.
	// handle: Array
	//		The return value from a PXHLR.subscribe call.
	// example:
	//	|	var handle = PXHLR.subscribe("/something", function(){});
	//	|	PXHLR.unsubscribe(handle);
	
	var t = handle[0];
	cache[t] && j$.each(cache[t], function(idx){
		if(this === handle[1]){
			cache[t].splice(idx, 1);
		}
	});
};

})(jQuery);
/*
Usage example:
(function(){
    var channel = "/PXHLR/Pub/Sub";
    function subscriptionHander () { 
        var foo = {};
        log("msg received on channel: " + channel + " ...");
        foo.baz = arguments[0];
        log("arguments[0] stored on object..." + foo.baz);
    }
    PXHLR.subscriber = PXHLR.subscribe(channel, subscriptionHander);
    PXHLR.publish(channel, ["my args"]);
    PXHLR.unsubscribe([channel, subscriptionHander]);
    PXHLR.publish(channel, ["log subscriber cancelled message, not received"]);
}());
*/