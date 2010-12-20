/**
 * A collection of random jquery functions that I
 * found helpful.
 */
(function($) {
  if (!$) { return; } /* if jquery isn't loaded */

  /**
   * Given a dictionary, extract each key from keys and
   * create a new filtered dictionary. If keys is a dict,
   * then this extracts each key and store it in value.
   *
   * @param dict The dictionary to convert
   * @param keys The keys to extract
   * @returns The filtered dictionary
   */
  $.extract = function(dict, keys) {
    var result = {}, query = {};
  
    if ($.type(keys) === 'array' && $.type(dict) !== 'array') {
  	$.each(keys, function(_,key) { query[key] = key; });
    } else { query = keys; }
  
    $.each(keys, function(key,val) {
      if (dict[key]) { result[val] = dict[key]; }
    });
  
    return result;
  };
  
  
  /**
   * This redirects a user to the supplied page
   * @param url The page to send the user to
   * @param timeout An optional amount of time to wait
   */
  $.redirect = function(url, timeout) {
    setTimeout(function() {
      window.location = url;
    }, !timeout ? 0 : timeout);
  };
  
/**
 * Logs the passed in message to the browser log
 * @param message The message to log to the browser log
 * @param url The uri to retrieve the templates from
 */
  if (!$.tmpl) return;
  $.tmpl.load = function(entries, url) {
    if (typeof entries === 'string') { entries = [entries]; }
    $.get(url, function(data) {
      $(data).appendTo('body');
      $.each(entries, function(idx, entry) {
        $('#' + entry).template(entry);
      });
      $.tmpl.loaded = true;
    });
  };

)(jQuery);
