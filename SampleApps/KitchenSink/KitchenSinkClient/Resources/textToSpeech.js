//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.
// <module platform="commonjs" version="1.0.1">att</module>
var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';
var isAndroid = Titanium.Platform.osname === "android";

//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

//Helper functions and variables
var util = require('util'),
    forEach = util.forEach,
    copyObjTo = util.copyObjTo,
    createPicker = util.UI.createPicker,
    deviceState = util.state.device,
    isAndroid = deviceState.is.android,
    openPopUp = util.UI.createResponseWindow();

var ttsConstants = {
    margin: 10
};

//Set up main window
var mainWindow = Ti.UI.currentWindow;
mainWindow.layout = 'vertical';

mainWindow.addEventListener('android:back', function(e) {
    mainWindow.close();
});

var scrollView = Ti.UI.createScrollView({
    top: 0,
    layout:'vertical',
    height: Ti.UI.SIZE,
    left: ttsConstants.margin, 
    right: ttsConstants.margin,
});
mainWindow.add(scrollView);

//Create textarea to type text
var inputTextArea = Ti.UI.createTextArea({
    width: '100%',
    height : 100,
    color : 'black',
    borderColor : 'black',
    font: {
        fontSize: deviceState.is.android ? 18 : 16
    },
    hintText: 'Enter your text here'
});
scrollView.add(util.UI.createLabelView('Text', inputTextArea, { top : ttsConstants.margin }));

var pickerOptions = {
    borderColor : 'black'
    backgroundColor: 'orange'
};

var languagePickerView = util.UI.createPicker(pickerOptions, ['', 'en-US', 'es-US']);
scrollView.add(util.UI.createLabelView('Content Language', languagePickerView));

var voicePickerWrapper = Ti.UI.createView({
    height: Ti.UI.SIZE
});
scrollView.add(voicePickerWrapper);

var voicePickerEnglish = util.UI.createPicker(pickerOptions, ['', 'crystal', 'mike']);
var voicePickerEnglishRow = util.UI.createLabelView('English Voice', voicePickerEnglish, {top: 0});
voicePickerWrapper.add(voicePickerEnglishRow);

var voicePickerSpanish = util.UI.createPicker(pickerOptions, ['rosa', 'alberto']);
var voicePickerSpanishRow = util.UI.createLabelView('Spanish Voice', voicePickerSpanish, {top: 0});
voicePickerWrapper.add(voicePickerSpanishRow);
voicePickerSpanishRow.visible = false;

languagePickerView.addEventListener('change', function(e) {
    var isSpanish = languagePickerView.value === 'es-US';
    
    voicePickerEnglishRow.visible = !isSpanish;
    voicePickerSpanishRow.visible = isSpanish;
});


//Create submit button
var sendTextButton = Ti.UI.createButton({
    title : 'Send Text',
    top : 20,
    height : 40,
});

var playSoundButton;
function createPlaySoundButton(filePath) {
    var player = Ti.Media.createSound({url:filePath});
    
    if(playSoundButton) scrollView.remove(playSoundButton);
    
    playSoundButton = Ti.UI.createButton({
        title : 'Play Sound',
        top : 10,
        height : 40
    });
    
    playSoundButton.addEventListener('click', function() {
        if(!player.playing) player.play();
    });
    
    scrollView.add(playSoundButton);
}

function getTextToSpeech() {
    var text = inputTextArea.value;
    Ti.API.info('Text entered: ' + text);
    
    if(!text) {
        alert('Enter text to convert to speech');
        return;
    }
    
    /**
     * 
     * @param options.contentType- format in which data is to be sent, either "text/plain" or "application/ssml+xml"
     * @param options.accept - The format of the audio returned, either "audio/amr", "audio/amr-wb", or "audio/wav"
     * @param options.filePath - The path where to save the audio. It will write over any existing file. It appends 
     *                   the proper extension (based on the accept) if one is not added
     * @param options.body- Will contain the plain text or SSML to convert to speech
     * 
     **/
    var fileName = 'tts';
    var filePath = Ti.Filesystem[isAndroid ? 'externalStorageDirectory' : 'applicationDataDirectory'] + fileName;
       
    attAPIs.ATT.Speech.textToSpeech({
        'accept' : 'audio/x-wav',
        'contentType' : 'text/plain',
        'body' : text,
        'filePath': filePath,
        'contentLanguage': languagePickerView.value,
        'xArg': {
            VoiceName: (languagePickerView.value === 'es-US') ? voicePickerSpanish.value : voicePickerEnglish.value
        }
    }, function(data) {
        //Ti.API.log(data);
        createPlaySoundButton(JSON.parse(data).filePath);
    }, function(error) {
        Ti.API.error('Error Callback:' + error);
        openPopUp(error, true);
    });
}

//On Button Click user call method 'SendSMS'
sendTextButton.addEventListener('click', function() {"use strict";
    Ti.API.info('Get TTS Button Clicked.');
    
    inputTextArea.blur();
    getTextToSpeech();
});

scrollView.add(sendTextButton);
