/**
 * @summary jQuery Tooltips (again...)
 * @author bashwork at gmail dot com
 * @license Steal and be happy
 *
 * Really just wanted to see if I could make a cleaner
 * looking plugin.
 */
(function($) {

   /** Private member variables */
   var global = {
     current   : null
   };

   /**
    * Helper method to convert a trigger type
	* @name The name of the trigger type to convert
	* @return A dict of enter and exit events
    */
   function convert_trigger(name) {
     switch(name) {
       case 'focus': return {en: 'focus', ex:'blur'};
       case 'click': return {en: 'click', ex:'click'};
       case 'hover':
       default: return {en: 'mouseenter', ex:'mouseleave'};
     }
   }

   /**
    * Helper method to calculate the gravity positions
	* @param opts The current tooltip options
	* @param el The jquery object we are floating around
	* @return The calculated position
    */
   function convert_gravity(opts, el) {
     var $p = $.extend({}, el.offset(), { height : el.height(), width : el.width() }),
		 $t = { width : global.current.width(), height : global.current.height() },
		 $pos = {};

     switch(opts.gravity.charAt(0)) {
       case 'e': $pos = {'top': $p.top - $t.height/2,  'left': $p.left - $t.width - 15 - opts.xoffset }; break;
       case 'w': $pos = {'top': $p.top - $t.height/2,  'left': $p.left + $p.width + opts.xoffset }; break;
       case 's': $pos = {'top': $p.top + $p.height + opts.yoffset, 'left': $p.left + $p.width/2 - $t.width/2 }; break;
       case 'n':
        default: $pos = {'top': $p.top - $p.height - $t.height - opts.yoffset, 'left': $p.left + $p.width/2 - $t.width/2 };
     }

	 if (opts.gravity.length === 2) {
       switch(opts.gravity.charAt(1)) {
         case 'w': $pos.left = $p.left + $p.width - $t.width/2; break;
         case 'e':
          default: $pos.left = $p.left - $t.width/2;
	   }
	 }

	 return $pos;
   }

   /**
    * Process a selector through the jquery tooltip
	* @return The selector
    */
   $.fn.tooltip = function(options) {
     var opts = $.extend({}, $.fn.tooltip.defaults, options);
		 opts.follow = (opts.gravity) ? false : opts.follow;

     /** called when the user enters an element hover */
     function enter(ev) {
       global.current = $('<div/>', { 'class' : opts.klass, css : {
		   display  : 'none',
		   position : 'absolute',
		   zIndex   : 9999
      }}).text($(this).data('vtitle'))
         .appendTo('body')
		 .delay(opts.delay)
         .fadeIn(opts.speed);
	  
       if (opts.gravity) {
           $('<div/>', { 'class' : opts.klass + '-arrow' })
		     .appendTo(global.current);
           global.current.addClass('gravity-' + opts.gravity);
       }
       update(ev, $(this));
     }
   
     /** called when the user exits an element hover */
     function exit() {
       global.current.stop()
	     .delay(opts.delay)
	     .fadeOut(opts.speed, function() { $(this).remove(); })
       global.current = null;
     }
   
     /** called when the user moves on an element */
     function update(ev, elem) {
	   if (!global.current) { return; }

       var $this = elem || $(this)
           $pos  = (opts.gravity) ? convert_gravity(opts, $this)
             : { top : (ev.pageY + opts.yoffset), left : (ev.pageX + opts.xoffset) };
       global.current.css($pos);
     }

	 var trigger = convert_trigger(opts.trigger);

     var $chain = this.each(function() {
       var $this = $(this),
           $title = $this.attr(opts.attribute);
       $this.data('vtitle', $title || opts.fallback);
       $this.removeAttr('title');

     })[opts.binder](trigger.en, enter)[opts.binder](trigger.ex, exit);

	 return (opts.follow) ? $chain.mousemove(update) : $chain;
   };

   /** visibile default settings */
   $.fn.tooltip.defaults = {
     xoffset   : 10,
     yoffset   : 10,
     speed     : 'slow',
     delay     : 0,
     klass     : 'tooltip',
     attribute : 'title',
     fallback  : '',
     follow    : true,
     binder    : 'bind',
     trigger   : 'hover',
	 gravity   : false,
	 animation : { opacity : 0.9 } // todo
   };

})(jQuery);
