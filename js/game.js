const Tetris = {
	rows: 24,
	cols: 10,
	score: 0,
	clearedLines: 0,
	level: 1,
	gameBoard: null,
	currentPiece: {}, 
	nextPiece: {},
	availablePieces: [],

	touchControls: false,
	touchStartX: 0,
	touchStartY: 0,
	touchStartDropY: 0,
	dragThreshold: 25,

	$highScoreName: null,

	isRunning: false,
	shouldRedraw: true,
	audioInitialized: false,
	playMusic: true,
	// have to press key each time you want to rotate
	canRotatePiece: true,
	// have to press key each time you want to drop 
	canDropPiece: true,
	isClearingRow: false,
	
	dropTimer: 50,
	maxDropTimer: 50,
	keyDebounceTimer: 5,

	MAX_CLEAR_ROW_TIMER: 30,
	MAX_KEY_DEBOUNCE_TIMER: 5,

	keysDown: {
		32: false,
		37: false,
		39: false,
		40: false,
		38: false
	},

	PieceTypes: {
		"EMPTY": 0,
		"SQUARE": 1,
		"LINE": 2,
		"Z": 3,
		"L": 4,
		"TRIANGLE": 5,
		"S": 6,
		"BACKWARDS_L": 7
	},
	Keys: {
		LEFT: 37,
		RIGHT: 39,
		DOWN: 40,
		UP: 38,
		SPACE: 32 
	},

	setKeyDown(key, val) {
		if (val === false) {
			if (key === this.Keys.SPACE) {
				this.canDropPiece = true;
			}
			
			if (key === this.Keys.UP) {
				this.canRotatePiece = true;
			}
		}

		this.keysDown[key] = val;
	},

	toggleMusic() {
		this.playMusic = !this.playMusic;

		if (this.playMusic) {
			BMusicPlayer.play();
		} else {
			BMusicPlayer.pause();
		}

		return this.playMusic;
	},

	calculateClearScore(hardDrop = false, numLinesCleared = 1) {
		let clearScore = 10 * (hardDrop ? 2 : 1) * numLinesCleared;
	
		/* 'tetris' clear */	
		if (numLinesCleared === 4) {
			clearScore *= 2;
		}
		
		return clearScore;
	},

	makeNextPiece(excludePieceType) {
		const r = Math.floor(Math.random() * 7);
		let newPiece = this.availablePieces[r];
		
		newPiece.reset();
		
		return newPiece;
	},

	movePieceDown() {
		if (this.currentPiece.moveDown(this.gameBoard.getBoard())) {
			return true;
		}

		return false;
	},

	movePiece(
		moveLeft = false,
		moveRight = false,
		moveDown = false,
		moveUp = false,
		drop = false) {
		const origin = this.currentPiece.getOrigin();
		const board = this.gameBoard.getBoard();

		if (moveLeft && !moveRight) {
			if (this.currentPiece.moveLeft(0, board)) {
				TetrisSoundEffects.playMoveSound();
			}
		}

		if (moveRight && !moveLeft) {
			if(this.currentPiece.moveRight(this.cols - 1, board)) {
				TetrisSoundEffects.playMoveSound();
			}
		}

		if (moveDown) {
			this.movePieceDown();
		}

		if (moveUp && !moveLeft && !moveRight && this.canRotatePiece) {
			this.canRotatePiece = false;
			this.currentPiece.rotate(this.cols - 1);
			TetrisSoundEffects.playRotateSound();
		}

		if (drop && this.canDropPiece) {
			this.canDropPiece = false;
			this.currentPiece.drop(board);
			TetrisSoundEffects.playDropSound();
		}

		this.currentPiece.updatePreviewDrop(board);

		return (moveLeft || moveRight || moveDown || moveUp || drop);
	},

	startNextPiece() {
		const oldPieceType = this.currentPiece.getType();

		this.currentPiece = this.nextPiece;
		this.nextPiece = this.makeNextPiece(oldPieceType);
		this.currentPiece.updatePreviewDrop(this.gameBoard.getBoard());
		TetrisHUD.drawNextPiece(this.nextPiece);
	},
	
	increaseLevel() {
		this.level++;
		if (this.maxDropTimer > 5) {
			this.maxDropTimer -= 5;
		}
	},

	reset() {
		this.level = 1;
		this.score = 0;
		this.clearedLines = 0;
		this.maxDropTimer = 30;
		this.dropTimer = this.maxDropTimer;

		this.Animation.reset(this.rows, this.cols);
		this.gameBoard.reset();	

		this.currentPiece = this.makeNextPiece(0);
		this.nextPiece = this.makeNextPiece(this.currentPiece.getType());
		this.currentPiece.updatePreviewDrop(this.gameBoard.getBoard());

		TetrisHUD.drawNextPiece(this.nextPiece);
		TetrisHUD.drawStats(this.score, this.clearedLines, this.level);
		TetrisGraphics.draw(this.currentPiece, this.gameBoard.getBoard()); 
	},
	gameOver() {
		document.getElementById('finalScore').innerHTML = this.score;
		document.getElementById('finalLines').innerHTML = this.clearedLines;
		document.getElementById('finalLevel').innerHTML = this.level;
		this.isRunning = false;
		this.Animation.animateGameOver();
	},

	retry() {
		this.isRunning = true;
		$removeClass(document.getElementById('game'), 'see-through');
		$addClass(document.getElementById('gameOver'), 'hide');
		this.reset();
	},	

	clearRows(rowsToClear) {
		this.isClearingRow = true;
		this.clearedLines += rowsToClear.length;
		this.shouldRedraw = false;

	//	TetrisGraphics.draw(this.currentPiece, this.gameBoard.getBoard(), false);

		for (let c = 0; c < rowsToClear.length; c++) {
			this.Animation.animateRowClear(rowsToClear[c], 5, 5);
		}

		if (
			this.clearedLines > 20 && this.level === 1 ||
			this.clearedLines > 50 && this.level === 2 ||
			this.clearedLines > 100 && this.level === 3 ||
			this.clearedLines > 200 && this.level === 4
		) {
			this.increaseLevel();
		}

		TetrisHUD.drawStats(this.score, this.clearedLines, this.level);
		TetrisSoundEffects.playClearSound();
	},
	
	update() {
		if (!this.isRunning || this.isClearingRow) return;

		if (this.currentPiece.isStuck(this.gameBoard.getBoard())) {
			this.gameOver();
		}

		let rowsToClear = 0;
		let isHardDrop = false;

		if (this.keyDebounceTimer === 0) {
			// force redraw if player moves piece
			this.shouldRedraw = this.movePiece(
				this.keysDown[this.Keys.LEFT],
				this.keysDown[this.Keys.RIGHT],
				this.keysDown[this.Keys.DOWN],
				this.keysDown[this.Keys.UP],
				this.keysDown[this.Keys.SPACE]
			);
			
			if (this.shouldRedraw && this.touchControls) {
				this.setKeyDown(this.Keys.LEFT, false);
				this.setKeyDown(this.Keys.RIGHT, false);
				this.setKeyDown(this.Keys.DOWN, false);
			}

			this.keyDebounceTimer = this.MAX_KEY_DEBOUNCE_TIMER;

			if (this.canDropPiece && this.keysDown[this.Keys.SPACE]) {
				// immediatly trigger piece hit check 
				this.dropTimer = 0;
			}
		} else {
			this.keyDebounceTimer--;
		}

		isHardDrop = this.keysDown[this.Keys.DOWN] && this.canDropPiece;

		if (this.dropTimer === 0) {
			// progress piece downwards

			this.dropTimer = this.maxDropTimer;
			this.shouldRedraw = true;

			if(!this.movePieceDown(this.currentPiece)) {
				// piece has hit bottom or another piece

				this.gameBoard.mergePieceToBoard(this.currentPiece);
				this.startNextPiece();
				rowsToClear = this.gameBoard.checkClear();

				if (rowsToClear.length > 0) {
					this.score += this.calculateClearScore(isHardDrop, rowsToClear.length);
					this.clearRows(rowsToClear);
					this.shouldRedraw = false;
				}	
			}
		} else {
			this.dropTimer--;
		}

		if (this.shouldRedraw) {
			this.shouldRedraw = false;
			TetrisGraphics.draw(
				this.currentPiece,
				this.gameBoard.getBoard()
			); 
		}
	},

	initAudio() {
		this.audioInitialized = true;
			
		TetrisSoundEffects.init();	
		BMusicPlayer.init(TetrisSong);			
	},

	start() {
		this.isRunning = true;
	},
	
	togglePause() {
		return this.isRunning = !this.isRunning;
	},

	loadScores() {},

	saveScore() {},

	init() {
		this.$finalScore = document.getElementById('finalScore');
		this.$finalLines = document.getElementById('finalLines');
		this.$finalLevel = document.getElementById('finalLevel');
		this.$highScoreName = document.getElementById('highScoreName');

		this.availablePieces = [
			new TetrisPiece(1),
			new TetrisPiece(2),
			new TetrisPiece(3),
			new TetrisPiece(4),
			new TetrisPiece(5),
			new TetrisPiece(6),
			new TetrisPiece(7)
		];
		this.gameBoard = new GameBoard(this.rows, this.cols);
		this.gameBoard.init();
		TetrisGraphics.init(this.rows, this.cols);
		this.initAudio();
		this.reset();
		this.toggleMusic();
	}
};
