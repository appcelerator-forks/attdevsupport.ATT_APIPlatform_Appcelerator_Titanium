//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('authScope');
var redirectUrl = Ti.App.Properties.getString('redirectUrl');

var util = require('util');
var sendMessageWindow = Ti.UI.currentWindow;
// some test datas.
var testTelNumber = "6504549816";
var testMessageSubject = 'Testing ATT In App Messaging API Subject';
var testMessageText = 'Testing ATT In App Messaging API Text';


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
	sendMessage();

});
sendMessageWindow.add(textNumber);
sendMessageWindow.add(textSubject);
sendMessageWindow.add(text);
sendMessageWindow.add(GetAttachment);
sendMessageWindow.add(SendMessageButton);
sendMessageWindow.add(dispAttachment);



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
//alert(AddString +" " + text.value + textSubject.value );
	//@param args- is send as first parameter containing body along with attachments
	var args = {
		
		"contentType" : "application/json",
		"accept" : "application/json",
		"attachments" : fileArray
	};
	args.body={ "messageRequest" :{
			"addresses" : AddString,
			"text" : text.value,
			"subject" : textSubject.value,
			"isGroup" : false }
	};
	attAPIs.ATT.InAppMessaging.sendMessage(args, function(data) {
		//responseLable.text = null;
		Ti.API.info('Success Callback:' + data);
		alert('RESPONSE :' + JSON.stringify(data));
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
		}
		*/
		for(cnt=(dispAttachment.children.length-1);cnt>=0;cnt--){
			dispAttachment.remove(dispAttachment.children[cnt]);
		}
		
		fileArray=[];
	}, function(error) {
		Ti.API.error('Error Callback:' + JSON.stringify(error));
		alert(JSON.stringify(error));
		//openPopUp(JSON.stringify(error));
	});
}

