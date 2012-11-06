(function(_, Backbone, $) {
	
	// Helpers
	// this is to enable {{moustache}} syntax to simple _.template() calls
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g
	};
	
})(this._, this.Backbone, this.jQuery);