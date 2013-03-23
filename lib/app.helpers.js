(function(_, Backbone, $) {
	
	// Helpers
	// this is to enable {{moustache}} syntax to simple _.template() calls
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g,
		variable : "."
	};
	
	// if available, use the Handlebars compiler
	if(typeof Handlebars != "undefined"){
		_.mixin({
			template : Handlebars.compile
		});
	}
})(this._, this.Backbone, this.jQuery);