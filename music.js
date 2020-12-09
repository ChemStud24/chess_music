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

var songs = ['changes.mid','crucify.mid','gloom.mid','gunplay.mid','model.mid','panic.mid','please.mid','scale.mid','war.mid']
var Player;
var newSong;
var ac = new AudioContext;

// function newSong() {
// 	Player = new MidiPlayer.Player(function(event) {
// 		if (event.name == 'Note on' && event.velocity > 0) {
// 			instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
// 		}
// 	});
// }

var changeTempo = function(tempo) {
	Player.tempo = tempo;
}

Soundfont.instrument(ac, 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/acoustic_guitar_nylon-mp3.js').then(function (instrument) {

	Player = new MidiPlayer.Player(function(event) {
		if (event.name == 'Note on' && event.velocity > 0) {
			instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
		}
	});

	newSong = function() {
		// Player.stop()
		var file = 'songs/wav/' + songs[Math.floor(Math.random() * songs.length)];
		// var reader = new FileReader();
		// reader.readAsArrayBuffer(file);

		// reader.addEventListener("load",function(){
		// 	Player = new MidiPlayer.Player(function(event) {
		// 		if (event.name == 'Note on' && event.velocity > 0) {
		// 			instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
		// 		}
		// 	});
		// });

		Player.loadFile(file);
		Player.play();
	}
});