//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('authScope');
var redirectUrl = Ti.App.Properties.getString('redirectUrl');


// some test datas.
var testTelNumber = "6504549816";
var testMessageSubject = 'Testing ATT In App Messaging API Subject';
var testMessageText = 'Testing ATT In App Messaging API Text';

var mainWindow = Ti.UI.currentWindow;

mainWindow.addEventListener('android:back', function(e) {'use strict';
	mainWindow.close();
});

var responseWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response'
});

responseWindow.addEventListener('android:back', function(e) {'use strict';
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

function openPopUp(data) {'use strict';
	responseLable.text = null;
	responseLable.text = 'RESPONSE :' + data;
	responseWindow.open();
}


var textNumber = Ti.UI.createTextField({
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
	height : Ti.UI.Android ? "30dp" : 30
});
var immnSendMessageButton = Ti.UI.createButton({
	title : 'Send Message',
	top : Ti.UI.Android ? "340dp" : 300,
	height : Ti.UI.Android ? "30dp" : 30
});
var GetimmnMessageHeaderBtn = Ti.UI.createButton({
	title : 'Get Message Headers',
	top : Ti.UI.Android ? "380dp" : 340,
	height : Ti.UI.Android ? "30dp" : 30
});
var GetimmnMessageContentBtn = Ti.UI.createButton({
	title : 'Get Message Content',
	top : Ti.UI.Android ? "420dp" : 380,
	height : Ti.UI.Android ? "30dp" : 30
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

immnSendMessageButton.addEventListener('click', function() {
	Ti.API.info('Send IMMN Msg Button Clicked.');
	authorize('sendmessage');

});

GetimmnMessageHeaderBtn.addEventListener('click', function() {
	Ti.API.info('Get immn Message Header Button Clicked.');
	authorize('getheader');

});

GetimmnMessageContentBtn.addEventListener('click', function() {
	Ti.API.info('Get immn Message Content Button Clicked.');
	authorize('getcontent');
});

mainWindow.add(textNumber);
mainWindow.add(textSubject);
mainWindow.add(text);
mainWindow.add(GetAttachment);
mainWindow.add(immnSendMessageButton);
mainWindow.add(GetimmnMessageHeaderBtn);
mainWindow.add(GetimmnMessageContentBtn);
mainWindow.add(dispAttachment);


function authorize(type) {
    function runTypeFunc() {
        switch(type)
        {
            case 'sendmessage':sendMessage();
            break;
            case 'getheader':getMessageHeaders();
            break;
            case 'getcontent': getMessageContent();
            break;
        }
    }
	
	if(Ti.App.attTitaniumModuleAuthAccessToken) {
	    runTypeFunc();
	} else {
		var isCode = true;
		
		var v = Ti.UI.createWebView({
			top : 0,
			height : Ti.UI.Android ? Titanium.Platform.displayCaps.platformHeight : '100%',
			width : Ti.UI.Android ? Titanium.Platform.displayCaps.platformWidth : '100%',
			left : 0,
			url : 'https://auth-api.att.com/user/login?client_id=' + accessKey + '&scope=' + scope + '&redirect_url=' + redirectUrl
		});
		
		v.addEventListener('load', function(e) {
            var url = v.url;
            if (url.indexOf(redirectUrl) !== -1 && isCode === true) {
                isCode = false;
                var qs = url.split('?')[1].split('#')[0];
                var qsObj = {};
                qs.split('&').forEach(function(param) {
                    var paramParts = param.split('=');
                    qsObj[decodeURIComponent(paramParts[0])] = decodeURIComponent(paramParts[1]);
                });
                
                var immnAuthCode = qsObj['code'];
                grantType = 'authorization_code';
                attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType, immnAuthCode);
                mainWindow.remove(v);
                
                runTypeFunc();
            }
        });
		mainWindow.add(v);
	}
}



function sendMessage()
{
	var i, AddString = [], addArr;
	var phoneNumber = textNumber.value;
	if (phoneNumber.length > 0) {
		addArr = textNumber.value.toString().split(',');
		for ( i = 0; i < addArr.length; i = i + 1) {
			if(addArr[i].indexOf('@') >= 0) { //Assume it's an email
			    AddString.push("email:" + addArr[i]);
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
		"body" : {
			"Addresses" : AddString,
			"Text" : textSubject.value,
			"Subject" : text.value
		},
		"contentType" : "application/json",
		"accept" : "application/json",
		"attachments" : fileArray
	};
	attAPIs.ATT.IMMN.sendMessage(args, function(data) {
		responseLable.text = null;
		Ti.API.info('Success Callback:' + data);
		if (args.accept === "application/json") {
			responseLable.text = 'RESPONSE :' + JSON.stringify(data);
		} else {
			responseLable.text = 'RESPONSE :' + data;
		}
		responseWindow.open();
		
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

function getMessageHeaders()
{
	attAPIs.ATT.IMMN.getMessageHeaders({
		'accept' : 'application/json',
		'headerCount' : 50 //Valid Range: Min = 1, Max = 500 // Should be integer
	}, function(data) {
		//Find a message with an attachment
		try {
            var messages = JSON.parse(data), headers = messages.MessageHeadersList.Headers, i = 0, l = headers.length;
            for(; i < l; i++) {
                if(headers[i].MmsContent && headers[i].MmsContent.length > 0) break;
            }
            mmsMessage = headers[i];
		} catch(e) {
		    Ti.API.error('Error Parsing Data: ' + data);
		    return;
		}
		
		responseLable.text = null;
		responseLable.text = 'RESPONSE :' + data;
		responseWindow.open();
		
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	
	});
}

function getMessageContent()
{
	if(!mmsMessage) {
	    alert('Get content headers then this method will display the first mms attachment from the messages')
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
		responseWindow.open();
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		openPopUp(JSON.stringify(error));
	});
}
