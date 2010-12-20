/**
 * A quick clone of the dojo bus (based on OpenAjax bus)
 * @author bashwork at gmail dot com
 * @license Steal and be happy
 *
 * http://dojofoundation.org/license for more information.
 * @todo support wildcards for publishing and subscribing
 * - com.*.init -> [com.user.init, com.page.init]
 * - com.user.* -> [com.user.init, com.user.finalize]
 */
(function(namespace){

	// the topic/subscription hash
	var subscriptions = {},
	    guid = 1;

    namespace.hub = {
	  /**
	   * Publish some data on a named topic.
	   * @param topic (string) The channel to publish on
	   * @param message (object) The message to publish
	   *
	   * @example
	   *   var id = $.hub.subscribe('user.save', logger, { id : 12345 });
	   *   $.hub.publish('user.save', 'failed');
	   */
	  publish : function(topic, message) {
	  	if (!subscriptions[topic]) { return; }
	  	for (var idx in subscriptions[topic]) {
	      if (subscriptions[topic][idx].filter(message)) {
            var params = {
		      message    : message,
		      topic      : topic,
		      properties : subscriptions[topic][idx].properties
		    };
		    subscriptions[topic][idx].callback.call(
			  subscriptions[topic][idx].scope, params);
		  }
	  	};
	  },

	  /**
	   * Publish some data on a named topic.
	   * @param topic (string) The channel to publish on
	   * @param callback (function) The callback for the topic
	   * @param properties Additional data to send with every call (optional)
	   * @param scope The scope to call the callback in (optional)
	   * @param filter An message filter to apply before publishing (optional)
	   * @return A unique identifier for this subscription
	   *
	   * The callback function should expect the following message:
	   * data = {
	   *   message : <published message>,
	   *   topic   : <the topic that triggered>,
	   *   properties : <any properties set from the subscribe>,
	   * }
	   *
	   * @example
	   *   var id = $.hub.subscribe('user.save', logger, { id : 12345 });
	   *   $.hub.publish('user.save', 'username');
	   */
	  subscribe : function(topic, callback, properties, scope, filter) {
	  	if (!subscriptions[topic]) {
		  subscriptions[topic] = [];
		}
		var identifier = topic + '.' + guid;

	  	subscriptions[topic].push({
		  callback   : callback,
		  properties : properties || {},
		  filter     : filter || function(_) { return true; },
		  scope      : scope || window,
		  identifier : identifier,
		  id         : guid++
		});
		return identifier;
	  },

	  /**
	   * Disconnect a subscribed function for a topic.
	   * @param identifier (string) The subscription id to disconnect
	   * @param topic (string) Used to remove all matching topics (optional)
	   *
	   * If you have a handle of [topic, callback], that can
	   * be used instead of topic and callback.
	   *
	   * If no callback is specified, all callbacks for the
	   * given topic will be removed.
	   *
	   * @example
	   *   var id = $.hub.subscribe('user.save', logger);
	   *   $.hub.unsubscribe(id);
	   */
	  unsubscribe : function(identifier) {
        var topic = identifier.split('.'),
            id = topic.pop(),
            topic = topic.join('.');
        if (subscriptions[topic]) {
          for(var idx in subscriptions[topic]) {
          	if (subscriptions[topic][idx].identifier === identifier) {
          	  subscriptions[topic].splice(idx, 1);
          	}
          }
        }
	  },

	  /**
	   * Disconnect all subscriptions to the given topic
	   * @param topic (string) The topic to clear all subscriptions for
	   * @return The number of subscriptions that were removed
	   *
	   * @example
	   *   var count = $.hub.clear('user.save');
	   */
	  clear : function(topic) {
		var count = 0;
	  	if (subscriptions[topic]) {
		  count = subscriptions[topic].length;
		  delete subscriptions[topic];
		}
		return count;
	  },

	  /**
	   * Disconnect all subscriptions for every target
	   * @return The number of subscriptions that were removed
	   *
	   * @example
	   *   var count = $.hub.clearAll();
	   */
	  clearAll : function() {
		  var count = 0;
		  for (var idx in subscriptions) {
			count += namespace.hub.clear(idx);
		  }
		  return count;
	  },

      /**
	   * Unit tests for this module
	   * todo Qunit
	   */
	  _test : function() {
		var called = 0,
	        id = namespace.hub.subscribe('org.hub.test', function(m) { called++; });
		namespace.hub.publish('org.hub.test', {});
		console.log(called === 1);

	    namespace.hub.unsubscribe(id);
		namespace.hub.publish('org.hub.test', {});
		console.log(called === 1);

	    namespace.hub.subscribe('org.hub.test', function(m) { called++; });
	    namespace.hub.subscribe('org.hub.test', function(m) { called++; });
	    namespace.hub.subscribe('org.hub.test', function(m) { called++; });
		namespace.hub.publish('org.hub.test', {});
		console.log(called === 4);

		namespace.hub.clear('org.hub.test');
		namespace.hub.publish('org.hub.test', {});
		console.log(called === 4);
	  }
	};

})(jQuery);
