// Backbone Extender
// Source: https://gist.github.com/tracend/5425415
(function(_, Backbone){

var origExtend = Backbone.Model.extend;

var extend = function(protoProps, staticProps) {

	var parent = this;

	if (protoProps){
		_.each(protoProps, function(value, key){
			// modify only the objects that are available in the parent
			if( key in parent.prototype && !(value instanceof Function) && !(parent.prototype[key] instanceof Function) && (parent.prototype[key] instanceof Object) ){
				// the routes need to be processed in reverse (as order matters)
				protoProps[key] = ( key == "routes" ) ? _.extend({}, value, parent.prototype[key]) : _.extend({}, parent.prototype[key], value );
			}
		});
	}

	return origExtend.call(this, protoProps, staticProps);
};

	// Set up inheritance for the model, collection, router, view and history.
	Backbone.Model.extend = Backbone.Collection.extend = Backbone.Router.extend = Backbone.View.extend = extend;

})(this._, this.Backbone);


// Underscore
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

/*
 * Backbone.ready()
 * Source: https://gist.github.com/tracend/5617079
 *
 * by Makis Tracend( @tracend )
 *
 * Usage:
 * Backbone.ready( callback );
 *
 */
(function(window, document, Backbone){

	// find the $
	$ = ('$' in window) ? window.$ : window.jQuery || window.Zepto || false;

	Backbone.ready = function( callback ){

		if( isPhonegap() ){
			return PhoneGap.init( callback );

		} else if( $ ) {
			// use the 'default' ready event
			return $(document).ready( callback );

		} else if (window.addEventListener) {
			// ultimate fallback, add window event - trigger the page as soon it's loaded
			return window.addEventListener('load', callback, false);

		} else {
			// IE...
			return window.attachEvent('onload', callback);
		}

	};

	// Helpers

	// - Support Phonegap Shim: https://github.com/makesites/phonegap-shim
	function isPhonegap(){
		// only execute in app mode?
		return typeof PhoneGap != "undefined" && typeof PhoneGap.init != "undefined" && typeof PhoneGap.env != "undefined"  && PhoneGap.env.app;
	}

	return Backbone;

})(window, document, this.Backbone);

// Backbone.Analytics
// Source: https://github.com/kendagriff/backbone.analytics
(function() {
	var loadUrl = Backbone.History.prototype.loadUrl;

	Backbone.History.prototype.loadUrl = function(fragmentOverride) {
		var matched = loadUrl.apply(this, arguments),
				gaFragment = this.fragment;
		if (!/^\//.test(gaFragment)) gaFragment = '/' + gaFragment;
		if(typeof window._gaq !== "undefined") window._gaq.push(['_trackPageview', gaFragment]);
		if(typeof window.GoogleAnalyticsObject !== "undefined"){
			var ga = window.GoogleAnalyticsObject;
			window[ga]('send', 'pageview', gaFragment);
		}
		return matched;
	};

}).call(this);

/*
 * Backbone States
 * Source: https://github.com/makesites/backbone-states
 *
 * Created by Makis Tracend ( [@tracend](http://github.com/tracend) )
 * Released under the [MIT license](http://makesites.org/licenses/MIT)
 *
 */
(function(window, document, Backbone){

	// find the $
	//$ = ('$' in window) ? window.$ : window.jQuery || window.Zepto || false;

	var View = Backbone.View;

	Backbone.View = View.extend({
		states: {
		},
		initialize: function(options){
			this.initStates();
			return View.prototype.initialize.call(this, options);
		},
		initStates: function(){
			for(var e in this.states){
				var method = this.states[e];
				this.bind(e, _.bind(this[method], this) );
			}
		}

	});

	// Helpers
	//...

	return Backbone;

})(window, document, this.Backbone);
