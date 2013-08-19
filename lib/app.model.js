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
			if( this.options.autofetch && !_.isUndefined(this.url) ){
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