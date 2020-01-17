 Tetris.Animation = {
	changingFillDirection: false,
	fillRow: 0,
	fillCol: 0,
	fillColDirection: 0,

	CLEAR_COL_ANIMATION_TIMER: 5,
	GAME_OVER_ANIMATION_TIMER: 3,

	reset(rows, cols) {
		this.fillRow = rows - 1;
		this.fillCol = cols - 1;
		this.fillColDirection = -1;
		this.changingFillDirection = false;
	},

	animateRowClear(clearedRow, clearColLeft, clearColRight) {
		window.setTimeout(() => {
			TetrisGraphics.drawClearedTile(clearedRow, clearColLeft);
			TetrisGraphics.drawClearedTile(clearedRow, clearColRight);

			clearColLeft--;
			clearColRight++;

			if (clearColLeft < 0 || clearColRight > this.cols) {
				Tetris.isClearingRow = false;
			} else {
				this.animateRowClear(clearedRow, clearColLeft, clearColRight);
			}
		}, this.CLEAR_COL_ANIMATION_TIMER);
	},
	animateGameOver() {
		window.setTimeout(() => {
			if (this.changingFillDirection) {
				this.changingFillDirection = false;
				TetrisGraphics.drawGameOverTile(this.fillRow, this.fillCol);
				this.fillRow--;
			} else {
				TetrisGraphics.drawGameOverTile(this.fillRow, this.fillCol);
				this.fillCol += this.fillColDirection;

				if (this.fillCol === Tetris.cols - 1 || this.fillCol === 0) {
					this.changingFillDirection = true;
					this.fillColDirection *= -1;
				}
			}
			if (this.fillRow < 0 && this.fillCol === 0) {
				$addClass(document.getElementById('game'), 'see-through');
				$removeClass(document.getElementById('gameOver'), 'hide');
			} else {
				this.animateGameOver();
			}
		}, this.GAME_OVER_ANIMATION_TIMER);
	}
}
