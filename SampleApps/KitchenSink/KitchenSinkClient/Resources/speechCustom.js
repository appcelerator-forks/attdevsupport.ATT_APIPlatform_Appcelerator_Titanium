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
    openPopUp = util.UI.createResponseWindow(),
    colors = ['blue', 'red', 'green', 'yellow', 'white'];
    
var sttConstants = {
    margin: 10,
    padding: 10,
    buttonWidth: '95%'
};

util.UI.createSpacer.defaultSpacerHeight = sttConstants.margin;

//creating a View to contain the API functionality
var mainWindow = Ti.UI.currentWindow;

var scrollView = Ti.UI.createScrollView({
    top: 0,
    layout:'vertical',
    height: Ti.UI.SIZE,
    left: sttConstants.margin,
    right: sttConstants.margin
});



scrollView.add(Ti.UI.createLabel({
    top: sttConstants.margin,
    height: Ti.UI.SIZE,
    color: 'black',
    text: 'Choose one of the following colors:\n' + colors.join(', ')
}));

var fileName = Ti.UI.createLabel({
    top: sttConstants.margin,
    height: Ti.UI.SIZE,
    color: 'black',
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


var androidFilePath = function(pathToBeModified) {
	var index = pathToBeModified.indexOf('mnt');
	var androidFilePath = pathToBeModified.substr(index, pathToBeModified.length - index);
	return androidFilePath;
};

function buildGrammarList(id, possibleWords) {
    var grammarText = '<grammar root="' + id + '" xml:lang="en-US"><rule id="' + id + '"><one-of>';
    
    possibleWords.forEach(function(word) {
        grammarText += '<item>' + word + '</item>';
    });

    grammarText += '</one-of></rule></grammar>';
    return grammarText;
}

var speechButton = Ti.UI.createButton({
    title : 'Speech',
    top: 20,
    width: sttConstants.buttonWidth,
    height: Ti.UI.SIZE
});
var resultColorView = Ti.UI.createScrollView({
    bottom: 0, left: 0, right: 0, height: 50,
    borderWidth: 1, borderColor: 'black'
});
resultColorView.add(Ti.UI.createLabel({
    text: 'Response Color'
}))

speechButton.addEventListener('click', function() {
	Ti.API.info('Speech Button Clicked.');
	var myFilePath;
	
	if (deviceState.is.android) {
		if(!filePath) {
		    alert('Please add audiofile inside application folder in sdcard.');
		    return;
		}
		
		myFilePath = androidFilePath(filePath);
	} else if(!filePath) {
		myFilePath = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'temp.wav').nativePath;
	}
	
	//sendSSTC(myFilePath);
	//return;
		
	var grammarString = buildGrammarList('colors', ['blue', 'red', 'green', 'yellow', 'white']);
	
	var params = {
	    grammar: grammarString, audioFile: myFilePath || Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'red.wav').nativePath,
	    options: { strict: true }
	};
    
	attAPIs.ATT.Speech.speechToTextCustom(params, function(result) {
		Ti.API.info('Success Callback:' + JSON.stringify(result, null, 3));
		openPopUp(result);
		
		if(result.Recognition.Status === 'OK') {
            resultColorView.backgroundColor = result.Recognition.NBest[0].ResultText;
        }
	}, function(error) {
		Ti.API.error('Error Callback: ' + JSON.stringify(error, null, 3));
		openPopUp(error, true);
	});
});

scrollView.add(speechButton);

mainWindow.add(scrollView);
mainWindow.add(resultColorView);





