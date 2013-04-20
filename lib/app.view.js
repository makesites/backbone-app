(function(_, Backbone, $) {
	
	APP.View =  Backbone.View.extend({
		options : {
			data : false,
			html: false, 
			template: false,
			url : false,
			type: false
		}, 
		state: {
			loaded : false
		}, 
		// events
		events: {
			"click a[rel='external']" : "clickExternal"
		}, 
		initialize: function( options ){
			var self = this;
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			//
			_.bindAll(this, 'render', 'clickExternal', 'postRender'); 
			// find the data
			this.data = this.model || this.collection || null;
			this.options.data  = !_.isNull( this.data );
			//
			// #9 optionally add a reference to the view in the container
			if( this.options.attr ) {
				$(this.el).attr("data-view", this.options.attr );
			} else { 
				$(this.el).removeAttr("data-view");
			}
			// compile
			var html = ( this.options.html ) ? this.options.html : null;
			// #18 - supporting custom templates
			var Template = (this.options.template || typeof APP == "undefined") ? this.options.template : (APP.Template || false);
			
			if( Template ) { 
				// set the type to default (as the Template expects)
				if( !this.options.type ) this.options.type = "default";
				this.template = new Template(html, { url : this.options.url });
				this.template.bind("loaded", this.render);
			} else if( this.options.url ) {
				// fallback to the underscore template
				$.get(this.options.url, function( html ){
					self.template = _.template( html );
					self.render();
				});
			} else {
				this.template = _.template( html );
				this.render();
			}
			// add listeners
            if( this.options.data ){
                this.data.bind("change", this.render);
                this.data.bind("reset", this.render);
                this.data.bind("add", this.render);
                this.data.bind("remove", this.render);
            }
			// #11 : initial render only if data is not empty (or there are no data)
			if( ( (this.options.html || this.options.url ) && !this.options.data) || (this.options.data && !_.isEmpty(this.data.toJSON()) ) ){ 
				this.render();
			}
			// #36 - Adding resize event
			$(window).bind("resize", _.bind(this._resize, this));
		},
		render: function(){
			// prerequisite
			if( !this.template ) return;
			// execute pre-render actions
			if( !_.isUndefined(this.preRender) ) this.preRender();
			// 
			var template = ( this.options.type ) ? this.template.get( this.options.type ) : this.template;
			var data = ( this.options.data ) ? this.data.toJSON() : {};
			// #19 - checking instance of template before executing as a function
			var html = ( template instanceof Function ) ? template( data ) : template;
			if( this.options.append ){
				$(this.el).append( html );
			} else {
				$(this.el).html( html );
			}
			// execute post-render actions
			if( !_.isUndefined(this.postRender) ) this.postRender();
		}, 
		postRender: function(){
			// make sure the container is presented
			$(this.el).show();
			// remove loading state (if data has arrived)
			if( !this.options.data || (this.options.data && !_.isEmpty(this.data.toJSON()) ) ){ 
				$(this.el).removeClass("loading");
				// set the appropriate flag
				this.state.loaded = true;
				// bubble up the event
				this.trigger("loaded");
			}
			
		}, 
		// a more discrete way of binding events triggers to objects
        listen : function( obj, event, callback ){
            // adds event listeners to the data
            var e = ( typeof event == "string")? [event] : event;
            for( var i in e ){
                obj.bind(e[i], callback);
            }
            
        }, 
		resize: function( e ){
			// override with your own custom actions...
		}, 
		clickExternal: function(e){
			e.preventDefault();
			var url = this.findLink(e.target);
			// track the click with Google Analytics (if available)
			if(typeof pageTracker != "undefined") url = pageTracker._getLinkerUrl(url);
			// #22 - Looking for Phonegap ChildBrowser in external links
			try{
				window.plugins.childBrowser.showWebPage( url );
			} catch( exp ){
				// revert to the redular load
				window.open(url, '_blank'); 
			}
			return false; 
		}, 
		findLink: function (obj) {
			if (obj.tagName != "A") {
				return $(obj).closest("a").attr("href");
			} else {
				return $(obj).attr("href");
			}
		}, 
		remove: function() {
			// unbind the namespaced 
			$(window).unbind("resize", this._resize);
			
			// don't forget to call the original remove() function
			Backbone.View.prototype.remove.call(this);
		}, 
		// Internal methods
		// - When navigate is triggered
		_navigate: function( e ){
			// extend method with custom logic
		}, 
		// #36 - resize event trigger (with debouncer)
		_resize: function () {
			var self = this , 
			args = arguments, 
			timeout, 
			delay = 1000; // default delay set to a second
			console.log( "resize" );
			clearTimeout( timeout );
			timeout = setTimeout( function () {
				self.resize.apply( self , Array.prototype.slice.call( args ) );
			} , delay);
		}
	});
	
})(this._, this.Backbone, this.jQuery);