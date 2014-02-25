"use strict";

// Att common JS module needs to be required.
var attAPIs = require('att');

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
    folderPath = Ti.Filesystem[deviceState.is.android ? 'externalStorageDirectory' : 'applicationDataDirectory'];

fileChoose.addEventListener('click', function() {
    util.UI.createGetFilePathWindow(folderPath, function(fileData) {
        filePath = fileData.path;
        mysound = Ti.Media.createSound({ url : filePath });
        fileName.text = 'File Name : ' + fileData.name;
    }, function(error) {
        alert(error.message);
    });
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
        alert('No sound selected.  Please select a file' + (deviceState.is.android ? '.' : ' or record your speech.'));
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
	    var winNav = Ti.UI.iOS.createNavigationWindow({
	    modal: true,
	    window: win
	    });
        var recorderClose = Ti.UI.createButton({
            style : Ti.UI.iPhone.SystemButtonStyle.DONE,
            title : 'close'
        });
        
        recorderClose.addEventListener('click', function() {
            Ti.API.info('Recording Screen Closed.');
            winNav.close();
        });
        
        win.setRightNavButton(recorderClose);
        if (Titanium.Platform.osname !== "android") {
			winNav.open();
		}
		else {
			win.open();
		}
    });
    scrollView.add(recorder);
}

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
}));

speechButton.addEventListener('click', function() {
	Ti.API.info('Speech Button Clicked.');
	
	var grammarString = buildGrammarList('colors', ['blue', 'red', 'green', 'yellow', 'white']);
	
	Ti.API.log('filePath = ' + filePath);
	
	var params = {
	    grammar: grammarString, 
	    audioFile: util.formatFilePath(filePath),
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





