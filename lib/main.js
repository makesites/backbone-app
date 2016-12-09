/**
 * @name {{name}}
 * @author {{author}}
 * Homepage: {{homepage}}
 * Version: {{version}} ({{build_date}})
 * @license {{#license licenses}}{{/license}}
 */


(function (lib) {

	//"use strict";

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		var deps = ['jquery', 'underscore', 'backbone'];
		define('backbone.app', deps, lib); // give the module a name
	} else if ( typeof module === "object" && module && typeof module.exports === "object" ){
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = lib;
	} else {
		// Browser globals
		var Query = window.jQuery || window.Zepto || window.vQuery;
		lib(Query, window._, window.Backbone, window.APP);
	}
}(function ($, _, Backbone) {

	//"use strict";
	// better way to define global scope?
	var window = this.window || {};
	var APP = window.APP || false;

	// stop processing if APP is already part of the namespace
	if( !APP ) (function(_, Backbone) {

	// defaults =
	var defaults = {
		require: false,
		routePath: "app/controllers/",
		autoLookup: true,
		pushState: false
	};

	// App contructor
	APP = function(){
		// get config
		var options = arguments[0] || {};
		var callback = arguments[1] || function(){};
		// extend default options
		options.require = options.require || (typeof define === 'function' && define.amd);
		options = utils.extend( defaults, options );
		// find router
		var router = false;
		// check URIs
		var path = ( window.location ) ? window.location.pathname.split( '/' ) : [""];
		// FIX: discart the first item if it's empty
		if ( path[0] === "" ) path.shift();
		//
		if( options.require ){
			// use require.js
			var routerDefault = options.routePath +"default";
			if(typeof options.require == "string"){
				router = options.require;
			} else if( !options.autoLookup ){
				// don't try to lookup the router
				router = routerDefault;
			} else {
				router = options.routePath;
				router += ( !_.isEmpty(path[0]) ) ? path[0] : "default";
			}

			if( typeof require !== "undefined" ){
				require( [ router ], function( controller ){

					if( controller ){
						callback( controller );
					}

				}, function (err) {
					//The errback, error callback
					//The error has a list of modules that failed
					var failed = err.requireModules && err.requireModules[0];
					// what if there's no controller???
					if( failed == router ){
						// fallback to the default controller
						require( [ routerDefault ], function( controller ){
							callback( controller );
						});
					} else {
						//Some other error. Maybe show message to the user.
						throw err;
					}
				});

			} else {

				// assuming System.js
				System['import'](router).then(function( Controller ){

					if( Controller['default'] ){
						callback( Controller['default'] );
					}

				})['catch'](function(e) {
					// revert to the default router
					System['import'](routerDefault).then(function( Controller ){
						callback( Controller['default'] );
					});
				});

			}

			return APP;

		} else {
			// find a router based on the path
			for(var i in path ){
				// discart the first item if it's empty
				if( path[i] === "") continue;
				router = (path[i].charAt(0).toUpperCase() + path[i].slice(1));
				// stop if we've found a router
				if(typeof(APP.Routers[router]) == "function") break;
			}
			// call the router or fallback to the default
			var controller = (router && APP.Routers[router]) ? new APP.Routers[router]( options ) : new APP.Routers.Default( options );
			// return controller so it's accessible through the app global
			return controller;
		}
	};

	// Namespace definition
	APP.Models = {};
	APP.Routers = {};
	APP.Collections = {};
	APP.Views = {};
	APP.Layouts = {};
	APP.Templates = {};

	})(_, Backbone);


{{{lib}}}

	// reference other Backbone methods
	APP.extend = Backbone.extend;

	// If there is a window object, that at least has a document property
	if( typeof window === "object" && typeof window.document === "object" ){
		// save in the global namespace
		window.APP = APP;
	}

	// for module loaders:
	return APP;

}));
