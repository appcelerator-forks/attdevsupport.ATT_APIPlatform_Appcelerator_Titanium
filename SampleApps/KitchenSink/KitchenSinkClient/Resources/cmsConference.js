//Att common JS module needs to be required.
var attAPIs = require('att');

/*Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
 and creating sample Application.*/

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';
var cmsIds = [];
var sessionIDs = [];
var phoneNosArray = new Array();
var confNos = [];

//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

var confPhoneNosField;

/** Conference Window **/
var conferenceWindow = Ti.UI.currentWindow;
var conferenceWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

conferenceWinRightNavButton.addEventListener('click', function() {"use strict";
	conferenceWindow.close();
});

//For Iphone Only.
if (Titanium.Platform.osname !== "android") {
	conferenceWindow.setRightNavButton(conferenceWinRightNavButton);
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

/** Conference Window Components **/
confPhoneNosField = Ti.UI.createTextField({
	top : 40,
	right : '5%',
	left : '5%',
	value : '',
	height : Ti.UI.Android ? "40dp" : 40,
	borderColor : 'black',
	color : 'black',
	backgroundColor : '#FFFFFF',
	//hintText : "4257484745,4252143421"
	hintText : '  Enter phone number(s) here'
});
conferenceWindow.add(confPhoneNosField);

var confContactsButton = Ti.UI.createButton({
	title : 'Server Contacts',
	top : 110,
	left : '5%',
	width : '45%',
	height : Ti.UI.Android ? "30dp" : 30
});
conferenceWindow.add(confContactsButton);

confContactsButton.addEventListener('click', function(e) {
	createContactsData();
});

var confPhoneContactsButton = Ti.UI.createButton({
	title : 'Phone Contacts',
	top : 110,
	left : '55%',
	right : '5%',
	//width : 125,
	height : Ti.UI.Android ? "30dp" : 30
});

conferenceWindow.add(confPhoneContactsButton);

confPhoneContactsButton.addEventListener('click', function(e) {
	Titanium.Contacts.showContacts({
		selectedProperty : function(event) {
			Ti.API.info("Selected phone #: " + event.value);
			Ti.API.info("Type of phone #: " + event.label);
			if (confPhoneNosField.value === '') {
				confPhoneNosField.value = modifyContacts(event.value);
			} else {
				confPhoneNosField.value += "," + modifyContacts(event.value);
			}
		}
	});
});

var createConferenceButton = Ti.UI.createButton({
	title : 'Conference',
	top : 180,
	left : '5%',
	right : '5%',
	//width : 200,
	height : Ti.UI.Android ? "30dp" : 30
});

conferenceWindow.add(createConferenceButton);

createConferenceButton.addEventListener('click', function() {"use strict";
	Ti.API.info('Conference Button Clicked.');
	cmsIds = [];
	sessionIDs = [];

	//var phoneNosArray = new Array();
	phoneNosArray = confPhoneNosField.value.split(",");
	//confNos = phoneNosArray;
	//alert(phoneNosArray);
	var nCnt;
	for ( nCnt = 0; nCnt < phoneNosArray.length && 0 < phoneNosArray[nCnt].length; nCnt++) {
		cmsIds[nCnt] = new Object();
		//alert(nCnt + " :[nCnt]: " + phoneNosArray[nCnt]);
		cmsIds[nCnt] = {
			number : phoneNosArray[nCnt],
			sessionId : ""
		};
		//cmsIds[nCnt].number = phoneNosArray[nCnt];
		//cmsIds[nCnt].sessionId = 0;
		//CALL_ATT.conference(phoneNosArray[nCnt], onConferenceSuccess);
	}
	//alert('phoneNosArray');
	//alert(phoneNosArray);
	if (confPhoneNosField.value === '') {
		alert('Please enter valid phone number.');
		return;
	}
	Ti.API.info('temp:' + phoneNosArray);
	Ti.API.info(phoneNosArray);

	for (var phNo = 0; phNo < phoneNosArray.length; phNo++) {
		if (phoneNosArray[phNo] !== '') {
			attAPIs.ATT.CMS.createSession({
				'accept' : 'application/json',
				'contentType' : 'application/json',
				'body' : {
					"feature" : "makeConf",
					"numberToDial" : phoneNosArray[phNo]
				}
			}, function(data) {
				Ti.API.info('Success Callback:' + data);
				Ti.API.info('phNo:' + phNo);
				var id = JSON.parse(data).id;
				sessionIDs.push(id);
				Ti.API.info(sessionIDs);
				openPopUp(data);
			}, function(error) {
				sessionIDs.push('CallFailed');
				Ti.API.error('Error Callback:' + error);
				openPopUp(JSON.stringify(error));
			});
		}
	}
});

var sendSignalBtn = Ti.UI.createButton({
	title : 'Send Signal',
	top : 235,
	left : '5%',
	right : '5%',
	height : Ti.UI.Android ? "30dp" : 30
});
conferenceWindow.add(sendSignalBtn);

sendSignalBtn.addEventListener('click', function() {"use strict";
	for (var phNo = 0, id = 0; phNo < phoneNosArray.length, id < sessionIDs.length; phNo++, id++) {
		//alert(phNo + ' :id: ' + id);
		//alert('sessionId: ' + sessionIDs[id]);
		if (phNo === id)
			cmsIds[phNo].sessionId = sessionIDs[id];
	}
	if (phoneNosArray.length === 0 || sessionIDs.length === 0) {
		alert('Please make a conference call.');
		return;
	}
	createConfIdWindow(cmsIds);
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
		title : 'Close'
	});
	var contactNoRow, contactNumRows = [];
	modalWinRightNavButton.addEventListener('click', function() {"use strict";
		var phoneNumbersList = "";
		for (var i = 0; i < contactNumRows.length; i++) {
			if (contactNumRows[i].hasCheck) {
				if (confPhoneNosField.value.length === 0) {
					phoneNumbersList = modifyContacts(contactNumRows[i].phoneNo);
				} else {
					phoneNumbersList = confPhoneNosField.value + "," + modifyContacts(contactNumRows[i].phoneNo);
				}
				confPhoneNosField.value = phoneNumbersList;
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
			title : 'Close',
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
					if (confPhoneNosField.value.length === 0) {
						phoneNumbersList = modifyContacts(contactNumRows[i].phoneNo);
					} else {
						phoneNumbersList = confPhoneNosField.value + "," + modifyContacts(contactNumRows[i].phoneNo);
					}
					confPhoneNosField.value = phoneNumbersList;
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
		data : contactNumRows,
		top : 0
	});
	if (Titanium.Platform.osname === "android") {
		tableview.top = 50;
	}
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

function createConfIdWindow(data) {
	var confIdWindow = Ti.UI.createWindow({
		modal : true,
		backgroundColor : 'white',
		title : 'Cancel Session'
	});

	confIdWindow.addEventListener('android:back', function(e) {
		confIdWindow.close();
	});

	var modalWinRightNavButton = Ti.UI.createButton({
		style : Ti.UI.iPhone.SystemButtonStyle.DONE,
		title : 'Close'
	});

	modalWinRightNavButton.addEventListener('click', function() {"use strict";
		confIdWindow.close();
	});
	// //For Iphone Only.
	if (Titanium.Platform.osname !== "android") {
		confIdWindow.setRightNavButton(modalWinRightNavButton);
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
			text : 'Cancel Session',
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
			title : 'Close',
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
			confIdWindow.close();
		});

		menuBarView.add(rightBtn);
		confIdWindow.add(menuBarView);
	}

	var sessionIdRow, sessionIdRows = [];
	for (var idLen = 0; idLen < cmsIds.length; idLen++) {
		//var title = cmsIds[idLen].sessionId + " (" + cmsIds[idLen].number + ")";
		var title = cmsIds[idLen].number;
		sessionIdRow = Ti.UI.createTableViewRow({
			title : title,
			text : title,
			backgroundColor : 'white',
			hasCheck : false,
			left : 0,
			width : '70%'
			//height : 100,
		});
		sessionIdRow.selectedPhoneNoId = cmsIds[idLen].sessionId;
		sessionIdRows.push(sessionIdRow);
	}

	var tableIdview = Ti.UI.createTableView({
		top : 0,
		height : Ti.UI.Android ? '200dp' : 200,
		data : sessionIdRows
	});
	if (Titanium.Platform.osname === "android") {
		tableIdview.top = 50;
	}
	var checked, checkedLen = 0;
	var selectedPhoneId;
	tableIdview.addEventListener('click', function(e) {
		for (var i = 0; i < sessionIdRows.length; i++) {
			//alert('text: ' + e.source.text);
			if ((e.source.text === sessionIdRows[i].text)) {
				checked = sessionIdRows[i].hasCheck;
				if (checked) {
					Ti.API.info('hasCheck1: ' + sessionIdRows[i].hasCheck);
					sessionIdRows[i].hasCheck = false;
					checkedLen--;
				}
				if (!checked) {
					Ti.API.info('hasCheck2: ' + sessionIdRows[i].hasCheck);
					sessionIdRows[i].hasCheck = true;
					selectedPhoneId = sessionIdRows[i].selectedPhoneNoId;
					//alert('id: '+selectedPhoneId);
					checkedLen++;
				}
			}
		}
	});

	confIdWindow.add(tableIdview);
	var cancelSignalBtn = Ti.UI.createButton({
		title : 'Cancel Signal',
		top : 330,
		left : '5%',
		right : '5%',
		height : Ti.UI.Android ? "30dp" : 30
	});
	confIdWindow.add(cancelSignalBtn);

	cancelSignalBtn.addEventListener('click', function(e) {
		//alert(checked + ' :checkedLen: ' + checkedLen);
		if (checkedLen === 0) {
			alert('Please Select One Number to Cancel Call.');
			return;
		}
		if (checkedLen > 1) {
			alert('Please Select Only One Number to Cancel Call.');
			return;
		}
		Ti.API.info('selectedPhoneId: ' + selectedPhoneId);
		//alert('id1: ' + selectedPhoneId);
		attAPIs.ATT.CMS.sendSignal({
			'accept' : 'application/json',
			'contentType' : 'application/json',
			'cmsId' : selectedPhoneId,
			'body' : {
				"signal" : "exit"
			}
		}, function(data) {
			Ti.API.info('Success Callback:' + data);
			openPopUp(data);
		}, function(error) {
			Ti.API.error('Error Callback:' + error);
			openPopUp(JSON.stringify(error));
		});
	});
	confIdWindow.open();
}
