(function(_, Backbone, $, APP) {
	// containers
	var state = Backbone.View.prototype.state || new Backbone.Model();
	// defaults
	state.set({
		loaded : false,
		scroll : false,
		visible : false
	});

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
			renderTarget: false,
			saveOptions: true // eventually disable this (test first)
		},
		// events
		events: {
			"click a[rel='external']" : "clickExternal"
		},
		// states
		states: {
			"scroll": "_scroll"
		},

		state: state,

		initialize: function( options ){
			var self = this;
			// fallback
			options = options || {};
			// #39 - backbone > 1.0 does not extend options automatically... (condition this?)
			this.options = _.extend({}, this.options, options);
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			//
			_.bindAll(this, 'render', 'clickExternal', 'postRender', '_url', '_toJSON');
			if( typeof this.url == "function" ) _.bindAll(this, 'url');
			// #73 - optionally saving options
			if( this.options.saveOptions ) this.options = _.extend(this.options, options);
			// find the data
			this.data = this.data || this.model || this.collection || null;
			this.options.data  = !_.isNull( this.data );

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
			// #76 considering url as a flat option
			if( this.url && !this.options.url) this.options.url = this.url; // check for string?
			// #72 - include init options in url()
			var url = this._url( options );
			// proxy internal method for future requests
			this.url = this._url;

			if( Template ) {
				// set the type to default (as the Template expects)
				if( !this.options.type ) this.options.type = "default";
				this.template = (typeof Template == "function") ? new Template(html, { url : url }) : Template;
				if( self.options.autoRender ) this.template.bind("loaded", this.render);
			} else if( url ) {
				// fallback to the underscore template
				$.get(url, function( html ){
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
			// initiate parent (states etc.)
			return Backbone.View.prototype.initialize.call( this, options );
		},
		// #71 parse URL in runtime (optionally)
		_url: function( options ){
			// fallback
			options = options || {};
			var url = options.url || this.options.url;
			return (typeof url == "function")? url() : url;
		},

		preRender: function(){
		},

		// Render view
		// placing markup in the DOM
		render: function(){
			// prerequisite
			if( !this.template ) return;
			// execute pre-render actions
			this._preRender();
			//
			var template = ( this.options.type ) ? this.template.get( this.options.type ) : this.template;
			var data = this.toJSON();
			// #19 - checking instance of template before executing as a function
			var html = ( template instanceof Function ) ? template( data ) : template;
			var $el;
			// #64 find the render target
			var $container = this._findContainer();
			// saving element reference
			if( !this.el ){
				$el = $( html );
				this.el = this.$el = $el;
			}
			// make sure the element is attached to the DOM
			this._inDOM();
			// ways to insert the markup
			if( this.options.append ){
				$el = $el || $( html );
				$container.append( $el );
			} else if( this.options.prepend ){
				$el = $el || $( html );
				$container.prepend( $el );
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

		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		toJSON: function(){
			var data = this._toJSON();
			// #43 - adding options to the template data
			return ( this.options.inRender ) ? { data : data, options: this.options } : data;
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
			if( !this.options.data || (this.options.data && !_.isEmpty(this._toJSON()) ) ){
				$(this.el).removeClass("loading");
				// set the appropriate flag
				this.state.set("loaded", true);
				// bubble up the event
				this.trigger("loaded");
			}
			// app-specific actions
			this.postRender();
		},

		// get the JSON of the data
		_toJSON: function(){
			if( !this.options.data ) return {};
			if( this.data.toJSON ) return this.data.toJSON();
			return this.data; // in case the data is a JSON...
		},

		// - container is defined in three ways
		// * renderTarget is the element
		// * renderTarget inside the element
		// * renderTarget outside the element (bad practice?)
		_findContainer: function(){
			// by default
			var container = this.el;

			if ( !this.options.renderTarget ){
				// do nothing more

			} else if( typeof this.options.renderTarget == "string" ){

				container = $(this.el).find(this.options.renderTarget).first();
				if( !container.length ){
					container = $(this.options.renderTarget).first(); // assume this always exists...
				}

			} else if( typeof this.options.renderTarget == "object" ){

				container = this.options.renderTarget;

			}

			// convert into a jQuery object if needed
			return ( container instanceof jQuery) ? container : $(container);

		},

		// checks if an element exists in the DOM
		_inDOM: function( $el ){
			// fallbacks
			$el = $el || this.$el;
			// prerequisites
			if( !$el ) return false;
			// variables
			var exists = false;
			var parent = this.options.parentEl || "body";
			// check parent element
			exists = $(this.options.parentEl).find( $el ).length;
			if( exists ) return true;
			// el not in parent el
			if( this.options.parentPrepend ){
				$(this.options.parentEl).prepend( $el );
			} else {
				$(this.options.parentEl).append( $el );
			}
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
			//this.state.set("scroll", true);
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
			if( visible && !this.state.get("visible") ){
				this.trigger("visible");
			} else {
				this.trigger("hidden");
			}
			// save state for later...
			this.state.set("visible", visible);

			return visible;
		}

	});

})(_, Backbone, $, APP);
