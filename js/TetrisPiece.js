class TetrisPiece {
	constructor(type) {
		this.type = type;
		this.origin = [3,5];
		this.rotation = 0;
		this.rotations = [];
		this.dropPreviewOrigin = [3,5];
		this.ogDropPreviewOrigin = [3, 5];

		switch(type) {
			case Tetris.PieceTypes.SQUARE:
				/*
				[][]
				[][]
				*/
				this.transform = [
					[0,0],
					[0,1],
					[1,0],
					[1,1]
				];
				this.rotations = [
					[
						[0,0],
						[0,1],
						[1,0],
						[1,1]
					],[
						[0,0],
						[0,1],
						[1,0],
						[1,1]
					],[
						[0,0],
						[0,1],
						[1,0],
						[1,1]
					],[
						[0,0],
						[0,1],
						[1,0],
						[1,1]
					]
				];
		break;
			case Tetris.PieceTypes.S:
				this.transform = [
					[0,0],
					[0,-1],
					[-1,0],
					[-1,1]
				];
				this.rotations = [
					[
						/*
						  [][]
						[][] <- origin is here
						*/
						[0,0],
						[0,-1],
						[-1,0],
						[-1,1]
					],[
						/*
						[]
						[][]
						  []
						*/
						[0,0],
						[-1,0],
						[0,1],
						[1,1]
					],[
						/*
						  [][]
						[][]
						*/
						[0,0],
						[0,-1],
						[-1,0],
						[-1,1]
					],[
						/*
						[]
						[][]
						  []
						*/
						[0,0],
						[-1,0],
						[0,1],
						[1,1]
					]
				];
			break;
			case Tetris.PieceTypes.Z:
				/*
				[][]
				  [][]
				*/
				this.transform = [
					[0,0],
					[0,1],
					[-1,0],
					[-1,-1]
				];
				this.rotations = [
					[
						// [][]
						//   [][]
						[0,0],
						[0,1],
						[-1,0],
						[-1,-1]
					],[
						//   []
						// [][]
						// []
						[0,0],
						[1,0],
						[0,1],
						[-1,1]
					],[
						// [][]
						//   [][]
						[0,0],
						[0,1],
						[-1,0],
						[-1,-1]
					],[
						//   []
						// [][]
						// []
						[0,0],
						[1,0],
						[0,1],
						[-1,1]
					]
				];
			break;
			case Tetris.PieceTypes.LINE:
				// []
				// []
				// []
				// []
				this.transform = [
					[0,0],
					[1,0],
					[-1,0],
					[-2,0]
				];
				this.rotations = [
					[
						// []
						// [] <- origin
						// []
						// []
						[0,0],
						[1,0],
						[-1,0],
						[-2,0]	
					],[
						// [][][][]
						[0,0],
						[0,1],
						[0,-1],
						[0,-2]
					],[
						// []
						// [] <- origin
						// []
						// []
						[0,0],
						[1,0],
						[-1,0],
						[-2,0]	
					],[
						// [][][][]
						[0,0],
						[0,1],
						[0,-1],
						[0,-2]
					]
				];
			break;
			case Tetris.PieceTypes.L:
				// []
				// []
				// [][] <- origin is 1st
				this.transform = [
					[0,0],
					[0,1],
					[-1,0],
					[-2,0]
				];
				this.rotations = [
					// []
					// []
					// [][]
					[
						[0,0],
						[0,1],
						[-1,0],
						[-2,0]	
					],[
						// [][][]
						// []
						[0,0],
						[0,1],
						[0,2],
						[1,0]
					],[
						// [][]
						//   []
						//   []
						[0,0],
						[1,0],
						[2,0],
						[0,-1]
					],[
						//     []
						// [][][]
						[0,0],
						[0,-1],
						[0,-2],
						[-1,0]
					]
				];
			break;
			case Tetris.PieceTypes.TRIANGLE:
				//   []
				// [][][]
				this.transform = [
					[0,0],
					[0,-1],
					[-1,0],
					[0,1]
				];
				this.rotations = [
					[
						//   []
						// [][][]
						[0,0],
						[0,-1],
						[-1,0],
						[0,1]	
					],[
						// []
						// [][]
						// []
						[0,0],
						[-1,0],
						[0,1],
						[1,0]
					],[
						// [][][]
						//   []
						[0,0],
						[0,1],
						[1,0],
						[0,-1]
					],[
						//   []
						// [][]
						//   []
						[0,0],
						[1,0],
						[0,-1],
						[-1,0]
					]
				];
			break;

			default: break;
		}
	}

	getType() { return this.type; }	
	getOrigin() { return this.origin; }
	getDropPreviewOrigin() { return this.dropPreviewOrigin; }
	getTransform() { return this.transform; }

	getGameBoardMapping() {
		const mapping = [];
		
		this.transform.forEach(t => {
			mapping.push([
				this.origin[0] + t[0],
				this.origin[1] + t[1]
			]);
		});
	
		return mapping;
	}

	checkHitLeftSide(transform, gameboard) {
		const row = gameboard[transform[0]];

		if (
			row[transform[1]--] !== 0
		) {
			return true;
		}
	
		return false;
	}
			

	checkHitRightSide(transform, gameboard) {
		const row = gameboard[transform[0]];

		if (
			row[transform[1]++] !== 0
		) {
			return true;
		}
	
		return false;
	}

	checkHitBottom(gameboard, transformOrigin) {
		for (let i=0; i<this.transform.length; i++) {
			const t = this.transform[i];
			const row = transformOrigin[0] + t[0] + 1;
			const col = transformOrigin[1] + t[1];

			if (row === gameboard.length) {
				// at bottom of gameboard, stop
				return true;
			}
			
			if (gameboard[row][col] !== 0) {
				// piece below, stop
				return true;
			}
		}

		return false;
	}
		
	descend(transformOrigin) {
		transformOrigin[0]++;
	}

	dropPiece(gameboard, transformOrigin) {
		let recCount = 50;
		
		while (recCount > 0 && !this.checkHitBottom(gameboard, transformOrigin)) {
			this.recCount--;
			this.descend(transformOrigin);
		}
	}

	updatePreviewDrop(gameboard) {
		this.dropPreviewOrigin[0] = this.ogDropPreviewOrigin[0];
		this.dropPiece(gameboard, this.dropPreviewOrigin);
	}

	drop(gameboard) {
		this.dropPiece(gameboard, this.origin);
	}

	moveDown(gameboard) {
		if (!this.checkHitBottom(gameboard, this.origin)) {
			this.descend(this.origin);
			
			return true;
		}
		
		return false;
	}

	moveLeft(min) {
		for (let i=0; i<this.transform.length; i++) {
			if (this.origin[1] + this.transform[i][1] - 1 < min) {
				return false;
			}
		}

		this.origin[1]--;
		this.dropPreviewOrigin[1]--;

		return true;
	}
	
	moveRight(max) {
		for (let i=0; i<this.transform.length; i++) {
			if (this.origin[1] + this.transform[i][1] + 1 > max) {
				return false;
			}
		}

		this.origin[1]++;
		this.dropPreviewOrigin[1]++;
		
		return true;
	}

	rotate(max) {
		let bounceAmount = 0;

		this.rotation++;
		
		if (this.rotation > 3) {
			this.rotation = 0;
		}

		
		this.transform = this.rotations[this.rotation];
		
		// wall bounce
		let tmpBounce = 0;
		this.transform.forEach(t => {
			if (t[1] < 0) {
				tmpBounce = t[1] * 1;

				if (tmpBounce > bounceAmount) {
					bounceAmount = tmpBounce;
				}
			} else if (t[1] > max) {
				tmpBounce = t[1] * -1;

				if (tmpBounce < bounceAmount) {
					bounceAmount = tmpBounce;
				}
			}
		});

		if (bounceAmount !== 0) {
			this.transform.forEach(t => {
				t[1] += bounceAmount;
			});
		}
	}
}
