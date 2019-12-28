class TetrisPiece {
	constructor(type) {
		this.type = type;
		this.origin = [2,5];
		this.rotation = 0;
		this.rotations = [];
	
		switch(type) {
			case Tetris.PieceTypes.SQUARE:
				/*
				[][]
				[][]
				*/
				this.origin = [0,4];
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
				/*
				  [][]
				[][] <- origin is here
				*/
				this.origin = [1,5];
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
				  [][] <-- origin is first col on this row
				*/
				this.origin = [1,5];
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
				// [] <-- origin
				// []
				// []
				this.origin = [1,5];
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
				this.origin = [2,5];
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
				// [][][] <-- origin is middle block
				this.origin = [1, 5];
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

		this.dropPreviewOrigin = [this.origin[0], this.origin[1]];
		this.ogDropPreviewOrigin = [this.origin[0], this.origin[1]];

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

	moveLeft(min, gameboard) {
		let newX;
		let y;

		for (let i=0; i<this.transform.length; i++) {
			newX = this.origin[1] + this.transform[i][1] - 1;
			y = this.origin[0] + this.transform[i][0];

			if (newX < min || gameboard[y][newX] !== Tetris.PieceTypes.EMPTY) {
				return false;
			}
		}

		this.origin[1]--;
		this.dropPreviewOrigin[1]--;

		return true;
	}
	
	moveRight(max, gameboard) {
		let newX;
		let y;

		for (let i=0; i<this.transform.length; i++) {
			newX = this.origin[1] + this.transform[i][1] + 1;
			y = this.origin[0] + this.transform[i][0];

			if (newX > max || gameboard[y][newX] !== Tetris.PieceTypes.EMPTY) {
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
		this.transform.forEach(t => {
			let tempX = this.origin[1] + t[1];

			if (tempX < 0) {
				bounceAmount++;
			} else if (tempX > max) {
				bounceAmount--;
			}
		});

		if (bounceAmount !== 0) {
			this.origin[1] += bounceAmount;
		}
	}
}
