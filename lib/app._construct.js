/**@license
 * {{name}} <{{homepage}}>
 * Version: {{version}} ({{build_date}})
 * License: {{#license licenses}}{{/license}}
 */
(function(_, Backbone) {
	
	// App contructor
	APP = function(){
		var router = false;
		// check URIs
		var path = window.location.pathname.split( '/' );
		// find a router based on the path
		for(var i in path ){
			// discart the first item if it's empty
			if( path[i] === "") continue;
			router = (path[i].charAt(0).toUpperCase() + path[i].slice(1));
			// stop if we've found a router
			if(typeof(APP.Routers[router]) == "function") break;
		}
		// call the router or fallback to the default
		var controller = (router && APP.Routers[router]) ? new APP.Routers[router]() : new APP.Routers.Default();
		// return controller so it's accessible through the app global
		return controller;
	};
	
	// Namespace definition
	APP.Models = {};
	APP.Routers = {};
	APP.Collections = {};
	APP.Views = {};
	APP.Templates = {};
	
	
})(this._, this.Backbone);