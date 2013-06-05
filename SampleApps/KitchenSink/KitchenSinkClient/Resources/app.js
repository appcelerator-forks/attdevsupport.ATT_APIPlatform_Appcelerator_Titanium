// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

var apiWin = Titanium.UI.createWindow({
	url : 'apiList.js',
	title : 'AT&T API Platform',
	backgroundColor : '#fff'
});

if (Titanium.Platform.osname !== "android") {
	var baseWin = Ti.UI.createWindow();
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window : apiWin
	});

	apiWin.navGroup = navGroup;
	baseWin.add(navGroup);
	baseWin.open();

} else {
	apiWin.open();
}

