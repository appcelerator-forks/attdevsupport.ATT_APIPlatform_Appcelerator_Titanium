//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('authScope');
var redirectUrl = Ti.App.Properties.getString('redirectUrl');

var util = require('util');

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

function authorize() {
    if(attAPIs.ATT.getCachedUserAuthToken()) {
        getLocation();
        return;
    }
    
    //Get the user authorization URI
    attAPIs.ATT.OAuth.obtainEndUserAuthorization({
        clientId: accessKey,
        scope: scope,
        redirectUrl: redirectUrl
    }, function(resp) {
        //Create a webview to take the user through user authorization and get the auth code
        util.UI.createGetAuthCodeView(mainWindow, JSON.parse(resp).uri, redirectUrl, function(resp) { //Success
            var authCode = resp.code;
            var grantType = 'authorization_code';
            attAPIs.ATT.authorize(accessKey, secretKey, scope, grantType, authCode);
            
            getLocation();
        }, 
        function(errorResp) { //User Auth Error
            var errString = JSON.stringify(errorResp, null, 3);
            Ti.API.error('User Auth Error: ' + errString);
            openPopUp(errString, true);
        });
    }, function(errorResp) { //Get User Auth URI Error
        Ti.API.error('Get User Auth URI Error: ' + errorResp);
        openPopUp(JSON.stringify(errorResp, null, 3));
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
