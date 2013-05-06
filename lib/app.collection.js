(function(_, Backbone) {
	
	APP.Collection = Backbone.Collection.extend({
        
        options: {}, 
        
		// initialization (if not overriden)
		initialize: function( options ){
			// save options for later
			this.options = options || {};
			// auto-fetch if no models are passed
			if( _.isNull(models) ){ 
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
		// - check if the app is online
		isOnline: function(){
			return ( !_.isUndefined( app ) ) ? app.state.online : true;
		}, 
        
        // extract data (and possibly filter keys)
        output: function(){
            // in most cases it's a straight JSON output
            return this.toJSON();
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