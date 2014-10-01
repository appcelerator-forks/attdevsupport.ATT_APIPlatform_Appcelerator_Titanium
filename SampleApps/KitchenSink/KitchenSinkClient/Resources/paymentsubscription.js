//Att common JS module needs to be required.
var attAPIs = require('att');
var util = require('util');
//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('scope');
var grantType = 'client_credentials';
var amount = Ti.App.Properties.getString('amount');
var description = Ti.App.Properties.getString('description');
attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType);

var webview = null;

var mainWindow = Ti.UI.currentWindow;

var responseWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response'
});

if (Titanium.Platform.osname !== "android") {
	var responseNav = Ti.UI.iOS.createNavigationWindow({
	    modal: true,
		window: responseWindow
	});
}
function checkSubCode () {
	if(Ti.App.SubscriptionAuthCode) {
		return true;
	} else {
		return false;
	}
}


function checkSubCode () {
	if(Ti.App.SubsConsumerId) {
		return true;
	} else {
		return false;
	}
}
responseWindow.addEventListener('android:back', function(e) {
	if (webview !== null) {
		responseWindow.remove(webview);
		webview = null;
	}
	responseWindow.close();
});

var responseWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

responseWinRightNavButton.addEventListener('click', function() {"use strict";
	if (webview !== null) {
		responseWindow.remove(webview);
		webview = null;
	}
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
	responseLable.text = null;
	responseLable.text = 'RESPONSE :' + data;
	if (Titanium.Platform.osname !== "android") {
		responseNav.open();
	}
	else {
		responseWindow.open();
	}
}

var header = Ti.UI.createLabel({
	text : description + ' USD ' + amount + ' / mo + tax',
	top : 2,
	left : 50
});

var setSubscription = Ti.UI.createButton({
	title : 'Charge User(Subscription)',
	top : Ti.UI.Android ? "30dp" : 30,
	width : '100%',
	topInteger : 30
});

var transactionTable = Ti.UI.createTableView({
	backgroundColor : "white",
	data : [],
	top : Ti.UI.Android ? "195dp" : 195,
	width : '100%',
	height : Ti.UI.Android ? '150dp' : 150,
	borderColor : 'black',
	visible : false
});

var getSubscriptionStatus = Ti.UI.createButton({
	title : 'Subscription Status',
	top : Ti.UI.Android ? "75dp" : 75,
	width : '100%',
	topInteger : 75,
	touchEnabled : checkSubCode();
});

var getSubscriptionDetails = Ti.UI.createButton({
	title : 'Subscription Details',
	top : Ti.UI.Android ? "115dp" : 115,
	width : '100%',
	topInteger : 115,
	touchEnabled : checkSubId();
});



var rowHeight = 35, tableHeight = 0, intTableHeight = 0, height = 5;


var createTableViewRow = function(transactionId) {
	var row = Ti.UI.createTableViewRow({
		backgroundColor : '#AFEEEE',
		height : Ti.UI.Android ? '35dp' : 35,
		name : transactionId
	});
	intTableHeight = intTableHeight + rowHeight;
	tableHeight = Ti.UI.Android ? intTableHeight + 'dp' : intTableHeight;

	var lbltransaction = Ti.UI.createLabel({
		left : 10,
		height : Ti.UI.Android ? '35dp' : 30,
		width : Ti.UI.Android ? '200dp' : 200,
		text : transactionId,
		color : 'black',
		id : transactionId
	});
	var view = Ti.UI.createView({
	});
	var refundButton = Ti.UI.createButton({
		right : 10,
		height : Ti.UI.Android ? '35dp' : 30,
		title : 'Refund',
		id : transactionId
	});
	view.add(refundButton);
	view.add(lbltransaction);
	row.add(view);
	row.classname = 'rowWithButton';

	refundButton.addEventListener('click', function(e) {
		Ti.API.info('Refund Button Clicked.');
		var rowToRemoved = e.source.id;

		/**
		 *@param body- Will contain three values TransactionOperationStatus,RefundReasonCode and RefundReasonCode
		 *@param contentType- format in which data is to be sent
		 * Example:
		 *  contentType @ application/json
		 *  "body":{"TransactionOperationStatus" :"Refund","ReasonCode":"X", "RefundReasonText" : "Test JSON"},
		 * contentType @ application/xml
		 *  "body" : "<RefundTransactionRequest><TransactionOperationStatus>Refunded</TransactionOperationStatus><RefundReasonCode>1</RefundReasonCode><RefundReasonText>Customer was unhappy</RefundReasonText></RefundTransactionRequest>",
		 **/

		attAPIs.ATT.Payment.refundTransaction({
			"contentType" : "application/xml",
			"body" : "<RefundTransactionRequest><TransactionOperationStatus>Refunded</TransactionOperationStatus><RefundReasonCode>1</RefundReasonCode><RefundReasonText>Customer was unhappy</RefundReasonText></RefundTransactionRequest>",
			'transactionId' : transactionId,
			'action' : 'refund'
		}, function(data) {
			Ti.API.info('Success Callback:' + data);
			openPopUp(data);
			var index = transactionTable.getIndexByName(rowToRemoved);
			transactionTable.deleteRow(index);
			if (transactionTable.data[0].rows.length < 1) {
				transactionTable.visible = false;
			}
			intTableHeight = transactionTable.intHeight - rowHeight;
			tableHeight = Ti.UI.Android ? intTableHeight + 'dp' : intTableHeight;
			if (transactionTable.height < 210) {
				transactionTable.height = tableHeight;
				transactionTable.intHeight = intTableHeight;
			}

		}, function(error) {
			Ti.API.error('Error Callback:' + error);
		});
	});
	transactionTable.appendRow(row);
	if (transactionTable.height < 210) {
		transactionTable.height = tableHeight;
		transactionTable.intHeight = intTableHeight;
	}
};

/**
 *@param data is the payload to be signed by the AT&T API Gateway.
 *@param contentType- format in which data is to be sent
 * Example:
 *  contentType @ application/json
 *  "data":{
 "Amount" : '0.99',
 "Category" : 1,
 "Channel" : "MOBILE_WEB",
 "Description" : "TEST",
 "MerchantTransactionId" : "skuser" + ticks,
 "MerchantProductId" : "l" + ticks,
 "MerchantPaymentRedirectUrl" : Ti.App.Properties.getString('paymentServerUrl'),
 "MerchantSubscriptionIdList" : 'ML1234567890',
 "IsPurchaseOnNoActiveSubscription" : false,
 "SubscriptionRecurrences" : 99999,
 "SubscriptionPeriod" : 'MONTHLY',
 "SubscriptionPeriodAmount" : 1
 },
 * contentType @ application/xml
 "body":"<NewTransactionRequest> <Amount>0.99</Amount> <Category>1</Category> <Channel>MOBILE_WEB</Channel> <Description>better than level 1</Description> <MerchantTransactionId>skuser2985trx20111029175423</MerchantTransactionId> <MerchantProductId>level2</MerchantProductId>  <MerchantPaymentRedirectUrl>http://somewhere.com/PurchaseFulfillment </MerchantPaymentRedirectUrl> </NewTransactionRequest>",
 **/
function signPayload() {
	var date = new Date(), ticks = date.getTime(), min = 1000000000, max = 9999999999, rnd = Math.floor(Math.random() * (max - min + 1)) + min, notaryData = {
		"Amount" : amount,
		"Category" : 1,
		"Channel" : "MOBILE_WEB",
		"Description" : description,
		"MerchantTransactionId" : "skuser" + rnd,
		"MerchantProductId" : "l" + rnd,
		"MerchantPaymentRedirectUrl" : Ti.App.Properties.getString('paymentServerUrl') ,
		"MerchantSubscriptionIdList" : 'ML' + rnd,
		"IsPurchaseOnNoActiveSubscription" : 'false',
		"SubscriptionRecurrences" : 99999,
		"SubscriptionPeriod" : 'MONTHLY',
		"SubscriptionPeriodAmount" : 1

	}, signedDocument = null, signature = null;

	attAPIs.ATT.Notary.signedPayload({
		'data' : notaryData,
		'clientId' : accessKey,
		'clientSecret' : secretKey,
		'contentType' : 'application/json'
	}, function(data) {
		Ti.API.info('Success Callback: ' + data);
		var dataJSON = JSON.parse(data);
		signedDocument = dataJSON.SignedDocument;
		signature = dataJSON.Signature;
		//New Subscription call
		attAPIs.ATT.Payment.newSubscription({
			"signedDocument" : signedDocument,
			"signature" : signature,
			'clientId' : accessKey
		}, function(data) {
			webview = Titanium.UI.createWebView({
				url : data
			});
			webview.addEventListener('load', function(e) {
				var url = webview.getUrl(), index;
				Ti.API.info('url ' + url);

				if (url.indexOf('SubscriptionAuthCode') !== -1) {
					index = url.indexOf("SubscriptionAuthCode");
					Ti.App.subscriptionAuthCode = url.substr(index + 21, url.length + 1);
					getSubscriptionStatus.setTouchEnabled(true);
					

					responseWindow.remove(webview);
					if (Titanium.Platform.osname !== "android") {
						responseNav.close();
					}
					else {
						responseWindow.close();
					}
				}
			});

			responseWindow.add(webview);
			if (Titanium.Platform.osname !== "android") {
				responseNav.open();
			}
			else {
				responseWindow.open();
			}

		}, function(error) {
			Ti.API.error('Error Callback:' + JSON.stringify(error));
			openPopUp(JSON.stringify(error));
		});

	}, function(error) {
		openPopUp(JSON.stringify(error));

	});
}

setSubscription.addEventListener('click', function() {
	Ti.API.info('Subscription Button Clicked.');
	signPayload();
});

/** getSubscriptionStatus can also have parameter
 MerchantTransactionId and SubscriptionId which we get in successful response of setSubscription
 **/
getSubscriptionStatus.addEventListener('click', function() {
	Ti.API.info('Get Subscription Status Button Clicked.');
	attAPIs.ATT.Payment.getSubscriptionStatus({
		"subscriptionAuthCode" : Ti.App.subscriptionAuthCode
	}, function(data) {
		var result = JSON.parse(data);
		Ti.App.MerchantSubscriptionId = result.MerchantSubscriptionId;
		Ti.API.info('Success Callback:' + data);

		if (Ti.App.SubscriptionId !== result.SubscriptionId) {
			Ti.App.SubscriptionId = result.SubscriptionId;
			Ti.App.SubsConsumerId = result.ConsumerId;
			getSubscriptionDetails.setTouchEnabled(true);
			createTableViewRow(result.SubscriptionId);
			transactionTable.visible = true;
			Ti.App.subscriptionAuthCode = null;
		}

	}, function(error) {
		Ti.API.error('Error Callback:' + error);
	});

});

getSubscriptionDetails.addEventListener('click', function() {
	Ti.API.info('Get Subscription Details Button Clicked.');
	attAPIs.ATT.Payment.getSubscriptionDetails({
		'consumerId' : Ti.App.SubsConsumerId,
		'merchantSubscriptionId' : Ti.App.MerchantSubscriptionId
	}, function(data) {
		Ti.API.info('Success Callback:' + data);
		openPopUp(data);
		Ti.App.SubsConsumerId = null;
		Ti.App.MerchantSubscriptionId = null;
	}, function(error) {
		Ti.API.error('Error Callback:' + error);
	});
});



mainWindow.add(header);
mainWindow.add(setSubscription);
mainWindow.add(getSubscriptionStatus);
mainWindow.add(getSubscriptionDetails);
mainWindow.add(transactionTable);
