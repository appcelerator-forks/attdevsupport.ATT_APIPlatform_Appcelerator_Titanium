var win = Titanium.UI.currentWindow;

Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;
var recording = Ti.Media.createAudioRecorder();
recording.compression = Ti.Media.AUDIO_FORMAT_ULAW;
recording.format = Ti.Media.AUDIO_FILEFORMAT_WAVE;

Ti.Media.addEventListener('recordinginput', function(e) {
	'use strict';
	Ti.API.info('Input availability changed: ' + e.available);
	if (!e.available && recording.recording) {
		b1.fireEvent('click', {});
	}
});

var file,timer,sound;

var label = Titanium.UI.createLabel({
	text : '',
	top : 150,
	color : '#999',
	textAlign : 'center',
	width : 'auto',
	height : 'auto'
});

win.add(label);

function lineTypeToStr() {
	'use strict';
	var type = Ti.Media.audioLineType;
	switch(type) {
		case Ti.Media.AUDIO_HEADSET_INOUT:
			return "headset";
		case Ti.Media.AUDIO_RECEIVER_AND_MIC:
			return "receiver/mic";
		case Ti.Media.AUDIO_HEADPHONES_AND_MIC:
			return "headphones/mic";
		case Ti.Media.AUDIO_HEADPHONES:
			return "headphones";
		case Ti.Media.AUDIO_LINEOUT:
			return "lineout";
		case Ti.Media.AUDIO_SPEAKER:
			return "speaker";
		case Ti.Media.AUDIO_MICROPHONE:
			return "microphone";
		case Ti.Media.AUDIO_MUTED:
			return "silence switch on";
		case Ti.Media.AUDIO_UNAVAILABLE:
			return "unavailable";
		case Ti.Media.AUDIO_UNKNOWN:
			return "unknown";
	}
}

var linetype = Titanium.UI.createLabel({
	text : "audio line type: " + lineTypeToStr(),
	bottom : 20,
	color : '#999',
	textAlign : 'center',
	width : 'auto',
	height : 'auto'
});

win.add(linetype);
var volume = Titanium.UI.createLabel({
	text : "volume: " + Ti.Media.volume,
	bottom : 50,
	color : '#999',
	textAlign : 'center',
	width : 'auto',
	height : 'auto'
});

win.add(volume);

Ti.Media.addEventListener('linechange', function(e) {
	'use strict';
	linetype.text = "audio line type: " + lineTypeToStr();
	Ti.API.info('linechange' + JSON.stringify(e));
});

Ti.Media.addEventListener('volume', function(e) {
	'use strict';
	 volume.text = "volume: " + e.volume;
	 Ti.API.info('volume' + JSON.stringify(e));
});

var duration = 0;

function showLevels() {
	'use strict';
	var peak,avg;
	peak = Ti.Media.peakMicrophonePower;
	avg = Ti.Media.averageMicrophonePower;
	duration+=1;
	label.text = 'duration: ' + duration + ' seconds\npeak power: ' + peak + '\navg power: ' + avg;
}

var b1 = Titanium.UI.createButton({
	title : 'Start Recording',
	width : 200,
	height : 40,
	top : 20
});
b1.addEventListener('click', function() {
	'use strict';
	Ti.API.debug(b1.title + ' Clicked');
	if (recording.recording) {
		file = recording.stop();
		Ti.API.debug('Recording Stopped');
		Ti.API.debug('Recorded FileSize: ' + file.size);
		var tempFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'temp.wav');
		tempFile.write(file);
		b1.title = "Start Recording";
		Ti.API.debug('Button Title changed to ' + b1.title);
		b2.show();
		pause.hide();
		clearInterval(timer);
		Ti.API.debug("Timer stopped");
		Ti.Media.stopMicrophoneMonitor();
		Ti.API.debug("Microphone monitoring stopped");
	} else {
		if (!Ti.Media.canRecord) {
			Ti.UI.createAlertDialog({
				title : 'Error!',
				message : 'No audio recording hardware is currently connected.'
			}).show();
			return;
		}
		b1.title = "Stop Recording";
		recording.start();
		Ti.API.debug("Recording started...");
		b2.hide();
		pause.show();
		Ti.Media.startMicrophoneMonitor();
		Ti.API.debug("Microphone monitoring started");
		duration = 0;
		timer = setInterval(showLevels, 1000);
	}
});
win.add(b1);

var pause = Titanium.UI.createButton({
	title : 'Pause recording',
	width : 200,
	height : 40,
	top : 80
});
win.add(pause);
pause.hide();

pause.addEventListener('click', function() {
	'use strict';
	if (recording.paused) {
		pause.title = 'Pause recording';
		recording.resume();
		Ti.API.debug("Recording resumed...");
		timer = setInterval(showLevels, 1000);
	} else {
		pause.title = 'Unpause recording';
		recording.pause();
		Ti.API.debug("Recording paused");
		clearInterval(timer);
	}
});

var b2 = Titanium.UI.createButton({
	title : 'Playback Recording',
	width : 200,
	height : 40,
	top : 80
});

win.add(b2);
b2.hide();
b2.addEventListener('click', function() {
	'use strict';
	if (sound && sound.playing) {
		sound.stop();
		sound.release();
		sound = null;
		b2.title = 'Playback Recording';
	} else {
		Ti.API.info("Recording file size: " + file.size);
		sound = Titanium.Media.createSound({
			sound : file,
			volume : 0.9
		});
		sound.addEventListener('complete', function() {
			b2.title = 'Playback Recording';
		});
		sound.play();
		b2.title = 'Stop Playback';
	}
});

var switchLabel = Titanium.UI.createLabel({
	text : 'Hi-fidelity:will not work',
	width : 'auto',
	height : 'auto',
	textAlign : 'center',
	color : '#999',
	bottom : 115
});
var switcher = Titanium.UI.createSwitch({
	value : false,
	bottom : 80
});

switcher.addEventListener('change', function(e) {
	'use strict';
	if (!switcher.value) {
		recording.compression = Ti.Media.AUDIO_FORMAT_ULAW;
	} else {
		recording.compression = Ti.Media.AUDIO_FORMAT_ULAW;
	}
});
win.add(switchLabel);
win.add(switcher);
