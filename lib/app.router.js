(function(_, Backbone) {
	
	APP.Router = Backbone.Router.extend({
		// this container with host the app configuration
		options: {
		},
		routes: {
			"_=_": "_fixFB", 
			"access_token=:token": "access_token"
		}, 
		initialize: function( options ){
			// app config refered to as options
			options = options || {};
			// bind 'this' with the methods
			_.bindAll(this, 'access_token', 'preRoute', '_bindRoutes', '_callRoute', '_setup', '_ajaxPrefilter','_fixFB');
			// extend default options (recursive?)
			_.extend( this.options, options);
			// setup app 
			this._setup();
			// 
		}, 
		// Save app state in a seperate object
		state: {
			fullscreen: false, 
			online: navigator.onLine,
			// find browser type
			browser: function(){ 
				if( $.browser.safari && /chrome/.test(navigator.userAgent.toLowerCase()) ) return 'chrome';
				if(/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent) ) return 'ios';
				return 'other';
			},
			// check if there's a touch screen
			touch : ('ontouchstart' in document.documentElement) 
		}, 
		// Routes
		// this method wil be executed before "every" route!
		preRoute: function( options, callback ){
			var self = this;
			// execute logic here:
            // - check if there is a session
			if( this.session && (typeof this.session.get("updated") !== "undefined") ){
				// wait for the session
				if( !this.session.get("updated") ){
					return this.session.bind("loaded", _.once(function(){
						callback.apply(self, options);
					}) );
				} else {
					// session available...
					return callback.apply(self, options);
				}
			}
            return callback.apply(self, options);
		}, 
		
		access_token: function( token ){
			// if there's an app session, save it there
			if( this.session ){
				this.session.set({ "token" : token });
			} else {
				// set as a global var (for later use)
				window.access_token = token;
			}
			// either way redirect back to home...
			this.navigate("/");
		},
		// - internal
		// collection of setup methods
		_setup : function(){
			// using options as the main configuration source
			// - use an API URL
			if( this.options.api ) this._ajaxPrefilter( this.options.api );
			// - init analytics
			this.bind('all', this._trackPageview);
			// - setup session (+config), if available... 
			if( APP.Session ) this.session = new APP.Session( ( this.options.session || {} ));
		}, 
		// set the api url for all ajax requests
		_ajaxPrefilter: function( api ){
			
			$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
				//#29 - apply api url only for data requests
				if( originalOptions.dataType != "json" ) return;
				// use the api from the configuration
				options.url = api + options.url;
				options.xhrFields = {
					withCredentials: true
				};
			});
			
		}, 
		// addressing the issue: http://stackoverflow.com/q/7131909
		_fixFB: function(){
			this.navigate("/", true);
		}, 
		// tracking client-side "page" views
		_trackPageview: function(){ 
			var url = Backbone.history.getFragment();
			// check for Google Analytics
			if( typeof _gaq != "undefined" ) _gaq.push(['_trackPageview', "/#"+url]);
		},
		// - overriding default _bindRoutes
		_bindRoutes: function() {
			if (!this.routes) return;
			var route, routes = _.keys(this.routes);
			while (typeof (route = routes.pop()) !== "undefined") {
				var name = this.routes[route];
				// when we find the route we execute the preRoute
				// with a reference to the route as a callback...
				this.route(route, name, this._callRoute( this[name] ) );
			}
		},
		// special execution of a route (with pre-logic)
		_callRoute : function( route ){
			return function(){ 
					this.preRoute.call(this, arguments, route);
				};
		}
		
		
	});
	
})(this._, this.Backbone);