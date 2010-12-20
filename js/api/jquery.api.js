/*
 * wrapper for the geonames api
 * http://www.geonames.org/
 *
 * @author: bashwork at gmail dot com
 * @date: right about now
 * @license: steal and be glad
 */
(function($) {

  var base = "http://ws.geonames.org/";

  function _build(name)
  {
    return function(query, callback) {
      $.getJSON(base + name + '?callback=?',
        $.extend({}, $.geonames.options, { q : query }), callback);
    };
  }

  $.geonames = {

    /**
     * member fields
     */
    options : {
      style        : 'full',
      maxRows      : 10,
      featureClass : 'P'
    },

    /**
     * public api
     */
    search    : _build('searchJSON'),
    wikipedia : _build('wikipediaSearchJSON'),
    postal    : _build('postalCodeSearchJSON'),
    weather   : _build('findNearByWeatherJSON')
  };

})(jQuery);

/*
 * wrapper for the gowalla api
 * http://gowalla.com/api/explorer
 *
 * @author: bashwork at gmail dot com
 * @date: right about now
 * @license: steal and be glad
 */
(function($) {

  var base = "/api/v1/proxy/gowalla/";
  //var base = "http://api.gowalla.com";

  $.gowalla = {

    options : {
      radius : 50
    }
  };

  $.gowalla.spot = {

    /**
     * gowalla spot searching methods
     * query { lat, lng, radius }
     */
    search : function(query, callback) {
      $.getJSON(base + 'spots?callback=?',
        $.extend({}, $.gowalla.options, query), callback);
    },

    /**
     * gowalla spot searching methods
     * @id The spot to get information for
     */
    get : function(id, callback) {
      $.getJSON(base + 'spots/' + id + '?callback=?',
        callback);
    }
  };

  $.gowalla.user = {
    /**
     * gowalla uesr top spot methods
     * @user The user to get top spots for
     */
    spots : function(user, callback) {
      $.getJSON(base + 'users/' + user + '/top_spots?callback=?',
        callback);
    }
  };

  $.gowalla.trip = {
    /**
     * gowalla trips search method
     */
    all : function(callback) {
      $.getJSON(base + 'trips?callback=?',
        callback);
    },

    /**
     * gowalla trips search method
     * @id The trip to get information for
     */
    get : function(id, callback) {
      $.getJSON(base + 'trips/' + id + '?callback=?',
        callback);
    }
  };

  $.gowalla.category = {

    /**
     * gowalla category searching methods
     */
    all : function(callback) {
      $.getJSON(base + 'categories?callback=?',
        callback);
    },

    /**
     * gowalla category searching methods
     */
    get : function(id, callback) {
      $.getJSON(base + 'categories/' + id + '?callback=?',
        callback);
    }
  };

})(jQuery);


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
