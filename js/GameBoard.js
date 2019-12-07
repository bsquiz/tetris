class GameBoard {
	constructor(rows, cols) {
		this.board = [];
		this.rows = rows;
		this.cols = cols;
	}

	getBoard() { return this.board; }
	
	createEmptyRow() {
		return new Array(this.cols).fill(0);
	}

	previewPieceDrop(piece) {

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
		let firstRowToClear = 0;

		for (let i=this.board.length - 1; i>0; i--) {
			const row = this.board[i];
			let totalCount = 0;

			row.forEach(column => {
				if (column !== Tetris.PieceTypes.EMPTY) {
					totalCount++;
				}
			});

			if (totalCount === this.cols) {
				rowsToClear.push(i);
				firstRowToClear = i;
			}
		}

		for (let i=0; i<rowsToClear.length; i++) {
//			this.board[rowsToClear[i]] = this.createEmptyRow();
		}

		for (let j=firstRowToClear; j>0; j--) {
			this.board[j] = this.board[j-1]; 
			//this.board[j] = this.createEmptyRow();
		}

		return rowsToClear;
	}

	init() {
		for(let i=0; i<this.rows; i++) {
			this.board.push(this.createEmptyRow());
		}
		for (let i=0; i<this.cols - 2; i++) {
			this.board[this.rows - 2][i] = 1;
		}
	}
}
