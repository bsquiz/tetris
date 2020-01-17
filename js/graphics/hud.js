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
		const t = piece.getOGTransform();
		const type = piece.getType();
		let paddingX = 15;
		let paddingY = 15;

		this.nextPieceCtx.fillStyle = TetrisGraphics.PieceColors[piece.getType()];
		this.nextPieceCtx.clearRect(0, 0, this.nextPieceWidth, this.nextPieceHeight);

			
		// fixes drawing starting offset
		if (type === Tetris.PieceTypes.L) {
			paddingY = 60;
		} else if (type === Tetris.PieceTypes.LINE) {
			paddingY = 60;
			paddingX = 27;
		} else if (
			type === Tetris.PieceTypes.S ||
			type === Tetris.PieceTypes.Z ||
			type === Tetris.PieceTypes.TRIANGLE
		) {
			paddingX = 27;
			paddingY = 40;
		} 

		this.nextPieceCtx.beginPath();
 
		t.forEach(transform => {
			const x = TetrisGraphics.SquareDrawX(ox, transform[1]);
			const y = TetrisGraphics.SquareDrawY(oy, transform[0]);
			
			this.nextPieceCtx.rect(
				x + paddingX,
				y + paddingY,
				TetrisGraphics.colWidth,
				TetrisGraphics.colHeight
			);
		});
		this.nextPieceCtx.fill();
		this.nextPieceCtx.stroke();
	},

	drawStats(score, lines, level) {
		this.$score.innerHTML = score;
		this.$level.innerHTML = level;
		this.$lines.innerHTML = lines;
	},
	
	init() {
		const $nextPieceCanvas = document.getElementById("nextPieceCanvas");

		this.nextPieceWidth = $nextPieceCanvas.width;
		this.nextPieceHeight = $nextPieceCanvas.height;
		this.nextPieceCtx = $nextPieceCanvas.getContext('2d');
		this.nextPieceCtx.fillStype = 'white';
	}
};
