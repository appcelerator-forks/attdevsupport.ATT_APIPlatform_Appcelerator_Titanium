

var c = require('util/constants')
,   viewFactory = require('util/viewFactory')
,   infoMessage = 'Demo app for Titanium Conference 2013\n\n'
        + 'Uses the power of SMS and Speech APIs from the AT&T Developer Platform. Backed by AT&T Watson Engine. '
        + 'Please vist the AT&T Developer Program '
        + 'for more information';
    
//main window for finding contacts
var contactsWindow = Titanium.UI.createWindow({
    url : 'ui/ContactsSearchView.js',
    title : 'Find Contacts',
    layout:'vertical',
    backgroundImage : c.isAndroid ? 'images/android/bg.jpg' : 'images/bg.jpg',
    backgroundRepeat: true
});

//Creates an alert describing the information about this app
function createInfoAlert() {
    viewFactory.createErrorAlert('Information', infoMessage);
}


if(c.isAndroid) {
    //Set up the back listeners and info popup on Android
    
    contactsWindow.addEventListener('android:back', function(e) {
        Ti.Android.currentActivity.finish();
    });
    
    //Common function for setting up basic navigation for overlapping windows
    contactsWindow.openChild = function(/*Ti.UI.Window*/child) {
        child.open();
        
        function closeChild(e) {
            child.removeEventListener('android:back', closeChild);
            child.close();
        }
        child.addEventListener('android:back', closeChild);
    }
    
    //Set up the "Info" button through android app settings
    contactsWindow.addEventListener('open', function(e) {
        Ti.Android.currentActivity.onCreateOptionsMenu = function(e) {
            var menuItem = e.menu.add({
                title : "Info",
                icon: Titanium.Android.R.drawable.ic_menu_info_details
            });
            menuItem.addEventListener("click", createInfoAlert);
        };
    });
    
    contactsWindow.open();
    
} else {
    //Set up the navigation bar and info pop-up button on iPhone
    
    //Set up the info button on the contactsWindow for the top nav bar
    var infoButton = Ti.UI.createButton({
        style : Ti.UI.iPhone.SystemButtonStyle.DONE,
        title : 'info'
    });
    
    infoButton.addEventListener('click', createInfoAlert);
    
    contactsWindow.setRightNavButton(infoButton);
    
    //Set up the top bar navigation for an iPhone look and feel 
    var baseWin = Ti.UI.createWindow();
    var navGroup = Ti.UI.iPhone.createNavigationGroup({
        window : contactsWindow
    });
    
    baseWin.add(navGroup);
    baseWin.open();
    
    //Helper function to help with navigation of overlapping windows
    contactsWindow.openChild = function(/*Ti.UI.Window*/child) {
        navGroup.open(child);
    };
}

