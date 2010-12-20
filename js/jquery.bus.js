/**
 * @summary A quick bus hacked on top of jQuery's events framework
 * @author bashwork at gmail dot com
 * @license Steal and be happy
 *
 * http://api.jquery.com/category/events/
 */
(function($) {
  if (!$) { return; } // no jquery 
  var $this = $(this);

  /**
   * Bind another callback to the specified event
   * @param event The event to subscribe to
   * @param callback The function to call on the event
   *
   * $.subscribe('user-delete', inform_user);
   * $.publish('user-delete');
   */
  $.subscribe : function(event, callback) {
    $this.bind(event, callback);
  },
  
  /**
   * Trigger a new event occurrance
   * @param event The event to trigger
   * @param args Any additional arguments to publish
   *
   * $.subscribe('user-delete', inform_user);
   * $.publish('user-delete');
   */
  $.publish : function(event, args) {
    $this.trigger(event, args);
  }

})(jQuery);
