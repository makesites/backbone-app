// Backbone Extender
// Extending objects like events and options when using extend() in main constructors
//
// Source: https://gist.github.com/tracend/5425415
(function(_, Backbone){

	var origExtend = Backbone.Model.extend;

	var extend = function(protoProps, staticProps) {

		var parent = this;
		var child;

		if (protoProps){
			_.each(protoProps, function(value, key){
				// exit now if the types can't be extended
				if( typeof value == "string" || typeof value == "boolean" ) return;
				// modify only the objects that are available in the parent
				if( key in parent.prototype && !(value instanceof Function) && !(parent.prototype[key] instanceof Function) && !(value instanceof Backbone.Model) && !(parent.prototype[key] instanceof Backbone.Model) && !(value instanceof Backbone.Collection) && !(parent.prototype[key] instanceof Backbone.Collection) ){
					protoProps[key] = _.extend({}, parent.prototype[key], value);
				}
			});
		}

		// FIX: can't use original .extend to contain child prototype
		//return origExtend.call(this, protoProps, staticProps);

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
			child = protoProps.constructor;
		} else {
			child = function(){ return parent.apply(this, arguments); };
		}

		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function(){ this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		child.prototype = Object.create(new Surrogate());

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps) child.prototype = _.extend({}, child.prototype, protoProps);

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;

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
