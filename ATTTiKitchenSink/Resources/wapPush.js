//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';

// some test datas.
var testTelNumber = '6508638216';
var testMessage = 'Testing ATT SendWapPush API';

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

var responseWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

responseWinRightNavButton.addEventListener('click', function() {"use strict";
	responseWindow.close();
});
// //For Iphone Only.
if (Titanium.Platform.osname !== "android") {
	responseWindow.setRightNavButton(responseWinRightNavButton);
}

var responseLable = Ti.UI.createLabel({
	top : 20,
	left : 5,
	right : 5,
	height : 'auto',
	color : 'black'
});

var responseView = Ti.UI.createScrollView({
});
responseView.add(responseLable);
responseWindow.add(responseView);

function openPopUp(data) {
	responseLable.text = null;
	responseLable.text = 'RESPONSE :' + data;
	responseWindow.open();
}

// WapPush Api

var textNumber = Ti.UI.createTextField({
	top : 120,
	right : 10,
	left : 10,
	height : Ti.UI.Android ? "40dp" : 40,
	borderColor : 'black',
	color : 'black',
	hintText : 'Enter phone number'
});

var textSubject = Ti.UI.createTextField({
	top : 170,
	right : 10,
	left : 10,
	height : Ti.UI.Android ? "40dp" : 40,
	color : 'black',
	borderColor : 'black',
	hintText : 'Enter message here'
});

var sendPush = Ti.UI.createButton({
	title : 'Send Wap Push',
	top : 250
});

sendPush.addEventListener('click', function() {"use strict";
	Ti.API.info('Send Wap Push Button Clicked.');
	var i, AddString = null, addArr;
	var phoneNumber = textNumber.value;
	if (phoneNumber.length > 0) {
		addArr = textNumber.value.toString().split(',');
		for ( i = 0; i < addArr.length; i = i + 1) {
			if (AddString === null) {
				AddString = 'tel:' + addArr[i];
			} else
				AddString = AddString + ',' + 'tel:' + addArr[i]
		}
	} else {
		AddString = 'tel:' + testTelNumber;
		textNumber.value = testTelNumber;
	}

	if (textSubject.value === 'Enter message here' || textSubject.value === '') {
		textSubject.value = testMessage;
	}
	var xml = "";
	xml += "Content-Disposition: form-data; name=\"PushContent\"\n";
	xml += "Content-Type: text/vnd.wap.si\n";
	xml += "Content-Length: 20\n";
	xml += "X-Wap-Application-Id: x-wap-application:wml.ua\n\n";
	xml += "<?xml version=\"1.0\"?>\n";
	xml += "<!DOCTYPE si PUBLIC \"-//WAPFORUM//DTD SI 1.0//EN\" \"http://www.wapforum.org/DTD/si.dtd\">\n";
	xml += "<si>";
	xml += "<indication href=\"" + "https://api.att.com/" + "\" action=\"signal-medium\" si-id=\"6532\" >\n";
	xml += textSubject.value + "\n";

	xml += "</indication>\n";
	xml += "</si>\n";
	/**
	 *@param body- Will contain one value address
	 *@param contentType- format in which data is to be sent
	 *@param data- format in which data is to be sent
	 * Example:
	 *  contentType @ application/json
	 *  "body":{"address" :"tel:XXXXXXXXXX"},
	 *  contentType @ application/xml
	 'body': '<wapPushRequest> <address>tel:XXXXXXXXXX</address> </wapPushRequest>'
	 *  contentType @ application/x-www-form-urlencoded
	 "body":"address=tel%3AXXXXXXXXXX",
	 **/

	//@param wapArgs- is send as first parameter containing data along with contentType
	var wapArgs = {
		body : {
			"address" : AddString
		},
		"data" : xml,
		"contentType" : "application/json",
		"accept" : "application/json"
	}

	attAPIs.ATT.WAPPush.sendWAPPush(wapArgs, function(data) {
		Ti.API.info('Success Callback: ' + JSON.stringify(data));
		responseLable.text = null;
		if (wapArgs.accept === "application/xml") {
			responseLable.text = 'RESPONSE :' + data;
		} else {
			responseLable.text = 'RESPONSE :' + JSON.stringify(data);
		}
		responseWindow.open();
	}, function(error) {
		Ti.API.error('Error Callback: ' + error);
		openPopUp(JSON.stringify(error));
	});
});

mainWindow.add(textNumber);
mainWindow.add(textSubject);
mainWindow.add(sendPush);

