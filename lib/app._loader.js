(function(window) {

	var APP = window.APP;

	// Support module loaders
	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = APP;
	} else {
		// Register as a named AMD module, used in Require.js
		if ( typeof define === "function" && define.amd ) {
			//define( "backbone.ui.slideshow", [], function () { return Slideshow; } );
			//define( ['jquery', 'underscore', 'backbone'], function () { return Slideshow; } );
			define( [], function () { return APP; } );
		}
	}

})(this.window);
