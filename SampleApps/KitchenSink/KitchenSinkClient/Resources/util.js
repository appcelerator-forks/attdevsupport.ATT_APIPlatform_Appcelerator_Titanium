
(function() {
'use strict';

var state = {
    device: {
        is: {
            android: Titanium.Platform.osname === "android",
            iPhone: Titanium.Platform.osname !== "iphone",
            iPad: Titanium.Platform.osname !== "ipad"
        }
    }
};
state.device.is.iOS = state.device.is.iPhone || state.device.is.iPad;

function forEach(obj, func, scope) {
    if(typeof obj === 'object' && obj !== null) {
        if(obj.forEach) {
            obj.forEach.call(obj, func, scope);
        } else {
            for(var key in obj) {
                if(obj.hasOwnProperty(key)) {
                    func.call(scope || obj, obj[key], key, obj);
                }
            }
        }
    }
}

//Copies properties of the following objects to the toObj
function copyObjTo(toObj) {
    var copyObjs = Array.prototype.slice.call(arguments, 1).reverse();
    copyObjs.forEach(function(fromObj) {
        forEach(fromObj, function(val, key){
            toObj[key] = val;
        });
    });
    return toObj;
}

var createPicker;
if(state.device.is.android) {
    createPicker = function(properties, optionTitles) {
        var picker = Titanium.UI.createPicker(copyObjTo({
            width: Ti.UI.FILL
        }, properties));
        
        var options = optionTitles.map(function(option) {
            return Ti.UI.createPickerRow({title: option});
        });
        
        picker.add(options);
        picker.selectionIndicator = true;
        
        picker.addEventListener('change',function(e){
            picker.value = picker.getSelectedRow(0).title;
        });
        picker.value = optionTitles[0];
        return picker;
    };
} else {
    createPicker = function(properties, optionTitles) {
        var rowProperties = {
                height: 30,
                width: Ti.UI.FILL
            },
            labelProperties = {
                text : '',
                left: properties.paddingLeft || 5,
            },
            selectButtonProperties = {
                height : 20,
                right : (rowProperties.paddingRight || 0) + 5,
                width : 15,
                backgroundImage : 'arrow_select.png'
            };
        
        copyObjTo(rowProperties, properties);
            
        var picker = Ti.UI.createView(rowProperties),
            selectedView = Ti.UI.createLabel(labelProperties),
            selectedButton = Ti.UI.createButton(selectButtonProperties);
        
        picker.add([selectedView, selectedButton]);
        picker.addEventListener('click', function(e) {
            popupWindow.open();
        });
        
        picker.setValue = function(val) {
            var oldVal = picker.value;
            
            optionsRows.forEach(function(row) {
                row.hasCheck = (val === row.text);
            });
            selectedView.text = val;
            picker.value = val;
            
            //Simulates picker "change" event
            if(oldVal !== val) picker.fireEvent('change', {
                bubbles : true,
                cancelBubble : false,
                selectedValue : [val],
                source : picker,
                type : 'change'
            });
        }
        
        //Create a pop up window for selections
        var popupWindow = Ti.UI.createWindow({
            modal : true,
            backgroundColor : 'white',
            title : 'Data Window'
        });
        
        //Add Complete button
        var modalWinRightNavButton = Ti.UI.createButton({
            style : Ti.UI.iPhone.SystemButtonStyle.DONE,
            title : 'Done'
        });
        modalWinRightNavButton.addEventListener('click', function() {
            popupWindow.close();
        });
        popupWindow.setRightNavButton(modalWinRightNavButton);
        
        //Set up pop up table
        var optionsRows = optionTitles.map(function(title) {
                return Ti.UI.createTableViewRow({
                    title : title,
                    text : title,
                    hasCheck : false
                });
            }),
            tableview = Ti.UI.createTableView({
                data : optionsRows
            });
            
        tableview.addEventListener('click', function(e) {
            picker.setValue(e.source.text);
        });
        popupWindow.add(tableview);
        
        picker.setValue(optionTitles[0]);
        return picker;
    };
}

function createLabelView(labelText, fieldView, options) {
    var rowOptions = copyObjTo({
        height: Ti.UI.SIZE,
        layout: 'vertical',
    }, options);
    
    var row = Ti.UI.createView(rowOptions);
    row.add(Ti.UI.createLabel({
        text: labelText + ':',
        width: '100%',
        //height: state.device.is.android ? '30dp': 30,
        height: 30,
        color: 'black',
        font: {
            //fontSize: isAndroid ? '20dp' : 16,
            fontSize: state.device.is.android ? 18 : 16,
            fontWeight: 'bold'
        }
    }));
    row.add(fieldView)
    return row;
}

function createSpacer(height) {
    return Ti.UI.createView({
        width : '100%',
        height: height || createSpacer.defaultSpacerHeight
    });
}
createSpacer.defaultSpacerHeight = 15;

//Creates a window for responses and returns a function to display results
function createResponseWindow() {
    var responseWindow = Ti.UI.createWindow({
        modal : true,
        backgroundColor : 'white',
        title : 'Response'
    });
    
    responseWindow.addEventListener('android:back', function(e) {
        responseWindow.close();
    });
    
    //For non android
    if (!state.device.is.android) {
        var responseWinRightNavButton = Ti.UI.createButton({
            style : Ti.UI.iPhone.SystemButtonStyle.DONE,
            title : 'close'
        });
        
        responseWinRightNavButton.addEventListener('click', function() {
            responseWindow.close();
        });
        
        responseWindow.setRightNavButton(responseWinRightNavButton);
    }
    
    var responseScroll = Ti.UI.createScrollView({
        contentWidth : 'auto',
        contentHeight : 'auto',
        showVerticalScrollIndicator : true,
    });
    
    var responseLabel = Ti.UI.createLabel({
        top : 15,
        left : 5,
        right : 5,
        height : 'auto'
    });
    
    responseScroll.add(responseLabel);
    responseWindow.add(responseScroll);
    
    return function openPopUp(data, isError) {
        var responseStr = 'RESPONSE'
        if(isError) responseStr += ' ERROR';
        responseStr += ': ' + ((typeof data === 'string') ? data : JSON.stringify(data, null, 3));
        
        responseLabel.text = responseStr;
        responseWindow.open();
    }
}

function formatNumberStr(phoneNumberStr) {
    if (!phoneNumberStr) {
        alert('Please enter a phone number');
        return null;
    }
    
    var phoneNumberArr = phoneNumberStr.split(','), 
        prefix = 'tel:';
    
    return phoneNumberArr.map(function(number) {
        if(number.indexOf(prefix) === 0) return number;
        return prefix + number;
    });
}

function createNumberField(options) {
    //iPhone only, a way to remove the number pad keyboard on iphone
    var numberField, 
        keyboardDoneButton = Titanium.UI.createButton({
            title: 'Done',
            systemButton : Titanium.UI.iPhone.SystemButton.DONE
        });
    
    keyboardDoneButton.addEventListener('click', function(e) {
        numberField.blur();
    });
    
    return numberField = Ti.UI.createTextField(copyObjTo({
        keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD,
        keyboardToolbar: [ keyboardDoneButton ],
    }, options));
}

/*
//Add the functions to the export Object
var functionsToAdd = ['forEach', 'copyObjTo', 'createPicker', 'state'];
forEach(functionsToAdd, function(functionName) {
    exports[functionName] = this[functionName];
}, this);
*/

//Helper functions
exports.forEach = forEach;
exports.copyObjTo = copyObjTo;
exports.formatNumberStr = formatNumberStr;

//Common values
exports.state = state;

//New UI elements
var UI = {};
UI.createPicker = createPicker;
UI.createLabelView = createLabelView;
UI.createSpacer = createSpacer;
UI.createResponseWindow = createResponseWindow;
UI.createNumberField = createNumberField;
exports.UI = UI;

})();

