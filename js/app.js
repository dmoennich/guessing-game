

var game = {
	init: function(){
		this.numberToGuess = 42;
		this.triesMax = 5;
		this.triesMade = 0;
		this.lastGuess = undefined;
		this.currentGuess = undefined;
		// Math.random for number to guess
	},
	isWon: function(){
		return this.numberToGuess === this.currentGuess;
	}
};

var hotness = {
	hotness: "",
	advice: "",
	progress: "",
	max: false,
	updateHotness: function(toGuess, guess, lastGuess){
		this.setMax(toGuess, guess);
		if(!this.max){
			this.setHotness(toGuess, guess);
			this.setAdvice(toGuess, guess);
			this.setProgress(toGuess, guess, lastGuess);
		}
	},
	setMax: function(toGuess, guess){
		this.max = toGuess === guess;
	},
	setHotness: function(toGuess, guess){
		var diff = Math.abs(toGuess - guess);
		var hotness;
		if(diff > 20){
			hotness = "Cold";
		} else if(diff <= 20 && diff > 10){
			hotness = "Warm";
		} else {
			hotness = "Hot";
		}
		this.hotness = hotness;
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
		if(this.max){
			msg = "You guessed right!";
		} else {
			msg = this.hotness + " and you are getting " + this.progress;
			msg += ". Guess " + this.advice + "!";
		}
		return msg;
	}
};


var formView = {
	init: function(){
		$("#guessForm").on("submit", function(event){
			event.preventDefault();
			var guess = Number($("#guessedNumber").val());
			gameController.guessSubmitted(guess);
		});
		$("button .glyphicon-refresh").on("click", function(){
			gameController.init();
		});
		this.render();
	},
	render: function(){
		var triesMade = gameController.getTriesMade();
		var triesMax = gameController.getTriesMax();
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
		$("#guess-messages").find("li").remove();
	},
	render: function(){
		var guessMessage = $("<li></li>");
		guessMessage.addClass('list-group-item');
		var msg = gameController.getTriesMade() + ". Guess: ";
		msg += gameController.getCurrentGuess() + " -> ";
		msg += gameController.getHotnessMessage();
		guessMessage.text(msg);
		$("#guess-messages").append(guessMessage);
	}
};

var winView = {
	init: function(){
		$("#winMessage").remove();
	},
	render: function(){
		$("#instruction").append("<p id='#winMessage'>You are a winner!</p>");
	}
};

var gameController = {
	init: function(){
		game.init();
		formView.init();
		messageView.init();
		winView.init();
	},
	getTriesMax: function(){
		return game.triesMax;
	},
	getTriesMade: function(){
		return game.triesMade;
	},
	getLastGuess: function(){
		return game.lastGuess;
	},
	getCurrentGuess: function(){
		return game.currentGuess;
	},
	guessSubmitted: function(guess){
		if(game.triesMax - game.triesMade > 0 && !game.isWon()){
			game.triesMade += 1;
			game.lastGuess = game.currentGuess;
			game.currentGuess = guess;
			if(game.isWon()){
				winView.render();
			}
			hotness.updateHotness(game.numberToGuess, game.currentGuess, game.lastGuess);
			formView.render();
			messageView.render();
		}
	},
	getHotnessMessage: function(){
		return hotness.getMessage();
	}
};


gameController.init();
