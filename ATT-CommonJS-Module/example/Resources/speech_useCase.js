// Att common JS module needs to be required.
var attAPIs = require('att');
var fileBrowser = require('ti.filebrowser');

// Note: Application Developer should get access key and secret key by
// registering on www.developer.att.com website
// and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = 'MMS,SMS,WAP,SPEECH';
var grantType = 'client_credentials';

// pass accessKey and secretKey for authorization
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

//creating a View to contain the API functionality
var scrollView = Ti.UI.createScrollView({
	contentWidth : 'auto',
	contentHeight : 'auto',
	showVerticalScrollIndicator : true,
	top : 49
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

responseWindow.add(responseLable);

if (true) {
	var fileChooseView = Ti.UI.createView({
		top : 50,
		width : Ti.UI.Android ? Titanium.Platform.displayCaps.platformWidth : 318,
		height : Ti.UI.Android ? '105dp' : 105,
		borderColor : 'black',
		backgroundColor : 'aqua'
	});
	var speechButton = Ti.UI.createButton({
		title : 'Speech',
		top : 300,
		width : Ti.UI.Android ? Titanium.Platform.displayCaps.platformWidth : 316
	});

	var fileChoose = Ti.UI.createButton({
		title : 'Choose file',
		top : 10,
		width : Ti.UI.Android ? Titanium.Platform.displayCaps.platformWidth : 316
	});
	// If Play button is clicked without choosing a file then it will throw an exception.
	var audioPlayer = Ti.UI.createButton({
		title : 'Play',
		top : Ti.UI.Android ? "60dp" : 60,
		width : 316
	});

	fileChooseView.add(fileChoose);
	fileChooseView.add(audioPlayer);

	var recorder = Ti.UI.createButton({
		title : 'Voice Record',
		top : 210,
		width : Ti.UI.Android ? Titanium.Platform.displayCaps.platformWidth : 316
	});
	var fileName = Ti.UI.createLabel({
		text : 'File Name : No File Taken',
		top : 0
	});
	var orLabel = Ti.UI.createLabel({
		text : 'OR',
		top : 170
	});
	scrollView.add(orLabel);
	var mysound;
	var filePath;

	audioPlayer.addEventListener('click', function() {"use strict";
		mysound.play();
	});
	recorder.addEventListener('click', function() {"use strict";
		Ti.API.info('Recorder Button Clicked.');
		filePath = null;
		fileName.text = 'File Name : No File Taken';
		var win = Titanium.UI.createWindow({
			modal : true,
			url : 'audioRecorder.js',
			title : "Recorder Screen",
			backgroundColor : '#fff'
		});
		var recorderClose = Ti.UI.createButton({
			style : Ti.UI.iPhone.SystemButtonStyle.DONE,
			title : 'close'
		});

		recorderClose.addEventListener('click', function() {
			Ti.API.info('Recording Screen Closed.');
			win.close();
		});

		if (Titanium.Platform.osname !== "android") {
			win.setRightNavButton(recorderClose);
		}
		win.open();
	});
	scrollView.add(fileName);
	if (Ti.Platform.osname !== 'android') {
		scrollView.add(recorder);
	}
	var fileBrowserCallBack = function() {
		Ti.API.info('JSON:' + JSON.stringify(fileBrowser.selectedFilesJSON()));
		Ti.API.info('Binary Object JSON: ' + JSON.stringify(fileBrowser.selectedFilesBinaryObjJSON()));
		if (fileBrowser.numberOfFiles() > 0) {
			var obj = fileBrowser.selectedFilesJSON(), key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					mysound = Ti.Media.createSound({
						url : obj[key]
					});
					filePath = obj[key];
					fileName.text = 'File Name : ' + key;

				}
			}

		}
	};

	fileChoose.addEventListener('click', function() {"use strict";
		Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'temp.wav').deleteFile();
		Ti.UI.Android ? fileBrowser.setDirectoryToView(Ti.Filesystem.getExternalStorageDirectory()) : fileBrowser.setDirectoryToView(Ti.Filesystem.getApplicationDataDirectory());
		fileBrowser.setCurrentViewMode(fileBrowser.viewModeMixed);
		fileBrowser.open(fileBrowserCallBack);
	});

	scrollView.add(fileChooseView);

	var argument = {
		'xSpeechContext' : 'BusinessSearch',
		'contentType' : 'audio/wav',
		'accept' : 'application/xml'

	};

	var androidFilePath = function(pathToBeModified) {
		var index = pathToBeModified.indexOf('mnt');
		var androidFilePath = pathToBeModified.substr(index, pathToBeModified.length - index);
		return androidFilePath;
	};
	speechButton.addEventListener('click', function() {"use strict";
		Ti.API.info('Speech Button Clicked.')
		if (Ti.Platform.osname === 'android') {
			argument.filePath = filePath ? androidFilePath(filePath) : alert('Please add audiofile inside application folder in sdcard.')
		} else {
			argument.filePath = filePath ? filePath : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'temp.wav').nativePath;
		}
		Ti.API.info(argument.filePath);
		attAPIs.ATT.Speech.speechToText(argument, function(data) {
			if (argument.accept === 'application/xml') {
				Ti.API.info('Success Callback:' + data);
				responseLable.text = null;
				responseLable.text = 'RESPONSE :' + data;
				responseWindow.open();
			} else {
				Ti.API.info('Success Callback:' + JSON.stringify(data));
				responseLable.text = null;
				responseLable.text = 'RESPONSE :' + JSON.stringify(data);
				responseWindow.open();
			}
		}, function(error) {
			Ti.API.error('Error Callback: ' + error);
			responseLable.text = null;
			responseLable.text = 'RESPONSE :' + error;
			responseWindow.open();
		});
	});

	scrollView.add(speechButton);

}
mainWindow.add(scrollView);
// mainWindow.open();