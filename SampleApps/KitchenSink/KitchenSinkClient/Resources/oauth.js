
//Att common JS module needs to be required.
var attAPIs = require('att');

//Note: Application Developer should get access key and secret key by registering on www.developer.att.com website
//and creating sample Application.
// <module platform="commonjs" version="1.0.1">att</module>
var accessKey = Ti.App.Properties.getString('accessKey');
var secretKey = Ti.App.Properties.getString('secretKey');
var scope = Ti.App.Properties.getString('scope');


//pass accessKey and secretKey for authorization
Ti.API.log('Setting tokens');
attAPIs.ATT.authorize(accessKey, secretKey, scope);

//Helper functions and variables
var util = require('util'),
    forEach = util.forEach,
    copyObjTo = util.copyObjTo,
    createPicker = util.UI.createPicker,
    deviceState = util.state.device,
    isAndroid = deviceState.is.android,
    openPopUp = util.UI.createResponseWindow,
    constants = {
        margin: 10,
        buttonWidth: 90,
    };
    
    
//Set up main window
var mainWindow = Ti.UI.currentWindow;
mainWindow.layout = 'vertical';

mainWindow.addEventListener('android:back', function(e) {
    mainWindow.close();
});

var scrollView = Ti.UI.createScrollView({
    top: 0,
    layout:'vertical',
    height: Ti.UI.SIZE,
    width: Ti.UI.FILL,
   // height: 299,
    left: constants.margin, 
    right: constants.margin,
});
mainWindow.add(scrollView);

var UserAuthOptionView = Ti.UI.createView({
    top: 30,
    height: Ti.UI.SIZE,
    layout: 'vertical',
    borderColor: 'black',
    borderWidth: 1
});

var userAuthOptionView1 =  Ti.UI.createView ({
    top: constants.margin, 
    //left:constants.margin,right:constants.margin,
    layout:'Horizontal',height:30
    });
var userAuthOptionView2 =  Ti.UI.createView ({
    top: constants.margin,
    //left:constants.margin,right:constants.margin,
    layout:'Horizontal',height:30
    });

var userAuthOptionLabel1 = Ti.UI.createLabel({
    top: constants.margin, 
    left:constants.margin,
    color: '#000',
    text:'Bypass OnNetwork Auth',height:Ti.UI.Size
});
var userAuthOptionLabel2 = Ti.UI.createLabel({
    top: 5, 
    left:constants.margin,
    text:'Suppress Landing Page',height:Ti.UI.Size,
    color: '#000'
});

if(Titanium.Platform.osname.toLowerCase()=='android') {
    var userAuthOptionButton1 = Ti.UI.createSwitch({value:Ti.App.Properties.getBool('bypass_onnetwork_auth',false), right:20,
    style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,borderColor:'black'
 
  });
} else {
    var userAuthOptionButton1 = Ti.UI.createSwitch({value:Ti.App.Properties.getBool('bypass_onnetwork_auth',false),tintColor:'#000',right:'5dp' });
}

if(Titanium.Platform.osname.toLowerCase()=='android') {
    var userAuthOptionButton2 = Ti.UI.createSwitch({value:Ti.App.Properties.getBool('suppress_landing_page',false), right:20,
    style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,borderColor:'black'

  });
} else {
    var userAuthOptionButton2 = Ti.UI.createSwitch({value:Ti.App.Properties.getBool('suppress_landing_page',false),tintColor:'#000',right:'5dp' });
}
var authConstant = {
    margin: 10,
    padding: 10,
    textFieldHeight: deviceState.is.android ? undefined : 40,
    buttonHeight: deviceState.is.android ? undefined : 30,
    buttonWidth: '65%'
};
var applyChangesBtn = Ti.UI.createButton({
    top:    authConstant.margin,
    title : 'Apply',
    height : authConstant.buttonHeight,
    width: authConstant.buttonWidth
});

userAuthOptionView1.add(userAuthOptionLabel1);
userAuthOptionView1.add(userAuthOptionButton1);
userAuthOptionView2.add(userAuthOptionLabel2);
userAuthOptionView2.add(userAuthOptionButton2);
UserAuthOptionView.add(userAuthOptionView1);
UserAuthOptionView.add(userAuthOptionView2);
UserAuthOptionView.add(applyChangesBtn);

applyChangesBtn.addEventListener('click',function(e) {
	
	if(!attAPIs.ATT.getCachedUserAuthToken) {
	
	attAPIs.ATT.accessToken.revoke(revokeSuccess,revokeFail);
	function revokeSuccess (data) {
		attAPIs.ATT.userAuthToken.remove();
		alert("Settings Applied. Existing User Auth token revoked & deleted");
	}
	function revokeFail (err) {
		alert(JSON.stringify(err));
	}
   		}
    Ti.App.Properties.setBool('bypass_onnetwork_auth',userAuthOptionButton1.value); // add current value of Checkbox.
    Ti.App.Properties.setBool('suppress_landing_page',userAuthOptionButton2.value);  // add current value of checkbox
    
});

var buttonHolder = Ti.UI.createView({
    top: constants.margin,
    layout:'horizontal',
    height: Ti.UI.SIZE,
    width : Ti.UI.SIZE,
});
scrollView.add(buttonHolder);

if(Titanium.Platform.osname.toLowerCase()=='android') {var fontSize = 12 + 'dip';} else { fontSize = 15 + 'dip';}

//Create the view for the results to be displayed
var textView = Ti.UI.createLabel({
    top: constants.margin, left: constants.margin, right: constants.margin, bottom: constants.margin, 
    font: { fontSize: 14 + 'dip' }, color: '#000',
    shadowColor: '#aaa', shadowOffset: {x:0, y:1},
    text: ''
});

if(Titanium.Platform.osname.toLowerCase()=='android'){
var textViewWrapper = Ti.UI.createScrollView({
    top: constants.margin, 
    scrollType: 'vertical',
    height:200,
    borderColor: 'black', borderWidth: 1
}); } else {
    var textViewWrapper = Ti.UI.createScrollView({
    top: constants.margin, 
    scrollType: 'vertical',
    height:150,
    borderColor: 'black', borderWidth: 1
    
});
}
textViewWrapper.add(textView);
scrollView.add(textViewWrapper);
scrollView.add(UserAuthOptionView);
textView.addText = function(newText) {
    this.setText(newText + '\n\n' + this.text);
};

function getNewTokenText(newTokenData) {
    return 'new token:\n ' + newTokenData.token
         + '\nRefresh token:\n ' + newTokenData.refreshToken
         + '\nExpires:\n ' + (new Date(newTokenData.expiration)).toLocaleString();
}


//Set up fetch token Button
var fetchButton = Ti.UI.createButton({
    right: constants.margin,
    title: 'Fetch',
    width: constants.buttonWidth
});
fetchButton.addEventListener('click',function(e) {
    //TODO: Fetch the token
    //textView.addText('clicked FETCH button');
    var originalTokenCache = attAPIs.ATT.accessToken.getCache();
    
    attAPIs.ATT.accessToken.fetch(function(resp) { //Success
        var newToken = resp.data.token;
        if(originalTokenCache.token === newToken) {
            textView.addText('Token from memory:\n' + newToken);
        } else {
            textView.addText('Fetched ' + getNewTokenText(resp.data));
        }
    },
    function(err) { //Error
        textView.addText('Error fetching token:\n' + err.error.message);
    });
});
buttonHolder.add(fetchButton);


//Set up remove token Button
var removeTokenButton = Ti.UI.createButton({
    right: constants.margin,
    title: 'Revoke',
    width: constants.buttonWidth
});
removeTokenButton.addEventListener('click',function(e) {
	
	attAPIs.ATT.accessToken.revoke(revokeSuccess,revokeFail);
	
	function revokeSuccess (data) {
		attAPIs.ATT.accessToken.remove();
		textView.addText('Token revoked');
	}
	function revokeFail (err) {
		alert(JSON.stringify(err));
	}

});
buttonHolder.add(removeTokenButton);


//Set up refresh token Button
var refreshButton = Ti.UI.createButton({
    title: 'Refresh',
    width: constants.buttonWidth
});
refreshButton.addEventListener('click',function(e) {
    //textView.addText('clicked REFRESH button');
 
    attAPIs.ATT.accessToken.refresh(function(resp) { //Success
        //var newToken = resp.data.token;
        //textView.addText('Refreshed new token:\n' + newToken);
        textView.addText('Refreshed ' + getNewTokenText(resp.data));
       
    },
    function(err) { //Error
        textView.addText('Error refreshing token:\n' + err.error.message);
        alert(JSON.stringify(err));
    });
});
buttonHolder.add(refreshButton);




