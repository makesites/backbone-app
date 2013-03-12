(function(_, Backbone, $) {
	
	/* Main layout */
	APP.Layout = Backbone.View.extend({
		el: "body", 
		// events
		events: {},
		views: new Backbone.Model(), 
		initialize: function(){
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			// bind event to this object
			_.bindAll(this); 
		}, 
		render: function(){
			// remove loading class (if any)
			$(this.el).removeClass("loading");
		}, 
		// setter and getter mirroring the Model methods
		set: function( views ){
			// add event triggers on the views
			for( var i in views){
				views[i].on("loaded", this._viewLoaded );
			}
			return this.views.set( views );
		}, 
		get: function( view ){
			return this.views.get( view );
		}, 
		// Internal methods
		_viewLoaded : function(){
			var registered = 0, 
				loaded = 0;
			// check if all the views are loaded
			_.each(this.views.attributes, function( view ){
				console.log( view );
				if( view.state.loaded ) loaded++;
				registered++;
			});
			// trigger render if all views are loaded
			if( registered == loaded ){
				this.render();
			}
		}
		
	});
	
})(this._, this.Backbone, this.jQuery);