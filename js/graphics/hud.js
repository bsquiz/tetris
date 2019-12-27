const TetrisHUD = {
	nextPieceCtx: {},	
	nextPieceWidth: 0,
	nextPieceHeight: 0,
	$score: document.getElementById('scoreVal'),
	$level: document.getElementById('levelVal'),
	$lines: document.getElementById('linesVal'),
	colWidth: 20,
	colHeight: 20,

	drawNextPiece(piece) {
		const ox = 25;
		const oy = 25;

		this.nextPieceCtx.fillStyle = TetrisGraphics.PieceColors[piece.getType()];
		this.nextPieceCtx.clearRect(0, 0, this.nextPieceWidth, this.nextPieceHeight);

		t.forEach(transform => {
			const x = TetrisGraphis.SquareDrawX(ox, transform[1]);
			const y = TetrisGraphics.SquareDrawY(oy, transform[0]);

			this.nextPieceCtx.fillRect(x, y, this.colWidth, this.colHeight);
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
