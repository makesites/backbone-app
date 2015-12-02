// Backbone Extender
// Extending objects like events and options when using extend() in main constructors
//
// Source: https://gist.github.com/tracend/5425415
(function(_, Backbone){

	var origExtend = Backbone.Model.extend;

	var extend = function(protoProps, staticProps) {

		var parent = this;

		if (protoProps){
			_.each(protoProps, function(value, key){
				// exit now if the types can't be extended
				if( typeof value == "string" || typeof value == "boolean" ) return;
				// modify only the objects that are available in the parent
				if( key in parent.prototype && !(value instanceof Function) && !(parent.prototype[key] instanceof Function) ){
					protoProps[key] = _.extend({}, parent.prototype[key], value);
				}
			});
		}

		return origExtend.call(this, protoProps, staticProps);
	};

	// Set up inheritance for the model, collection, router, view and history.
	Backbone.Model.extend = Backbone.Collection.extend = Backbone.Router.extend = Backbone.View.extend = extend;

	// Plus add a whildcard _extend_ that behaves like Array's concat
	Backbone.extend = function(){
		var classes = Array.prototype.slice.call(arguments, 0);
		// prerequisites
		if( !classes.length ) return;
		var Class = classes.shift(); // pick first element
		// loop through classes
		for( var i in classes ){
			var Child = classes[i];
			//var Parent = Class.extend({}); // clone...
			var Parent = Class;

			var proto = ( Child.prototype ) ? Child.prototype : Child;
			// only object accepted (lookup instance of Backbone...?)
			if(typeof proto !== "object" ) continue;
			// clone methods
			//var methods = Object.create( proto ); // why not working??
			var methods = _.extend({}, proto);
			// FIX delete old parent reference
			delete methods._parent;
			// save reference to parent class
			methods._parent = Parent; // add this only if not the final loop
			// extend parent
			Class = Parent.extend( methods );
		}
		return Class;
	};

})(_, Backbone);
