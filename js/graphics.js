const TetrisGraphics = {
	ctx: null,
	nextPieceCtx: null,
	currentPiece: null,
	nextPiece: null,
	colWidth: 25,
	colHeight: 25,
	nextPieceWidth: 0,
	nextPieceHeight: 0,
	score: 0,
	level: 1,
	lines: 0,
	$score: document.getElementById('scoreVal'),
	$level: document.getElementById('levelVal'),
	$lines: document.getElementById('linesVal'),
	PieceColors: {},

	setScore(score) { this.score = score; },
	setLines(lines) { this.lines = lines; },
	setCurrentPiece(piece) { this.currentPiece = piece; },
	setNextPiece(piece) { this.nextPiece = piece; },
	
	squareDrawX(x, tx) {
		return x * this.colWidth + (tx * this.colWidth);
	},

	squareDrawY(y, ty) {
		return y * this.colHeight + (ty * this.colHeight);
	},

	drawPiece(piece, ctx, preview = false) {
		const origin = piece.getOrigin();
		const t = piece.getTransform();
		const transformXOffset = t[1] * this.colWidth;
		const transformYOffset = t[0] * this.colHeight;
		const dropPreviewOrigin = piece.getDropPreviewOrigin();
		let ox = origin[1];
		let oy = origin[0];

		ctx.fillStyle = this.PieceColors[piece.getType()];

		if (preview) {
			ox = 25;
			oy = 25;
		}

		t.forEach(transform => {
			const x = this.squareDrawX(ox, transform[1]);
			const y = this.squareDrawY(oy, transform[0]);

			ctx.fillRect(
				x,
				y,
				this.colWidth,
				this.colHeight
			);
			if (!preview) {
				const px = this.squareDrawX(dropPreviewOrigin[1], transform[1]);
				const py = this.squareDrawY(dropPreviewOrigin[0], transform[0]);

				ctx.strokeRect(
					px,
					py,
					this.colWidth,
					this.colHeight
				);
			}
		});
	},

	drawHUD() {
		this.$score.innerHTML = this.score;
		this.$level.innerHTML = this.level;
		this.$lines.innerHTML = this.lines;
	},
 
	drawGameBoard(board) {
		let x = 0;
		let y = 0;

		board.forEach(row => {
			row.forEach(col => {
				this.ctx.fillStyle = this.PieceColors[col];
				this.ctx.fillRect(x, y, this.colWidth, this.colHeight);
				this.ctx.strokeRect(x, y, this.colWidth, this.colHeight);
		
				x += this.colWidth;
			});

			y += this.colHeight;
			x = 0;
		});
	},

	draw(gameboard) {
		this.ctx.strokeStyle = '#575757';
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.nextPieceCtx.clearRect(0, 0, this.nextPieceWidth, this.nextPieceHeight);
		this.drawGameBoard(gameboard);

		this.ctx.strokeStyle = 'white';
		this.drawPiece(this.currentPiece, this.ctx);
		this.drawPiece(this.nextPiece, this.nextPieceCtx, true);
		this.drawHUD();
	},

	init() {
		const $canvas = document.getElementById("gameCanvas");
		const $nextPieceCanvas = document.getElementById("nextPieceCanvas");
	
		this.width = $canvas.width;
		this.height = $canvas.height;
		this.ctx = $canvas.getContext("2d");
		this.ctx.strokeStyle = '#575757';
		this.ctx.fillStyle = 'white';

		this.nextPieceWidth = $nextPieceCanvas.width;
		this.nextPieceHeight = $nextPieceCanvas.height;
		this.nextPieceCtx = $nextPieceCanvas.getContext('2d');
		this.nextPieceCtx.fillStype = 'white';

		this.PieceColors[Tetris.PieceTypes.EMPTY] = "black";
		this.PieceColors[Tetris.PieceTypes.SQUARE] = "red";
		this.PieceColors[Tetris.PieceTypes.L] = "green";
		this.PieceColors[Tetris.PieceTypes.LINE] = "blue";
		this.PieceColors[Tetris.PieceTypes.Z] = "yellow";
		this.PieceColors[Tetris.PieceTypes.TRIANGLE] = "purple";
		this.PieceColors[Tetris.PieceTypes.S] = "orange"
	}
};
