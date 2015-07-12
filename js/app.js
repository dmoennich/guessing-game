

var game = {
	init: function(){
		this.numberToGuess = Math.ceil(Math.random() * 100);
		this.triesMax = 5;
		this.triesMade = 0;
		this.lastGuess = undefined;
		this.currentGuess = undefined;
		this.hintShown = false;
	},
	isWon: function(){
		return this.numberToGuess === this.currentGuess;
	},
	isLost: function(){
		return this.triesMade === this.triesMax;
	}
};

var hotness = {
	level: "",
	advice: "",
	progress: "",
	updateHotness: function(toGuess, guess, lastGuess){
		this.setHotness(toGuess, guess);
		if(this.level !== "Hottest"){
			this.setAdvice(toGuess, guess);
			this.setProgress(toGuess, guess, lastGuess);
		}
	},
	setHotness: function(toGuess, guess){
		var diff = Math.abs(toGuess - guess);
		var hotnessLevel;
		if(diff > 20){
			hotnessLevel = "Cold";
		} else if(diff <= 20 && diff > 10){
			hotnessLevel = "Warm";
		} else if(diff <= 10 && diff >= 1){
			hotnessLevel = "Hot";
		}else {
			hotnessLevel = "Hottest";
		}
		this.level = hotnessLevel;
	},
	setAdvice: function(toGuess, guess){
		this.advice = toGuess - guess < 0 ? "lower" : "higher";
	},
	setProgress: function(toGuess, guess, lastGuess){
		lastGuess = lastGuess || Infinity;	// first guess has no prev guess
		var current = Math.abs(toGuess - guess);
		var last = Math.abs(toGuess - lastGuess);
		this.progress = current > last ? "colder" : "hotter";
	},
	getMessage: function(){
		var msg;
		if(this.level === "Hottest"){
			msg = "You guessed right!";
		} else {
			msg = this.level + " and you are getting " + this.progress;
			msg += ". Guess " + this.advice + "!";
		}
		return msg;
	}
};


var formView = {
	init: function(triesMade, triesMax){
		var guessForm = $("#guessForm");
		var refreshButton = $("button .glyphicon-refresh");
		guessForm.off("submit");
		guessForm.on("submit", function(event){
			event.preventDefault();
			var numInput = $("#guessedNumber");
			var guess = numInput.val();
			numInput.val("");
			gameController.guessSubmitted(guess);
		});
		refreshButton.off("click");
		refreshButton.on("click", function(){
			gameController.refresh();
		});
		this.render(triesMade, triesMax);
	},
	render: function(triesMade, triesMax){
		$("#triesLeft").text(triesMax - triesMade);
		var progress = (triesMade / triesMax) * 100;
		var progressBar = $("#guessbar");
		progressBar.attr("aria-valuenow", progress);
		progressBar.css("width", progress + "%");
		progressBar.text(triesMade + " of " + triesMax + " guesses");
	}
};


var messageView = {
	init: function(){
		$("#guess-messages").empty();
	},
	render: function(guess, tries, hotnessMessage, hotnessLevel){
		var guessMessage = $("<li></li>");
		guessMessage.addClass('list-group-item');
		var msg = tries + ". Guess: ";
		msg += guess + " -> ";
		msg += hotnessMessage;
		guessMessage.text(msg);
		var colorClass = "";
		switch(hotnessLevel){
			case "Hot":
			case "Hottest":
				colorClass = "list-group-item-danger";
				break;
			case "Warm":
				colorClass = "list-group-item-warning";
				break;
			case "Cold":
				colorClass = "list-group-item-info";
				break;
		}
		guessMessage.addClass(colorClass);
		$("#guess-messages").append(guessMessage);
	}
};

var resultView = {
	winMessageClass: ".winMessage",
	lossMessageClass: ".lostMessage",
	resultMessageId: "#resultMessage",
	init: function(){
		$(this.resultMessageId).hide();
	},
	render: function(hintShown, isWon){
		var msg, msgClass;
		if(isWon){
			msg = "You are a " + (hintShown ? "cheater ;-)" : "winner :-)");
			msgClass = this.winMessageClass;
		}else {
			msg = "You lost! :-(";
			msgClass = this.lossMessageClass;
		}
		
		var resMsg = $(this.resultMessageId);
		resMsg.addClass(msgClass);
		resMsg.text(msg);
		resMsg.show();
	}
};


var hintView = {
	hintClass: ".theHint",
	init: function(numberToGuess){
		var hintButton = $("button .glyphicon-eye-open");
		hintButton.off("click");
		var hintClass = this.hintClass;
		hintButton.on("click", function(){
			gameController.toggleHint();
		});
		$(this.hintClass).hide();
		$(this.hintClass).text(numberToGuess);
	},
	render: function(){
		$(this.hintClass).fadeToggle();
	}
};


var gameController = {
	init: function(){
		game.init();
		formView.init(game.triesMade, game.triesMax);
		messageView.init();
		resultView.init();
		hintView.init(game.numberToGuess);
	},
	guessSubmitted: function(guess){
		guess = parseInt(guess, 10);
		if(game.triesMax - game.triesMade > 0 && !game.isWon()){
			game.triesMade += 1;
			game.lastGuess = game.currentGuess;
			game.currentGuess = guess;
			hotness.updateHotness(game.numberToGuess,
				game.currentGuess, game.lastGuess);
			formView.render(game.triesMade, game.triesMax);
			messageView.render(game.currentGuess,
				game.triesMade, hotness.getMessage(), hotness.level);
			if(game.isWon() || game.isLost()){
				resultView.render(game.hintShown, game.isWon());
			}
		}
	},
	toggleHint: function(){
		game.hintShown = true;
		hintView.render();
	},
	refresh: function(){
		this.init();
	}
};


gameController.init();

