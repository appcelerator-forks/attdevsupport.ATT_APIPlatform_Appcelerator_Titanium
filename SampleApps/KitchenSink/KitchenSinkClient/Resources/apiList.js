/**
 * @author GlobalLogic
 */
'use strict';

// Create a TableView.
var apiList = Ti.UI.createTableView(),
    isAndroid = (Titanium.Platform.osname !== "android"),
    row, lblTitleName;

function addApi(titleName, url) {
	row = Ti.UI.createTableViewRow({
		height : 48,
		id : titleName,
		hasChild : true,
		url : url
	});
	lblTitleName = Ti.UI.createLabel({
		left : 10,
		height : Ti.UI.Android ? '30dp' : 30,
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

var data = ['SMS', 'MMS', 'Location', 'In App Messaging from Mobile Number', 'Speech', 'Payment', 'Call Management'];
var dataUrl = ['sms.js', 'mms.js', 'deviceLocation.js', 'immn.js', 'speech_useCase.js', 'payment.js', 'cms.js'];

for (var i = 0, l = data.length; i < l; i += 1) {
	apiList.appendRow(addApi(data[i], dataUrl[i]));
}

if (isAndroid) {
	var currentWin = Ti.UI.currentWindow;
}

// Listen for click events.
apiList.addEventListener('click', function(e) {
	Ti.API.info(e.rowData.id + ' clicked.');
	if (e.rowData.id) {
		var win = Titanium.UI.createWindow({
			url : e.rowData.url,
			title : e.rowData.id,
			backgroundColor : '#fff'
		});
		if (isAndroid) {
			win.navGroup = currentWin.navGroup;
			currentWin.navGroup.open(win);
		} else {
			win.open();
		}
	}
});

// Add to the parent view.
Ti.UI.currentWindow.add(apiList);
