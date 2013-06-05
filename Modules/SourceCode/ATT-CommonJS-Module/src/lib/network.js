var httpRequest = null;
if (!httpRequest) {
	httpRequest = exports;
} else {
	httpRequest = {};
}

httpRequest.httpError = function(thisRef, cbOnError) {"use strict";
	if (cbOnError) {

		cbOnError(thisRef.responseText);
	}
};
/***
 * Function handles http success callback
 */
httpRequest.httpSuccess = function(thisRef, cbOnData) {"use strict";
	var jsResp = null;
	jsResp = thisRef.responseText;
	//Check if this is a proper response, or an Error Response, and call the necessary callback Method
	if (cbOnData) {
		cbOnData(jsResp);
	}

};
/***
 * Function creates HTTP request
 * Return-- Returns http object with error and success callbacks attached
 */
httpRequest.createHttpObject = function(cbOnData, cbOnError,httpTimeOut) {"use strict";
 Ti.API.debug("createHTTPClient Timeout value: "+httpTimeOut);
	var xhr = Ti.Network.createHTTPClient({timeout:httpTimeOut});
	xhr.onload = function(response) {
		httpRequest.httpSuccess(this, cbOnData);
	};
	xhr.onerror = function(e) {
		httpRequest.httpError(this, cbOnError);
	};
	return xhr;
};
