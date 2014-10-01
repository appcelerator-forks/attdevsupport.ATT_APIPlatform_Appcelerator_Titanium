
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

function formatFilePath(filePath) {
    if(filePath && state.device.is.android) {
        return filePath.replace('file://', '');
    }
    
    return filePath;
}

var qs = {
    parse: function(qsString) {
        var qsObj = {};
        qsString.split('&').forEach(function(param) {
            var paramParts = param.split('=');
            qsObj[decodeURIComponent(paramParts[0])] = decodeURIComponent(paramParts[1] || '');
        });
        return qsObj;
    },
    stringify: function(qsObj) {
        var qsString = '';
        forEach(qsObj, function(val, key) {
            qsString += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(val);
        });
        return qsString.slice(1);
    }
};

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
            if (Titanium.Platform.osname !== "android") {
				popupNav.open();
			}
			else {
				popupWindow.open();
			}
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
        };
        
        //Create a pop up window for selections
        var popupWindow = Ti.UI.createWindow({
            modal : true,
            backgroundColor : 'white',
            title : 'Data Window'
        });
        
        if (Titanium.Platform.osname !== "android") {
	        var popupNav = Ti.UI.iOS.createNavigationWindow({
	        modal: true,
	        window: popupWindow
	        });
	    }
        
        //Add Complete button
        var modalWinRightNavButton = Ti.UI.createButton({
            style : Ti.UI.iPhone.SystemButtonStyle.DONE,
            title : 'Done'
        });
        modalWinRightNavButton.addEventListener('click', function() {
        if (Titanium.Platform.osname !== "android") {
			popupNav.close();
		}
		else {
			popupWindow.close();
		}
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
    row.add(fieldView);
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
if (Titanium.Platform.osname !== "android") {
var responseNav = Ti.UI.iOS.createNavigationWindow({
    modal: true,
    window: responseWindow
    }); 
 }
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
            responseNav.close();
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
        var responseStr = 'RESPONSE';
        if(isError) responseStr += ' ERROR';
        responseStr += ': ' + ((typeof data === 'string') ? data : JSON.stringify(data, null, 3));
        
        responseLabel.text = responseStr;
        if (Titanium.Platform.osname !== "android") {
			responseNav.open();
		}
		else {
			responseWindow.open();
		}
    };
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

function createGetAuthCodeView(win, authUrl, redirectUrl, codeCB, errorCB) {
    var calledCB = false,
        webView = Ti.UI.createWebView({
            modal: true,
            url : authUrl,
            ignoreSslError:true
        });
    
    webView.addEventListener('load', function(e) {
        if(calledCB) return;
        
        var url = webView.url;
        if (url.indexOf(redirectUrl) !== -1) {
            calledCB = true;
            var qsString = url.match(/\?([^#]*)/)[1] || ''; //Parse for the query string part
            var qsObj = qs.parse(qsString);
            
            win.remove(webView);
            if(qsObj.code) codeCB(qsObj);
            
            errorCB(qsObj);
        }
    });
    win.add(webView);
}

function isDirectory(file) { 
    if(!file || !file.exists()) return false;
    if(file.isDirectory) return file.isDirectory();
    
    //Hack for iOS that has no isDirectory call
    var filePath = file.nativePath;
    return  filePath[filePath.length - 2] === '/'; //Directories end with a slash
}

function createGetFilePathWindow(folderPath, filePathCB, errorCB) {
    
    //Build the list
    var dir = Ti.Filesystem.getFile(folderPath)
    ,   files = dir.getDirectoryListing()
    ,   fileRowData = []
    ,   selectedRow;
    
    if(!files) {
        errorCB(new Error('Invalid folder path: ' + folderPath));
        return;
    }
    
    files.forEach(function(fileName) {
        var file = Ti.Filesystem.getFile(folderPath, fileName);
        if(isDirectory(file)) return;
        
        fileRowData.push({ title: fileName, path: file.nativePath, file: file });
    });
    
    //Return an error if no files are found
    if(fileRowData.length === 0) {
        errorCB(new Error('No files are in folder: ' + folderPath));
        return;
    }
    
    var fileBrowserTable = Ti.UI.createTableView({data: fileRowData});
    fileBrowserTable.addEventListener('click', function(e) {
        if(selectedRow) selectedRow.hasCheck = false;
        selectedRow = e.row;
        selectedRow.hasCheck = true;
    });
    
    //Set up popup window
    var modalWindow = Ti.UI.createWindow({
        modal : true,
        title : 'File Browser',
        barColor : 'black',
        backgroundColor : 'white'
    });
    
    if (Titanium.Platform.osname !== "android") {
	    var modalNav = Ti.UI.iOS.createNavigationWindow({
	    modal: true,
	    window: modalWindow
	    });
	}


    function close() {
        if (Titanium.Platform.osname !== "android") {
			modalNav.close();
		}
		else {
			modalWindow.close();
		}
        if(selectedRow) {
            var file = selectedRow.file || Ti.Filesystem.getFile(folderPath, selectedRow.title);
            
            filePathCB({ file: file, path: file.nativePath, name: selectedRow.title });
        } else {
            errorCB(new Error('No file was selected'));
        }
    }
    
    if(state.device.is.iOS) {
        var modalWindowBtn = Ti.UI.createButton({
            title : 'Close'
        });
        
        modalWindow.rightNavButton = modalWindowBtn;
        modalWindowBtn.addEventListener('click', close);
    }
    
    modalWindow.addEventListener('android:back', close);
    modalWindow.add(fileBrowserTable);
    if (Titanium.Platform.osname !== "android") {
		modalNav.open();
	}
	else {
		modalWindow.open();
	}
}


//Create new window

	function makeWindow(url, title) {
		var mainWinClose = Ti.UI.createButton({
			style : Ti.UI.iPhone.SystemButtonStyle.DONE,
			title : 'close'
		});

		var win = Ti.UI.createWindow({
			url : url,
			backgroundColor : 'white',
			modal : true,
			title : title,
			rightNavButton : mainWinClose
		});
		if (Titanium.Platform.osname !== "android") {
			var winNav = Ti.UI.iOS.createNavigationWindow({
				modal : true,
				window : win
			});
		}
		win.addEventListener('android:back', function(e) {
			win.close();
		});
		mainWinClose.addEventListener('click', function() {
			winNav.close();
		});
		if (Titanium.Platform.osname !== "android") {
			return winNav;
		}
		else {
			return win;
		}
	}


//Helper functions
exports.forEach = forEach;
exports.copyObjTo = copyObjTo;
exports.isDirectory = isDirectory;
exports.formatFilePath = formatFilePath;
exports.formatNumberStr = formatNumberStr;
exports.makeWindow = makeWindow;

//Common values
exports.state = state;

//New UI elements
var UI = {};
UI.createPicker = createPicker;
UI.createLabelView = createLabelView;
UI.createSpacer = createSpacer;
UI.createResponseWindow = createResponseWindow;
UI.createNumberField = createNumberField;
UI.createGetAuthCodeView = createGetAuthCodeView;
UI.createGetFilePathWindow = createGetFilePathWindow;
exports.UI = UI;

})();

