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
