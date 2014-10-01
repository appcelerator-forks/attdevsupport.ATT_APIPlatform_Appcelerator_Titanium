//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('authScope');
var redirectUrl = Ti.App.Properties.getString('redirectUrl');

var util = require('util');

var mailboxState,firstMsgId;
/*
// some test datas.
var testTelNumber = "6504549816";
var testMessageSubject = 'Testing ATT In App Messaging API Subject';
var testMessageText = 'Testing ATT In App Messaging API Text';

var sendMessageWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response'
});

if (Titanium.Platform.osname !== "android") {
	var sendMessageNav = Ti.UI.iOS.createNavigationWindow({
	    modal: true,
		window: responseWindow
	});
}
sendMessageWindow.addEventListener('android:back', function(e) {'use strict';
	responseWindow.close();
});

var sendMessageWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

sendMessageRightNavButton.addEventListener('click', function() {"use strict";
	sendMessageNav.close();
});

// //For Iphone Only.
if (Titanium.Platform.osname !== "android") {
	sendMessageWindow.setRightNavButton(responseWinRightNavButton);
}
*/
var mainWindow = Ti.UI.currentWindow;

mainWindow.addEventListener('android:back', function(e) {'use strict';
	mainWindow.close();
});


var responseWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response'
});

if (Titanium.Platform.osname !== "android") {
	var responseNav = Ti.UI.iOS.createNavigationWindow({
	    modal: true,
		window: responseWindow
	});
}
responseWindow.addEventListener('android:back', function(e) {'use strict';
	responseWindow.close();
});

var responseWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

responseWinRightNavButton.addEventListener('click', function() {"use strict";
	responseNav.close();
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

function openPopUp(data) {'use strict';
	responseLable.text = null;
	responseLable.text = 'RESPONSE :' + data;
	if (Titanium.Platform.osname !== "android") {
		responseNav.open();
	}
	else {
		responseWindow.open();
	}
}



var sendMessageBtn = Ti.UI.createButton({
	title : 'Send Message',
	top : Ti.UI.Android ? "80dp" : 40,
	height : Ti.UI.Android ? "35dp" : 30
});
var createMessageIndexBtn = Ti.UI.createButton({
	title : 'Create Message Index',
	top : Ti.UI.Android ? "120dp" : 80,
	height : Ti.UI.Android ? "35dp" : 30
});

var getIndexInfoBtn = Ti.UI.createButton({
	title : 'Get Message Index Info',
	top : Ti.UI.Android ? "160dp" : 120,
	height : Ti.UI.Android ? "35dp" : 30
});
var getMessageListBtn = Ti.UI.createButton({
	title : 'Get Message List',
	top : Ti.UI.Android ? "200dp" : 160,
	height : Ti.UI.Android ? "35dp" : 30
});
var getMessageDeltaBtn = Ti.UI.createButton({
	title : 'Get Message Delta',
	top : Ti.UI.Android ? "240dp" : 200,
	height : Ti.UI.Android ? "35dp" : 30
});

var msgIdBox = Ti.UI.createTextField({
	top : Ti.UI.Android ? "280dp" : 240,
	right : 10,
	left : 10,
	height : Ti.UI.Android ? "40dp" : 40,
	color : 'black',
	borderColor : 'black',
	hintText : 'Enter messageID'
});

var getMessageBtn = Ti.UI.createButton({
	title : 'Get Message',
	left: 90,
	top : Ti.UI.Android ? "320dp" : 280,
	height : Ti.UI.Android ? "35dp" : 30
});
var deleteMessageBtn = Ti.UI.createButton({
	title : 'Delete',
	top : Ti.UI.Android ? "320dp" : 280,
	left:10,
	height : Ti.UI.Android ? "35dp" : 30
});

getMessageListBtn.addEventListener('click', function() {
	Ti.API.info('Get Message List Button Clicked.');
	authorize('getMessageList');
});
createMessageIndexBtn.addEventListener('click', function() {
	Ti.API.info('Get Message List Button Clicked.');
	authorize('createMessageIndex');
});

getMessageDeltaBtn.addEventListener('click', function() {
	Ti.API.info('Get Message List Button Clicked.');
	authorize('getMessageDelta');
});

getIndexInfoBtn.addEventListener('click', function() {
	Ti.API.info('Get Message List Button Clicked.');
	authorize('getMessageIndexInfo');
});
deleteMessageBtn.addEventListener('click', function() {
	Ti.API.info('Get immn Message Content Button Clicked.');
	authorize('deleteMessage');
});
getMessageBtn.addEventListener('click', function() {
	Ti.API.info('Get Message button clicked');
	authorize('getMessage');
});
sendMessageBtn.addEventListener('click', function() {
	Ti.API.info('Get immn Message Content Button Clicked.');
	var sendMessageWindow = util.makeWindow("sendInAppMessage.js","Send Message");
	sendMessageWindow.open();
});


mainWindow.add(sendMessageBtn);
mainWindow.add(createMessageIndexBtn);
mainWindow.add(getIndexInfoBtn);
mainWindow.add(getMessageListBtn);
mainWindow.add(getMessageDeltaBtn);
mainWindow.add(getMessageBtn);
mainWindow.add(deleteMessageBtn);
mainWindow.add(msgIdBox);

function authorize(type) {
    function runTypeFunc() {
        switch(type)
        {
            case 'sendMessage':sendMessage();
            break;
            case 'createMessageIndex':createMessageIndex();
            break;
            case 'getMessageIndexInfo':getMessageIndexInfo();
            break;
            case 'getMessageList':getMessageList();
            break;
            case 'getMessageDelta':getMessageDelta();
            break;
            case 'getMessage':getMessage();
            break;
            case 'getcontent': getMessageContent();
            break;
            case 'deleteMessage': deleteMessage();
            break;
        }
    }
	
	if(attAPIs.ATT.getCachedUserAuthToken()) {
	    runTypeFunc();
	} else {
	    //Get the user authorization URI
		attAPIs.ATT.OAuth.obtainEndUserAuthorization({
            clientId: accessKey,
            scope: scope,
            redirectUrl: redirectUrl,
            bypass_onnetwork_auth : Ti.App.Properties.getBool('bypass_onnetwork_auth',false),
            suppress_landing_page : Ti.App.Properties.getBool('suppress_landing_page',false)
        }, function(resp) {
            //Create a webview to take the user through user authorization and get the auth code
            util.UI.createGetAuthCodeView(mainWindow, JSON.parse(resp).uri, redirectUrl, function(resp) { //Success
                var authCode = resp.code;
                var grantType = 'authorization_code';
                attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType, authCode);
                
                runTypeFunc();
            }, 
            function(errorResp) { //User Auth Error
                Ti.API.error('User Auth Error: ' + JSON.stringify(errorResp));
            });
        }, function(errorResp) { //Get User Auth URI Error
            Ti.API.error('Get User Auth URI Error: ' + errorResp);
        });
	}
}

// some test datas.
var testTelNumber = "6504549816";
var testMessageSubject = 'Testing ATT In App Messaging API Subject';
var testMessageText = 'Testing ATT In App Messaging API Text';


/*var textNumber = Ti.UI.createTextField({
	top : 20,
	right : 10,
	left : 10,
	height : Ti.UI.Android ? "40dp" : 40,
	color : 'black',
	borderColor : 'black',
	hintText : 'Enter phone number(s)'
});
var textSubject = Ti.UI.createTextField({
	top : 70,
	right : 10,
	left : 10,
	height : Ti.UI.Android ? "40dp" : 40,
	color : 'black',
	borderColor : 'black',
	hintText : 'Enter subject here'
});
var text = Ti.UI.createTextField({
	top : 115,
	right : 10,
	left : 10,
	height : Ti.UI.Android ? "40dp" : 40,
	color : 'black',
	borderColor : 'black',
	hintText : 'Enter text here'
});
var GetAttachment = Ti.UI.createButton({
	title : 'Attachment',
	top : Ti.UI.Android ? "300dp" : 260,
	height : Ti.UI.Android ? "35dp" : 30
});
var SendMessageButton = Ti.UI.createButton({
	title : 'Send Message',
	top : Ti.UI.Android ? "340dp" : 300,
	height : Ti.UI.Android ? "35dp" : 30
});

var dispAttachment = Ti.UI.createScrollView({
	top : 170,
	left : 0,
	height : Ti.UI.Android ? "85dp" : 85,
	width : Ti.UI.FILL,
	layout : 'horizontal'
});
var fileArray = [], savedFile;
GetAttachment.addEventListener('click', function(e) {
	Ti.API.info('Attachment Button Clicked.');
	Titanium.Media.openPhotoGallery({
		success : function(event) {
			Ti.API.debug('Titanium Media OpenPhotoGallery Success Callback.');
			var image = event.media;
			var fileName = new Date().getTime() + "image.jpg";
			var file;
			if (Ti.Platform.name !== 'android') {
				file = Titanium.Filesystem.applicationDataDirectory + "/" + fileName;
			} else {
				file = Titanium.Filesystem.externalStorageDirectory + "/" + fileName;
			}
			savedFile = Titanium.Filesystem.getFile(file);
			if (!savedFile.exists()) {
				savedFile.write(event.media);
			}
			var firstFile;
			if (Ti.Platform.name !== 'android') {
				firstFile = {
					'fileName' : fileName,
					'fileType' : "image/png",
					'fileObject' : image
				};
			} else {
				firstFile = {
					'fileName' : fileName,
					'fileType' : "image/jpg",
					'filePath' : 'mnt/sdcard/' + Ti.App.id + '/' + fileName
				};
			}
			fileArray.push(firstFile);

			var picView = Ti.UI.createImageView({
				top : 8,
				left : 10,
				height : 65,
				width : 65,
				borderColor : 'black',
				image : event.media
			});

			dispAttachment.add(picView);
			
		},
		error : function(e) {
			Ti.API.error('Titanium Media OpenPhotoGallery Error Callback.' + JSON.stringify(e));
		}
	});
});

SendMessageButton.addEventListener('click', function() {
	Ti.API.info('Send IAM Msg Button Clicked.');
	authorize(sendMessage);

});
sendMessageWindow.add(textNumber);
sendMessageWindow.add(textSubject);
sendMessageWindow.add(text);
sendMessageWindow.add(GetAttachment);
sendMessageWindow.add(immnSendMessageButton);
sendMessageWindow.add(dispAttachment);

*/

function sendMessage()
{	
	var i, AddString = [], addArr;
	var phoneNumber = textNumber.value;
	if (phoneNumber.length > 0) {
		addArr = textNumber.value.toString().split(',');
		for ( i = 0; i < addArr.length; i = i + 1) {
			if(addArr[i].indexOf('@') >= 0) { //Assume it's an email
			    AddString.push("email:" + addArr[i]);
			} else if(addArr[i].length <= 8) {
    			AddString.push("short:" + addArr[i]);
            } else {
           		AddString.push("tel:" + addArr[i]);
            }
            
		}
	} else {
		textNumber.value = testTelNumber;
		AddString.push("tel:" + testTelNumber);
	}
	if (textSubject.value === 'Enter subject here' || textSubject.value === '') {
		textSubject.value = testMessageSubject;
	}
	if (text.value === 'Enter text here' || text.value === '') {
		text.value = testMessageText;
	}
	/**
	 *@param body- Will contain three values Addresses,Subject and Text
	 *@param contentType- format in which data is to be sent
	 * Example:
	 *  contentType @ application/json
	 *  "body":{"Addresses" :"tel:XXXXXXXXXX", "Subject" : "Test IMMN JSON", "Text" : "TEST" },
	 * contentType @ application/xml
	 "body":"<MessageRequest> <Addresses>tel:XXXXXXXXXX</Addresses> <Text>TEST</Text> <Subject>Test IMMN XML</Subject></MessageRequest>",
	 * contentType @ application/x-www-form-urlencoded
	 "body":"Addresses=tel%3A%2BXXXXXXXXXX&Text=TEST& Subject=TestIMMNURL",
	 **/

	//@param args- is send as first parameter containing body along with attachments
	var args = {
		"body" : { "body" :{
			"addresses" : AddString,
			"subject" : textSubject.value,
			"text" : text.value
		}},
		"contentType" : "application/json",
		"Accept" : "application/json",
		"attachments" : fileArray
	};
	
	attAPIs.ATT.InAppMessaging.sendMessage(args, function(data) {
		responseLable.text = null;
		Ti.API.info('Success Callback:' + data);
		if (args.accept === "application/json") {
			responseLable.text = 'RESPONSE :' + JSON.stringify(data);
		} else {
			responseLable.text = 'RESPONSE :' + data;
		}
		if (Titanium.Platform.osname !== "android") {
		responseNav.open();
		}
		else {
		responseWindow.open();
		}
		
		for(cnt=(dispAttachment.children.length-1);cnt>=0;cnt--){
			dispAttachment.remove(dispAttachment.children[cnt]);
		}
		
		fileArray=[];
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	});
}



var mmsMessage = null;

function getMessageList()
{
	
	attAPIs.ATT.InAppMessaging.getMessageList({
		'accept' : 'application/json',
		'limit' : 20 //Valid Range: Min = 1, Max = 500 // Should be integer
	}, function(data) {
		//Get id of first message (To use in Delete,update,get message)
		data =JSON.parse(data);
		mailboxState = data.messageList.state;
		if(data.messageList.messages.length>0) {
			firstMsgId =  data.messageList.messages[0].messageId;
			msgIdBox.value = firstMsgId;
		}
		responseLable.text = null;
		responseLable.text = 'RESPONSE :' + JSON.stringify(data);
		if (Titanium.Platform.osname !== "android") {
			responseNav.open();
		}
		else {
			responseWindow.open();
		}
		
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	
	});
}

function getMessageContent() {
	if(!mmsMessage) {
	    alert('Get content headers then this method will display the first mms attachment from the messages');
	    return;
	}
	
	attAPIs.ATT.IMMN.getMessageContent({
		'messageId' : mmsMessage.MessageId,
		'partNumber' : mmsMessage.MmsContent[0].PartNumber
	}, function(data) {
		var contentType = mmsMessage.MmsContent[0].ContentType;
		Ti.API.info('Success Callback Length:' + data.length + 'Mime Type: ' + contentType);
		responseLable.text = null;
		var text = 'RESPONSE Is:'
                 + '\nLength: ' + data.length
                 + '\nMime Type: ' + contentType;
		
		if(contentType && contentType.toLowerCase().indexOf('text') >= 0) {
		    text += '\nData: ' + data;
		}
		responseLable.text = text;
		if (Titanium.Platform.osname !== "android") {
		responseNav.open();
		}
		else {
		responseWindow.open();
		}
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	});
}

function createMessageIndex() {
	
	attAPIs.ATT.InAppMessaging.createMessageIndex({
		'accept' : 'application/json'
	}, function(data) {
		alert("Message Index Created");
		responseLable.text = null;
		Ti.API.info('Success Callback:' + data);
		/*if (args.accept === "application/json") {
			responseLable.text = 'RESPONSE :' + JSON.stringify(data);
		} else {
			responseLable.text = 'RESPONSE :' + data;
		}
		if (Titanium.Platform.osname !== "android") {
	 		responseNav.open();
		}
		else {
			responseWindow.open();
		}*/
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	});
	
}

function getMessageIndexInfo() {
	
	
	attAPIs.ATT.InAppMessaging.getMessageIndexInfo({
		'accept' : 'application/json'
	}, function(data) {
		//alert(data.messageIndexInfo.status);
		responseLable.text = null;
		Ti.API.info('Success Callback:' + data);
		
			responseLable.text = 'RESPONSE :' + JSON.stringify(data);
		
		if (Titanium.Platform.osname !== "android") {
	 		responseNav.open();
		}
		else {
			responseWindow.open();
		}
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	});

	
}

function getMessageDelta() {
		attAPIs.ATT.InAppMessaging.getMessagesDelta({
		'contentType' : "application/json",
		'state'  : mailboxState
	}, function(data) {
		responseLable.text = null;
		Ti.API.info('Success Callback:' + data);
		if (args.accept === "application/json") {
			responseLable.text = 'RESPONSE :' + JSON.stringify(data);
		} else {
			responseLable.text = 'RESPONSE :' + data;
		}
		if (Titanium.Platform.osname !== "android") {
	 		responseNav.open();
		}
		else {
			responseWindow.open();
		}
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	});

}
function getMessage() {
	attAPIs.ATT.InAppMessaging.getMessage({
		'accept' : 'application/json',
		'messageId' : msgIdBox.value
	}, function(data) {
		responseLable.text = null;
		Ti.API.info('Success Callback:' + data);
		//isUnread= data.message.isUnread;
			responseLable.text = 'RESPONSE :' + JSON.stringify(data);
		if (Titanium.Platform.osname !== "android") {
	 		responseNav.open();
		}
		else {
			responseWindow.open();
		}
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	});

	
}
function deleteMessage() {
	attAPIs.ATT.InAppMessaging.deleteMessage({
		'accept' : 'application/json',
		'messageId' : msgIdBox.value
	}, function(data) {
		Ti.API.info('Success Callback:' + data);
		alert("Message: "+ msgIdBox.value + " Successfully deleted");
		msgIdBox.value ='';
		firstMsgId = null;
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	});	
}

function sendMessage() {
	
}