/**@license
 * backbone-app <>
 * Version: 0.8.3 (Wed, 30 Jan 2013 01:49:12 GMT)
 * License: 
 */
 
 // stop processing if APP is already part of the namespace
var APP = window.APP || (function(_, Backbone) {
	
	// App contructor
	APP = function(){
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
		var controller = (router && APP.Routers[router]) ? new APP.Routers[router]() : new APP.Routers.Default();
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
(function(_, Backbone, $) {
	
	// Helpers
	// this is to enable  syntax to simple _.template() calls
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g
	};
	
})(this._, this.Backbone, this.jQuery);
(function(_, Backbone) {
	
	// **Main constructors**
	APP.Model = Backbone.Model.extend({
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
		// Helper - DELETE if the sync is not needed any more...
		getValue : function(object, prop) {
			if (!(object && object[prop])) return null;
			return _.isFunction(object[prop]) ? object[prop]() : object[prop];
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
		// initialization (if not overriden)
		initialize: function(models, options){
			// save options for later
			this.options = options || {};
			// auto-fetch if no models are passed
			if( _.isNull(models) ){ 
				this.fetch();
			}
		}, 
		// DEPRECATED variables
		attributes: {
		}, 
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
		update:  function(){

		}, 
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
		// events
		events: {
			"click a[rel='external']" : "clickExternal"
		},
		initialize: function(){
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			//
			_.bindAll(this, 'render', 'clickExternal', 'postRender'); 
			// find the data
			this.data = this.model || this.collection || null;
			//
			if( _.isUndefined( this.options.type) ) this.options.type = "default";
			// #9 optionally add a reference to the view in the container
			if( this.options.attr ) {
				$(this.el).attr("data-view", this.options.attr );
			} else { 
				$(this.el).removeAttr("data-view");
			}
			// compile
			var html = this.options.html || null;
			var options = {};
			if(this.options.url) options.url = this.options.url;
			// #18 - supporting custom templates
			var Template = (this.options.template) ? this.options.template : APP.Template;
			this.template = new Template(html, options);
			this.template.bind("loaded", this.render);
			// add listeners
            if( !_.isNull( this.data ) ){
                this.data.bind("change", this.render);
                this.data.bind("reset", this.render);
                this.data.bind("add", this.render);
                this.data.bind("remove", this.render);
            }
			// #11 : initial render only if data is not empty
			if( !_.isNull( this.data ) && !_.isEmpty(this.data.toJSON()) ){ 
				this.render();
			}
		},
		render: function(){
			// execute pre-render actions
			if( !_.isUndefined(this.preRender) ) this.preRender();
			// 
			var type = this.options.type;
			var template = this.template.get(type);
			var data = ( _.isNull(this.data) ) ? {} : this.data.toJSON();
			if( !_.isUndefined( template ) ) { 
				// #19 - checking instance of template before executing as a function
				var html = ( template instanceof Function ) ? template( data ) : template;
                if( this.options.append ){
					$(this.el).append( html );
                } else {
					$(this.el).html( html );
                }
			}
			// execute post-render actions
			if( !_.isUndefined(this.postRender) ) this.postRender();
		}, 
		postRender: function(){
			// make sure the container is presented
			$(this.el).show();
		}, 
		// a more descreete way of binding events triggers to objects
        listen : function( obj, event, callback ){
            // adds event listeners to the data
            var e = ( typeof event == "string")? [event] : event;
            for( var i in e ){
                obj.bind(e[i], callback);
            }
            
        }, 
		clickExternal: function(e){
			e.preventDefault();
			var url = this.findLink(e.target);
			// track the click with Google Analytics (if available)
			if( !_.isUndefined(pageTracker) ) url = pageTracker._getLinkerUrl(url);
			window.open(url, '_blank'); 
			return false; 
		}, 
		findLink: function (obj) {
			if (obj.tagName != "A") {
				return $(obj).closest("a").attr("href");
			} else {
				return $(obj).attr("href");
			}
		}
	});
	
})(this._, this.Backbone, this.jQuery);
(function(_, Backbone, $) {
	
	/* Main layout */
	APP.Layout = Backbone.View.extend({
		// events
		events: {},
		initialize: function(){
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			// bind event to this object
			//_.bindAll(this); 
			
		}
	});
	
})(this._, this.Backbone, this.jQuery);
(function(_, Backbone, $) {
	
	APP.Template = Backbone.Model.extend({
		initialize: function(html, options){
			_.bindAll(this, 'fetch','parse'); 
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
		initialize: function(){
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
		_trackPageview: function(){ 
			var url = Backbone.history.getFragment();
			if( !_.isUndefined( _gaq ) ) _gaq.push(['_trackPageview', "/#"+url]);
		}
		
	});
	
})(this._, this.Backbone);