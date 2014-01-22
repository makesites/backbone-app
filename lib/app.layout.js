(function(_, Backbone, $) {

	/* Main layout */
	APP.Layout = Backbone.View.extend({

		el: "body",

		//
		options: {
			autosync : false,
			sync_events: "add remove change"
		},

		// events
		events: {
			"click a:not([rel='external'],[rel='alternate'])" : "_clickLink"
		},

		views: new Backbone.Model(),

		initialize: function(){
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			// bind event to this object
			_.bindAll(this, "set", "get", "render", "update", "_clickLink", "_viewLoaded", "_syncData");
			this.on("update", this.update);
		},

		preRender: function(){

		},

		render: function(){
			this._preRender();
			// remove loading class (if any)
			$(this.el).removeClass("loading");
			this._postRender();
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
					views[i].data.on(this.options.sync_events, _.bind(this._syncData, this) );
				}
			}
			return this.views.set( views );
		},

		get: function( view ){
			return this.views.get( view );
		},

		// removes a view
		remove: function( name ){
			//console.log("unset", name);
			var view = this.get( name );
			// prerequisite
			if( _.isUndefined(view) ) return;
			// undelegate view events
			view.remove();
			// remove the attribute from this.views
			return this.views.unset( name );
		},

		findLink: function (target) {
			var url = (target.tagName != "A") ? $(target).closest("a").attr("href") : $(target).attr("href");
			// filter empty URLs
			return ( _.isEmpty(url) || url.substr(0,1) == "#" ) ? false : url;
		},

		// Internal methods
		_preRender: function(){
			// add touch class to body
			if( app.state.touch ) $(this.el).addClass("touch");
			// app-specific actions
			this.preRender();
		},

		_postRender: function(){
			// app-specific actions
			this.postRender();
		},

		_viewLoaded : function(){
			var registered = 0,
				loaded = 0;
			// check if all the views are loaded
			_.each(this.views.attributes, function( view ){
				if( view.state.loaded ) loaded++;
				registered++;
			});

			// when all views are loaded...
			if( registered == loaded ){
				this._allViewsLoaded();
			}

		},

		// what to do after all views are loaded
		_allViewsLoaded : _.once(function(){
				// re-render the layout
				this.render();
		}),

		// broadcast all data updates in the views back to the layout
		//_syncData: function( action, model, collection, options ){
		_syncData: function( model, collection, options ){
			var value = false;
			// fallback
			var data = collection || model || false;
			if( !data ) return;
			// get the key of the data
			var key = data._view || false;
			// if we haven't kept a reference key to backtrack, exit now
			if( !key ) return;
			// this automation only works when the original data is a Backbone.Model
			if( this.model instanceof Backbone.Model ){
				var keys = this.model.keys() || [];
				// this only works if there's existing data
				if( keys.indexOf( key ) == -1 ) return;
				// get the data in an exported form (usually toJSON is enough)
				try{
					value = data.output();
				} catch( e ){
					// assume this collection is generic
					value = data.toJSON();
				}
				// final condition...
				if( value ){
					var attr = {};
					attr[key] = value;
					this.model.set( attr );
					// immediately save?
					if (this.options.autosync){
						this.model.save();
					}
				}
			}
		},

		_clickLink: function( e ){
			var url = this.findLink(e.target);
			if( url ){
				// add loading class
				$(this.el).addClass("loading");
			}
			// when to intercept links
			if( app.state.standalone() && url ){
					// block default behavior
					e.preventDefault();
					//
					window.location = url;
					return false;
			}
			// otherwise pass through...
		}

	});

})(this._, this.Backbone, this.jQuery);
