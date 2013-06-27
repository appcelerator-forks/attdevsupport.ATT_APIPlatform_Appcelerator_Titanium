
'use strict';

// Create a TableView.
var apiList = Ti.UI.createTableView(),
    isAndroid = (Titanium.Platform.osname === 'android');

function addApi(titleName, url) {
	var row = Ti.UI.createTableViewRow({
		id : titleName, url : url, height : 48,
		ellipsize: true, hasChild : true
	});
	row.add(Ti.UI.createLabel({
        text : titleName, left : 10, color : 'black',
        height : Ti.UI.Android ? '30dip' : 30,
        font : { fontWeight : 'bold', fontSize : '15dip' }
    }));
    
	return row;
};

var apiDetails = [
   //{ url: 'advertisement.js',   title: 'Advertisement' }
   { url: 'sms.js',             title: 'SMS' },
   { url: 'mms.js',             title: 'MMS' },
   { url: 'deviceLocation.js',  title: 'Location'},
   { url: 'immn.js',            title: 'In App Messaging from Mobile Number' },
   { url: 'speech_useCase.js',  title: 'Speech' },
   { url: 'speechCustom.js',  title: 'Speech Custom' },
   //{ url: 'texttospeech.js',    title: 'Text To Speech' },
   { url: 'payment.js',         title: 'Payment' },
   { url: 'cms.js',             title: 'Call Management' }
];

apiDetails.forEach(function(apiDetail) {
    apiList.appendRow(addApi(apiDetail.title, apiDetail.url));
});

// Listen for click events.
apiList.addEventListener('click', function(e) {
	Ti.API.info(e.rowData.id + ' clicked.');
	if(e.rowData.id) {
		var win = Titanium.UI.createWindow({
			title : e.rowData.id, url : e.rowData.url, backgroundColor : '#fff'
		});
		
		if(isAndroid) {
			win.open();
		} else {
			var currentWin = Ti.UI.currentWindow;
			win.navGroup = currentWin.navGroup;
			currentWin.navGroup.open(win);
		}
	}
});

// Add to the parent view.
Ti.UI.currentWindow.add(apiList);
