/**
 * @summary A page initializer
 * @author bashwork at gmail dot com
 * @license Steal and be happy
 *
 * Original ideas from:
 * - http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 * - http://www.viget.com/inspire/extending-paul-irishs-comprehensive-dom-ready-execution/
 */
var Loader = {

  settings : {
    data     : 'data-controller', // where to find the controller name
    name     : 'website',         // the name of the root namespace
    common   : 'common',          // the name of the common function
    init     : 'init',            // the initializer method
    finalize : 'finalize'         // the finalizer method
  },

  /**
   * If controllers is namespaced, we will fire
   * each piece of the namespace in order:
   *
   * 1. ns.user.init
   * 2. ns.user.profile.init
   * 3. ns.user.profile.edit.init
   */
  fire : function(controllers, action, args) {
    var ns = website, current = Loader.settings.name;
	action = (action === undefined) ? Loader.settings.init : action;

	if (typeof controllers === 'string') {
	  controllers = controllers.split('.');
	} else if (typeof controllers === 'undefined') {
      return;
    }
    
	for (var index in controllers) {
	  current = [current, controllers[index]].join('.');
	  ns = ns ? ns[controllers[index]] : ns;
	  if (ns && typeof ns[action] === 'function') {
	    ns[action](args);
	  }
	}
  },

  /**
   * This is used to fire the javascript page initializers
   * based on the current controller specified on the body 
   * tag. The order of firing is as follows:
   *
   * 1. ns.common.init
   * 2. ns.controller.init
   * 3. ns.controller.finalize
   * 4. ns.common.finalize
   */
  load : function() {
	var controller = document.body.getAttribute(Loader.settings.data);

    Loader.fire([Loader.settings.common]);
    Loader.fire(controller);
    Loader.fire([Loader.settings.common], Loader.settings.finalize);
  }
};

/**
 * Do something like this in your base template so
 * you can perform configuration of the js blocks
 * before you call load:
 * 
 * <script type='text/javascript'>
 * {% block loader-config %}{% endblock %}
 * jQuery(Loader.load);
 * </script>
 *
 * And in your derived templates:
 * {% block loader-config %}
 *
 * $.extend(website.user.edit.config, {
 *   message = "{{ user }}, your page has been saved!"
 * });
 *
 * {% endblock %}
 */
