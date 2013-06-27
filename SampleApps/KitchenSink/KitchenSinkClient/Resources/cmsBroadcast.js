//Att common JS module needs to be required.
var attAPIs = require('att');

/*Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
 and creating sample Application.*/

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';

//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

var bcPhoneNosField, bcMessageArea;

/** Broadcast Window **/
var broadcastWindow = Ti.UI.currentWindow;

broadcastWindow.addEventListener('android:back', function(e) {
	broadcastWindow.close();
});

var broadcastWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

broadcastWinRightNavButton.addEventListener('click', function() {"use strict";
	broadcastWindow.close();
});

//For Iphone Only.
if (Titanium.Platform.osname !== "android") {
	broadcastWindow.setRightNavButton(broadcastWinRightNavButton);
}

/* Response Window */
var responseWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response Window'
});

responseWindow.addEventListener('android:back', function(e) {
	responseWindow.close();
});

var modalWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

modalWinRightNavButton.addEventListener('click', function() {"use strict";
	responseWindow.close();
});
//For Iphone Only.
if (Titanium.Platform.osname !== "android") {
	responseWindow.setRightNavButton(modalWinRightNavButton);
}

var responseLable = Ti.UI.createLabel({
	top : 20,
	left : 5,
	right : 5,
	height : 'auto',
	color : 'black'
});

responseWindow.add(responseLable);

function openPopUp(data) {
	responseLable.text = null;
	responseLable.text = 'RESPONSE :' + data;
	responseWindow.open();
}

/** Broadcast Window Components **/
var messageLabel = Ti.UI.createLabel({
	text : 'Enter message to be informed here:',
	color : 'black',
	textAlign : 'left',
	left : '5%',
	right : '20%',
	top : 40,
	height : 'auto',
	font : {
		fontSize : 14,
		fontFamily : 'Helvetica Neue'
	},
});
broadcastWindow.add(messageLabel);

bcMessageArea = Titanium.UI.createTextArea({
	top : 70,
	right : '5%',
	left : '5%',
	font : {
		fontSize : 16,
		fontFamily : 'Helvetica Neue'
	},
	value : '',
	textAlign : 'left',
	borderColor : 'black',
	color : 'black',
	//backgroundColor:'#000',
	height : 80
});
broadcastWindow.add(bcMessageArea);

if (Ti.Platform.osname !== 'android') {

	var speechButton = Titanium.UI.createButton({
		height : 40,
		top : 25,
		right : '5%',
		width : '35',
		backgroundImage : 'micon.png'
	});
	/*
	 broadcastWindow.add(speechButton);
	 */
	Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;
	var recording = Ti.Media.createAudioRecorder();
	recording.compression = Ti.Media.AUDIO_FORMAT_ULAW;
	recording.format = Ti.Media.AUDIO_FILEFORMAT_WAVE;

	Ti.Media.addEventListener('recordinginput', function(e) {'use strict';
		Ti.API.info('Input availability changed: ' + e.available);
		if (!e.available && recording.recording) {
			speechButton.fireEvent('click', {});
		}
	});

	var file, timer;

	function lineTypeToStr() {'use strict';
		var type = Ti.Media.audioLineType;
		switch(type) {
			case Ti.Media.AUDIO_HEADSET_INOUT:
				return "headset";
			case Ti.Media.AUDIO_RECEIVER_AND_MIC:
				return "receiver/mic";
			case Ti.Media.AUDIO_HEADPHONES_AND_MIC:
				return "headphones/mic";
			case Ti.Media.AUDIO_HEADPHONES:
				return "headphones";
			case Ti.Media.AUDIO_LINEOUT:
				return "lineout";
			case Ti.Media.AUDIO_SPEAKER:
				return "speaker";
			case Ti.Media.AUDIO_MICROPHONE:
				return "microphone";
			case Ti.Media.AUDIO_MUTED:
				return "silence switch on";
			case Ti.Media.AUDIO_UNAVAILABLE:
				return "unavailable";
			case Ti.Media.AUDIO_UNKNOWN:
				return "unknown";
		}
	}

	var duration = 0;

	function showLevels() {'use strict';
		var peak, avg;
		peak = Ti.Media.peakMicrophonePower;
		avg = Ti.Media.averageMicrophonePower;
		duration += 1;
	}

	var filePath;

	speechButton.addEventListener('click', function() {'use strict';
		//filePath = null;
		//alert('speechButton Clicked');
		Ti.API.debug('speechButton Clicked');
		Ti.API.info(recording);
		if (recording.recording) {
			//alert('recording: '+recording.recording);
			file = recording.stop();
			Ti.API.info('Recording Stopped');
			Ti.API.info('Recorded FileSize: ' + file.size);
			var tempFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'tempBroadCast.wav');
			tempFile.write(file);
			speechButton.backgroundImage = 'micon.png';
			Ti.API.info('Button backgroundImage changed');
			clearInterval(timer);
			Ti.API.info("Timer stopped");
			Ti.Media.stopMicrophoneMonitor();
			Ti.API.info("Microphone monitoring stopped");
			createSpechToText();
		} else {
			if (!Ti.Media.canRecord) {
				Ti.UI.createAlertDialog({
					title : 'Error!',
					message : 'No audio recording hardware is currently connected.'
				}).show();
				return;
			}
			//alert('speechButton else');
			speechButton.backgroundImage = 'micoff.png';
			recording.start();
			Ti.API.info("Recording started...");
			Ti.Media.startMicrophoneMonitor();
			Ti.API.info("Microphone monitoring started");
			duration = 0;
			timer = setInterval(showLevels, 1000);
		}
	});

	function createSpechToText() {
		Ti.API.info('speechToTextButton Button Clicked.');
		var argument = {
			'xSpeechContext' : 'BusinessSearch',
			'contentType' : 'audio/wav',
			'accept' : 'application/json'
		};
		if (Ti.Platform.osname !== 'android') {
			argument.filePath = filePath ? filePath : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'tempBroadCast.wav').nativePath;
		}

		attAPIs.ATT.Speech.speechToText(argument, function(data) {
			//alert('speechToText: ');
			if (argument.accept === 'application/json') {
				//alert('if..');
				var dataJson = JSON.parse(data);
				//alert(dataJson);
				bcMessageArea.value = dataJson.Recognition.NBest[0].ResultText;
			} else {
				//alert('else..');
				Ti.API.info('Success Callback:' + JSON.stringify(data));
				var dataJson = JSON.parse(data);
				bcMessageArea.value = dataJson.Recognition.NBest[0].ResultText;
			}
		});
	}

}
bcPhoneNosField = Ti.UI.createTextField({
	top : 170,
	left : '5%',
	right : '5%',
	height : Ti.UI.Android ? "40dp" : 40,
	borderColor : 'black',
	color : 'black',
	backgroundColor : '#FFFFFF',
	//hintText : "4257484745,4252143421"
	hintText : '  Enter phone number(s) here'
});
broadcastWindow.add(bcPhoneNosField);

var bcContactsButton = Ti.UI.createButton({
	title : 'Server Contacts',
	top : 240,
	left : '5%',
	//right : '5%',
	width : '45%',
	height : Ti.UI.Android ? "30dp" : 30
});
broadcastWindow.add(bcContactsButton);
bcContactsButton.addEventListener('click', function(e) {
	createContactsData();
});

var bcPhoneContactsButton = Ti.UI.createButton({
	title : 'Phone Contacts',
	top : 240,
	left : '55%',
	right : '5%',
	//width : 125,
	height : Ti.UI.Android ? "30dp" : 30
});
broadcastWindow.add(bcPhoneContactsButton);
bcPhoneContactsButton.addEventListener('click', function(e) {
	Titanium.Contacts.showContacts({
		selectedProperty : function(e) {
			Ti.API.info("Selected phone #: " + e.value);
			if (bcPhoneNosField.value === '') {
				bcPhoneNosField.value = modifyContacts(e.value);
			} else {
				bcPhoneNosField.value += "," + modifyContacts(e.value);
			}
		}
	});
});

var createCMSSessionBCButton = Ti.UI.createButton({
	title : 'Broadcast',
	top : 290,
	left : '5%',
	right : '5%',
	height : Ti.UI.Android ? "30dp" : 30
});
broadcastWindow.add(createCMSSessionBCButton);

//On Button Click user call method 'createSession'
createCMSSessionBCButton.addEventListener('click', function() {"use strict";
	Ti.API.info('BroadCast Button Clicked.');
	var phoneNosArray = new Array();
	phoneNosArray = bcPhoneNosField.value.split(",");
	if (bcMessageArea.value === '') {
		alert('Please enter message.');
		return;
	}
	if (bcPhoneNosField.value === '') {
		alert('Please enter valid phone number.');
		return;
	}
	Ti.API.info('temp:' + phoneNosArray);
	Ti.API.info(phoneNosArray);

	for (var i = 0; i < phoneNosArray.length; i++) {
		if (phoneNosArray[i] !== '') {
			attAPIs.ATT.CMS.createSession({
				'accept' : 'application/json',
				'contentType' : 'application/json',
				'body' : {
					"feature" : "broadcastMsg",
					"messageText" : bcMessageArea.value,
					"numberToDial" : phoneNosArray[i]
				}
			}, function(data) {
				Ti.API.info('Success Callback:' + JSON.stringify(data));
				openPopUp(data);
			}, function(error) {
				Ti.API.error('Error Callback:' + error);
				openPopUp(JSON.stringify(error));
			});
		}
	}
});

function createContactsData() {
	var url = "https://ldev.code-api-att.com/ATTDPSDEMO/cliniccontacts.json";
	var xhrContacts = Ti.Network.createHTTPClient({
		onload : function(e) {
			// this.responseText holds the raw text return of the message (used for JSON)
			// this.responseXML holds any returned XML (used for SOAP web services)
			// this.responseData holds any returned binary data
			var data = JSON.parse(this.responseText);
			Ti.API.info('responseText: ' + this.responseText);
			createContactsWindow(data);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			alert('Error in getting Server Contacts. Please Try Again.');
		},
		timeout : 5000
	});

	xhrContacts.open("GET", url);
	xhrContacts.send();
}

function createContactsWindow(data) {
	var contactsWindow = Ti.UI.createWindow({
		modal : true,
		backgroundColor : 'white',
		title : 'Contacts'
	});

	contactsWindow.addEventListener('android:back', function(e) {
		contactsWindow.close();
	});

	var modalWinRightNavButton = Ti.UI.createButton({
		style : Ti.UI.iPhone.SystemButtonStyle.DONE,
		title : 'Done'
	});
	var contactNoRow, contactNumRows = [];
	modalWinRightNavButton.addEventListener('click', function() {"use strict";
		var phoneNumbersList = "";
		//alert(contactNumRows.length + ' :len');
		for (var i = 0; i < contactNumRows.length; i++) {
			if (contactNumRows[i].hasCheck) {
				if (bcPhoneNosField.value.length === 0) {
					//alert('if: ' + bcPhoneNosField.value.length);
					phoneNumbersList = modifyContacts(contactNumRows[i].phoneNo);
				} else {
					//alert('else: ' + bcPhoneNosField.value.length);
					phoneNumbersList = bcPhoneNosField.value + "," + modifyContacts(contactNumRows[i].phoneNo);
				}
				bcPhoneNosField.value = phoneNumbersList;
			}
		}

		contactsWindow.close();
	});
	// //For Iphone Only.
	if (Titanium.Platform.osname !== "android") {
		contactsWindow.setRightNavButton(modalWinRightNavButton);
	}

	if (Titanium.Platform.osname === "android") {
		var menuBarView = Titanium.UI.createView({
			top : 0,
			left : 0,
			right : 0,
			height : 50,
			backgroundColor : '#8181F7'
		});

		var titleLabel = Titanium.UI.createLabel({
			text : 'Contacts',
			textAlign : 'center',
			top : 5,
			width : 'auto',
			color : 'white',
			font : {
				fontSize : 24,
				fontWeight : 'bold'
			}
		});
		menuBarView.add(titleLabel);

		var rightBtn = Ti.UI.createButton({
			title : 'Done',
			width : 65,
			height : 40,
			top : 5,
			right : 5,
			color : 'black',
			borderRadius : 4,
			font : {
				fontSize : 14,
				fontFamily : 'Helvetica Neue'
			},
			borderColor : '#B03F02'
		});

		rightBtn.addEventListener('click', function(e) {
			var phoneNumbersList = "";
			for (var i = 0; i < contactNumRows.length; i++) {
				if (contactNumRows[i].hasCheck) {
					if (bcPhoneNosField.value.length === 0) {
						phoneNumbersList = modifyContacts(contactNumRows[i].phoneNo);
					} else {
						phoneNumbersList = bcPhoneNosField.value + "," + modifyContacts(contactNumRows[i].phoneNo);
					}
					bcPhoneNosField.value = phoneNumbersList;
				}
			}
			contactsWindow.close();
		});

		menuBarView.add(rightBtn);
		contactsWindow.add(menuBarView);
	}

	var doctorDetails = data.Contacts.Doctor;
	var patientDetails = data.Contacts.Patient;

	var contactDetails = [];

	for (var i = 0; i < doctorDetails.length; i++) {
		contactDetails.push(doctorDetails[i]);
	}
	for (var j = 0; j < patientDetails.length; j++) {
		contactDetails.push(patientDetails[j]);
		var notChecked = true;
	}
	Ti.API.info('contactDetails: ' + contactDetails);

	for (var contactCnt = 0; contactCnt < contactDetails.length; contactCnt++) {
		var title = contactDetails[contactCnt].name + " (" + contactDetails[contactCnt].number + ")";
		contactNoRow = Ti.UI.createTableViewRow({
			title : title,
			text : title,
			hasCheck : false
		});
		contactNoRow.phoneNo = contactDetails[contactCnt].number;
		contactNumRows.push(contactNoRow);
	}

	var tableview = Ti.UI.createTableView({

	});
	if (Titanium.Platform.osname === "android") {
		tableview.top = 50;
	}
	tableview.data = contactNumRows;
	var checked;
	tableview.addEventListener('click', function(e) {
		for (var i = 0; i < contactNumRows.length; i++) {
			if ((e.source.text === contactNumRows[i].text)) {
				checked = contactNumRows[i].hasCheck;
				if (checked) {
					Ti.API.info('hasCheck1: ' + contactNumRows[i].hasCheck);
					contactNumRows[i].hasCheck = false;
				}
				if (!checked) {
					Ti.API.info('hasCheck2: ' + contactNumRows[i].hasCheck);
					contactNumRows[i].hasCheck = true;
				}
			}
		}
	});

	contactsWindow.add(tableview);
	contactsWindow.open();
}

function modifyContacts(num) {
	var stripSymbols = num;
	for (var i = 0; i < stripSymbols.length; i++) {
		stripSymbols = stripSymbols.replace('-', '');
		stripSymbols = stripSymbols.replace(' ', '');
		stripSymbols = stripSymbols.replace('(', '');
		stripSymbols = stripSymbols.replace(')', '');
	}
	return stripSymbols;
}