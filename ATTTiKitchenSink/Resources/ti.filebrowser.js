/**
 * @author Ashish Nigam
 */

var fsbModule = {
    'viewModeDirectory' : 'directoryView',
    'viewModeFiles' : 'fileView',
    'viewModeMixed' : 'fileDirectoryMixed',
    'directoryThenFiles' : 'directoryFirst'
};
// logic
var moduleStore = {
    'currentDirectoryPath' : null,
    'previousDirectoryPath' : [],
    'currentViewMode' : null,
    'isDirectViewModeTransition' : true,
    'selectedFilesObject' : {},
    'selectedFilesReadObject' : {},
    'totalSelection' : 0,
    'callBackFunc' : null,
    'isSingleSelectionMode' : true,
    'currentSelectedRow' : {},
    'previousSelectedRow' : {}
};

function isFile(typeCheckObj, pathComponent) {"use strict";
    var f1, t1;
    if ((pathComponent !== undefined) || (pathComponent !== null)) {
        //Ti.API.info('isDirectory#####pathComponent#####'+pathComponent);
        f1 = Ti.Filesystem.getFile(pathComponent, typeCheckObj);
    } else {
        //Ti.API.info('isDirectory###in else as pathComponent is missing#######'+pathComponent);
        f1 = Ti.Filesystem.getFile(typeCheckObj);
    }

    t1 = f1.getDirectoryListing();
    //Ti.API.info('isDirectory#####t1:::::#####'+t1 + '   ' + typeof(t1));
    if (t1 !== undefined && ( typeof (t1) === 'object')) {
        //Ti.API.info('isDirectory#### in if######'+t1);
        return false;
    }
    return true;
}

function isDirectory(typeCheckObj, pathComponent) {"use strict";
    var f1, t1;
    if ((pathComponent !== undefined) || (pathComponent !== null)) {
        //Ti.API.info('isDirectory#####pathComponent#####'+pathComponent);
        f1 = Ti.Filesystem.getFile(pathComponent, typeCheckObj);
    } else {
        //Ti.API.info('isDirectory###in else as pathComponent is missing#######'+pathComponent);
        f1 = Ti.Filesystem.getFile(typeCheckObj);
    }

    t1 = f1.getDirectoryListing();
    //Ti.API.info('isDirectory#####t1:::::#####'+t1 + '   ' + typeof(t1));
    if (t1 !== undefined && ( typeof (t1) === 'object')) {
        //Ti.API.info('isDirectory#### in if######'+t1);
        return true;
    }
    return false;
}

function arrayDiff(arr1, arr2) {"use strict";
    var i = 0, j = 0;
    for ( i = 0; i < arr1.length; i = i + 1) {
        for ( j = 0; j < arr2.length; j = j + 1) {
            if (arr1[i].toString() === arr2[j].toString()) {
                arr1.splice(i, 1);
            }
        }
    }
    return arr1;
}

var data = [];
// good for all the file recursively in root level directory

function showFiles(params) {"use strict";
    var i = 0, files, arrList;
    Ti.API.info('path received' + params);
    if (moduleStore.isDirectViewModeTransition) {
        moduleStore.previousDirectoryPath.push(params);
        moduleStore.currentViewMode = showFiles;
    }

    files = Ti.Filesystem.getFile(params);
    //Ti.API.info('#####################################'+files.nativePath);
    arrList = files.getDirectoryListing();
    //Ti.API.info('############Directory List###############'+arrList);

    if (arrList !== undefined) {
        //Ti.API.info('############Directory List in if###############'+arrList);
        for ( i = 0; i < arrList.length; i = i + 1) {
            if (Ti.UI.Android ? !Ti.Filesystem.getFile(arrList[i]).isDirectory() : !isDirectory(arrList[i], files.nativePath)) {
                data.push({
                    'title' : arrList[i],
                    'isDirectory' : false,
                    'path' : Ti.Filesystem.getFile(files.nativePath, arrList[i].toString()).nativePath
                });
            }
        }
    }
    Ti.API.info('file' + data);

}

function showDirectory(params) {"use strict";
    var i = 0, files, arrList;
    Ti.API.info('path received' + params);
    if (moduleStore.isDirectViewModeTransition) {
        Ti.API.info('moduleStore.isDirectViewModeTransition' + moduleStore.isDirectViewModeTransition);
        moduleStore.previousDirectoryPath.push(params);
        moduleStore.currentViewMode = showDirectory;
    }
    files = Ti.Filesystem.getFile(params);
    arrList = files.getDirectoryListing();
    if (arrList !== undefined) {
        for ( i = 0; i < arrList.length; i = i + 1) {
            if (Ti.UI.Android ? Ti.Filesystem.getFile(arrList[i]).isDirectory() : isDirectory(arrList[i], files.nativePath)) {
                data.push({
                    'title' : arrList[i],
                    'hasChild' : true,
                    'color' : 'red',
                    'isDirectory' : true,
                    'path' : Ti.Filesystem.getFile(files.nativePath, arrList[i].toString()).nativePath
                });
            }
        }
    }
    Ti.API.info('dir' + data.length);
}

function showFilesDirectoryBoth(params) {"use strict";
    Ti.API.info('path received' + params);
    moduleStore.previousDirectoryPath.push(params);
    moduleStore.currentViewMode = showFilesDirectoryBoth;
    showDirectory(params);
    showFiles(params);
}

function showFilesDirectoryMixed(params) {"use strict";
    Ti.API.info('path received' + params);
    var temp = [], listTemp, tempPath, i = 0, files, arrList, arrListCopy;
    moduleStore.previousDirectoryPath.push(params);
    moduleStore.currentViewMode = showFilesDirectoryMixed;

    files = Ti.Filesystem.getFile(params);
    arrList = files.getDirectoryListing();
    arrListCopy = files.getDirectoryListing();
    Ti.API.info('arrList###############' + arrList);

    if (arrList !== undefined) {
        for ( i = 0; i < arrList.length; i = i + 1) {
            if (Ti.UI.Android ? Ti.Filesystem.getFile(arrList[i]).isDirectory() : isDirectory(arrList[i], files.nativePath)) {
                tempPath = Ti.Filesystem.getFile(files.nativePath, arrList[i].toString());
                listTemp = tempPath.getDirectoryListing();
                Ti.API.info('listTemp###############' + listTemp);
                temp = arrayDiff(arrListCopy, listTemp);
            }
        }
        if (temp.length === 0) {
            temp = arrList;
        }
        for ( i = 0; i < temp.length; i = i + 1) {
            if (Ti.UI.Android ? Ti.Filesystem.getFile(arrList[i]).isDirectory() : isDirectory(temp[i], files.nativePath)) {
                data.push({
                    'title' : temp[i],
                    'hasChild' : true,
                    'color' : 'red',
                    'isDirectory' : true,
                    'path' : Ti.Filesystem.getFile(files.nativePath, temp[i].toString()).nativePath
                });
            } else {
                data.push({
                    'title' : temp[i],
                    'isDirectory' : false,
                    'path' : Ti.Filesystem.getFile(files.nativePath, temp[i].toString()).nativePath
                });
            }
        }
    }
}

// module UI

//Create a TableView.
var fileBrowser = Ti.UI.createTableView();

var modalwindow = Ti.UI.createWindow({
    modal : true,
    title : 'File Browser',
    barColor : 'black',
    backgroundColor : 'white'
});

var previousList = Ti.UI.createButton({
    title : 'Back',
    height : 36,
    width : 30,
    top : 5,
    right : 5,
    visible : false
});

//Create a Button.
var modalWindowClose = Ti.UI.createButton({
    title : 'Close',
    height : 36,
    width : 30,
    top : 5,
    right : 5,
    rowCounter : 0
});

// Listen for click events.
fileBrowser.addEventListener('click', function(e) {"use strict";

    Ti.API.info(e.rowData.path);

    if (e.rowData.isDirectory) {
        modalwindow.leftNavButton = previousList;
        data = [];
        fileBrowser.setData(data);
        moduleStore.currentViewMode(e.rowData.path);
        fileBrowser.setData(data);
    } else if (!e.rowData.isDirectory) {
        if (moduleStore.isSingleSelectionMode) {
            if(moduleStore.previousSelectedRow.hasCheck){
                e.row.hasCheck = e.row.hasCheck ? false : true;
                moduleStore.previousSelectedRow.hasCheck = false;
                moduleStore.previousSelectedRow = e.row;
            }else{
             e.row.hasCheck = e.row.hasCheck ? false : true;
             moduleStore.previousSelectedRow = e.row;   
            }
            moduleStore.totalSelection = e.row.hasCheck ? moduleStore.totalSelection + 1 : moduleStore.totalSelection - 1;
            modalWindowClose.title = moduleStore.totalSelection > 0 ? 'Done' : 'Close';
            if (e.row.hasCheck) {
                moduleStore.selectedFilesObject[e.rowData.title] = e.rowData.path;
                moduleStore.selectedFilesReadObject[e.rowData.title] = Ti.Filesystem.getFile(e.rowData.path).read();
            } else {
                delete moduleStore.selectedFilesObject[e.rowData.title];
                delete moduleStore.selectedFilesReadObject[e.rowData.title];
            }
            
        } else {
            e.row.hasCheck = e.row.hasCheck ? false : true;
            moduleStore.totalSelection = e.row.hasCheck ? moduleStore.totalSelection + 1 : moduleStore.totalSelection - 1;
            modalWindowClose.title = moduleStore.totalSelection > 0 ? 'Done' : 'Close';
            if (e.row.hasCheck) {
                moduleStore.selectedFilesObject[e.rowData.title] = e.rowData.path;
                moduleStore.selectedFilesReadObject[e.rowData.title] = Ti.Filesystem.getFile(e.rowData.path).read();
            } else {
                delete moduleStore.selectedFilesObject[e.rowData.title];
                delete moduleStore.selectedFilesReadObject[e.rowData.title];
            }
        }
    }
});

// Listen for click events.
modalWindowClose.addEventListener('click', function() {"use strict";
    data = [];
    if (moduleStore.callBackFunc) {
        moduleStore.callBackFunc();
    }
    modalwindow.close();
    fileBrowser.setData(data);
});

if (Ti.UI.iOS) {
    modalwindow.rightNavButton = modalWindowClose;
}

modalwindow.addEventListener('android:back', function() {"use strict";
    data = [];
    if (moduleStore.callBackFunc) {
        moduleStore.callBackFunc();
    }
    modalwindow.close();
    fileBrowser.setData(data);
});

previousList.addEventListener('click', function() {"use strict";
    Ti.API.info('moduleStore.previousDirectoryPath.length::::::::::' + moduleStore.previousDirectoryPath.length);
    if (moduleStore.previousDirectoryPath.length > 1) {
        data = [];
        fileBrowser.setData(data);
        Ti.API.info('Current Path' + moduleStore.previousDirectoryPath.pop());
        // making two pop operation is necessary as first pop will give you the current directory path
        // and second pop will give you the parent directory path.
        moduleStore.currentViewMode(moduleStore.previousDirectoryPath.pop());
        fileBrowser.setData(data);
    }
    if (moduleStore.previousDirectoryPath.length === 1) {
        modalwindow.leftNavButton = null;
    }
});

modalwindow.add(fileBrowser);

fsbModule.isDirectViewModeTransition = function(boolValue) {"use strict";
    moduleStore.isDirectViewModeTransition = boolValue;
};

fsbModule.setDirectoryToView = function(dir) {"use strict";
    moduleStore.currentDirectoryPath = dir;
};

fsbModule.setCurrentViewMode = function(viewMode) {"use strict";
    if (viewMode === 'directoryView') {
        moduleStore.isDirectViewModeTransition = true;
        showDirectory(moduleStore.currentDirectoryPath);
    } else if (viewMode === 'fileView') {
        moduleStore.isDirectViewModeTransition = true;
        showFiles(moduleStore.currentDirectoryPath);
    } else if (viewMode === 'fileDirectoryMixed') {
        moduleStore.isDirectViewModeTransition = true;
        showFilesDirectoryMixed(moduleStore.currentDirectoryPath);
    } else if (viewMode === 'directoryFirst') {
        moduleStore.isDirectViewModeTransition = false;
        showFilesDirectoryBoth(moduleStore.currentDirectoryPath);
    }
};

fsbModule.open = function(cbOnDoneFunc) {"use strict";
    moduleStore.totalSelection = 0;
    moduleStore.selectedFilesObject = {};
    moduleStore.selectedFilesReadObject = {};
    moduleStore.callBackFunc = cbOnDoneFunc;
    fileBrowser.setData(data);
    modalwindow.open();
};

fsbModule.numberOfFiles = function() {"use strict";
    return moduleStore.totalSelection;
};

fsbModule.selectedFilesJSON = function() {"use strict";
    return moduleStore.selectedFilesObject;
};

fsbModule.selectedFilesBinaryObjJSON = function() {"use strict";
    return moduleStore.selectedFilesReadObject;
};

module.exports = fsbModule;