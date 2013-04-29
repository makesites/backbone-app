window.APP||function(){APP=function(){var t=arguments[0]||{},e=!1,i=window.location.pathname.split("/");for(var n in i)if(i[n]!==""&&(e=i[n].charAt(0).toUpperCase()+i[n].slice(1),typeof APP.Routers[e]=="function"))break;var o=e&&APP.Routers[e]?new APP.Routers[e](t):new APP.Routers.Default(t);return o},APP.Models={},APP.Routers={},APP.Collections={},APP.Views={},APP.Layouts={},APP.Templates={}}(this._,this.Backbone),function(t,e){var i=e.Model.extend,n=function(e,n){var o=this;return e&&t.each(e,function(i,n){!(n in o.prototype)||i instanceof Function||o.prototype[n]instanceof Function||(e[n]=t.extend({},o.prototype[n],i))}),i.call(this,e,n)};e.Model.extend=e.Collection.extend=e.Router.extend=e.View.extend=n}(this._,this.Backbone),function(t){t.templateSettings={interpolate:/\{\{(.+?)\}\}/g,variable:"."},typeof Handlebars!="undefined"&&t.mixin({template:Handlebars.compile})}(this._,this.Backbone,this.jQuery),function(t,e){APP.Model=e.Model.extend({cache:function(){},isOnline:function(){return t.isUndefined(app)?!0:app.state.online},sync:function(i,n,o){var s={create:"POST",update:"PUT","delete":"DELETE",read:"GET"},a=s[i];o||(o={});var r={type:a,dataType:"json",data:{}};return o.url||(r.url=this.getValue(n,"url")||urlError()),o.data||!n||i!="create"&&i!="update"||(r.contentType="application/json",r.data=JSON.stringify(n.toJSON())),r.type==="GET"||e.emulateJSON||(r.processData=!1),$.ajax(t.extend(r,o))},getValue:function(e,i){return e&&e[i]?t.isFunction(e[i])?e[i]():e[i]:null}}),MongoModel=APP.Model.extend({parse:function(t){return t._id&&(t.id=t._id,delete t._id),t}})}(this._,this.Backbone),function(t,e){APP.Collection=e.Collection.extend({initialize:function(e,i){this.options=i||{},t.isNull(e)&&this.fetch()},attributes:{},add:function(i,n){var o={};return i=t.isArray(i)?i.slice():[i],t.each(i,function(e){t.isUndefined(e.id)?o["add_model_"+Math.random()]=e:t.isUndefined(this.get(e.id))?o[e.id]=e:this.set(e)},this),o=t.toArray(o),e.Collection.prototype.add.call(this,o,n)},set:function(e){var i=this.get(e.id),n=t.extend(i,e);this.remove(i),this.add(n)},update:function(){},setAttr:function(t){for(var e in t)this.attributes[e]=t[e]},getAttr:function(t){return this.attributes[t]},isOnline:function(){return t.isUndefined(app)?!0:app.state.online}}),MongoCollection=APP.Collection.extend({parse:function(t){for(var e in t)t[e].id=t[e]._id,delete t[e]._id;return t}})}(this._,this.Backbone),function(t,e,i){APP.View=e.View.extend({options:{data:!1,html:!1,template:!1,url:!1,type:!1},state:{loaded:!1},events:{"click a[rel='external']":"clickExternal"},initialize:function(){var e=this;i(this.el).unbind(),t.bindAll(this,"render","clickExternal","postRender"),this.data=this.data||this.model||this.collection||null,this.options.data=!t.isNull(this.data),this.options.attr?i(this.el).attr("data-view",this.options.attr):i(this.el).removeAttr("data-view");var n=this.options.html?this.options.html:null,o=this.options.template||typeof APP=="undefined"?this.options.template:APP.Template||!1;o?(this.options.type||(this.options.type="default"),this.template=new o(n,{url:this.options.url}),this.template.bind("loaded",this.render)):this.options.url?i.get(this.options.url,function(i){e.template=t.template(i),e.render()}):(this.template=t.template(n),this.render()),this.options.data&&(this.data.bind("change",this.render),this.data.bind("reset",this.render),this.data.bind("add",this.render),this.data.bind("remove",this.render)),((this.options.html||this.options.url)&&!this.options.data||this.options.data&&!t.isEmpty(this.data.toJSON()))&&this.render(),i(window).bind("resize",t.bind(this._resize,this))},preRender:function(){},render:function(){if(this.template){this.preRender();var t=this.options.type?this.template.get(this.options.type):this.template,e=this.options.data?this.data.toJSON():{},n=t instanceof Function?t(e):t;this.options.append?i(this.el).append(n):i(this.el).html(n),this.postRender()}},postRender:function(){i(this.el).show(),(!this.options.data||this.options.data&&!t.isEmpty(this.data.toJSON()))&&(i(this.el).removeClass("loading"),this.state.loaded=!0,this.trigger("loaded"))},listen:function(t,e,i){var n=typeof e=="string"?[e]:e;for(var o in n)t.bind(n[o],i)},resize:function(){},clickExternal:function(t){t.preventDefault();var e=this.findLink(t.target);typeof pageTracker!="undefined"&&(e=pageTracker._getLinkerUrl(e));try{window.plugins.childBrowser.showWebPage(e)}catch(i){window.open(e,"_blank")}return!1},findLink:function(t){return t.tagName!="A"?i(t).closest("a").attr("href"):i(t).attr("href")},remove:function(){i(window).unbind("resize",this._resize),e.View.prototype.remove.call(this)},_navigate:function(){},_resize:function(){var t,e=this,i=arguments,n=1e3;console.log("resize"),clearTimeout(t),t=setTimeout(function(){e.resize.apply(e,Array.prototype.slice.call(i))},n)}})}(this._,this.Backbone,this.jQuery),function(t,e,i){APP.Layout=e.View.extend({el:"body",events:{},views:new e.Model,initialize:function(){i(this.el).unbind(),t.bindAll(this),this.on("update",this.update)},render:function(){i(this.el).removeClass("loading")},update:function(t){if(t=t||!1,t&&t.navigate)for(var e in this.views.attributes)this.views.attributes[e]._navigate(t)},set:function(t){for(var e in t)t[e].on("loaded",this._viewLoaded);return this.views.set(t)},get:function(t){return this.views.get(t)},_viewLoaded:function(){var e=0,i=0;t.each(this.views.attributes,function(t){t.state.loaded&&i++,e++}),e==i&&this.render()}})}(this._,this.Backbone,this.jQuery),function(t,e,i){APP.Template=e.Model.extend({initialize:function(e,i){t.bindAll(this,"fetch","parse"),i||(i={}),t.isEmpty(e)||(this.set("default",this.compile(e)),this.trigger("loaded")),i.url&&(this.url=i.url,this.fetch())},compile:function(e){return t.template(e)},fetch:function(){i.get(this.url,this.parse)},parse:function(t){var e,n=this;try{e=i(t).filter("script")}catch(o){e=[]}e.length?e.each(function(){var t=i(this);t.attr("type").indexOf("template")>=0&&n.set(t.attr("id"),n.compile(t.html()))}):this.set("default",n.compile(t)),this.trigger("loaded")}}),APP.Templates.Markdown=APP.Template.extend({initialize:function(t,e){var i=new Showdown.converter;return this.compile=i.makeHtml,APP.Template.prototype.initialize.call(this,t,e)}})}(this._,this.Backbone,this.jQuery),function(t,e){APP.Router=e.Router.extend({options:{location:!1,api:!1},routes:{"_=_":"_fixFB","access_token=:token":"access_token"},initialize:function(e){e=e||{},t.bindAll(this,"access_token","preRoute","_layoutUpdate","_bindRoutes","_callRoute","_setup","_ajaxPrefilter","_fixFB"),t.extend(this.options,e),this._setup()},state:{fullscreen:!1,online:navigator.onLine,browser:function(){return $.browser.safari&&/chrome/.test(navigator.userAgent.toLowerCase())?"chrome":/(iPhone|iPod).*OS 5.*AppleWebKit.*Mobile.*Safari/.test(navigator.userAgent)?"ios":"other"},mobile:navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i),ipad:navigator.userAgent.match(/iPad/i)!==null,touch:"ontouchstart"in document.documentElement,pushstate:function(){try{return window.history.pushState({pageTitle:document.title},document.title,window.location),!0}catch(t){return!1}},scroll:!0,ram:function(){return console.memory?Math.round(100*(console.memory.usedJSHeapSize/console.memory.totalJSHeapSize)):0}},update:function(){var t=this.state instanceof e.Model?this.state.get("scroll"):this.state.scroll;t?$("body").removeClass("no-scroll"):$("body").addClass("no-scroll")},preRoute:function(e,i){var n=this;return this.session&&this.session.state!==void 0?this.session.state?i.apply(n,e):this.session.bind("loaded",t.once(function(){i.apply(n,e)})):i.apply(n,e)},access_token:function(t){this.session?this.session.set({token:t}):window.access_token=t,this.navigate("/",!0)},_setup:function(){this.options.api&&this._ajaxPrefilter(this.options.api),this.bind("all",this._trackPageview),this.bind("all",this._layoutUpdate),this.options.location&&this._geoLocation(),APP.Session&&(this.session=new APP.Session({},this.options.session||{}))},_ajaxPrefilter:function(t){var e=this.session||!1;$.ajaxPrefilter(function(i,n,o){if(n.dataType=="json"){var s=i.url.search(/^http/)===0;s||(i.url=t+i.url),i.xhrFields={withCredentials:!0};var a=e?e._csrf||e.get("_csrf")||!1:!1;a&&o.setRequestHeader("X-CSRF-Token",a)}})},_fixFB:function(){this.navigate("/",!0)},_trackPageview:function(){var t=e.history.getFragment();typeof _gaq!="undefined"&&_gaq.push(["_trackPageview","/#"+t])},_layoutUpdate:function(t){this.layout&&this.layout.trigger("update",{navigate:!0,path:t})},_bindRoutes:function(){if(this.routes){var e,i=t.keys(this.routes);while((e=i.pop())!==void 0){var n=this.routes[e];this.route(e,n,this._callRoute(this[n]))}}},_callRoute:function(t){return function(){this.preRoute.call(this,arguments,t)}},_geoLocation:function(){var t=this;navigator.geolocation.getCurrentPosition(function(e){t.state.location=e},function(){console.log("error",arguments)}),setTimeout(function(){t._geoLocation()},3e4)}})}(this._,this.Backbone)