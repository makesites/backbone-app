(function(_, Backbone, $) {

	APP.View =  Backbone.View.extend({
		options : {
			data : false,
			html: false,
			template: false,
			url : false,
			bind: "add remove reset change", // change the default to "sync"?
			type: false,
			parentEl : false,
			autoRender: true,
			inRender: false,
			silentRender: false,
			renderTarget: false
		},
		// events
		events: {
			"click a[rel='external']" : "clickExternal"
		},
		// states
		states: {
			"scroll": "_scroll"
		},
		state: {
			loaded : false,
			scroll : false,
			visible : false
		},
		initialize: function( options ){
			var self = this;
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			//
			_.bindAll(this, 'render', 'clickExternal', 'postRender');
			// find the data
			this.data = this.data || this.model || this.collection || null;
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
				this.template = (typeof Template == "function") ? new Template(html, { url : this.url() }) : Template;
				if( self.options.autoRender ) this.template.bind("loaded", this.render);
			} else if( this.options.url ) {
				// fallback to the underscore template
				$.get(this.url(), function( html ){
					self.template = _.template( html );
					if( self.options.autoRender ) self.render();
				});
			} else {
				this.template = _.template( html );
				if( self.options.autoRender ) this.render();
			}
			// add listeners
			if( this.options.data && !_.isUndefined( this.data.on ) ){
				this.data.on( this.options.bind, this.render);
			}
			// #11 : initial render only if data is not empty (or there are no data)
			if( this._initRender() ){
				this.render();
			}
			// #36 - Adding resize event
			$(window).bind("resize", _.bind(this._resize, this));
			// #69 adding scroll monitor
			$(window).scroll( function(){ self.trigger("scroll"); });
			// initiate parent (states etc.)
			return Backbone.View.prototype.initialize.call( this, options );
		},
		// #71 parse URL in runtime (optionally)
		url: function(){
			return (typeof this.options.url == "function")? this.options.url() : this.options.url;
		},

		preRender: function(){
		},

		render: function(){
			// prerequisite
			if( !this.template ) return;
			// execute pre-render actions
			this._preRender();
			//
			var template = ( this.options.type ) ? this.template.get( this.options.type ) : this.template;
			var data = this._getJSON();
			// #43 - adding options to the template data
			var json = ( this.options.inRender ) ? { data : data, options: this.options } : data;
			// #19 - checking instance of template before executing as a function
			var html = ( template instanceof Function ) ? template( json ) : template;
			// #64 find the render target
			var $container = this._findContainer();
			// #66 if parent is the render target, html is the element
			if( this.options.parentEl && (this.options.parentEl === this.options.renderTarget) ){
				this.el = this.$el = $(html);
				// fix to ensure what's inserted in the dom is 'connected' to element
				html = this.el;
			}
			if( this.options.append ){
				$container.append( html );
			} else {
				$container.html( html );
			}
			// execute post-render actions
			this._postRender();
		},

		postRender: function(){
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
		// attach to an event for a tab like effect
		clickTab: function(e){
			e.preventDefault();
			var section = this.findLink(e.target);
			$(this.el).find( section ).show().siblings().hide();
			// optionally add selected class if li available
			$(e.target).parent("li").addClass("selected").siblings().removeClass("selected");
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

		_initRender: function(){
			if( !this.options.autoRender ) return false;
			var hasMarkup = (this.options.html || this.options.url );
			var hasData = (this.options.data && ( _.isUndefined( this.data.toJSON ) || ( !_.isUndefined( this.data.toJSON ) && !_.isEmpty(this.data.toJSON()))));
			// if there's markup and no data, render
			if( hasMarkup && !this.options.data) return true;
			// if there's data and data is available, render
			if( hasData ) return true;
			return false;
		},

		_preRender: function(){
			// app-specific actions
			this.preRender();
		},

		_postRender: function(){
			// make sure the container is presented
			if( !this.options.silentRender ) $(this.el).show();
			// remove loading state (if data has arrived)
			if( !this.options.data || (this.options.data && !_.isEmpty(this._getJSON()) ) ){
				$(this.el).removeClass("loading");
				// set the appropriate flag
				this.state.loaded = true;
				// bubble up the event
				this.trigger("loaded");
			}
			// app-specific actions
			this.postRender();
		},

		// get the JSON of the data
		_getJSON: function(){
			if( !this.options.data ) return {};
			if( this.data.toJSON ) return this.data.toJSON();
			return this.data;
		},

		_findContainer: function(){
			// by default
			var container = this.el;

			if ( !this.options.renderTarget ){
				// do nothing more

			} else if ( typeof this.options.renderTarget == "string" ){

				container = $(this.el).find(this.options.renderTarget).first();

			} else if( typeof this.options.renderTarget == "object" ){

				container = this.options.renderTarget;
			}

			// convert into a jQuery object if needed
			return ( container instanceof jQuery) ? container : $(container);

		},

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
			clearTimeout( timeout );
			timeout = setTimeout( function () {
				self.resize.apply( self , Array.prototype.slice.call( args ) );
			} , delay);
		},

		//
		_scroll: function () {
			//this.state.scroll = true;
		},
		// checks if the view is visible
		isVisible: function(){

			var viewportWidth = jQuery(window).width(),
				viewportHeight = jQuery(window).height(),

				documentScrollTop = jQuery(document).scrollTop(),
				documentScrollLeft = jQuery(document).scrollLeft(),

				minTop = documentScrollTop,
				maxTop = documentScrollTop + viewportHeight,
				minLeft = documentScrollLeft,
				maxLeft = documentScrollLeft + viewportWidth,

				$el = $(this.el),
				elementOffset = $el.offset();
			// condition
			var visible = ( (elementOffset.top >= minTop && elementOffset.top < maxTop) && (elementOffset.left >= minLeft && elementOffset.left < maxLeft) );
			// trigger state if needed
			if( visible && !this.state.visible ){
				this.trigger("visible");
			} else {
				this.trigger("hidden");
			}
			// save state for later...
			this.state.visible = visible;

			return visible;
		}

	});

})(this._, this.Backbone, this.jQuery);
