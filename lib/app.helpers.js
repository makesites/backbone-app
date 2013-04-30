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
                protoProps[key] = _.extend({}, value, parent.prototype[key]);
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
	// this is to enable {{moustache}} syntax to simple _.template() calls
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