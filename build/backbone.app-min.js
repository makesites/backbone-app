window.APP||function(){var t=function(){var e=arguments[0]||{},n=arguments[1]||!1,i=!1,o=window.location.pathname.split("/");for(var s in o)if(""!==o[s]&&(i=o[s].charAt(0).toUpperCase()+o[s].slice(1),"function"==typeof t.Routers[i]))break;if(e.require&&!i)return i="string"==typeof e.require?e.require:"default",require([i],function(t){var e=new t;n&&n(e)}),t;var a=i&&t.Routers[i]?new t.Routers[i](e):new t.Routers.Default(e);return n?(n(a),t):a};t.Models={},t.Routers={},t.Collections={},t.Views={},t.Layouts={},t.Templates={},window.APP=t}(this._,this.Backbone),function(t,e){var n=e.Model.extend,i=function(e,i){var o=this;return e&&t.each(e,function(n,i){i in o.prototype&&!(n instanceof Function)&&!(o.prototype[i]instanceof Function)&&o.prototype[i]instanceof Object&&(e[i]="routes"==i?t.extend({},n,o.prototype[i]):t.extend({},o.prototype[i],n))}),n.call(this,e,i)};e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=i}(this._,this.Backbone),function(t){t.templateSettings={interpolate:/\{\{(.+?)\}\}/g,variable:"."},"undefined"!=typeof Handlebars&&t.mixin({template:Handlebars.compile})}(this._,this.Backbone,this.jQuery),function(t,e,n){function i(){return"undefined"!=typeof PhoneGap&&"undefined"!=typeof PhoneGap.init&&"undefined"!=typeof PhoneGap.env&&PhoneGap.env.app}return $="$"in t?t.$:t.jQuery||t.Zepto||!1,n.ready=function(n){return i()?PhoneGap.init(n):$?$(e).ready(n):t.addEventListener?t.addEventListener("load",n,!1):t.attachEvent("onload",n)},n}(window,document,this.Backbone),function(){var t=Backbone.History.prototype.loadUrl;Backbone.History.prototype.loadUrl=function(){var e=t.apply(this,arguments),n=this.fragment;if(/^\//.test(n)||(n="/"+n),"undefined"!=typeof window._gaq&&window._gaq.push(["_trackPageview",n]),"undefined"!=typeof window.GoogleAnalyticsObject){var i=window.GoogleAnalyticsObject;window[i]("send","pageview",n)}return e}}.call(this),function(t,e,n){var i=n.View;return n.View=i.extend({states:{},initialize:function(t){return this.initStates(),i.prototype.initialize.call(this,t)},initStates:function(){for(var t in this.states){var e=this.states[t];this.bind(t,_.bind(this[e],this))}}}),n}(window,document,this.Backbone),function(t,e){APP.Model=e.Model.extend({options:{autofetch:!1,cache:!1},initialize:function(e,n){if(n=n||{},this.options=t.extend({},this.options,n),t.isNull(e)||t.isEmpty(e)||this.set(e),this.options.cache){var i=this.cache();i&&this.set(i)}this.options.autofetch&&!t.isUndefined(this.url)&&this.fetch()},reset:function(){return this.clear().set(this.defaults)},cache:e.Model.prototype.cache||function(){return!1},isOnline:function(){return t.isUndefined(app)?!0:app.state.online},getValue:function(e,n){return e&&e[n]?t.isFunction(e[n])?e[n]():e[n]:null},parse:function(t){var e=this;return setTimeout(function(){e.trigger("fetch")},200),this.options.cache&&this.cache(t),t},output:function(){return this.toJSON()}}),MongoModel=APP.Model.extend({parse:function(t){return t._id&&(t.id=t._id,delete t._id),t}})}(this._,this.Backbone),function(t,e){APP.Collection=e.Collection.extend({options:{_synced:!1,autofetch:!1,cache:!1},model:APP.Model,initialize:function(e,n){if(n=n||{},this.options=t.extend({},this.options,n),this.options.cache){var i=this.cache();i&&this.add(i)}this.options.autofetch&&t.isEmpty(e)&&this.url&&this.fetch()},update:function(){},save:function(e,n){if(t.extend(this.models,e),n.success){var i=t.after(this.models.length,n.success);t.each(this.models,function(t){t.save(null,{success:i})})}},cache:e.Collection.prototype.cache||function(){return!1},parse:function(t){var e=this;return setTimeout(function(){e.trigger("fetch")},200),this.options.cache&&this.cache(t),t},output:function(){return this.toJSON()},isNew:function(){return this.options._synced===!1},isOnline:function(){return t.isUndefined(app)?!0:app.state.online}}),MongoCollection=APP.Collection.extend({parse:function(t){for(var e in t)t[e].id=t[e]._id,delete t[e]._id;return t}})}(this._,this.Backbone),function(t,e,n){APP.View=e.View.extend({options:{data:!1,html:!1,template:!1,url:!1,bind:"add remove reset change",type:!1,parentEl:!1,autoRender:!0,inRender:!1,silentRender:!1,renderTarget:!1,saveOptions:!0},events:{"click a[rel='external']":"clickExternal"},states:{scroll:"_scroll"},state:{loaded:!1,scroll:!1,visible:!1},initialize:function(i){var o=this;i=i||{},this.options=t.extend({},this.options,i),n(this.el).unbind(),t.bindAll(this,"render","clickExternal","postRender"),this.options.saveOptions&&(this.options=t.extend(this.options,i)),this.data=this.data||this.model||this.collection||null,this.options.data=!t.isNull(this.data),this.options.attr?n(this.el).attr("data-view",this.options.attr):n(this.el).removeAttr("data-view");var s=this.options.html?this.options.html:null,a=this.options.template||"undefined"==typeof APP?this.options.template:APP.Template||!1;this.url&&!this.options.url&&(this.options.url=this.url);var r=this._url(i);return this.url=this._url,a?(this.options.type||(this.options.type="default"),this.template="function"==typeof a?new a(s,{url:r}):a,o.options.autoRender&&this.template.bind("loaded",this.render)):r?n.get(r,function(e){o.template=t.template(e),o.options.autoRender&&o.render()}):(this.template=t.template(s),o.options.autoRender&&this.render()),this.options.data&&!t.isUndefined(this.data.on)&&this.data.on(this.options.bind,this.render),this._initRender()&&this.render(),n(window).bind("resize",t.bind(this._resize,this)),e.View.prototype.initialize.call(this,i)},_url:function(t){t=t||{};var e=t.url||this.options.url;return"function"==typeof e?e():e},preRender:function(){},render:function(){if(this.template){this._preRender();var t=this.options.type?this.template.get(this.options.type):this.template,e=this._getJSON(),i=this.options.inRender?{data:e,options:this.options}:e,o=t instanceof Function?t(i):t,s=this._findContainer();this.options.parentEl&&this.options.parentEl===this.options.renderTarget&&(this.el=this.$el=n(o),o=this.el),this.options.append?s.append(o):s.html(o),this._postRender()}},postRender:function(){},listen:function(t,e,n){var i="string"==typeof e?[e]:e;for(var o in i)t.bind(i[o],n)},resize:function(){},clickExternal:function(t){t.preventDefault();var e=this.findLink(t.target);"undefined"!=typeof pageTracker&&(e=pageTracker._getLinkerUrl(e));try{window.plugins.childBrowser.showWebPage(e)}catch(n){window.open(e,"_blank")}return!1},clickTab:function(t){t.preventDefault();var e=this.findLink(t.target);n(this.el).find(e).show().siblings().hide(),n(t.target).parent("li").addClass("selected").siblings().removeClass("selected")},findLink:function(t){return"A"!=t.tagName?n(t).closest("a").attr("href"):n(t).attr("href")},remove:function(){n(window).unbind("resize",this._resize),e.View.prototype.remove.call(this)},unbind:function(t,e){return this.off(t,null,e)},_initRender:function(){if(!this.options.autoRender)return!1;var e=this.options.html||this.options.url,n=this.options.data&&(t.isUndefined(this.data.toJSON)||!t.isUndefined(this.data.toJSON)&&!t.isEmpty(this.data.toJSON()));return e&&!this.options.data?!0:n?!0:!1},_preRender:function(){this.preRender()},_postRender:function(){this.options.silentRender||n(this.el).show(),(!this.options.data||this.options.data&&!t.isEmpty(this._getJSON()))&&(n(this.el).removeClass("loading"),this.state.loaded=!0,this.trigger("loaded")),this.postRender()},_getJSON:function(){return this.options.data?this.data.toJSON?this.data.toJSON():this.data:{}},_findContainer:function(){var t=this.el;return this.options.renderTarget&&("string"==typeof this.options.renderTarget?t=n(this.el).find(this.options.renderTarget).first():"object"==typeof this.options.renderTarget&&(t=this.options.renderTarget)),t instanceof jQuery?t:n(t)},_navigate:function(){},_resize:function(){var t,e=this,n=arguments,i=1e3;clearTimeout(t),t=setTimeout(function(){e.resize.apply(e,Array.prototype.slice.call(n))},i)},_scroll:function(){},isVisible:function(){var t=jQuery(window).width(),e=jQuery(window).height(),i=jQuery(document).scrollTop(),o=jQuery(document).scrollLeft(),s=i,a=i+e,r=o,u=o+t,h=n(this.el),c=h.offset(),d=c.top>=s&&c.top<a&&c.left>=r&&c.left<u;return d&&!this.state.visible?this.trigger("visible"):this.trigger("hidden"),this.state.visible=d,d}})}(this._,this.Backbone,this.jQuery),function(t,e,n){APP.Layout=e.View.extend({el:"body",options:{autosync:!1,autorender:!0,sync_events:"add remove change"},events:{"click a:not([rel='external'],[rel='alternate'])":"_clickLink"},views:new e.Model,initialize:function(i){if(i=i||{},this.options=t.extend({},this.options,i),n(this.el).unbind(),t.bindAll(this,"set","get","render","update","_clickLink","_viewLoaded","_syncData"),this.on("update",this.update),this.options.url||this.url){var o=this.options.url||this.url;this.options.type||(this.options.type="default"),this.template=new APP.Template(null,{url:o}),this.options.autorender&&this.template.bind("loaded",this.render)}return e.View.prototype.initialize.call(this,i)},preRender:function(){},render:function(){if(this._preRender(),n(this.el).removeClass("loading"),this.template){var t=this.options.type?this.template.get(this.options.type):this.template,e=t(this.options);n(this.el).html(e)}this._postRender()},postRender:function(){},update:function(t){if(t=t||!1,t&&t.navigate)for(var e in this.views.attributes)this.views.attributes[e]._navigate(t)},set:function(e){for(var n in e)e[n].on("loaded",t.bind(this._viewLoaded,this)),e[n]._name=n,e[n].data&&(e[n].data._view=n,e[n].data.on(this.options.sync_events,t.bind(this._syncData,this)));return this.views.set(e)},get:function(t){return this.views.get(t)},remove:function(e){var n=this.get(e);if(!t.isUndefined(n))return n.remove(),this.views.unset(e)},findLink:function(e){var i="A"!=e.tagName?n(e).closest("a"):n(e),o=i.attr("href");return t.isEmpty(o)||"#"==o.substr(0,1)||i.attr("target")?!1:o},_preRender:function(){app.state.touch&&n(this.el).addClass("touch"),this.preRender()},_postRender:function(){this.postRender()},_viewLoaded:function(){var e=0,n=0;t.each(this.views.attributes,function(t){t.state.loaded&&n++,e++}),e==n&&this._allViewsLoaded()},_allViewsLoaded:t.once(function(){this.render()}),_syncData:function(t,n){var i=!1,o=n||t||!1;if(o){var s=o._view||!1;if(s&&this.model instanceof e.Model){var a=this.model.keys()||[];if(-1==a.indexOf(s))return;try{i=o.output()}catch(r){i=o.toJSON()}if(i){var u={};u[s]=i,this.model.set(u),this.options.autosync&&this.model.save()}}}},_clickLink:function(t){var e=this.findLink(t.target);return e&&n(this.el).addClass("loading"),app.state.standalone()&&e?(t.preventDefault(),window.location=e,!1):void 0}})}(this._,this.Backbone,this.jQuery),function(t,e,n){APP.Template=e.Model.extend({initialize:function(e,n){t.bindAll(this,"fetch","parse"),n||(n={}),t.isEmpty(e)||(this.set("default",this.compile(e)),this.trigger("loaded")),n.url&&(this.url=n.url,this.fetch())},compile:function(e){return t.template(e)},fetch:function(){n.get(this.url,this.parse)},parse:function(t){var e,i=this;try{e=n(t).filter("script")}catch(o){e=[]}e.length?e.each(function(){var t=n(this);t.attr("type").indexOf("template")>=0&&i.set(t.attr("id"),i.compile(t.html()))}):this.set("default",i.compile(t)),this.trigger("loaded")}})}(this._,this.Backbone,this.jQuery),function(t,e){APP.Router=e.Router.extend({options:{location:!1,api:!1,p404:"/"},routes:{"":"index","_=_":"_fixFB","access_token=:token":"access_token",logout:"logout","*path":"_404"},data:new e.Model,initialize:function(e){e=e||{},t.bindAll(this,"access_token","preRoute","_layoutUpdate","_bindRoutes","_callRoute","_setup","_ajaxPrefilter","_fixFB"),t.extend(this.options,e),this._setup()},state:{fullscreen:!1,online:navigator.onLine,browser:function(){return $.browser.safari&&/chrome/.test(navigator.userAgent.toLowerCase())?"chrome":/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent)?"ios":"other"},mobile:navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i),ipad:null!==navigator.userAgent.match(/iPad/i),touch:"ontouchstart"in document.documentElement,pushstate:function(){try{return window.history.pushState({pageTitle:document.title},document.title,window.location),!0}catch(t){return!1}},scroll:!0,ram:function(){return console.memory?Math.round(100*(console.memory.usedJSHeapSize/console.memory.totalJSHeapSize)):0},standalone:function(){return"standalone"in window.navigator&&window.navigator.standalone||"undefined"!=typeof PhoneGap&&!t.isUndefined(PhoneGap.env)&&PhoneGap.env.app},framed:top!==self},update:function(){var t=this.state instanceof e.Model?this.state.get("scroll"):this.state.scroll;t?$("body").removeClass("no-scroll"):$("body").addClass("no-scroll")},index:function(){},logout:function(){this.session&&this.session.trigger("logout",{reload:!0}),this.navigate("/",!0)},preRoute:function(e,n){var i=this;return this.session&&"undefined"!=typeof this.session.state?this.session.state?n.apply(i,e):this.session.bind("loaded",t.once(function(){n.apply(i,e)})):n.apply(i,e)},access_token:function(t){this.session?this.session.set({token:t}):window.access_token=t,this.navigate("/",!0)},_setup:function(){this.options.api&&this._ajaxPrefilter(this.options.api),this.bind("all",this._layoutUpdate),this.options.location&&this._geoLocation(),APP.Session&&(this.session=new APP.Session({},this.options.session||{}))},_ajaxPrefilter:function(t){var e=this.session||!1;$.ajaxPrefilter(function(n,i,o){if("json"==i.dataType){var s=0===n.url.search(/^http/);s||(n.url=t+n.url),n.xhrFields={withCredentials:!0};var a=e?e._csrf||e.get("_csrf")||!1:!1;a&&o.setRequestHeader("X-CSRF-Token",a)}})},_fixFB:function(){this.navigate("/",!0)},_layoutUpdate:function(t){this.layout&&this.layout.trigger("update",{navigate:!0,path:t})},_bindRoutes:function(){if(this.routes)for(var e,n=t.keys(this.routes);"undefined"!=typeof(e=n.pop());){var i=this.routes[e];this.route(e,i,this._callRoute(this[i]))}},_callRoute:function(t){return function(){this.preRoute.call(this,arguments,t)}},_geoLocation:function(){var t=this;navigator.geolocation.getCurrentPosition(function(e){t.state.location=e},function(){console.log("error",arguments)}),setTimeout(function(){t._geoLocation()},3e4)},_404:function(t){var e="Unable to find path: "+t;console.log(e),this.navigate(this.options.p404)}}),APP.Routers.Default=APP.Router}(this._,this.Backbone),function(t){var e=t.APP;"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=e:"function"==typeof define&&define.amd&&define([],function(){return e})}(this.window),function(t,e,n,i,o){var s="undefined"!=typeof o&&"undefined"!=typeof o.View,a=s?o.View:i.View,r=a.extend({el:"body",options:{targetEl:"body",ease:"easeFrom",duration:2},_transitionData:{start:0,end:0,easing:!1,startPos:0,endPos:0,pos:0},initialize:function(t){return n.bindAll(this,"transitionStart","transition","transitionEnd"),this.options=n.extend({},this.options,t),this.tick=new Tick,this.targetEl=e(this.options.targetEl)[0],a.prototype.initialize.call(this,t)},transitionData:function(){var t,e,i,o=n.now();return t={start:o,end:o+1e3*this.options.duration,easing:easing[this.options.ease],startPos:e,endPos:i,pos:e},this._transitionData=t,t},transitionPos:function(t){},transitionStart:function(t){this.transitionData(t),this.tick.add(this.transition)},transition:function(){var t=n.now(),e=this._transitionData;if(t>e.end)return this.transitionEnd();if(e.pos&&e.pos!==this.transitionPos())return this.transitionEnd();var i=e.startPos,o=e.endPos,s=e.easing,a=(e.end-t)/(1e3*this.options.duration),r=Math.round(i+(o-i)*(1-s(a)));this.transitionPos(r),e.pos=r,this._transitionData=e},transitionEnd:function(){this.tick.remove(this.transition)}});n.mixin({now:function(){return(new Date).getTime()}}),function(t,e){"function"==typeof define?define(e):"undefined"!=typeof module?module.exports=e:this[t]=e}("easing",{easeInQuad:function(t){return Math.pow(t,2)},easeOutQuad:function(t){return-(Math.pow(t-1,2)-1)},easeInOutQuad:function(t){return(t/=.5)<1?.5*Math.pow(t,2):-.5*((t-=2)*t-2)},easeInCubic:function(t){return Math.pow(t,3)},easeOutCubic:function(t){return Math.pow(t-1,3)+1},easeInOutCubic:function(t){return(t/=.5)<1?.5*Math.pow(t,3):.5*(Math.pow(t-2,3)+2)},easeInQuart:function(t){return Math.pow(t,4)},easeOutQuart:function(t){return-(Math.pow(t-1,4)-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*Math.pow(t,4):-.5*((t-=2)*Math.pow(t,3)-2)},easeInQuint:function(t){return Math.pow(t,5)},easeOutQuint:function(t){return Math.pow(t-1,5)+1},easeInOutQuint:function(t){return(t/=.5)<1?.5*Math.pow(t,5):.5*(Math.pow(t-2,5)+2)},easeInSine:function(t){return-Math.cos(t*(Math.PI/2))+1},easeOutSine:function(t){return Math.sin(t*(Math.PI/2))},easeInOutSine:function(t){return-.5*(Math.cos(Math.PI*t)-1)},easeInExpo:function(t){return 0===t?0:Math.pow(2,10*(t-1))},easeOutExpo:function(t){return 1===t?1:-Math.pow(2,-10*t)+1},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},easeInCirc:function(t){return-(Math.sqrt(1-t*t)-1)},easeOutCirc:function(t){return Math.sqrt(1-Math.pow(t-1,2))},easeInOutCirc:function(t){return(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeOutBounce:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},easeInBack:function(t){var e=1.70158;return t*t*((e+1)*t-e)},easeOutBack:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},easeInOutBack:function(t){var e=1.70158;return(t/=.5)<1?.5*t*t*(((e*=1.525)+1)*t-e):.5*((t-=2)*t*(((e*=1.525)+1)*t+e)+2)},elastic:function(t){return-1*Math.pow(4,-8*t)*Math.sin((6*t-1)*2*Math.PI/2)+1},swingFromTo:function(t){var e=1.70158;return(t/=.5)<1?.5*t*t*(((e*=1.525)+1)*t-e):.5*((t-=2)*t*(((e*=1.525)+1)*t+e)+2)},swingFrom:function(t){var e=1.70158;return t*t*((e+1)*t-e)},swingTo:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},bounce:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},bouncePast:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?2-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?2-(7.5625*(t-=2.25/2.75)*t+.9375):2-(7.5625*(t-=2.625/2.75)*t+.984375)},easeFromTo:function(t){return(t/=.5)<1?.5*Math.pow(t,4):-.5*((t-=2)*Math.pow(t,3)-2)},easeFrom:function(t){return Math.pow(t,4)},easeTo:function(t){return Math.pow(t,.25)}}),function(t){var e=function(t){t=t||{},t.rate&&(this.options.rate=t.rate),this.rate(),this.loop()};e.prototype={options:{rate:1e3/60},queue:[],rate:function(e){e=e||this.options.rate,t.requestAnimFrame=t.requestAnimFrame||function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(n){t.setTimeout(function(){n(+new Date)},e)}}()},loop:function(e){this.process(e),t.requestAnimFrame(this.loop.bind(this))},process:function(t){for(var e in this.queue){var n=this.queue[e];if("function"==typeof n.fn){var i=t%n.interval;0===i||n.run+n.interval>t||(n.fn(),this.queue[e]&&(this.queue[e].run=t))}}},add:function(t,e){if("function"==typeof t){e=e||this.options.rate;var n={fn:t,interval:e,run:0};this.queue.push(n)}},remove:function(t){var e=!1;for(var n in this.queue){var i=this.queue[n];String(i.fn)===String(t)&&(e=!0,delete this.queue[n])}return e}},t.Tick=e}(this.window),"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=r:"function"==typeof define&&define.amd&&define("backbone.easing",["jquery","underscore","backbone"],function(){return r}),"object"==typeof t&&"object"==typeof t.document&&(s&&(o.Easing=r,t.APP=o),i.Easing=r,t.Backbone=i)}(this.window,this.$,this._,this.Backbone,this.APP);