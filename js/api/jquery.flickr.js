/**
 * jQuery flickr
 * http://www.flickr.com/services/api/
 *
 * @author: bashwork at gmail dot com
 * @date: right about now
 * @license: steal and be glad
 */
(function($) {

  /**
   * private api
   */
  var flickr = {
    /**
     * member fields
     */
    base    : 'http://api.flickr.com/services/rest/',
    options : {
      format       : 'json',
      api_key      : '4d67f7aabdf16f65f66b0e4242823334',
      accuracy     : 10, // at least city
      safe_search  : 1,  // no porn
      klass        : 'flickr',
      size         : 's',
      content_type : 1  // just photos
      // text      : '',
      // tags      : '',
      // per_page  : 1,
      // page      : 1
    },

    /**
     * a helper method to convert a reasonable size
     * value to flickr's version
     */
    get_size : function(size) {
      switch(size) {
        case 'sq': return '_s' // square
        case 't' : return '_t' // thumbnail
        case 's' : return '_m' // small
        case 'm' : return ''   // medium
        case 'ml': return '_z' // medium large
        case 'l' : return '_b' // large
        default  : return '_m' // small
      }
    },

    /**
     * http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}.jpg
     * http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
     * http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)
     */
    get_url : function (photo, size) {
      return ["http://farm", photo.farm, ".static.flickr.com/",
        photo.server, "/", photo.id, "_", photo.secret,
        flickr.get_size(size), ".jpg"].join('');
    },

    get_img : function (image) {
      return ['<img src="', image.src,
        '" alt="', image.alt, '" />'].join('');
    },

    /**
     * accepts a series of photos and constructs
     * the thumbnails that link back to Flickr
     */
    process : function(photos, options) {
      var thumbnails = $.map(photos.photo, function(photo) {
        var image = new Image(), html = '';

        image.src = flickr.get_url(photo, options.size)
        image.alt = photo.title
          
        return ['<li>' + flickr.get_img(image) + '</li>']
      }).join("\n")
      
      return $('<ul>').addClass(options.klass).append(thumbnails)
    },

    /**
     * perform the actual request and process
     * the resulting images
     */
    request : function(query, method, callback) {
      var opts = $.extend(flickr.options, query, { method : method });
      $.getJSON(flickr.base + '?jsoncallback=?', opts, function(data) {
        if (data.stat === 'ok') {
          var photos = (data.photos === undefined)
            ? data.photoset : data.photos;
          callback(flickr.process(photos, opts));
        } else { $.debug(data); }
      });
    }
  };

  function _build(method) {
    return function(query, callback) {
      flickr.request(query, method, callback);
    }
  }

  /**
   * public api
   * for most of these, you may have to look up the
   * parameters...sorry.
   */
  $.flickr = {
    search      : _build('flickr.photos.search'),
    recent      : _build('flickr.photos.getRecent'),
    photoset    : _build('flickr.photosets.getPhotos'),
    interesting : _build('flickr.interestingness.getList'),
    username    : _build('flickr.people.getPublicPhotos'),
    contacts    : _build('flickr.photos.getContactsPublicPhotos'),
    lookup      : _build('flickr.people.FindByUsername')
  };

  /**
   * jquery api
   */
  $.fn.flickr = function(options) {
    return this.each(function() {
      var $this = $(this);
      $.flickr.search(options, function(data) {
        $this.append(data);
      });
    });
  };

})(jQuery);
