Ext.data.JsonP.ATT_Payment({"tagname":"class","name":"ATT.Payment","autodetected":{},"files":[{"filename":"attTitaniumAPI.js","href":"attTitaniumAPI.html#ATT-Payment"}],"members":[{"name":"acknowledgeNotification","tagname":"method","owner":"ATT.Payment","id":"method-acknowledgeNotification","meta":{}},{"name":"getNotification","tagname":"method","owner":"ATT.Payment","id":"method-getNotification","meta":{}},{"name":"getSubscriptionDetails","tagname":"method","owner":"ATT.Payment","id":"method-getSubscriptionDetails","meta":{}},{"name":"getSubscriptionStatus","tagname":"method","owner":"ATT.Payment","id":"method-getSubscriptionStatus","meta":{}},{"name":"getTransactionStatus","tagname":"method","owner":"ATT.Payment","id":"method-getTransactionStatus","meta":{}},{"name":"newSubscription","tagname":"method","owner":"ATT.Payment","id":"method-newSubscription","meta":{}},{"name":"newTransaction","tagname":"method","owner":"ATT.Payment","id":"method-newTransaction","meta":{}},{"name":"refundTransaction","tagname":"method","owner":"ATT.Payment","id":"method-refundTransaction","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-ATT.Payment","short_doc":"Introduction:\n\nThe Payment API provides developers and merchants the ability to charge digital services directly to a...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/attTitaniumAPI.html#ATT-Payment' target='_blank'>attTitaniumAPI.js</a></div></pre><div class='doc-contents'><p><b>Introduction:</b></p>\n\n<p>The Payment API provides developers and merchants the ability to charge digital services directly to an AT&amp;T subscriber bill for payment.</p>\n\n<p><b>Description:</b></p>\n\n<p>Using the Payment API, a merchant can create new transactions and subscriptions, get the status of the transaction or subscription, and authorize refunds.</p>\n\n<p>The new transaction and new subscription process includes:</p>\n\n<p>• Authentication of the end-user as an AT&amp;T Subscriber.</p>\n\n<p>• Presentation of an Advice-of-Charge (AOC) page and the opportunity to cancel.</p>\n\n<p> If the Subscriber chooses to accept the Charge, a Thank You message is presented.</p>\n\n<p>The merchant also has the option of automatically receiving notifications of refunds and subscription changes triggered through other AT&amp;T systems. Applications in the initial Sandbox state have lower limits on the quantity of transactions. All Sandbox payment transactions are refunded weekly. Further, in the Sandbox environment, a developer may set certain attributes for the application that would not be available to the developer in the Production environment. Once an application has been promoted to the Production state, however, a more secure environment is maintained where most of the attributes are read-only and can only be changed by the AT&amp;T administrator. Organizations must have a Merchant Account set up for the Payment Service to work. If your organization does not have a Merchant Account please contact your Organizational Profile Administrator to arrange for one.</p>\n\n<p><b>Usage:</b></p>\n\n<p>Use the Notary Management API to sign the payment request.</p>\n\n<p>Redirect the user agent to the AT&amp;T server to obtain consent.</p>\n\n<p>Get the response, either an authorization code or an error, through the redirect back from the consent process.</p>\n\n<p>Use the getTransactionStatus or getSubscriptionStatus methods with the authorization code to get the transaction ID, which is needed for refunds.</p>\n\n<p><b>Methods:</b></p>\n\n<p>1) acknowledgeNotification</p>\n\n<p>2) getNotification</p>\n\n<p>3) getSubscriptionDetails</p>\n\n<p>4) getSubscriptionStatus</p>\n\n<p>5) getTransactionStatus</p>\n\n<p>6) newSubscription</p>\n\n<p>7) newTransaction</p>\n\n<p>8) refundTransaction</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-acknowledgeNotification' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.Payment'>ATT.Payment</span><br/><a href='source/attTitaniumAPI.html#ATT-Payment-method-acknowledgeNotification' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.Payment-method-acknowledgeNotification' class='name expandable'>acknowledgeNotification</a>( <span class='pre'>options, success, error</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Acknowledges the receipt of a notification and requests that further notifications be stopped for a particular Notifi...</div><div class='long'><p>Acknowledges the receipt of a notification and requests that further notifications be stopped for a particular NotificationID.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>notificationId</span> : String<div class='sub-desc'><p>The ID of the notification to be retrieved.</p>\n</div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the body of the response. Valid values are:</p>\n\n<p>• application/json</p>\n\n<p>• application/xml</p>\n\n<p>The default value is: application/json</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.</p>\n\n<p> <b>Example:</b></p>\n\n<p>The following is an example of the acknowleadgeNotification method.</p>\n\n<pre><code>  acknowleadgeNotification({\n      'notificationId' : 'ID of the notification that to be retrieved.'\n },function(data) {\n\n    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n</div></li></ul></div></div></div><div id='method-getNotification' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.Payment'>ATT.Payment</span><br/><a href='source/attTitaniumAPI.html#ATT-Payment-method-getNotification' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.Payment-method-getNotification' class='name expandable'>getNotification</a>( <span class='pre'>options, success, error</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves a notification object that has been received in a prior notification message as a result of having the serv...</div><div class='long'><p>Retrieves a notification object that has been received in a prior notification message as a result of having the server listening for notification messages.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>notificationId</span> : String<div class='sub-desc'><p>The ID of the notification to be retrieved.</p>\n</div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the body of the response. Valid values are:</p>\n\n<p>• application/json</p>\n\n<p>• application/xml</p>\n\n<p>The default value is: application/json</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.</p>\n\n<p> <b>Example:</b></p>\n\n<p>The following is an example of the getNotification method.</p>\n\n<pre><code>  getNotification({\n      'notificationId' : 'ID of the notification that to be retrieved.'\n },function(data) {\n\n    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n</div></li></ul></div></div></div><div id='method-getSubscriptionDetails' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.Payment'>ATT.Payment</span><br/><a href='source/attTitaniumAPI.html#ATT-Payment-method-getSubscriptionDetails' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.Payment-method-getSubscriptionDetails' class='name expandable'>getSubscriptionDetails</a>( <span class='pre'>options, success, error</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves the details for a merchant subscription to which a consumer has subscribed. ...</div><div class='long'><p>Retrieves the details for a merchant subscription to which a consumer has subscribed. Merchants who manage consumers can use this method to determine the details of a subscription for a particular consumer.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>consumerId</span> : String<div class='sub-desc'><p>Identifies the consumer that is to use the subscription. The ConsumerId is a unique user id generated in the payment system representing a unique subscriber.</p>\n</div></li><li><span class='pre'>merchantSubscriptionId</span> : String<div class='sub-desc'><p>Identifies the merchant’s subscription. This must be a unique value for each merchant subscription.</p>\n</div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the body of the response. Valid values are:</p>\n\n<p>• application/json</p>\n\n<p>• application/xml</p>\n\n<p>The default value is: application/json</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.</p>\n\n<p> <b>Example:</b></p>\n\n<p>The following is an example of the getSubscriptionDetails method.\n      getSubscriptionDetails({\n          'consumerId' : returns in response of Payment.getSubscriptionStatus,\n          'merchantSubscriptionId' : returns in response of Payment.getSubscriptionStatus,\n     },function(data) {</p>\n\n<pre><code>    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n</div></li></ul></div></div></div><div id='method-getSubscriptionStatus' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.Payment'>ATT.Payment</span><br/><a href='source/attTitaniumAPI.html#ATT-Payment-method-getSubscriptionStatus' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.Payment-method-getSubscriptionStatus' class='name expandable'>getSubscriptionStatus</a>( <span class='pre'>options, success, error</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves the status of a previously executed call to the newSubscription method. ...</div><div class='long'><p>Retrieves the status of a previously executed call to the newSubscription method. The TransactionId from the previously executed newSubscription method call is used to retrieve the status of the subscription. This means that the TransactionIds from any new subscriptions must be stored in order to retrieve the status of those subscriptions. This method returns the status as well as several other fields related to the purchase.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>subscriptionId</span> : String<div class='sub-desc'><p>(Conditional Parameter) The value of this parameter is the subscription ID generated by AT&amp;T Payment processing system for a purchase. This value is used for future transaction requests.</p>\n</div></li><li><span class='pre'>merchantTransactionId</span> : String<div class='sub-desc'><p>(Conditional Parameter) The value of this parameter is the transaction ID in the merchant’s system identifying the transaction. This ID must be unique on every purchase request.</p>\n</div></li><li><span class='pre'>subscriptionAuthCode</span> : String<div class='sub-desc'><p>(Conditional Parameter) The value of this parameter is returned by AT&amp;T to the Developer’s Application Service upon successful conclusion of the Payment.newSubscription request.</p>\n</div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the body of the response. Valid values are:</p>\n\n<p>• application/json</p>\n\n<p>• application/xml</p>\n\n<p>The default value is: application/json\n*</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.</p>\n\n<p> <b>Example:</b></p>\n\n<p>The following is an example of the getSubscriptionStatus method.</p>\n\n<pre><code>  getSubscriptionStatus({\n       \"subscriptionAuthCode\" : &lt;The value returned by AT&amp;T to the Developer’s Application Service at upon successful conclusion of the Payment.newSubscription request.&gt;\n },function(data) {\n\n    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n\n<p>Note : To get the SubscriptionStatus,User can  pass any of the below mentioned ID :</p>\n\n<p>1)           \"subscriptionAuthCode\" : \"The value returned by AT&amp;T to the Developer’s Application Service at upon successful conclusion of the Payment.newSubscription request\"</p>\n\n<p>2)           \"merchantTransactionId\" : \"The MerchantTransactionId specified in the initial call to the Notary.signedPayload\"</p>\n\n<p>3)          \"subscriptionId\" : \"The subscriptionId returned by a previous call to Get Subscription Status\"</p>\n</div></li></ul></div></div></div><div id='method-getTransactionStatus' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.Payment'>ATT.Payment</span><br/><a href='source/attTitaniumAPI.html#ATT-Payment-method-getTransactionStatus' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.Payment-method-getTransactionStatus' class='name expandable'>getTransactionStatus</a>( <span class='pre'>options, success, error</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieves the status and all relevant information of a previously executed transaction. ...</div><div class='long'><p>Retrieves the status and all relevant information of a previously executed transaction.</p>\n\n<p>Three different identifiers may be used:</p>\n\n<p>• TransactionId returned by a previous call to Get Transaction Status</p>\n\n<p>• TransactionAuthCode returned at the end of the Merchant Payment Acknowledgement process</p>\n\n<p>• MerchantTransactionId specified in the initial call to the Notary.SignedPayload</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>transactionId</span> : String<div class='sub-desc'><p>(Conditional Parameter) The value of this parameter is the transaction ID generated by AT&amp;T Payment processing system for a purchase. This is used for future transaction requests.</p>\n</div></li><li><span class='pre'>merchantTransactionId</span> : String<div class='sub-desc'><p>(Conditional Parameter) The value of this parameter is the transaction ID in the merchant’s system identifying the transaction. This ID must be unique on every purchase request.</p>\n</div></li><li><span class='pre'>transactionAuthCode</span> : String<div class='sub-desc'><p>(Conditional Parameter) The value of this parameter is returned by AT&amp;T to the Developer’s Application Service upon successful conclusion of the Payment.newTransaction request.</p>\n</div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the body of the response. Valid values are:</p>\n\n<p>• application/json</p>\n\n<p>• application/xml</p>\n\n<p>The default value is: application/json</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.</p>\n\n<p> <b>Example:</b></p>\n\n<p>The following is an example of the getTransactionStatus method.</p>\n\n<pre><code>  getTransactionStatus({\n       \"transactionAuthCode\" : &lt;The value returned by AT&amp;T to the Developer’s Application Service at upon successful conclusion of the Payment.newTransaction request&gt;\n },function(data) {\n\n    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n\n<p>Note: To get the transaction status, the user can pass any of the following IDs:</p>\n\n<p>1)           \"transactionAuthCode\" : \"The value returned by AT&amp;T to the Developer’s Application Service upon successful conclusion of the Payment.newTransaction request\"</p>\n\n<p>2)           \"merchantTransactionId\" : \"The MerchantTransactionId specified in the initial call to the Notary.signedPayload\"</p>\n\n<p>3)          \"transactionId\" : \" The TransactionId returned by a previous call to Get Transaction Status\"</p>\n</div></li></ul></div></div></div><div id='method-newSubscription' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.Payment'>ATT.Payment</span><br/><a href='source/attTitaniumAPI.html#ATT-Payment-method-newSubscription' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.Payment-method-newSubscription' class='name expandable'>newSubscription</a>( <span class='pre'>options, success, error</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>The newSubscription method sets up recurring charges for a specified amount, at a specified interval, for a specified...</div><div class='long'><p>The newSubscription method sets up recurring charges for a specified amount, at a specified interval, for a specified number of times.</p>\n\n<p>The method authorizes both the merchant and the user of the subscription, and initializes the product and price data for of the transaction.</p>\n\n<p>Before this operation can be invoked, the application must call the Notary.signedPayload method and provide a payload containing the required parameters (i.e. name-value-pairs) necessary to complete the purchase process.</p>\n\n<p>The Notary.signedPayload method will return the result in either JSON or XML format, as defined in the HTTP Header \"Accept\" included in the request to sign the document. The result will contain two name-value-pairs which will be utilized in formulating the request for this method.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>signedDocument</span> : String<div class='sub-desc'><p>The value of this parameter should be the value of SignedDocument that is returned by the Notary.signedPayload method.</p>\n</div></li><li><span class='pre'>signature</span> : String<div class='sub-desc'><p>The value of this parameter should be the value of Signature that is returned by Notary.signedPayload method.</p>\n</div></li><li><span class='pre'>clientId</span> : String<div class='sub-desc'><p>The Client Id of the application making the request</p>\n</div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the body of the response. Valid values are:</p>\n\n<p>• application/json</p>\n\n<p>• application/xml</p>\n\n<p>The default value is: application/json</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n\n<p> <b>Example:</b></p>\n\n<p>The following is an example of the newSubscription method.</p>\n\n<pre><code>  newSubscription({\n      \"signedDocument\" : &lt;Use value of SignedDocument returned by Notary.signedPayload&gt;,\n      \"signature\" : &lt;Use value of Signature returned by Notary.signedPayload&gt;,\n      \"clientId\" : &lt;accessKey value&gt;\n },function(data) {\n\n    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n</div></li></ul></div></div></div><div id='method-newTransaction' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.Payment'>ATT.Payment</span><br/><a href='source/attTitaniumAPI.html#ATT-Payment-method-newTransaction' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.Payment-method-newTransaction' class='name expandable'>newTransaction</a>( <span class='pre'>options, success, error</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a new payment transaction for a one time product purchase (i.e. ...</div><div class='long'><p>Creates a new payment transaction for a one time product purchase (i.e. transactionType = SINGLE_PURCHASE).</p>\n\n<p>Before this method can be invoked, the application must call Notary.signedPayload and provide a payload containing the parameters (i.e. name-value-pairs) necessary to complete the purchase process.</p>\n\n<p>The Notary.signedPayload method will return the result in either JSON or XML format as designed by the HTTP Header Accept included in the request to sign the document. The response will contain two name-value-pairs which will be utilized in formulating the request for this method.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>signedDocument</span> : String<div class='sub-desc'><p>The value of this parameter should be the value of SignedDocument that is returned by the Notary.signedPayload method.</p>\n</div></li><li><span class='pre'>signature</span> : String<div class='sub-desc'><p>The value of this parameter should be the value of Signature that is returned by the Notary.signedPayload method.</p>\n</div></li><li><span class='pre'>clientId</span> : String<div class='sub-desc'><p>The Client Id of the application making the request</p>\n</div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the body of the response. Valid values are:</p>\n\n<p>• application/json</p>\n\n<p>• application/xml</p>\n\n<p>The default value is: application/json</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n\n<p><b>Example:</b></p>\n\n<p>The following is an example of the newTransaction method.</p>\n\n<pre><code>  newTransaction({\n      \"signedDocument\" : &lt;value of SignedDocument returned by Notary.signedPayload&gt;,\n      \"signature\" : &lt;value of Signature returned by Notary.signedPayload&gt;,\n      \"clientId\" : &lt;accessKey value&gt;\n },function(data) {\n\n    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n</div></li></ul></div></div></div><div id='method-refundTransaction' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.Payment'>ATT.Payment</span><br/><a href='source/attTitaniumAPI.html#ATT-Payment-method-refundTransaction' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.Payment-method-refundTransaction' class='name expandable'>refundTransaction</a>( <span class='pre'>options, success, error</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Refunds the value of a transaction to the original consumer. ...</div><div class='long'><p>Refunds the value of a transaction to the original consumer. The refundTransaction method can be invoked through the merchant application and will automatically pass without additional approvals.</p>\n\n<p>There are specific limits configured on the number of refunds within a day, week, and month. These limits are configured for a merchant account in the AT&amp;T payment system.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>body</span> : Object<div class='sub-desc'><p>A JSON object containing the following properties:</p>\n<ul><li><span class='pre'>TransactionOperationStatus</span> : String<div class='sub-desc'><p>The value of this parameter must be \"Refunded\".</p>\n</div></li><li><span class='pre'>RefundReasonCode</span> : String<div class='sub-desc'><p>A code that specifies a reason for the refund. Must be one of the values in a predefined list.</p>\n</div></li><li><span class='pre'>RefundReasonText</span> : String<div class='sub-desc'><p>A description of the reason for the refund.</p>\n</div></li></ul></div></li><li><span class='pre'>transactionId</span> : String<div class='sub-desc'><p>The original transaction ID of the transaction for the refund request.</p>\n</div></li><li><span class='pre'>action</span> : String<div class='sub-desc'><p>Specifies an action. The value of this parameter must always be set to \"refund\".</p>\n</div></li><li><span class='pre'>contentType</span> : String<div class='sub-desc'><p>Specifies the type of content to be sent,Valid values are:application/json,application/xml,application/x-www-form-urlencoded</p>\n</div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the body of the response. Valid values are:</p>\n\n<p>• application/json</p>\n\n<p>• application/xml</p>\n\n<p>The default value is: application/json</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.</p>\n\n<p> <strong>Examples:</strong></p>\n\n<p><b>1.</b> The following example of the refundTransaction method uses a contentType of 'application/json'.\n       refundTransaction({\n                  \"body\":{\"TransactionOperationStatus\":value, \"RefundReasonCode\":value, \"RefundReasonText\":value},\n                  \"contentType\" : \"application/json\",\n                  'transactionId' : TransactionId returned by a call to getTransactionStatus,\n                  'action' : action value\n      }, function(data) {</p>\n\n<pre><code>      success Callback\n\n  }, function(error) {\n\n      error Callback\n\n });\n</code></pre>\n\n<p><b>2.</b> The following example of the refundTransaction method uses a contentType of 'application/xml'.\n     refundTransaction({\n                   \"body\":\"<RefundTransactionRequest><TransactionOperationStatus>value</TransactionOperationStatus><RefundReasonCode>value</RefundReasonCode> <RefundReasonText>value</RefundReasonText></RefundTransactionRequest>\",\n                   \"contentType\" : \"application/xml\",\n                   'transactionId' : TransactionId returned by a call to getTransactionStatus,\n                   'action' : action value\n      }, function(data) {</p>\n\n<pre><code>      success Callback\n\n  }, function(error) {\n\n      error Callback\n\n  });\n</code></pre>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});