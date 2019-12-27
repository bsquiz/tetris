const Tetris = {
	isRunning: false,
	rows: 24,
	cols: 10,
	score: 0,
	clearedLines: 0,
	gameBoard: null,
	currentPiece: {}, 
	dropDebounceTimer: 10,
	MAX_DROP_DEBOUNCE_TIMER: 5,
	dropTimer: 30,
	maxDropTimer: 30,
	moveTimer: 8,
	maxMoveTimer: 8,
	availablePieces: [],
	canDropPiece: true,
	canRotatePiece: true,
	nextPiece: {},
	shouldRedraw: true,
	audioInitialized: false,
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

	calculateClearScore(hardDrop = false, numLinesCleared = 1) {
		return 100 * (hardDrop ? 2 : 1) * numLinesCleared;
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
			if (piece.moveLeft(0)) {
				if (this.audioInitialized) {
					TetrisSoundEffects.playMoveSound();
				}
			}
		}

		if (moveRight && !moveLeft) {
			if(piece.moveRight(this.cols - 1)) {
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

		if (moveLeft || moveRight) {
			piece.updatePreviewDrop(this.gameBoard.getBoard());
		}

		return (moveLeft || moveRight || moveDown || moveUp || drop);
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
					this.score += this.calculateClearScore(isHardDrop, rowsToClear.length);
					this.clearedLines += rowsToClear.length;
		
					TetrisHUD.draw(this.score, this.clearedLines, this.level);
				}
			}

			this.shouldRedraw = true;
		}

		this.moveTimer--;
		this.dropTimer--;

		if (this.shouldRedraw) {
			this.shouldRedraw = false;
			TetrisGraphics.draw(this.currentPiece); 
		}

		if (this.audioInitialized) {
			BMusicPlayer.update();
		}
	},

	initAudio() {
		this.audioInitialized = true;
			
		TetrisSoundEffects.init();	
		BMusicPlayer.init(TetrisSong);			
		BMusicPlayer.start();
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

		TetrisGraphics.init(this.rows, this.cols);
		TetrisHUD.drawNextPiece(this.nextPiece);
		this.initAudio();
	}
};
