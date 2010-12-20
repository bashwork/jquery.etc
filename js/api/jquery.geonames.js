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
