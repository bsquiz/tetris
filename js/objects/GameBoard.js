class GameBoard {
	constructor(rows, cols) {
		this.board = [];
		this.rows = rows;
		this.cols = cols;
	}

	getBoard() { return this.board; }

	reset() {
		this.board = [];	
		for(let i=0; i<this.rows; i++) {
			this.board.push(this.createEmptyRow());
		}
	}
	
	createEmptyRow() {
		return new Array(this.cols).fill(0);
	}

	mergePieceToBoard(piece) {
		const mapping = piece.getGameBoardMapping();
		const type = piece.getType();

		mapping.forEach(t => {
			this.board[t[0]][t[1]] = type;
		});
	}

	checkClear() {
		const rowsToClear = [];
		/*
			check from top to bottom
			[][][]|
			[][][]|
			[][][]|
			[][][]\
		*/
		for (let i=0; i<this.board.length; i++) {
			const row = this.board[i];
			let shouldClear = true;

			for (let j=0; j<row.length; j++ ) {
				if (row[j] === Tetris.PieceTypes.EMPTY) {
					shouldClear = false;

					break;
				}
			}

			if (shouldClear) {
				rowsToClear.push(i);
				/*
				Work backwards to first row,
				swapping cleared row with row before it.
				*/
				for (let j=i; j>1; j--) {
					this.board[j] = [...this.board[j-1]];
				}
			}
		}

		return rowsToClear;
	}

	init() {
		this.reset();
		
		for (let i=0; i<this.cols - 2; i++) {
//			this.board[this.rows - 2][i] = 1;
//			this.board[this.rows - 3][i] = 1;
		}
	}
}
