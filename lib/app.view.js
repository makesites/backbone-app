(function(_, Backbone, $) {
	
	View =  Backbone.View.extend({
		// events
		events: {
			"click a[rel='external']" : "clickExternal"
		},
		initialize: function(){
			_.bindAll(this, 'render', 'clickExternal'); 
			// find the data
			this.data = this.model || this.collection || null;
			//
			//_.extend({name : 'moe'}, {age : 50});
			if( ! this.options.type ) this.options.type = "default";
			// compile
			var html = this.options.html || null;
			var options = {};
			if(this.options.url) options.url = this.options.url;
			this.template = new Template(html, options);
			this.template.bind("loaded", this.render);
			// add listeners
            if( !_.isNull( this.data ) ){
                this.data.bind("change", this.render);
                this.data.bind("reset", this.render);
                this.data.bind("add", this.render);
                this.data.bind("remove", this.render);
            }
			// initial render
			this.render();
		},
		render: function(){
			var type = this.options.type;
			var template = this.template.get(type);
			var data = ( _.isNull(this.data) ) ? {} : this.data.toJSON();
			if( !_.isUndefined( template ) ) { 
				var html = template( data );
                if( this.options.append ){
					$(this.el).append( html );
                } else {
					$(this.el).html( html );
                }
			}
		}, 
		// a more descreete way of binding events triggers to objects
        listen : function( obj, event, callback ){
            // adds event listeners to the data
            var e = ( typeof event == "string")? [event] : event;
            for( var i in e ){
                obj.bind(e[i], callback);
            }
            
        }, 
		clickExternal: function(e){
			e.preventDefault();
			var url = this.findLink(e.target);
			// track the click with Google Analytics (if available)
			if( !_.isUndefined(pageTracker) ) url = pageTracker._getLinkerUrl(url);
			window.open(url, '_blank'); 
			return false; 
		}, 
		findLink: function (obj) {
			if (obj.tagName != "A") {
				return $(obj).closest("a").attr("href");
			} else {
				return $(obj).attr("href");
			}
		}
	});
	
})(this._, this.Backbone, this.jQuery);