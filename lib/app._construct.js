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
		define(['jquery', 'underscore', 'backbone'], lib);
	} else {
		// Browser globals
		lib($, _, Backbone);
	}
}(function ($, _, Backbone) {

	//"use strict";
	// better way to define global scope?
	var window = this.window || {};
	var APP = window.APP || false;

	// stop processing if APP is already part of the namespace
	if( !APP ) (function(_, Backbone) {

	// App contructor
	APP = function(){
		// get config
		var options = arguments[0] || {};
		var callback = arguments[1] || function(){};
		// defaults
		options.require = options.require || (typeof define === 'function' && define.amd);
		options.routePath = "app/controllers/";
		options.pushState = options.pushState || false;
		// find router
		var router = false;
		// check URIs
		var path = window.location.pathname.split( '/' );
		// FIX: discart the first item if it's empty
		if ( path[0] === "" ) path.shift();
		//
		if( options.require ){
			// use require.js
			if(typeof options.require == "string"){
				router = options.require;
			} else {
				router = options.routePath;
				router += ( !_.isEmpty(path[0]) ) ? path[0] : "default";
			}
			require( [ router ], function( controller ){
				// what if there's no controller???
				callback( controller );
			});
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

	})(this._, this.Backbone);


{{{lib}}}


	// save in the global namespace
	window.APP = APP;

	return window.APP;

}));
