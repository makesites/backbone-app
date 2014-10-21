(function(Backbone){
	
	Backbone.inherit = function(){
		var classes = Array.prototype.slice.call(arguments, 0);
		// prerequisites
		if( !classes.length ) return;
		var Class = classes.pop();
		
		// loop through objects
		for( var i in classes){
			var Child = classes[i];
			var Parent = Class;
			Class = Parent.extend( Child.prototype );
			// Override the parent constructor
			// Child prototype.constructor
			/*
			var Child = function(){
				Parent.apply(this, arguments);
			};
			*/
		}
		// add local inherit 
		Class.prototype.inherit = inherit;
		return Class;
	};

	// local inherit
	function inherit(){
		var classes = arguments;
		// include this in classes (at the front)
		classes = classes.unshift(this);
		Backbone.inherit.apply( this, arguments );
	}
		
})(this.Backbone);
