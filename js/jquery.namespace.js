/**
 * @summary A quick helper to define namespaces
 * @author bashwork at gmail dot com
 * @license Steal and be happy
 */
(function($){

  /**
   * Helper method to create a given namespace
   * @param ns The namespace to create
   * @returns The newly created namespace
   *
   * @example:
   *   $.namespace.create('org.bashwork.project', {
   *     name : 'project api v1',
   *     api  : { ... },
   *   });
   */
  $.namespace = {
    create : function(ns, params) {
      var names = ns.split(this.config.seperator),
          root = this.config.basens;
  
      for (var idx = 0; idx < names.length; ++idx) {
        root = (root[names[idx]]) ? root[names[idx]] : root[names[idx]] = {};
      }
	  if (params) { $.extend(root, params) };

      return root;
    },

    /**
	 * Helper method to delete a given namespace
	 * @param ns The namespace to delete
   *
   * @example:
   *   $.namespace.remove('org.bashwork.project');
	 */
	remove : function(ns) {
      var names = ns.split(this.config.seperator),
	      last = names.pop(),
          root = this.config.basens;
  
      for (var idx = 0; idx < names.length; ++idx) {
		if (!root[names[idx]]) { return; }
        root = root[names[idx]];
      }
	  delete root[last];
	},
  
    /**
     * Configuration for the namespace module
     */
    config : {
      seperator : '.',
      basens    : window
    }
  };

  /**
   * aliases
   */
  $.namespace.extend = $.namespace.create;

})(jQuery);
