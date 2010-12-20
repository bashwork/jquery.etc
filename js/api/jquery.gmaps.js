/**
 * jquery.gmaps v3
 * http://code.google.com/apis/maps/documentation/javascript/basics.html
 *
 * @url     http://www.pittss.lv/jquery/gomap/
 * @author  Galen Collins
 * @version 1.0
 */
(function($) {
 /**
  * If we don't have google maps api loaded, no
  * sense in continuing
  */
 if (!window.google || !window.google.maps) { return; }

 //var Gmaps = function(opts) {
 //  this.options = $.extend({}, $.fn.gmaps.defaults, options);
 //  this.geocoder = new google.maps.Geocoder();
 //};
 var G = {}
 $.gmaps = {};

 $.fn.gmaps = function(options) {

     return this.each(function() {

         var opts = $.extend({}, $.gmaps.defaults, options);
         //var element = $(this);
         //if (element.data('gmaps')) { return; }
         //var plugin = new gmaps(this, opts);
         //element.data('gmaps', plugin);

         G = {
           id      : this,
           options : opts,
           markers : [],
           center  : null
         };
         $.gmaps.init(opts);
     });
 };

 $.gmaps.defaults = {
   center                   : [39.50, -98.35],
   zoom                     : 3,
   maptype                  : 'roadmap',
   disableDoubleClickZoom   : true,
   mapTypeControl           : false,
   streetViewControl        : false,
   mapTypeControlOptions    : {
     style                  : 'default',
     position               : 'top_right'
   },
   navigationControl        : true,
   navigationControlOptions : {
     style                  : 'small',
     position               : 'top_left'
   },
   scaleControl             : false,
   scrollwheel              : true,
   prefix                   : 'gmarker',
   markers                  : []
 };

 /**
  * wrapper around the google maps constants
  */
 var gapi = (function() {

   function get(result, set) {
     return function(value) {
       value = value ? value.toUpperCase() : '';
       return set[value in set ? value : result];
     }
   }
   
   function get_ll(area) {
     return new google.maps.LatLng(area[0], area[1]);
   }

   function get_options(opts) {
     return {
       //center                   : this.centerLatLng,
       disableDoubleClickZoom   : opts.disableDoubleClickZoom,
       streetViewControl        : opts.streetViewControl,
       mapTypeControl           : opts.mapTypeControl,
       mapTypeControlOptions    : {
         style    : gapi.typeStyle(opts.mapTypeControlOptions.style),
         position : gapi.typePosition(opts.mapTypeControlOptions.position)
       },
       mapTypeId                : gapi.mapType(opts.maptype),
       navigationControl        : opts.navigationControl,
       navigationControlOptions : {
         style    : gapi.navStyle(opts.navigationControlOptions.style),
         position : gapi.navPosition(opts.navigationControlOptions.position)
       },
       scaleControl             : opts.scaleControl,
       scrollwheel              : opts.scrollwheel,
       zoom                     : opts.zoom
     };
   }

   var geocoder = new google.maps.Geocoder();

   return {
     animation    : get('DROP', google.maps.Animation),
     mapType      : get('ROADMAP', google.maps.MapTypeId),
     typeStyle    : get('DEFAULT', google.maps.MapTypeControlStyle),
     typePosition : get('TOP_RIGHT', google.maps.ControlPosition),
     navStyle     : get('DEFAULT', google.maps.NavigationControlStyle),
     navPosition  : get('TOP_LEFT', google.maps.ControlPosition),
     latlng       : get_ll,
     options      : get_options,
     geocode      : geocoder.geocode,
     infowindow   : new google.maps.InfoWindow()
   };
 })();

 /**
  */
 $.gmaps.init = function(opts) {
   G.map = new google.maps.Map(G.id, gapi.options(opts));
   $.gmaps.center(opts.center);

   for (var i = 0; i < opts.markers.length; ++i) {
     $.gmaps.mark(opts.markers[i]);
   }

   //$.gmaps.bind('click', function(ev) {
   //  var mark = $.gmaps.mark({
   //    position  : ev.latLng,
   //    draggable : true,
   //  });
   //});
   return this;
 };

 /**
  */
 $.gmaps.update = function(opts) {
   var current = $.extend(G.options, opts);
   G.map.setOptions(gapi.options(current));
   return this;
 }

 /**
  */
 $.gmaps.map = function() { return G.map; }

 /**
  */
 $.gmaps.bind = function(ev, fn, source) {
   google.maps.event.addListener(
     source ? source : G.map, ev, fn);
   return this;
 };

 /**
  */
 $.gmaps.unbind = function(ev, source) {
   google.maps.event.removeListener(
     source ? source : G.map, ev);
   return this;
 };

 /**
  */
 $.gmaps.center = function(area) {
    if ($.isArray(area) && (area.length === 2)) {
      G.center = gapi.latlng(area);
      G.map.setCenter(G.center);
    } else if (typeof area  === 'string') {
      return $.gmaps.geocode(area, $.gmaps.center);
    } else if (G.markers[0]) {
      $.gmaps.center(G.markers[0].area);
    }
   return this;
 };

 function add_info_window(marker)
 {
   $.gmaps.bind('click', function() {
     gapi.infowindow.setContent(marker.content);
     gapi.infowindow.open(G.map, marker);  
   }, marker);
 }

 /**
  * title, visible, id, icon, 
  */
 $.gmaps.mark = function(marker, move) {
    
   if ($.isArray(marker)) {
     return $.each(marker, function(_,m) { $.gmaps.mark(m); });
   }

   if ($.isArray(marker.position) && (marker.position.length === 2)) {
     marker.position = gapi.latlng(marker.position);
   } else if (marker.position && marker.position.lat && marker.position.lng) {
     // looks good to me
   } else if (typeof(marker.position) === 'string') {
     return $.gmaps.geocode(marker.position, function (po) {
       $.gmaps.mark($.extend(marker, { position: po }), move);
     });
   } else {
     $.debug("invalid position type for marker");
   }

   var opts = $.extend({
     map       : G.map,
     id        : G.options.prefix + G.markers.length,
     draggable : false
   }, marker);
   var marker = new google.maps.Marker(opts);

   if (move) {
     G.map.panTo(marker.position);
   }

   if (marker.animation) {
     marker.animation = gapi.animation('drop');
   }
   if (marker.content) {
     add_info_window(marker);
   }

   $(G.id).data(marker.id, marker);
   G.markers.push(marker.id);
   return marker.id;
 };

 /**
  */
 $.gmaps.mark.click = function(marker) {
   if (typeof marker === 'string') {
     marker = $(G.id).data(marker);
   }
   google.maps.event.trigger(marker, 'click');
   G.map.panTo(marker.position);
   return marker;
 };

 /**
  */
 $.gmaps.mark.search = function(term, single) {
   var results = [],
       markers = $.gmaps.markers();

   if (term && typeof term === 'string') {
     for (var idx in markers) {
       if (markers[idx].content.indexOf(term) !== -1) {
         if (single) { return markers[idx]; }
         results.push(markers[idx]);
       }
     }
   }

   return (results.length > 0) ? results : undefined;
 };

 /**
  */
 $.gmaps.mark.toggle = function(markers) {
   $.each(markers, function(_,mark) {
     if (typeof mark === 'string') {
       mark = $(G.id).data(mark);
     }
     mark.setMap(mark.map ? null : G.map);
   });
 }

 /**
  */
 //$.gmaps.mark.all = function() {
 $.gmaps.markers = function() {
   var results = [], H = $(G.id);
   
   for (var i in G.markers) {
     results[i] = H.data(G.markers[i]);
   }
   return results;
 };

 function delete_marker(id) {
   var marker  = $(G.id).data(id);
   marker.setVisible(false);
   marker.setMap(null);
   $(G.id).removeData(id);
   // remove info window
 }

 /**
  */
 //$.gmaps.mark.delete = function(marker) {
 $.gmaps.unmark = function(marker) {
   var index = $.inArray(marker, G.markers);
   if (index > -1) {
     var current = G.markers.splice(index, 1);
     delete_marker(current[0]);
   }
   return this;
 };

 /**
  */
 //$.gmaps.mark.deleteAll = function(marker) {
 $.gmaps.unmarkAll = function() {
   for (var i in G.markers) {
     delete_marker(G.markers[i]);
   }
   G.markers = [];
   return this;
 };

 /**
  */
 $.gmaps.refit = function(area) {
   return this;
 };

 /**
  */
 $.gmaps.geocode = function(address, callback, errback) {
   gapi.geocode({ 'address': address }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        callback(results[0].geometry.location);
      } else {
        $.debug(status);
        if (errback) { errback(status); }
      }
   });
   return this;
 };

 /**
  */
 $.gmaps.geodecode = function(area, callback, errback) {
   gapi.geocode({ 'latLng': area }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        callback(results[0].formatted_address);
      } else {
        $.debug(status);
        if (errback) { errback(status); }
      }
   });
   return this;
 };
})(jQuery);
