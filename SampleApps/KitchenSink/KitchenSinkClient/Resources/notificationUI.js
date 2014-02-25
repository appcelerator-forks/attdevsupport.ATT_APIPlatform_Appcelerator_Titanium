var attAPIs = require('att');

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var shortCode = Ti.App.Properties.getString('shortCode');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';

//pass accessKey and secretKey for authorization
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

var currentWindow = Ti.UI.currentWindow, tableHeight = Ti.UI.Android ? '0dp' : 0, rowHeight = Ti.UI.Android ? '35dp' : 35;
currentWindow.fullscreen = false;

var notificationUrl = Ti.App.Properties.getString('paymentServerUrl') + 'Notification.aspx';
var notificationId, selectedElement, selectedRow, acknowledgeNotifications = [];

var responseWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response'
});
var responseNav = Ti.UI.iOS.createNavigationWindow({
    modal: true,
	window: responseWindow
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
	responseNav.close();
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
	if (Titanium.Platform.osname !== "android") {
		responseNav.open();
	}
	else {
		responseWindow.open();
	}
}

var rightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

var transactionTable = Ti.UI.createTableView({
	backgroundColor : "white",
	data : [],
	top : 0,
	width : '100%',
	height : Ti.UI.Android ? '150dp' : 150,
	borderColor : 'black',
	visible : true
});

var btnGetNotification = Ti.UI.createButton({
	top : Ti.UI.Android ? "200dp" : 200,
	left : 100,
	title : 'Get Notification',
	enabled : false
});

var ackButton = Ti.UI.createButton({
	top : Ti.UI.Android ? "250dp" : 250,
	title : 'Acknowledge',
	left : 100,
	enabled : false
});

function callExternalUrl(url, params) {
	'use strict';
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			var json = JSON.parse(this.responseText);
			Ti.API.info('Notification Id List' + json.NotificationIdList);
			Ti.API.info('Transaction Id List' + json.TransactionIdList);
			if (json.NotificationIdList != undefined && json.TransactionIdList != undefined) {
				createNotificationTable(json.NotificationIdList, json.TransactionIdList);
			}
		},
		onerror : function(e) {
			Ti.API.error('Error Callback: ' + e);

		},
		timeout : 5000
	});
	xhr.open("GET", url);
	xhr.send(params);
}

function createNotificationTable(notificationIdList, transactionIdList) {
	var i, rowHeightCons = 40;
	tableHeight = notificationIdList.length * rowHeightCons;
	for ( i = 0; i < notificationIdList.length; i++) {
		createTableViewRow(notificationIdList[i], transactionIdList[i]);
	}
	transactionTable.height = Ti.UI.Android ? tableHeight + 'dp' : tableHeight;
	if (tableHeight < 150) {
		transactionTable.height = Ti.UI.Android ? tableHeight + 'dp' : tableHeight;
	} else {
		transactionTable.height = Ti.UI.Android ? '150dp' : 150;
	}
}

function createTableViewRow(notificationId, transactionId) {
	var row = Ti.UI.createTableViewRow({
		backgroundColor : 'white',
		height : Ti.UI.Android ? '40dp' : 40,
		name : notificationId,
		imageVisible : false,
		id : notificationId
	});
	var lblNotification = Ti.UI.createLabel({
		left : 10,
		height : Ti.UI.Android ? '35dp' : 50,
		width : Ti.UI.Android ? '200dp' : 270,
		text : transactionId,
		color : 'black',
		id : transactionId,
	});
	var selectedElement = Ti.UI.createImageView({
		image : '/tempAssets/complete.png',
		right : Ti.UI.Android ? '10dp' : 10,
		height : Ti.UI.Android ? '30dp' : 30,
		width : Ti.UI.Android ? '30dp' : 30,
		visible : false
	});
	row.add(lblNotification);
	row.add(selectedElement);
	row.classname = 'rowWithButton';
	transactionTable.appendRow(row);
};
var deleteNotificationFromXml = function() {
	var notificationIdList = "", i;
	if (acknowledgeNotifications.length > 0) {
		for ( i = 0; i < acknowledgeNotifications.length; i++) {
			notificationIdList += acknowledgeNotifications[i];
			notificationIdList += ",";
		}
		notificationIdList = notificationIdList.substring(0, notificationIdList.length - 1);
		callExternalUrl(notificationUrl, {
			"RequestType" : "POST",
			"NotificationId" : notificationIdList
		});
	}
};
rightNavButton.addEventListener('click', function() {"use strict";
	deleteNotificationFromXml();
	currentWindow.close();
});

currentWindow.addEventListener('android:back', function(e) {
	'use strict';
	deleteNotificationFromXml();
	currentWindow.close();
});
if (Titanium.Platform.osname !== "android") {
	currentWindow.setRightNavButton(rightNavButton);
}

callExternalUrl(notificationUrl, {
	"RequestType" : "GET",
	"NotificationType" : currentWindow.type
});

transactionTable.addEventListener('click', function(e) {
	'use strict';
	notificationId = e.row.id;

	if (selectedRow) {
		if (selectedRow === e.row) {
			e.row.imageVisible = !e.row.imageVisible;
			e.row.children[1].visible = e.row.imageVisible;
		} else {
			//for single selection,get all the rows and set their imageVisible to false.
			var data = transactionTable.data[0].rows;
			var count;
			for (count = 0; count < data.length; count += 1) {
				data[count].children[1].visible = false;
				data[count].imageVisible = false;
			}
			// set the imagevisible of selected Row to true.
			e.row.imageVisible = true;
			e.row.children[1].visible = true;
		}

	} else {
		e.row.imageVisible = true;
		e.row.children[1].visible = e.row.imageVisible;
	}
	selectedRow = e.row;
	if (e.row.imageVisible) {
		btnGetNotification.enabled = true;
		ackButton.enabled = true;
		return;
	}
	notificationId = null;
	btnGetNotification.enabled = false;
	ackButton.enabled = false;
});

btnGetNotification.addEventListener('click', function() {
	'use strict';
	Ti.API.info('Get Notification Button Clicked.');
	attAPIs.ATT.Payment.getNotification({
		'notificationId' : notificationId
	}, function(data) {
		openPopUp(data);
		Ti.API.info('Success Callback: ' + data);
	}, function(error) {
		openPopUp(error);
		Ti.API.error('Error Callback: ' + error);
	});
});

ackButton.addEventListener('click', function() {
	'use strict';
	attAPIs.ATT.httpTimeOut=300000;
	attAPIs.ATT.Payment.acknowledgeNotification({
		'notificationId' : notificationId
	}, function(data) {
		var result = JSON.parse(data);
		Ti.API.info('Success Callback: ' + data);
		var rowToRemoved = notificationId;
		var index = transactionTable.getIndexByName(rowToRemoved);
		transactionTable.deleteRow(index);

		btnGetNotification.enabled = false;
		ackButton.enabled = false;

		transactionTable.height = transactionTable.height - rowHeight;
		acknowledgeNotifications.push(notificationId);
		openPopUp(data);
	}, function(error) {
		Ti.API.error('Error Callback: ' + error);
		openPopUp(error);
	});
});

currentWindow.add(btnGetNotification);
currentWindow.add(ackButton);
currentWindow.add(transactionTable);
