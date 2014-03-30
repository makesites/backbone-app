window.APP||function(){var t=function(){var e=arguments[0]||{},i=arguments[1]||!1,n=!1,o=window.location.pathname.split("/");for(var s in o)if(""!==o[s]&&(n=o[s].charAt(0).toUpperCase()+o[s].slice(1),"function"==typeof t.Routers[n]))break;if(e.require&&!n)return n="default",require(["app/controllers/"+n],function(t){var e=new t;i&&i(e)}),t;var a=n&&t.Routers[n]?new t.Routers[n](e):new t.Routers.Default(e);return i?(i(a),t):a};t.Models={},t.Routers={},t.Collections={},t.Views={},t.Layouts={},t.Templates={},window.APP=t}(this._,this.Backbone),function(t,e){var i=e.Model.extend,n=function(e,n){var o=this;return e&&t.each(e,function(i,n){n in o.prototype&&!(i instanceof Function)&&!(o.prototype[n]instanceof Function)&&o.prototype[n]instanceof Object&&(e[n]="routes"==n?t.extend({},i,o.prototype[n]):t.extend({},o.prototype[n],i))}),i.call(this,e,n)};e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=n}(this._,this.Backbone),function(t){t.templateSettings={interpolate:/\{\{(.+?)\}\}/g,variable:"."},"undefined"!=typeof Handlebars&&t.mixin({template:Handlebars.compile})}(this._,this.Backbone,this.jQuery),function(t,e,i){function n(){return"undefined"!=typeof PhoneGap&&"undefined"!=typeof PhoneGap.init&&"undefined"!=typeof PhoneGap.env&&PhoneGap.env.app}return $="$"in t?t.$:t.jQuery||t.Zepto||!1,i.ready=function(i){return n()?PhoneGap.init(i):$?$(e).ready(i):t.addEventListener?t.addEventListener("load",i,!1):t.attachEvent("onload",i)},i}(window,document,this.Backbone),function(){var t=Backbone.History.prototype.loadUrl;Backbone.History.prototype.loadUrl=function(){var e=t.apply(this,arguments),i=this.fragment;if(/^\//.test(i)||(i="/"+i),"undefined"!=typeof window._gaq&&window._gaq.push(["_trackPageview",i]),"undefined"!=typeof window.GoogleAnalyticsObject){var n=window.GoogleAnalyticsObject;window[n]("send","pageview",i)}return e}}.call(this),function(t,e,i){var n=i.View;return i.View=n.extend({states:{},initialize:function(t){return this.initStates(),n.prototype.initialize.call(this,t)},initStates:function(){for(var t in this.states){var e=this.states[t];this.bind(t,_.bind(this[e],this))}}}),i}(window,document,this.Backbone),function(t,e){APP.Model=e.Model.extend({options:{autofetch:!1,cache:!1},initialize:function(e,i){if(i=i||{},this.options=t.extend({},this.options,i),t.isNull(e)||t.isEmpty(e)||this.set(e),this.options.cache){var n=this.cache();n&&this.set(n)}this.options.autofetch&&!t.isUndefined(this.url)&&this.fetch()},reset:function(){return this.clear().set(this.defaults)},cache:e.Model.prototype.cache||function(){return!1},isOnline:function(){return t.isUndefined(app)?!0:app.state.online},getValue:function(e,i){return e&&e[i]?t.isFunction(e[i])?e[i]():e[i]:null},parse:function(t){var e=this;return setTimeout(function(){e.trigger("fetch")},200),this.options.cache&&this.cache(t),t},output:function(){return this.toJSON()}}),MongoModel=APP.Model.extend({parse:function(t){return t._id&&(t.id=t._id,delete t._id),t}})}(this._,this.Backbone),function(t,e){APP.Collection=e.Collection.extend({options:{_synced:!1,autofetch:!1,cache:!1},model:APP.Model,initialize:function(e,i){if(i=i||{},this.options=t.extend({},this.options,i),this.options.cache){var n=this.cache();n&&this.add(n)}this.options.autofetch&&t.isEmpty(e)&&this.url&&this.fetch()},update:function(){},save:function(e,i){if(t.extend(this.models,e),i.success){var n=t.after(this.models.length,i.success);t.each(this.models,function(t){t.save(null,{success:n})})}},cache:e.Collection.prototype.cache||function(){return!1},parse:function(t){var e=this;return setTimeout(function(){e.trigger("fetch")},200),this.options.cache&&this.cache(t),t},output:function(){return this.toJSON()},isNew:function(){return this.options._synced===!1},isOnline:function(){return t.isUndefined(app)?!0:app.state.online}}),MongoCollection=APP.Collection.extend({parse:function(t){for(var e in t)t[e].id=t[e]._id,delete t[e]._id;return t}})}(this._,this.Backbone),function(t,e,i){APP.View=e.View.extend({options:{data:!1,html:!1,template:!1,url:!1,bind:"add remove reset change",type:!1,parentEl:!1,autoRender:!0,inRender:!1,silentRender:!1,renderTarget:!1,saveOptions:!0},events:{"click a[rel='external']":"clickExternal"},states:{scroll:"_scroll"},state:{loaded:!1,scroll:!1,visible:!1},initialize:function(n){var o=this;n=n||{},this.options=t.extend({},this.options,n),i(this.el).unbind(),t.bindAll(this,"render","clickExternal","postRender"),this.options.saveOptions&&(this.options=t.extend(this.options,n)),this.data=this.data||this.model||this.collection||null,this.options.data=!t.isNull(this.data),this.options.attr?i(this.el).attr("data-view",this.options.attr):i(this.el).removeAttr("data-view");var s=this.options.html?this.options.html:null,a=this.options.template||"undefined"==typeof APP?this.options.template:APP.Template||!1;this.url&&!this.options.url&&(this.options.url=this.url);var r=this._url(n);return this.url=this._url,a?(this.options.type||(this.options.type="default"),this.template="function"==typeof a?new a(s,{url:r}):a,o.options.autoRender&&this.template.bind("loaded",this.render)):r?i.get(r,function(e){o.template=t.template(e),o.options.autoRender&&o.render()}):(this.template=t.template(s),o.options.autoRender&&this.render()),this.options.data&&!t.isUndefined(this.data.on)&&this.data.on(this.options.bind,this.render),this._initRender()&&this.render(),i(window).bind("resize",t.bind(this._resize,this)),e.View.prototype.initialize.call(this,n)},_url:function(t){t=t||{};var e=t.url||this.options.url;return"function"==typeof e?e():e},preRender:function(){},render:function(){if(this.template){this._preRender();var t=this.options.type?this.template.get(this.options.type):this.template,e=this._getJSON(),n=this.options.inRender?{data:e,options:this.options}:e,o=t instanceof Function?t(n):t,s=this._findContainer();this.options.parentEl&&this.options.parentEl===this.options.renderTarget&&(this.el=this.$el=i(o),o=this.el),this.options.append?s.append(o):s.html(o),this._postRender()}},postRender:function(){},listen:function(t,e,i){var n="string"==typeof e?[e]:e;for(var o in n)t.bind(n[o],i)},resize:function(){},clickExternal:function(t){t.preventDefault();var e=this.findLink(t.target);"undefined"!=typeof pageTracker&&(e=pageTracker._getLinkerUrl(e));try{window.plugins.childBrowser.showWebPage(e)}catch(i){window.open(e,"_blank")}return!1},clickTab:function(t){t.preventDefault();var e=this.findLink(t.target);i(this.el).find(e).show().siblings().hide(),i(t.target).parent("li").addClass("selected").siblings().removeClass("selected")},findLink:function(t){return"A"!=t.tagName?i(t).closest("a").attr("href"):i(t).attr("href")},remove:function(){i(window).unbind("resize",this._resize),e.View.prototype.remove.call(this)},unbind:function(t,e){return this.off(t,null,e)},_initRender:function(){if(!this.options.autoRender)return!1;var e=this.options.html||this.options.url,i=this.options.data&&(t.isUndefined(this.data.toJSON)||!t.isUndefined(this.data.toJSON)&&!t.isEmpty(this.data.toJSON()));return e&&!this.options.data?!0:i?!0:!1},_preRender:function(){this.preRender()},_postRender:function(){this.options.silentRender||i(this.el).show(),(!this.options.data||this.options.data&&!t.isEmpty(this._getJSON()))&&(i(this.el).removeClass("loading"),this.state.loaded=!0,this.trigger("loaded")),this.postRender()},_getJSON:function(){return this.options.data?this.data.toJSON?this.data.toJSON():this.data:{}},_findContainer:function(){var t=this.el;return this.options.renderTarget&&("string"==typeof this.options.renderTarget?t=i(this.el).find(this.options.renderTarget).first():"object"==typeof this.options.renderTarget&&(t=this.options.renderTarget)),t instanceof jQuery?t:i(t)},_navigate:function(){},_resize:function(){var t,e=this,i=arguments,n=1e3;clearTimeout(t),t=setTimeout(function(){e.resize.apply(e,Array.prototype.slice.call(i))},n)},_scroll:function(){},isVisible:function(){var t=jQuery(window).width(),e=jQuery(window).height(),n=jQuery(document).scrollTop(),o=jQuery(document).scrollLeft(),s=n,a=n+e,r=o,h=o+t,l=i(this.el),u=l.offset(),d=u.top>=s&&u.top<a&&u.left>=r&&u.left<h;return d&&!this.state.visible?this.trigger("visible"):this.trigger("hidden"),this.state.visible=d,d}})}(this._,this.Backbone,this.jQuery),function(t,e,i){APP.Layout=e.View.extend({el:"body",options:{autosync:!1,autorender:!0,sync_events:"add remove change"},events:{"click a:not([rel='external'],[rel='alternate'])":"_clickLink"},views:new e.Model,initialize:function(n){if(n=n||{},this.options=t.extend({},this.options,n),i(this.el).unbind(),t.bindAll(this,"set","get","render","update","_clickLink","_viewLoaded","_syncData"),this.on("update",this.update),this.options.url||this.url){var o=this.options.url||this.url;this.options.type||(this.options.type="default"),this.template=new APP.Template(null,{url:o}),this.options.autorender&&this.template.bind("loaded",this.render)}return e.View.prototype.initialize.call(this,n)},preRender:function(){},render:function(){if(this._preRender(),i(this.el).removeClass("loading"),this.template){var t=this.options.type?this.template.get(this.options.type):this.template,e=t(this.options);i(this.el).html(e)}this._postRender()},postRender:function(){},update:function(t){if(t=t||!1,t&&t.navigate)for(var e in this.views.attributes)this.views.attributes[e]._navigate(t)},set:function(e){for(var i in e)e[i].on("loaded",t.bind(this._viewLoaded,this)),e[i]._name=i,e[i].data&&(e[i].data._view=i,e[i].data.on(this.options.sync_events,t.bind(this._syncData,this)));return this.views.set(e)},get:function(t){return this.views.get(t)},remove:function(e){var i=this.get(e);if(!t.isUndefined(i))return i.remove(),this.views.unset(e)},findLink:function(e){var n="A"!=e.tagName?i(e).closest("a").attr("href"):i(e).attr("href");return t.isEmpty(n)||"#"==n.substr(0,1)?!1:n},_preRender:function(){app.state.touch&&i(this.el).addClass("touch"),this.preRender()},_postRender:function(){this.postRender()},_viewLoaded:function(){var e=0,i=0;t.each(this.views.attributes,function(t){t.state.loaded&&i++,e++}),e==i&&this._allViewsLoaded()},_allViewsLoaded:t.once(function(){this.render()}),_syncData:function(t,i){var n=!1,o=i||t||!1;if(o){var s=o._view||!1;if(s&&this.model instanceof e.Model){var a=this.model.keys()||[];if(-1==a.indexOf(s))return;try{n=o.output()}catch(r){n=o.toJSON()}if(n){var h={};h[s]=n,this.model.set(h),this.options.autosync&&this.model.save()}}}},_clickLink:function(t){var e=this.findLink(t.target);return e&&i(this.el).addClass("loading"),app.state.standalone()&&e?(t.preventDefault(),window.location=e,!1):void 0}})}(this._,this.Backbone,this.jQuery),function(t,e,i){APP.Template=e.Model.extend({initialize:function(e,i){t.bindAll(this,"fetch","parse"),i||(i={}),t.isEmpty(e)||(this.set("default",this.compile(e)),this.trigger("loaded")),i.url&&(this.url=i.url,this.fetch())},compile:function(e){return t.template(e)},fetch:function(){i.get(this.url,this.parse)},parse:function(t){var e,n=this;try{e=i(t).filter("script")}catch(o){e=[]}e.length?e.each(function(){var t=i(this);t.attr("type").indexOf("template")>=0&&n.set(t.attr("id"),n.compile(t.html()))}):this.set("default",n.compile(t)),this.trigger("loaded")}})}(this._,this.Backbone,this.jQuery),function(t,e){APP.Router=e.Router.extend({options:{location:!1,api:!1,p404:"/"},routes:{"":"index","_=_":"_fixFB","access_token=:token":"access_token",logout:"logout","*path":"_404"},data:new e.Model,initialize:function(e){e=e||{},t.bindAll(this,"access_token","preRoute","_layoutUpdate","_bindRoutes","_callRoute","_setup","_ajaxPrefilter","_fixFB"),t.extend(this.options,e),this._setup()},state:{fullscreen:!1,online:navigator.onLine,browser:function(){return $.browser.safari&&/chrome/.test(navigator.userAgent.toLowerCase())?"chrome":/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent)?"ios":"other"},mobile:navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i),ipad:null!==navigator.userAgent.match(/iPad/i),touch:"ontouchstart"in document.documentElement,pushstate:function(){try{return window.history.pushState({pageTitle:document.title},document.title,window.location),!0}catch(t){return!1}},scroll:!0,ram:function(){return console.memory?Math.round(100*(console.memory.usedJSHeapSize/console.memory.totalJSHeapSize)):0},standalone:function(){return"standalone"in window.navigator&&window.navigator.standalone||"undefined"!=typeof PhoneGap&&!t.isUndefined(PhoneGap.env)&&PhoneGap.env.app},framed:top!==self},update:function(){var t=this.state instanceof e.Model?this.state.get("scroll"):this.state.scroll;t?$("body").removeClass("no-scroll"):$("body").addClass("no-scroll")},index:function(){},logout:function(){this.session&&this.session.trigger("logout",{reload:!0}),this.navigate("/",!0)},preRoute:function(e,i){var n=this;return this.session&&"undefined"!=typeof this.session.state?this.session.state?i.apply(n,e):this.session.bind("loaded",t.once(function(){i.apply(n,e)})):i.apply(n,e)},access_token:function(t){this.session?this.session.set({token:t}):window.access_token=t,this.navigate("/",!0)},_setup:function(){this.options.api&&this._ajaxPrefilter(this.options.api),this.bind("all",this._layoutUpdate),this.options.location&&this._geoLocation(),APP.Session&&(this.session=new APP.Session({},this.options.session||{}))},_ajaxPrefilter:function(t){var e=this.session||!1;$.ajaxPrefilter(function(i,n,o){if("json"==n.dataType){var s=0===i.url.search(/^http/);s||(i.url=t+i.url),i.xhrFields={withCredentials:!0};var a=e?e._csrf||e.get("_csrf")||!1:!1;a&&o.setRequestHeader("X-CSRF-Token",a)}})},_fixFB:function(){this.navigate("/",!0)},_layoutUpdate:function(t){this.layout&&this.layout.trigger("update",{navigate:!0,path:t})},_bindRoutes:function(){if(this.routes)for(var e,i=t.keys(this.routes);"undefined"!=typeof(e=i.pop());){var n=this.routes[e];this.route(e,n,this._callRoute(this[n]))}},_callRoute:function(t){return function(){this.preRoute.call(this,arguments,t)}},_geoLocation:function(){var t=this;navigator.geolocation.getCurrentPosition(function(e){t.state.location=e},function(){console.log("error",arguments)}),setTimeout(function(){t._geoLocation()},3e4)},_404:function(t){var e="Unable to find path: "+t;console.log(e),this.navigate(this.options.p404)}})}(this._,this.Backbone),function(t){var e=t.APP;"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=e:"function"==typeof define&&define.amd&&define([],function(){return e})}(this.window);