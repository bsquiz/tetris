const TetrisGraphics = {
	ctx: null,
	colWidth: 25,
	colHeight: 25,
	PieceColors: {},

	SquareDrawX(x, tx) { 	
		return x * this.colWidth + (tx * this.colWidth);
	},

	SquareDrawY(y, ty) {
		return y * this.colHeight + (ty * this.colHeight);
	},

	drawPiece(piece) {
		const origin = piece.getOrigin();
		const t = piece.getTransform();
		const transformXOffset = t[1] * this.colWidth;
		const transformYOffset = t[0] * this.colHeight;
		const dropPreviewOrigin = piece.getDropPreviewOrigin();
		let ox = origin[1];
		let oy = origin[0];

		this.ctx.fillStyle = this.PieceColors[piece.getType()];

		t.forEach(transform => {
			const x = this.SquareDrawX(ox, transform[1]);
			const y = this.SquareDrawY(oy, transform[0]);
			const px = this.SquareDrawX(dropPreviewOrigin[1], transform[1]);
			const py = this.SquareDrawY(dropPreviewOrigin[0], transform[0]);

			this.ctx.fillRect(
				x,
				y,
				this.colWidth,
				this.colHeight
			);
			this.ctx.strokeRect(
				px,
				py,
				this.colWidth,
				this.colHeight
			);
		});
	},

	/* draws filled pieces that have fallen */ 
	drawGameBoard() {
		let x = 0;
		let y = 0;

		this.gameBoard.forEach(row => {
			row.forEach(col => {
				if (col !== 0) { 
					this.ctx.fillStyle = this.PieceColors[col];
					this.ctx.fillRect(x, y, this.colWidth, this.colHeight);
			
					x += this.colWidth;
				}
			});

			y += this.colHeight;
			x = 0;
		});
	},

	/* draws grid lines */
	drawBackground(rows, cols, colWidth, colHeight) {
		const $backgroundCanvas = document.getElementById('backgroundCanvas');
		const ctx = $backgroundCanvas.getContext('2d');
		const width = $backgroundCanvas.width;
		const height = $backgroundCanvas.height;
		let x = 0;
		let y = 0;

		ctx.strokeStyle = '#575757';

		for (let i=0; i<rows; i++) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			
			x += colWidth;
		}

		for (let i=0; i<cols; i++) {
			ctx.moveTo(y, 0);
			ctx.lineTo(y, width);

			y += colHeight;
		}

		ctx.stroke();
	},

	draw(currentPiece) {
		this.ctx.clearRect(0, 0, this.width, this.height);

		this.drawGameBoard();
		this.drawPiece(currentPiece);
	},

	init(rows, cols) {
		const $canvas = document.getElementById("gameCanvas");
	
		this.width = $canvas.width;
		this.height = $canvas.height;
		this.ctx = $canvas.getContext("2d");
		this.ctx.strokeStyle = '#575757';
		this.ctx.fillStyle = 'white';

		this.PieceColors[Tetris.PieceTypes.EMPTY] = "black";
		this.PieceColors[Tetris.PieceTypes.SQUARE] = "red";
		this.PieceColors[Tetris.PieceTypes.L] = "green";
		this.PieceColors[Tetris.PieceTypes.LINE] = "blue";
		this.PieceColors[Tetris.PieceTypes.Z] = "yellow";
		this.PieceColors[Tetris.PieceTypes.TRIANGLE] = "purple";
		this.PieceColors[Tetris.PieceTypes.S] = "orange"

		this.drawBackground(rows, cols, this.colWidth, this.colHeight);
		TetrisHUD.init();
	}
};
