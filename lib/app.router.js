(function(_, Backbone) {
	
	APP.Router = Backbone.Router.extend({
		
		routes: {
			"_=_": "fb_fix"
		},
		initialize: function(){
			_.bindAll(this, 'fb_fix');
			// include this in your router if using Google Analytics
			// this.bind('all', this._trackPageview);
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
		fb_fix: function(){
			// addressing the issue: http://stackoverflow.com/q/7131909
			this.navigate("/", true);
		}, 
		// Utils
		_trackPageview: function(){ 
			var url = Backbone.history.getFragment();
			if( !_.isUndefined( _gaq ) ) _gaq.push(['_trackPageview', "/#"+url]);
		}
		
	});
	
})(this._, this.Backbone);