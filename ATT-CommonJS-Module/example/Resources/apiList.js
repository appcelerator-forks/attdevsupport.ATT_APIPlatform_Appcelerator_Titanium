/**
 * @author GlobalLogic
 */
// Create a TableView.
var apiList = Ti.UI.createTableView();
var row,lblTitleName;
var addApi = function(titleName, url) {
	'use strict';
	row = Ti.UI.createTableViewRow({
		height : Ti.UI.Android ? '35dp' : 48,
		id : titleName,
		hasChild : true,
		url : url
	});
	lblTitleName = Ti.UI.createLabel({
		left : 10,
		height : Ti.UI.Android ? '30dp' : 30,
		width : Ti.UI.Android ? '250dp' : 320,
		font : {
			fontWeight : 'bold',
			fontSize : '15'
		},
		text : titleName,
		color : 'black'
	});
	row.add(lblTitleName);
	return row;
};

var i;
var data = ['SMS', 'MMS', 'Location', 'WAP Push', 'In App Messaging from Mobile Number', 'Speech', 'Payment'];
var dataUrl = ['sms.js', 'mms.js', 'deviceLocation.js', 'wapPush.js', 'mobo.js', 'speech_useCase.js', 'payment.js'];

for ( i = 0; i < data.length; i+=1) {
	apiList.appendRow(addApi(data[i], dataUrl[i]));
}

if (Titanium.Platform.osname !== "android") {
	var currentWin = Ti.UI.currentWindow;
}

// Listen for click events.
apiList.addEventListener('click', function(e) {"use strict";
	Ti.API.info(e.rowData.id + ' clicked.');
	if (e.rowData.id) {
		var win = Titanium.UI.createWindow({
			url : e.rowData.url,
			title : e.rowData.id,
			backgroundColor : '#fff'
		});
		if (Titanium.Platform.osname !== "android") {
			win.navGroup = currentWin.navGroup;
			currentWin.navGroup.open(win);
		} else {
			win.open();
		}
	}
});

// Add to the parent view.
Ti.UI.currentWindow.add(apiList);
