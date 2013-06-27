//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('authScope');
var redirectUrl = Ti.App.Properties.getString('redirectUrl');


var mainWindow = Ti.UI.currentWindow;

mainWindow.addEventListener('android:back', function(e) {'use strict';
	mainWindow.close();
});

var responseWindow = Ti.UI.createWindow({
	modal : true,
	backgroundColor : 'white',
	title : 'Response'
});

responseWindow.addEventListener('android:back', function(e) {'use strict';
	responseWindow.close();

});

var responseWinRightNavButton = Ti.UI.createButton({
	style : Ti.UI.iPhone.SystemButtonStyle.DONE,
	title : 'close'
});

responseWinRightNavButton.addEventListener('click', function() {"use strict";
	responseWindow.close();

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

function openPopUp(data) {'use strict';
	responseLable.text = null;
	responseLable.text = 'RESPONSE :' + data;
	responseWindow.open();
}


var locationButton = Ti.UI.createButton({
	title : 'Get Phone Location',
	top : 200
});
var noteLabel = Ti.UI.createLabel({
	top : 300,
	color : 'black',
	font : {
		fontSize : 10
	},
	text : 'Note:You need to authorize before getting your device location. Hence on clicking GetDeviceLocation Button you will be automatically asked from authorization.'
});
var mapview = Titanium.Map.createView({
	mapType : Titanium.Map.STANDARD_TYPE,
	region : {
		latitude : 33.74511,
		longitude : -84.38993,
		latitudeDelta : 0.5,
		longitudeDelta : 0.5
	},
	animate : true,
	regionFit : true,
	userLocation : true,
	bottom : 50,
	height : 150,
	width : '100%',
	visible : false
});
locationButton.addEventListener('click', function(e) {
	Ti.API.info('Location Button Clicked.');
	responseWindow.remove(mapview);
	responseLable.text = null;
	authorize();

});
mainWindow.add(locationButton);
mainWindow.add(noteLabel);

var isCalled = false;
function authorize() {

	
	attAPIs.ATT.OAuth.obtainEndUserAuthorization({
		'clientId' : accessKey,
		'scope' : scope,
		'redirectUrl' : redirectUrl
	}, function(data) {
		var isCode = true;
		responseWindow.open();
		var v = Ti.UI.createWebView({
			top : 0,
			height : Ti.UI.Android ? Titanium.Platform.displayCaps.platformHeight : '100%',
			width : Ti.UI.Android ? Titanium.Platform.displayCaps.platformWidth : '100%',
			left : 0,
			url : 'https://auth-api.att.com/user/login?client_id=' + accessKey + '&scope=' + scope + '&redirect_url=' + redirectUrl
			//url : 'https://auth-api.att.com/user/login?client_id=' + accessKey + '&scope=TL,MIM,IMMN&redirect_url=http://www.google.com'
		});
		v.addEventListener('load', function(e) {

			var url = v.url;
			if (url.indexOf('code') !== -1 && isCode === true) {
				isCode = false;
				var indexOfCode = url.indexOf("code");
				var locationAuthCode = url.substr(indexOfCode + 5, url.length + 1);
				responseWindow.remove(v);
				responseWindow.close();
				grantType = 'authorization_code';
				attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType, locationAuthCode);
				getLocation();

			}
		});
		responseWindow.add(v);
	}, function(error) {
		Ti.API.error('Error Callback:' + error);
		openPopUp(error);
	});


}

function getLocation() {
		attAPIs.ATT.Location.getDeviceLocation({
			'requestedAccuracy' : 9090,
			'tolerance' : 'DelayTolerant',
			'acceptableAccuracy' : 10000
		}, function(data) {
			var result = JSON.parse(data);
			Ti.API.info('Success Callback:' + data);
			openPopUp(data);
			mapview.visible = true;
			var region = {
				latitude : result.latitude,
				longitude : result.longitude,
				latitudeDelta : 0.5,
				longitudeDelta : 0.5
			};
			mapview.setRegion(region);

			var annotation = Titanium.Map.createAnnotation({
				latitude : result.latitude,
				longitude : result.longitude,
				pincolor : Titanium.Map.ANNOTATION_GREEN,
				animate : false
			});
			mapview.addAnnotation(annotation);
			responseWindow.add(mapview);

		}, function(error) {
			Ti.API.error('Error Callback:' + JSON.stringify(error));
			openPopUp(JSON.stringify(error));
		});
}
