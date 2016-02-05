!function(t){if("function"==typeof define&&define.amd){var e=["jquery","underscore","backbone"];define("backbone.app",e,t)}else if("object"==typeof module&&module&&"object"==typeof module.exports)module.exports=t;else{var n=window.jQuery||window.Zepto||window.vQuery;t(n,window._,window.Backbone,window.APP)}}(function(t,e,n){var i=this.window||{},o=i.APP||!1;o||function(t){var e={require:!1,routePath:"app/controllers/",autoLookup:!0,pushState:!1};o=function(){var n=arguments[0]||{},r=arguments[1]||function(){};n.require=n.require||"function"==typeof define&&define.amd,n=s.extend(e,n);var a=!1,u=i.location?i.location.pathname.split("/"):[""];if(""===u[0]&&u.shift(),n.require){var h=n.routePath+"default";return"string"==typeof n.require?a=n.require:n.autoLookup?(a=n.routePath,a+=t.isEmpty(u[0])?"default":u[0]):a=h,"undefined"!=typeof require?require([a],function(t){t&&r(t)},function(t){var e=t.requireModules&&t.requireModules[0];if(e!=a)throw t;require([h],function(t){r(t)})}):System.import(a).then(function(t){t.default&&r(t.default)}).catch(function(){System.import(h).then(function(t){r(t.default)})}),o}for(var c in u)if(""!==u[c]&&(a=u[c].charAt(0).toUpperCase()+u[c].slice(1),"function"==typeof o.Routers[a]))break;var l=a&&o.Routers[a]?new o.Routers[a](n):new o.Routers.Default(n);return l},o.Models={},o.Routers={},o.Collections={},o.Views={},o.Layouts={},o.Templates={}}(e,n),function(i){if("function"==typeof define&&define.amd){var o=["jquery","underscore","backbone"];define("backbone.easing",o,i)}else if("object"==typeof module&&module&&"object"==typeof module.exports)module.exports=i;else{var s=t||jQuery||Zepto||vQuery;i(s,e,n)}}(function(t,e,n){var o=o||i.APP||!1,s=o!==!1,r=s&&"undefined"!=typeof o.View?o.View:n.View;e.mixin({now:function(){return(new Date).getTime()}});var a=r.extend({el:"body",options:{targetEl:i,ease:"easeFrom",duration:2},_transitionData:{start:0,end:0,easing:!1,startPos:0,endPos:0,pos:0},initialize:function(n){return e.bindAll(this,"transitionStart","transition","transitionEnd"),this.options=e.extend({},this.options,n),this.tick=new Tick,this.targetEl||(this.targetEl="string"==typeof this.options.targetEl?t(this.options.targetEl)[0]:this.options.targetEl),r.prototype.initialize.call(this,n)},transitionData:function(){var t,n,i,o=e.now();return t={start:o,end:o+1e3*this.options.duration,easing:easing[this.options.ease],startPos:n,endPos:i,pos:n},this._transitionData=t,t},transitionPos:function(t){},transitionStart:function(t){this.transitionData(t),this.tick.add(this.transition)},transition:function(){var t=e.now(),n=this._transitionData;if(t>n.end)return this.transitionEnd();if(n.pos&&n.pos!==this.transitionPos())return this.transitionEnd();var i=n.startPos,o=n.endPos,s=n.easing,r=(n.end-t)/(1e3*this.options.duration),a=Math.round(i+(o-i)*(1-s(r)));this.transitionPos(a),n.pos=a,this._transitionData=n},transitionEnd:function(){this.tick.remove(this.transition)},tween:function(t){return easing[t]}});return function(t,e){"function"==typeof define?define(t,e):"undefined"!=typeof module&&(module.exports=e()),this[t]=e()}("easing",function(){return{easeInQuad:function(t){return Math.pow(t,2)},easeOutQuad:function(t){return-(Math.pow(t-1,2)-1)},easeInOutQuad:function(t){return(t/=.5)<1?.5*Math.pow(t,2):-.5*((t-=2)*t-2)},easeInCubic:function(t){return Math.pow(t,3)},easeOutCubic:function(t){return Math.pow(t-1,3)+1},easeInOutCubic:function(t){return(t/=.5)<1?.5*Math.pow(t,3):.5*(Math.pow(t-2,3)+2)},easeInQuart:function(t){return Math.pow(t,4)},easeOutQuart:function(t){return-(Math.pow(t-1,4)-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*Math.pow(t,4):-.5*((t-=2)*Math.pow(t,3)-2)},easeInQuint:function(t){return Math.pow(t,5)},easeOutQuint:function(t){return Math.pow(t-1,5)+1},easeInOutQuint:function(t){return(t/=.5)<1?.5*Math.pow(t,5):.5*(Math.pow(t-2,5)+2)},easeInSine:function(t){return-Math.cos(t*(Math.PI/2))+1},easeOutSine:function(t){return Math.sin(t*(Math.PI/2))},easeInOutSine:function(t){return-.5*(Math.cos(Math.PI*t)-1)},easeInExpo:function(t){return 0===t?0:Math.pow(2,10*(t-1))},easeOutExpo:function(t){return 1===t?1:-Math.pow(2,-10*t)+1},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},easeInCirc:function(t){return-(Math.sqrt(1-t*t)-1)},easeOutCirc:function(t){return Math.sqrt(1-Math.pow(t-1,2))},easeInOutCirc:function(t){return(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeOutBounce:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},easeInBack:function(t){var e=1.70158;return t*t*((e+1)*t-e)},easeOutBack:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},easeInOutBack:function(t){var e=1.70158;return(t/=.5)<1?.5*t*t*(((e*=1.525)+1)*t-e):.5*((t-=2)*t*(((e*=1.525)+1)*t+e)+2)},elastic:function(t){return-1*Math.pow(4,-8*t)*Math.sin((6*t-1)*2*Math.PI/2)+1},swingFromTo:function(t){var e=1.70158;return(t/=.5)<1?.5*t*t*(((e*=1.525)+1)*t-e):.5*((t-=2)*t*(((e*=1.525)+1)*t+e)+2)},swingFrom:function(t){var e=1.70158;return t*t*((e+1)*t-e)},swingTo:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},bounce:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},bouncePast:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?2-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?2-(7.5625*(t-=2.25/2.75)*t+.9375):2-(7.5625*(t-=2.625/2.75)*t+.984375)},easeFromTo:function(t){return(t/=.5)<1?.5*Math.pow(t,4):-.5*((t-=2)*Math.pow(t,3)-2)},easeFrom:function(t){return Math.pow(t,4)},easeTo:function(t){return Math.pow(t,.25)}}}),function(t){var e=function(t){t=t||{},t.rate&&(this.options.rate=t.rate),this.rate(),this.loop()};e.prototype={options:{rate:1e3/60},queue:[],rate:function(e){e=e||this.options.rate,t.requestAnimFrame=t.requestAnimFrame||function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(n){t.setTimeout(function(){n(+new Date)},e)}}()},loop:function(e){this.process(e),t.requestAnimFrame(this.loop.bind(this))},process:function(t){for(var e in this.queue){var n=this.queue[e];if("function"==typeof n.fn){var i=t%n.interval;0===i||n.run+n.interval>t||(n.fn(),this.queue[e]&&(this.queue[e].run=t))}}},add:function(t,e){if("function"==typeof t){e=e||this.options.rate;var n={fn:t,interval:e,run:0};this.queue.push(n)}},remove:function(t){var e=!1;for(var n in this.queue){var i=this.queue[n];String(i.fn)===String(t)&&(e=!0,delete this.queue[n])}return e}},t.Tick=e}(this.window),n.Easing=a,s&&(o.Easing=a),"object"==typeof i&&"object"==typeof i.document&&(i.Backbone=n,s&&(i.APP=o)),a}),function(t,e){"use strict";var n=e.History.prototype.loadUrl;e.History.prototype.loadUrl=function(){var e=n.apply(this,arguments),i=this.fragment;/^\//.test(i)||(i="/"+i),"undefined"!=typeof t._gaq&&t._gaq.push(["_trackPageview",i]);var o;return o=t.GoogleAnalyticsObject&&"ga"!==t.GoogleAnalyticsObject?t.GoogleAnalyticsObject:t.ga,"undefined"!=typeof o&&o("send","pageview",i),e}}(i,n),function(t,e){var n=e.Model.extend,i=function(i,o){var s=this;return i&&t.each(i,function(n,o){"string"!=typeof n&&"boolean"!=typeof n&&(!(o in s.prototype)||n instanceof Function||s.prototype[o]instanceof Function||n instanceof e.Model||s.prototype[o]instanceof e.Model||n instanceof e.Collection||s.prototype[o]instanceof e.Collection||(i[o]=t.extend({},s.prototype[o],n)))}),n.call(this,i,o)};e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=i,e.extend=function(){var e=Array.prototype.slice.call(arguments,0);if(e.length){var n=e.shift();for(var i in e){var o=e[i],s=n,r=o.prototype?o.prototype:o;if("object"==typeof r){var a=t.extend({},r);delete a._parent,a._parent=s,n=s.extend(a)}}return n}}}(e,n);var s={extend:function(){var t=Array.prototype.slice.call(arguments),e={};for(var n in t){var i=t[n];for(var o in i)i[o]&&i[o].constructor&&i[o].constructor===Object?(e[o]=e[o]||{},e[o]=arguments.callee(e[o],i[o])):e[o]=i[o]}return e}};return function(t){t.templateSettings={interpolate:/\{\{(.+?)\}\}/g,variable:"."},"undefined"!=typeof Handlebars&&t.mixin({template:Handlebars.compile})}(e,n,jQuery),function(t,e,n,i){function o(){return"undefined"!=typeof PhoneGap&&"undefined"!=typeof PhoneGap.init&&"undefined"!=typeof PhoneGap.env&&PhoneGap.env.app}return n=n||("$"in t?t.$:t.jQuery||t.Zepto||!1),i.ready=function(i){return o()?PhoneGap.init(i):n?n(e).ready(i):t.addEventListener?t.addEventListener("load",i,!1):t.attachEvent("onload",i)},i}(i,document,t,n),function(t,n,i){var o=i.View;return i.View=o.extend({states:{},initialize:function(t){return this.initStates(),o.prototype.initialize.call(this,t)},initStates:function(){for(var t in this.states){var n=this.states[t];this.bind(t,e.bind(this[n],this))}}}),i}(i,document,n),function(t,e,n){n.Model=e.Model.extend({options:{autofetch:!1,cache:!1},initialize:function(e,n){if(n=n||{},this.options=t.extend({},this.options,n),t.isNull(e)||t.isEmpty(e)||this.set(e),this.options.cache){var i=this.cache();i&&this.set(i)}this.options.autofetch&&!t.isUndefined(this.url)&&this.fetch()},add:function(e){var n=this,i={};t.each(e,function(e,o){t.isUndefined(n.get(o))&&(i[o]=e)}),this.set(i)},reset:function(){return this.clear().set(this.defaults)},cache:e.Model.prototype.cache||function(){return!1},isOnline:function(){return t.isUndefined(app)?!0:app.state.online},getValue:function(e,n){return e&&e[n]?t.isFunction(e[n])?e[n]():e[n]:null},parse:function(t){var e=this;return setTimeout(function(){e.trigger("fetch")},200),this.options.cache&&this.cache(t),t},output:function(){return this.toJSON()}}),MongoModel=n.Model.extend({parse:function(t){return t._id&&(t.id=t._id,delete t._id),t}})}(e,n,o),function(t,e,n){n.Collection=e.Collection.extend({options:{_synced:!1,autofetch:!1,cache:!1},model:n.Model,initialize:function(e,n){if(n=n||{},this.options=t.extend({},this.options,n),this.options.cache){var i=this.cache();i&&this.add(i)}this.options.autofetch&&t.isEmpty(e)&&this.url&&this.fetch()},update:function(){},save:function(e,n){if(t.extend(this.models,e),n.success){var i=t.after(this.models.length,n.success);t.each(this.models,function(t){t.save(null,{success:i})})}},cache:e.Collection.prototype.cache||function(){return!1},parse:function(t){var e=this;return setTimeout(function(){e.trigger("fetch")},200),this.options.cache&&this.cache(t),t},output:function(){return this.toJSON()},isNew:function(){return this.options._synced===!1},isOnline:function(){return t.isUndefined(app)?!0:app.state.online}}),MongoCollection=n.Collection.extend({parse:function(t){for(var e in t)t[e].id=t[e]._id,delete t[e]._id;return t}})}(e,n,o),function(t,e,n,o){var s=e.View.prototype.state||new e.Model;s.set({loaded:!1,scroll:!1,visible:!1}),o.View=e.View.extend({options:{data:!1,html:!1,template:!1,url:!1,bind:"add remove reset change",type:!1,parentEl:!1,autoRender:!0,inRender:!1,silentRender:!1,renderTarget:!1,saveOptions:!0},events:{"click a[rel='external']":"clickExternal"},states:{scroll:"_scroll"},state:s,initialize:function(s){var r=this;s=s||{},this.options=t.extend({},this.options,s),n(this.el).unbind(),t.bindAll(this,"render","clickExternal","postRender","_url","_toJSON"),"function"==typeof this.url&&t.bindAll(this,"url"),this.options.saveOptions&&(this.options=t.extend(this.options,s)),this.data=this.data||this.model||this.collection||null,this.options.data=!t.isNull(this.data),this.options.attr?n(this.el).attr("data-view",this.options.attr):n(this.el).removeAttr("data-view");var a=this.options.html?this.options.html:null,u=this.options.template||"undefined"==typeof o?this.options.template:o.Template||!1;this.url&&!this.options.url&&(this.options.url=this.url);var h=this._url(s);return this.url=this._url,u?(this.options.type||(this.options.type="default"),this.template="function"==typeof u?new u(a,{url:h}):u,r.options.autoRender&&this.template.bind("loaded",this.render)):h?n.get(h,function(e){r.template=t.template(e),r.options.autoRender&&r.render()}):(this.template=t.template(a),r.options.autoRender&&this.render()),this.options.data&&!t.isUndefined(this.data.on)&&this.data.on(this.options.bind,this.render),this._initRender()&&this.render(),n(i).bind("resize",t.bind(this._resize,this)),e.View.prototype.initialize.call(this,s)},_url:function(t){t=t||{};var e=t.url||this.options.url;return"function"==typeof e?e():e},preRender:function(){},render:function(){if(this.template){this._preRender();var t,e=this._getTemplate(),i=this.toJSON(),o=e instanceof Function?e(i):e,s=this._findContainer();this.el||(t=n(o),this.el=this.$el=t),this._inDOM(),this.options.append?(t=t||n(o),s.append(t)):this.options.prepend?(t=t||n(o),s.prepend(t)):s.html(o),this._postRender()}},postRender:function(){},listen:function(t,e,n){var i="string"==typeof e?[e]:e;for(var o in i)t.bind(i[o],n)},resize:function(){},clickExternal:function(t){t.preventDefault();var e=this.findLink(t.target);"undefined"!=typeof pageTracker&&(e=pageTracker._getLinkerUrl(e));try{i.plugins.childBrowser.showWebPage(e)}catch(n){i.open(e,"_blank")}return!1},clickTab:function(t){t.preventDefault();var e=this.findLink(t.target);n(this.el).find(e).show().siblings().hide(),n(t.target).parent("li").addClass("selected").siblings().removeClass("selected")},findLink:function(t){return"A"!=t.tagName?n(t).closest("a").attr("href"):n(t).attr("href")},remove:function(){n(i).unbind("resize",this._resize),e.View.prototype.remove.call(this)},unbind:function(t,e){return this.off(t,null,e)},toJSON:function(){var t=this._toJSON();return this.options.inRender?{data:t,options:this.options}:t},parent:function(t,e){t=t||"",e=e||{},this.__inherit=this.__inherit||[];var n=this.__inherit[t]||this._parent||{},i=n.prototype||this.__proto__.constructor.__super__,o=i[t]||function(){delete this.__inherit[t]},s=e instanceof Array?e:[e];return this.__inherit[t]=i._parent||function(){},o.apply(this,s)},_initRender:function(){if(!this.options.autoRender)return!1;var e=this._getTemplate(),n=this.options.html||this.options.url&&e,i=this.options.data&&(t.isUndefined(this.data.toJSON)||!t.isUndefined(this.data.toJSON)&&!t.isEmpty(this.data.toJSON()));return n&&i?!0:n&&!this.options.data?!0:i&&!this.options.url?!0:!1},_preRender:function(){this.preRender()},_postRender:function(){this.options.silentRender||n(this.el).show(),(!this.options.data||this.options.data&&!t.isEmpty(this._toJSON()))&&(n(this.el).removeClass("loading"),this.state.set("loaded",!0),this.trigger("loaded")),this.postRender()},_toJSON:function(){return this.options.data?this.data.toJSON?this.data.toJSON():this.data:{}},_getTemplate:function(){return this.options.type?this.template.get(this.options.type):this.template},_findContainer:function(){var t=this.el;return this.options.renderTarget&&("string"==typeof this.options.renderTarget?(t=n(this.el).find(this.options.renderTarget).first(),t.length||(t=n(this.options.renderTarget).first())):"object"==typeof this.options.renderTarget&&(t=this.options.renderTarget)),t instanceof jQuery?t:n(t)},_inDOM:function(t){if(t=t||this.$el,!t)return!1;var e=!1;return this.options.parentEl||"body",(e=n(this.options.parentEl).find(t).length)?!0:(this.options.parentPrepend?n(this.options.parentEl).prepend(t):n(this.options.parentEl).append(t),void 0)},_navigate:function(){},_resize:function(){var t,e=this,n=arguments,i=1e3;clearTimeout(t),t=setTimeout(function(){e.resize.apply(e,Array.prototype.slice.call(n))},i)},_scroll:function(){},isVisible:function(){var t=jQuery(i).width(),e=jQuery(i).height(),o=jQuery(document).scrollTop(),s=jQuery(document).scrollLeft(),r=o,a=o+e,u=s,h=s+t,c=n(this.el),l=c.offset(),p=l.top>=r&&l.top<a&&l.left>=u&&l.left<h;return p&&!this.state.get("visible")?this.trigger("visible"):this.trigger("hidden"),this.state.set("visible",p),p}})}(e,n,t,o),function(t,e,n,o){o.Layout=e.View.extend({el:"body",options:{autosync:!1,autorender:!0,sync_events:"add remove change"},events:{"click a:not([rel='external'],[rel='alternate'])":"_clickLink"},views:new e.Model,initialize:function(i){if(i=i||{},this.options=t.extend({},this.options,i),n(this.el).unbind(),t.bindAll(this,"set","get","render","update","_clickLink","_viewLoaded","_syncData"),this.on("update",this.update),this.options.url||this.url){var s=this.options.url||this.url;this.options.type||(this.options.type="default"),this.template=new o.Template(null,{url:s}),this.options.autorender&&this.template.bind("loaded",this.render)}return i.data&&(this.data=i.data),e.View.prototype.initialize.call(this,i)},preRender:function(){},render:function(){if(this._preRender(),n(this.el).removeClass("loading"),this.template){var t=this.options.type?this.template.get(this.options.type):this.template,e=t(this.options);n(this.el).html(e)}this._postRender()},postRender:function(){},update:function(t){if(t=t||!1,t&&t.navigate)for(var e in this.views.attributes)this.views.attributes[e]._navigate(t)},set:function(e){for(var n in e)e[n].on("loaded",t.bind(this._viewLoaded,this)),e[n]._name=n,e[n].data&&(e[n].data._view=n,e[n].data.on(this.options.sync_events,t.bind(this._syncData,this)));return this.views.set(e)},get:function(t){return this.views.get(t)},remove:function(e){var n=this.get(e);if(!t.isUndefined(n))return n.remove(),this.views.unset(e)},findLink:function(e){var o="A"!=e.tagName?n(e).closest("a"):n(e),s=o.attr("href"),r=s?"#"==s.substr(0,1)||"/#"==s.substr(0,2)&&"/"==i.location.pathname:!1;return t.isEmpty(s)||r||o.attr("target")?!1:s},_preRender:function(){app.state.touch&&n(this.el).addClass("touch"),this.preRender()},_postRender:function(){this.postRender()},_viewLoaded:function(){var e=0,n=0;t.each(this.views.attributes,function(t){t.state.loaded&&n++,e++}),e==n&&this._allViewsLoaded()},_allViewsLoaded:t.once(function(){this.render()}),_syncData:function(t,n){var i=!1,o=n||t||!1;if(o){var s=o._view||!1;if(s&&this.model instanceof e.Model){var r=this.model.keys()||[];if(-1==r.indexOf(s))return;try{i=o.output()}catch(a){i=o.toJSON()}if(i){var u={};u[s]=i,this.model.set(u),this.options.autosync&&this.model.save()}}}},_clickLink:function(t){var e=this.findLink(t.target);return e&&n(this.el).addClass("loading"),app.state.standalone()&&e?(t.preventDefault(),i.location=e,!1):void 0}})}(e,n,t,o),function(t,e,n,i){i.Template=e.Model.extend({initialize:function(e,n){t.bindAll(this,"fetch","parse"),n||(n={}),t.isEmpty(e)||(this.set("default",this.compile(e)),this.trigger("loaded")),n.url&&(this.url=n.url,this.fetch())},compile:function(e){return t.template(e)},fetch:function(){n.get(this.url,this.parse)},parse:function(t){var e,i=this;try{e=n(t).filter("script")}catch(o){e=[]}e.length?e.each(function(){var t=n(this);t.attr("type").indexOf("template")>=0&&i.set(t.attr("id"),i.compile(t.html()))}):this.set("default",i.compile(t)),this.trigger("loaded")}})}(e,n,t,o),function(e,n,o){o.Router=n.Router.extend({options:{location:!1,api:!1,p404:"/"},routes:{"":"index","_=_":"_fixFB","access_token=:token":"access_token",logout:"logout"},data:new n.Model,initialize:function(t){t=t||{},e.bindAll(this,"access_token","preRoute","_layoutUpdate","_bindRoutes","_callRoute","_setup","_ajaxPrefilter","_fixFB"),e.extend(this.options,t),this._setup()},state:{fullscreen:!1,online:navigator.onLine,browser:function(){return/chrome/.test(navigator.userAgent.toLowerCase())?"chrome":/firefox/.test(navigator.userAgent.toLowerCase())?"firefox":/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent)?"ios":"other"},mobile:navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i),ipad:null!==navigator.userAgent.match(/iPad/i),touch:"ontouchstart"in document.documentElement,pushstate:function(){try{return i.history.pushState({pageTitle:document.title},document.title,i.location),!0}catch(t){return!1}},scroll:!0,ram:function(){return console.memory?Math.round(100*(console.memory.usedJSHeapSize/console.memory.totalJSHeapSize)):0},standalone:function(){return"standalone"in navigator&&navigator.standalone||"undefined"!=typeof PhoneGap&&!e.isUndefined(PhoneGap.env)&&PhoneGap.env.app||"undefined"!=typeof external&&"function"==typeof external.msIsSiteMode&&external.msIsSiteMode()},framed:top!==self},update:function(){var e=this.state instanceof n.Model?this.state.get("scroll"):this.state.scroll;e?t("body").removeClass("no-scroll"):t("body").addClass("no-scroll")},index:function(){},logout:function(){this.session&&this.session.trigger("logout",{reload:!0}),this.navigate("/",!0)},preRoute:function(t,n){var i=this;return this.session&&"undefined"!=typeof this.session.state?this.session.state?n.apply(i,t):this.session.bind("loaded",e.once(function(){n.apply(i,t)})):n.apply(i,t)},access_token:function(t){this.session?this.session.set({token:t}):i.access_token=t,this.navigate("/",!0)},_setup:function(){this.options.api&&this._ajaxPrefilter(this.options.api),this.bind("all",this._layoutUpdate),this.options.location&&this._geoLocation(),this._setupSession()},_setupSession:function(){var t=o.Session||n.Session||!1;t&&(this.session=new t({},this.options.session||{}))},_ajaxPrefilter:function(e){var n=this.session||!1;t.ajaxPrefilter(function(t,i,o){if("json"==i.dataType){var s=0===t.url.search(/^http/);s||(t.url=e+t.url),t.xhrFields={withCredentials:!0};var r=n?n._csrf||n.get("_csrf")||!1:!1;r&&o.setRequestHeader("X-CSRF-Token",r)}})},_fixFB:function(){this.navigate("/",!0)},_layoutUpdate:function(t){this.layout&&this.layout.trigger("update",{navigate:!0,path:t})},_bindRoutes:function(){if(this.routes){this.routes=e.result(this,"routes");for(var t,n=e.keys(this.routes);"undefined"!=typeof(t=n.pop());){var i=this.routes[t];this.route(t,i,this._callRoute(this[i]))}}},_callRoute:function(t){return function(){this.preRoute.call(this,arguments,t)}},_geoLocation:function(){var t=this;navigator.geolocation.getCurrentPosition(function(e){t.state.location=e},function(){console.log("error",arguments)}),setTimeout(function(){t._geoLocation()},3e4)},_404:function(t){var e="Unable to find path: "+t;console.log(e),this.navigate(this.options.p404)}}),o.Routers.Default=o.Router}(e,n,o),"object"==typeof i&&"object"==typeof i.document&&(i.APP=o),o});