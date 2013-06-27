

var mainWindow = Ti.UI.currentWindow
,   c = require('util/constants')
,   viewFactory = require('util/viewFactory')
,   attAPIs = require('att');

function ContactDetailWindow(contact) {
    var contactDetailWindow = Titanium.UI.createWindow({
        title : contact.name,
        layout: 'vertical',
        backgroundImage : c.isAndroid ? '/images/android/bg.jpg' : '/images/bg.jpg',
        backgroundRepeat: true
    });
    
    var description = 'Company: ' + contact.company
            + '\n\nName: ' + contact.name
            + '\n\nemail: ' + contact.email
            + '\n\nPhone: ' + contact.phone;
    
    //Create the description text of the contact
    contactDetailWindow.add(viewFactory.createTextBoxView({
        text: description, borderRadius: c.borderRadius,
        left: c.margin, right: c.margin, top: c.margin,
        font: { fontSize: 16 }
    }));
    
    //Create a button to send an SMS of the contact information
    var sendSMSButton = Ti.UI.createButton({
        title : 'Text Business Card',
        borderRadius: c.borderRadius,
        left: c.margin, right: c.margin, top: c.margin,
    });
    
    sendSMSButton.addEventListener('click', function() {
        Ti.API.info('Send SMS Button Clicked.');
        
        //Update the UI label with the status
        resultBox.setLabel('Sending SMS...');
        resultBox.show();
        
        var message = 'AT&T Developer Platform @attdeveloper 18003310500';  //The message to send
        var address = 'tel:' + contact.phone.replace(/[+-. )(]/g,'');       //Format the address to 'tel:18003310500'
        
        attAPIs.ATT.SMS.sendSMS({
            'accept' : 'application/json',      //The data returned should be in the JSON format
            'contentType' : 'application/json', //The data that we are sending is JSON
            'body' : {
                "message" : message,            //Set the message for the SMS
                "address" : address,            //Set the address for the SMS
            }
        }, function(data) {
            Ti.API.info('SMS Success Callback: ' + data);
            
            //Notify success in the result box
            resultBox.setLabel('Send successful.');
        }, function(error) {
            Ti.API.error('SMS Error Callback: ' + error);
            
            //Notify failure in the result box
            resultBox.setLabel('Send failed!');
        });
    });
    contactDetailWindow.add(sendSMSButton);
    
    //Create the place for the response
    var resultBox = viewFactory.createTextBoxView({
        borderRadius: c.borderRadius, visible: false,
        left: c.margin, right: c.margin, top: c.margin
    });
    
    contactDetailWindow.add(resultBox);
    
    return contactDetailWindow;
}

module.exports = ContactDetailWindow;

