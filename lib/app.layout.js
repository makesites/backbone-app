(function(_, Backbone, $) {
	
	/* Main layout */
	APP.Layout = Backbone.View.extend({
		el: "body", 
		// events
		events: {},
		initialize: function(){
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			// bind event to this object
			//_.bindAll(this); 
			
		}, 
		render: function(){
			// remove loading class (if any)
			$(this.el).removeClass("loading");
		}
		
	});
	
})(this._, this.Backbone, this.jQuery);