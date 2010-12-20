/*
 * global flag for jquery logging
 */
window.DEBUG = true;

/**
 * Logs the passed in message to the browser log. This
 * will support chrome as well as firebug while right
 * now defaulting to just not logging the messages.
 *
 * The difference between this and every other logger
 * wrapping implementation, is that this one maintains
 * varags so that you can implement format string log
 * messages ("my %s is %s", "name", "john").
 *
 * Also, logging can be enabled or disabled by calling:
 * $.log.disable, $.log.enable, or by setting the global
 * window.DEBUG flag to true or false.
 */
(function($) {
  var $this  = {},
      levels = ['debug', 'error', 'info', 'warn'];

  /**
   * A helper method to convert single entries to
   * an array.
   * @param request The request to convert
   * @return The requested levels
   */
  function convert(request) {
	var disabled = levels;

	if (typeof request  === 'string') {
	  disabled = [request];
	} else if ($.isArray(request)) {
	  disabled = request;
	}
    return disabled;
  }

  /**
   * Enable all or partial logging levels
   * @param request The levels to enable (optional)
   *
   * - these can be a single string 'debug'
   * - or an array ['debug', 'warn']
   * - or left empty which will enable all levels
   */
  function enable(request) {
    if (window.console && window.console.log) {
      $.each(convert(request), function(_, level) {
	  if (levels.indexOf(level) >= 0) {
	      var method = window.console[level] || window.console.log;
	      $this[level] = function() { method.apply(console, arguments); }
	    }
      });
    } else {
      // some fallback
    }
	return true;
  };

  /**
   * Disable all or partial logging levels
   * @param request The levels to disable (optional)
   *
   * - these can be a single string 'debug'
   * - or an array ['debug', 'warn']
   * - or left empty which will enable all levels
   */
  function disable(request) {

    $.each(convert(request), function(_, level) {
	  if (levels.indexOf(level) >= 0) {
        $this[level] = function() {};
	  }
    });
	return true;
  };

  /**
   * function main
   */
  if (!$) { return; } /* if jquery isn't loaded */
  window.DEBUG ? enable(levels) : disable(levels);

  /**
   * Public logger interface
   */
  $.log = $.extend($this, {
    enable  : enable,
    disable : disable
  });

  /**
   * This loops through each jquery item and logs it
   * @param this Loops through each instance in this and logs it
   */
  $.fn.log = function() {
    return this.each(function() {
      $.log.debug(this);
    });
  };

})(jQuery);
