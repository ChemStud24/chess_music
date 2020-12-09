// var songs = ['changes.wav','crucify.wav','gloom.wav','gunplay.wav','model.wav','panic.wav','please.wav','scale.wav','war.wav'];
// var first_time = false;

// var myMusic = new Audio('songs/wav/' + songs[Math.floor(Math.random() * songs.length)]);
// myMusic.addEventListener('ended', function() {
// 	this.currentTime = 0;
// 	this.play();
// }, false);

// function newSong() {
// 	myMusic.pause();
// 	myMusic = new Audio('songs/wav/' + songs[Math.floor(Math.random() * songs.length)]);
// 	myMusic.play();
// 	myMusic.addEventListener('ended', function() {
// 	this.currentTime = 0;
// 	this.play();
// }, false);
// }

// function startMusic() {
// 	if (!first_time) {
// 		first_time = true;
// 		newSong();
// 	}
// }

// document.getElementById("doc").addEventListener("click", startMusic);

var songs = [changes,crucify,gloom,gunplay,model,panic,please,scale,war];
var bpms = [88,135,98,119,160,89,166,150,148];
var Player = 1;
var tempo;
var song;
var newSong;
var ac = new AudioContext;

// function newSong() {
// 	Player = new MidiPlayer.Player(function(event) {
// 		if (event.name == 'Note on' && event.velocity > 0) {
// 			instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
// 		}
// 	});
// }

var changeTempo = function() {
	if (moveIdx <= 0) {
		preval = 0.35;
	} else {
		preval = evals[moveIdx-1];
	}
	scoreNow = evals[moveIdx];

	if ((preval >= 0 && scoreNow > 0) || (preval <= 0 && scoreNow < 0)) {
		if (Math.abs(scoreNow) > Math.abs(preval)) {
			// the lead increased
			factor = Math.abs(wp(scoreNow) - wp(preval)) + 1;
		} else {
			// the lead decreased
			factor = 1 - Math.abs(wp(scoreNow) - wp(preval));
		}

	} else {
		// the lead changed
		factor = 2*Math.abs(wp(scoreNow) - wp(preval)) + 1;
	}
	// diff = wp(evals[moveIdx]) - prevWP;
	// t = Math.floor(tempo - 50 + 100*Math.abs(diff));
	// Player.tempo = t;
	tempo = Math.floor(tempo * factor);
	Player.tempo = tempo;
	document.getElementById("printout").innerHTML = "Tempo: " + tempo;
	// if (Math.abs(evals[moveIdx]) > 1) {
	// 	Player.tempo = 200;
	// 	document.getElementById("printout").innerHTML = "Tempo: 200";
	// } else {
	// 	Player.tempo = tempo;
	// 	document.getElementById("printout").innerHTML = "Tempo: " + tempo;
	// }
}

function wp(score) {
	return 1/(1+Math.pow(10,-score/4));
}

Soundfont.instrument(ac, 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/acoustic_guitar_nylon-mp3.js').then(function (instrument) {

	// Player = new MidiPlayer.Player(function(event) {
	// 	if (event.name == 'Note on' && event.velocity > 0) {
	// 		instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
	// 	}
	// });

	// Player.on('endOfFile',function(event){
	// 	Player.resetTracks();
	// 	document.getElementById("printout").innerHTML = "I GOT HERE!!!"
	// 	Player.play();
	// });

	newSong = function() {
		if (Player != 1) {
			Player.stop();
		}
		var songIdx = Math.floor(Math.random() * songs.length);
		song = songs[songIdx];
		tempo = bpms[songIdx];
		restart();
		Player.tempo = tempo;
	}

	function restart() {
		Player = new MidiPlayer.Player(function(event) {
			if (event.name == 'Note on' && event.velocity > 0) {
				instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
			}
		});

		Player.on('endOfFile',function(event){
			restart();
		});

		Player.loadDataUri(song);
		Player.play();
	}
});