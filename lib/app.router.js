(function(_, Backbone) {
	
	APP.Router = Backbone.Router.extend({
		
		routes: {
			"_=_": "_fixFB", 
			"access_token=:token": "access_token"
		}, 
		initialize: function(){
			_.bindAll(this, 'access_token', '_fixFB');
			// analytics
			this.bind('all', this._trackPageview);
		}, 
		// Save app state in a seperate object
		state: {
			fullscreen: false, 
			online: navigator.onLine,
			browser: function(){ 
							if( $.browser.safari && /chrome/.test(navigator.userAgent.toLowerCase()) ) return 'chrome';
							if(/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent) ) return 'ios';
							return 'other';
						},
			touch : ('ontouchstart' in document.documentElement)
		}, 
		// Routes
		access_token: function( token ){
			// if there's an app session, save it there
			if( app && app.session ){
				app.session.set( token );
			} else {
				// set as a global var (for later use)
				window.access_token = token;
			}
			// either way redirect back to home...
			this.navigate("/");
		},
		// - internal
		_fixFB: function(){
			// addressing the issue: http://stackoverflow.com/q/7131909
			this.navigate("/", true);
		}, 
		// Utils
		_trackPageview: function(){ 
			var url = Backbone.history.getFragment();
			// check for Google Analytics
			if( typeof _gaq != "undefined" ) _gaq.push(['_trackPageview', "/#"+url]);
		}
		
	});
	
})(this._, this.Backbone);