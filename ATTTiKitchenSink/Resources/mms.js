"use strict";

//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey'),
    secretKey = Ti.App.Properties.getString('secretKey'),
    scope = Ti.App.Properties.getString('scope'),
    grantType = 'client_credentials',
    testMessage = 'Testing ATT MMS API',
    mmsId = null;

//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

var util = require('util'),
    forEach = util.forEach,
    copyObjTo = util.copyObjTo,
    createPicker = util.UI.createPicker,
    deviceState = util.state.device,
    openPopUp = util.UI.createResponseWindow();


var mmsConstant = {
    margin: 10,
    padding: 10,
    textFieldHeight: deviceState.is.android ? undefined : 40,
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
    right : mmsConstant.margin,
    left : mmsConstant.margin,
});
mainWindow.add(scrollView);

var textFieldBaseOptions = {
    top: mmsConstant.margin,
    width: '100%',
    height : mmsConstant.textFieldHeight,
    paddingLeft: mmsConstant.padding,
    paddingRight: mmsConstant.padding,
    borderColor : 'black',
    color : 'black',
}

var textNumber = util.UI.createNumberField(util.copyObjTo({
	hintText : 'Enter phone number(s)'
}, textFieldBaseOptions));
scrollView.add(textNumber);

var textSubject = Ti.UI.createTextField(util.copyObjTo({
	hintText : 'Enter subject here'
}, textFieldBaseOptions));
scrollView.add(textSubject);

var dispAttachment = Ti.UI.createScrollView({
	left : 0,
	height : 100,
	width : Ti.UI.FILL,
	layout : 'horizontal',
	borderColor: 'black',
    borderWidth: 1
});
scrollView.add(util.UI.createLabelView('Attachments', dispAttachment, { top: mmsConstant.margin }));

var mmsAttachment = Ti.UI.createButton({
    top: 20,
    title : 'MMS Attachment',
    height : mmsConstant.buttonHeight,
    width: mmsConstant.buttonWidth
});
var fileArray = [], savedFile;
mmsAttachment.addEventListener('click', function() {
	Ti.API.info('MMS Attachment Button Clicked.');
	Titanium.Media.openPhotoGallery({
		success : function(event) {
			Ti.API.debug('Titanium Media OpenPhotoGallery Success Callback.');
			var image = event.media;
			var fileName = new Date().getTime() + "image.jpg";
			var file;
			if (!deviceState.is.android) {
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

			var pic = Ti.UI.createImageView({
				top : 10,
				left : 10,
				height : 80,
				width : 80,
				borderColor : 'black',
				image : event.media
			});

			dispAttachment.add(pic);

		},
		error : function(e) {
			Ti.API.error('Titanium Media OpenPhotoGallery Error Callback.' + JSON.stringify(e));
		}
	});

});
scrollView.add(mmsAttachment);

var mmsButton = Ti.UI.createButton({
    top: mmsConstant.margin,
    title : 'Send MMS',
    height : mmsConstant.buttonHeight,
    width: mmsConstant.buttonWidth
});
mmsButton.addEventListener('click', function(e) {
	Ti.API.info('Send MMS Button Clicked.');
    
	var addressArr = util.formatNumberStr(textNumber.value);
	if(!addressArr) return;
	
	if (textSubject.value === '') {
		textSubject.value = testMessage;
	}

	/**
	 *@param body- Will contain three values Address,Subject and Priority
	 *@param contentType- format in which data is to be sent
	 * Example:
	 *  contentType @ application/json
	 *  "body":{"address" :"tel:XXXXXXXXXX", "subject" : "Test MMS JSON", "priority" : "High" },
	 * contentType @ application/xml
	 "body":"<outboundMessageRequest>"+"<address>tel:XXXXXXXXXX</address>"+"<subject>"Test MMS XML"</subject>"+"<priority>High</priority>"+"</outboundMessageRequest>",
	 * contentType @ application/x-www-form-urlencoded
	 "body":"address=tel%3AXXXXXXXXXX&priority=High&subject=Test%20MMS%20URL",
	 **/

	//@param args- is send as first parameter containing body along with attachment
	var args = {
		"attachments" : fileArray,
		"body" : "<outboundMessageRequest>" 
		       +   "<address>" + addressArr.join(',') + "</address>" 
		       +   "<subject>" + textSubject.value + "</subject>" 
		       +   "<priority>High</priority>" 
		       + "</outboundMessageRequest>",
		"contentType" : "application/xml",
		"accept" : "application/json"
	};
	attAPIs.ATT.MMS.sendMMS(args, function(data) {
		Ti.API.info('Success Callback:' + data);
		if (args.accept === "application/json") {
			var mmsJsonResponse = deviceState.is.android ? data: JSON.parse(data);
			try {
				mmsId = mmsJsonResponse.outboundMessageResponse.messageId;
			} catch(e) {
			    Ti.API.error('Invalid response data: ' + JSON.stringify(data));
			}
		} else {
			var idMatch = data.match(/<messageId>(.*?)<\/messageId>/i);
			if(idMatch) mmsId = idMatch[1];
		}
		openPopUp(data);
	}, function(error) {
		Ti.API.error('Error Callback:' + error);
		openPopUp(error);
	});
});
scrollView.add(mmsButton);

var getMMSStatusBtn = Ti.UI.createButton({
    top: mmsConstant.margin,
    title : 'Get MMS Delivery Status',
    height : mmsConstant.buttonHeight,
    width: mmsConstant.buttonWidth
});
getMMSStatusBtn.addEventListener('click', function() {
	Ti.API.info('Get MMS Delivery Status Button Clicked.');
	if(!mmsId) {
        alert("An MMS must be successfully sent before you can recieve its status");
        return;
    }
	attAPIs.ATT.MMS.getMMSDeliveryStatus({
		'id' : mmsId,
		'accept' : 'application/json'
	}, function(data) {
		Ti.API.info('Success Callback: ' + data);
		openPopUp(data);
	}, function(error) {
		Ti.API.error('Error Callback: ' + error);
		openPopUp(error);
	});
});
scrollView.add(getMMSStatusBtn);
scrollView.add(util.UI.createSpacer());
