// define variables
const chess = new Chess();
var xh = new XMLHttpRequest();
var archive
var archLength = -1;
var fens = [];
var moveIdx = -1;
var gameIdx;
var playing = false;
var playId;
var board = Chessboard(document.getElementById("myBoard"),"start");

// add function call for fetching data from chess.com API
xh.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    // fetch and parse game data
    archive = JSON.parse(this.responseText);
    // if there is a new game, update the display
    // if (archive.games.length != archLength) {
    archLength = archive.games.length;
    gameIdx = archLength - 1;
    updateGame();
    stockfish.postMessage("isready");
  }
};

function updateGame() {
  stopNOW = true;
  stockfish.postMessage("stop");
  newSong();
  evals = [];
  if (finished) {
    stockfish.postMessage("isready");
  }
  document.getElementById("gameNumber").innerHTML = "Game " + (gameIdx + 1) + " of " + archLength;

  var game = archive.games[gameIdx];
  document.getElementById("players").innerHTML = game.white.username + " (" + game.white.rating + ")" + "<span class='vs'> vs. </span>" + game.black.username + " (" + game.black.rating + ")";
  document.getElementById("link").href = game.url;
  var pgn = game.pgn;

  // reset the board
  goToStart();

  // extract move list
  var start = pgn.search("Link");
  var moves = pgn.slice(pgn.indexOf("1.",start),pgn.length);
  if (moves.indexOf("{") != -1) {
    var temp = moves.split(" ");
    var new_moves = temp.filter(filtering);
    if (new_moves[new_moves.length-1] != temp[temp.length-1]) {
      new_moves.push(temp[temp.length-1])
    }
    moves = new_moves.join(" ");
  }

  // build moves HTML
  var splitMoves = moves.split(" ");
  var movesHTML = splitMoves[0];
  var idx = 0;
  for (i = 1; i < splitMoves.length; i++) {
    if (i % 3 == 0 || i == splitMoves.length-1) {
      movesHTML += " " + splitMoves[i];
    } else {
      movesHTML += " <span id='" + idx + "' onclick='goToMove(" + idx + ")'>" + splitMoves[i] + "</span>";
      // movesHTML += " <span id='" + idx + "'>" + splitMoves[i] + "</span>";
      idx++;
    }
  }
  document.getElementById("moves").innerHTML = movesHTML;
  // add click event listeners to move list
  // for (j = 0; j < idx; j++) {
  //   document.getElementById(j).addEventListener("click",function() {goToMove(j)});
  // }

  // extract game info
  var result = moves.slice(moves.lastIndexOf(" ")+1) + " | ";
  var start = pgn.indexOf("Event");
  var end = pgn.search("]",start);
  var event = pgn.slice(start+7, end-1) + " | Chess.com | ";
  var start = pgn.indexOf("Date");
  var end = pgn.indexOf("]",start);
  var date = pgn.slice(start+6, end-1);
  document.getElementById("info").innerHTML = result + event + date;

  // cleaning up chess.com PGNs
  function filtering(value, index, array) {
    switch (index % 8) {
      case 0:
        return true;
        break;
      case 1:
        return true;
        break;
      case 5:
        return true;
        break;
    }
  }

  // get moves as a list of fens
  fens = [];
  chess.load_pgn(game.pgn);
  var hist = chess.history();
  var chess2 = new Chess();
  for (var i=0; i < hist.length; i++) {
    chess2.move(hist[i]);
    fens.push(chess2.fen());
  }

  // // print list of fens
  // document.getElementById("fens").innerHTML = "<p>" + fens.join("</p><p>") + "</p>";

  // print list of evaluations
  // stockfish.postMessage("isready");
  // }
}

// get the current month
var d = new Date();
var month = d.getMonth() + 1;
if (month < 10) {
  month = "0" + month;
}

document.getElementById("month").value = month;
document.getElementById("year").value = d.getFullYear();

function update() {
  // fetch the game archive and update the display
  // xh.open("GET", "https://api.chess.com/pub/player/ChemStud24/games/" + d.getFullYear() + "/" + month, true);
  xh.open("GET", "https://api.chess.com/pub/player/" +
    document.getElementById("username").value + "/games/" +
    document.getElementById("year").value +
    "/" + document.getElementById("month").value, true);
  xh.send();
}

// update();
// setInterval(update,30000); // update every 30 seconds with the most recent game

// add position navigation functions
function goToStart() {
  // un-highlight the last position
  if (moveIdx != -1) {
    document.getElementById(moveIdx).style="background-color: #fff";
  }
  // stop autoplay
  if (playing) {
    playpause();
  }
  moveIdx = -1; // update move index
  board.position("start");
  changeTempo();
}

function nextMoveButton() {
  // stop autoplay
  if (playing) {
    playpause();
  }
  nextMove();
}

function nextMove() {
  // un-highlight the last position
  if (moveIdx != -1) {
    document.getElementById(moveIdx).style="background-color: #fff";
  }
  // update move index
  moveIdx++;
  if (moveIdx > fens.length-1) {
    moveIdx = fens.length-1;
    // stop autoplay if we reached the end of the game
    // if (playing) {
    //   playpause();
    // }
  }
  // stop autoplay if we reached the end of the game
  if (playing && moveIdx == fens.length-1) {
    playpause();
  }
  // highlight the current position
  document.getElementById(moveIdx).style="background-color: #ffff00";
  board.position(fens[moveIdx]);
  changeTempo();
}

function prevMove() {
  // un-highlight the last position
  if (moveIdx != -1) {
    document.getElementById(moveIdx).style="background-color: #fff";
  }
  // stop autoplay
  if (playing) {
    playpause();
  }
  // update move index
  moveIdx--;
  if (moveIdx <= -1) {
    moveIdx = -1;
    board.position("start");
  } else {
    // highlight the current position
    document.getElementById(moveIdx).style="background-color: #ffff00";
    board.position(fens[moveIdx]);
    changeTempo();
  }
}

function goToMove(n) {
  // un-highlight the last position
  if (moveIdx != -1) {
    document.getElementById(moveIdx).style="background-color: #fff";
  }
  // update move index
  moveIdx = n;
  // stop autoplay
  if (playing) {
    playpause();
  }
  // highlight the current position
  document.getElementById(n).style="background-color: #ffff00";
  board.position(fens[n]);
  changeTempo();
}

function goToEnd() {
  // un-highlight the last position
  if (moveIdx != -1) {
    document.getElementById(moveIdx).style="background-color: #fff";
  }
  // stop autoplay
  if (playing) {
    playpause();
  }
  // update move index
  moveIdx = fens.length-1
  // highlight the current position
  document.getElementById(moveIdx).style="background-color: #ffff00";
  board.position(fens[moveIdx]);
  changeTempo();
}

function playpause() {
  if (playing) {
    // switch to play button
    document.getElementById("play-pause").innerHTML = "&#9658";
    clearInterval(playId); // stop autoplay
  } else {
    // switch to pause button
    document.getElementById("play-pause").innerHTML = "&#10074&#10074";
    nextMove();
    playId = setInterval(nextMove,3000); // begin autoplay
  }
  playing = !playing;
}

function nextGame() {
  gameIdx++;
  gameIdx = Math.min(gameIdx,archLength-1);
  updateGame();
}

function prevGame() {
  gameIdx--;
  gameIdx = Math.max(gameIdx,0);
  updateGame();
}

// add functions to buttons
document.getElementById("flipBtn").addEventListener("click",function() {board.orientation('flip')});
document.getElementById("play-pause").addEventListener("click",playpause);
document.getElementById("startBtn").addEventListener("click",goToStart);
document.getElementById("prevBtn").addEventListener("click",prevMove);
document.getElementById("nextBtn").addEventListener("click",nextMoveButton);
document.getElementById("endBtn").addEventListener("click",goToEnd);
document.getElementById("updateBtn").addEventListener("click",update)
document.getElementById("nextGame").addEventListener("click",nextGame);
document.getElementById("prevGame").addEventListener("click",prevGame);