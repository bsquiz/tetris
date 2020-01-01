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

	isRunning: false,
	shouldRedraw: true,
	audioInitialized: false,
	playMusic: false,
	canRotatePiece: true,
	canDropPiece: true,
	isClearingRow: false,
	
	moveTimer: 8,
	maxMoveTimer: 8,
	dropTimer: 30,
	maxDropTimer: 30,
	clearRowTimer: 60,
	dropDebounceTimer: 10,
	MAX_CLEAR_ROW_TIMER: 30,
	MAX_DROP_DEBOUNCE_TIMER: 5,
	GAME_OVER_ANIMATION_TIMER: 3,

	fillRow: 0,
	fillCol: 0,	
	fillColDirection: 0,
	changingFillDirection: false,

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
		"S": 6
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
			BMusicPlayer.pause();
		} else {
			BMusicPlayer.play();
		}

		return this.playMusic;
	},

	calculateClearScore(hardDrop = false, numLinesCleared = 1) {
		return 100 * (hardDrop ? 2 : 1) * numLinesCleared;
	},

	makeNextPiece(excludePieceType) {
		const r = Math.floor(Math.random() * 6);
		let newPiece = this.availablePieces[r];
		
		newPiece.reset();

//		while(newPiece.getType() === excludePieceType) {
//		}
		
		return newPiece;
	},

	movePieceDown(piece) {
		if (piece.moveDown(this.gameBoard.getBoard())) {
			return true;
		}

		TetrisSoundEffects.playDropSound();

		return false;
	},

	movePiece(piece,
		moveLeft = false,
		moveRight = false,
		moveDown = false,
		moveUp = false,
		drop = false) {
		const origin = piece.getOrigin();

		if (this.dropDebounceTimer > 0) this.dropDebounceTimer--;

		if (moveLeft && !moveRight) {
			if (piece.moveLeft(0, this.gameBoard.getBoard())) {
				if (this.audioInitialized) {
					TetrisSoundEffects.playMoveSound();
				}
			}
		}

		if (moveRight && !moveLeft) {
			if(piece.moveRight(this.cols - 1, this.gameBoard.getBoard())) {
				TetrisSoundEffects.playMoveSound();
			}
		}

		if (moveDown) {
			this.movePieceDown(piece);	
		}

		if (moveUp && !moveLeft && !moveRight && this.canRotatePiece) {
			this.canRotatePiece = false;
			piece.rotate(this.cols - 1);
			TetrisSoundEffects.playRotateSound();
		}

		if (drop && this.canDropPiece) {
			this.canDropPiece = false;
			piece.drop(this.gameBoard.getBoard());
		}

		piece.updatePreviewDrop(this.gameBoard.getBoard());

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
		this.maxDropTimer = 1;
		this.dropTimer = this.maxDropTimer;
		this.fillRow = this.rows - 1;
		this.fillCol = this.cols - 1;
		this.fillColDirection = -1;
		this.changingFillDirection = false;

		this.gameBoard.reset();	

		this.currentPiece = this.makeNextPiece(0);
		this.nextPiece = this.makeNextPiece(this.currentPiece.getType());
		this.currentPiece.updatePreviewDrop(this.gameBoard.getBoard());

		TetrisHUD.drawNextPiece(this.nextPiece);
		TetrisHUD.drawStats(this.score, this.clearedLines, this.level);
		TetrisGraphics.draw(this.currentPiece, this.gameBoard.getBoard()); 
	},
	
	animateGameOver() {
		window.setTimeout(() => {
			if (this.changingFillDirection) {
				this.changingFillDirection = false;
				TetrisGraphics.drawGameOverTile(this.fillRow, this.fillCol);
				this.fillRow--;
			} else {
				TetrisGraphics.drawGameOverTile(this.fillRow, this.fillCol);
				this.fillCol += this.fillColDirection;

				if (this.fillCol === this.cols - 1 || this.fillCol === 0) {
					this.changingFillDirection = true;
					this.fillColDirection *= -1;
				}
			}
			if (this.fillRow < 0 && this.fillCol === 0) {
				document.getElementById('game').className = 'gameover';
				document.getElementById('gameOver').style.display = 'block';
			} else {
				this.animateGameOver();
			}
		}, this.GAME_OVER_ANIMATION_TIMER);
	}, 
	gameOver() {
		this.isRunning = false;
		this.animateGameOver();
	},

	retry() {
		this.isRunning = true;
		document.getElementById('game').className = '';
		document.getElementById('gameOver').style.display = 'none';
		this.reset();
	},	
		
	update() {
		if (!this.isRunning) return;

		// animates row clear
		if (this.isClearingRow && this.clearRowTimer > 0) {
			this.clearRowTimer--;

			if (this.clearRowTimer === 0) {
				this.isClearingRow = false;
				this.clearRowTimer = this.MAX_CLEAR_ROW_TIMER;
			}

			return;
		}

		if (this.currentPiece.isStuck(this.gameBoard.getBoard())) {
			this.gameOver();
		}

		let rowsToClear = 0;
		let isHardDrop = false;

		if (this.moveTimer === 0) {
			this.moveTimer = this.maxMoveTimer;

			this.shouldRedraw = this.movePiece(
				this.currentPiece,
				this.keysDown[this.Keys.LEFT],
				this.keysDown[this.Keys.RIGHT],
				this.keysDown[this.Keys.DOWN],
				this.keysDown[this.Keys.UP],
				this.keysDown[this.Keys.SPACE]
			);

			isHardDrop = this.keysDown[this.Keys.DOWN] && this.canDropPiece;
		}

		if (this.dropTimer === 0) {
			this.dropTimer = this.maxDropTimer;
	
			if(!this.movePieceDown(this.currentPiece)) {
				this.gameBoard.mergePieceToBoard(this.currentPiece);
				this.startNextPiece();
				rowsToClear = this.gameBoard.checkClear();

				if (rowsToClear.length > 0) {
					this.isClearingRow = true;
					this.score += this.calculateClearScore(isHardDrop, rowsToClear.length);
					this.clearedLines += rowsToClear.length;

					if (this.score % 1000 === 0) {
						this.increaseLevel();
					}

					TetrisHUD.drawStats(this.score, this.clearedLines, this.level);
					TetrisSoundEffects.playClearSound();
				}
			}

			this.shouldRedraw = true;
		}

		this.moveTimer--;
		this.dropTimer--;

		if (this.shouldRedraw) {
			this.shouldRedraw = false;
			TetrisGraphics.draw(this.currentPiece, this.gameBoard.getBoard()); 
		}

		if (this.audioInitialized) {
			BMusicPlayer.update();
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

	pause() {
		this.isRunning = false;
	},
	
	init() {
		this.availablePieces = [
			new TetrisPiece(1),
			new TetrisPiece(2),
			new TetrisPiece(3),
			new TetrisPiece(4),
			new TetrisPiece(5),
			new TetrisPiece(6)
		];
		this.gameBoard = new GameBoard(this.rows, this.cols);
		this.gameBoard.init();
		TetrisGraphics.init(this.rows, this.cols);
		this.initAudio();
		this.reset();
	}
};
