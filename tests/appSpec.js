

describe("The game object", function(){

	it("can determine if a game is won", function(){
		game.numberToGuess = 5;
		game.currentGuess = 5;
		expect(game.isWon()).toBe(true);
	});

	it("can determine if a game is NOT won", function(){
		game.numberToGuess = 6;
		game.currentGuess = 7;
		expect(game.isWon()).toBe(false);
	});

	it("can determin if a game is lost", function(){
		game.triesMax = 10;
		game.triesMade = 10;
		expect(game.isLost()).toBe(true);
	});

	it("can determin if a game is NOT lost", function(){
		game.triesMax = 10;
		game.triesMade = 9;
		expect(game.isLost()).toBe(false);
	});

});


describe("The hotness object", function(){

	describe("sets hotness level to", function(){

		var testRange = function(numberToGuess, lowerLimit, upperLimit, expLevel){
			var guess;

			//lower border where diff > 10
			hotness.setHotness(numberToGuess, numberToGuess - (upperLimit + 1));
			expect(hotness.level).not.toBe(expLevel);

			// lower hot range
			for(guess = numberToGuess - upperLimit; guess <= numberToGuess - lowerLimit; guess++){
				hotness.setHotness(numberToGuess, guess);
				expect(hotness.level).toBe(expLevel);
			}

			// lower hot range
			for(guess = numberToGuess + lowerLimit; guess <= numberToGuess + upperLimit; guess++){
				hotness.setHotness(numberToGuess, guess);
				expect(hotness.level).toBe(expLevel);
			}

			//upper border where diff > 11
			hotness.setHotness(numberToGuess, numberToGuess + upperLimit + 1);
			expect(hotness.level).not.toBe(expLevel);
		};

		it("'Hot' if diff to guessed number is between 1 and 10", function(){
			testRange(60, 1, 10, "Hot");
		});


		it("'Warm' if diff to guessed number is between 11 and 20", function(){
			testRange(60, 11, 20, "Warm");
		});

		it("'Cold' if diff to guessed number is bigger than 20", function(){
			hotness.setHotness(55, 76);
			expect(hotness.level).toBe("Cold");
			hotness.setHotness(55, 34);
			expect(hotness.level).toBe("Cold");
		});

		it("'Hottest' if diff to guessed number is 0", function(){
			hotness.setHotness(3, 3);
			expect(hotness.level).toBe("Hottest");
		});

	});


	describe("sets advice", function(){

		it("to guess lower, if guess is to high", function(){
			hotness.setAdvice(56, 70);
			expect(hotness.advice).toBe("lower");
		});

		it("to guess higher, if guess is to low", function(){
			hotness.setAdvice(56, 55);
			expect(hotness.advice).toBe("higher");
		});

	});


	describe("sets progress", function(){

		describe("to get 'hotter', if guess is nearer to guessed number than last guess", function(){

			it("with guesses both below number to guess", function(){
				hotness.setProgress(42, 40, 39);
				expect(hotness.progress).toBe("hotter");
			});


			it("with guesses both above number to guess", function(){
				hotness.setProgress(42, 44, 56);
				expect(hotness.progress).toBe("hotter");
			});

			it("with 1 guess above number to guess, 1 below", function(){
				hotness.setProgress(42, 44, 35);
				expect(hotness.progress).toBe("hotter");
			});

		});

		describe("to get 'colder', if last guess is nearer to guessed number than current guess", function(){


			it("with guesses both below number to guess", function(){
				hotness.setProgress(42, 39, 40);
				expect(hotness.progress).toBe("colder");
			});


			it("with guesses both above number to guess", function(){
				hotness.setProgress(42, 55, 45);
				expect(hotness.progress).toBe("colder");
			});

			it("with 1 guess above number to guess, 1 below", function(){
				hotness.setProgress(42, 22, 45);
				expect(hotness.progress).toBe("colder");
			});
			
		});

		it("to get 'hotter', in case of first guess (when there is no last guess)", function(){
			hotness.setProgress(42, 55, undefined);
			expect(hotness.progress).toBe("hotter");
		});

	});

	describe("creates a message", function(){
		
		it("that shows that the last guess is right", function(){
			hotness.level = "Hottest";
			expect(hotness.getMessage()).toBe("You guessed right!");
		});

		it("that shows hotness level, advice and progress of last guess", function(){
			hotness.level = "Warm";
			hotness.advice = "lower";
			hotness.progress = "colder";
			expect(hotness.getMessage()).toBe("Warm and you are getting colder. Guess lower!");
		});

	});


	describe("The checkInput function", function(){

		it("transforms strings between 1 and 100 to integers.", function(){
			expect(checkInput("50")).toBe(50);
			expect(checkInput("100")).toBe(100);
			expect(checkInput("1")).toBe(1);
		});

		it("returns null for strings that are not a number.", function(){
			expect(checkInput("fgf")).toBe(null);
		});

		it("returns null for empty strings", function(){
			expect(checkInput("")).toBe(null);
		});

		it("returns null if the number is lower than 1", function(){
			expect(checkInput("0")).toBe(null);
			expect(checkInput("-1")).toBe(null);
		});

		it("returns null if the number is higher than 100", function(){
			expect(checkInput("101")).toBe(null);
		});

		it("returns null if the guess was already made", function(){
			guessList.init();
			guessList.add(15);
			expect(checkInput("15")).toBe(null);
		});

	});



	describe("The guessList object", function(){

		beforeEach(function(){
			guessList.init();
		});

		it("stores guesses", function(){
			guessList.add(25);
			guessList.add(99);
			expect(guessList.isInList(25)).toBe(true);
			expect(guessList.isInList(99)).toBe(true);
		});

		it("says if a guess is already in the list", function(){
			guessList.add(42);
			expect(guessList.isInList(42)).toBe(true);
			expect(guessList.isInList(43)).toBe(false);
		});

	});


});