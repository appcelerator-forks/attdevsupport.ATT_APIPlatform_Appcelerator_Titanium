/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

var tiRequire=require;exports.ATT=function(){var e,t,n;(function(r){function d(e,t){return h.call(e,t)}function v(e,t){var n,r,i,s,o,u,a,f,c,h,p=t&&t.split("/"),d=l.map,v=d&&d["*"]||{};if(e&&e.charAt(0)===".")if(t){p=p.slice(0,p.length-1),e=p.concat(e.split("/"));for(f=0;f<e.length;f+=1){h=e[f];if(h===".")e.splice(f,1),f-=1;else if(h===".."){if(f===1&&(e[2]===".."||e[0]===".."))break;f>0&&(e.splice(f-1,2),f-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((p||v)&&d){n=e.split("/");for(f=n.length;f>0;f-=1){r=n.slice(0,f).join("/");if(p)for(c=p.length;c>0;c-=1){i=d[p.slice(0,c).join("/")];if(i){i=i[r];if(i){s=i,o=f;break}}}if(s)break;!u&&v&&v[r]&&(u=v[r],a=f)}!s&&u&&(s=u,o=a),s&&(n.splice(0,o,s),e=n.join("/"))}return e}function m(e,t){return function(){return s.apply(r,p.call(arguments,0).concat([e,t]))}}function g(e){return function(t){return v(t,e)}}function y(e){return function(t){a[e]=t}}function b(e){if(d(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!d(a,e)&&!d(c,e))throw new Error("No "+e);return a[e]}function w(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function E(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice;o=function(e,t){var n,r=w(e),i=r[0];return e=r[1],i&&(i=v(i,t),n=b(i)),i?n&&n.normalize?e=n.normalize(e,g(t)):e=v(e,t):(e=v(e,t),r=w(e),i=r[0],e=r[1],i&&(n=b(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return m(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:E(e)}}},i=function(e,t,n,i){var s,l,h,p,v,g=[],w;i=i||e;if(typeof n=="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(v=0;v<t.length;v+=1){p=o(t[v],i),l=p.f;if(l==="require")g[v]=u.require(e);else if(l==="exports")g[v]=u.exports(e),w=!0;else if(l==="module")s=g[v]=u.module(e);else if(d(a,l)||d(f,l)||d(c,l))g[v]=b(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,m(i,!0),y(l),{}),g[v]=a[l]}}h=n.apply(a[e],g);if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!w)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){return typeof e=="string"?u[e]?u[e](t):b(o(e,t).f):(e.splice||(l=e,t.splice?(e=t,t=n,n=null):e=r),t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s)},s.config=function(e){return l=e,l.deps&&s(l.deps,l.callback),s},n=function(e,t,n){t.splice||(n=t,t=[]),!d(a,e)&&!d(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}})(),n("../lib/almond",function(){}),n("att/util",["require","exports","module"],function(e,t,n){function o(e,t,n){if(typeof e=="object"&&e!==null){var r=n||e;if(e.forEach){if(e.every){var i;return e.every(function(){return i=t.apply(this,arguments),i!==undefined},r),i}e.forEach.call(e,t,n)}else for(var s in e)if(e.hasOwnProperty(s)){var i=t.call(r,e[s],s,e);if(i)return i}}}function u(e){var t=r.call(arguments,1).reverse();return t.forEach(function(t){o(t,function(t,n){e[n]=t})}),e}function a(e){return e===null||e===undefined||e===""}function f(e,t,n){var r={};return t||(t={}),o(e,function(e,i){if(e===undefined)return;var s=l(t[i],i,e,n);a(s)||(r[i]=s)}),r}function l(e,t,n,r){var i=typeof n;i==="string"||i==="function"?n={backup:n}:i==="boolean"&&(n={required:n});if(!e&&n.backup){var s=typeof n.backup;s==="function"?e=n.backup(r,n):s==="string"&&(e=n.backup)}n.postProcess&&(e=n.postProcess(e,r,n)),e=e||"",n.prefix&&(e=n.prefix+e),n.suffix&&(e+=n.suffix);if(!e&&n.required){var o=t?' "'+t+'"':"";throw new Error("Required parameter"+o+" is undefined")}return n.validate&&n.validate(e,r,n),e}function h(e,t,n,r){e.push(encodeURIComponent(t)+r+encodeURIComponent(n))}function p(e,t,n){if(typeof e!="object")return"";var r=[],i=typeof n=="string"?n:p.defaultAssignment;return o(e,function(e,n){if(a(e))return;Array.isArray(e)?r.push(p.stringifyArray(n,e,t,i)):h(r,n,e,i)}),r.length===0?"":r.join(typeof t=="string"?t:p.defaultDelimiter)}function d(e,t,n){var r={},i=typeof n=="string"?n:p.defaultAssignment,s=e.split(typeof t=="string"?t:p.defaultDelimiter);return s.forEach(function(e){var t=e.split(i);if(t.length!==2)return;var n=decodeURIComponent(t[0]),s=decodeURIComponent(t[1]),o=r[n];o?Array.isArray(o)?o.push(s):r[n]=[o,s]:r[n]=s}),r}function v(e,t,n){return c.stringify(f(e,t,n))}function m(e,t){if(e==null)return e;var n=t.match(/(.*?)\.(.*)/);if(!n)return e[t];var r=n[1],i=n[2];return m(e[r],i)}var r=Array.prototype.slice,i=Function.prototype.apply,s=Function.prototype.call;t.forEach=o,t.copyObjTo=u,t.buildParams=f;var c=t.queryString=t.qs={};p.stringifyArray=function(e,t,n,r){var i=[],s=typeof r=="string"?r:p.defaultAssignment;return t.forEach(function(t,n){h(i,e,t,s)}),i.join(typeof n=="string"?n:p.defaultDelimiter)},p.defaultDelimiter="&",p.defaultAssignment="=",c.stringify=p,d.defaultDelimiter="&",d.defaultAssignment="=",c.parse=d,c.buildFromConfig=v,t.getFromObject=function(e,t){return m(e,t+"")},t.arrayToHash=function(){return r.call(arguments).reduce(function(e,t){return t.reduce(function(e,t){return e[t]=!0,e},e)},{})},t.apply=function(e,t,n){var r=typeof t=="string"?e[t]:t;return i.call(r,e,n)};var g=t.camelCase=function(e){return typeof e!="string"&&(e+=""),e[0].toLowerCase()+e.slice(1)},y=t.keysToCamelCase=function(e){if(Array.isArray(e))return e.map(y);if(typeof e!="object"||e.toString()!=="[object Object]")return e;var t={};return o(e,function(e,n){return t[g(n)]=y(e),!1}),t},b=t.capitalize=function(e){return e[0].toUpperCase()+e.slice(1)},w=t.log=function(){console.log.apply(console,arguments)},E=t.inherits=function(e,t,n){e.prototype=new t,e.prototype.constructor=e,t.prototype.super_=t,u(e.prototype,n)}}),n("att/constants",["require","exports","module","att/util"],function(e,t,n){var r=e("att/util").copyObjTo;t.header={accept:{JSON:"application/json",XML:"application/xml",URL_ENCODED:"application/x-www-form-urlencoded"}},t.paramKey={HEADERS:"headers",QUERY:"query",URL_PARAMS:"urlParams",FILE_PATH:"filePath",BODY:"body",ATTACHMENTS:"attachments",OPTIONS:"options"},t.attachmentKeys={BODY:"body",FILE_PATH:"filePath",MIME_TYPE:"mimeType",NAME:"name",ENCODING:"fileEncoding"},t.header.contentType=r({},t.header.accept)}),n("att/ajax",["require","exports","module","att/util","att/constants"],function(e,t,n){function l(e,t,n){var i={error:{type:e,message:t}};return r.copyObjTo(i.error,n),i}function c(e){return l(e.constructor.name,e.message,{source:e})}function h(e,t,n){function p(e){var t=h[e];typeof t!==undefined&&(o[e]=t)}function y(e,t){m||(d(),g&&clearTimeout(g),m=!0,e.call(o,t,o))}function b(){var e=o.getResponseHeader("Content-Type");return e&&e.indexOf(s.header.contentType.JSON)>=0?JSON.parse(h.responseText):h.responseText}function S(){g&&y(n,l("AttXHRAbortError","Request aborted"))}if(e.isBridgeFunction||f.settings.isBridgeFunction(e)){f.settings.bridgeFunction.call(this,e,t,n);return}var o=this,h=f.settings.getXHR(e);if(!h)return;this.xhr=h;var d=function(){u.forEach(p),h.readyState>=h.HEADERS_RECEIVED&&a.forEach(p)};d();var v=r.copyObjTo({},e.headers),m=!1,g,w=function(e){if(h.status>=400){h.status==401&&f.settings.clearCache(),E.call(this,e);return}var i;try{i=b()}catch(s){var o=c(s);o.error.type="AttXHRParseError",y(n,o);return}y(t,{data:i})},E=function(e){var t;try{t=b()}catch(i){}t||(t=h.responseText);var s=e.error||h.statusText||"Connection Error",o=l("AttXHRRequestError",s,{status:h.status});t&&(o.data=t),y(n,o)};h.onload=w,h.onerror=E,h.onabort=S,h.readystatechange=d;var x=e.url;if(e.query){var T=e.query,N=typeof T;T=N==="object"?i.stringify(T):N==="string"?T:!1,T&&(x+="?"+T)}h.open(e.method,x,!0);var C=h.timeout=e.timeout!==undefined?e.timeout:f.settings.timeout,k=e.body;if(typeof k=="object")switch(v["Content-Type"]){case s.header.contentType.JSON:k=JSON.stringify(e.body);break;case s.header.contentType.URL_ENCODED:k=i.stringify(e.body);break;default:}r.forEach(v,function(e,t){e&&h.setRequestHeader(t,e)}),h.send(k)}var r=e("att/util"),i=r.qs,s=e("att/constants"),o=["abort","getResponseHeader","getAllResponseHeaders"],u=["readyState","responseText","responseData","responseType"],a=["status","statusText"],f;o.forEach(function(e){h.prototype[e]=function(){var t=this.xhr,n=t[e];return r.apply(t,n,arguments)}}),f=function(t,n,r){return new h(t,n,r)},f.settings={getXHR:function(){throw new Error("XMLHttpRequest is not defined. Override ajax.settings.getXHR to use the ajax function for this platform")},timeout:9e4,isBridgeFunction:function(e){return!1},bridgeFunction:function(){throw new Error("This method is not supported in this platform")}},n.exports=f}),n("att/RESTfulDefinition",["require","exports","module","att/util","att/constants"],function(e,t,n){function f(e){i(this,e)}var r=e("att/util"),i=r.copyObjTo,s=r.forEach,o=r.buildParams,u=r.qs,a=e("att/constants");i(f.prototype,{addDefinition:function(e,t){if(!(t instanceof f||typeof t=="function"))throw new Error("Only RESTfulDefinition or ATTMethod can be added with this method");var n=e.split("."),r=n.pop(),i=this;n.forEach(function(e){i[e]||(i[e]=new f),i=i[e]}),s(t.methods,function(e,n){t.addMethod(n,e.executor,e)}),delete t.methods,i[r]=t,t.parent=this},addMethod:function(e,t,n){function s(e,t,n){return arguments.length<3&&(n=t,t=e,e={}),s.parent.executor(s,e,t,n)}if(arguments.length<3&&typeof t=="object"){var r=n;n=t,t=r}i(s,n,f.prototype,f.defaultMethodParams),s.executor=t,s.methodName=e&&e.match(/\.?([^.]*)$/)[1],this.addDefinition(e,s)},forEachToRoot:function(e,t){var n=this,r=0,i=t||this;do e.call(i,n,r++),n=n.parent;while(n)},getUrl:function(e){var t=(this.parent?this.parent.getUrl():"")+(this.appendUrl||"");if(e){var n=this.getUrl.paramsRegex,r=o(this.inferUrlParamsConfig(),e[a.paramKey.URL_PARAMS],e);t=t.replace(n,function(e,t,n,i,s,o){var u=r[n];return i&&!u?"":t+u})}return t},getHeaders:function(e){return o(this.getHeaderConfig(),e[a.paramKey.HEADERS],e)},getQueryString:function(e){return u.buildFromConfig(this.getQueryStringConfig(),e[a.paramKey.QUERY],e)},getRoot:function(){var e;return this.forEachToRoot(function(t){e=t}),e},executor:function(){if(this.parent)return this.parent.executor.apply(this.parent,arguments)},inferUrlParamsConfig:function(){var e=this.getUrl.paramsRegex,t={};return this.getUrl().replace(e,function(e,n,r,i,s,o){return t[r]=!i,""}),i(t,this.getUrlParamsConfig())}}),["headerConfig","queryStringConfig","urlParamsConfig"].forEach(function(e){var t="get"+e[0].toUpperCase()+e.substr(1);f.prototype[t]=function(){return this.parent?i({},this.parent[t].apply(this.parent,arguments),this[e]):this[e]}}),f.prototype.getUrl.paramsRegex=/(\/):([^\/?]*)(\?$)?/g,f.defaultMethodParams={},n.exports=f}),n("att/main",["require","exports","module","att/ajax","att/util","att/constants","att/RESTfulDefinition"],function(e,t,n){function l(e){return{type:e.constructor.name,message:e.message,source:e}}function c(e,t){var n={error:l(e)};return t(n),n}function h(e,t){var n=e[a.attachmentKeys.BODY],r=e[a.attachmentKeys.FILE_PATH];if(n&&r){var i='Both "'+a.attachmentKeys.BODY+'" and "'+a.attachmentKeys.FILE_PATH+'" cannot both be defined '+t?"in an attachment":"in the parameters";throw new Error(i)}if(t&&!n&&!r)throw new Error('Either "'+a.attachmentKeys.BODY+'" or "'+a.attachmentKeys.FILE_PATH+'" must be defined in all attachments')}function p(e,t,n,i){function f(e){return function(){e&&e.apply(this,arguments),delete o.active}}function c(e){o.error=l(e),i(o.error)}var o={},u=this.getRoot(),p=function(u){var l,p,v;try{var m=t[a.paramKey.QUERY];l=e.getHeaders(t),p=typeof m=="string"?m:e.getQueryString(t),v=e.getUrl(t);var g=t[a.paramKey.ATTACHMENTS];g&&g.forEach(function(e){h(e,!0)}),h(t)}catch(y){y.message+=". Check inputted "+(l===undefined)?"header ":p===undefined?"query string ":v===undefined?"url parameters ":'values for method "'+e.methodName+'"',c(y);return}if(u)l.Authorization="Bearer "+u.data.token;else if(!e.tokenType===d.TokenType.NONE){c(new Error("Missing access token for this request, fetch a new one"));return}var b=s({method:e.method,url:v},t);p&&(b.query=p),b.headers=l;var w=e.executor?e.executor(b,t,n,i):b;if(w===b)b.methodName=e.methodName,b.useBridge=e.useBridge,o.active=r(b,f(b.success||n),f(b.fail||i));else{if(w instanceof Error){c(w);return}w&&w.constructor.toString()==="[object Object]"?s(o,w):o.data=w,n({data:w})}};switch(e.tokenType){case d.TokenType.NONE:p();break;case d.TokenType.USER:u.userAuthToken.fetch(f(p),f(i));break;case d.TokenType.ACCESS:default:u.accessToken.fetch(f(p),f(i))}return o}function E(e){s(this,e)}function S(e){s(this,e)}function x(e){s(this,e)}function T(e){var t={},n={};return e.split(",").forEach(function(e){w[e]?n[e]=!0:t[e]=!0}),{accessTokenScope:Object.keys(t).sort().join(","),userAuthTokenScope:Object.keys(n).sort().join(",")}}function N(e,t){return typeof e=="string"?e:u.stringify(e,",")}var r=e("att/ajax"),i=e("att/util"),s=i.copyObjTo,o=i.forEach,u=i.qs,a=e("att/constants"),f=e("att/RESTfulDefinition"),d=n.exports=new f({executor:p});(function(){function n(){return(e||"")+(t||"")}var e,t;d.setProtocol=function(t){e=t,d.appendUrl=n()},d.getProtocol=function(){return e},d.setDomain=function(e){t=e,d.appendUrl=n()},d.getDomain=function(){return t}})(),d.setProtocol("https://"),d.setDomain("api.att.com"),d.TokenType={NONE:"noToken",ACCESS:"accessToken",USER:"userAuthToken"},f.defaultMethodParams.tokenType=d.TokenType.ACCESS;var v,m,g,y,b,w={IMMN:!0,MIM:!0,TL:!0};return d.addDefinition("OAuth",new f({appendUrl:"/oauth",methods:{getAccessToken:{appendUrl:"/access_token",method:"POST",tokenType:d.TokenType.NONE,headerConfig:{"Content-Type":"application/x-www-form-urlencoded",Accept:"application/json"},executor:function(e,t,n,r){var i=e.body;typeof i=="string"&&(i=u.parse(i));if(!v&&!i.client_id||!m&&!i.client_secret){var s=new Error("App Key or Secret are undefined. Set the keys recieved from developer.att.com");return c(s,r)}return i.client_id=v,i.client_secret=m,e.body=u.stringify(i),e}},obtainEndUserAuthorization:{method:"GET",appendUrl:"/authorize",tokenType:d.TokenType.NONE,queryStringConfig:{client_id:{required:!0,backup:function(){return v}},scope:{required:!0,backup:function(){return y}},redirect_uri:!1},executor:function(e,t,n,r){return{uri:e.url+"?"+e.query}}}}})),tokenObjProto=E.prototype,s(tokenObjProto,{fetch:function(e,t,n){if(arguments.length===2){var r=n;n=t,t=e,e=r}var s={},o=this;if(this.isExpired())s.grant_type="refresh_token",s.refresh_token=this.refreshToken;else{if(this.token){var u={data:this.getCache()};return t.call(this,u),u}try{this.formatParameters(s,e)}catch(a){return c(a,n)}}var f={appKey:v,accessTokenScope:g,userAuthScope:y},l=function(e,n){delete o.fetching;if(e.data.error){failCB.call(this,{error:{type:"AuthorizationError",message:e.data.error}});return}var r=o.formatResponse(f,e.data);o.save(r),t&&t.call(o,{data:o.getCache()},n)},h=function(e,t){delete o.fetching,n&&n.apply(o,arguments)},p=d.OAuth.getAccessToken({body:s},l,h);return p.active&&(this.fetching=p.active),p},refresh:function(e,t){return this.refreshToken?(this.expiration=Date.now()-10,this.fetch(e,t)):c(new Error("Fetch a token before you can refresh it"),t)},formatResponse:function(e,t){var n=parseInt(t.expires_in);return{t:t.access_token,r:t.refresh_token,e:n&&Date.now()+1e3*n,k:e.appKey}},keys:["token","refreshToken","expiration","key","scope"],clearCache:function(){this.keys.forEach(function(e){delete this[e]},this)},getCache:function(){var e={};return this.keys.forEach(function(t){e[t]=this[t]},this),e},cache:function(e){if(!e.s||!e.k)return;this.token=e.t,this.refreshToken=e.r,this.expiration=e.e,this.key=e.k,this.scope=e.s},isExpired:function(){return this.refreshToken&&this.expiration!==0&&this.expiration<Date.now()},remove:function(){this.clearCache()},save:function(e){this.cache(e)},load:function(){}}),i.inherits(S,E,{formatParameters:function(e,t){if(!g)throw new Error("Missing scope");e.scope=g,e.grant_type="client_credentials"},formatResponse:function(e,t){var n=tokenObjProto.formatResponse.apply(this,arguments);return n.s=e.accessTokenScope,n},cache:function(e){(!g||e.s===g)&&tokenObjProto.cache.apply(this,arguments)}}),d.accessToken=new S,i.inherits(x,E,{formatParameters:function(e,t){e.code=typeof t=="string"&&t||b;if(!e.code){var n="oAuthCode is "+(b===null?"no longer valid":"undefined");throw new Error(n)}e.grant_type="authorization_code"},formatResponse:function(e,t){var n=tokenObjProto.formatResponse.apply(this,arguments);return n.s=e.userAuthScope,n},cache:function(e){(!y||e.s===y)&&tokenObjProto.cache.apply(this,arguments)}}),d.userAuthToken=new x,d.setKeys=function(e,t,n){var r=T(n),i=r.accessTokenScope&&d.accessToken.scope!==r.accessTokenScope,s=r.userAuthTokenScope&&d.userAuthToken.scope!==r.userAuthTokenScope;if(v===e&&m===t&&!i&&!s)return;(d.accessToken.key!==e||i)&&d.accessToken.clearCache(),(d.userAuthToken.key!==e||s)&&d.userAuthToken.clearCache(),v=e,m=t,i&&(g=r.accessTokenScope),s&&(y=r.userAuthTokenScope)},d.setOAuthCode=function(e){d.userAuthToken.clearCache(),b=e},d.addDefinition("SMS",new f({appendUrl:"/sms/v3/messaging",headerConfig:{Accept:!1},methods:{sendSMS:{appendUrl:"/outbox",method:"POST",headerConfig:{"Content-Type":!0}},getSMSDeliveryStatus:{appendUrl:"/outbox/:smsId",method:"GET"},getSMS:{appendUrl:"/inbox/:registrationId",method:"GET"}}})),d.addDefinition("MMS",new f({appendUrl:"/mms/v3/messaging/outbox",headerConfig:{Accept:!1},methods:{sendMMS:{method:"POST",headerConfig:{"Content-Type":!0},useBridge:!0},getMMSDeliveryStatus:{method:"GET",appendUrl:"/:mmsId"}}})),function(){function t(e,t,n,r){return e.url+"?"+e.query}var e={Signature:!0,SignedPaymentDetail:!0,clientid:{backup:function(){return v},required:!0}};d.addDefinition("Payment",new f({appendUrl:"/rest/3/Commerce/Payment",methods:{newSubscription:{appendUrl:"/Subscriptions",method:"GET",tokenType:d.TokenType.NONE,executor:t,queryStringConfig:e},getSubscriptionStatus:{appendUrl:"/Subscriptions/:idType/:id",method:"GET",headerConfig:{Accept:!1}},getSubscriptionDetails:{appendUrl:"/Subscriptions/:merchantSubscriptionId/Detail/:consumerId",method:"GET",headerConfig:{Accept:!1}},newTransaction:{appendUrl:"/Transactions",method:"GET",tokenType:d.TokenType.NONE,executor:t,queryStringConfig:e},getTransactionStatus:{method:"GET",headerConfig:{Accept:!1},appendUrl:"/Transactions/:idType/:id"},refundTransaction:{appendUrl:"/Transactions/:transactionId",method:"PUT",headerConfig:{"Content-Type":!0,Accept:!1},queryStringConfig:{Action:!0}},getNotification:{appendUrl:"/Notifications/:notificationId",method:"GET",headerConfig:{Accept:!1}},acknowledgeNotification:{appendUrl:"/Notifications/:notificationId",method:"PUT",headerConfig:{Accept:!1}}}}))}(),d.addDefinition("IMMN",new f({appendUrl:"/rest/1/MyMessages",headerConfig:{Accept:!1},methods:{sendMessage:{method:"POST",headerConfig:{"Content-Type":!0},tokenType:d.TokenType.USER,useBridge:!0},getMessageHeaders:{method:"GET",tokenType:d.TokenType.USER,queryStringConfig:{HeaderCount:!0,IndexCursor:!1}},getMessageContent:{method:"GET",tokenType:d.TokenType.USER,appendUrl:"/:messageId/:partNumber?"}}})),d.addDefinition("CMS",new f({appendUrl:"/rest/1/Sessions",headerConfig:{"Content-Type":!0,Accept:!1},methods:{createSession:{method:"POST"},sendSignal:{method:"POST",appendUrl:"/:cmsId/Signals"}}})),d.addDefinition("Ads",new f({appendUrl:"/rest/1/ads",methods:{getAds:{method:"GET",headerConfig:{Accept:!1,Udid:!0},queryStringConfig:{Category:!0,Gender:!1,ZipCode:!1,AreaCode:!1,City:!1,Country:!1,Longitude:!1,Latitude:!1,MaxHeight:!1,MaxWidth:!1,MinHeight:!1,MinWidth:!1,Type:!1,Timeout:!1,AgeGroup:!1,Over18:!1,KeyWords:!1,IsSizeRequired:!1,Premium:!1}}}})),d.addDefinition("Location",new f({appendUrl:"/2/devices/location",methods:{getDeviceLocation:{method:"GET",tokenType:d.TokenType.USER,headerConfig:{Accept:!1},queryStringConfig:{requestedAccuracy:!1,Tolerance:!1,acceptableAccuracy:!1}}}})),d.addDefinition("Speech",new f({appendUrl:"/speech/v3/"})),d.Speech.addMethod("speechToText",null,{appendUrl:"speechToText",method:"POST",headerConfig:{Accept:!1,"Content-Type":!0,"Transfer-Encoding":!1,"X-SpeechContext":!1,"X-SpeechSubContext":!1,"Content-Language":!1,"Content-Length":!1,"X-Arg":{postProcess:N}},useBridge:!0}),d.Speech.addMethod("textToSpeech",null,{appendUrl:"textToSpeech",method:"POST",headerConfig:{Accept:!1,"Content-Type":!0,"Content-Language":!1,"Content-Length":{backup:function(e){return e.body.length}},"X-Arg":{postProcess:N}},useBridge:!0}),d.Speech.addMethod("speechToTextCustom",null,{appendUrl:"speechToTextCustom",method:"POST",headerConfig:{Accept:!1,"Content-Type":"multipart/x-srgs-audio","Transfer-Encoding":!1,"X-SpeechContext":!1,"Content-Language":!1,"Content-Length":!1,"X-Arg":{postProcess:N}},useBridge:!0}),d.addDefinition("Notary",new f({appendUrl:"/Security/Notary/Rest/1/SignedPayload",methods:{signedPayload:{method:"POST",headerConfig:{Accept:!1,"Content-Type":!0,Client_id:!0,Client_secret:!0},executor:function(e,t){var n=d.accessToken.token;return n&&t.headers["Content-Type"]===a.header.contentType.JSON&&i.getFromObject(t,"body.MerchantPaymentRedirectUrl")&&(t.body.MerchantPaymentRedirectUrl+="?token="+n),e}}}})),d}),n("att/ajax.mime",["att/util"],function(e){function o(e,t,r){this.content=t,this.headers=n({},r),this.headers[i.CONTENT_DISPOSITION]||(this.headers[i.CONTENT_DISPOSITION]="form-data"),this.setName(e)}function u(e){this.boundary="attboundary"+Math.random().toString().slice(2),e=this.headers=n({},e),e[i.CONTENT_TYPE]||(e[i.CONTENT_TYPE]="multipart/form-data"),e[i.CONTENT_TYPE]+='; boundary="'+this.boundary+'"',this.parts=[]}var t=e.forEach,n=e.copyObjTo,r=e.capitalize,i={CONTENT_TYPE:"Content-Type",CONTENT_DISPOSITION:"Content-Disposition",CONTENT_ID:"Content-ID",CONTENT_TRANSFER_ENCODING:"Content-Transfer-Encoding"},s={setHeader:function(e,t){this.headers[e]=t},getHeaderString:function(){var e="";return t(this.headers,function(t,n){e+=n+": "+t+o.CRLF}),e+o.CRLF},getHeaderBuffer:function(){return Ti.createBuffer({value:this.getHeaderString()})},toString:function(){return this.getHeaderString()+this.getContentString()+o.CRLF},toBuffer:function(){var e=this.getHeaderBuffer();return e.append(this.getContentBuffer()),e}};return o.CRLF="\r\n",o.buildFromJSON=function(e){var t=e.fileName||e.filePath&&e.filePath.replace(/.*\/(.*)/,function(e,t){return t}),n=e.name||t,r;if(e.body)r=Ti.createBuffer({value:e.body});else if(e.filePath){var s=Titanium.Filesystem.getFile(e.filePath);r=Ti.Stream.readAll(Ti.Stream.createStream({source:s.read(),mode:Titanium.Stream.MODE_READ}))}var u={};u[i.CONTENT_TYPE]=e.mimeType,e.encoding&&(u[i.CONTENT_TRANSFER_ENCODING]=e.encoding);var a=new o(n,r,u);return a.fileName=t,t&&a.setFilename(t),a},n(o.prototype,{getContentString:function(){return this.content.toString()},getContentBuffer:function(){return this.content}},s),["name","filename"].forEach(function(e){var t=r(e),n=e+'="',s="REGEX_"+e.toUpperCase(),u=new RegExp(";\\s*"+n+'([^"]*)"');o[s]=u,o.prototype["set"+t]=function(e){var t=this.headers[i.CONTENT_DISPOSITION],r=o[s];t.match(r)?t=t.replace(r,function(t,r){return t.replace(n+r,n+e)}):t+="; "+n+e+'"',this.headers[i.CONTENT_DISPOSITION]=t},o.prototype["get"+t]=function(){var e=this.headers[i.CONTENT_DISPOSITION],t=e&&e.match(o[s]);return t&&t[1]}}),u.DASHES="--",u.CRLF=o.CRLF,u.buildFromJSON=function(e){var t=new u(e.headers);return e.attachments.forEach(function(e){t.addBodyPartFromJSON(e)}),t},n(u.prototype,{addBodyPart:function(e){this.parts?this.parts.push(e):this.parts=[e]},addBodyPartFromJSON:function(e){this.addBodyPart(o.buildFromJSON(e))},setMainPart:function(e){this.mainPart=e},getContentString:function(){function n(n){if(!n)return;e+=u.DASHES+t+u.CRLF,e+=n.toString()+u.CRLF}var e="",t=this.boundary;return n(this.mainPart),this.parts&&this.parts.forEach(n),e+=u.DASHES+t+u.DASHES+u.CRLF,e},getContentBuffer:function(){function n(n){if(!n)return;e.append(Ti.createBuffer({value:u.DASHES+t+u.CRLF})),e.append(n.toBuffer()),e.append(Ti.createBuffer({value:u.CRLF}))}var e=Ti.createBuffer(),t=this.boundary;return n(this.mainPart),this.parts&&this.parts.forEach(n),e.append(Ti.createBuffer({value:u.DASHES+t+u.DASHES+u.CRLF})),e}},s),{AttMimeBody:u,AttBodyPart:o}}),t(["att/main","att/util","att/ajax","att/constants","att/ajax.mime"],function(e,t,n,r,i){var s=Ti.Platform.osname==="android";t.log=function(){t.apply(Ti.API,"log",arguments)},n.settings.getXHR=function(){var e={};try{return Ti.Network.createHTTPClient(e)}catch(t){}};var o=function(e){return!e||!e.length?[{}]:e.map(function(e){return{fileObject:e.body||undefined,filePath:e.filePath||undefined,fileType:e.mimeType||undefined,fileName:e.name||undefined}})},u=function(e){return{body:e.body||"",contentType:e.headers["Content-Type"],accept:e.headers.Accept||"",accessToken:e.headers.Authorization,url:e.url,attachments:o(e.attachments)}},a={sendMMS:u,sendMessage:u};n.settings.clearCache=function(){Titanium.App.Properties.removeProperty("att.token.accessToken")};var f=tiRequire("ti.api.att");n.settings.bridgeFunction=function(t,r,o){var u=t.methodName;if(!s&&u==="speechToTextCustom"){var l=i.AttMimeBody.buildFromJSON(t);return t.body=l.getContentBuffer().toBlob(),t.headers=l.headers,delete t.useBridge,n(t,r,o)}var c=function(e){var t=e.success||e;try{t=JSON.parse(t)}catch(n){}r.call(this,{data:t})};s||(t=a[u](t)),f[u](t,c,o)},n.settings.isBridgeFunction=function(e){return e.useBridge},["accessToken","userAuthToken"].forEach(function(t){var n=e[t],r="att.token."+t,i=n.constructor.prototype,s=n.remove,o=n.save;i.remove=function(){s.apply(this,arguments),Titanium.App.Properties.removeProperty(r)},i.save=function(e){Titanium.App.Properties.setObject(r,e),o.apply(this,arguments)},i.load=function(){var e=Titanium.App.Properties.getObject(r);if(!e)return;this.cache(e)},n.load()}),e.Ads.getAds.headerConfig["User-Agent"]=!0;if(Ti.Platform.osname!=="android"){var l=e.Speech.speechToText;l.useBridge=!1,l.executor=function(e,t,n,r){try{var i=Ti.Filesystem.getFile(t.filePath);e.body=i.read()}catch(s){return s}return e},l.headerConfig["Content-Length"]={backup:function(e){try{var t=Ti.Filesystem.getFile(e.filePath);return t.length}catch(n){}}}}var c={"audio/x-wav":"wav","audio/amr":"amr","audio/amr-wb":"awb"},h=c["audio/amr-wb"];function p(e,t,n){var r=e.getResponseHeader("Content-Type"),i=c[r],s="."+(i||h);i&&t.indexOf(s)!==t.length-s.length&&(t+=s);var o=Ti.Filesystem.getFile(t);o.write(e.responseData),n({file:o,data:e.responseData,filePath:t,contentType:r,xhr:e})}var d=e.Speech.textToSpeech;return d.executor=function(e,t,n,r){return e.success=function(){var e=Array.prototype.slice.call(arguments,0),r=this;p(r,t.responseFilePath,function(t){e[0]={data:t},n&&n.apply(r,e)})},e},d.useBridge=!1,e}),n("extensions/titanium",function(){}),n("wrappers/wrapper-1.0",["att/main","att/constants","att/util"],function(e,t,n){function i(e,t){var n={};return e?(t&&(n["Content-Type"]=e.contentType),n.Accept=e.accept,n):n}function s(e){var t=e.fileName||undefined;return!t&&e.filePath&&(t=e.filePath.match(/.*\/(.*)/)[1]),{body:e.fileObject||undefined,filePath:e.filePath||undefined,fileName:t,mimeType:e.fileType||undefined,name:t,encoding:e.fileObject?"base64":undefined}}function o(e){if(!e)return;return e.map(s)}function h(e){return function(t){arguments[0]=JSON.stringify(t),e.apply(this,arguments)}}function d(e,t){return function(n,r,i){var s=function(e){e&&(arguments[0]=e.data),p(t[1])?r.apply(this,arguments):h(r).apply(this,arguments)},o=h(i);e(n,s,o)}}var r={};r.authorize=function(t,n,r,i,s){e.setKeys(t,n,r),s&&e.setOAuthCode(s)},r.setAccessToken=function(t,n,r){e.accessToken.token=t,e.accessToken.refresh=n,e.accessToken.expiration=r},r.getCachedAccessToken=function(){return e.accessToken.token},r.getCachedUserAuthToken=function(){return e.userAuthToken.token},r.SMS={sendSMS:function(t,n,r){e.SMS.sendSMS({headers:i(t,!0),body:t.contentType.toLowerCase()==="application/json"&&typeof t.body=="object"?JSON.stringify({outboundSMSRequest:t.body}):t.body},n,r)},getSMSDeliveryStatus:function(t,n,r){e.SMS.getSMSDeliveryStatus({headers:i(t),urlParams:{smsId:t.smsId}},n,r)},getSMS:function(t,n,r){e.SMS.getSMS({headers:i(t),urlParams:{registrationId:t.registrationId}},n,r)}},r.MMS={sendMMS:function(n,r,s){var u=n.contentType===t.header.contentType.JSON?'{"outboundMessageRequest":'+(typeof n.body=="object"?JSON.stringify(n.body):n.body)+"}":n.body;e.MMS.sendMMS({headers:i(n,!0),body:u,attachments:o(n.attachments)},r,s)},getMMSDeliveryStatus:function(t,n,r){e.MMS.getMMSDeliveryStatus({headers:i(t),urlParams:{mmsId:t.id}},n,r)}},function(){function s(t){return function(n,r,s){e.Payment[t]({headers:i(n),urlParams:{notificationId:n.notificationId}},r,s)}}var t={Signature:"signature",SignedPaymentDetail:"signedDocument",clientid:"clientId"};r.Payment={newSubscription:function(r,i,s){var o={};n.forEach(t,function(e,t){o[t]=r[e]}),e.Payment.newSubscription({query:o},i,s)},getSubscriptionStatus:function(t,n,r){var s;t.subscriptionId?s={idType:"SubscriptionId",id:t.subscriptionId}:t.merchantTransactionId?s={idType:"MerchantTransactionId",id:t.merchantTransactionId}:t.subscriptionAuthCode&&(s={idType:"SubscriptionAuthCode",id:t.subscriptionAuthCode}),e.Payment.getSubscriptionStatus({headers:i(t),urlParams:s},n,r)},getSubscriptionDetails:function(t,n,r){e.Payment.getSubscriptionDetails({headers:i(t),urlParams:{merchantSubscriptionId:t.merchantSubscriptionId,consumerId:t.consumerId}},n,r)},newTransaction:function(r,i,s){var o={};n.forEach(t,function(e,t){o[t]=r[e]}),e.Payment.newTransaction({query:o},i,s)},getTransactionStatus:function(t,n,r){var s;t.transactionId?s={idType:"TransactionId",id:t.transactionID}:t.merchantTransactionId?s={idType:"MerchantTransactionId",id:t.merchantTransactionId}:t.transactionAuthCode&&(s={idType:"TransactionAuthCode",id:t.transactionAuthCode}),e.Payment.getTransactionStatus({headers:i(t),urlParams:s},n,r)},refundTransaction:function(t,n,r){e.Payment.refundTransaction({headers:i(t,!0),query:{Action:t.action},urlParams:{transactionId:t.transactionId},body:t.body},n,r)},getNotification:s("getNotification"),acknowledgeNotification:s("acknowledgeNotification")}}(),r.IMMN={sendMessage:function(t,n,r){e.IMMN.sendMessage({headers:i(t,!0),body:t.body,attachment:o(t.attachments)},n,r)},getMessageHeaders:function(t,n,r){e.IMMN.getMessageHeaders({headers:i(t),query:{HeaderCount:t.headerCount,IndexCursor:t.indexCursor}},n,r)},getMessageContent:function(t,n,r){e.IMMN.getMessageContent({headers:i(t),urlParams:{messageId:t.messageId,partNumber:t.partNumber}},n,r)}},r.CMS={createSession:function(t,n,r){e.CMS.createSession({headers:i(t,!0),body:t.body},n,r)},sendSignal:function(t,n,r){e.CMS.sendSignal({headers:i(t,!0),urlParams:{cmsId:t.cmsId},body:t.body},n,r)}},r.Ads={getAds:function(t,n,r){var s=i(t);s.Udid=t.udid,s["User-Agent"]=t.userAgent,e.Ads.getAds({headers:s,query:t.body},n,r)}},r.OAuth={obtainEndUserAuthorization:function(t,n,r){e.OAuth.obtainEndUserAuthorization({headers:i(t),query:{client_id:t.clientId,scope:t.scope,redirect_uri:t.redirectUrl}},n,r)}},r.Location={getDeviceLocation:function(t,n,r){e.Location.getDeviceLocation({headers:i(t),query:{requestedAccuracy:t.requestedAccuracy,Tolerance:t.tolerance,acceptableAccuracy:t.acceptableAccuracy}},n,r)}},r.Speech={speechToText:function(t,n,r){e.Speech.speechToText({headers:{Accept:t.accept,"Content-Type":t.contentType,"Transfer-Encoding":t.transferEncoding,"X-SpeechContext":t.xSpeechContext,"X-SpeechSubContext":t.xSpeechSubContext,"Content-Language":t.contentLanguage,"Content-Length":t.contentLength,"X-Arg":t.xArg||t.xarg},filePath:t.filePath},n,r)}};var u=r.Speech;r.Speech=u||{},r.Speech.textToSpeech=function(t,n,r){e.Speech.textToSpeech({headers:{Accept:t.accept,"Content-Type":t.contentType,"Content-Language":t.contentLanguage,"Content-Length":t.contentLength,"X-Arg":t.xArg},responseFilePath:t.filePath,body:t.body},n,r)};var a={wav:"audio/wav",amr:"audio/amr",awr:"audio/amr-wb"};r.Speech=r.Speech||{};var f=["dictionary","grammar","grammar-prefix","grammar-altgram"],l={};f.forEach(function(e){var t="x-"+e,n=e==="dictionary"?"pls":"srgs",r="application/"+n+"+xml";l[e]=function(e){if(!e)return;var i={name:t,mimeType:r};if(typeof e=="string"){var s=e.match(/.*\.(.*)/);!s||s[1]!==n?e={body:e}:e={filePath:e}}return e.body?(i.body=e.body,e.filePath&&(i.fileName=e.filePath.match(/(.*\/|^)(.*)/)[2]),e.encoding&&(i.encoding=e.encoding)):i.filePath=e.filePath,i}});var c=r.Speech.speechToTextCustom=function(t,n,r){var i=[],s=t.options||{},o=s.emma;f.forEach(function(e){var n=e.replace(/-[a-z]/,function(e){return e[1].toUpperCase()}),r=l[e](t[n]);r&&i.push(r)});if(!t.audioFile)throw new Error('missing required parameter "audioFile"');i.push(c.handleAudioFile(t.audioFile));var u=n&&function(e,t){var r=e.data;n.call(this,r,t)};e.Speech.speechToTextCustom({headers:{Accept:o?"application/emma+xml":"application/json","X-SpeechContext":s.strict?"GrammarList":"GenericHints","Content-Language":t.language,"X-Arg":t.xArg},attachments:i},u,r)};c.handleAudioFile=function(e){var t,n,r;typeof e=="string"?t=e:(t=e.filePath,n=e.type,r=e.encoding);if(!n&&t){var i=t.match(/.*\.(.*)/),s=i&&i[1];n=a[s]}var o={mimeType:n,name:"x-voice",encoding:r};return e.body?(o.fileName=t&&t.match(/(.*\/|^)(.*)/)[2],o.body):o.filePath=t,o},r.Notary={signedPayload:function(t,n,r){e.Notary.signedPayload({headers:{Accept:t.accept,"Content-Type":t.contentType,Client_id:t.clientId,Client_secret:t.clientSecret},body:t.data},n,r)}};var p=function(e){return["newTransaction","newSubscription"].indexOf(e)>=0||!1},v={speechToTextCustom:!0},m={accessToken:!0,userAuthToken:!0};return n.forEach(r,function(e,t){if(typeof e!="object"||m[t])return;n.forEach(e,function(n,r){if(typeof n!="function"||v[r])return;e[r]=d(n,[t,r])})}),r});var r=t;return r("extensions/titanium"),r("wrappers/wrapper-1.0")}();