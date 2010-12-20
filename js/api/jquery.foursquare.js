/*
 * wrapper for the foursquare api
 * http://groups.google.com/group/foursquare-api/web/api-documentation
 *
 * @author: bashwork at gmail dot com
 * @date: right about now
 * @license: steal and be glad
 */
(function($) {

  $.foursquare = {};
  var base = "/api/v1/proxy/foursquare/";
  //var base = "https://api.foursquare.com/v1/";
  var options = { l : 30 };

  function get_size(size) {
    switch(size) {
      case 's' : return '.png'     // small
      case 'm' : return '_64.png'  // medium
      case 'l' : return '_256.png' // large
      default  : return '.png'     // small
    }
  }

  function convert_options(query)
  {
    var result = {
      geolat  : query.lat,
      geolong : query.lng
    };
    if (query.search) {
      result.q = query.search;
    }
    return result;
  }

  $.foursquare.venue = {
    /**
     */
    get : function(id, callback) {
      $.getJSON(base + 'venue.json?callback=?',
        { vid : id }, callback);
    },

    /**
     */
    search : function(query, callback) {
      $.getJSON(base + 'venues.json?callback=?',
        $.extend({}, options, convert_options(query)), callback);
    }
  };

  $.foursquare.tips = {
    /**
     */
    near : function(query, callback) {
      $.getJSON(base + 'tips.json?callback=?',
        $.extend({}, options, convert_options(query),
          { filter : 'nearby' }), callback);
    }
  };

  /**
   * The category images come in different sizes:
   * _64.png
   * _256.png
   */
  $.foursquare.categories = function(callback) {
    //$.getJSON(base + 'categories.json?callback=?', callback);
    $.getJSON('/static/cache/categories.json', callback);
  };

  /**
   */
  $.foursquare.test = function(callback) {
    $.getJSON(base + 'test.json?callback=?', callback);
  };

})(jQuery);
