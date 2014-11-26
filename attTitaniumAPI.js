/**
 * @class ATT
 * <b>Introduction</b>
 *
 * Titanium SDKs for the AT&T API Platform provide the following APIs:
 *
 *• ATT.SMS
 *
 *• ATT.MMS
 * 
 *• ATT.OAuth
 *
 *• ATT.Speech
 *
 *• ATT.InAppMessaging
 *
 */
/**
 * @method getCachedAccessToken Returns the access token stored in memory. If there is no token, 
the method returns undefined.
 * @return {String}
 */
/**
 * @method getCachedUserAuthToken Returns the user consent OAuth token stored in memory.  If 
there is no token, the method returns undefined.
 * @return {String}
 */
/**
 * @class ATT.SMS <b>Introduction</b>
 *
 * The Short Message Service (SMS) API sends SMS messages to one or more AT&T Wireless mobile 
devices and receives messages by polling or by enabling a listener.
 * 
 *<b>Description</b>
 *
 *The SMS API enables authorized applications to send SMS messages to devices on the AT&T network. 
In addition, this API allows applications to query the delivery status of SMS messages previously 
accepted by the API Gateway.
 *
 *<b>The SMS API provides the following methods:</b>
 *
 *• getSMS
 *
 *• getSMSDeliveryStatus
 *
 *• sendSMS
 */
/**
 * @method sendSMS
 * Sends an SMS message to a recipient.
 * @param {Object} options Specifies a JSON object that contains properties for the following 
parameters:
 * @param {Object} options.body Specifies an object that contains all of the parameters that a user 
needs to send a message on an AT&T mobile device. Valid parameters are:
 *
 * @param {String} options.body.address Specifies the phone number of the recipients.
 * @param {String} options.body.message Specifies the text of the message to send.
 * @param {String} options.contentType Specifies the format of the message. The acceptable values for 
this parameter are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the object 
returned by this method.
 * 
 * The acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} A JSON or XML object containing the results. The format of the returned object is 
specified by the value of the accept parameter in the call to the sendSMS method.
 *
 * <strong>Examples</strong>
 *
 *<b>Example 1.</b> The following example of the sendSMS method uses a contentType of 
'application/json':
 *
 *      sendSMS({
 *          'body':{"message":"Test AT&T REST",  "address":"tel:xxxxxxxxxx"},//For multiple phone 
numbers:- "Address":["tel:xxxxxxxxxx","tel:xxxxxxxxxx"]
 *          'accept' : 'application/json',
 *          'contentType' : 'application/json'
 *       }, function(data) {
 *
 *           //success Callback
 *
 *       }, function(error) {
 *
 *           //error Callback
 *
 *       });
 * 
 *  <i>Note: "xxxxxxxxxx" represents an AT&T wireless number.</i>
 *
 *<b>Example 2.</b> The following example of the sendSMS method uses a contentType of 
'application/xml'.
 *
 *      sendSMS({
 *          "body":"<outboundSMSRequest><address>tel:xxxxxxxxxx</address><message>Test XML 
</message></outboundSMSRequest>",
 *          'accept' : 'application/json',
 *          'contentType' : 'application/xml'
 *       }, function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 * 
 *  <i>Note: "xxxxxxxxxx" represents an AT&T wireless number.</i>
 *
 *
 * <b>Example 3.</b>The following example of the sendSMS method uses a contentType of 
'application/x-www-form-urlencoded'.
 *
 *      sendSMS({
 *          
"body":"address=tel%3A%2B1xxxxxxxxxx&address=tel%3A%2B1xxxxxxxxxx&message=URL%20ENCODED
",
 *          'accept' : 'application/json',
 *          'contentType' : 'application/x-www-form-urlencoded'
 *       }, function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 *
 * <i>Note: "xxxxxxxxxx" represents an AT&T wireless number.</i>
 */
/**
 * @method getSMSDeliveryStatus
 * Checks the status of a sent SMS message.
 *
 * A message reaches its final state when the DeliveryStatus field of a DeliveryInfo object is set to one of 
the following values:
 *
 *• DeliveredToTerminal
 *
 *• DeliveryImpossible
 *
 *• DeliveredToNetwork
 *
 * A single successful delivery status query may be made within thirty minutes following the time a 
message’s DeliveryInfo object has been set to a final state. Thirty minutes after the DeliveryInfo object 
returns a final state, the object will no longer be available for query.
 * @param {Object} options Specifies a JSON object that contains properties for the following 
parameters:
 * @param {String} options.smsId Specifies the SMS request ID returned by the sendMMS method as 
part of the response object.
 * @param {String} options.accept Specifies the format of the body of the object returned by this 
method.
 * 
 * Acceptable values for this parameter are:
 *
 *•  application/json
 *
 *•  application/xml
 *
 * The default value for this parameter is 'application/json'.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} A JSON or XML object containing the delivery status. The format of the returned 
object is specified by the value of the accept parameter in the call to the getSMSDeliveryStatus method.
 *
 * <strong>Example</strong>
 *
 * The following is an example of the getSMSDeliveryStatus method:
 *
 *      getSMSDeliveryStatus({
 *           'smsId' : <put smsId here>,
 *           'accept' : 'application/json'
 *
 *       }, function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 */
/**
 * @method getSMS
 * Retrieves a list of the SMS messages that were sent to the app's short code.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} options.registrationId Specifies the short code ID of the app that was obtained when 
you registered your app with AT&T.
 * @param {String} options.accept Specifies the format of the body of the object returned by this 
method.
 * 
 * Acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 *
 * The default value for this parameter is 'application/json'.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} A JSON or XML object containing the list of SMS messages The format of the 
returned object is specified by the value of the accept parameter in the call to the getSMS method.
 *
 * <strong>Example</strong>
 *
 * The following is an example of the getSMS method:
 *
 *      getSMS({
 *           'accept' : 'application/json',
 *           'registrationId' : <put registrationId here>
 *       }, function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 */
/**
 * @class ATT.OAuth <b>Introduction</b>
 *
 * The OAuth 2.0 Authentication Management API provides access to the AT&T OAuth service, providing 
a safe and secure way for AT&T subscribers to access AT&T network resources through a third-party app 
without the risk of compromising security. The OAuth service ensures that secure, sensitive, and private 
AT&T subscription details are not exposed to the third-party app.
 * 
 * OAuth 2.0 Authentication Management is an open framework recognized as providing a strong 
protection to users and apps. This API provides you with a security model that enables you  to obtain an 
authorization code and an access token. By acquiring an OAuth authorization code, a customer 
authorizes an app to access a protected resource on behalf of the customer. The receipt of an OAuth 
access token enables an app to access a protected resource on behalf of a customer via the AT&T 
Wireless network.
 * 
 * <b>Description</b>
 * 
 * The OAuth 2.0 Authentication Management API enables third-party apps to access the private 
resources of the customer without requiring the customer to provide credentials to the third-party app, 
such as a user name and password.. 
 * 
 * <b>The OAuth 2.0 Authentication Management API provides the following methods:</b>
 *
 * 1) authorize
 *
 * 2) obtainEndUserAuthorization
 */
/**
 * @method obtainEndUserAuthorization
 * Obtains the information required to obtain an OAuth access token. This method is the initial 
operation in the OAuth call flow. It is invoked by an app that requires subscriber authorization in order 
to obtain an OAuth access token. The app’s request for an OAuth access token is forwarded by 
redirecting the subscriber’s browser to the AT&T Gateway OAuth server.
 * 
 * <b>Important:</b> This method is necessary and supported only for apps that use the following APIs:
 *
* • In-app Messaging 
 *
 * @param {Object} options Specifies a JSON object that contains properties for the following 
parameters:
 * @param {String} options.clientId Specifies the API key assigned to the app when it was registered 
at[developer.att.com] (http://developer.att.com).
 * @param {String} options.scope Specifies the services for which the app will require the user to 
provide consent. The value of the scope parameter is a comma-delimited list that contains one or more 
of the following values representing the services that are in scope:
*
 * • In-App Messaging – IMMN
 * @param {String} [options.redirectUrl] Specifies the URL where the subscriber’s browser is redirected 
following completion of the authorization process. If this parameter is not specified, the AT&T Gateway 
uses the value of the provided OAuth Redirect URL specified by the developer in the AT&T Developer 
Program console when the app is registered.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {String} Specifies a query parameter to be included with the redirect_uri parameter of the 
authorize method in the original OAuth request.
 *
 * <strong>Example</strong>
 *
 * The following is an example of the obtainEndUserAuthorization method:
 *
 *      obtainEndUserAuthorization({
 *           'clientId' : 'API Key',
 *           'scope' : 'scope values',
 *          'redirectUrl' : 'redirect url'
 *      },function(data) {
 *
 *         success Callback
 *
 *      }, function(error) {
 *
 *          error Callback
 *
 *      });
 */
/**
 * @method authorize
 *
 * Authorizes an app so that it may use specific AT&T APIs.
 *
 * This method must be called directly using the following AT&T namespace: 
<b>Att.authorize('apiKey','secretKey','scope','grantType','oAuthCode')</b>
 *
 * When authorizing an app for use with the In-App Messaging API, it must send the developer’s’s access 
key, secret key, scope, grantType, and OAuthCode.
 * 
 * <b>Syntax</b>
 * 
 * authorize( accessKey, secretKey, scope, grantType, oAuthCode )
 *
 * @param {String} accessKey Specifies the App key that was assigned to the assigned to the app when it 
was registered at [developer.att.com/] (http://developer.att.com).
 * @param {String} secretKey Specifies the App Secret that was assigned to the app when it was 
registered at [developer.att.com/] (http://developer.att.com).
 * @param {String} scope Specifies a comma-separated list of authScopes enumeration values that 
specify the APIs to which the app requires access.
 * @param {String} grantType Specifies the mechanism used to obtain the access token. Acceptable 
values for this parameter are:
 * 
 * authorization_code: Used when Web server client apps use the authorization code to obtain the 
access token.
 * 
 * client_credentials: Used when autonomous client apps use the App Key and App Secret to obtain the 
access token.
 * 
 * refresh_token: Use when client apps of both types mentioned above use refresh_token to obtain a 
new access token after the initial access token expires.
 * 
 * @param {String} oAuthCode Specifies the authorization code. The oAuthCode is returned in the 
response object of the obtainEndUserAuthorization method. Currently, this parameter is required only 
when using the Location and In-App Messaging APIs.
 *    <b>Example</b>
 *
 * The following is an example of the authorize method:
 *
 *              Att.authorize('apiKey','secretKey','scope','grantType','oAuthCode');
 */
/**
 * @class ATT.MMS <b>Introduction</b>
 *
 * The Multimedia Messaging Service (MMS) API sends MMS messages to one or more supported AT&T 
Wireless mobile devices and receives MMS messages from mobile devices.
 *
 * <b>Description</b>
 *
 * This API enables developers to check the delivery status of the MMS messages previously accepted by 
the API Gateway for delivery. Developers may specify that their apps either poll for the delivery status or 
request that the app be notified to a registered callback listener URI for your app account.  
 * 
  *
 * <b>The MMS API provides the following methods:</b>
 *
 *• getMMSDeliveryStatus
 *
 *• sendMMS
 */
/**
 * @method sendMMS
 *
 * Sends an MMS message to a specified recipient.
 *
 * The Multimedia Messaging Service allows for the delivery of multiple file types. For an updated list, 
see the [Developer 
Documentation](https://developer.att.com/developer/tierNpage.jsp?passedItemId=2400428).
 *
 * @param {Object} options Specifies a JSON object that contains properties for the following 
parameters:
 * @param {Object} options.body Specifies an object containing the required parameters for sending a 
message from an AT&T mobile device. The acceptable parameters are:
 * @param {String} options.body.address Specifies the phone number of the recipient.
 * @param {String} [options.body.subject] Specifies the subject of the message.
 * @param {String} [options.body.Priority="Default"] Acceptable values for this parameter are:
 * 
 *• "Default",
 * 
 *• "Low", 
 * 
 *• "Normal", 
 * 
 *• "High"
 *
 * The defaults value is: 'Default'
 * @param {Array} options.attachments Specifies an array of JSON objects that contain three key-value 
pairs:
 * 
 * • fileName:"Name of the file"
 * 
 * • fileType:"Type of the file"
 * 
 * • filePath:"Path of the file"
 *
 * The file may be an image, audio, video, or text file.
 * 
 * @param {String} options.contentType Specifies the format of the message content. Acceptable values 
for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the object 
returned by this method.
 * 
 * Acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} A JSON or XML object containing the response. The format of the returned object is 
specified by the value of the accept parameter in the call to the sendMMS method.
 *
 * <strong>Examples</strong>
 *
 * <b>Example 1: </b> The following example of the sendMMS method sends a JSON-formatted 
message with high priority:
 *
 *      sendMMS({
 *                  "body":{ "address" : "tel:xxxxxxxxxx,tel:xxxxxxxxxx", "subject" : "Test MMS", "priority" : 
"High" },
 *                  "contentType" : "application/json",
 *                  "accept" : "application/json",
 *                  "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : 
image/png",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}, {'fileName' : 
"Name of the file",'fileType' : " image/jpeg",'filePath' :"Path of the file","fileObject":"base-64 encoded 
string of file object"}]
 *      },  function(data) {
 *
 *           //success Callback
 *
 *       }, function(error) {
 *
 *           //error Callback
 *
 *       });
 * 
 * Note: "xxxxxxxxxx" represents an AT&T wireless number.
 *
 * <b>Example 2.</b> The following example of the sendMMS method sends an XML-formatted 
message with high priority:
 *
 *      sendMMS({
 *                  "body":"<outboundMessageRequest>" + "\n" + "<address>tel:xxxxxxxxxx</address>" + "\n" 
+ "<subject>Test MMS</subject>" + "\n" + "<priority>High</priority>" + "\n" + 
"</outboundMessageRequest>",
 *                  "contentType" : "application/xml",
 *                  "accept" : "application/json",
 *                  "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : 
image/png",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}, {'fileName' : 
"Name of the file",'fileType' : " image/jpeg",'filePath' :"Path of the file","fileObject":"base-64 encoded 
string of file object"}]
 *       },  function(data) {
 *
 *           //success Callback
 *
 *       }, function(error) {
 *
 *           //error Callback
 *
 *       });
 * 
 * Note: "xxxxxxxxxx" represents an AT&T wireless number.
 *
 * <b>Example 3.</b> The following example of the sendMMS method uses a contentType of 
'application/x-www-form-urlencoded':
 *
 *      sendMMS({
 *                  "body":"address=tel%3A%2B1xxxxxxxxxx&priority=High&subject=Test%20MMS",
 *                  "contentType" : "application/x-www-form-urlencoded",
 *                  "accept" : "application/json",
 *                 "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : 
image/png",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}, {'fileName' : 
"Name of the file",'fileType' : " image/jpeg",'filePath' :"Path of the file","fileObject":"base-64 encoded 
string of file object"}]
 *      },  function(data) {
 *
 *          //success Callback
 *
 *      }, function(error) {
 *
 *          //error Callback
 *
 *      });
 *
 * <i>Note: "xxxxxxxxxx" represents an AT&T wireless number.</i>
 */
/**
 * @method getMMSDeliveryStatus
 *
 * Returns the status of a sent MMS message.
 * @param {Object} options Specifies a JSON object that contains properties for the following 
parameters:
 * @param {String} options.id Specifies the MMS request ID to be returned by the sendMMS method.
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the object 
returned by this method.
 * 
 * Acceptable values for this parameter are:
 *
 *- application/json
 *
 *- application/xml
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} A JSON or XML object containing the status information for the message. The 
format of the returned object is specified by the value of the accept parameter in the call to the 
getMMSDeliveryStatus method.
 *
 * <strong>Example</strong>
 *
 * The following example of the getMMSDeliveryStatus method returns a JSON object containing 
information about the status of the specified message:
 *
 *      getMMSDeliveryStatus({
 *                  'id' : "MMS ID that you get in response of sendMMS.",
 *                  "accept" : "application/json",
 *       },  function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 */
/**
 * @class ATT.InAppMessaging <b>Introduction</b>
 *
 * The In-App Messaging API enables your app to send and retrieve SMS and MMS messages on behalf 
of your customers’ regular AT&T mobile phone numbers.
 *
 * <b>Description</b>
 *
 * The In-App Messaging API sends and retrieves SMS and MMS messages on behalf of a customer if that 
customer has provided consent via the OAuth 2.0 Authentication Management API. When sending a 
message on behalf of a customer, that customer's phone number is retrieved using their consent 
information. The message is then forwarded to the recipients using the customer's phone number as the 
sender address. A developer is able to make a single request to the API Gateway and the AT&T servers 
determine if the request is an SMS message or an MMS message and selects the correct transport 
mechanism.
 * <br>Major advantages of using In-App Messaging include:
 * Sending messages from your app: The Send Message method sends text and picture messages to any 
mobile phone in the USA using an AT&T Wireless phone number as the sender address. Message 
recipients are able to immediately recognize who sent the message.
 * 
 * Receiving messages in your app: Responses to messages can be received by the user’s mobile phone 
or by your app using the Get Message, Get Message List, and Get Message Content operations. Your app 
can display messages received by the user’s mobile phone, allowing the conversation to continue from 
within your app.
 *
 * <b>Methods:</b>
 *
 * 1) createMessageIndex
 *
 * 2) deleteMessage
 *
 * 3) deleteMessages
 * 
 * 4) getMessage
 * 
 * 5) getMessageContent
 * 
 * 6) getMessagesDelta
 * 
 * 7) getMessageIndexInfo
 * 
 * 8) getMessageList
 * 
 * 9) sendMessage
 * 
 * 10) getNotificationConnectionDetails
 * 
 * 11) updateMessage
 * 
 * 12) updateMessages
 * 
 */
/**
 * @method createMessageIndex
 * This operation creates an index cache for a subscriber’s inbox. 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 
202 (Accepted).
 * 
 * <strong>Example</strong>
 * 
 * The following is an example of the getMessageHeaders method:
 *
 *          createMessageIndex({
 *                  'accept' : 'application/json'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @method deleteMessage
 * This operation deletes a specific message from a subscriber’s inbox.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {String} options.messageId ID of the message to be deleted.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 
204 (No Content).
 * 
 * <strong>Example</strong>
 * 
 * The following is an example of the deleteMessage method:
 *
 *          deleteMessage({
 *                  'accept' : 'application/json',
 * 'messageId' : 's01'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @method deleteMessages
 * This operation deletes multiple messages from a subscriber’s inbox. 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {String} options.messageIds Comma-delimited message IDs.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 
204 (No Content).
 * 
 * <strong>Example</strong>
 * 
 * The following is an example of the deleteMessage method:
 *
 *          deleteMessages({
 *                  'accept' : 'application/json',
 * 'messageIds' : 's01,s02,s03'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @method getMessage
 * The Get Message operation retrieves a single message from a subscriber's inbox. 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {String} options.messageId An identifier representing a message.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request. 
 * 
 * <strong>Example</strong>
 * 
 * The following is an example of the getMessage method:
 *
 *          getMessage({
 *                  'accept' : 'application/json',
 * 'messageId' : 's01'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @method getMessageContent
 * This method uses information returned by getMessageList to enable apps to fetch one or more 
subscriber messages.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. 
 * 
 * The default value is application/json.
 * @param {String} options.messageId An identifier representing a subscriber message.
 * @param {String} options.partId A content identifier representing an attachment in the referenced 
subscriber message
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response is specified by the 
value of the accept parameter in the request. 
 * 
 * <strong>Example</strong>
 * 
 * The following is an example of the getMessageContent method:
 *
 *          getMessageContent({
 *                  'accept' : 'application/json',
 * 'messageId' : 's01',
 * 'partId' : '1'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @method getDelta
 * This method checks for updates by passing in a client state.
 * This is typically used when a client comes online. If the subscriber’s mailbox index cache does not 
exist, an HTTP error 409 is returned to the client and the client must re-initialize the cache. 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {String} options.state state The client obtains this string from a either a getMessageIndexInfo  
or a getMessageList request.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request. 
 * 
 * <strong>Example</strong>
 * 
 * The following is an example of the getDelta method:
 *
 *          getDelta({
 *                  'accept' : 'application/json',
 * 'state' : 'xxxxxxxxxxxxxxxxxx'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 * <i> Note: "xxxxxxxxxxxxxxxxxx" represents the state of the Inbox. </i>
 */
/**
 * @method getMessageIndexInfo
 * This operation gets the state, status and message count of the index cache for the subscriber’s inbox.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request. 
 * 
 * The messageIndexInfo object returned has the following parameters:
 * @param {String} status Indicates the status of the message index cache. The following values may be 
returned:
 *    <ul>
 *    <li>NOT_INITIALIZED</li>
 *    <li>INITIALIZING</li>
 *   <li>INITIALIZED</li>
 *    <li>ERROR</li>
 *    </ul>
 * @param {String} state Specifies the current state of the mailbox in the platform.
 * @param {Number} messageCount Specifies the number of messages cached for the subscriber
 *
 * <strong>Example</strong>
 * 
 * The following is an example of the getMessageIndexInfo method:
 *
 *          getMessageIndexInfo({
 *                  'accept' : 'application/json'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @method getMessageList
 * Enables an app to retrieve metadata for one or more subscriber messages.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} options.limit Specifies the number of messages to be returned.
 *
 * Valid Range: Min = 1, Max = 500
 *
 * If the offset parameter is defined, the number of messages defined in the limit parameter will be 
returned, starting with the first message defined by offset.
 * @param {String} [options.offset] Defines an index value at which the limit starts.
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request.
 *
 * <strong>Example</strong>
 * 
 * The following is an example of the getMessageList method:
 *
 *          getMessageList({
 *                  'accept' : 'application/json',
 *                  'limit' : 500 //Valid Range: Min = 1, Max = 500 // Should be an integer.
 *                  'offset' : '123' //Defines an index value at which the offset will start.
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @method sendMessage
 * Enables an app to send messages on behalf of an AT&T subscriber. Each time the sendMessage 
method is invoked, a single message can be sent to one or more destination devices. Messages are 
processed synchronously and sent asynchronously to the destination.
 * @param {Object} options A JSON object containing the following properties:
 * @param {Object} options.body An object containing the required parameters for sending a message 
from an AT&T mobile device. Valid parameters are:
 * @param {Array} options.body.Addresses The phone number of the recipient, or a comma separated 
list of phone numbers for multiple recipients. For example: tel:6507038846,tel:6507038847.
 * @param {String} options.body.Subject The subject of the message.
* @param {Boolean} options.body.isGroup If set to true, the message is sent as a group MMS message. 
Otherwise the message will be sent as a broadcast message to multiple recipients. 
 * @param {String} options.body.Text The text portion of the message. If the request is detected as 
MMS, the following character sets are supported:
*
 *• ASCII
 *
 *• UTF-8
 *
 *• UTF-16
 *
 *• ISO-8859-1
 *
 * If the request is detected as SMS, the following character set is supported:
 *
 *• ISO-8859-1
 *
 * Note: This parameter is  required if one or more attachments are not provided in the request.
 * @param {Array} options.attachments An array of JSON objects containing three key-value pairs: 
<i>{fileName:"Name of the file",fileType:"Type of the file",filePath:"Path of the file"}</i>. The file can be 
an image, audio ,video or text.
 * @param {String} options.contentType Specifies the format of the message content. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request.
 *
 * <strong>Examples</strong>
 *
 * <b>1.</b> The following example of the sendMessage method uses a contentType of 
'application/json':
 *
 *      sendMessage({
 *                   "body":{ "MessageRequest": {"Addresses": 
["mail@mail.mail","mail@mail.mail","tel:xxxxxxxxxx"], "Text": "Hello world", "Subject": "Hi" ,"isGroup": 
false} },
 *                   "contentType" : "application/json",
 *                   "accept" : "application/json",
 *                   "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : 
image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : " 
image/jpeg",'filePath' :"Path of the file"}]
 *        }, function(data) {
 *
 *           success Callback
 *
 *       }, function(error) {
 *
 *           error Callback
 *
 *       });
 *
 * <b>2.</b> The following example of the sendMessage method uses a contentType of 
'application/xml':
 *  
 *      sendMessage({
 *                    
"body":"<MessageRequest>"+"\n"+"<Addresses>tel:xxxxxxxxxx,tel:xxxxxxxxxx,mail@mail.mail</Address
es>"+"\n"+"<Text>Hello world</Text>"+"\n"+"<Subject>Hi</Subject>"+"\n"+"</MessageRequest>",
 *                    "contentType" : "application/xml",
 *                    "accept" : "application/json",
 *                    "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : 
image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : " 
image/jpeg",'filePath' :"Path of the file"}]
 *        }, function(data) {
 *
 *           success Callback
 *
 *       }, function(error) {
 *
 *           error Callback
 *
 *       });
 *
 *
 * <b>3.</b> The following example of the sendMessage method uses a contentType of 'application/x-
www-form-urlencoded':
 *
 *      sendMessage({
 *                   
"body":"Addresses=tel%3A%2Bxxxxxxxxxx&Addresses=tel%3A%2Bxxxxxxxxxx&Addresses=mail@mail.m
ail&Text=Hello&Subject=Hi&isGroup=false",
 *                   "contentType" : "application/x-www-form-urlencoded",
 *                   "accept" : "application/json",
 *                  "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : 
image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file : 
image/jpeg",'filePath' :"Path of the file"}]
 *        }, function(data) {
 *
 *           success Callback
 *
 *       }, function(error) {
 *
 *           error Callback
 *
 *       });
 *
 * <i>Note: "xxxxxxxxxx" represents an AT&T wireless number.</i>
 */
/**
 * @method updateMessage
 * This operation updates the flags associated with a specific message after passing the message IDs and 
flags.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {String} options.messageId Id of the message that is intended to be updated.
 * @param {Object} options.body An object containing the parameters required to update messages.
 * @param {Object} options.body.message Container for flags that need to be updated.
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 
204 (No Content).
 * 
 * <strong>Example</strong>
 * 
 * The following is an example of the updateMessage method:
 *
 *          updateMessage({
 *                  'accept' : 'application/json',
 * 'messageId' : 's01',
 * 'body' : {'message': {'isUnread' : true} }
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
 /**
 * @method updateMessages
 * This operation updates the flags associated with a collection of messages, and enables passing any 
number of message IDs
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Acceptable values 
are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is application/json.
 * @param {Object} options.body An object containing the parameters required to update messages.
 * @param {Object} options.body.message Container for flags to be updated, including message IDs and 
isUnread flags.
 * @param {String} options.body.message.messageId ID of the message to be updated.
 * @param {String} options.body.message.isUnread Value of the isUnread flag to which the message will 
be updated. 
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is 
specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 
204 (No Content).
 * 
 * <strong>Example</strong>
 * 
 * The following is an example of the updateMessages method:
 *
 *          updateMessages({
 *                  'accept' : 'application/json',
 * 'messageId' : 's01',
 * 'body' : {'message': {'MessageId': 's01','isUnread' : true}, 
{'MessageId': 's03','isUnread' : false} }
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @class ATT.Speech <b>Introduction</b>
 *
 * The Speech API enables authorized apps to transcribe speech (audio) to text. In addition, your app 
may influence the results by passing a speech context in the Speech to Text method.
 *
 * <b>Description</b>
 *
 * The Speech API is a service that accepts audio data and returns the text representation of that audio. 
The text output may then be processed using different speech contexts to produce results that more 
closely represent that speech context. * 
 * <b>The Speech API provides the following method:</b>
 *
 *• speechToText
 */
/**
 * @method speechToText
 * Returns a text translation of the specified audio file using the specified speech context. The audio file 
must be formatted either as 16-bit PCM WAV with a single channel and 8 kHz sampling, or as AMR 
(narrowband) with a 12.2 kbit/s data rate and 8 kHz sampling.
 *
 * @param {Object} options Specifies a JSON object that contains properties for the following 
parameters:
 * @param {String} options.filePath Specifies the path of the audio file to be translated. For the Android 
platform, the path should be in the following format: /mnt/sdcard/.../fileName.fileExtension.
 * @param {String} [options.transferEncoding] Specifies the audio file encoding. This parameter is 
required only for a streaming request, and should be set to a value of <i>chunked</i>.
 * @param {String} [options.xSpeechContext="Generic"] Specifies the speech context to be applied to 
the transcribed text. Acceptable values for this property are:
 *
 *• Generic
 *
 *• TV
 *
 *• BusinessSearch
 *
 *• Websearch
 *
 *• SMS
 *
 *• Voicemail
 *
 *• QuestionAndAnswer
 *
 *• Gaming
 *
 *• SocialMedia
 *
 * If the <b>TV</b> context is chosen, the X-Arg parameter <b>Search</b> must be defined.
 * @param {String} options.contentType The content type of the request. Acceptable values are:
 *
 *• audio/wav (or audio/x-wav)
 *
 *• audio/amr
 *
 *• audio/amr-wb
 *
 *• audio/x-speex
 *
 *• audio/x-speex-with-header-byte;rate=16000
 *
 *• audio/x-speex-with-header-byte;rate=8000
 *
 *• audio/raw;coding=linear;rate=16000;byteorder=LE
 *
 *• audio/raw;coding=linear;rate=16000;byteorder=BE
 *
 *• audio/raw;coding=linear;rate=8000;byteorder=LE
 *
 *• audio/raw;coding=linear;rate=8000;byteorder=BE
 *
 *• audio/raw;coding=ulaw;rate=16000
 *
 *• audio/raw;coding=ulaw;rate=8000
 *
 *Note: The API Gateway does not modify this header when passed to the Speech API, except to remove 
white space to ensure consistent use of parameters.
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the object 
returned by this method.
 * 
 * Acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 * @param {Number} options.contentLength <b>(IOS only) </b>This parameter is required only for a 
non-streaming request.
 * @param {String} [options.contentLanguage="en-US"] Specifies the language of the submitted audio. 
Used only when the xSpeechContext parameter is set to Generic.  Acceptable values  for this parameter 
are:
 * 
 *• "en-US" (English - United States)
 * 
 *• "es-US" (Spanish - United States)
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} A JSON or XML object containing the transcribed text. The format of the returned 
object is specified by the value of the accept parameter in the call to the speechToText method.
 *
 * <b>Example</b>
 *
 * The following is an example of the speechToText method:
 *
 *       speechToText({
 *           'filePath':'Path of audio file'//Example in Android: /mnt/sdcard/.../example.wav.
 *           'xSpeechContext' : 'Generic',
 *           'contentType' : 'audio/wav',
 *           'contentLength' : length,//For IOS only.
 *           'accept':'application/json',
 *           'contentLanguage': 'es-US'
 *      },function(data) {
 *
 *         //success Callback
 *
 *      }, function(error) {
 *
 *          //error Callback
 *
 *      });
 */
/**
 * @method speechToTextCustom
 * This method returns a text translation of a specified audio file using a custom set of hints for pronunciation and grammar. The audio file must be created in one of the following formats:
 *
 *• 16-bit PCM WAV, single channel, 8 kHz sampling
 *
 *• AMR (narrowband), 12.2 kbit/s, 8 kHz sampling.
 *
 * @param {Object} params An Object containing the following properties:
 * @param {String/Object} [params.audioFile] A string with a filePath to the audio file or an object with the following properties:
 * @param {String} [params.audioFile.filePath] The path to the audio file. If params.audioFile.body is also defined, this will be used as the file name in the request.
 * @param {String} [params.audioFile.body] The audio file content.
 * @param {String} [params.audioFile.type] The MIME type of the audio file.
 * @param {String} [params.audioFile.encoding] The encoding format of the audio file.
 * @param {String} [params.grammar] String of a file path or a string in Speech Recognition Grammar Specification (SRGS) format.
 * @param {String} [params.grammarPrefix] Grammar rules for the prefix speech following the same format as params.grammar
 * @param {String} [params.grammarAltgram] Grammar rules for alternative grammar, following the same format as params.grammar
 * @param {String} [params.dictionary] String of a file path with pronunciation hints in the Pronunciation Lexicon Specification (PLS) format, or a string containing the pronunciation hints in the PLS format.
 * @param {String} [params.language] The language of the audio recording, specified as an ISO code language string.
 * @param {String/Object} [params.xArg] Either a comma-separated URL-encoded string or a flat object consisting of xArg parameter key/value pairs.  Please visit the <a href="https://developer.att.com/developer/basicTemplate.jsp?passedItemId=13100102&api=Speech&version=3">AT&T Restful API</a> for a list of all possible values
 * @param {Object} [params.options] A set of options for the request.
 * @param {Boolean} [params.options.emma] The option to callback with the response as a string following the EMMA protocol.
 * @param {Boolean} [params.options.strict] If set to true, the response will strictly follow the passed in grammar rules
 * @param {Boolean} [params.options.chunked] If set to true, this will send the audio file to server using a chunked protocol.
 * 
 * @param {Function} success This method is called if data is successfully returned.  The first argument will be contain the response in JSON object defined by the <a href="https://developer.att.com/developer/basicTemplate.jsp?passedItemId=13100102&api=Speech&version=3">AT&T Restful API</a>.
 * @param {Function} fail This method is called if an error occurs.
 * 
 */
/*
 * @class ATT.TTS <b>Introduction</b>
 *
 * The Text to Speech API converts text into audio content.
 *
 * <b>Description</b>
 *
 * The Text To Speech API transcribes text into binary audio data and applies a male or female 
synthesized voice. The Speech API applies an API-specific lexicon and transcribes the original text into 
binary audio data. The original text may be represented in English or Spanish. The returned binary audio 
data may be represented in AMR or WAV audio formats.
 * 
 * <b>The TTS API provides the following method:</b>
 *
 *• textToSpeech
 */
/**
 * @method textToSpeech
 * Returns an audio file in the specified voice and language using the text that was sent.
 * @param {Object} options Specifies a JSON object that contains properties for the following 
parameters:
 * @param {String} options.accept Specifies the audio file type to be generated. Supported audio types 
are audio/amr, audio/amr-wb, and audio/x-wav.
 * @param {String} options.contentType Specifies the format in which the content is being transmitted 
in the body. Supported content types are text/plain and application/ssml+xml.
 * @param {String} options.body Specifies the text content to be converted to an audio file.
 * @param {String} options.filePath Specifies the path where the audio file will be stored after the text 
translation. For the Android platform, the path should be in the following format: 
/mnt/sdcard/.../fileName.fileExtension.
 * @param {String} [options.xarg="VoiceName=crystal"] Specifies the voice qualities and other 
properties of the generated audio file, such as character, tempo, and volume. Acceptable values for this 
property are:
 *
 *• VoiceName
 *
 *• Tempo
 *
 *• Volume
 *
 *• AppId
 *
 *• OrgId
 *
 *• ClientApp
 *
 *• Client Version
 *
 *• Client Screen
 *
 * If <b>VoiceName</b> is specified, this property must include one of the preset voice characters:
 *
 *• mike
 *
 *• crystal
 *
 *• rosa
 *
 *• alberto
 *
 * @param {String} [options.accept="application/json"] Specifies the audio file format.
 * 
 * Acceptable values for this parameter are:
 *
 *• audio/wav
 *
 *• audio/amr
 *
 *• audio/amr-wb
 *
 * @param {Function} success The callback function called when the method returns success.
 * @param {Function} error The callback function called when the method returns an error.
 * @return {Object} A JSON object containing the path of the audio file. The file path returned, including 
the file name and extension, is specified by the value of the accept parameter in the call to the 
textToSpeech method.
 *
 * <b>Example</b>
 *
 * The following is an example for textToSpeech request method:
 *
 * textToSpeech({
 * 'accept' : 'audio/wav',
 * 'contentType' : text/plain,
 * 'body':text,
 * "filePath" : filePath,
 * 'xarg' : "VoiceName=crystal"
 *
 * }, function(data) {
 * // success CallBack
 * }, function(error) {
 *     //failure Callback
 * });
 *       
 */
