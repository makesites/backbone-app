/**
 * @name backbone.app
 * @author makesites
 * Homepage: http://github.com/makesites/backbone-app
 * Version: 1.0.0 (Mon, 01 May 2023 01:46:44 GMT)
 * @license Apache License, Version 2.0
 */


(function (lib) {

	//"use strict";

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		var deps = ['jquery', 'underscore', 'backbone'];
		define('backbone.app', deps, lib); // give the module a name
	} else if ( typeof module === "object" && module && typeof module.exports === "object" ){
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = lib;
	} else {
		// Browser globals
		var Query = window.jQuery || window.Zepto || window.vQuery;
		lib(Query, window._, window.Backbone, window.APP);
	}
}(function ($, _, Backbone) {

	//"use strict";
	// better way to define global scope?
	var window = this.window || {};
	var APP = window.APP || false;

	// stop processing if APP is already part of the namespace
	if( !APP ) (function(_, Backbone) {

	// defaults =
	var defaults = {
		require: false,
		routePath: "app/controllers/",
		autoLookup: true,
		pushState: false
	};

	// App contructor
	APP = function(){
		// get config
		var options = arguments[0] || {};
		var callback = arguments[1] || function(){};
		// extend default options
		options.require = options.require || (typeof define === 'function' && define.amd);
		options = utils.extend( defaults, options );
		// find router
		var router = false;
		// check URIs
		var path = ( window.location ) ? window.location.pathname.split( '/' ) : [""];
		// FIX: discart the first item if it's empty
		if ( path[0] === "" ) path.shift();
		//
		if( options.require ){
			// use require.js
			var routerDefault = options.routePath +"default";
			if(typeof options.require == "string"){
				router = options.require;
			} else if( !options.autoLookup ){
				// don't try to lookup the router
				router = routerDefault;
			} else {
				router = options.routePath;
				router += ( !_.isEmpty(path[0]) ) ? path[0] : "default";
			}

			if( typeof require !== "undefined" ){
				require( [ router ], function( controller ){

					if( controller ){
						callback( controller );
					}

				}, function (err) {
					//The errback, error callback
					//The error has a list of modules that failed
					var failed = err.requireModules && err.requireModules[0];
					// what if there's no controller???
					if( failed == router ){
						// fallback to the default controller
						require( [ routerDefault ], function( controller ){
							callback( controller );
						});
					} else {
						//Some other error. Maybe show message to the user.
						throw err;
					}
				});

			} else {

				// assuming System.js
				System['import'](router).then(function( Controller ){

					if( Controller['default'] ){
						callback( Controller['default'] );
					}

				})['catch'](function(e) {
					// revert to the default router
					System['import'](routerDefault).then(function( Controller ){
						callback( Controller['default'] );
					});
				});

			}

			return APP;

		} else {
			// find a router based on the path
			for(var i in path ){
				// discart the first item if it's empty
				if( path[i] === "") continue;
				router = (path[i].charAt(0).toUpperCase() + path[i].slice(1));
				// stop if we've found a router
				if(typeof(APP.Routers[router]) == "function") break;
			}
			// call the router or fallback to the default
			var controller = (router && APP.Routers[router]) ? new APP.Routers[router]( options ) : new APP.Routers.Default( options );
			// return controller so it's accessible through the app global
			return controller;
		}
	};

	// Namespace definition
	APP.Models = {};
	APP.Routers = {};
	APP.Collections = {};
	APP.Views = {};
	APP.Layouts = {};
	APP.Templates = {};

	})(_, Backbone);


/**
 * @name backbone.easing
 * A View that has an interface for easing.js tweens
 *
 * Version: 0.2.3 (Wed, 02 Dec 2015 05:22:46 GMT)
 * Source: http://github.com/makesites/backbone-easing
 *
 * @author makesites
 * Initiated by: Makis Tracend (@tracend)
 * Distributed through [Makesites.org](http://makesites.org)
 *
 * @cc_on Copyright © Makesites.org
 * @license Released under the [MIT license](http://makesites.org/licenses/MIT)
 */

(function (lib) {

	//"use strict";

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		var deps = ['jquery', 'underscore', 'backbone']; // condition when backbone.app is part of the array?
		define('backbone.easing', deps, lib);
	} else if ( typeof module === "object" && module && typeof module.exports === "object" ){
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = lib;
	} else {
		// Browser globals
		var Query = $ || jQuery || Zepto || vQuery;
		lib(Query, _, Backbone);
	}
}(function ($, _, Backbone) {

	// support for Backbone APP() view if available...
	var APP = APP || window.APP || false;
	var isAPP = ( APP !== false );
	var View = ( isAPP && typeof APP.View !== "undefined" ) ? APP.View : Backbone.View;




// Helpers
_.mixin({
	now: function(){
		return ( new Date() ).getTime();
	}
});


	var Easing = View.extend({

		el : 'body',

		options : {
			targetEl: window, // the element that will be animated
			ease: "easeFrom",
			duration: 2 // in seconds
		},

		// convert to model, maybe...
		_transitionData: {
			start: 0,
			end: 0,
			easing: false,
			startPos: 0,
			endPos: 0,
			pos: 0
		},

		initialize: function( options ) {
			_.bindAll( this, "transitionStart", "transition", "transitionEnd" );
			this.options = _.extend({}, this.options, options );
			this.tick = new Tick();
			// get the target element
			if( !this.targetEl ) {
				this.targetEl = (typeof this.options.targetEl == "string" )? $( this.options.targetEl )[0] : this.options.targetEl;
			}

			return View.prototype.initialize.call( this, options );
		},

		transitionData: function( target ){
			// variables
			var data, start, end;

			// record data
			var now = _.now();
			data = {
				start: now,
				end: now + (this.options.duration * 1000),
				easing: easing[this.options.ease],
				startPos: start,
				endPos: end,
				pos: start
			};
			//save for later
			this._transitionData = data;

			return data;
		},

		transitionPos: function( pos ){
			if( !pos ){
				// get
			} else {
				//set
			}
		},

		transitionStart: function( target ){

			this.transitionData( target );
			// add transitio in the queue
			this.tick.add( this.transition );

		},

		transition: function(){
			var now = _.now();
			var data = this._transitionData;
			// condition #1: if reached our destination...
			if( now > data.end ) return this.transitionEnd();
			// condition #2: if the position has changed by another "force"
			if( data.pos && data.pos !== this.transitionPos() ) return this.transitionEnd();

			var start = data.startPos;
			var end = data.endPos;
			var easingFunc = data.easing;
			var time = ( data.end - now ) / (this.options.duration * 1000);

			var pos = Math.round( start + ( end - start ) * (1 -easingFunc( time ) ) );

			this.transitionPos( pos );

			// save pos for later
			data.pos = pos;
			this._transitionData = data;
		},

		transitionEnd: function() {
			// remove transition
			this.tick.remove( this.transition );
			// can you stop tick.js?
		},

		// expose easing methods
		tween: function( key ){
			return easing[key];
		}

	});

// MODIFIED!
// --------------------------------------------------
// easing.js v0.5.4
// Generic set of easing functions with AMD support
// https://github.com/danro/easing-js
// This code may be freely distributed under the MIT license
// http://danro.mit-license.org/
// --------------------------------------------------
// All functions adapted from Thomas Fuchs & Jeremy Kahn
// Easing Equations (c) 2003 Robert Penner, BSD license
// https://raw.github.com/danro/easing-js/master/LICENSE
// --------------------------------------------------
(function (name, definition) {
	/*global define module*/
	if (typeof define == 'function') define(name, definition);
	else if (typeof module != 'undefined') module.exports = definition();
	// always expose methods locally
	this[name] = definition();
}('easing', function(){
return {
	easeInQuad: function(pos) {
		return Math.pow(pos, 2);
	},

	easeOutQuad: function(pos) {
		return -(Math.pow((pos-1), 2) -1);
	},

	easeInOutQuad: function(pos) {
		if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,2);
		return -0.5 * ((pos-=2)*pos - 2);
	},

	easeInCubic: function(pos) {
		return Math.pow(pos, 3);
	},

	easeOutCubic: function(pos) {
		return (Math.pow((pos-1), 3) +1);
	},

	easeInOutCubic: function(pos) {
		if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
		return 0.5 * (Math.pow((pos-2),3) + 2);
	},

	easeInQuart: function(pos) {
		return Math.pow(pos, 4);
	},

	easeOutQuart: function(pos) {
		return -(Math.pow((pos-1), 4) -1);
	},

	easeInOutQuart: function(pos) {
		if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
		return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
	},

	easeInQuint: function(pos) {
		return Math.pow(pos, 5);
	},

	easeOutQuint: function(pos) {
		return (Math.pow((pos-1), 5) +1);
	},

	easeInOutQuint: function(pos) {
		if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5);
		return 0.5 * (Math.pow((pos-2),5) + 2);
	},

	easeInSine: function(pos) {
		return -Math.cos(pos * (Math.PI/2)) + 1;
	},

	easeOutSine: function(pos) {
		return Math.sin(pos * (Math.PI/2));
	},

	easeInOutSine: function(pos) {
		return (-0.5 * (Math.cos(Math.PI*pos) -1));
	},

	easeInExpo: function(pos) {
		return (pos===0) ? 0 : Math.pow(2, 10 * (pos - 1));
	},

	easeOutExpo: function(pos) {
		return (pos===1) ? 1 : -Math.pow(2, -10 * pos) + 1;
	},

	easeInOutExpo: function(pos) {
		if(pos===0) return 0;
		if(pos===1) return 1;
		if((pos/=0.5) < 1) return 0.5 * Math.pow(2,10 * (pos-1));
		return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
	},

	easeInCirc: function(pos) {
		return -(Math.sqrt(1 - (pos*pos)) - 1);
	},

	easeOutCirc: function(pos) {
		return Math.sqrt(1 - Math.pow((pos-1), 2));
	},

	easeInOutCirc: function(pos) {
		if((pos/=0.5) < 1) return -0.5 * (Math.sqrt(1 - pos*pos) - 1);
		return 0.5 * (Math.sqrt(1 - (pos-=2)*pos) + 1);
	},

	easeOutBounce: function(pos) {
		if ((pos) < (1/2.75)) {
			return (7.5625*pos*pos);
		} else if (pos < (2/2.75)) {
			return (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
		} else if (pos < (2.5/2.75)) {
			return (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
		} else {
			return (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
		}
	},

	easeInBack: function(pos) {
		var s = 1.70158;
		return (pos)*pos*((s+1)*pos - s);
	},

	easeOutBack: function(pos) {
		var s = 1.70158;
		return (pos=pos-1)*pos*((s+1)*pos + s) + 1;
	},

	easeInOutBack: function(pos) {
		var s = 1.70158;
		if((pos/=0.5) < 1) return 0.5*(pos*pos*(((s*=(1.525))+1)*pos -s));
		return 0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos +s) +2);
	},

	elastic: function(pos) {
		return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
	},

	swingFromTo: function(pos) {
		var s = 1.70158;
		return ((pos/=0.5) < 1) ? 0.5*(pos*pos*(((s*=(1.525))+1)*pos - s)) :
		0.5*((pos-=2)*pos*(((s*=(1.525))+1)*pos + s) + 2);
	},

	swingFrom: function(pos) {
		var s = 1.70158;
		return pos*pos*((s+1)*pos - s);
	},

	swingTo: function(pos) {
		var s = 1.70158;
		return (pos-=1)*pos*((s+1)*pos + s) + 1;
	},

	bounce: function(pos) {
		if (pos < (1/2.75)) {
			return (7.5625*pos*pos);
		} else if (pos < (2/2.75)) {
			return (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
		} else if (pos < (2.5/2.75)) {
			return (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
		} else {
			return (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
		}
	},

	bouncePast: function(pos) {
		if (pos < (1/2.75)) {
			return (7.5625*pos*pos);
		} else if (pos < (2/2.75)) {
			return 2 - (7.5625*(pos-=(1.5/2.75))*pos + 0.75);
		} else if (pos < (2.5/2.75)) {
			return 2 - (7.5625*(pos-=(2.25/2.75))*pos + 0.9375);
		} else {
			return 2 - (7.5625*(pos-=(2.625/2.75))*pos + 0.984375);
		}
	},

	easeFromTo: function(pos) {
		if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,4);
		return -0.5 * ((pos-=2)*Math.pow(pos,3) - 2);
	},

	easeFrom: function(pos) {
		return Math.pow(pos,4);
	},

	easeTo: function(pos) {
		return Math.pow(pos,0.25);
	}
};
}));

/* Tick.js
 * Source: https://github.com/makesites/tick
 * Copyright © Makesites.org
 *
 * Initiated by Makis Tracend (@tracend)
 * Distributed through [Makesites.org](http://makesites.org)
 * Released under the [MIT license](http://makesites.org/licenses/MIT)
 */

(function( window ){

var Tick = function( options ){
	// merge options
	options = options || {};
	if(options.rate) this.options.rate = options.rate;
	// setup animation rate
	this.rate();
	// start loop
	this.loop();
};

Tick.prototype = {

	options: {
		rate: 1000 / 60 // standard 60fps
	},

	queue: [],

	rate: function( rate ){
		rate = rate || this.options.rate;
		// RequestAnimationFrame shim - Source: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		window.requestAnimFrame = window.requestAnimFrame || ( function( callback ) {
			return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function ( callback ) {
				window.setTimeout( function () {
					callback(+new Date());
				}, rate );
			};
		})();

	},

	loop: function( timestamp ){

		// feature-detect if rAF and now() are of the same scale (epoch or high-res),
		// if not, we have to do a timestamp fix on each frame
		//Source: https://github.com/ded/morpheus/blob/master/src/morpheus.js#L91
		//if (fixTs) timestamp = now();

		this.process( timestamp );
		// reset loop
		window.requestAnimFrame(this.loop.bind(this)); // bind only works in > ES5
	},

	process: function( timestamp ){
		// loop through queue
		for( var i in this.queue ){
			var item = this.queue[i];
			// prerequisite
			if( typeof item.fn !== "function") continue;
			// restrict execution if not time yet
			var step = (timestamp % item.interval);
			if( step === 0 || item.run + item.interval > timestamp) continue;
			// run
			item.fn(); // context?
			// record last run
			// condition in case the item was released in the meantime...
			if( this.queue[i] ) this.queue[i].run = timestamp;
		}
	},

	// interface

	add: function( fn, interval ){
		// prerequisite
		if( typeof fn !== "function" ) return;
		// fallback
		interval = interval || this.options.rate;
		var item = {
			fn: fn,
			interval: interval,
			run: 0
		};
		this.queue.push( item );
	},

	remove: function( fn ){
		var exists = false;
		for( var i in this.queue ){
			var item = this.queue[i];
			if( String(item.fn) === String(fn) ){
				exists = true;
				delete this.queue[i];
			}
		}
		return exists;
	}

};

// save to the global namespace
window.Tick = Tick;

})( this.window );




	// update Backbone namespace regardless
	Backbone.Easing = Easing;
	if( isAPP ){
		APP.Easing = Easing;
	}

	// If there is a window object, that at least has a document property
	if ( typeof window === "object" && typeof window.document === "object" ) {
		window.Backbone = Backbone;
		// update APP namespace
		if( isAPP ){
			window.APP = APP;
		}
	}

	// for module loaders:
	return Easing;

}));

(function(window, Backbone) {

  'use strict';

  var loadUrl = Backbone.History.prototype.loadUrl;

  Backbone.History.prototype.loadUrl = function(fragmentOverride) {
    var matched = loadUrl.apply(this, arguments),
        gaFragment = this.fragment;

    if (!/^\//.test(gaFragment)) {
      gaFragment = '/' + gaFragment;
    }

    // legacy version
    if (typeof window._gaq !== "undefined") {
      window._gaq.push(['_trackPageview', gaFragment]);
    }

    // Analytics.js
    var ga;
    if (window.GoogleAnalyticsObject && window.GoogleAnalyticsObject !== 'ga') {
      ga = window.GoogleAnalyticsObject;
    } else {
      ga = window.ga;
    }

    if (typeof ga !== 'undefined') {
      ga('send', 'pageview', gaFragment);
    }
    return matched;
  };

})(window, Backbone);

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

var utils = {

	// Common.js extend method: https://github.com/commons/common.js
	extend: function(){
		var objects = Array.prototype.slice.call( arguments ); // to array?
		var destination = {};
		for( var obj in objects ){
			var source = objects[obj];
			for (var property in source){
				if (source[property] && source[property].constructor && source[property].constructor === Object) {
					destination[property] = destination[property] || {};
					destination[property] = arguments.callee(destination[property], source[property]);
				} else {
					destination[property] = source[property];
				}
			}
		}
		return destination;
	}

};
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
})(_, Backbone, jQuery);

/*
 * Backbone.ready()
 * Source: https://gist.github.com/tracend/5617079
 *
 * by Makis Tracend( @tracend )
 *
 * Usage:
 * Backbone.ready( callback );
 *
 */
(function(window, document, $, Backbone){

	// find the $
	$ = $ || ( ('$' in window) ? window.$ : window.jQuery || window.Zepto || false ); // need to account for "local" $

	Backbone.ready = function( callback ){

		if( isPhonegap() ){
			return PhoneGap.init( callback );

		} else if( $ ) {
			// use the 'default' ready event
			return $(document).ready( callback );

		} else if (window.addEventListener) {
			// ultimate fallback, add window event - trigger the page as soon it's loaded
			return window.addEventListener('load', callback, false);

		} else {
			// IE...
			return window.attachEvent('onload', callback);
		}

	};

	// Helpers

	// - Support Phonegap Shim: https://github.com/makesites/phonegap-shim
	function isPhonegap(){
		// only execute in app mode?
		return typeof PhoneGap != "undefined" && typeof PhoneGap.init != "undefined" && typeof PhoneGap.env != "undefined"  && PhoneGap.env.app;
	}

	return Backbone;

})(window, document, $, Backbone);

/*
 * Backbone States
 * Source: https://github.com/makesites/backbone-states
 *
 * Created by Makis Tracend ( [@tracend](http://github.com/tracend) )
 * Released under the [MIT license](http://makesites.org/licenses/MIT)
 *
 */
(function(window, document, Backbone){

	// find the $
	//$ = ('$' in window) ? window.$ : window.jQuery || window.Zepto || false;

	var View = Backbone.View;

	Backbone.View = View.extend({
		states: {
		},
		initialize: function(options){
			this.initStates();
			return View.prototype.initialize.call(this, options);
		},
		initStates: function(){
			for(var e in this.states){
				var method = this.states[e];
				this.bind(e, _.bind(this[method], this) );
			}
		}

	});

	// Helpers
	//...

	return Backbone;

})(window, document, Backbone);

(function(_, Backbone, APP) {

	// **Main constructors**
	APP.Model = Backbone.Model.extend({

		options: {
			autofetch: false,
			cache: false
		},

		// initialization
		initialize: function( model, options ){
			// save options for later
			options = options || {};
			this.options = _.extend({}, this.options, options);
			// set data if given
			if( !_.isNull( model ) && !_.isEmpty( model ) ) this.set( model );
			// restore cache
			if( this.options.cache ){
				var cache = this.cache();
				if( cache ) this.set( cache );
			}
			// auto-fetch if no models are passed
			if( this.options.autofetch && !_.isUndefined(this.url) ){
				this.fetch();
			}
		},

		// add is like set but only if not available
		add: function( obj ){
			var self = this;
			var data = {};
			_.each( obj, function( item, key ){
				if( _.isUndefined( self.get(key) ) ){
					data[key] = item;
				}
			});
			this.set( data );
		},

		// #63 reset model to its default values
		reset: function(){
			return this.clear().set(this.defaults);
		},

		// Use Backbone.cache, if available
		cache: Backbone.Model.prototype.cache || function(){
			// optionally create your own custom a cache mechanism...
			return false;
		},

		// Helper functions
		// - check if the app is online
		isOnline: function(){
			return ( !_.isUndefined( app ) ) ? app.state.online : true;
		},
		// FIX: override sync to support DELETE method (411 error on NGINX)
		// issue: http://serverfault.com/q/396020
		/*
		sync : function(method, model, options) {
			var methodMap = { 'create': 'POST', 'update': 'PUT', 'delete': 'DELETE', 'read':   'GET' };
			var type = methodMap[method];
			var opt = options || (options = {});
			var params = {type: type, dataType: 'json', data: {}};

			if (!options.url) {
				params.url = this.getValue(model, 'url') || urlError();
			}

			if (!options.data && model && (method == 'create' || method == 'update')) {
				params.contentType = 'application/json';
				params.data = JSON.stringify(model.toJSON());
			}

			if (params.type !== 'GET' && !Backbone.emulateJSON) {
				params.processData = false;
			}

			return $.ajax(_.extend(params, options));
		},
		*/
		// Helper - DELETE if the sync is not needed any more...
		getValue : function(object, prop) {
			if (!(object && object[prop])) return null;
			return _.isFunction(object[prop]) ? object[prop]() : object[prop];
		},

		parse: function( data ){
			var self = this;
			setTimeout(function(){ self.trigger("fetch"); }, 200); // better way to trigger this after parse?
			// cache response
			if( this.options.cache ){
				this.cache( data );
			}
			return data;
		},

		// extract data (and possibly filter keys)
		output: function(){
			// in most cases it's a straight JSON output
			return this.toJSON();
		}

	});


	// *** Extensions ***

	MongoModel = APP.Model.extend({

		parse: function( data ){
			//console.log(data);
			// "normalize" result with proper ids
			if(data._id){
				data.id = data._id;
				delete data._id;
			}
			return data;
		}
	});

})(_, Backbone, APP);
(function(_, Backbone, APP) {

	APP.Collection = Backbone.Collection.extend({

		options: {
			_synced : false,
			autofetch: false,
			cache: false
		},

		model: APP.Model,

		// initialization
		initialize: function( models, options ){
			// save options for later
			options = options || {};
			this.options = _.extend({}, this.options, options);
			// restore cache
			if( this.options.cache ){
				var cache = this.cache();
				if( cache ) this.add( cache );
			}
			// auto-fetch if no models are passed
			if( this.options.autofetch && _.isEmpty(models) && this.url ){
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

		// #41 - save action for collections
		save: function(models, options){
			// merge models
			_.extend(this.models, models);
			// callback is run once, after all models have saved.
			if( options.success ){
				var callback = _.after(this.models.length, options.success);
				_.each( this.models, function( model ){
					model.save(null, {success: callback});
				});
			}
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

		// Use Backbone.cache, if available
		cache: Backbone.Collection.prototype.cache || function(){
			// optionally create your own custom a cache mechanism...
			return false;
		},

		parse: function(data){
			var self = this;
			setTimeout(function(){ self.trigger("fetch"); }, 200); // better way to trigger this after parse?
			// cache results
			if( this.options.cache ){
				this.cache( data );
			}
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

})(_, Backbone, APP);
(function(_, Backbone, $, APP) {
	// containers
	var state = Backbone.View.prototype.state || new Backbone.Model();
	// defaults
	state.set({
		loaded : false,
		scroll : false,
		visible : false
	});

	APP.View =  Backbone.View.extend({
		options : {
			data : false,
			html: false,
			template: false,
			url : false,
			bind: "add remove reset change", // change the default to "sync"?
			type: false,
			parentEl : false,
			autoRender: true,
			inRender: false,
			silentRender: false,
			renderTarget: false,
			saveOptions: true // eventually disable this (test first)
		},
		// events
		events: {
			"click a[rel='external']" : "clickExternal"
		},
		// states
		states: {
			"scroll": "_scroll"
		},

		state: state,

		initialize: function( options ){
			var self = this;
			// fallback
			options = options || {};
			// #39 - backbone > 1.0 does not extend options automatically... (condition this?)
			this.options = _.extend({}, this.options, options);
			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			//
			_.bindAll(this, 'render', 'clickExternal', 'postRender', 'onLoaded', '_url', '_inDOM', '_toJSON', '_onLoaded');
			if( typeof this.url == "function" ) _.bindAll(this, 'url');
			// #73 - optionally saving options
			if( this.options.saveOptions ) this.options = _.extend(this.options, options);
			// find the data
			this.data = this.data || this.model || this.collection || null;
			this.options.data  = !_.isNull( this.data );
			//
			this.on('loaded', this.onLoaded );
			this.on('loaded', this._onLoaded );


			// #9 optionally add a reference to the view in the container
			if( this.options.attr ) {
				$(this.el).attr("data-view", this.options.attr );
			} else {
				$(this.el).removeAttr("data-view");
			}
			// compile
			var html = ( this.options.html ) ? this.options.html : null;
			// #18 - supporting custom templates
			var Template = (this.options.template || typeof APP == "undefined") ? this.options.template : (APP.Template || false);
			// #76 considering url as a flat option
			if( this.url && !this.options.url) this.options.url = this.url; // check for string?
			// #72 - include init options in url()
			var url = this._url( options );
			// proxy internal method for future requests
			this.url = this._url;

			if( Template ) {
				// set the type to default (as the Template expects)
				if( !this.options.type ) this.options.type = "default";
				this.template = (typeof Template == "function") ? new Template(html, { url : url }) : Template;
				if( self.options.autoRender ) this.template.bind("loaded", this.render);
			} else if( url ) {
				// fallback to the underscore template
				$.get(url, function( html ){
					self.template = _.template( html );
					if( self.options.autoRender ) self.render();
				});
			} else {
				this.template = _.template( html );
				if( self.options.autoRender ) this.render();
			}
			// add listeners
			if( this.options.data && !_.isUndefined( this.data.on ) ){
				this.data.on( this.options.bind, this.render);
			}
			// #11 : initial render only if data is not empty (or there are no data)
			if( this._initRender() ){
				this.render();
			} else {
				this.trigger("loaded");
			}
			// #36 - Adding resize event
			$(window).bind("resize", _.bind(this._resize, this));
			// initiate parent (states etc.)
			return Backbone.View.prototype.initialize.call( this, options );
		},
		// #71 parse URL in runtime (optionally)
		_url: function( options ){
			// fallback
			options = options || {};
			var url = options.url || this.options.url;
			return (typeof url == "function")? url() : url;
		},

		preRender: function(){
		},

		// Render view
		// placing markup in the DOM
		render: function(){
			// prerequisite
			if( !this.template ) return;
			// execute pre-render actions
			this._preRender();
			//
			var template = this._getTemplate();
			var data = this.toJSON();
			// #19 - checking instance of template before executing as a function
			var html = ( template instanceof Function ) ? template( data ) : template;
			var $el;
			// #64 find the render target
			var $container = this._findContainer();
			// saving element reference
			if( !this.el ){
				$el = $( html );
				this.el = this.$el = $el;
			}
			// make sure the element is attached to the DOM
			this._inDOM();
			// ways to insert the markup
			if( this.options.append ){
				$el = $el || $( html );
				$container.append( $el );
			} else if( this.options.prepend ){
				$el = $el || $( html );
				$container.prepend( $el );
			} else {
				$container.html( html );
			}
			// execute post-render actions
			this._postRender();
		},

		postRender: function(){
		},

		// a more discrete way of binding events triggers to objects
		listen : function( obj, event, callback ){
			// adds event listeners to the data
			var e = ( typeof event == "string")? [event] : event;
			for( var i in e ){
				obj.bind(e[i], callback);
			}

		},
		resize: function( e ){
			// override with your own custom actions...
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
		// attach to an event for a tab like effect
		clickTab: function(e){
			e.preventDefault();
			var section = this.findLink(e.target);
			$(this.el).find( section ).show().siblings().hide();
			// optionally add selected class if li available
			$(e.target).parent("li").addClass("selected").siblings().removeClass("selected");
		},
		findLink: function (obj) {
			if (obj.tagName != "A") {
				return $(obj).closest("a").attr("href");
			} else {
				return $(obj).attr("href");
			}
		},
		remove: function() {
			// unbind the namespaced
			$(window).unbind("resize", this._resize);

			// don't forget to call the original remove() function
			Backbone.View.prototype.remove.call(this);
		},

		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		toJSON: function(){
			var data = this._toJSON();
			// #43 - adding options to the template data
			return ( this.options.inRender ) ? { data : data, options: this.options } : data;
		},

		onLoaded: function(){
			// replace with your own actions on load
		},
		// Helpers

		// call methods from the parent
		parent: function( method, options ){
			// fallbacks
			method = method || "";
			options = options || {};
			// prerequisites
			this.__inherit = this.__inherit || []; // use promises instead?
			// check what reference of the parent we have available
			// - first is to stop recursion, second is to support for Backbone.APP
			var parent = this.__inherit[method] || this._parent || {};
			// fallback to pure js inheritance
			var proto = parent.prototype || (Object.getPrototypeOf(this)).constructor.__super__; // last MUST exist...
			// else View.__super__ ?
			var fn = proto[method] || function(){
				// reset inheritance
				delete this.__inherit[method];
			}; // fallback necessary?
			// convert arguments to an array
			var args = (options instanceof Array) ? options: [options];
			// stop recursion by saving a reference to the next parent
			this.__inherit[method] = proto._parent || function(){};
			//
			return fn.apply(this, args);
		},

		// Internal methods

		_initRender: function(){
			if( !this.options.autoRender ) return false;
			// variables
			var template = this._getTemplate();
			var hasMarkup = (this.options.html || ( this.options.url && template ) );
			var hasData = (this.options.data && ( _.isUndefined( this.data.toJSON ) || ( !_.isUndefined( this.data.toJSON ) && !_.isEmpty(this.data.toJSON()))));
			// if there's data and markup available, render
			if( hasMarkup && hasData ) return true;
			// if there's only one or the other render
			if( hasMarkup && !this.options.data) return true;
			if( hasData && !this.options.url ) return true;
			// in all other cases, don't render
			return false;
		},

		_preRender: function(){
			// app-specific actions
			this.preRender();
		},

		_postRender: function(){
			// make sure the container is presented
			if( !this.options.silentRender ) $(this.el).show();
			// remove loading state (if data has arrived)
			if( !this.options.data || (this.options.data && !_.isEmpty(this._toJSON()) ) ){
				$(this.el).removeClass("loading");
				// set the appropriate flag
				this.state.set("loaded", true);
				// bubble up the event
				this.trigger("loaded");
			}
			// app-specific actions
			this.postRender();
		},

		// get the JSON of the data
		_toJSON: function(){
			if( !this.options.data ) return {};
			if( this.data.toJSON ) return this.data.toJSON();
			return this.data; // in case the data is a JSON...
		},

		_getTemplate: function(){
			return ( this.options.type ) ? this.template.get( this.options.type ) : this.template;
		},

		_onLoaded: function(){
			this.setElement( this.el );
		},

		// - container is defined in three ways
		// * renderTarget is the element
		// * renderTarget inside the element
		// * renderTarget outside the element (bad practice?)
		_findContainer: function(){
			// by default
			var container = this.el;

			if ( !this.options.renderTarget ){
				// do nothing more

			} else if( typeof this.options.renderTarget == "string" ){

				container = $(this.el).find(this.options.renderTarget).first();
				if( !container.length ){
					container = $(this.options.renderTarget).first(); // assume this always exists...
				}

			} else if( typeof this.options.renderTarget == "object" ){

				container = this.options.renderTarget;

			}

			// convert into a jQuery object if needed
			return ( container instanceof jQuery) ? container : $(container);

		},

		// checks if an element exists in the DOM
		_inDOM: function( $el ){
			// fallbacks
			$el = $el || this.$el;
			// prerequisites
			if( !$el ) return false;
			// variables
			var exists = false;
			var parent = this.options.parentEl || "body";
			// check parent element
			exists = $(this.options.parentEl).find( $el ).length;
			if( exists ) return true;
			// el not in parent el
			if( this.options.parentPrepend ){
				$(parent).prepend( $el );
			} else {
				$(parent).append( $el );
			}
		},

		// - When navigate is triggered
		_navigate: function( e ){
			// extend method with custom logic
		},
		// #36 - resize event trigger (with debouncer)
		_resize: function () {
			var self = this ,
			args = arguments,
			timeout,
			delay = 1000; // default delay set to a second
			clearTimeout( timeout );
			timeout = setTimeout( function () {
				self.resize.apply( self , Array.prototype.slice.call( args ) );
			} , delay);
		},

		//
		_scroll: function () {
			//this.state.set("scroll", true);
		},
		// checks if the view is visible
		isVisible: function(){

			var viewportWidth = jQuery(window).width(),
				viewportHeight = jQuery(window).height(),

				documentScrollTop = jQuery(document).scrollTop(),
				documentScrollLeft = jQuery(document).scrollLeft(),

				minTop = documentScrollTop,
				maxTop = documentScrollTop + viewportHeight,
				minLeft = documentScrollLeft,
				maxLeft = documentScrollLeft + viewportWidth,

				$el = $(this.el),
				elementOffset = $el.offset();
			// condition
			var visible = ( (elementOffset.top >= minTop && elementOffset.top < maxTop) && (elementOffset.left >= minLeft && elementOffset.left < maxLeft) );
			// trigger state if needed
			if( visible && !this.state.get("visible") ){
				this.trigger("visible");
			} else {
				this.trigger("hidden");
			}
			// save state for later...
			this.state.set("visible", visible);

			return visible;
		}

	});

})(_, Backbone, $, APP);

(function(_, Backbone, $, APP) {

	/* Main layout */
	APP.Layout = Backbone.View.extend({

		el: "body",

		//
		options: {
			autosync : false,
			autorender: true,
			sync_events: "add remove change"
		},

		// events
		events: {
			"click a:not([rel='external'],[rel='alternate'])" : "_clickLink"
		},

		views: new Backbone.Model(),

		initialize: function( options ){
			// fallback
			options = options || {};
			// #39 - backbone > 1.0 does not extend options automatically... (condition this?)
			this.options = _.extend({}, this.options, options);

			// #12 : unbind this container from any previous listeners
			$(this.el).unbind();
			// bind event to this object
			_.bindAll(this, "set", "get", "render", "update", "_clickLink", "_viewLoaded", "_syncData");
			this.on("update", this.update);

			// #77 using url option to compile template
			if( this.options.url || this.url ){
				var url = this.options.url || this.url;
				// set the type to default (as the Template expects)
				if( !this.options.type ) this.options.type = "default";
				this.template = new APP.Template(null, { url : url });
				if( this.options.autorender ) this.template.bind("loaded", this.render);
			}
			// saving data
			if( options.data ) this.data = options.data;

			// initiate parent
			return Backbone.View.prototype.initialize.call( this, options );
		},

		preRender: function(){

		},

		render: function(){
			this._preRender();
			// remove loading class (if any)
			$(this.el).removeClass("loading");

			// creating html if required
			if( this.template ){
				var template = ( this.options.type ) ? this.template.get( this.options.type ) : this.template;
				// use the options as data..
				var html = template( this.options );
				$(this.el).html( html );
			}

			this._postRender();
		},

		postRender: function(){
		},

		update: function( e ){
			e = e || false;
			// if there's no event exit?
			if( !e ) return;
			// broadcast the event to the views...
			// - if there's rerouting:
			if( e.navigate ){
				// better way to get views?
				for( var i in this.views.attributes){
					this.views.attributes[i]._navigate(e);
				}
			}
			// - include other conditions...
		},

		// setter and getter mirroring the Model methods
		set: function( views ){
			// add event triggers on the views
			for( var i in views){
				views[i].on("loaded", _.bind( this._viewLoaded, this ) );
				// 'stamp' each view with a label
				views[i]._name = i;
				// bind events
				if( views[i].data ) {
					// view reference in the data
					views[i].data._view = i;
					// bind all data updates to the layout
					views[i].data.on(this.options.sync_events, _.bind(this._syncData, this) );
				}
			}
			return this.views.set( views );
		},

		get: function( view ){
			return this.views.get( view );
		},

		// removes a view
		remove: function( name ){
			//console.log("unset", name);
			var view = this.get( name );
			// prerequisite
			if( _.isUndefined(view) ) return;
			// undelegate view events
			view.remove();
			// remove the attribute from this.views
			return this.views.unset( name );
		},

		findLink: function (target) {
			var $el = (target.tagName != "A") ? $(target).closest("a") : $(target);
			var url = $el.attr("href");
			// filter some URLs
			// - defining local URLs
			var isLocal = (url) ? ( url.substr(0,1) == "#" || (url.substr(0,2) == "/#" && window.location.pathname == "/" ) ) : false;
			return ( _.isEmpty(url) || isLocal || $el.attr("target") ) ? false : url;
		},

		// Internal methods
		_preRender: function(){
			// add touch class to body
			if( app.state.touch ) $(this.el).addClass("touch");
			// app-specific actions
			this.preRender();
		},

		_postRender: function(){
			// app-specific actions
			this.postRender();
		},

		_viewLoaded : function(){
			var registered = 0,
				loaded = 0;
			// check if all the views are loaded
			_.each(this.views.attributes, function( view ){
				if( view.state.loaded ) loaded++;
				registered++;
			});

			// when all views are loaded...
			if( registered == loaded ){
				this._allViewsLoaded();
			}

		},

		// what to do after all views are loaded
		_allViewsLoaded : _.once(function(){
				// re-render the layout
				this.render();
		}),

		// broadcast all data updates in the views back to the layout
		//_syncData: function( action, model, collection, options ){
		_syncData: function( model, collection, options ){
			var value = false;
			// fallback
			var data = collection || model || false;
			if( !data ) return;
			// get the key of the data
			var key = data._view || false;
			// if we haven't kept a reference key to backtrack, exit now
			if( !key ) return;
			// this automation only works when the original data is a Backbone.Model
			if( this.model instanceof Backbone.Model ){
				var keys = this.model.keys() || [];
				// this only works if there's existing data
				if( keys.indexOf( key ) == -1 ) return;
				// get the data in an exported form (usually toJSON is enough)
				try{
					value = data.output();
				} catch( e ){
					// assume this collection is generic
					value = data.toJSON();
				}
				// final condition...
				if( value ){
					var attr = {};
					attr[key] = value;
					this.model.set( attr );
					// immediately save?
					if (this.options.autosync){
						this.model.save();
					}
				}
			}
		},

		_clickLink: function( e ){
			var url = this.findLink(e.target);
			if( url ){
				// add loading class
				$(this.el).addClass("loading");
			}
			// when to intercept links
			if( app.state.standalone() && url ){
					// block default behavior
					e.preventDefault();
					//
					window.location = url;
					return false;
			}
			// otherwise pass through...
		}

	});

})(_, Backbone, $, APP);

(function(_, Backbone, $, APP) {

	APP.Template = Backbone.Model.extend({
		initialize: function(html, options){
			_.bindAll(this, 'fetch', 'parse');
			// fallback for options
			var opt = options || (options={});

			if( !_.isEmpty(html) ){
				this.set( "default", this.compile( html ) );
				this.trigger("loaded");
			}
			//if( !_.isUndefined( options.url ) && !_.isEmpty( options.url ) ){
			if( options.url ){
				this.url = options.url;
				this.fetch();
			}
		},
		compile: function( markup ){
			return _.template( markup );
		},
		fetch: function(){
			// this can be replaced with a backbone method...
			$.get(this.url, this.parse);
		},
		parse: function(data){
			var self = this;
			var scripts;
			try{
				scripts = $(data).filter("script");
			} catch( e){
				// can't parse this - probly not html...
				scripts = [];
			}
			// check if there are script tags
			if( !scripts.length ){
				// save everything in the default attr
				this.set( "default", self.compile( data ) );
			} else {
				// loop through the scripts
				scripts.each(function(){
					// filter only scripts defined as template
					var el = $(this);
					if(el.attr("type").indexOf("template") >= 0){
						// convention: the id sets the key for the tmeplate
						self.set( el.attr("id"), self.compile( el.html() ) );
					}
				});
			}
			this.trigger("loaded");
			//return data;
		}
	});


})(_, Backbone, $, APP);

(function(_, Backbone, APP) {

	APP.Router = Backbone.Router.extend({
		// app configuration:
		options: {
			api : false,
			autostart: true,
			location : false,
			pushState: false,
			p404 : "/"
		},
		// to preserve these routes, extend with:
		// _.extend({}, APP.Router.prototype.routes, {...});
		routes: {
			"": "index",
			"_=_": "_fixFB",
			"access_token=:token": "access_token",
			"logout": "logout"
			//"*path"  : "_404"
		},

		data: new Backbone.Model(),

		initialize: function( options ){
			// app config refered to as options
			options = options || {};
			// bind 'this' with the methods
			_.bindAll(this, 'access_token', 'preRoute', '_layoutUpdate', '_bindRoutes', '_callRoute', '_setup', '_ajaxPrefilter','_fixFB');
			// extend default options (recursive?)
			_.extend( this.options, options);
			// setup app
			this._setup();
			// update Backbone options
			if( this.options.autostart ) Backbone.history.start({ pushState: this.options.pushState });
		},

		// Save app state in a seperate object
		state: {
			fullscreen: false,
			online: navigator.onLine,
			// find browser type
			browser: function(){
				if( /chrome/.test(navigator.userAgent.toLowerCase()) ) return 'chrome';
				if( /firefox/.test(navigator.userAgent.toLowerCase()) ) return 'firefox';
				if( /safari/.test(navigator.userAgent.toLowerCase()) ) return 'safari';
				if (navigator.appName == 'Microsoft Internet Explorer') return 'ie';
				if( /android/.test(navigator.userAgent.toLowerCase()) ) return 'android';
				if(/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent) ) return 'ios';
				if (navigator.userAgent.indexOf("Opera Mini") !== -1) return 'opera-mini';
				return 'other';
			},
			mobile: (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) ||navigator.userAgent.match(/BlackBerry/i)),
			ipad: (navigator.userAgent.match(/iPad/i) !== null),
			retina: (window.retina || window.devicePixelRatio > 1),
			// check if there's a touch screen
			touch : ('ontouchstart' in document.documentElement),
			pushstate: function() {
				try {
					window.history.pushState({"pageTitle": document.title}, document.title, window.location);
					return true;
				}
				catch (e) {
					return false;
				}
			},
			scroll: true,
			ram: function(){
				return (console.memory) ? Math.round( 100 * (console.memory.usedJSHeapSize / console.memory.totalJSHeapSize)) : 0;
			},
			standalone: function(){ return (("standalone" in navigator) && navigator.standalone) || (typeof PhoneGap !="undefined" && !_.isUndefined(PhoneGap.env) && PhoneGap.env.app ) || ((typeof external != "undefined") && (typeof external.msIsSiteMode == "function") && external.msIsSiteMode()); },
			framed: (top !== self) // alternatively (window.top !== window)
		},
		update: function(){
			// backwards compatibility for a simple state object
			var scroll = (this.state instanceof Backbone.Model ) ? this.state.get("scroll") : this.state.scroll;
			if( scroll ){
				$("body").removeClass("no-scroll");
			} else {
				$("body").addClass("no-scroll");
			}
		},

		// Routes
		// default route - override with custom method
		index: function(){

		},

		// vanilla logout route
		logout: function(){
			if( this.session ) this.session.trigger("logout", { reload: true });
			// back to the homepage
			this.navigate("/", true);
		},


		// this method wil be executed before "every" route!
		preRoute: function( options, callback ){
			var self = this;
			// execute logic here:
			// - check if there is a session
			if( this.session && (typeof this.session.state !== "undefined") ){
				// wait for the session
				if( !this.session.state ){
					return this.session.bind("loaded", _.once(function(){
						callback.apply(self, options);
					}) );
				} else {
					// session available...
					return callback.apply(self, options);
				}
			}
			return callback.apply(self, options);
		},

		access_token: function( token ){
			// if there's an app session, save it there
			if( this.session ){
				this.session.set({ "token" : token });
			} else {
				// set as a global var (for later use)
				window.access_token = token;
			}
			// either way redirect back to home...
			this.navigate("/", true);
		},
		// - internal
		// collection of setup methods
		_setup : function(){
			// using options as the main configuration source
			// - use an API URL
			if( this.options.api ) this._ajaxPrefilter( this.options.api );
			// - init analytics
			//this.bind('all', this._trackPageview);
			this.bind('all', this._layoutUpdate);

			// - monitor user's location
			if( this.options.location ){
				this._geoLocation();
			}
			// - setup session
			this._setupSession();
		},

		// - setup session, if namespace is available
		_setupSession: function(){
			// fallback to backbone.session
			var Session = APP.Session || Backbone.Session || false;
			if( Session ) this.session = new Session({}, ( this.options.session || {} ));
		},

		// set the api url for all ajax requests
		_ajaxPrefilter: function( api ){
			var session = this.session || false;

			$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
				//#29 - apply api url only for data requests
				if( originalOptions.dataType != "json" ) return;
				// use the api from the configuration (unless full URL specified)
				var fullUrl = (options.url.search(/^http/) === 0);
				if( !fullUrl ){
					options.url = api + options.url;
				}
				// compatible with servers that set header
				// Access-Control-Allow-Credentials: true
				// for added security
				options.xhrFields = {
					withCredentials: true
				};
				// If we have a csrf token send it through with the next request
				var csrf = (session) ? (session._csrf || session.get('_csrf') || false) : false;
				if( csrf ) {
					jqXHR.setRequestHeader('X-CSRF-Token', csrf);
				}
			});

		},
		// addressing the issue: http://stackoverflow.com/q/7131909
		_fixFB: function(){
			this.navigate("/", true);
		},
		// tracking client-side "page" views - replaces by Backbone.Analytics (in helpers)
		/*
		_trackPageview: function(){
			var url = Backbone.history.getFragment();
			// check for Google Analytics
			if( typeof _gaq != "undefined" ) _gaq.push(['_trackPageview', "/#"+url]);
		},
		*/
		_layoutUpdate: function(path){
			//update the layout
			if(this.layout) this.layout.trigger("update", { navigate : true, path : path });
		},
		// - overriding default _bindRoutes
		_bindRoutes: function() {
			if (!this.routes) return;
			this.routes = _.result(this, 'routes');
			var route, routes = _.keys(this.routes);
			while(typeof (route = routes.pop()) !== "undefined"){
				var name = this.routes[route];
				// when we find the route we execute the preRoute
				// with a reference to the route as a callback...
				this.route(route, name, this._callRoute( this[name] ) );
			}
		},
		// special execution of a route (with pre-logic)
		_callRoute : function( route ){
			return function(){
					this.preRoute.call(this, arguments, route);
				};
		},
		_geoLocation: function(){
			var self = this;
			// get user's location
			navigator.geolocation.getCurrentPosition(
				function( data ){ self.state.location = data; },
				function(){ console.log("error", arguments); }
			);
			// update every 30 sec (to support mobile)
			setTimeout( function(){
				self._geoLocation();
			}, 30000);

		},

		// Fallback 404 route
		_404: function(path) {
			var msg = "Unable to find path: " + path;
			console.log(msg);
			// redirect to 404 path
			this.navigate( this.options.p404 );
		}

	});


	// default router (ultimate fallback..)
	APP.Routers.Default = APP.Router;

})(_, Backbone, APP);


	// reference other Backbone methods
	APP.extend = Backbone.extend;

	// If there is a window object, that at least has a document property
	if( typeof window === "object" && typeof window.document === "object" ){
		// save in the global namespace
		window.APP = APP;
	}

	// for module loaders:
	return APP;

}));
