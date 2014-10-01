var mainWindow = Ti.UI.currentWindow;
var util = require('util');
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
	var  transactionWindow = util.makeWindow("paymenttransaction.js","Single Pay");
	transactionWindow.open();
});

btnSubscription.addEventListener('click', function(e) {
	Ti.API.info('Subscription Button Clicked.');
	var  subscriptionWindow = util.makeWindow("paymentsubscription.js","Subscription");
	subscriptionWindow.open();
});
