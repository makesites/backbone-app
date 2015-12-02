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
