===============Release Notes===============
• v2.4
Added Support for AT&T API v4 
========================================================
AT&T Appcelerator Titanium Mobile SDK - Titanium Modules
========================================================
The AT&T Titanium Mobile SDK provides a simplified way for Titanium mobile developers to access the AT&T API platform services. By significantly reducing the complexity of building applications that use the AT&T platform services, the AT&T Titanium Mobile SDK helps developers quickly bring robust Titanium mobile applications to market.

The AT&T Titanium modules provide interfaces that facilitate access to the following AT&T platform APIs:
• SMS
• MMS
• Speech
• Speech Custom Method
• Text to Speech
• In-App Messaging
• OAuth 2.0 Authentication Management

Please view the modules located in the "Module" folder and then test out the AT&T Titanium Mobile SDK in our sample apps located in the "SampleApp" folder

The Github Repository for the AT&T Titanium Mobile SDK can be found at https://github.com/attdevsupport/ATT_APIPlatform_Appcelerator_Titanium

===============Tested versions===============
Titanium Studio: 3.3.0
Titanium SDK: 3.3.0
XCode 5.1
Android SDK r20.0.3
iOS Simulator: iOS 6.0, iOS 7.1 for both iPhone and iPad Simulators
Android Emulator: 4.0.3 WVGA800, 4.4.2 

===============Notes=====================

1. In Android application development, if you use the same kitchenSink sample application, you will get the unlicensed module message. To avoid this, create a new Titanium mobile project and use the AT&T titanium modules from the market place. Also, you can use the GUID from newly-created titanium mobile projects, tiapp.xml, and change the same in the ATTTiKitchenSink tiapp.xml, to avoid the licensing issue.

===============Known issues===============
1. On Mac OS X 10.8.2 (Mountain Lion) iOS 6.0 simulator, the audio recording function in the Speech demo does not work. This function works fine on an actual iPhone 5 with iOS 6.0.1.


--END--
