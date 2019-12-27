const TetrisHUD = {
	nextPieceCtx: {},	
	nextPieceWidth: 0,
	nextPieceHeight: 0,
	$score: document.getElementById('scoreVal'),
	$level: document.getElementById('levelVal'),
	$lines: document.getElementById('linesVal'),

	drawNextPiece(piece) {
		const ox = 0;
		const oy = 0;
		const t = piece.getTransform();
		const type = piece.getType();
		let paddingX = TetrisGraphics.colWidth;
		let paddingY = TetrisGraphics.colWidth;

		this.nextPieceCtx.fillStyle = TetrisGraphics.PieceColors[piece.getType()];
		this.nextPieceCtx.clearRect(0, 0, this.nextPieceWidth, this.nextPieceHeight);

		// fixes drawing starting offset
		if (type === Tetris.PieceTypes.SQUARE) {
			paddingX = 0;
			paddingY = 0;
		} else if (type === Tetris.PieceTypes.L) {
			paddingX = 0;
			paddingY = 50;
		}
 
		t.forEach(transform => {
			const x = TetrisGraphics.SquareDrawX(ox, transform[1]);
			const y = TetrisGraphics.SquareDrawY(oy, transform[0]);
			
			this.nextPieceCtx.fillRect(
				x + paddingX,
				y + paddingY,
				TetrisGraphics.colWidth,
				TetrisGraphics.colHeight
			);
		});
	},

	drawStats(score, lines, level) {
		this.$score.innerHTML = this.score;
		this.$level.innerHTML = this.level;
		this.$lines.innerHTML = this.lines;
	},
	
	init() {
		const $nextPieceCanvas = document.getElementById("nextPieceCanvas");

		this.nextPieceWidth = $nextPieceCanvas.width;
		this.nextPieceHeight = $nextPieceCanvas.height;
		this.nextPieceCtx = $nextPieceCanvas.getContext('2d');
		this.nextPieceCtx.fillStype = 'white';
	}
};
