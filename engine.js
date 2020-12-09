DEPTH = 16;
DEBUG = false;
var stopNOW = false;
var finished = false;
var fenIdx;
var score;
var evals = [];
var printout = [];
var stockfish = new Worker("node_modules/stockfish/src/stockfish.js");

// var stockfish = STOCKFISH();
stockfish.onmessage = function(event) {
	console.log(event.data ? event.data : event);

	// start a new game on startup
	if (event.data == "uciok") {
		stockfish.postMessage("ucinewgame");
	} else if (event.data == "readyok") {
		// start looping through the fens
		stopNOW = false;
		finished = false;
		fenIdx = 0;
		stockfish.postMessage("position fen " + fens[fenIdx]);
		stockfish.postMessage("go depth " + DEPTH);
	} else if (!stopNOW) {
		if (event.data.includes("info")) {
			data = event.data.split(" ");
			depth = data[data.indexOf("depth") + 1];
			// if (depth == DEPTH) {
			if (data.includes("mate")) {
				if (Number(data[data.indexOf("mate")+1]) > 0) {
					score = 150;
				} else {
					score = -150;
				}
			} else {
				score = Number(data[data.indexOf("cp")+1])/100;
			}
			// reverse the evaluation if the engine is moving for black
			if (!fens[fenIdx].includes("w")) {
				score = -score;
		}
			// document.getElementById("printout").innerHTML = score + " " + evals.length;
			evals.push(score);
			// var evalHTML = "";
			// for (i = 0; i < evals.length; i++) {
			// 	if (i % 2 == 0) {
			// 		evalHTML += "<p>" + (i/2+1) + ". " + evals[i] + " ";
			// 	} else if (i != evals.length-1) {
			// 		evalHTML += evals[i] + "</p><p>";
			// 	} else {
			// 		evalHTML += evals[i] + "</p>";
			// 	}
			// }
			// 	document.getElementById("evals").innerHTML = evalHTML;
				evals.pop();
				// document.getElementById("evals").innerHTML = "<p>" + evals.join("</p><p>") + "</p>";
			// }
			if (DEBUG) {
				printout.push(event.data);
				// document.getElementById("printout").innerHTML = "<p>" + printout.join("</p><p>") + "</p>";
			}
		} else if (event.data.includes("bestmove")) {
			evals.push(score);
			fenIdx++;
			// document.getElementById("printout").innerHTML = "<p>" + fenIdx + " / " + fens.length + "</p>";
			if (fenIdx < fens.length) {
				stockfish.postMessage("position fen " + fens[fenIdx]);
				stockfish.postMessage("go depth " + DEPTH);
				if (DEBUG) {
					printout.push(event.data);
					document.getElementById("printout").innerHTML = "<p>" + printout.join("</p><p>") + "</p>";
				}
			} else {
				finished = true;
			}
		}
	} else {
		document.getElementById("evals").innerHTML = "Loading..."
		if (event.data.includes("bestmove")) {
			stockfish.postMessage("isready");
		}
	}
	// document.getElementById("printout").innerHTML = evals.join(" ");
};
stockfish.postMessage("uci");