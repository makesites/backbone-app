(function(_, Backbone) {
	
	APP.Router = Backbone.Router.extend({
		// this container with host the app configuration
		options: {
		},
		routes: {
			"_=_": "_fixFB", 
			"access_token=:token": "access_token"
		}, 
		initialize: function(){
			_.bindAll(this, 'access_token', '_setup', '_ajaxPrefilter','_fixFB');
			// setup app 
			this._setup();
			// analytics
			this.bind('all', this._trackPageview);
			// add session (+ session config) if available... 
			if( APP.Session ) this.session = new APP.Session( ( this.options.session || {} ));
            
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
		access_token: function( token ){
			// if there's an app session, save it there
			if( this.session ){
				this.session.set( token );
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
			if( this.options.api ) this._ajaxPrefilter( this.options.api );
		}, 
		// set the api url for all ajax requests
		_ajaxPrefilter: function( api ){
			
			$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
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
		}
		
	});
	
})(this._, this.Backbone);