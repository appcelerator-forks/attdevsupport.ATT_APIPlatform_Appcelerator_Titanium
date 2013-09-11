var mainWindow = Ti.UI.currentWindow;

var btnTransacrtion = Ti.UI.createButton({
	title : 'Single Pay',
	top : Ti.UI.Android ? "10dp" : 10,
	width : '100%'
});

var btnSubscription = Ti.UI.createButton({
	title : 'Subscription',
	top : Ti.UI.Android ? "50dp" : 50,
	width : '100%'
});

mainWindow.add(btnTransacrtion);
mainWindow.add(btnSubscription);

btnTransacrtion.addEventListener('click', function(e) {
	Ti.API.info('Single Pay Button Clicked.');
	openWindow("paymenttransaction.js", "Single Pay");
});

btnSubscription.addEventListener('click', function(e) {
	Ti.API.info('Subscription Button Clicked.');
	openWindow("paymentsubscription.js", "Subscription");
});

function openWindow(url, title) {
	var win = Ti.UI.createWindow({
		url : url,
		backgroundColor : 'white',
		modal : true,
		title : title
	});
	win.open();
}

