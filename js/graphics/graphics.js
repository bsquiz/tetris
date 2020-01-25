const TetrisGraphics = {
	ctx: null,
	colWidth: 25,
	colHeight: 25,
	PieceColors: {},

	Colors: {
		DARK_GRAY: '#565656',
		LIGHT_GRAY: '#d3d3d3',
		GRID_GRAY: '#333333',
		BLACK: '#000000',
		WHITE: '#FFFFFF'
	},

	SquareDrawX(x, tx) { 	
		return x * this.colWidth + (tx * this.colWidth);
	},

	SquareDrawY(y, ty) {
		return y * this.colHeight + (ty * this.colHeight);
	},

	drawClearedTile(row, col) {
		this.ctx.clearRect(
			col * this.colWidth,
			row * this.colHeight,
			this.colWidth,
			this.colHeight
		);
	},
	
	drawGameOverTile(row, col) {
		const drawX = col * this.colWidth;
		const drawY = row * this.colHeight;
		console.log(`x ${drawX} y ${drawY}`);	

		this.ctx.fillRect(
			drawX,
			drawY,
			this.colWidth,
			this.colHeight
		); 
	},

	drawPiece(piece, drawDropPreview = true) {
		const origin = piece.getOrigin();
		const t = piece.getTransform();
		const dropPreviewOrigin = piece.getDropPreviewOrigin();

		this.ctx.beginPath();
		this.ctx.fillStyle = this.PieceColors[piece.getType()];
		this.ctx.strokeStyle = this.Colors.BLACK;
		t.forEach(transform => {
			const x = this.SquareDrawX(origin[1], transform[1]);
			const y = this.SquareDrawY(origin[0], transform[0]);

			this.ctx.rect(
				x,
				y,
				this.colWidth,
				this.colHeight
			);
		});
		this.ctx.fill();
		this.ctx.stroke();

		if (drawDropPreview) {	
			this.ctx.beginPath();
			this.ctx.strokeStyle = this.Colors.LIGHT_GRAY;
			t.forEach(transform => {
				const px = this.SquareDrawX(dropPreviewOrigin[1], transform[1]);
				const py = this.SquareDrawY(dropPreviewOrigin[0], transform[0]);
				this.ctx.rect(
					px,
					py,
					this.colWidth,
					this.colHeight
				);
			});
			this.ctx.stroke();
		}	
	},

	/* draws filled pieces that have fallen */ 
	drawGameBoard(gameBoard) {
		let x = 0;
		let y = 0;

		this.ctx.strokeStyle = this.Colors.BLACK;
		this.ctx.beginPath();
		gameBoard.forEach(row => {
			row.forEach(col => {
				if (col !== 0) { 
					this.ctx.fillStyle = this.PieceColors[col];
					this.ctx.fillRect(x, y, this.colWidth, this.colHeight);

					this.ctx.rect(x, y, this.colWidth, this.colHeight);
				}

				x += this.colWidth;
			});

			y += this.colHeight;
			x = 0;
		});
	
		this.ctx.stroke();
	},

	/* draws grid lines */
	drawBackground(rows, cols, colWidth, colHeight) {
		const $backgroundCanvas = document.getElementById('backgroundCanvas');
		const ctx = $backgroundCanvas.getContext('2d');
		const width = $backgroundCanvas.width;
		const height = $backgroundCanvas.height;
		let x = 0;
		let y = 0;

		ctx.strokeStyle = this.Colors.GRID_GRAY;

		for (let i=0; i<cols; i++) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			
			x += colWidth;
		}

		for (let i=0; i<rows; i++) {
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);

			y += colHeight;
		}

		ctx.stroke();
	},

	draw(currentPiece, gameBoard, drawDropPreview = true) {
		this.ctx.clearRect(0, 0, this.width, this.height);

		this.drawGameBoard(gameBoard);
		this.drawPiece(currentPiece, drawDropPreview);
	},

	init(rows, cols) {
		const $canvas = document.getElementById("gameCanvas");
	
		this.width = $canvas.width;
		this.height = $canvas.height;
		this.ctx = $canvas.getContext("2d");
		this.ctx.strokeStyle = this.Colors.LIGHT_GRAY;
		this.ctx.fillStyle = this.Colors.WHITE;

		this.PieceColors[Tetris.PieceTypes.EMPTY] = "black";
		this.PieceColors[Tetris.PieceTypes.SQUARE] = "yellow";
		this.PieceColors[Tetris.PieceTypes.L] = "blue";
		this.PieceColors[Tetris.PieceTypes.BACKWARDS_L] = "orange";
		this.PieceColors[Tetris.PieceTypes.LINE] = "teal";
		this.PieceColors[Tetris.PieceTypes.Z] = "green";
		this.PieceColors[Tetris.PieceTypes.TRIANGLE] = "purple";
		this.PieceColors[Tetris.PieceTypes.S] = "darkSlateBlue"

		this.drawBackground(rows, cols, this.colWidth, this.colHeight);
		TetrisHUD.init();
	}
};
