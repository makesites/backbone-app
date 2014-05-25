
/* Backbone Easing
 * Source: https://github.com/makesites/backbone-easing
 * Copyright © Makesites.org
 *
 * Initiated by Makis Tracend (@tracend)
 * Distributed through [Makesites.org](http://makesites.org)
 * Released under the [MIT license](http://makesites.org/licenses/MIT)
 */

(function(w, $, _, Backbone, APP) {

	// support for Backbone APP() view if available...
	var isAPP = ( typeof APP !== "undefined" && typeof APP.View !== "undefined" );
	var View = ( isAPP ) ? APP.View : Backbone.View;


	var Easing = View.extend({

		el : 'body',

		options : {
			targetEl: "body", // the element that will be animated
			ease: "easeFrom",
			duration: 2 // in seconds
		},

		// convert to model, maybe...
		data: {
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
			this.targetEl = $( this.options.targetEl )[0];

			return View.prototype.initialize.call( this, options );
		},

		transitionData: function( target ){
			// variables
			var start, end;

			// record data
			var now = _.now();
			return {
				start: now,
				end: now + (this.options.duration * 1000),
				easing: easing[this.options.ease],
				startPos: start,
				endPos: end,
				pos: start
			}
		},

		transitionPos: function( pos ){
			if( !pos ){
				// get
			} else {
				//set
			}
		},

		transitionStart: function( target ){

			this.data = this.transitionData( target );
			// add transitio in the queue
			this.tick.add( this.transition );

		},

		transition: function(){
			var now = _.now();
			// condition #1: if reached our destination...
			if( now > this.data.end ) return this.transitionEnd();
			// condition #2: if the position has changed by another "force"
			if( this.data.pos && this.data.pos !== this.transitionPos() ) return this.transitionEnd();

			var start = this.data.startPos;
			var end = this.data.endPos;
			var easingFunc = this.data.easing;
			var time = ( this.data.end - now ) / (this.options.duration * 1000);

			var pos = Math.round( start + ( end - start ) * (1 -easingFunc( time ) ) );

			this.transitionPos( pos );

			// save pos for later
			this.data.pos = pos;
		},

		transitionEnd: function() {
			// remove transition
			this.tick.remove( this.transition );
			// can you stop tick.js?

		}

	});


// Helpers
_.mixin({
	now: function(){
		return ( new Date() ).getTime();
	}
});

// easing.js v0.5.4
// Generic set of easing functions with AMD support
// https://github.com/danro/easing-js
(function(a,b){typeof define=="function"?define(b):typeof module!="undefined"?module.exports=b:this[a]=b})("easing",{easeInQuad:function(a){return Math.pow(a,2)},easeOutQuad:function(a){return-(Math.pow(a-1,2)-1)},easeInOutQuad:function(a){return(a/=.5)<1?.5*Math.pow(a,2):-0.5*((a-=2)*a-2)},easeInCubic:function(a){return Math.pow(a,3)},easeOutCubic:function(a){return Math.pow(a-1,3)+1},easeInOutCubic:function(a){return(a/=.5)<1?.5*Math.pow(a,3):.5*(Math.pow(a-2,3)+2)},easeInQuart:function(a){return Math.pow(a,4)},easeOutQuart:function(a){return-(Math.pow(a-1,4)-1)},easeInOutQuart:function(a){return(a/=.5)<1?.5*Math.pow(a,4):-0.5*((a-=2)*Math.pow(a,3)-2)},easeInQuint:function(a){return Math.pow(a,5)},easeOutQuint:function(a){return Math.pow(a-1,5)+1},easeInOutQuint:function(a){return(a/=.5)<1?.5*Math.pow(a,5):.5*(Math.pow(a-2,5)+2)},easeInSine:function(a){return-Math.cos(a*(Math.PI/2))+1},easeOutSine:function(a){return Math.sin(a*(Math.PI/2))},easeInOutSine:function(a){return-0.5*(Math.cos(Math.PI*a)-1)},easeInExpo:function(a){return a===0?0:Math.pow(2,10*(a-1))},easeOutExpo:function(a){return a===1?1:-Math.pow(2,-10*a)+1},easeInOutExpo:function(a){return a===0?0:a===1?1:(a/=.5)<1?.5*Math.pow(2,10*(a-1)):.5*(-Math.pow(2,-10*--a)+2)},easeInCirc:function(a){return-(Math.sqrt(1-a*a)-1)},easeOutCirc:function(a){return Math.sqrt(1-Math.pow(a-1,2))},easeInOutCirc:function(a){return(a/=.5)<1?-0.5*(Math.sqrt(1-a*a)-1):.5*(Math.sqrt(1-(a-=2)*a)+1)},easeOutBounce:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},easeInBack:function(a){var b=1.70158;return a*a*((b+1)*a-b)},easeOutBack:function(a){var b=1.70158;return(a-=1)*a*((b+1)*a+b)+1},easeInOutBack:function(a){var b=1.70158;return(a/=.5)<1?.5*a*a*(((b*=1.525)+1)*a-b):.5*((a-=2)*a*(((b*=1.525)+1)*a+b)+2)},elastic:function(a){return-1*Math.pow(4,-8*a)*Math.sin((a*6-1)*2*Math.PI/2)+1},swingFromTo:function(a){var b=1.70158;return(a/=.5)<1?.5*a*a*(((b*=1.525)+1)*a-b):.5*((a-=2)*a*(((b*=1.525)+1)*a+b)+2)},swingFrom:function(a){var b=1.70158;return a*a*((b+1)*a-b)},swingTo:function(a){var b=1.70158;return(a-=1)*a*((b+1)*a+b)+1},bounce:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375},bouncePast:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?2-(7.5625*(a-=1.5/2.75)*a+.75):a<2.5/2.75?2-(7.5625*(a-=2.25/2.75)*a+.9375):2-(7.5625*(a-=2.625/2.75)*a+.984375)},easeFromTo:function(a){return(a/=.5)<1?.5*Math.pow(a,4):-0.5*((a-=2)*Math.pow(a,3)-2)},easeFrom:function(a){return Math.pow(a,4)},easeTo:function(a){return Math.pow(a,.25)}});



/* Tick.js
 * Source: https://github.com/makesites/tick
 * Copyright © Makesites.org
 */
(function(e){var t=function(e){e=e||{};if(e.rate)this.options.rate=e.rate;this.rate();this.loop()};t.prototype={options:{rate:1e3/60},queue:[],rate:function(t){t=t||this.options.rate;e.requestAnimFrame=e.requestAnimFrame||function(n){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(n){e.setTimeout(function(){n(+(new Date))},t)}}()},loop:function(t){this.process(t);e.requestAnimFrame(this.loop.bind(this))},process:function(e){for(var t in this.queue){var n=this.queue[t];if(!(e%n.interval)||n.run+n.interval>e||typeof n.fn!=="function")continue;n.fn();if(this.queue[t])this.queue[t].run=e}},add:function(e,t){if(typeof e!=="function")return;t=t||this.options.rate;var n={fn:e,interval:t,run:0};this.queue.push(n)},remove:function(e){var t=false;for(var n in this.queue){var r=this.queue[n];if(String(r.fn)===String(e)){t=true;delete this.queue[n]}}return t}};e.Tick=t})(this.window)



	// Support module loaders
	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		// Expose as module.exports in loaders that implement CommonJS module pattern.
		module.exports = Easing;
	} else {
		// Register as a named AMD module, used in Require.js
		if ( typeof define === "function" && define.amd ) {
			define("backbone.easing", ['jquery', 'underscore', 'backbone'], function () { return Easing; } );
		}
	}
	// If there is a window object, that at least has a document property
	if ( typeof window === "object" && typeof window.document === "object" ) {
		// update APP namespace
		if( isAPP ){
			APP.Easing = Easing;
			// save namespace
			window.APP = APP;
		}
		// update Backbone namespace regardless
		Backbone.Easing = Easing;
		window.Backbone = Backbone;
	}


})(this.window, this.$, this._, this.Backbone, this.APP);
