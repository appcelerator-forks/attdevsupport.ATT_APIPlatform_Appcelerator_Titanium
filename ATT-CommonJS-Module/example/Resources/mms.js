//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('scope');

var grantType = 'client_credentials';
// some test datas.
var testTelNumber = '6504549816';
var testMessage = 'Testing ATT MMS API';

var mmsId = null;
//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

var mainWindow = Ti.UI.currentWindow;
mainWindow.addEventListener('android:back', function(e) {
	'use strict';
	mainWindow.close();
});

var responseWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response'
});

responseWindow.addEventListener('android:back', function(e) {
	'use strict';
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
	'use strict';
	responseLable.text = null;
	responseLable.text = 'RESPONSE :' + data;
	responseWindow.open();
}

var textNumber = Ti.UI.createTextField({
	top : 20,
	right : 10,
	left : 5,
	height : Ti.UI.Android ? "40dp" : 40,
	borderColor : 'black',
	color : 'black',
	hintText : 'Enter phone number(s)'
});
var textSubject = Ti.UI.createTextField({
	top : 70,
	right : 10,
	left : 5,
	height : Ti.UI.Android ? "40dp" : 40,
	borderColor : 'black',
	color : 'black',
	hintText : 'Enter subject here'
});

var MMSAttachment = Ti.UI.createButton({
	title : 'MMSAttachment',
	top : 215,
	height : Ti.UI.Android ? "30dp" : 30
});
var MMSButton = Ti.UI.createButton({
	title : 'Send MMS',
	top : 255,
	height : Ti.UI.Android ? "30dp" : 30
});
var GetMMSStatusBtn = Ti.UI.createButton({
	title : 'GetMMSDeliveryStatus',
	top : 295,
	height : Ti.UI.Android ? "30dp" : 30
});
var dispAttachment = Ti.UI.createScrollView({
	top : 120,
	left : 0,
	height : 85,
	width : Ti.UI.FILL,
	layout : 'horizontal'
});

var fileArray = [], savedFile;
MMSAttachment.addEventListener('click', function() {"use strict";
	Ti.API.info('MMS Attachment Button Clicked.');
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

			var pic = Ti.UI.createImageView({
				top : 8,
				left : 10,
				height : 65,
				width : 65,
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

MMSButton.addEventListener('click', function(e) {"use strict";
	Ti.API.info('Send MMS Button Clicked.');
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
		textNumber.value = testTelNumber;
		AddString = 'tel:' + testTelNumber;

	}
	if (textSubject.value === 'Enter subject here' || textSubject.value === '') {
		textSubject.value = testMessage;
	}

	/**
	 *@param body- Will contain three values Address,Subject and Priority
	 *@param contentType- format in which data is to be sent
	 * Example:
	 *  contentType @ application/json
	 *  "body":{"Address" :"tel:XXXXXXXXXX", "Subject" : "Test MMS JSON", "Priority" : "High" },
	 * contentType @ application/xml
	 "body":"<MmsRequest>"+"\n"+"<Address>tel:XXXXXXXXXX</Address>"+"\n"+"<Subject>"Test MMS XML"</Subject>"+"\n"+"<Priority>High</Priority>"+"\n"+"</MmsRequest>",
	 * contentType @ application/x-www-form-urlencoded
	 "body":"Address=tel%3AXXXXXXXXXX&Priority=High&Subject=Test%20MMS%20URL",
	 **/

	//@param args- is send as first parameter containing body along with attachment
	var args = {
		"attachments" : fileArray,
		"body" : "<MmsRequest>" + "\n" + "<Address>" + AddString + "</Address>" + "\n" + "<Subject>" + textSubject.value + "</Subject>" + "\n" + "<Priority>High</Priority>" + "\n" + "</MmsRequest>",
		"contentType" : "application/xml",
		"accept" : "application/json"
	};
	attAPIs.ATT.MMS.sendMMS(args, function(data) {
		responseLable.text = null;
		Ti.API.info('Success Callback:' + data);
		if (args.accept === "application/json") {
			if (Ti.Platform.osname !== 'android') {
				var mmsJsonResponse = JSON.parse(data);
				responseLable.text = 'RESPONSE :' + JSON.stringify(mmsJsonResponse);
				if (mmsJsonResponse.Id) {
					mmsId = mmsJsonResponse.Id;
				}
			} else {
				responseLable.text = 'RESPONSE :' + JSON.stringify(data) + data;
				if (data.Id) {
					mmsId = data.Id;
				}
			}
		} else {
			if (data.indexOf("Id") !== -1) {
				var indexOfCode = data.indexOf("Id");
				mmsId = data.substr(indexOfCode + 4, 19);
			}
			responseLable.text = 'RESPONSE :' + data;

		}
		responseWindow.open();

	}, function(error) {
		Ti.API.error('Error Callback:' + error);
		openPopUp(JSON.stringify(error));
	});
});

GetMMSStatusBtn.addEventListener('click', function() {"use strict";
	Ti.API.info('Get MMS Delivery Status Button Clicked.');
	attAPIs.ATT.MMS.getMMSDeliveryStatus({
		'id' : mmsId,
		'accept' : 'application/json'
	}, function(data) {
		Ti.API.info('Success Callback: ' + data);
		openPopUp(data);

	}, function(error) {
		Ti.API.error('Error Callback: ' + error);
		openPopUp(JSON.stringify(error));
	});

});

mainWindow.add(MMSAttachment);
mainWindow.add(MMSButton);
mainWindow.add(GetMMSStatusBtn);
mainWindow.add(textNumber);
mainWindow.add(textSubject);
mainWindow.add(dispAttachment);

