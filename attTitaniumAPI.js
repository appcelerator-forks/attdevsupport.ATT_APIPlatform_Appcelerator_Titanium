/**
 * @class ATT
 * <b>Introduction:</b>
 *
 * The Titanium SDKs for AT&T API Platform provides the following APIs.
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
 */
/**
 * @method getCachedAccessToken Returns the accessToken used for requests that is stored in memory.  If there is no token, it returns undefined
 * @return {String}
 */
/**
 * @method getCachedUserAuthToken Returns the user consented OAuth token used for requests that is stored in memory.  If there is no token, it returns undefined
 * @return {String}
 */
/**
 * @class ATT.SMS <b>Introduction:</b>
 *
 * The Short Message Service (SMS) API enables authorized applications to send SMS messages to devices on the AT&T network. The API also allows applications to query the delivery status of SMS messages sent from an application.
 *
 *<b>Description:</b>
 *
 *The SMS API enables you to target specific customers with alerts and information. Additionally, the SMS API can give your customers the ability to respond to your messages in near real-time.
 *
 *<b>Methods:</b>
 *
 *1) getSMS
 *
 *2) getSMSDeliveryStatus
 *
 *3) sendSMS
 */
/**
 * @method sendSMS
 * Sends an SMS message to a recipient.
 * @param {Object} options A JSON object containing the following properties:
 * @param {Object} options.body An Object containing the following properties:
 *
 * @param {String} options.body.address The MSISDN of the recipient(s).
 * @param {String} options.body.message The text of the message to send.
 * @param {String} options.contentType Valid values are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded

 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. This response object contains the SMS ID that is used in the smsId property of the options parameter in the getSMSDeliveryStatus method.
 *
 * <strong>Examples:</strong>
 *
 *<b>1.</b> The following example of the sendSMS method uses a contentType of 'application/json'.
 *
 *       sendSMS({
 *           'body':{"message":"Test AT&T REST",  "address":"tel:xxxxxxxxxx"},//For Multiple Phone Number :- "address":["tel:xxxxxxxxxx","tel:xxxxxxxxxx"]
 *           'accept' : 'application/json',
 *           'contentType' : 'application/json'
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
 *<b>2.</b> The following example of the sendSMS method uses a contentType of 'application/xml'.
 *
 *       sendSMS({
 *           "body":"<outboundSMSRequest><address>tel:xxxxxxxxxx</address><message>Test XML </message></outboundSMSRequest>",
 *           'accept' : 'application/json',
 *           'contentType' : 'application/xml'
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
 *
 * <b>3.</b> The following example of the sendSMS method uses a contentType of 'application/x-www-form-urlencoded'.
 *
 *       sendSMS({
 *           "body":"address=tel%3A%2B1xxxxxxxxxx&address=tel%3A%2B1xxxxxxxxxx&message=URL%20ENCODED",
 *           'accept' : 'application/json',
 *           'contentType' : 'application/x-www-form-urlencoded'
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
 * <i>Note: xxxxxxxxxx represents an AT&T wireless number</i>
 */
/**
 * @method getSMSDeliveryStatus
 * Checks the status of a sent SMS message.
 *
 * A final state is reached when the DeliveryStatus field of a DeliveryInfo object is set to one of the following values:
 *
 *• DeliveredToTerminal
 *
 *• DeliveryImpossible
 *
 *• DeliveredToNetwork
 *
 * A single successful delivery status query can be made for a period of thirty minutes following the time a message DeliveryInfo object has been set to a final state. Thirty minutes after a query of the DeliveryInfo object has returned a final state, the DeliveryInfo object may not be available for query.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} options.smsId The SMS request id that is returned by the sendSMS method as part of the response object.
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *•  application/json
 *
 *•  application/xml.
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.
 *
 * <strong>Example:</strong>
 *
 * The following is an example of the getSMSDeliveryStatus method.
 *
 *      getSMSDeliveryStatus({
 *           'smsId' : <put smsId here>,
 *           'accept' : 'application/json'
 *
 *       }, function(data) {
 *
 *            success Callback
 *
 *       }, function(error) {
 *
 *            error Callback
 *
 *       });
 */
/**
 * @method getSMS
 * Retrieves a list of SMS messages that were sent to the application's short code.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} options.registrationId The ID of the application which is a short code that is obtained when you register your application with AT&T.
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml.
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.
 *
 * <strong>Example:</strong>
 *
 * The following is an example of the getSMS method.
 *
 *      getSMS({
 *           'accept' : 'application/json',
 *           'registrationId' : <put registrationId here>
 *       }, function(data) {
 *
 *            success Callback
 *
 *       }, function(error) {
 *
 *            error Callback
 *
 *       });
 */

/**
 * @class ATT.MMS <b>Introduction:</b>
 *
 * The Multimedia Messaging Service (MMS) API greatly enhances the power of your communications by moving beyond the text-only capabilities of Short Message Service (SMS) messaging. Using the MMS API, you can send Mobile Terminated or receive Mobile Originated) messages that include video, images and audio attachments as well as text.
 *
 * <b>Description:</b>
 *
 *The MMS API enables applications to send MMS messages and get the delivery status of the messages from the network. If an application hosts a service that complies with an AT&T specified callback, the application can also receive MMS messages. AT&T will deliver MMS messages to the application as soon as they arrive on the AT&T network.
 *
 * <b>Methods:</b>
 *
 *1) getMMSDeliveryStatus
 *
 *2) sendMMS
 *
 */

/**
 * @method sendMMS
 *
 * Sends an MMS message to the specified recipient.
 *
 * The Multimedia Messaging Service for the delivery of different file types please see the [Developer Documentation](https://developer.att.com/developer/tierNpage.jsp?passedItemId=2400428) for an updated list.
 *
 * @param {Object} options A JSON object containing the following properties:
 * @param {Object} options.body An Object containing all of the parameters that a user needs to send a message on an AT&T mobile device. Valid parameters are:
 * @param {String} options.body.address The MSISDN of the recipient(s).For multiple addresses, the value of this parameter will be an array of strings.
 * @param {String} [options.body.subject] The subject of the message.
 * @param {String} [options.body.priority="Default"] The Priority of the message. Valid values are "Default", "Low", "Normal", and "High".
 * @param {Array} options.attachments An array of JSON objects containing three key-value pairs, i.e. <i>{fileName:"Name of the file",fileType:"Type of the file",filePath:"Path of the file"}</i> The file can be image, audio, video or text.
 * @param {String} options.contentType Specifies the format of the message content. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded

 * @param {String} [options.accept="application/json"] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. This response object contains the MMS ID that is used in the id property of the options parameter in the getMMSDeliveryStatus method.
 *
 * <strong>Examples:</strong>
 *
 * <b>1.</b> The following example of the sendMMS method uses a contentType of 'application/json'.
 *
 *       sendMMS({
 *           "body":{ "address" : "tel:xxxxxxxxxx,tel:xxxxxxxxxx", "subject" : "Test MMS", "priority" : "High" },
 *           "contentType" : "application/json",
 *           "accept" : "application/json",
 *           "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
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
 * <b>2.</b> The following example of the sendMMS method uses a contentType of 'application/xml'.
 *
 *       sendMMS({
 *           "body":"<outboundMessageRequest>" + "\n" + "<address>tel:xxxxxxxxxx</address>" + "\n" + "<subject>Test MMS</subject>" + "\n" + "<priority>High</priority>" + "\n" + "</outboundMessageRequest>",
 *           "contentType" : "application/xml",
 *           "accept" : "application/json",
 *           "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
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
 * <b>3.</b> The following example of the sendMMS method uses a contentType of 'application/x-www-form-urlencoded'.
 *
 *       sendMMS({
 *           "body":"address=tel%3A%2B1xxxxxxxxxx&priority=High&subject=Test%20MMS",
 *           "contentType" : "application/x-www-form-urlencoded",
 *           "accept" : "application/json",
 *           "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
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
 * <i>Note: xxxxxxxxxx represents an AT&T wireless number.</i>
 */

/**
 * @method getMMSDeliveryStatus
 *
 * Returns the status of a sent MMS message.
 * @param {Object} options An object containing the following properties:
 * @param {String} options.id The MMS request ID that is returned by the sendMMS method as part of the response object.
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.
 *
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMMSDeliveryStatus method.
 *
 *      getMMSDeliveryStatus({
 *                  'id' : "MMS ID that you get in response of sendMMS.",
 *                  "accept" : "application/json",
 *       },  function(data) {
 *
 *            success Callback
 *
 *       }, function(error) {
 *
 *            error Callback
 *
 *       });
 */
/**
 * @class ATT.InAppMessaging <b>Introduction:</b>
 *
 * The In-App Messaging API enables your application to send and retrieve SMS and MMS messages on behalf of your customers’ regular AT&T mobile phone numbers.
 *
 * <b>Description:</b>
 *
 * The In-App Messaging from Mobile Number API allows applications to send and receive SMS and MMS on behalf of a subscriber if that subscriber has given consent. When sending a message on behalf of a subscriber, that subscriber's MSISDN is retrieved from the subscriber’s consent information. The message is then forwarded to the recipients using the subscriber's MSISDN as the sender address. A developer can make a single API request and the AT&T system will determine if the request is an SMS or an MMS message and select the correct transport mechanism accordingly.
 * <br>Some major advantages of using In-App Messaging are:
 * Sending messages from your application: The In-App Messaging Send Message operation allows your customers to send text and picture messages to any U.S. mobile phone using their own AT&T phone number, from within your application. Message recipients can immediately recognize who sent the message.
 * 
 * Receiving messages in your application: Responses to the sent messages can be received by the user’s mobile phone or by your application using the Get Message Headers and Get Message Content operations. Your application can display messages received by the user’s mobile phone, allowing the conversation to continue from within your application.
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
 * This operation gives the developer the ability to create an index cache for the suscriber's inbox 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 202 (Accepted)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessageHeaders method.
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
 * This operation gives the developer the ability to delete a specific message in an inbox.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.messageId Id of the message that is intended to get deleted.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 204 (No Content)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the deleteMessage method.
 *
 *          deleteMessage({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01'
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
 * This operation gives the developer the ability to delete messages in an inbox. 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.messageIds Comma delimited message ids.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. 
 * No content is returned, only HTTP Code 204 (No Content)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the deleteMessage method.
 *
 *          deleteMessages({
 *                  'accept' : 'application/json',
 *					'messageIds' : 's01,s02,s03'
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
 * The Get Message operation will get a single message from a subscriber's message inbox. 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.messageId A message identifier representing a Subscriber Message in the AT&T Messages environment.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. 
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessage method.
 *
 *          getMessage({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01'
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
 * This method uses information returned by getMessageList to enable applications to fetch one or more subscriber messages from the AT&T Messages environment.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. 
 * 
 * The default value is: application/json
 * @param {String} options.messageId A message identifier representing a Subscriber Message in the AT&T Messages environment.
 * @param {String} options.partId A content identifier representing an attachment in the referenced Subscriber Message
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response is specified by the value of the accept parameter in the request. 
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessageContent method.
 *
 *          getMessageContent({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01',
 *					'partId' : '1'
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
 * This method provides capability to check for updates by passing in a client state.
 * This is typically used when a client goes from being offline to becoming online. If the subscriber’s mailbox index cache does not exist an error (409) would be returned to the client and the client would have to re-initialize the cache 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.state state The client would have this string from a either the Get Message Index request, or from the getMessageList request.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. 
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the getDelta method.
 *
 *          getDelta({
 *                  'accept' : 'application/json',
 *					'state' : 'xxxxxxxxxxxxxxxxxx'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 * <i> Note: xxxxxxxxxxxxxxxxxx represents the state of the Inbox </i>
 */

/**
 * @method getMessageIndexInfo
 * This operation allows the developer to get the state, status and message count of the index cache for the subscriber’s inbox.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. 
 * 
 * The messageIndexInfo object returned has the following parameters:
 * @param {String} status This parameters indicates the status of the message index cache. The following values could be returned
 *    <ul>
 *    <li>NOT_INITIALIZED</li>
 *    <li>INITIALIZING</li>
 *	  <li>INITIALIZED</li>
 *    <li>ERROR</li>
 *    </ul>
 * @param {String} state This is an opaque string that denotes the current state of the mailbox in the platform.
 * @param {Number} messageCount Number of message indexes cached for the subscriber
 *
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessageIndexInfo method.
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
 * Enables an application to retrieve meta-data for one or more Subscriber Messages from the AT&T Messages environment.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} options.limit The number of messages to be returned:
 *
 * Valid Range: Min = 1, Max = 500
 *
 * If offset is defined, the number of messages defined in limit will be returned starting  with the first message defined by offset.
 * @param {String} [options.offset] Defines an index value at which the limit starts.
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.
 *
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessageList method.
 *
 *          getMessageList({
 *                  'accept' : 'application/json',
 *                  'limit' : 500 //Valid Range: Min = 1, Max = 500 // Should be integer
 *                  'offset' : '123' //Define an index value at which offset will start.
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
 * Enables an application to send messages on behalf of an AT&T subscriber. Each time the sendMessage method is invoked, a single message can be sent to one or more destination devices. Messages are processed synchronously and sent asynchronously to the destination.
 * @param {Object} options A JSON object containing the following properties:
 * @param {Object} options.body An object containing all of the parameters that a user needs to send a message on an AT&T mobile device. Valid parameters are:
 * @param {Array} options.body.Addresses The MSISDN of the recipient, or a comma separated list of MSISDNs for multiple recipients. For example: tel:6507038846,tel:6507038847.
 * @param {String} options.body.Subject The subject of the message.
 * @param {String} options.body.Text The text portion of the message. If the request is detected as MMS then the following character sets will be supported:
 * @param {Boolean} options.body.isGroup If set to true the message is sent as a group MMS message as compared to a Broadcase message when sending to multiple recipients 
 *
 *• ASCII
 *
 *• UTF-8
 *
 *• UTF-16
 *
 *• ISO-8859-1
 *
 * If the request is detected as SMS then the following character set will be supported:
 *
 *• ISO-8859-1
 *
 * Note: This data becomes mandatory if attachment(s) is NOT provided in the request.
 * @param {Array} options.attachments An array of JSON objects containing three key-value pairs, i.e. <i>{fileName:"Name of the file",fileType:"Type of the file",filePath:"Path of the file"}</i> The file can be image, audio ,video or text.
 * @param {String} options.contentType Specifies the format of the message content. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded

 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.
 *
 * <strong>Examples:</strong>
 *
 * <b>1.</b> The following example of the sendMessage method uses a contentType of 'application/json'.
 *
 *      sendMessage({
 *                   "body":{ "MessageRequest": {"Addresses": ["mail@mail.mail","mail@mail.mail","tel:xxxxxxxxxx"], "Text": "Hello world", "Subject": "Hi" ,"isGroup": false} },
 *                   "contentType" : "application/json",
 *                   "accept" : "application/json",
 *                   "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
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
 * <b>2.</b> The following example of the sendMessage method uses a contentType of 'application/xml'.
 *  
 *      sendMessage({
 *                    "body":"<MessageRequest>"+"\n"+"<Addresses>tel:xxxxxxxxxx,tel:xxxxxxxxxx,mail@mail.mail</Addresses>"+"\n"+"<Text>Hello world</Text>"+"\n"+"<Subject>Hi</Subject>"+"\n"+"</MessageRequest>",
 *                    "contentType" : "application/xml",
 *                    "accept" : "application/json",
 *                    "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
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
 * <b>3.</b> The following example of the sendMessage method uses a contentType of 'application/x-www-form-urlencoded'.
 *
 *      sendMessage({
 *                   "body":"Addresses=tel%3A%2Bxxxxxxxxxx&Addresses=tel%3A%2Bxxxxxxxxxx&Addresses=mail@mail.mail&Text=Hello&Subject=Hi&isGroup=false",
 *                   "contentType" : "application/x-www-form-urlencoded",
 *                   "accept" : "application/json",
 *                  "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
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
 * <i>Note: xxxxxxxxxx represents an AT&T wireless number</i>
 */


/**
 * @method updateMessage
 * This operation allows the developer to update the flags that are associated with a specific message. The developer passes in the messageId & flags
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.messageId Id of the message that is intended to be updated.
 * @param {Object} options.body An object containing all of the parameters that a user needs to update messages
 * @param {Object} options.body.message Container for flags that need to be updated
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 204 (No Content)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the updateMessage method.
 *
 *          updateMessage({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01',
 *					'body' : {'message': {'isUnread' : true} }
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
 * TThis operation allows the developer to update the flags that are associated with a collection of messages. The developer can pass in any number of messages
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Object} options.body An object containing all of the parameters that a user needs to update messages
 * @param {Object} options.body.message Container for flags that need to be updated (message Id & isUnread flag)
 * @param {String} options.body.message.messageId Message Id of the message that needs to be updated
 * @param {String} options.body.message.isUnread Desired value of the isUnread flag that the message will be updated to 
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 204 (No Content)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the updateMessages method.
 *
 *          updateMessages({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01',
 *					'body' : {'message': {'MessageId': 's01','isUnread' : true}, {'MessageId': 's03','isUnread' : false} }
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
 * @class ATT.OAuth <b>Introduction:</b>
 *
 * The AT&T OAuth 2.0 Authentication Management service provides a safe and secure way for AT&T subscribers to access AT&T network resources through a third-party application without the risk of compromising security. The OAuth service ensures that secure, sensitive, and private AT&T subscription related details are not exposed to the third-party application.
 *
 * OAuth authorization management is an open standard recognized as providing a strong protection to clients and applications. The OAuth service provides developers with a security model that allows them to obtain an authorization code and an access token. By acquiring an authorization code, a resource owner has authorized an application to access a protected resource on their behalf. The receipt of an access token enables an application to access a protected resource on behalf of a resource owner via the AT&T network.
 *
 * The AT&T OAuth 2.0 Authentication Management service allows third party applications access to the private resources of subscribers without requiring the end-user to provide credentials (such as username and password) to the third party application. An application that is implemented with Oauth provides a closer and more secure integration with the AT&T API Platform.
 *
 * <b>Methods:</b>
 *
 * 1) authorize
 *
 * 2) obtainEndUserAuthorization
 */
/**
 * @method obtainEndUserAuthorization
 * The Obtain End-User Authorization operation is the initial operation in the OAuth call flow. It is invoked by an application that requires subscriber authorization in order to obtain an OAuth access token. The application request for an OAuth access token is forwarded by redirecting the subscriber’s browser to the API Gateway.
 *
 * <b>Important Note:</b> Currently, this method call is only necessary and supported for applications attempting to consume the following APIs:
 *
 *
 * 1) In App Messaging from Mobile Number API
 *
 * @param {Object} options A JSON object containing the following properties :
 * @param {String} options.clientId The API Key that is assigned to the application when the developer creates an application account at https://devconnect-api.att.com.
 * @param {String} options.scope Specifies the services for which the application is requesting the end-user to provide consent. The value of the scope parameter is a comma delimited list containing one or more of the following values that represent the services that are in scope.
 *
 *
 * • In App Messaging from Mobile Number – IMMN
 * @param {String} [options.redirectUrl] The URL where the subscriber’s browser will be redirected following completion of the authorization process. If this parameter is not present in the request, the AT&T Gateway will use the value of provided OAuth Redirect URL that is provided by the developer in the AT&T API Platform console when the application is registered.
 * @param {Boolean} [options.bypass_onnetwork_auth] Forces a particular user authentication flow during authentication
 * @param {Boolean} [options.suppress_landing_page] Suppresses the display of the “switch user landing page” during a Get User Authorization request with a remember me cookie present on the device.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {String} <b>Specifies a query parameter that is included with the redirect_url parameter of the authorize method in the original OAuth request.</b>
 *
 * <strong>Example:</strong>
 * 
 * The following is an example of the obtainEndUserAuthorization method.
 *
 *      obtainEndUserAuthorization({
 *           'clientId' : 'API Key',
 *           'scope' : 'scope values',
 *           'redirectUrl' : 'redirect url',
 *			 'bypass_onnetwork_auth': true,
 *			 'suppress_landing_page' : false		
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
 * Authorizes an application so that it can use specific AT&T APIs.
 *
 * This method must be directly called using the ATT namespace as in the following example: <b>ATT.authorize('apiKey','secretKey','scope','grantType','oAuthCode')</b>
 *
 * When authorizing an application for use with the Location and In App Messaging APIs, the user must send their access key, secret key, scope, grantType, and OAuthCode.
 *
 * @param {String} accessKey The API Key that is assigned to the application when the developer creates an application account at https://devconnect-api.att.com.
 * @param {String} secretKey The Secret Key that is assigned to the application when the developer creates an application account at https://devconnect-api.att.com.
 * @param {String} scope A comma separated list of authScopes, that specify which APIs the app requires access to.
 * @param {String} grantType Specifies the mechanism used to obtain the access token. The following grantType values must be used for the following cases: Web-server client applications using the authorization code to obtain the access token must set this parameter value to authorization_code. Autonomous client applications that use just the API key and its secret to obtain the access token must set this parameter valueto client_credentials. When client applications of both types mentioned above) use the refresh_token to obtain a new access_token after the expiry of the initial access_token, this parameter value must be set to refresh_token.
 * @param {String} oAuthCode The authorization code. The oAuthCode is returned in the response value of the obtainEndUserAuthorization method. Currently, this parameter is only required when using the Location and IMMN APIs.
 *    <b>Example:</b>
 *
 * The following is an example of the authorize method.
 *
 *              ATT.authorize('apiKey','secretKey','scope','grantType','oAuthCode');
 */


/**
 * @class ATT.Speech <b>Introduction:</b>
 *
 * The Speech API enables authorized applications to transcribe speech (audio) to text. The developer can influence the results by passing a speech context in the request.
 *
 * <b>Description:</b>
 *
 *The Speech API is a service that accepts audio data and returns the text representation of that audio. The text output can then be processed by different speech contexts to produce text results that represent that speech context. Each speech context is tuned to produce results more suitable for a given scenario.
 *
 * <b>Methods:</b>
 *
 *1) speechToText
 *
 *2) speechToTextCustom
 *
 *3) textToSpeech
 *
 */

/**
 * @method speechToText
 * Returns a text translation of the specified audio file using the specified speech context. The audio file must have one of the following sets of constraints: 16 bit PCM WAV, single channel, 8 kHz sampling, or AMR (narrowband), 12.2 kbit/s, 8 kHz sampling.
 *
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} options.filePath Path of audio file that will to be translated to text (For Android,Path should be in this format : /mnt/sdcard/.../fileName.fileExtension).
 * @param {String} [options.transferEncoding] This header parameter is only required for a streaming request, and should be set to chunked.
 * @param {String} [options.xSpeechContext="Generic"] Specifies the speech context to be applied to the transcribed text. Valid values are:
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
 * If <b>TV</b> context is chosen, then the X-Arg parameter <b>Search</b> must be defined.
 * @param {String} options.contentType The content type of the request. Valid values are:
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
 *Note: the API Gateway shall not modify this header when passed onto the Speech enabler, except to remove white space in order to ensure consistent use of parameters.
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * @param {Number} [options.contentLength] <b>(IOS only).</b>This header parameter is only required for the <b>non-streaming request.</b>
 * @param {String} [options.contentLanguage="en-US"] Only Specifies the language of the submitted audio.  Only used when xSpeechContext parameter is set to “Generic”.  Choose one of the following two choices:
 * 
 *• "en-US" (English - United States)
 * 
 *• "es-US" (Spanish - United States)
 * @param {String} [options.xSpeechSubContext] Only used when xSpeechContext parameter is set to “Gaming”.
 * @param {String/Object} [options.xArgs] If a string is passed in xArgs should be a comma separated URL encoded list to define multiple name/value pairs.
 * Otherwise pass in a flat object of name/value pairs. If xArgs is an object then the values passed in will be URL encoded
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.
 *
 * <b>Example:</b>
 *
 * The following is an example of the speechToText method.
 *
 *      speechToText({
 *          'filePath':'Path of audio file'//In android,Path should be like : /mnt/sdcard/.../example.wav.
 *          'xSpeechContext' : 'Generic',
 *          'contentType' : 'audio/wav',
 *          'contentLength' : length,//For IOS only.
 *          'accept':'application/json'
 *          'contentLanguage': 'es-US'
 *      }, function(data) {
 *
 *          //success Callback
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
 
/**
 * @method textToSpeech
 * Returns an audio file in a particular voice and language for the text sent.
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters:
 * @param {String} options.accept Specifies the audio file type that has to be generated. These are following audio types that can be requested for audio generation: audio/amr, audio/amr-wb and audio/x-wav.
 * @param {String} options.contentType Specifies the format in which the content is being transmitted in the body. Following are the Content Types that are supported text/plain and application/ssml+xml.
 * @param {String} options.body Specifies the text content that needs to be converted to audio file.
 * @param {String} options.filePath Specifies the path where the audio file has to be stored after the text translation. The proper file extension (based on the “accept”) is added if one is not provided as part of the file path. (For the Android platform, the path should remove the "file://" protocol).
 * @param {String/Object} [options.xArg] This parameter exposes the properties through which the audio file generation can have few variations like changing the audio voice character, tempo of the audio file and volume of the audio file when generated. Acceptable values for this property are
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
 * If <b>VoiceName</b> to be specified in particular then this property has to be updated with the preset voice characters.
 *
 *• mike
 *
 *• crystal
 *
 *• rosa
 *
 *• alberto
 *
 * @param {String} [options.accept] Specifies the format of the audio file that is generated by this method including the following audio types: audio/amr, audio/amr-wb and audio/x-wav.
 * 
 * The acceptable values for this parameter are:
 *
 *• audio/wav
 *
 *• audio/amr
 *
 *• audio/amr-wb
 *
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} A JSON formatted object that contains the path of the audio file. The filepath returned with file name and extension is specified by the value of the accept parameter in the call to the textToSpeech method.
 *
 * <b>Example:</b>
 *
 * The following is an example for textToSpeech request method.
 *
 *		textToSpeech({
 *			"accept" :     "audio/wav",
 *			"contentType": "text/plain",
 *			"body":        text,
 *			"filePath":    filePath,
 *			"xArg":        "VoiceName=crystal"
 *
 *		}, function(data) {
 *			// success CallBack
 *		}, function(error) {
 *		    //failure Callback
 *		});
 *       
 */

