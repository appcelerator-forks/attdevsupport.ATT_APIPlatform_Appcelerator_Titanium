// This is a test harness for your module

// open a single window
var win = Ti.UI.createWindow({
                             backgroundColor:'white'
                             });
var label = Ti.UI.createLabel();
win.add(label);
win.open();

//Module require here
var att = require('ti.api.att');
att.setDebug(true);
Ti.API.info("module is => " + att);

// Create a Button.
var mmsTest = Ti.UI.createButton({
                                 title : 'MMS Test',
                                 height : 40,
                                 width : 100,
                                 top : 40,
                                 left : 100
                                 });
// Add to the parent view.
win.add(mmsTest);


// Create a Button.
var moboTest = Ti.UI.createButton({
                                  title : 'MoBo Test',
                                  height : 40,
                                  width : 120,
                                  top : 100,
                                  left : 100
                                  });

// Add to the parent view.
win.add(moboTest);

var wapPushTest = Ti.UI.createButton({
                                  title : 'WapPush Test',
                                  height : 40,
                                  width : 120,
                                  top : 180,
                                  left : 100
                                  });

// Add to the parent view.
win.add(wapPushTest);

/**
 * File Attachment test format for MMS 
 */
var firstFile = {
    'fileName':"KS_nav_views",
    'fileType':"image/png",
    'filePath':Ti.Filesystem.getFile("KS_nav_views.png").nativePath,
    //'fileObject':Ti.Filesystem.getFile("KS_nav_views.png").read()
};
var secondFile ={
    'fileName':"Stonehenge",
    'fileType':"image/png",
    'filePath':Ti.Filesystem.getFile("Stonehenge.png").nativePath,
    //'fileObject':Ti.Filesystem.getFile("Stonehenge.png").read()
    
};

var address = 'tel:6505047391';
alert(address);
Ti.API.info('##########################################' + address);

var bodyjson = { 'Address' :  address , 'Subject' : 'FirstMessage' };  //json test address body for MMS
var bodyxml = "<MmsRequest>"+"\n"+"<Address>tel:+13500000992</Address>"+"\n"+"<Subject>test</Subject>"+"\n"+"<Priority>High</Priority>"+"\n"+"</MmsRequest>";//xml test address body for MMS
var bodyUrlEncoded = "Address=tel%3A%2B13500000991&Priority=High&Subject=image%20file";//url encoded test address body for MMS
/**
 * parameters for MMS sendMMS method
 */
var args = {
    "body" : bodyxml,
    "contentType":"application/xml",
    "accept":"application/json",
    "accessToken":"Bearer 6115d8c6ad2e332bc70a95d00ed297bd",
    "url":"https://api.att.com/rest/mms/2/messaging/outbox",
    "attachments":[firstFile,secondFile]
};

/**
 * Add the click event Listener to mmsTest Button
 */
mmsTest.addEventListener('click', function() {
//On receiving click event native module method 'sendMMS' called with parameters for mms and callback (success and error) methods.
                         att.sendMMS(args,
                                     function(e){
                                     
                                     alert(e);
                                     
                                     },
                                     function(error){
                                     
                                     alert(error);
                                     });
                         });


// Send Message
/**
 * File Attachment test format for MOBO 
 */
var firstFileMobo = {
    'fileName':"KS_nav_views",
    'fileType':"image/png",
    //'filePath':Ti.Filesystem.getFile("KS_nav_views.png").nativePath
    'fileObject':Ti.Filesystem.getFile("KS_nav_views.png").read()
};
var secondFileMobo ={
    'fileName':"Stonehenge",
    'fileType':"image/png",
    //'filePath':Ti.Filesystem.getFile("Stonehenge.png").nativePath
    'fileObject':Ti.Filesystem.getFile("Stonehenge.png").read()
    
};

var addressMobo = ['tel:6507408410','tel:6505754427','test@att.com'];
var bodyMoboJson = { 'Addresses' : addressMobo, 'Text': 'Hi Saurav', 'Subject': 'Hi'};   //json test address body for Mobo
var bodyMoboXml = "<MessageRequest><Addresses>tel:6507408410,tel:6505754427,test@att.com</Addresses></MessageRequest>";  //xml test address body for Mobo
var bodyMoboUrlEncoded = "Addresses=tel%3A%2B13500000991";   //url encoded test address body for Mobo

/**
 * parameters for mobo sendMessage method
 */
var argsMobo = {
    "body" : bodyMoboJson,
    "contentType":"application/json",
    "accept":"application/xml",
    "accessToken":"Bearer 3c4a2583ea3abd176627fdadb669a9ba",
    "url":"https://api.att.com/rest/1/MyMessages",
    "attachments":[firstFileMobo,secondFileMobo]
};

/**
 * Add the click event Listener to moboTest Button
 */
moboTest.addEventListener('click', function() {
//On receiving click event native module method 'sendMessage' called with parameters for mobo and callback (success and error) methods.
                          att.sendMessage(argsMobo,
                                          function(e){
                                          
                                          alert(e);
                                          
                                          },
                                          function(error){
                                          
                                          alert(error);
                                          });
                          });



/**
 * Wap push message body send in parameter
 */
var xml = "";
xml += "Content-Disposition: form-data; name=\"PushContent\"\n";
xml += "Content-Type: text/vnd.wap.si\n";
xml += "Content-Length: 20\n";
xml += "X-Wap-Application-Id: x-wap-application:wml.ua\n\n";
xml += "<?xml version=\"1.0\"?>\n";
xml += "<!DOCTYPE si PUBLIC \"-//WAPFORUM//DTD SI 1.0//EN\" \"http://www.wapforum.org/DTD/si.dtd\">\n";
xml += "<si>";
xml += "<indication href=\"" + "https://api.att.com/"
+ "\" action=\"signal-medium\" si-id=\"6532\" >\n";
xml += "Saurav Wap Push" + "\n";
xml += "</indication>\n";
xml += "</si>\n";


var addressMobo = 'tel:6505754427';
var bodyWapJson = { 'address' :  addressMobo };  //json test address body
var bodyWapXml = "<wapPushRequest>\n<address>tel:6505754427</address>\n</wapPushRequest>"; //xml test address body
var bodyWapUrlEncoded = "address=tel%3A%2B13500000991"; // url encoded test address body

/**
 * Wap push test required parameter
 */
var argsWapPush = {
    "url" : "https://api.att.com/1/messages/outbox/wapPush",
    "accessToken" : "Bearer fb64a9591251b8929296a38a721a812f",
    "body" : bodyWapJson,
    "data" : xml,
    "contentType":"application/json",
    "accept" : "application/json"
    
};

/**
 * Add the click event Listener to wapPushTest Button
 */
wapPushTest.addEventListener('click', function() {
//On receiving click event native module method 'sendWapPush' called with parameters for wap push and callback (success and error) methods.
                          att.sendWapPush(argsWapPush,
                                          function(e){
                                          
                                          alert(e);
                                          
                                          },
                                          function(error){
                                          
                                          alert(error);
                                          });
                          });