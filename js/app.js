

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
			msg = this.level + ", and you are getting " + this.progress;
			msg += ". Guess " + this.advice + "!";
		}
		return msg;
	}
};


var formView = {
	init: function(triesMade, triesMax){
		var guessForm = $("#guessForm");
		var refreshButton = $("#refreshButton");
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
	}
};


var messageView = {
	init: function(){
		$("#guess-messages").empty();
	},
	render: function(guess, tries, hotnessMessage, hotnessLevel){
		var guessMessage = $("<li></li>");
		guessMessage.addClass('list-group-item');
		var msg = tries + ". guess: ";
		msg += guess + " ";
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
	resultMessageId: "#resultMessage",
	init: function(){
		$(this.resultMessageId).hide();
	},
	render: function(hintShown, isWon){
		var msg, msgClass;
		if(isWon){
			msg = "You are a " + (hintShown ? "cheater ;-)" : "winner :-)");
		}else {
			msg = "You lost! :-(";
		}
		$(this.resultMessageId).find(".panel-body").text(msg);
		$(this.resultMessageId).show();
	}
};


var hintView = {
	hintClass: ".theHint",
	init: function(numberToGuess){
		var hintButton = $("#hintButton");
		var hintClass = this.hintClass;
		hintButton.off("click");
		hintButton.on("click", function(event){
			$(".theHint").text("number to guess is " + numberToGuess);
		});
		//$(this.hintClass).hide();

	},
	render: function(){
		//$(this.hintClass).text("number to guess:" + numberToGuess);
		//$(this.hintClass).fadeToggle();
		// var ariaHidden = $(this.hintClass).attr("aria-hidden");
		// $(this.hintClass).attr("aria-hidden", ariaHidden ? false : true);
	}
};


var checkInput = function(inp){
	var inpNum = parseInt(inp, 10);
	if(isNaN(inpNum) || guessList.isInList(inpNum)){
		return null;
	}
	return inpNum >= 1 && inpNum <= 100 ? inpNum : null;
};

var guessList = {
	guesses: [],
	init: function(){
		this.guesses = [];
	},
	add: function(guess){
		this.guesses.push(guess);
	},
	isInList: function(guess){
		return this.guesses.indexOf(guess) > -1 ? true : false;
	}
};

var gameController = {
	init: function(){
		game.init();
		guessList.init();
		formView.init(game.triesMade, game.triesMax);
		messageView.init();
		resultView.init();
		hintView.init(game.numberToGuess);
	},
	guessSubmitted: function(guess){
		guess = checkInput(guess);
		if(guess && game.triesMax - game.triesMade > 0 && !game.isWon()){
			guessList.add(guess);
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








