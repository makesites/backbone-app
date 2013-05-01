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
			this.on("update", this.update);
		}, 
		
		preRender: function(){
		}, 
		
		render: function(){
            this.preRender();
			// remove loading class (if any)
			$(this.el).removeClass("loading");
            this.postRender();
		}, 
		
		postRender: function(){
		}, 
		
		update: function( e ){
			e = e || false;
			// if there's no event exit?
			if( !e ) return;
			// broadcast the event to the views...
			// - if there's rerouting:
			if( e.navigate ){ 
				// better way to get views?
				for( var i in this.views.attributes){
					this.views.attributes[i]._navigate(e);
				}
			}
			// - include other conditions...
		}, 
		
		// setter and getter mirroring the Model methods
		set: function( views ){
			// add event triggers on the views
			for( var i in views){
				views[i].on("loaded", _.bind( this._viewLoaded, this ) );
                // 'stamp' each view with a label
                views[i]._name = i;
                // bind events
                if( views[i].data ) {
                    // view reference in the data
                    views[i].data._view = i;
                    // bind all data updates to the layout
                    views[i].data.bind("all", _.bind(this._syncData, this) );
                }
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
				if( view.state.loaded ) loaded++;
				registered++;
			});
			// trigger render if all views are loaded
			if( registered == loaded ){
				this.render();
			}
		}, 
        
        
        // broadcast all data updates in the views back to the layout
        _syncData: function( action, model, collection, options ){
            var data = false;
            // get the key of the data
            var key = collection._view || false;
            // if we haven't kept a reference key to backtrack, exit now
            if( !key ) return;
            // this automation only works when the original data is a Backbone.Model
            if( this.model instanceof Backbone.Model ){ 
                var keys = this.model.keys() || [];
                // this only works if there's existing data 
                if( keys.indexOf( key ) == -1 ) return;
                // get the data in an exported form (usually toJSON is enough)
                try{ 
                    data = collection.output();
                } catch( e ){
                    // assume this collection is generic
                    data = collection.toJSON();
                }
                // final condition...
                if( data ){ 
                    this.model.set({ key : data });
                    // immediately save?
                    //if (this.options.autosync)
                    this.model.save();
                }
            }
        }
		
	});
	
})(this._, this.Backbone, this.jQuery);