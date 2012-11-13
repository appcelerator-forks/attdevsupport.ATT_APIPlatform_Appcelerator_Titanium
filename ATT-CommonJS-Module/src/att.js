/**
 * ATT Module
 * A framework for exposing the ATT APIs to Appcelerator Titanium Mobile Developer.
 *
 * This framework is designed for APIs provided by ATT. Each service is represented
 * as a NameSpace, within which each operation is exposed.
 *
 * This framework requires you to refer to the ATT API reference for handling request, and
 * responses recieved from the service.
 *   i.e. refer to : https://devconnect-api.att.com/docs/
 **/

// use for creating commonjs

//#include:lib/atthelper.js
//#include:lib/bedframe.js
//#include:lib/network.js
//#include:lib/hmacsha1.js

//Session variables used across all methods
var sessionOBJ = {
    attHelper :  attHelper,//require('/src/lib/atthelper'), // provide attHelper object
    bedFrame :  BedFrame,//require('/src/lib/bedframe'), // provide bedframe object for generic method implementation format used here.
    httpRequest : httpRequest,//require('src/lib/network'), // provide http object of Titanium Netowrk APIs
    sha :  sha, //require('src/lib/hmacsha1'), //should be used for multiple utitity functions, eg: base64 encoding of strings.
    scope : null, //To be initalized via the authorize method
    accessKeyId : null, //To be initalized via the authorize method
    secretKey : null, //To be initalized via the authorize method
    accessToken : null, //To be initalized via the generateAccessToken method
    grantType : null, // To be initialized via the generateAccessToken method, values could be 'authorization_code', 'client_credentials'.
    outhCode : null, // To be initialized via the generateAccessToken method, Required only if grantType = 'authorization_code'.
    isAuthCode : false, //To be initialized via executors which invoke call for OAUTH Token
    authToken : null //To be initialized via the generateAccessToken method,if grantType = 'authorization_code'.
};

/**
 * method to generate Access Token
 * This method generate Token based on the value of grantType.
 * It is used to generate Access Token if grantType = 'client_credentials'.
 * It is used to generate Oauth Token if grantType = 'authorization_code'.
 */

var generateAccessToken = function(callBackToken) {"use strict";
    var sUrl = null, body = null, cbOnData, cbOnError, xhr;
    cbOnData = function(data) {
        var token = JSON.parse(data);
        if (sessionOBJ.isAuthCode === true) {
            sessionOBJ.isAuthCode = false;
            callBackToken(token.access_token);
        } else if (sessionOBJ.grantType === 'client_credentials') {
            Ti.App.attTitaniumModuleAccessToken = token.access_token;
            Ti.App.attTitaniumModuleRefreshToken = token.refresh_token;
            callBackToken(Ti.App.attTitaniumModuleAccessToken);
        } else if (sessionOBJ.grantType === 'refresh_token') {
            Ti.App.attTitaniumModuleAccessToken = token.access_token;
            Ti.App.attTitaniumModuleRefreshToken = token.refresh_token;
            callBackToken(Ti.App.attTitaniumModuleAccessToken);
        }
    }
    cbOnError = function(error) {
        Ti.API.error('Error in generating access token, error description: ' + error);
    };
    xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut);
    sUrl = 'https://api.att.com/oauth/access_token';
    if ((sessionOBJ.grantType === 'authorization_code') && (sessionOBJ.outhCode !== null)) {
        body = 'client_id=' + sessionOBJ.accessKeyId + '&client_secret=' + sessionOBJ.secretKey + '&grant_type=' + sessionOBJ.grantType + '&code=' + sessionOBJ.outhCode;
    } else if (sessionOBJ.grantType === 'client_credentials') {
        body = 'client_id=' + sessionOBJ.accessKeyId + '&client_secret=' + sessionOBJ.secretKey + '&grant_type=' + sessionOBJ.grantType + '&scope=' + sessionOBJ.scope;
    } else if (sessionOBJ.grantType === 'refresh_token') {
        body = 'client_id=' + sessionOBJ.accessKeyId + '&client_secret=' + sessionOBJ.secretKey + '&grant_type=' + sessionOBJ.grantType + '&refresh_token=' + Ti.App.attTitaniumModuleRefreshToken;
    }

    xhr.open('POST', sUrl);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(body);

};

/**
 * method to check Access Token .Once Access Token generated, saves in
 * Ti.App.attTitaniumModuleAccessToken , at App level.If Access Token is not generated once,
 * call generateAccessToken method,else use the existing Access Token.
 */

var checkAccessToken = function(callBackFunction) {"use strict";
    if (Ti.App.attTitaniumModuleAccessToken) {
        callBackFunction(Ti.App.attTitaniumModuleAccessToken);
    } else {
        generateAccessToken(callBackFunction);
    }
};

/**
 * Uses the ATT API to invoke an Action specified by the method, along with the parameters,
 * returns the response returned by the Service, and raises an Error callback in case of a failure.
 * @param params - Parameters to be sent
 * @param cbOnData -  CallBack to be invoked for Response
 * @param cbOnError - Callback to be invoked for Error
 */

/**
 * Executor for SMS API.
 */

var SMSExecutor = function(params, cbOnData, cbOnError) {"use strict";
    sessionOBJ.attHelper.prepareExecutor(this);
    var self = this, smsRequest, getSMSEndPoint;
    smsRequest = function(accessToken) {
        var xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut);
        if (params.smsId !== undefined) {
            xhr.open(self.verb, (self.endPoint + self.appendUrl + params.smsId));
        } else if (params.registrationId !== undefined) {
            getSMSEndPoint = (self.endPoint + self.appendUrl) + 'RegistrationID=' + params.registrationId;
            xhr.open(self.verb, getSMSEndPoint);
        } else {
            xhr.open(self.verb, (self.endPoint + self.appendUrl));
        }
        xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));

        if (params.contentType !== undefined) {
            xhr.setRequestHeader('Content-Type', params.contentType);
        }
        if (params.accept !== undefined) {
            xhr.setRequestHeader('Accept', params.accept);
        }
        if (self.method.toLowerCase() === 'sendsms') {
            if (params.contentType.toLowerCase() === 'application/json') {
                xhr.send(JSON.stringify(params.body));
            } else {
                xhr.send(params.body);
            }
        } else {
            xhr.send();
        }
    };
    /**
     * CALLING function to check Access Token
     * If already Generated then direct call API else generate AccessToken
     */
    checkAccessToken(smsRequest);
};

/**
 * Executor for SPEECHTOTEXT API
 */

var STTExecutor = function(params, cbOnData, cbOnError) {"use strict";
    sessionOBJ.attHelper.prepareExecutor(this);
    var self = this, speechRequest, body, argumnets, sUrl, att, audioFile, data;
    speechRequest = function(accessToken) {
        if (Ti.Platform.osname !== 'android') {
            var xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut);
            xhr.open(self.verb, self.endPoint);
            xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));
            if (params.xSpeechContext !== undefined) {
                xhr.setRequestHeader('X-SpeechContext', params.xSpeechContext);
            }
            if (params.transferEncoding !== undefined) {
                xhr.setRequestHeader('Transfer-Encoding', params.transferEncoding);
            }
            if (params.contentLength !== undefined) {
                xhr.setRequestHeader('Content-Length', params.contentLength);
            }
            if (params.contentType !== undefined) {
                xhr.setRequestHeader('Content-Type', params.contentType);
            }
            if (params.accept !== undefined) {
                xhr.setRequestHeader('Accept', params.accept);
            }
            audioFile = Ti.Filesystem.getFile(params.filePath);
            data = audioFile.read();
            xhr.send(data);

        } else {
            att = require('ti.api.att');
            sUrl = self.endPoint;
            argumnets = {
                "filePath" : params.filePath ? params.filePath : '',
                "host" : sUrl,
                "headerXSpeechContent" : params.xSpeechContext ? params.xSpeechContext : '',
                "headerContentType" : params.contentType ? params.contentType : '',
                "headerAccept" : params.accept ? params.accept : '',
                "token" : "Bearer " + accessToken
            };
            att.speechToText(argumnets, function(data) {
                if (params.accept === "application/xml") {
                    if (cbOnData) {
                        cbOnData(data.success);
                    }
                } else {
                    if (cbOnData) {
                        cbOnData(data);
                    }
                }
            }, function(error) {
                cbOnError(error);
            });
        }
    };
    /**
     * CALLING function to check Access Token
     * If already Generated then direct call API else generate AccessToken
     */
    checkAccessToken(speechRequest);

};

/**
 * Executor for MMS api.
 * This MMS api call uses native module.
 */

var MMSExecutor = function(params, cbOnData, cbOnError) {"use strict";
    sessionOBJ.attHelper.prepareExecutor(this);
    var self = this, mmsRequest, sUrl, argumnets, xhr;
    mmsRequest = function(accessToken) {
        if (self.method.toLowerCase() === 'sendmms') {
            var att = require('ti.api.att');
            sUrl = self.endPoint + self.appendUrl;
            argumnets = {
                "body" : params.body ? params.body : '',
                "contentType" : params.contentType ? params.contentType : '',
                "accept" : params.accept,
                "accessToken" : "Bearer " + accessToken,
                "url" : sUrl,
                "attachments" : (params.attachments && params.attachments.length > 0) ? params.attachments : [{}]
            };

            att.sendMMS(argumnets, function(data) {
                if (params.accept === "application/xml") {
                    if (cbOnData) {
                        cbOnData(data.success);
                    }
                } else {
                    if (cbOnData) {
                        cbOnData(data);
                    }
                }
            }, function(error) {
                cbOnError(error);
            });
        } else {
            xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut);
            if (params.id !== undefined) {
                sUrl = self.endPoint + self.appendUrl + '/' + params.id;
            }
            xhr.open(self.verb, sUrl);
            xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));
            if (params.accept !== undefined) {
                xhr.setRequestHeader('Accept', params.accept);
            }
            xhr.send();
        }
    };
    /**
     * CALLING function to check Access Token
     * If already Generated then direct call API else generate AccessToken
     */
    checkAccessToken(mmsRequest);
};

/**
 * Executor for MOBO api
 * This MOBO api call uses native module.
 */

var MOBOExecutor = function(params, cbOnData, cbOnError) {"use strict";
    sessionOBJ.attHelper.prepareExecutor(this);
    var self = this, moboRequest, xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut);
    moboRequest = function(accessToken) {
        var sUrl, argumnetsMOBO, att;
        if (self.method.toLowerCase() === 'sendmessage') {
            att = require('ti.api.att');
            sUrl = self.endPoint;
            argumnetsMOBO = {
                "body" : params.body ? params.body : '',
                "contentType" : params.contentType ? params.contentType : '',
                "accept" : params.accept,
                "accessToken" : "Bearer" + " " + accessToken,
                "url" : sUrl,
                "attachments" : (params.attachments && params.attachments.length > 0) ? params.attachments : [{}]
            };
            att.sendMessage(argumnetsMOBO, function(data) {
                if (params.accept === "application/xml") {
                    if (cbOnData) {
                        cbOnData(data.success);
                    }
                } else {
                    if (cbOnData) {
                        cbOnData(data);
                    }
                }
            }, function(error) {
                cbOnError(error);
            });
        } else {
            if (self.method.toLowerCase() === 'getmessageheaders') {
                if (params.indexCursor !== undefined) {
                    sUrl = self.endPoint + '?' + 'HeaderCount=' + params.headerCount + '&' + 'IndexCursor=' + Ti.Network.encodeURIComponent(params.indexCursor);
                } else {
                    sUrl = sUrl = self.endPoint + '?' + 'HeaderCount=' + params.headerCount;
                }
            } else if (self.method.toLowerCase() === 'getmessagecontent') {
                if (params.partNumber !== undefined) {
                    sUrl = self.endPoint + '/' + params.messageId + '/' + params.partNumber;
                } else {
                    sUrl = self.endPoint + '/' + params.messageId;
                }
            }
            xhr.open(self.verb, sUrl);

            xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));
            if (params.accept !== undefined) {
                xhr.setRequestHeader('Accept', params.accept);
            }
            xhr.send();
        }
    };
    /**
     *  set sessionOBJ.isAuthCode = true to indicate generation of oauth token.
     * CALLING function to check Oauth Token
     * If already Generated then direct call API else generate AccessToken
     */
    sessionOBJ.isAuthCode = true;
    generateAccessToken(moboRequest);
};

/**
 * Executor for OAUTH api
 */

var OAUTHExecutor = function(params, cbOnData, cbOnError) {"use strict";
    sessionOBJ.attHelper.prepareExecutor(this);
    var self = this, ObtainEndUserAuthorization, xhr, url;
    xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut);
    if ((params.clientId !== undefined) && (params.scope !== undefined)) {
        if (params.redirectUrl !== undefined) {
            url = self.endPoint + self.appendUrl + '?' + 'client_id=' + params.clientId + '&' + 'scope=' + params.scope + '&' + 'redirect_url=' + params.redirectUrl;
        } else {
            url = self.endPoint + self.appendUrl + '?' + 'client_id=' + params.clientId + '&' + 'scope=' + params.scope;
        }
    } else {
        url = self.endPoint + self.appendUrl;
    }
    xhr.open(self.verb, url);
    xhr.send();
};

/**
 * Executor for WAPPush api
 * This calls to WAPPush api uses native module
 */

var SendWAPPushExecutor = function(params, cbOnData, cbOnError) {"use strict";
    sessionOBJ.attHelper.prepareExecutor(this);
    var self = this, wapRequest, sUrl, argsWapPush, att;
    wapRequest = function(accessToken) {
        att = require('ti.api.att');
        sUrl = self.endPoint;
        var argsWapPush = {
            "url" : sUrl,
            "accessToken" : "Bearer " + accessToken,
            "body" : params.body ? params.body : 'null',
            "data" : params.data ? params.data : 'null',
            "contentType" : params.contentType ? params.contentType : '',
            "accept" : params.accept ? params.accept : ''
        };
        att.sendWapPush(argsWapPush, function(data) {
            if (params.accept === "application/xml") {
                if (cbOnData) {
                    cbOnData(data.success);
                }
            } else {
                if (cbOnData) {
                    cbOnData(data);
                }
            }
        }, function(error) {
            cbOnError(error);
        });
    };

    /**
     * CALLING function to check Access Token
     * If already Generated then direct call API else generate AccessToken
     */
    checkAccessToken(wapRequest);
};
/**
 * Executor for NOTARY api
 */

var NOTARYExecutor = function(params, cbOnData, cbOnError) {"use strict";
    sessionOBJ.attHelper.prepareExecutor(this);
    var self = this, notaryRequest;
    notaryRequest = function(accessToken) {
        var xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut);
        xhr.open(self.verb, self.endPoint);
        if (params.clientId !== undefined) {
            xhr.setRequestHeader('Client_id', params.clientId);
        }
        if (Ti.Platform.osname !== 'android') {
            xhr.setRequestHeader('Content-Length', params.contentLength);
        }
        if (params.clientSecret !== undefined) {
            xhr.setRequestHeader('Client_secret', params.clientSecret);
        }
        if (params.contentType !== undefined) {
            xhr.setRequestHeader('Content-Type', params.contentType);
        }
        if (params.accept !== undefined) {
            xhr.setRequestHeader('Accept', params.accept);
        }

        if (params.data.MerchantPaymentRedirectUrl !== undefined) {
            params.data.MerchantPaymentRedirectUrl = params.data.MerchantPaymentRedirectUrl + "?token=" + sessionOBJ.accessToken;
        }
        xhr.send(JSON.stringify(params.data));

    };
    /**
     * CALLING function to check Access Token
     * If already Generated then direct call API else generate AccessToken
     */
    checkAccessToken(notaryRequest);

};
/**
 * Executor for Payment api
 */

var PaymentExecutor = function(params, cbOnData, cbOnError) {"use strict";
    var self = this, xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut), url, getStatus;
    sessionOBJ.attHelper.prepareExecutor(this);
    if (self.method.toLowerCase() === 'newtransaction' || self.method.toLowerCase() === 'newsubscription') {
        cbOnData(this.endPoint + this.appendUrl + '?Signature=' + params.signature + "&SignedPaymentDetail=" + params.signedDocument + "&clientid=" + params.clientId);
    } else if (self.method.toLowerCase() === 'refundtransaction') {
        refundTransaction = function(accessToken) {
            url = self.endPoint + self.appendUrl + '/' + params.transactionId + '?Action=' + params.action;
            xhr.open(self.verb, url);
            xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));
            if (params.contentType !== undefined) {
                xhr.setRequestHeader('Content-Type', params.contentType);
            }
            if (params.accept !== undefined) {
                xhr.setRequestHeader('Accept', params.accept);
            }
            if (params.contentType === 'application/json') {
                xhr.send(JSON.stringify(params.body));
            } else {
                xhr.send(params.body);
            }
        };
        checkAccessToken(refundTransaction);

    } else {
        getStatus = function(accessToken) {
            if (self.method.toLowerCase() === 'getsubscriptionstatus') {
                if (params.subscriptionId) {
                    url = self.endPoint + self.appendUrl + 'SubscriptionId/' + params.subscriptionId;
                } else if (params.merchantTransactionId) {
                    url = self.endPoint + self.appendUrl + 'MerchantTransactionId/' + params.merchantTransactionId;
                } else if (params.subscriptionAuthCode) {
                    url = self.endPoint + self.appendUrl + 'SubscriptionAuthCode/' + params.subscriptionAuthCode;
                }
            } else if (self.method.toLowerCase() === 'gettransactionstatus') {
                if (params.transactionId) {
                    url = self.endPoint + self.appendUrl + 'TransactionId/' + params.transactionID;
                } else if (params.merchantTransactionId) {
                    url = self.endPoint + self.appendUrl + 'MerchantTransactionId/' + params.merchantTransactionId;
                } else if (params.transactionAuthCode) {
                    url = self.endPoint + self.appendUrl + 'TransactionAuthCode/' + params.transactionAuthCode;
                }
            } else if (self.method.toLowerCase() === 'getnotification' || self.method.toLowerCase() === 'acknowledgenotification') {
                url = self.endPoint + self.appendUrl + params.notificationId;
            } else if (self.method.toLowerCase() === 'getsubscriptiondetails') {
                url = self.endPoint + self.appendUrl + params.merchantSubscriptionId + '/Detail/' + params.consumerId;
            }
            xhr.open(self.verb, url);
            xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));
            if (params.accept !== undefined) {
                xhr.setRequestHeader('Accept', params.accept);
            }
            xhr.send();
        };

        checkAccessToken(getStatus);

    }

};

/**
 * Executor for LOCATION api
 */

var LOCATIONExecutor = function(params, cbOnData, cbOnError) {"use strict";
    sessionOBJ.attHelper.prepareExecutor(this);
    var self = this, locationRequest;
    locationRequest = function(accessToken) {
        var xhr = sessionOBJ.httpRequest.createHttpObject(cbOnData, cbOnError, ATT.httpTimeOut), keys, url = self.endPoint, body = '';
        if ((params.requestedAccuracy !== undefined) || (params.tolerance !== undefined) || (params.acceptableAccuracy !== undefined)) {
            for (keys in params) {
                if ((params.hasOwnProperty(keys)) && (keys !== 'Accept')) {
                    body = body + '&' + keys + '=' + params[keys];
                }
            }
            body = body.substr(1, body.length);
            url = self.endPoint + '?' + body;
        }
        xhr.open(self.verb, url);
        xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));

        if (params.accept !== undefined) {
            xhr.setRequestHeader('Accept', params.accept);

        } else if (self.accept !== undefined) {
            xhr.setRequestHeader('Accept', self.accept);
        }

        xhr.send();

    };
    /**
     *  set sessionOBJ.isAuthCode = true to indicate generation of oauth token.
     * CALLING function to check Oauth Token
     * If already Generated then direct call API else generate AccessToken
     */
    sessionOBJ.isAuthCode = true;
    generateAccessToken(locationRequest);
};

//Namespace used for API methods
var ATT = {};
ATT.httpTimeOut = 90000;
// Timeout default value is 90 milliseconds.

/**
 * Stores the security credentials in the Module Session scope
 * @param accessKeyId - AccessKey provided by the user
 * @param secretKey - SecretKey provided by the user
 * @param scope -Scope provided by user
 * @param grantType -grantType provided by user
 * @param outhCode - outhCode provided by the user
 */

ATT.authorize = function(accessKeyId, secretKey, scope, grantType, outhCode) {"use strict";
    sessionOBJ.accessKeyId = accessKeyId;
    sessionOBJ.secretKey = secretKey;
    sessionOBJ.scope = scope;
    sessionOBJ.grantType = grantType;
    sessionOBJ.outhCode = outhCode;
};

/**
 * Call build() method of bedframe.js
 */

sessionOBJ.bedFrame.build(ATT, {
    verb : 'POST',
    preparer : function() {"use strict";
        if (!this.action) {
            var initCap = this.method.substr(0, 1).toUpperCase();
            this.action = initCap + this.method.substr(1);
            // Action is Usually same as Method Name, unless explicitly stated
        }
    },
    children : [{
        property : 'SMS',
        endPoint : 'https://api.att.com/rest/sms/2/messaging',
        executor : SMSExecutor,
        children : [{
            'method' : 'sendSMS',
            'appendUrl' : '/outbox'
        }, {
            'method' : 'getSMSDeliveryStatus',
            'appendUrl' : '/outbox/',
            'verb' : 'GET'

        }, {
            'method' : 'getSMS',
            'verb' : 'GET',
            'appendUrl' : '/inbox?'
        }]

    }, {
        property : 'MMS',
        endPoint : 'https://api.att.com/rest/mms/2/messaging',
        executor : MMSExecutor,
        children : [{
            'method' : 'sendMMS',
            'appendUrl' : '/outbox'
        }, {
            'method' : 'getMMSDeliveryStatus',
            'appendUrl' : '/outbox',
            'verb' : 'GET'
        }]

    }, {
        property : 'OAuth',
        endPoint : 'https://api.att.com/oauth',
        executor : OAUTHExecutor,
        children : [{
            'method' : 'obtainEndUserAuthorization',
            'appendUrl' : '/authorize',
            'verb' : 'GET'
        }]
    }, {
        property : 'WAPPush',
        endPoint : 'https://api.att.com/1/messages/outbox/wapPush',
        executor : SendWAPPushExecutor,
        children : [{
            'method' : 'sendWAPPush'
        }]

    }, {
        property : 'Location',
        endPoint : 'https://api.att.com/2/devices/location',
        executor : LOCATIONExecutor,
        children : [{
            'method' : 'getDeviceLocation',
            'verb' : 'GET'
        }]

    }, {
        property : 'MOBO',
        endPoint : 'https://api.att.com/rest/1/MyMessages',
        executor : MOBOExecutor,
        children : [{
            'method' : 'sendMessage'
        }, {
            'method' : 'getMessageHeaders',
            'verb' : 'GET'

        }, {
            'method' : 'getMessageContent',
            'verb' : 'GET'
        }]

    }, {
        property : 'Speech',
        endPoint : 'https://api.att.com/rest/1/SpeechToText',
        executor : STTExecutor,
        children : [{
            'method' : 'speechToText'
        }]

    }, {
        property : 'Notary',
        endPoint : 'https://api.att.com/Security/Notary/Rest/1/SignedPayload',
        executor : NOTARYExecutor,
        children : [{
            'method' : 'signedPayload'
        }]

    }, {
        property : 'Payment',
        endPoint : 'https://api.att.com',
        executor : PaymentExecutor,
        children : [{
            'method' : 'newTransaction',
            'appendUrl' : '/rest/3/Commerce/Payment/Transactions',
            'verb' : 'GET'
        }, {
            'method' : 'getTransactionStatus',
            'appendUrl' : '/rest/3/Commerce/Payment/Transactions/',
            'verb' : 'GET'
        }, {
            'method' : 'newSubscription',
            'appendUrl' : '/rest/3/Commerce/Payment/Subscriptions',
            'verb' : 'GET'
        }, {
            'method' : 'getSubscriptionStatus',
            'appendUrl' : '/rest/3/Commerce/Payment/Subscriptions/',
            'verb' : 'GET'
        }, {
            'method' : 'refundTransaction',
            'appendUrl' : '/rest/3/Commerce/Payment/Transactions',
            'verb' : 'PUT'
        }, {
            'method' : 'getSubscriptionDetails',
            'appendUrl' : '/rest/3/Commerce/Payment/Subscriptions/',
            'verb' : 'GET'
        }, {
            'method' : 'getNotification',
            'appendUrl' : '/rest/3/Commerce/Payment/Notifications/',
            'verb' : 'GET'
        }, {
            'method' : 'acknowledgeNotification',
            'appendUrl' : '/rest/3/Commerce/Payment/Notifications/',
            'verb' : 'PUT'
        }]

    }]
});
exports.ATT = ATT;

