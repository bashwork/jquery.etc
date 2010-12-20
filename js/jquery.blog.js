/*
 * wrapper for the tripme api
 *
 * @author: bashwork at gmail dot com
 * @date: right about now
 * @license: steal and be glad
 */
(function($) {

  var base = "/api/v1/";
  var helper = function(root) {
    var step = base + root + '/';

    return {
      all : function(callback) {
        $.getJSON(step, callback);
      },
      get : function(query, callback) {
        $.getJSON(step + 'show/' + query + '/', callback);
      },
      search : function(query, callback) {
        $.getJSON(step + 'search/' + query + '/', callback);
      },
      remove : function(query, callback) {
        $.ajax({
          type     : 'DELETE',
          url      : step + 'show/' + query + '/',
          success  : callback
        });
      }
    };
  }

  function markup(data, callback) {
    $.post(base + 'markup/', {data : data }, function(result) {
      if (result.length > 0) {
        callback(result.content);
      } else {
        $.debug(result.content);
      }
    }, "json");
  }

  $.tripme = {
    city    : helper("city"),
    country : helper("country"),
    region  : helper("region"),
    user    : helper("user"),
    location: helper("location"),
    guide   : helper("guide"),
    entry   : helper("entry"),
    spot    : helper("spot"),
    markup  : markup
  };

  // one off function for adding a new guide entry
  $.tripme.entry.add = function(query, callback) {
      var url = base + 'guide/show/' + query.guide + '/entry/';
      $.post(url, query.city, callback); 
  };

  // one off function for adding a new guide entry
  $.tripme.entry.get = function(id, callback) {
      var url = base + 'entry/show/' + id + '/spot/';
      $.get(url, callback); 
  };

  // one off function for adding a new guide entry
  $.tripme.spot.add = function(query, callback) {
      var url = base + 'entry/show/' + query.id + '/spot/';
      $.post(url, query.spot, callback); 
  };

})(jQuery);
