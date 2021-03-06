class TetrisPiece {
	constructor(type) {
		this.type = type;
		this.rotation = 0;
		this.rotations = [];
		this.ogTransform = [];
	
		switch(type) {
			case Tetris.PieceTypes.SQUARE:
				/*
				[][]
				[][]
				*/
				this.ogOrigin = [0,4];
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
				this.ogOrigin = [1,5];
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
				this.ogOrigin = [1,5];
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
				this.ogOrigin = [2,5];
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
				this.ogOrigin = [2,5];
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
			case Tetris.PieceTypes.BACKWARDS_L:
				//   [] 
				//   [] 
				// [][] <- origin
				this.ogOrigin = [2,5];
				this.transform = [
					[0,0],
					[0,-1],
					[-1,0],
					[-2,0]
				];
				this.rotations = [
					//   [] 
					//   [] 
					// [][]
					[
						[0,0],
						[0,-1],
						[-1,0],
						[-2,0]	
					],[
						// []
						// [][][]
						[0,0],
						[0,1],
						[0,2],
						[-1,0]
					],[
						// [][]
						// []
						// []
						[0,0],
						[0,1],
						[1,0],
						[2,0]
					],[
						// [][][]
						//     []
						[0,0],
						[0,-1],
						[0,-2],
						[1,0]
					]
				];
			break;
			case Tetris.PieceTypes.TRIANGLE:
				//   []
				// [][][] <-- origin is middle block
				this.ogOrigin = [1, 5];
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

		this.origin = [this.ogOrigin[0], this.ogOrigin[1]];
		this.dropPreviewOrigin = [this.origin[0], this.origin[1]];
		this.ogDropPreviewOrigin = [this.origin[0], this.origin[1]];
		this.ogTransform = [...this.transform];
	}

	getOGTransform() { return this.ogTransform; }
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
			
			if (gameboard[row][col] !== Tetris.PieceTypes.EMPTY) {
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
		while (!this.checkHitBottom(gameboard, transformOrigin)) {
			this.descend(transformOrigin);
		}
	}

	updatePreviewDrop(gameboard) {
		this.dropPreviewOrigin[0] = this.origin[0];
		this.dropPreviewOrigin[1] = this.origin[1];
		this.dropPiece(gameboard, this.dropPreviewOrigin);
	}

	drop(gameboard) {
		this.dropPiece(gameboard, this.origin);
	}

	isStuck(gameboard) {
		return (this.checkHitBottom(gameboard, this.origin) && this.origin[0] === this.ogOrigin[0]);
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
	
	reset() {
		this.origin = [...this.ogOrigin];
		this.dropPreviewOrigin = [...this.origin];
		this.ogDropPreviewOrigin = [...this.origin];
		this.transform = [...this.ogTransform];
		this.rotation = 0;
	}
}
