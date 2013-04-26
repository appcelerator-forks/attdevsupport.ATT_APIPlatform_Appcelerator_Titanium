"use strict";

// Att common JS module needs to be required.
var attAPIs = require('att');
var fileBrowser = require('ti.filebrowser');

// Note: Application Developer should get access key and secret key by
// registering on www.developer.att.com website
// and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';

// pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

//Load helper functions
var util = require('util'),
    forEach = util.forEach,
    copyObjTo = util.copyObjTo,
    createPicker = util.UI.createPicker,
    deviceState = util.state.device,
    openPopUp = util.UI.createResponseWindow();
    
var sttConstants = {
    margin: 10,
    padding: 10,
    buttonWidth: '95%'
};

util.UI.createSpacer.defaultSpacerHeight = sttConstants.margin;

//creating a View to contain the API functionality
var mainWindow = Ti.UI.currentWindow;

mainWindow.addEventListener('android:back', function(e) {
    mainWindow.close();
});

var scrollView = Ti.UI.createScrollView({
    top: 0,
    layout:'vertical',
    height: Ti.UI.SIZE,
    left: sttConstants.margin,
    right: sttConstants.margin
});

var fileName = Ti.UI.createLabel({
    top: sttConstants.margin,
    height: Ti.UI.SIZE,
    color: 'black'
});
scrollView.add(fileName);

function clearFilePath() {
    filePath = null;
    fileName.text = 'File Name : No File Taken';
}
clearFilePath();

var fileChooseView = Ti.UI.createView({
	top: sttConstants.margin,
	width : '100%',
	height: Ti.UI.SIZE,
	borderColor : 'black',
	backgroundColor : 'aqua',
	layout:'vertical'
});

var fileChoose = Ti.UI.createButton({
    title : 'Choose file',
    top: sttConstants.margin,
    width: sttConstants.buttonWidth
});

var filePath, mysound,
    fileBrowserCallBack = function() {
    Ti.API.info('JSON:' + JSON.stringify(fileBrowser.selectedFilesJSON()));
    //Ti.API.info('Binary Object JSON: ' + JSON.stringify(fileBrowser.selectedFilesBinaryObjJSON()));
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
// If Play button is clicked without choosing a file then it will throw an exception.
var audioPlayer = Ti.UI.createButton({
    title : 'Play',
    top: sttConstants.margin,
    width: sttConstants.buttonWidth
});
audioPlayer.addEventListener('click', function() {
    if(mysound) {
        mysound.play();
    } else {
        alert('No sound selected.  Please select a file' + (deviceState.is.android ? '.' : ' or record your speech.'))
    }
});

fileChooseView.add(fileChoose);
fileChooseView.add(audioPlayer);
fileChooseView.add(util.UI.createSpacer(sttConstants.margin));
scrollView.add(fileChooseView);

if (!deviceState.is.android) {
    var orLabel = Ti.UI.createLabel({
        top: sttConstants.margin,
        text : 'OR',
        width : '100%',
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    });
    scrollView.add(orLabel);
    
    var recorder = Ti.UI.createButton({
        top: sttConstants.margin,
        title : 'Voice Record',
        width: sttConstants.buttonWidth
    });
    recorder.addEventListener('click', function() {
        Ti.API.info('Recorder Button Clicked.');
        clearFilePath();
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
        
        win.setRightNavButton(recorderClose);
        win.open();
    });
    scrollView.add(recorder);
}

var speechContextPickerView = createPicker({ 
    width: sttConstants.buttonWidth,
    borderColor : 'black'
}, ['', 'Generic', 'BusinessSearch', 'Websearch', 'SMS', 'Voicemail', 'QuestionAndAnswer', 'Gaming', 'SocialMedia']);
scrollView.add(util.UI.createLabelView('Speech Context', speechContextPickerView, { top: sttConstants.margin }));

var languagePickerView = createPicker({ 
    width: sttConstants.buttonWidth,
    borderColor : 'black'
}, ['', 'en-US', 'es-US']);
scrollView.add(util.UI.createLabelView('Content Language', languagePickerView));

var baseArgument = {
	'contentType' : 'audio/wav',
	'accept' : 'application/xml'
};
//973-967-3544 .Jerom
//harish yarlagadda
var androidFilePath = function(pathToBeModified) {
	var index = pathToBeModified.indexOf('mnt');
	var androidFilePath = pathToBeModified.substr(index, pathToBeModified.length - index);
	return androidFilePath;
};

var speechButton = Ti.UI.createButton({
    title : 'Speech',
    top: 20,
    width: sttConstants.buttonWidth,
    height: Ti.UI.SIZE
});
speechButton.addEventListener('click', function() {"use strict";
	Ti.API.info('Speech Button Clicked.');
	
	var argument = copyObjTo({
	   contentLanguage: languagePickerView.value || '',
	   xSpeechContext: speechContextPickerView.value || ''
	}, baseArgument);
	
	if (deviceState.is.android) {
		argument.filePath = filePath ? androidFilePath(filePath) : alert('Please add audiofile inside application folder in sdcard.')
	} else {
		argument.filePath = filePath ? filePath : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'temp.wav').nativePath;
	}
	Ti.API.info(argument.filePath);
    
	attAPIs.ATT.Speech.speechToText(argument, function(data) {
		Ti.API.info('Success Callback:' + ((argument.accept === 'application/xml') ? data : JSON.stringify(data)));
		openPopUp(data);
	}, function(error) {
		Ti.API.error('Error Callback: ' + error);
		openPopUp(error);
	});
});

scrollView.add(speechButton);
scrollView.add(util.UI.createSpacer());

mainWindow.add(scrollView);