(function(_, Backbone, APP) {

	APP.Router = Backbone.Router.extend({
		// app configuration:
		options: {
			location : false,
			api : false,
			p404 : "/"
		},
		// to preserve these routes, extend with:
		// _.extend({}, APP.Router.prototype.routes, {...});
		routes: {
			"": "index",
			"_=_": "_fixFB",
			"access_token=:token": "access_token",
			"logout": "logout"
			//"*path"  : "_404"
		},

		data: new Backbone.Model(),

		initialize: function( options ){
			// app config refered to as options
			options = options || {};
			// bind 'this' with the methods
			_.bindAll(this, 'access_token', 'preRoute', '_layoutUpdate', '_bindRoutes', '_callRoute', '_setup', '_ajaxPrefilter','_fixFB');
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
				if( /chrome/.test(navigator.userAgent.toLowerCase()) ) return 'chrome';
				if( /firefox/.test(navigator.userAgent.toLowerCase()) ) return 'firefox';
				if(/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent) ) return 'ios';
				return 'other';
			},
			mobile: (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) ||navigator.userAgent.match(/BlackBerry/i)),
			ipad: (navigator.userAgent.match(/iPad/i) !== null),
			// check if there's a touch screen
			touch : ('ontouchstart' in document.documentElement),
			pushstate: function() {
				try {
					window.history.pushState({"pageTitle": document.title}, document.title, window.location);
					return true;
				}
				catch (e) {
					return false;
				}
			},
			scroll: true,
			ram: function(){
				return (console.memory) ? Math.round( 100 * (console.memory.usedJSHeapSize / console.memory.totalJSHeapSize)) : 0;
			},
			standalone: function(){ return (("standalone" in navigator) && navigator.standalone) || (typeof PhoneGap !="undefined" && !_.isUndefined(PhoneGap.env) && PhoneGap.env.app ) || ((typeof external != "undefined") && (typeof external.msIsSiteMode == "function") && external.msIsSiteMode()); },
			framed: (top !== self) // alternatively (window.top !== window)
		},
		update: function(){
			// backwards compatibility for a simple state object
			var scroll = (this.state instanceof Backbone.Model ) ? this.state.get("scroll") : this.state.scroll;
			if( scroll ){
				$("body").removeClass("no-scroll");
			} else {
				$("body").addClass("no-scroll");
			}
		},

		// Routes
		// default route - override with custom method
		index: function(){

		},

		// vanilla logout route
		logout: function(){
			if( this.session ) this.session.trigger("logout", { reload: true });
			// back to the homepage
			this.navigate("/", true);
		},


		// this method wil be executed before "every" route!
		preRoute: function( options, callback ){
			var self = this;
			// execute logic here:
			// - check if there is a session
			if( this.session && (typeof this.session.state !== "undefined") ){
				// wait for the session
				if( !this.session.state ){
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
			this.navigate("/", true);
		},
		// - internal
		// collection of setup methods
		_setup : function(){
			// using options as the main configuration source
			// - use an API URL
			if( this.options.api ) this._ajaxPrefilter( this.options.api );
			// - init analytics
			//this.bind('all', this._trackPageview);
			this.bind('all', this._layoutUpdate);

			// - monitor user's location
			if( this.options.location ){
				this._geoLocation();
			}
			// - setup session
			this._setupSession();
		},

		// - setup session, if namespace is available
		_setupSession: function(){
			// fallback to backbone.session
			var Session = APP.Session || Backbone.Session || false;
			if( Session ) this.session = new Session({}, ( this.options.session || {} ));
		},

		// set the api url for all ajax requests
		_ajaxPrefilter: function( api ){
			var session = this.session || false;

			$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
				//#29 - apply api url only for data requests
				if( originalOptions.dataType != "json" ) return;
				// use the api from the configuration (unless full URL specified)
				var fullUrl = (options.url.search(/^http/) === 0);
				if( !fullUrl ){
					options.url = api + options.url;
				}
				// compatible with servers that set header
				// Access-Control-Allow-Credentials: true
				// for added security
				options.xhrFields = {
					withCredentials: true
				};
				// If we have a csrf token send it through with the next request
				var csrf = (session) ? (session._csrf || session.get('_csrf') || false) : false;
				if( csrf ) {
					jqXHR.setRequestHeader('X-CSRF-Token', csrf);
				}
			});

		},
		// addressing the issue: http://stackoverflow.com/q/7131909
		_fixFB: function(){
			this.navigate("/", true);
		},
		// tracking client-side "page" views - replaces by Backbone.Analytics (in helpers)
		/*
		_trackPageview: function(){
			var url = Backbone.history.getFragment();
			// check for Google Analytics
			if( typeof _gaq != "undefined" ) _gaq.push(['_trackPageview', "/#"+url]);
		},
		*/
		_layoutUpdate: function(path){
			//update the layout
			if(this.layout) this.layout.trigger("update", { navigate : true, path : path });
		},
		// - overriding default _bindRoutes
		_bindRoutes: function() {
			if (!this.routes) return;
			this.routes = _.result(this, 'routes');
			var route, routes = _.keys(this.routes);
			while(typeof (route = routes.pop()) !== "undefined"){
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
		},
		_geoLocation: function(){
			var self = this;
			// get user's location
			navigator.geolocation.getCurrentPosition(
				function( data ){ self.state.location = data; },
				function(){ console.log("error", arguments); }
			);
			// update every 30 sec (to support mobile)
			setTimeout( function(){
				self._geoLocation();
			}, 30000);

		},

		// Fallback 404 route
		_404: function(path) {
			var msg = "Unable to find path: " + path;
			console.log(msg);
			// redirect to 404 path
			this.navigate( this.options.p404 );
		}

	});


	// default router (ultimate fallback..)
	APP.Routers.Default = APP.Router;

})(_, Backbone, APP);
