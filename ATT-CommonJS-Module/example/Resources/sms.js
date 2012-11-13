//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var shortCode = Ti.App.Properties.getString('shortCode');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';
// some test datas.
var testTelNumber = '6504549816';
var testMessage = 'Testing ATT SMS API';

var smsId = null;
//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

var mainWindow = Ti.UI.currentWindow;

mainWindow.addEventListener('android:back', function(e) {
	mainWindow.close();
});

var responseWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response'
});

responseWindow.addEventListener('android:back', function(e) {
	responseWindow.close();
});

var modalWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

modalWinRightNavButton.addEventListener('click', function() {"use strict";
	responseWindow.close();
});
// //For Iphone Only.
if (Titanium.Platform.osname !== "android") {
	responseWindow.setRightNavButton(modalWinRightNavButton);
}

var responseLable = Ti.UI.createLabel({
	top : 20,
	left : 5,
	right : 5,
	height : 'auto',
	color : 'black'
});

var responseTextArea = Ti.UI.createTextArea({
	top : 10,
	left : 10,
	height : Ti.UI.Android ? "100dp" : 100,
	right : 10,
	color : 'black',
	textAlign : 'left',
	borderColor : 'black',
	editable : true,
	clearOnEdit : true,
	isFirstClick : true,
	visible : false
});

responseTextArea.addEventListener('longpress', function() {"use strict";
	responseTextArea.value = '';
});

responseTextArea.addEventListener('focus', function() {"use strict";
	if (responseTextArea.isFirstClick) {
		responseTextArea.value = '';
	}
	responseTextArea.isFirstClick = false;
});

responseTextArea.addEventListener('return', function() {"use strict";

	if (responseTextArea.value === '') {
		responseTextArea.value = 'Enter Your Message here';
		responseTextArea.isFirstClick = true;
	}
});
responseWindow.add(responseLable);
mainWindow.add(responseTextArea);
function openPopUp(data) {
	responseLable.text = null;
	responseLable.text = 'RESPONSE :' + data;
	responseWindow.open();
}

responseTextArea.visible = true;
var textNumber = Ti.UI.createTextField({
	top : 120,
	right : 10,
	left : 10,
	height : Ti.UI.Android ? "40dp" : 40,
	borderColor : 'black',
	color : 'black',
	hintText : 'Enter phone number(s)'
});
responseTextArea.clearOnEdit = true;
responseTextArea.value = 'Enter Your Message here';

var sendSMSButton = Ti.UI.createButton({
	title : 'Send SMS',
	top : 200,
	height : Ti.UI.Android ? "30dp" : 30,
});
//On Button Click user call method 'SendSMS'
sendSMSButton.addEventListener('click', function() {"use strict";
	Ti.API.info('Send SMS Button Clicked.');
	// checks to assign default test data if data not entered by user.
	var i, AddString, addArr;
	var phoneNumber = textNumber.value;
	if (phoneNumber.length > 0) {
		addArr = textNumber.value.toString().split(',');
		if (addArr.length === 1) {
			AddString = 'tel:' + addArr[0];
		} else {
			AddString = [];
			for ( i = 0; i < addArr.length; i = i + 1) {
				AddString.push('tel:' + addArr[i]);
			}
		}
	} else {

		textNumber.value = testTelNumber;
		AddString = 'tel:' + testTelNumber;
	}
	if (responseTextArea.value === 'Enter Your Message here' || responseTextArea.value === '') {
		responseTextArea.value = testMessage;
	}
	/**
	 *@param body- Will contain two values Message and Address
	 *@param contentType- format in which data is to be sent
	 * Example:
	 *  contentType @ application/json
	 'body':{ "Message":"Test AT&T Sms","Address":"tel:+XXXXXXXXXX,tel:XXXXXXXXXX"}
	 * contentType @ application/xml
	 'body':"<SmsRequest><Address>tel:XXXXXXXXXX,tel:XXXXXXXXXX</Address><Message>Test XML</Message></SmsRequest>"
	 * contentType @ application/x-www-form-urlencoded
	 'body':"Address=tel%3AXXXXXXXXXX&Message=URL%20ENCODED"
	 **/
	attAPIs.ATT.SMS.sendSMS({
		'accept' : 'application/json',
		'contentType' : 'application/json',
		'body' : {
			"Message" : responseTextArea.value,
			"Address" : AddString
		}

	}, function(data) {
		Ti.API.info('Success Callback:' + data);
		openPopUp(data);
		smsId = JSON.parse(data).Id;
		
	}, function(error) {
		Ti.API.error('Error Callback:' + error);
		openPopUp(JSON.stringify(error));
	});
});

mainWindow.add(sendSMSButton);
mainWindow.add(textNumber);

// SMS DeliveryStatus Api Block
var buttonDeliveryStatus = Ti.UI.createButton({
	title : 'GET SMS DeliveryStatus',
	top : 240,
	height : Ti.UI.Android ? "30dp" : 30,
});

buttonDeliveryStatus.addEventListener('click', function() {"use strict";
	Ti.API.info('Get SMS Delivery Status Button Clicked.');
	attAPIs.ATT.SMS.getSMSDeliveryStatus({
		'smsId' : smsId,
		'accept' : 'application/json'

	}, function(data) {
		Ti.API.info('Success Callback:' + data);
		openPopUp(data);

	}, function(error) {
		Ti.API.error('Error Callback: ' + error);
		openPopUp(JSON.stringify(error));
	});
});

mainWindow.add(buttonDeliveryStatus);

var getSMS = Ti.UI.createButton({
	title : 'GET SMS',
	top : 280,
	height : Ti.UI.Android ? "30dp" : 30,
});
//Note: Send Sms from AT&T device to the shortCode
getSMS.addEventListener('click', function() {"use strict";
	Ti.API.info('Get SMS Button Clicked.');
	attAPIs.ATT.SMS.getSMS({
		'accept' : 'application/json',
		'registrationId' : shortCode
	}, function(data) {
		Ti.API.info('Success Callback:' + data);
		openPopUp(data);
	}, function(error) {
		Ti.API.error('Error Callback:' + error);
		openPopUp(JSON.stringify(error));
	});
});

mainWindow.add(getSMS);

var shortCodeLabel = Ti.UI.createLabel({
	text : 'The Get SMS operation gets all messages for the registrationID (ShortCode:' + shortCode + ') that are stored on the AT&T network resource at the time the method is invoked.',
	top : 340,
	color : 'black',
	left : 3,
	font : {
		fontSize : 10
	}
});
mainWindow.add(shortCodeLabel);

