var songs = ['changes.wav','crucify.wav','gloom.wav','gunplay.wav','model.wav','panic.wav','please.wav','scale.wav','war.wav'];
var first_time = false;

var myMusic = new Audio('songs/wav/' + songs[Math.floor(Math.random() * songs.length)]);
myMusic.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
}, false);

function newSong() {
	myMusic.pause();
	myMusic = new Audio('songs/wav/' + songs[Math.floor(Math.random() * songs.length)]);
	myMusic.play();
	myMusic.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
}, false);
}

function startMusic() {
	if (!first_time) {
		first_time = true;
		newSong();
	}
}

document.getElementById("doc").addEventListener("click", startMusic);