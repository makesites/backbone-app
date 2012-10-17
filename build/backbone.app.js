(function(_, Backbone) {
	
	// App contructor
	APP = function(){
		var router = false;
		// check URIs
		var path = window.location.pathname.split( '/' );
		// find a router based on the path
		for( i in path ){
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
	}
	
	// Namespace definition
	APP.Models = {};
	APP.Routers = {};
	APP.Collections = {};
	APP.Views = {};
	APP.Templates = {};
	
  	// **Main constructors**
	Model = Backbone.Model.extend({
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
			options || (options = {});
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
	
  	Collection = Backbone.Collection.extend({
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
			for( key in attr ){ 
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
	
	View =  Backbone.View.extend({
		// events
		events: {
			"click a[rel='external']" : "clickExternal"
		},
		initialize: function(){
			_.bindAll(this, 'render'); 
			// find the data
			this.data = this.model || this.collection;
			//
			//_.extend({name : 'moe'}, {age : 50});
			this.options.type || (this.options.type = "default");
			// compile
			var html = this.options.html || null;
			var options = {};
			if(this.options.url) options.url = this.options.url;
			this.template = new Template(html, options);
			this.template.bind("loaded", this.render);
			// add listeners
			this.data.bind("change", this.render);
			this.data.bind("reset", this.render);
			this.data.bind("add", this.render);
			this.data.bind("remove", this.render);
			// initial render
			this.render();
		},
		render: function(){
			var type = this.options.type;
			var template = this.template.get(type);
			if( !_.isUndefined( template ) ) { 
				var html = template( this.data.toJSON() );
				$(this.el).html( html );
			}
		}, 
		clickExternal: function(e){
			window.open($(e.target).attr("href"), '_blank'); return false; 
		}
	});
	
	Router = Backbone.Router.extend({
		// Save app state in a seperate object
		state: {
			fullscreen: false, 
			online: navigator.onLine,
			browser: function(){ 
							if( $.browser.safari && /chrome/.test(navigator.userAgent.toLowerCase()) ) return 'chrome';
							if(/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent) ) return 'ios';
							return 'other';
						}
		}
		
	});
	
	Template = Backbone.Model.extend({
		initialize: function(html, options){
			_.bindAll(this, 'fetch','parse'); 
			if( !_.isEmpty(html) ){
				this.set( "default", this.compile( html ) );
				this.trigger("loaded");
			}
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
			var scripts = $(data).filter("script");
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
	
	
	// Helpers
	// this is to enable {{moustache}} syntax to simple _.template() calls
	_.templateSettings = {
		interpolate : /\{\{(.+?)\}\}/g
	};
	
	
})(this._, this.Backbone);