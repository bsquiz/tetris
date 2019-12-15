const Tetris = {
	isRunning: false,
	rows: 24,
	cols: 10,
	gameBoard: null,
	score: 0,
	clearedLines: 0,
	currentPiece: {}, 
	dropDebounceTimer: 10,
	MAX_DROP_DEBOUNCE_TIMER: 5,
	dropTimer: 30,
	maxDropTimer: 30,
	moveTimer: 8,
	maxMoveTimer: 8,
	PieceTypes: {
		"EMPTY": 0,
		"SQUARE": 1,
		"LINE": 2,
		"Z": 3,
		"L": 4,
		"TRIANGLE": 5,
		"S": 6
	},
	keysDown: {
		32: false,
		37: false,
		39: false,
		40: false,
		38: false
	},
	Keys: {
		LEFT: 37,
		RIGHT: 39,
		DOWN: 40,
		UP: 38,
		SPACE: 32 
	},
	availablePieces: [],
	canDropPiece: true,
	canRotatePiece: true,
	nextPiece: {},
	shouldCheckClear: true,
	shouldRedraw: true,
	audioInitialized: false,
	sineWave: null,

	playOscillator(oscillator, freq = 100, duration = 100, vol = 0.1) {
		if (!this.audioInitialized) return;
		
		BAudio.playOscillator(oscillator, freq, duration, vol);
	},

	playPieceRotateSnd() {
		this.playOscillator(this.sineWave, 500);
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

	calculateClearScore(hardDrop = false, numLinesCleared = 1) {
		return 100 * (hardDrop ? 2 : 1) * numLinesCleared;
	},

	movePieceDown(piece) {
		if (piece.moveDown(this.gameBoard.getBoard())) {
			return true;
		}

		this.playOscillator(this.sineWave, 1000, 25);

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
			if (piece.moveLeft(0)) {
				this.playOscillator(this.sineWave, 400, 50);
			}
		}
		if (moveRight && !moveLeft) {
			if(piece.moveRight(this.cols - 1)) {
				this.playOscillator(this.sineWave, 400, 50);
			}
		}
		if (moveDown) {
			this.movePieceDown(piece);	
		}
		if (moveUp && !moveLeft && !moveRight && this.canRotatePiece) {
			this.canRotatePiece = false;
			piece.rotate(this.cols - 1);
			this.playOscillator(this.sineWave, 300);
		}

		if (drop && this.canDropPiece) {
			this.canDropPiece = false;
			piece.drop(this.gameBoard.getBoard());
		}

		if (moveLeft || moveRight) {
			piece.updatePreviewDrop(this.gameBoard.getBoard());
		}

		return (moveLeft || moveRight || moveDown || moveUp || drop);
	},

	createNewPiece() {
		const r = Math.floor(Math.random() * 6);
	
		return this.availablePieces[r];
	},

	makeNextPiece(excludePieceType) {
		let newPiece = this.createNewPiece();

//		while(newPiece.getType() === excludePieceType) {
//			newPiece = this.createNewPiece();
//		}
		
		return newPiece;
	},

	startNextPiece() {
		const oldPieceType = this.currentPiece.getType();

		this.currentPiece = this.nextPiece;
		this.nextPiece = this.makeNextPiece(oldPieceType);
		this.graphics.setCurrentPiece(this.currentPiece);
		this.graphics.setNextPiece(this.nextPiece);
		this.currentPiece.updatePreviewDrop(this.gameBoard.getBoard());
	},

	update() {
		if (!this.isRunning) return;

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
					this.shouldRedraw = true;
					this.score += this.calculateClearScore(isHardDrop, rowsToClear.length);
					this.clearedLines += rowsToClear.length;
		
					this.graphics.setScore(this.score);
					this.graphics.setLines(this.clearedLines);
					this.graphics.drawHUD();
				}
			}
			this.shouldRedraw = true;
		}

		this.moveTimer--;	
		this.dropTimer--;
		BMusicPlayer.update();

		if (this.shouldRedraw) {
			this.shouldRedraw = false;
			this.graphics.draw(); 
		}
	},

	initAudio() {
		this.audioInitialized = true;
		
		if (this.sineWave === null) {
			this.sineWave = BAudio.createOscillator(BAudio.Oscillators.SINE);
			
	//		TetrisSong.init();			
			//TetrisSong.start();
		}
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

		this.currentPiece = this.makeNextPiece(0);
		this.nextPiece = this.makeNextPiece(this.currentPiece.getType());
		this.currentPiece.updatePreviewDrop(this.gameBoard.getBoard());

		this.graphics = TetrisGraphics;
		this.graphics.init(this.gameBoard.getBoard());
		this.graphics.setCurrentPiece(this.currentPiece);
		this.graphics.setNextPiece(this.nextPiece);
		this.initAudio();
	}
};
