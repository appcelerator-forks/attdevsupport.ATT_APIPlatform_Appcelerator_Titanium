var mainWindow = Ti.UI.currentWindow;

mainWindow.addEventListener('android:back', function(e) {
	mainWindow.close();
});

mainWindow.backgroundColor = '#8181F7';

var broadcastCMSButton = Ti.UI.createButton({
	title : 'CMS Broadcast',
	top : 100,
	left : '20%',
	right : '20%',
	//width : 200,
	height : Ti.UI.Android ? "30dp" : 30
});

var conferenceCMSButton = Ti.UI.createButton({
	title : 'CMS Conference',
	top : 200, 
	left : '20%',
	right : '20%',
	//width : 200,
	height : Ti.UI.Android ? "30dp" : 30
});

mainWindow.add(broadcastCMSButton);
mainWindow.add(conferenceCMSButton);

broadcastCMSButton.addEventListener('click', function(e) {
	Ti.API.info('broadcastCMS Button Clicked.');
	openWindow("cmsBroadcast.js", "Broadcast");
});

conferenceCMSButton.addEventListener('click', function(e) {
	Ti.API.info('conferenceCMS Button Clicked.')
	openWindow("cmsConference.js", "Conference");
});

function openWindow(url, title) {
	var win = Ti.UI.createWindow({
		url : url,
		backgroundColor : '#8181F7',
		modal : true,
		title : title
	});
	win.open();
}

