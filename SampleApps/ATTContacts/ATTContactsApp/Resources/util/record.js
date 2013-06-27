
var RECORD_ERROR_TYPE = 'RecordError'
,   isRecording = false
,   isAndroid = (Titanium.Platform.osname === "android")
,   recorder = {
        duration: 3000,
        fileName: 'temp',
        isRecording: function() { return isRecording; }
    }
,   nativeRecorder;

function buildError(msg) {
    return {
        error: {
            type: RECORD_ERROR_TYPE,
            message: msg
        }
    };
}

function sendError(cb, msg) {
    isRecording = false;
    cb.call(recorder, buildError(msg));
}

function copyFile(oldFile, newFilePath) {
    var tempFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, newFilePath);
    tempFile.write(oldFile, false);
   
    return tempFile;
}

if(isAndroid) {
    nativeRecorder = require('ti.api.att.audiorecorder');
    
    nativeRecorder.outputFormat = nativeRecorder.OUTPUT_FORMAT_RAW_AMR;
    nativeRecorder.audioEncoder = nativeRecorder.AUDIO_ENCODER_AMR_NB;
    
} else {
    Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;
    
    nativeRecorder = Ti.Media.createAudioRecorder();
    nativeRecorder.compression = Ti.Media.AUDIO_FORMAT_ULAW;
    nativeRecorder.format = Ti.Media.AUDIO_FILEFORMAT_WAVE;
}

recorder.record = function(cb) {
    if(isRecording) return sendError(cb, 'Recording in progress');
    
    if(isAndroid) {
        var tmpFile = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, (this.fileName + '.amr'));
        nativeRecorder.filePath = tmpFile.nativePath;
    }
    
    try {
        nativeRecorder.start();
    } catch(e) {
        sendError(cb, e.name + ': ' + e.message);
        return;
    }
    
    if(!nativeRecorder.recording) {
        sendError(cb, 'Error starting the recording' + (c.isAndroid) ? '' : '. Cannot record in the simulator');
        return;
    }
    
    isRecording = true;
    
    var clearRecording = function() {}, recTimeout;
    
    if(isAndroid) {
        clearRecording = function(withStop) {
            if(withStop) nativeRecorder.stop(); //Stop the recording if the activity is stopped on android
            Ti.Android.currentActivity.removeEventListener('stop', clearRecording);
            clearTimeout(recTimeout);
        };
        Ti.Android.currentActivity.addEventListener('stop', clearRecording);
    }
    
    recTimeout = setTimeout(function() {
        
        var audioFile = nativeRecorder.stop();
        clearRecording();
        
        audioFile = isAndroid ? Ti.Filesystem.getFile(audioFile) : copyFile(audioFile, this.fileName + '.wav');
        
        isRecording = false;
        
        if(audioFile.size === 0) {
            sendError(cb, 'Unable to write the recording to the filesystem');
            return;
        }
        
        cb({ data: { filePath: audioFile.nativePath }});
    }, this.duration);
};

module.exports = recorder;
