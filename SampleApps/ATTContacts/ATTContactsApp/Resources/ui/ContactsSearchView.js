

var mainWindow = Ti.UI.currentWindow
,   contacts = require('contacts')
,   recorder = require('util/record')
,   c = require('util/constants')
,   viewFactory = require('util/viewFactory')
,   ContactDetailWindow = require('ui/ContactDetailWindow')
,   attAPIs = require('att');

//Load the keys that are globally stored from tiapp.xml 
var accessKey = Ti.App.Properties.getString('accessKey')
,   secretKey = Ti.App.Properties.getString('secretKey');

//Check to ensure that keys were updated in tiapp.xml
if(!accessKey || accessKey[0] === 'X') {
    throw new Error('Add the accessKey and secretKey properties in tiapp.xml');
}

//Set up the keys for the ATT module
attAPIs.ATT.authorize(accessKey, secretKey, 'MMS,SPEECH,SMS', 'client_credentials');

contacts.fetch(); //Get the contacts list from online

var mainView = Ti.UI.createView({
    top: 0,
    bottom: c.margin,
    layout: 'vertical',
    height: Ti.UI.FILL,
});
mainWindow.add(mainView);

mainView.add(viewFactory.createTextBoxView({
    text: 'Tap mic and speak a name',
    top: c.margin,
    left: c.margin,
    right: c.margin,
    borderRadius: c.borderRadius
}));

var speechButton = Ti.UI.createButton({
    top : 20,
    height : 86,
    width : 92,
    backgroundImage: '/images/search_button.png',
});

speechButton.addEventListener('click', function(e) {
    if(recorder.isRecording()) return;
    
    //If the contacts list hasn't been properly downloaded, then we should download it
    if(!contacts.list) {
        contacts.createDownloadPrompt();
        return;
    }
    
    //Display the listening dialog
    mainView.remove(contactsList);
    if(!statusBoxShown) mainView.add(statusBox);
    statusBoxShown = true;
    statusBox.setListening();
    
    //Start and wait for the recording
    recorder.record(function(res) {
        if(res.error) {
            viewFactory.createErrorAlert(res.error.type, res.error.message || 'Error while recording');
            mainView.remove(statusBox);
            statusBoxShown = false;
        } else {
            statusBox.setLabel('Processing...');
            
            //Clean up the audio file
            function removeAudioFile() {
                var audioFile = Ti.Filesystem.getFile(res.data.filePath);
                audioFile.deleteFile();
            }
            
            //Define the information for sending the speech
            var speechParams = {
                //The grammar is used to reduce the responses to the name of the contacts
                grammar: contacts.getGrammar(),
                
                //Remove file protocol prefix for Android
                audioFile: c.isAndroid ? res.data.filePath.replace('file://', '') : res.data.filePath,
                
                //Set the X-Arg variable to retrieve multiple names
                xArg: {
                    HasMultipleNBest: true
                }
            };
            
            //Convert speech to text using the logic of the AT&T Watson Engine
            attAPIs.ATT.Speech.speechToTextCustom(speechParams, function(speechData) {
                Titanium.API.info('Speech to Text response: ' + JSON.stringify(speechData));
                
                removeAudioFile();
                
                /*
                var speechData;
                try {
                    speechData = (typeof data === 'string') ? JSON.parse(data) : data;
                } catch(e) {
                    statusBox.setLabel('Processing Error: cannot process response: ' + e.message);
                    return;
                }
                
                //The response is in an unexpected form
                if(!speechData || !speechData.Recognition) {
                    viewFactory.createErrorAlert('AT&T TextToSpeech Error', 
                            'Unexpected Response: ' + JSON.stringify(speechData, null, 3));
                    mainView.remove(statusBox);
                    statusBoxShown = false;
                    return;
                }
                */
                
                //Notify that the speech status if the speech could not be recognized
                if(speechData.Recognition.Status !== 'OK') {
                    statusBox.setLabel('Speech Error: ' + speechData.Recognition.Status);
                    return;
                }
                
                //Retrieve the names of possible Contacts
                var listOfNames = speechData.Recognition.NBest.map(function(speechResult) {
                    return speechResult.ResultText;
                });
                
                Ti.API.log('Found the following contacts: ' + listOfNames.join(', '));
                
                //Filter our contacts list based on the best text response
                var filteredContacts = contacts.filter(listOfNames);
                
                //Display the results
                if(filteredContacts.length === 0) {
                    //No contacts matched the name
                    statusBox.setLabel('No match found for: "' + listOfNames.join(', ') + '"');
                } else {
                    
                    //Update the response list
                    contactsList.setContacts(filteredContacts);
                    mainView.remove(statusBox);
                    statusBoxShown = false;
                    mainView.add(contactsList);
                }
                
            }, function(errorRes) {
                Ti.API.error('Error Callback: ' + JSON.stringify(errorRes));
                
                removeAudioFile();
                
                //Display the error
                viewFactory.createErrorAlert('AT&T TextToSpeech Error', errorRes.error.message);
                mainView.remove(statusBox);
            });
            
            /*
            //For debugging the speech input, use these commands to play the recorded audio file
            var audioPlayer = Ti.Media.createAudioPlayer({ 
                url: res.data.filePath,
            });
            audioPlayer.start();
            */
            
        }
    });
});
mainView.add(speechButton);

//This is where statuses will be displayed
statusBoxShown = false;
var statusBox = viewFactory.createListeningTextBox({
    top: c.margin,
    left: c.margin,
    right: c.margin,
    borderRadius: c.borderRadius
});

//This is the list where the found contacts will be displayed
var contactsList = Ti.UI.createTableView({
    top: c.margin,
    left: c.margin,
    right: c.margin,
    borderRadius: c.borderRadius,
    height: Ti.UI.SIZE,
    backgroundColor: 'black',
    borderColor: 'gray'
});

//Sets the the contacts in the list
contactsList.setContacts = function(newContactsList) {
    var data = newContactsList.map(function(contact) {
        var contactRow = Ti.UI.createTableViewRow({
            hasChild : c.isAndroid,
            hasDetail: !c.isAndroid,
            height: 48
        });
        
        contactRow.add(Ti.UI.createLabel({
            left : c.margin, right: c.margin,
            height : Ti.UI.SIZE,
            font : c.font,
            text : contact.name,
            color : 'white'
        }));
        
        contactRow.addEventListener('click', function(e) {
            mainWindow.openChild(new ContactDetailWindow(contact));
        });
        
        return contactRow;
    }, this);
    
    if(!c.isAndroid && newContactsList.length > 4) {
        this.height = Ti.UI.FILL;
        this.bottom = 0;
        this.scrollable = true;
    } else {
        this.height = Ti.UI.SIZE;
        this.bottom = undefined;
        this.scrollable = c.isAndroid;
    }
    
    this.setData(data);
};


