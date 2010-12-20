/**
 * Simplegeo REST service wrapper
 * @author bashwork at gmail dot com
 * @data now
 * @license Steal and be happy
 *
 * http://simplegeo.com/docs/
 */
(function($) {

  /**
   * Default settings for the library
   */
  $.simplegeo = {
    base : 'http://api.simplegeo.com/1.0/',
    format : '.json'
  };

  /**
   * Given a simplegeo feature, break it down to its parts
   * @param feature The feature to convert
   * @returns The converted feature object
   *
   * feature = SG_2MySaPILVQG3MoXrsVehyR_37.215297_-119.663837
   */
  $.simplegeo.convert = function(feature) {
    var pieces = feature.split('_'),
	    trail = pieces[3].split('@'),
		result = {
		  lat  : pieces[2],
		  lon  : trail[0],
		  id   : pieces[1]
	    };

	if (trail.length === 2) {
	  result.time = trail[1];
	}
	return result;
  };

  /**
   * Given a feature id, return the feature's information
   * @param id The feature id to query
   * @param callback The continuation
   * @returns The resulting feature information
   *
   * id = SG_2MySaPILVQG3MoXrsVehyR_37.215297_-119.663837
   */
  $.simplegeo.feature = function(id, callback) {
	var url = [$.simplegeo.base, 'features/', id, $.simplegeo.format].join('');
    $.getJSON(url, callback);
  };

  /**
   * Create a new feature with the given data
   * @param data The feature data to create
   * @param callback The continuation
   * @returns The result of the operation
   */
  $.simplegeo.feature.create = function(data, callback) {
	var url = [$.simplegeo.base, 'places'].join('');
    $.post(url, data, callback, 'json');
  };

  /**
   * Given a feature id, update the feature with the given data
   * @param id The feature id to query
   * @param data The feature data to update
   * @param callback The continuation
   * @returns The result of the operation
   *
   * id = SG_2MySaPILVQG3MoXrsVehyR_37.215297_-119.663837
   */
  $.simplegeo.feature.update = function(id, data, callback) {
	var url = [$.simplegeo.base, 'features/', id, $.simplegeo.format].join('');
    $.post(url, data, callback, 'json');
  };

  /**
   * Given a feature id, suggest that it be removed
   * @param The feature id to remove
   * @param callback The continuation
   * @returns The result of the operation
   *
   * id = SG_2MySaPILVQG3MoXrsVehyR_37.215297_-119.663837
   */
  $.simplegeo.feature.remove = function(id, callback) {
	var url = [$.simplegeo.base, 'features/', id, $.simplegeo.format].join('');
    $.ajax({ type : 'DELETE', url : url, success : callback });
  };

  /**
   * Given an lat,lon return the point's context
   * @param query The lat,lon to search for
   * @param callback The continuation
   * @returns The resulting lat,lon context
   *
   * query = {
   *   lat : 12.34,
   *   lon : 12.34,
   * }
   */
  $.simplegeo.context = function(query, callback) {
	var position = [query.lat, query.lon].join(','),
	    url = [$.simplegeo.base, 'context/', position, $.simplegeo.format].join('');
    $.getJSON(url, callback);
  };

  /**
   * query = {
   *   lat      : 12.34,
   *   lon      : 12.34,
   *   q        : search term (optional),
   *   category : category filter (optional),
   * }
   */
  $.simplegeo.search = function(query, callback) {
	var position = [query.lat, query.lon].join(','),
	    url = [$.simplegeo.base, 'places/', position, $.simplegeo.format].join(''),
		params = $.extract(query, ['q', 'category']);
    $.getJSON(url, params, callback);
  };

  /**
   * query = {
   *   lat  : 12.34,
   *   lon  : 12.34,
   *   day  : [mon,tue,wed,thu,fri,sat,sun],
   *   hour : (optional),
   * }
   */
  $.simplegeo.density = function(query, callback) {
	var position = [query.lat, query.lon].join(','),
	    time = [query.day, query.hour ? query.hour + '/' : '']
	    url  = [$.simplegeo.base, 'density/', time, position, $.simplegeo.format].join('');
    $.getJSON(url, callback);
  };

  /**
   * Given an ip address, lookup its location
   * @param ip The ip to find the location of
   * @param callback The continuation
   * @returns The resulting ip address' geocode
   *
   * ip = 10.10.10.10
   */
  $.simplegeo.locate = function(ip, callback) {
	var url = [$.simplegeo.base, 'locate/', ip, $.simplegeo.format].join('');
    $.getJSON(url, callback);
  };

  /**
   * Given an lat,lon find the nearest addresses
   * @param query The lat,lon to search for
   * @param callback The continuation
   * @returns The resulting lat,lon addresses
   *
   * query = {
   *   lat : 12.34,
   *   lon : 12.34,
   * }
   */
  $.simplegeo.nearby = function(query, callback) {
	var position = [query.lat, query.lon].join(','),
	    url = [$.simplegeo.base, 'nearby/address/', position, $.simplegeo.format].join('');
    $.getJSON(url, callback);
  };

})(jQuery);
