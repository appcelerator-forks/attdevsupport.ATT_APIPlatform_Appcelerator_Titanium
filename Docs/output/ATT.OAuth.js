Ext.data.JsonP.ATT_OAuth({"tagname":"class","name":"ATT.OAuth","autodetected":{},"files":[{"filename":"attTitaniumAPI.js","href":"attTitaniumAPI.html#ATT-OAuth"}],"members":[{"name":"authorize","tagname":"method","owner":"ATT.OAuth","id":"method-authorize","meta":{}},{"name":"obtainEndUserAuthorization","tagname":"method","owner":"ATT.OAuth","id":"method-obtainEndUserAuthorization","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-ATT.OAuth","short_doc":"Introduction:\n\nThe AT&amp;T OAuth 2.0 Authentication Management service provides a safe and secure way for AT&amp;T s...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/attTitaniumAPI.html#ATT-OAuth' target='_blank'>attTitaniumAPI.js</a></div></pre><div class='doc-contents'><p><b>Introduction:</b></p>\n\n<p>The AT&amp;T OAuth 2.0 Authentication Management service provides a safe and secure way for AT&amp;T subscribers to access AT&amp;T network resources through a third-party application without the risk of compromising security. The OAuth service ensures that secure, sensitive, and private AT&amp;T subscription related details are not exposed to the third-party application.</p>\n\n<p>OAuth authorization management is an open standard recognized as providing a strong protection to clients and applications. The OAuth service provides developers with a security model that allows them to obtain an authorization code and an access token. By acquiring an authorization code, a resource owner has authorized an application to access a protected resource on their behalf. The receipt of an access token enables an application to access a protected resource on behalf of a resource owner via the AT&amp;T network.</p>\n\n<p>The AT&amp;T OAuth 2.0 Authentication Management service allows third party applications access to the private resources of subscribers without requiring the end-user to provide credentials (such as username and password) to the third party application. An application that is implemented with Oauth provides a closer and more secure integration with the AT&amp;T API Platform.</p>\n\n<p><b>Methods:</b></p>\n\n<p>1) authorize</p>\n\n<p>2) obtainEndUserAuthorization</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-authorize' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.OAuth'>ATT.OAuth</span><br/><a href='source/attTitaniumAPI.html#ATT-OAuth-method-authorize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.OAuth-method-authorize' class='name expandable'>authorize</a>( <span class='pre'>accessKey, secretKey, scope, grantType, oAuthCode</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Authorizes an application so that it can use specific AT&amp;T APIs. ...</div><div class='long'><p>Authorizes an application so that it can use specific AT&amp;T APIs.</p>\n\n<p>This method must be directly called using the ATT namespace as in the following example: <b>ATT.authorize('apiKey','secretKey','scope','grantType','oAuthCode')</b></p>\n\n<p>When authorizing an application for use with the Location and In App Messaging APIs, the user must send their access key, secret key, scope, grantType, and OAuthCode.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>accessKey</span> : String<div class='sub-desc'><p>The API Key that is assigned to the application when the developer creates an application account at https://devconnect-api.att.com.</p>\n</div></li><li><span class='pre'>secretKey</span> : String<div class='sub-desc'><p>The Secret Key that is assigned to the application when the developer creates an application account at https://devconnect-api.att.com.</p>\n</div></li><li><span class='pre'>scope</span> : String<div class='sub-desc'><p>A comma separated list of authScopes, that specify which APIs the app requires access to.</p>\n</div></li><li><span class='pre'>grantType</span> : String<div class='sub-desc'><p>Specifies the mechanism used to obtain the access token. The following grantType values must be used for the following cases: Web-server client applications using the authorization code to obtain the access token must set this parameter value to authorization_code. Autonomous client applications that use just the API key and its secret to obtain the access token must set this parameter valueto client_credentials. When client applications of both types mentioned above) use the refresh_token to obtain a new access_token after the expiry of the initial access_token, this parameter value must be set to refresh_token.</p>\n</div></li><li><span class='pre'>oAuthCode</span> : String<div class='sub-desc'><p>The authorization code. The oAuthCode is returned in the response value of the obtainEndUserAuthorization method. Currently, this parameter is only required when using the Location and IMMN APIs.\n   <b>Example:</b></p>\n\n<p>The following is an example of the authorize method.</p>\n\n<pre><code>         ATT.authorize('apiKey','secretKey','scope','grantType','oAuthCode');\n</code></pre>\n</div></li></ul></div></div></div><div id='method-obtainEndUserAuthorization' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.OAuth'>ATT.OAuth</span><br/><a href='source/attTitaniumAPI.html#ATT-OAuth-method-obtainEndUserAuthorization' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.OAuth-method-obtainEndUserAuthorization' class='name expandable'>obtainEndUserAuthorization</a>( <span class='pre'>options, success, error</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>The Obtain End-User Authorization operation is the initial operation in the OAuth call flow. ...</div><div class='long'><p>The Obtain End-User Authorization operation is the initial operation in the OAuth call flow. It is invoked by an application that requires subscriber authorization in order to obtain an OAuth access token. The application request for an OAuth access token is forwarded by redirecting the subscriber’s browser to the API Gateway.</p>\n\n<p><b>Important Note:</b> Currently, this method call is only necessary and supported for applications attempting to consume the following APIs:</p>\n\n<p>1) Location API</p>\n\n<p>2) In App Messaging from Mobile Number API</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties :</p>\n<ul><li><span class='pre'>clientId</span> : String<div class='sub-desc'><p>The API Key that is assigned to the application when the developer creates an application account at https://devconnect-api.att.com.</p>\n</div></li><li><span class='pre'>scope</span> : String<div class='sub-desc'><p>Specifies the services for which the application is requesting the end-user to provide consent. The value of the scope parameter is a comma delimited list containing one or more of the following values that represent the services that are in scope.</p>\n\n<p>• Terminal Location – TL.</p>\n\n<p>• In App Messaging from Mobile Number – IMMN</p>\n</div></li><li><span class='pre'>redirectUrl</span> : String (optional)<div class='sub-desc'><p>The URL where the subscriber’s browser will be redirected following completion of the authorization process. If this parameter is not present in the request, the AT&amp;T Gateway will use the value of provided OAuth Redirect URL that is provided by the developer in the AT&amp;T API Platform console when the application is registered.</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p><b>Specifies a query parameter that is included with the redirect_url parameter of the authorize method in the original OAuth request.</b></p>\n\n<p><strong>Example:</strong></p>\n\n<p>The following is an example of the obtainEndUserAuthorization method.</p>\n\n<pre><code> obtainEndUserAuthorization({\n      'clientId' : 'API Key',\n      'scope' : 'scope values',\n     'redirectUrl' : 'redirect url'\n },function(data) {\n\n    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});
