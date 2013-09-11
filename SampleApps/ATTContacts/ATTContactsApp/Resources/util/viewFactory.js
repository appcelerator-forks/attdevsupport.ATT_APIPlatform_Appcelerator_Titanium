
var createTextBoxView = function(options) {
    options = options||{};
    
    var textWrapperView = Ti.UI.createView({
        backgroundColor: 'black',
        top: options.top,
        height: Ti.UI.SIZE
    });
    
    ['top', 'left', 'right', 'bottom', 'borderRadius', 'visible'].forEach(function(prop) {
        var val = options[prop];
        if(val !== undefined) textWrapperView[prop] = val;
    });
    
    textWrapperView.setChild = function(newChild) {
        if(this.children) this.children.forEach(this.remove, this); //Remove old children
        this.add(newChild);
    };
    
    textWrapperView.setLabel = function(newText) {
        this.setChild(Ti.UI.createLabel({
            text: newText, font: (options.font || c.font), textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            top: c.margin, left: c.margin, right: c.margin, bottom: c.margin, color:'white',
            height: Ti.UI.SIZE
        }));
    };
    
    if(options.text) textWrapperView.setLabel(options.text);
    
    return textWrapperView;
};

module.exports = {
    createTextBoxView: createTextBoxView,
    createListeningTextBox: function(options) {
        var listeningTextBox = createTextBoxView.apply(this, arguments);
        
        //Add the loading box as a display option for the loading text box
        listeningTextBox.setListening = function() {
            var listeningBox = Ti.UI.createView({
                height: Titanium.UI.SIZE, width: Titanium.UI.SIZE,
                top: c.margin, bottom: c.margin,
                layout: 'horizontal'
            });
            
            var listeningLabel = Ti.UI.createLabel({
                text: 'Listening...',
                color: 'white',
                right: c.margin,
                font: c.font
            });
            listeningBox.add(listeningLabel);
            
            var images = [];
            for(var i = 1; i <= 10; i++) {
                images.push('/images/listeningWave/listeningWave' + ((i<10) ? ('0'+i) : i) + '.png');
            }
            
            var listeningGIF = Ti.UI.createImageView({
                width: 54,
                height: 48,
                duration: 100,
                repeatCount: 0,
                images : images
            });
            listeningGIF.start();
            
            listeningBox.add(listeningGIF);
            
            this.setChild(listeningBox);
        };
        
        return listeningTextBox;
    },
    createErrorAlert: function(type, message) {
        var dialog = Ti.UI.createAlertDialog({
            ok: 'OK',
            buttonNames: ['OK'],
            message: message,
            title: type
        });
        dialog.show();
        return dialog;
    }
};

