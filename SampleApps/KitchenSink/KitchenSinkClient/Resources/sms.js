"use strict";

//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.
// <module platform="commonjs" version="1.0.1">att</module>
var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var shortCode = Ti.App.Properties.getString('shortCode');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';
// some test datas.
var testMessage = 'Testing ATT SMS API';

var smsId = null;
//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

//Get util functions
var util = require('util'),
    forEach = util.forEach,
    copyObjTo = util.copyObjTo,
    deviceState = util.state.device,
    openPopUp = util.UI.createResponseWindow();
    
//Constants:
var smsConstant = {
    margin: 10,
    padding: 10,
    buttonHeight: deviceState.is.android ? undefined : 30,
    buttonWidth: '65%'
}

var mainWindow = Ti.UI.currentWindow;

mainWindow.addEventListener('android:back', function(e) {
	mainWindow.close();
});

var scrollView = Ti.UI.createScrollView({
    top: 0,
    layout:'vertical',
    height: Ti.UI.SIZE,
    left: smsConstant.margin, 
    right: smsConstant.margin,
});
mainWindow.add(scrollView);

var textNumber = util.UI.createNumberField({
    top: smsConstant.margin,
    height : deviceState.is.android ? undefined : 40,
    width: '100%',
    paddingLeft: smsConstant.padding,
    paddingRight: smsConstant.padding,
    borderColor : 'black',
    color : 'black',
    hintText : 'Enter phone number(s)'
});
scrollView.add(textNumber);

var responseTextArea = Ti.UI.createTextArea({
	height : 100,
	width: '100%',
	color : 'black',
	font: { //Correct default text area font size
	    fontSize: deviceState.is.android ? 18 : 16,
	},
	paddingLeft: smsConstant.padding,
    paddingRight: smsConstant.padding,
	borderColor : 'black',
	hintText : 'Enter Your Message here'
	
});
scrollView.add(util.UI.createLabelView('Message', responseTextArea));

var sendSMSButton = Ti.UI.createButton({
	title : 'Send SMS',
	top: 35,
	height : smsConstant.buttonHeight,
	width : smsConstant.buttonWidth
});
//On Button Click user call method 'SendSMS'
sendSMSButton.addEventListener('click', function() {
	Ti.API.info('Send SMS Button Clicked.');
	
	var address = util.formatNumberStr(textNumber.value);
    if(!address) return;
    
    if(address.length === 1) address = address[0];
	
	if (responseTextArea.value === '') {
		responseTextArea.value = testMessage;
	}
	/**
	 *@param body- Will contain two values "message" and "address"
	 *@param contentType- format in which data is to be sent
	 * Example:
	 *  contentType @ application/json
	 'body':{ "message":"Test AT&T Sms","address":"tel:+XXXXXXXXXX,tel:XXXXXXXXXX"}
	 * contentType @ application/xml
	 'body':"<outboundSmsRequest><address>tel:XXXXXXXXXX,tel:XXXXXXXXXX</address><message>Test XML</message></outboundSmsRequest>"
	 * contentType @ application/x-www-form-urlencoded
	 'body':"address=tel%3AXXXXXXXXXX&message=URL%20ENCODED"
	 **/
	attAPIs.ATT.SMS.sendSMS({
		'accept' : 'application/json',
		'contentType' : 'application/json',
		'body' : {
			"message" : responseTextArea.value,
			"address" : address,
			//"notifyDeliveryStatus": true
		}

	}, function(data) {
		Ti.API.info('Success Callback:' + data);
		//alert('smsId: '+smsId);
		openPopUp(data);
		try {
		    smsId = JSON.parse(data).outboundSMSResponse.messageId;
        } catch(e) {
            Ti.API.error('Invalid response data: ' + data);
        }
	}, function(error) {
		Ti.API.error('Error Callback:' + error);
		openPopUp(error, true);
	});
});

scrollView.add(sendSMSButton);

// SMS DeliveryStatus Api Block
var buttonDeliveryStatus = Ti.UI.createButton({
	title : 'GET SMS DeliveryStatus',
	top: smsConstant.margin,
	height : smsConstant.buttonHeight,
    width : smsConstant.buttonWidth
});
buttonDeliveryStatus.addEventListener('click', function() {
	Ti.API.info('Get SMS Delivery Status Button Clicked.');
	//alert('smsId: '+smsId);
	if(!smsId) {
        alert("An SMS must be successfully sent before you can recieve it's status");
        return;
    }
	
	attAPIs.ATT.SMS.getSMSDeliveryStatus({
		'smsId' : smsId,
		'accept' : 'application/json'
	}, function(data) {
		Ti.API.info('Success Callback:' + data);
		openPopUp(data);

	}, function(error) {
		Ti.API.error('Error Callback: ' + error);
		openPopUp(error, true);
	});
});

scrollView.add(buttonDeliveryStatus);

var getSMS = Ti.UI.createButton({
	title : 'GET SMS',
	top: smsConstant.margin,
	height : smsConstant.buttonHeight,
    width : smsConstant.buttonWidth
});
//Note: Send Sms from AT&T device to the shortCode
getSMS.addEventListener('click', function() {
	Ti.API.info('Get SMS Button Clicked.');
	attAPIs.ATT.SMS.getSMS({
		'accept' : 'application/json',
		'registrationId' : shortCode
	}, function(data) {
		Ti.API.info('Success Callback:' + data);
		openPopUp(data);
	}, function(error) {
		Ti.API.error('Error Callback:' + error);
		openPopUp(error, true);
	});
});

scrollView.add(getSMS);

var shortCodeLabel = Ti.UI.createLabel({
	text : 'The Get SMS operation gets all messages for the registrationID (ShortCode:' + shortCode + ') that are stored on the AT&T network resource at the time the method is invoked.',
	color : 'black',
	top: 15,
	font : { fontSize : 10 }
});
scrollView.add(shortCodeLabel);
scrollView.add(util.UI.createSpacer());

