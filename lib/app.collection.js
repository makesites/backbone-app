(function(_, Backbone) {
	
	APP.Collection = Backbone.Collection.extend({
        
        options: {
            _synced : false
        }, 
        
        model: APP.Model, 
        
		// initialization (if not overriden)
		initialize: function( models, options ){
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