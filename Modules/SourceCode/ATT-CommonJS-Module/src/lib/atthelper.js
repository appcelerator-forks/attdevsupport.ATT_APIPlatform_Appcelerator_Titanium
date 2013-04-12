var attHelper=null;
if( !attHelper)
{
	attHelper = exports;
}
	
else{
	attHelper = {};
}

/***
 * Helper function for executors
 * */
attHelper.prepareExecutor = function(thisRef) {
	"use strict";
	if(thisRef.preparer && !thisRef.prepared) {
		thisRef.preparer();
		thisRef.prepared = true;
	}
};

//Adds util functions to attHelper
(function(attHelper) {
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
	
	function addAllHeaders(xhr, allHeadersConfig, params) {
		forEach(allHeadersConfig, function(headerConfig, key) {
			if(typeof headerConfig === 'string') headerConfig = {title: headerConfig};
			var error = addHeader(xhr, headerConfig, key, params);
			if(error) return error;
		});
	}

	/**
	 * Header Config Object
	 * @param title - header title
	 * @param backup - default value if none is supplied
	 * @param required - if true, returns an error if not defined
	 * @param suffix - text to add on the end of header, ignored for backup value
	 * @param prefix - text to add to the beginning of the header, ignored for backup value
	 */

	function addHeader(xhr, headerConfig, headerKey, params) {
		var val = params[headerKey] || '';
		if(!val && headerConfig.backup) {
			val = headerConfig.backup;
		}
		
		if(!val && headerConfig.required) {
			return new Error('Required parameter "' + headerKey + '" is undefined');
		}
		
		if(headerConfig.postProcess) val = headerConfig.postProcess(val);
		
		if(headerConfig.prefix) val = headerConfig.prefix + val;
		if(headerConfig.suffix) val += headerConfig.suffix;
		
		var title = headerConfig.title;
		if(!title) return new Error('Missing a title in config for key: ' + headerKey);
		
		if(val) xhr.setRequestHeader(title, val);
	}
	
	function queryString(flatObj, seperator) {
		if(typeof flatObj !== 'object') {
			return '';
		}
		
		var qsArr = [], mySeperator = (typeof seperator === 'string') ? seperator : queryString.defaultSeperator;
        forEach(flatObj, function(val, key) {
        	if(val) qsArr.push(key + '=' + encodeURIComponent(val));
        });
        
        return qsArr.join(mySeperator);
	}
	queryString.defaultSeperator = '&';
	
	attHelper.util = {};
	attHelper.util.forEach = forEach;
	attHelper.util.copyObjTo = copyObjTo;
	attHelper.util.addAllHeaders = addAllHeaders;
	attHelper.util.queryString = queryString;
	
	
})(attHelper);