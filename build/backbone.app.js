/**
 * @name backbone.app
 * @author makesites
 * Homepage: http://github.com/makesites/backbone-app
 * Version: 0.9.0 (Tue, 13 Aug 2013 07:58:25 GMT)
 * @license Apache License, Version 2.0
 */

 // stop processing if APP is already part of the namespace
if( !window.APP ) (function(_, Backbone) {

	// App contructor
	APP = function(){
		// get config
		var options = arguments[0] || {};
		// find router
		var router = false;
		// check URIs
		var path = window.location.pathname.split( '/' );
		// find a router based on the path
		for(var i in path ){
			// discart the first item if it's empty
			if( path[i] === "") continue;
			router = (path[i].charAt(0).toUpperCase() + path[i].slice(1));
			// stop if we've found a router
			if(typeof(APP.Routers[router]) == "function") break;
		}
		// call the router or fallback to the default
		var controller = (router && APP.Routers[router]) ? new APP.Routers[router]( options ) : new APP.Routers.Default( options );
		// return controller so it's accessible through the app global
		return controller;
	};

	// Namespace definition
	APP.Models = {};
	APP.Routers = {};
	APP.Collections = {};
	APP.Views = {};
	APP.Layouts = {};
	APP.Templates = {};

})(this._, this.Backbone);

// Backbone Extender
// Source: https://gist.github.com/tracend/5425415
(function(_, Backbone){

var origExtend = Backbone.Model.extend;

var extend = function(protoProps, staticProps) {

	var parent = this;

	if (protoProps){
		_.each(protoProps, function(value, key){
			// modify only the objects that are available in the parent
			if( key in parent.prototype && !(value instanceof Function) && !(parent.prototype[key] instanceof Function) && (parent.prototype[key] instanceof Object) ){
				// the routes need to be processed in reverse (as order matters)
				protoProps[key] = ( key == "routes" ) ? _.extend({}, value, parent.prototype[key]) : _.extend({}, parent.prototype[key], value );
			}
		});
	}

	return origExtend.call(this, protoProps, staticProps);
};

	// Set up inheritance for the model, collection, router, view and history.
	Backbone.Model.extend = Backbone.Collection.extend = Backbone.Router.extend = Backbone.View.extend = extend;

})(this._, this.Backbone);


// Underscore
(function(_, Backbone, $) {

	// Helpers
	// this is to enable  syntax to simple _.template() calls
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g,
		variable : "."
	};

	// if available, use the Handlebars compiler
	if(typeof Handlebars != "undefined"){
		_.mixin({
			template : Handlebars.compile
		});
	}
})(this._, this.Backbone, this.jQuery);

/*
 * Backbone.ready()
 * Source: https://gist.github.com/tracend/5617079
 *
 * by Makis Tracend( @tracend )
 *
 * Usage:
 * Backbone.ready( callback );
 *
 */
(function(window, document, Backbone){

	// find the $
	$ = ('$' in window) ? window.$ : window.jQuery || window.Zepto || false;

	Backbone.ready = function( callback ){

		if( PhoneGap && PhoneGap.init ){
			// Support Phonegap Shim: https://github.com/makesites/phonegap-shim
			return PhoneGap.init( callback );

		} else if( $ ) {
			// use the 'default' ready event
			return $(document).ready( callback );

		} else if (window.addEventListener) {
			// ultimate fallback, add window event - trigger the page as soon it's loaded
			return window.addEventListener('load', callback, false);

		} else {
			// IE...
			return window.attachEvent('onload', callback);
		}

	};

	return Backbone;

})(window, document, this.Backbone);



(function(_, Backbone) {

	// **Main constructors**
	APP.Model = Backbone.Model.extend({

		options: {
			autofetch: false
		},

		// initialization
		initialize: function( model, options ){
			// save options for later
			options = options || {};
			this.options = _.extend({}, this.options, options);
			// auto-fetch if no models are passed
			if( this.options.autofetch && _.isEmpty(models) && this.url ){
				this.fetch();
			}
		},

		// cache all data to localstorage
		cache: function(){
			// construct a cache mechanism, using localstorage or other...
		},
		// Helper functions
		// - check if the app is online
		isOnline: function(){
			return ( !_.isUndefined( app ) ) ? app.state.online : true;
		},
		// FIX: override sync to support DELETE method (411 error on NGINX)
		// issue: http://serverfault.com/q/396020
		/*
		sync : function(method, model, options) {
			var methodMap = { 'create': 'POST', 'update': 'PUT', 'delete': 'DELETE', 'read':   'GET' };
			var type = methodMap[method];
			var opt = options || (options = {});
			var params = {type: type, dataType: 'json', data: {}};

			if (!options.url) {
				params.url = this.getValue(model, 'url') || urlError();
			}

			if (!options.data && model && (method == 'create' || method == 'update')) {
				params.contentType = 'application/json';
				params.data = JSON.stringify(model.toJSON());
			}

			if (params.type !== 'GET' && !Backbone.emulateJSON) {
				params.processData = false;
			}

			return $.ajax(_.extend(params, options));
		},
		*/
		// Helper - DELETE if the sync is not needed any more...
		getValue : function(object, prop) {
			if (!(object && object[prop])) return null;
			return _.isFunction(object[prop]) ? object[prop]() : object[prop];
		},

		parse: function(data){
			var self = this;
			setTimeout(function(){ self.trigger("fetch"); }, 200); // better way to trigger this after parse?
			return data;
		},

		// extract data (and possibly filter keys)
		output: function(){
			// in most cases it's a straight JSON output
			return this.toJSON();
		}

	});


	// *** Extensions ***

	MongoModel = APP.Model.extend({

		parse: function( data ){
			//console.log(data);
			// "normalize" result with proper ids
			if(data._id){
				data.id = data._id;
				delete data._id;
			}
			return data;
		}
	});

})(this._, this.Backbone);
(function(_, Backbone) {

	APP.Collection = Backbone.Collection.extend({

		options: {
			_synced : false,
			autofetch: false
		},

		model: APP.Model,

		// initialization
		initialize: function( models, options ){
			// save options for later
			options = options || {};
			this.options = _.extend({}, this.options, options);
			// auto-fetch if no models are passed
			if( this.options.autofetch && _.isEmpty(models) && this.url ){
				this.fetch();
			}
		},
		/*
		// DEPRECATED variables
		attributes: {
		},
		*/
		/*
		// A custom add function that can prevent models with duplicate IDs
		// from being added to the collection. Usage:
		add: function(models, options) {

			// empty list of objects
			var modelsToAdd = {};

			// add in an array if only one item
			models = _.isArray(models) ? models.slice() : [models];

			_.each(models, function(model) {

				if ( _.isUndefined(model.id) ) {
					// no id = no way to verify the identity
					// we have to assume this is an new model
					modelsToAdd["add_model_"+ Math.random() ] = model;
				} else if ( _.isUndefined( this.get(model.id) ) ) {
					// add them this way to avoid duplicates on the same set
					modelsToAdd[model.id] = model;
				} else {
					// merge with existing
					this.set(model);
				}
			}, this);

			// finally convert list to an array
			modelsToAdd = _.toArray( modelsToAdd );

			return Backbone.Collection.prototype.add.call(this, modelsToAdd, options);
		},
		// a custom set() method to merge with existing models
		set: function( model) {
			var model_in_array = this.get(model.id);
			var updated_model = _.extend(model_in_array, model);
			this.remove(model_in_array);
			this.add(updated_model);
		},
		*/
		update:  function(){

		},

		// #41 - save action for collections
		save: function(){
			var self = this;
			var method = this.isNew() ? 'create' : 'update';
			//
			Backbone.sync(method, this, {
				success: function(){
					// console.log('data saved!');
					self.options._synced = true;
				}
			});
		},

		/*
		// Helper functions
		// - set an attribute
		setAttr: function( attr ) {
			for(var key in attr ){
				this.attributes[key] = attr[key];
			}
		},
		// - get an attribute
		getAttr: function( attr ) {
			return this.attributes[attr];
		},
		*/

		parse: function(data){
			var self = this;
			setTimeout(function(){ self.trigger("fetch"); }, 200); // better way to trigger this after parse?
			return data;
		},

		// extract data (and possibly filter keys)
		output: function(){
			// in most cases it's a straight JSON output
			return this.toJSON();
		},

		isNew: function() {
			return this.options._synced === false;
		},

		// - check if the app is online
		isOnline: function(){
			return ( !_.isUndefined( app ) ) ? app.state.online : true;
		}

	});


	// *** Extensions ***

	MongoCollection = APP.Collection.extend({

		parse: function( data ){
			//console.log(data);
			// "normalize" result with proper ids
			for(var i in data){
				data[i].id = data[i]._id;
				delete data[i]._id;
			}
			return data;
		}
	});

})(this._, this.Backbone);
(function(_, Backbone, $) {

	APP.View =  Backbone.View.extend({
		options : {
			data : false,
			html: false,
			template: false,
			url : false,
			type: false,
			inRender: false,
			silentRender: false
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

		preRender: function(){
		},

		render: function(){
			// prerequisite
			if( !this.template ) return;
			// execute pre-render actions
			this._preRender();
			//
			var template = ( this.options.type ) ? this.template.get( this.options.type ) : this.template;
			var data = ( this.options.data ) ? this.data.toJSON() : {};
			// #43 - adding options to the template data
			var json = ( this.options.inRender ) ? { data : data, options: this.options } : data;
			// #19 - checking instance of template before executing as a function
			var html = ( template instanceof Function ) ? template( json ) : template;
			if( this.options.append ){
				$(this.el).append( html );
			} else {
				$(this.el).html( html );
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

		_preRender: function(){
			// app-specific actions
			this.preRender();
		},

		_postRender: function(){
			// make sure the container is presented
			if( !this.options.silentRender ) $(this.el).show();
			// remove loading state (if data has arrived)
			if( !this.options.data || (this.options.data && !_.isEmpty(this.data.toJSON()) ) ){
				$(this.el).removeClass("loading");
				// set the appropriate flag
				this.state.loaded = true;
				// bubble up the event
				this.trigger("loaded");
			}
			// app-specific actions
			this.postRender();
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
		}
	});

})(this._, this.Backbone, this.jQuery);

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
			_.bindAll(this);
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

		findLink: function (target) {
			if (target.tagName != "A") {
				return $(target).closest("a").attr("href");
			} else {
				return $(target).attr("href");
			}
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
			if( app.state.standalone() ){
				var url = this.findLink(e.target);
				if( _.isEmpty(url) || url.substr(0,1) == "#" ){
					// this is not a valid link
				} else {
					// block default behavior
					e.preventDefault();
					window.location = url;
					return false;
				}
			}
			// otherwise pass through...
		}

	});

})(this._, this.Backbone, this.jQuery);

(function(_, Backbone, $) {

	APP.Template = Backbone.Model.extend({
		initialize: function(html, options){
			_.bindAll(this, 'fetch', 'parse');
			// fallback for options
			var opt = options || (options={});

			if( !_.isEmpty(html) ){
				this.set( "default", this.compile( html ) );
				this.trigger("loaded");
			}
			//if( !_.isUndefined( options.url ) && !_.isEmpty( options.url ) ){
			if( options.url ){
				this.url = options.url;
				this.fetch();
			}
		},
		compile: function( markup ){
			return _.template( markup );
		},
		fetch: function(){
			// this can be replaced with a backbone method...
			$.get(this.url, this.parse);
		},
		parse: function(data){
			var self = this;
			var scripts;
			try{
				scripts = $(data).filter("script");
			} catch( e){
				// can't parse this - probly not html...
				scripts = [];
			}
			// check if there are script tags
			if( !scripts.length ){
				// save everything in the default attr
				this.set( "default", self.compile( data ) );
			} else {
				// loop through the scripts
				scripts.each(function(){
					// filter only scripts defined as template
					var el = $(this);
					if(el.attr("type").indexOf("template") >= 0){
						// convention: the id sets the key for the tmeplate
						self.set( el.attr("id"), self.compile( el.html() ) );
					}
				});
			}
			this.trigger("loaded");
			//return data;
		}
	});


	// *** Extensions ***

	// Supports a template written in markdown
	// ( showdown.js assumed loaded )
	// options:
	// - url : for a file containing the temaplte
	// - html : for a string directly used as the template
	//
	APP.Templates.Markdown = APP.Template.extend({

		initialize: function( html, options ){

			var showdown = new Showdown.converter();

			this.compile = showdown.makeHtml;

			return APP.Template.prototype.initialize.call( this, html, options );
		}

	});


})(this._, this.Backbone, this.jQuery);

(function(_, Backbone) {

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
			"_=_": "_fixFB",
			"access_token=:token": "access_token",
			"*path"  : "_404"
		},
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
				if( $.browser.safari && /chrome/.test(navigator.userAgent.toLowerCase()) ) return 'chrome';
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
			standalone: function(){ return (("standalone" in window.navigator) && window.navigator.standalone) || (typeof PhoneGap !="undefined" && !_.isUndefined(PhoneGap.env) && PhoneGap.env.app ); },
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
			this.bind('all', this._trackPageview);
			this.bind('all', this._layoutUpdate);

			// - monitor user's location
			if( this.options.location ){
				this._geoLocation();
			}
			// - setup session (+config), if namespace is available
			if( APP.Session ) this.session = new APP.Session({}, ( this.options.session || {} ));
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
		// tracking client-side "page" views
		_trackPageview: function(){
			var url = Backbone.history.getFragment();
			// check for Google Analytics
			if( typeof _gaq != "undefined" ) _gaq.push(['_trackPageview', "/#"+url]);
		},
		_layoutUpdate: function(path){
			//update the layout
			if(this.layout) this.layout.trigger("update", { navigate : true, path : path });
		},
		// - overriding default _bindRoutes
		_bindRoutes: function() {
			if (!this.routes) return;
			var route, routes = _.keys(this.routes);
			while (typeof (route = routes.pop()) !== "undefined") {
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

})(this._, this.Backbone);
