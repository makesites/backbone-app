(function(_, Backbone, $) {
	
	APP.View =  Backbone.View.extend({
		options : {
			data : false
		}, 
		// events
		events: {
			"click a[rel='external']" : "clickExternal"
		}, 
		initialize: function(){
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			//
			_.bindAll(this, 'render', 'clickExternal', 'postRender'); 
			// find the data
			this.data = this.model || this.collection || null;
			this.options.data  = !_.isNull( this.data );
			//
			if( _.isUndefined( this.options.type) ) this.options.type = "default";
			// #9 optionally add a reference to the view in the container
			if( this.options.attr ) {
				$(this.el).attr("data-view", this.options.attr );
			} else { 
				$(this.el).removeAttr("data-view");
			}
			// compile
			var html = this.options.html || null;
			var options = {};
			if(this.options.url) options.url = this.options.url;
			// #18 - supporting custom templates
			var Template = (this.options.template) ? this.options.template : APP.Template;
			this.template = new Template(html, options);
			this.template.bind("loaded", this.render);
			// add listeners
            if( this.options.data ){
                this.data.bind("change", this.render);
                this.data.bind("reset", this.render);
                this.data.bind("add", this.render);
                this.data.bind("remove", this.render);
            }
			// #11 : initial render only if data is not empty (or there are no data)
			if( !this.options.data || (this.options.data && !_.isEmpty(this.data.toJSON()) ) ){ 
				this.render();
			}
		},
		render: function(){
			// execute pre-render actions
			if( !_.isUndefined(this.preRender) ) this.preRender();
			// 
			var type = this.options.type;
			var template = this.template.get(type);
			var data = ( this.options.data ) ? {} : this.data.toJSON();
			if( !_.isUndefined( template ) ) { 
				// #19 - checking instance of template before executing as a function
				var html = ( template instanceof Function ) ? template( data ) : template;
                if( this.options.append ){
					$(this.el).append( html );
                } else {
					$(this.el).html( html );
                }
			}
			// execute post-render actions
			if( !_.isUndefined(this.postRender) ) this.postRender();
		}, 
		postRender: function(){
			// make sure the container is presented
			$(this.el).show();
			// remove loading state (if data has arrived)
			if( !this.options.data || (this.options.data && !_.isEmpty(this.data.toJSON()) ) ){ 
				$(this.el).removeClass("loading");
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
			if(typeof pageTracker != "undefined") url = pageTracker._getLinkerUrl(url);
			// #22 - Looking for Phonegap ChildBrowser in external links
			try{
				window.plugins.childBrowser.showWebPage( url );
			} catch( exp ){
				// revert to the redular load
				window.open(url, '_blank'); 
			}
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