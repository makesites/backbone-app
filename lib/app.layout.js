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