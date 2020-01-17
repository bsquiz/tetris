const BAudio = {
	ctx: new AudioContext(),
	audioWorkerMode: false,
	Oscillators: {
		SINE: "sine",
		SQUARE: "square",
		TRIANGLE: "triangle",
		SAWTOOTH: "sawtooth",
		NOISE: "noise"
	},
	createNoiseOutput() {
		const real = new Float32Array(2);
		const imag = new Float32Array(2);

		real[0] = 0;
		imag[0] = 0;
		real[0] = 1;
		imag[0] = 0;

		const wave = this.ctx.createPeriodicWave(	
			real,
			imag,
			{ disableNormalization: true }
		);
		
		return wave;
	},
	createOscillator(type) {
		const ctx = new AudioContext();
		const oscillator = ctx.createOscillator();
		const gain = ctx.createGain();
		const analyser = ctx.createAnalyser();
		const masterGain = ctx.createGain();

		oscillator.type = type;
		oscillator.start();
		gain.gain.value = 0;
		masterGain.gain.value = 1;
	
		if (type === this.Oscillators.NOISE) {
			oscillator.setPeriodicWave(this.createNoiseOutput());
		}

		oscillator.connect(gain);
		gain.connect(masterGain);
		masterGain.connect(analyser);
		analyser.connect(ctx.destination);

		analyser.fftSize = 32;
		analyser.smoothingTimeConstant = 0.1;

		return {
			ctx: ctx,
			oscillator: oscillator,
			analyser: analyser,
			frequencyData: new Float32Array(analyser.frequencyBinCount),
			uInt8FrequencyData: new Uint8Array(analyser.frequencyBinCount),
			gain: gain,
			masterGain: masterGain
		};
	},
	playOscillator(
		oscillator,
		delay,
		frequency = 440,
		duration = 0.1,
		volume = 0.1,
		attack = 0,
		decay = 0
	) {
		//console.log(`duration ${duration} delay ${delay} f ${frequency} v ${volume} a ${attack} de ${decay}`);

		const changeStartTime = oscillator.ctx.currentTime + delay;
		const changeEndTime = changeStartTime + duration;

		oscillator.oscillator.frequency.setValueAtTime(
			frequency,
			changeStartTime
		);
		
		oscillator.gain.gain.linearRampToValueAtTime(
			volume,
			changeStartTime + attack 
		);
		oscillator.gain.gain.setValueAtTime(
			volume,
			changeStartTime + attack 
		); 
		oscillator.gain.gain.linearRampToValueAtTime(
			0,
			changeEndTime + attack + decay 
		);
	},
	init() {
		if (this.ctx.audioWorklet) {
			this.ctx.audioWorklet.addModule('whiteNoiseProcessor.js');
			this.whiteNoiseNode = new AudioWorkletNode(this.ctx, 'white-noise-processor');
			this.whiteNoiseNode.connect(this.ctx.destination);
		}
	}
}
const TetrisSoundEffects = {
	playOscillator(oscillator, freq = 100, duration = 0.1, vol = 0.1) {
		BAudio.playOscillator(
			oscillator,
			0,
			freq,
			duration,
			vol,
			0.01,
			0.01
		);
	},

	mute() {
		this.sineWave.masterGain.gain.value = 0;
	},
	
	unmute() {
		this.sineWave.masterGain.gain.value = 1;
	},

	playRotateSound() {
		this.playOscillator(this.sineWave, 500);
	},
	
	playMoveSound() {
		this.playOscillator(this.sineWave, 2000, 0.01);
	},

	playDropSound() {
		this.playOscillator(this.sineWave, 1000, 0.025);
	},
	
	playClearSound() {
		const duration = 0.1;

		this.playOscillator(this.sineWave, 400, duration);
		BAudio.playOscillator(
			this.sineWave,
			duration,
			500,
			duration
		);
		BAudio.playOscillator(
			this.sineWave,
			duration * 2,
			1000,
			duration
		);
	},

	init() {
		this.sineWave = BAudio.createOscillator(BAudio.Oscillators.SINE);
	}
}
const TetrisSong = {
	trebleParts: {
		"A": [{
			pitch: 'E5',
			duration: 1
		},{
			pitch: 'B4',
			duration: 0.5
		},{
			pitch: 'C5',
			duration: 0.5
		},{
			pitch: 'D5',
			duration: 1
		},{
			pitch: 'C5',
			duration: 0.5
		},{
			pitch: 'B4',
			duration: 0.5
		},{
			pitch: 'A4',
			duration: 1
		},{
			pitch: 'A4',
			duration: 0.5
		},{
			pitch: 'C5',
			duration: 0.5
		},{
			pitch: 'E5',
			duration: 1
		},{
			pitch: 'D5',
			duration: 0.5
		},{
			pitch: 'C5',
			duration: 0.5
		}],
		"B": [{
			pitch: 'B4',
			duration: 1
		},{
			pitch: 'B4',
			duration: 0.5
		},{
			pitch: 'C5',
			duration: 0.5
		},{
			pitch: 'D5',
			duration: 1
		},{
			pitch: 'E5',
			duration: 1
		},{
			pitch: 'C5',
			duration: 1
		},{
			pitch: 'A4',
			duration: 1
		},{
			pitch: 'A4',
			duration: 2
		}],
		"C": [{
			pitch: 'REST',
			duration: 0.5
		},{
			pitch: 'D5',
			duration: 1
		},{
			pitch: 'F5',
			duration: 0.5
		},{
			pitch: 'A5',
			duration: 1
		},{
			pitch: 'G5',
			duration: 0.5
		},{
			pitch: 'F5',
			duration: 0.5
		},{
			pitch: 'E5',
			duration: 1.5 
		},{
			pitch: 'C5',
			duration: 0.5
		},{
			pitch: 'E5',
			duration: 1
		},{
			pitch: 'D5',
			duration: 0.5
		},{
			pitch: 'C5',
			duration: 0.5
		}],
		"D": [{
			pitch: 'E4',
			duration: 2
		},{
			pitch: 'C4',
			duration: 2
		},{
			pitch: 'D4',
			duration: 2
		},{
			pitch: 'B3',
			duration: 2
		}],
		"E": [{
			pitch: 'C4',
			duration: 2
		},{
			pitch: 'A3',
			duration: 2
		},{
			pitch: 'GS3',
			duration: 2
		},{
			pitch: 'B3',
			duration: 2,
		}],
		"F": [{
			pitch: 'C4',
			duration: 1
		},{
			pitch: 'E4',
			duration: 1
		},{
			pitch: 'A4',
			duration: 1
		},{
			pitch: 'A4',
			duration: 1
		},{
			pitch: 'GS4',
			duration: 4
		}]
		},
		bassParts: {
			"A": [{
				pitch: 'GS4',
				duration: 4
			},{
				pitch: 'A4',
				duration: 4
			},{
				pitch: 'B4',
				duration: 4
			},{
				pitch: 'A4',
				duration: 4
			},{
				pitch: 'D4',
				duration: 4
			},{
				pitch: 'C4',
				duration: 4
			},{
				pitch: 'B4',
				duration: 4
			},{
				pitch: 'A4',
				duration: 4
			}],
			"B": [{
				pitch: 'A4',
				duration: 4,
			},{
				pitch: 'E4',
				duration: 4,
			},{
				pitch: 'A4',
				duration: 4
			},{
				pitch: 'E4',
				duration: 4
			}]
	},
	drumParts: {
		A: [{
			pitch: 'C3',
			duration: 1
		},{
			pitch: 'C3',
			duration: 1
		},{
			pitch: 'C3',
			duration: 0.5
		},{
			pitch: 'C3',
			duration: 0.5
		}]
	},

	getTracks() {
		return {
			TREBLE: [
				this.trebleParts.A,
				this.trebleParts.B,
				this.trebleParts.C,
				this.trebleParts.B,

				this.trebleParts.A,
				this.trebleParts.B,
				this.trebleParts.C,
				this.trebleParts.B,

				this.trebleParts.D,
				this.trebleParts.E,
				this.trebleParts.D,
				this.trebleParts.F
			].flat(),
			BASS: [
				this.bassParts.A,
				this.bassParts.B,
				this.bassParts.B	
			].flat(),
			DRUM: [
				this.drumParts.A
			].flat()
		}
	}
};
const BMusicPlayer = {
	sineWave: null,
	triangleWave: null,
	noiseWave: null,
	playing: false,
	tempo: 0.4,

	channels: {
		"SINE": {
			oscillator: {},
			track: {},
			playNextNote: true,
			currentNote: 0,
			nextNoteTimer: 0
		},
		"TRIANGLE": {
			oscillator: {},
			track: {},
			playNextNote: true,
			currentNote: 0,
			nextNoteTimer: 0
		},
		"NOISE": {
			oscillator: {},
			track: {},
			playNextNote: true,
			currentNote: 0,
			nextNoteTimer: 0
		}
	},

	Pitches: {
		C3: 130.813,
		D3: 146.832,
		E3: 164.814,
		F3: 176.614,
		G3: 195.998,
		GS3: 207.65,
		A3: 220,
		B3: 246.942,
		C4: 261.63,
		D4: 293.66,
		E4: 329.63,
		GS4: 415.30,
		A4: 440,
		B4: 493.883,
		C5: 523.251,
		D5: 587.33,
		E5: 659.255,
		F5: 698.456,
		G5: 783.991,
		GS5: 830.61,
		A5: 880,
		REST: -1
	},

	start() {
		this.playing = true;
		this.update();
	},

	play() {
		this.sineWave.masterGain.gain.value = 1;
	},
	
	pause() {
		this.sineWave.masterGain.gain.value = 0;
	},

	scheduleMusic() {
		let nextTime = 0;
		for (let prop in this.channels) {
			if (!this.channels.hasOwnProperty(prop)) continue;
			
			if (prop !== 'SINE') continue;
	
			const track = this.channels[prop].track;
				
			for (let i=0; i<track.length; i++) {
				const note = track[i];
				const pitch = this.Pitches[note.pitch];
				const duration = note.duration * this.tempo;

				BAudio.playOscillator(
					this.channels.SINE.oscillator,
					nextTime,
					pitch,
					duration,
					0.1
				);

				nextTime += duration;
			}
		}
	},

	init(song) {
		const tracks = song.getTracks();

		this.sineWave = BAudio.createOscillator(BAudio.Oscillators.SINE);
		this.triangleWave = BAudio.createOscillator(BAudio.Oscillators.TRIANGLE);
		this.noiseWave = BAudio.createOscillator(BAudio.Oscillators.NOISE);
	
		this.channels.SINE.oscillator = this.sineWave;
		this.channels.TRIANGLE.oscillator = this.triangleWave;
		this.channels.NOISE.oscillator = this.noiseWave;

		this.channels.SINE.track = tracks.TREBLE;
		this.channels.TRIANGLE.track = tracks.BASS;	
		this.channels.NOISE.track = tracks.DRUM;	

		let totalMusicTime = 0;
		for (let i=0; i<this.channels.SINE.track.length; i++) {
			const duration = this.channels.SINE.track[i].duration * this.tempo;

			totalMusicTime += duration;
		}

		totalMusicTime *= 1000;
		this.scheduleMusic();
	
		console.log(totalMusicTime);	
		window.setInterval(() => this.scheduleMusic(), totalMusicTime);
	}
}
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
class GameBoard {
	constructor(rows, cols) {
		this.board = [];
		this.rows = rows;
		this.cols = cols;
	}

	getBoard() { return this.board; }

	reset() {
		this.board = [];	
		for(let i=0; i<this.rows; i++) {
			this.board.push(this.createEmptyRow());
		}
	}
	
	createEmptyRow() {
		return new Array(this.cols).fill(0);
	}

	mergePieceToBoard(piece) {
		const mapping = piece.getGameBoardMapping();
		const type = piece.getType();

		mapping.forEach(t => {
			this.board[t[0]][t[1]] = type;
		});
	}

	checkClear() {
		const rowsToClear = [];
		/*
			check from top to bottom
			[][][]|
			[][][]|
			[][][]|
			[][][]\
		*/
		for (let i=0; i<this.board.length; i++) {
			const row = this.board[i];
			let shouldClear = true;

			for (let j=0; j<row.length; j++ ) {
				if (row[j] === Tetris.PieceTypes.EMPTY) {
					shouldClear = false;

					break;
				}
			}

			if (shouldClear) {
				rowsToClear.push(i);
				/*
				Work backwards to first row,
				swapping cleared row with row before it.
				*/
				for (let j=i; j>1; j--) {
					this.board[j] = [...this.board[j-1]];
				}
			}
		}

		return rowsToClear;
	}

	init() {
		this.reset();
		
		for (let i=0; i<this.cols - 2; i++) {
//			this.board[this.rows - 2][i] = 1;
//			this.board[this.rows - 3][i] = 1;
		}
	}
}
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
const Tetris = {
	rows: 24,
	cols: 10,
	score: 0,
	clearedLines: 0,
	level: 1,
	gameBoard: null,
	currentPiece: {}, 
	nextPiece: {},
	availablePieces: [],

	$highScoreName: null,

	isRunning: false,
	shouldRedraw: true,
	audioInitialized: false,
	playMusic: true,
	// have to press key each time you want to rotate
	canRotatePiece: true,
	// have to press key each time you want to drop 
	canDropPiece: true,
	isClearingRow: false,
	
	dropTimer: 30,
	maxDropTimer: 30,
	keyDebounceTimer: 5,

	MAX_CLEAR_ROW_TIMER: 30,
	MAX_KEY_DEBOUNCE_TIMER: 5,

	keysDown: {
		32: false,
		37: false,
		39: false,
		40: false,
		38: false
	},

	PieceTypes: {
		"EMPTY": 0,
		"SQUARE": 1,
		"LINE": 2,
		"Z": 3,
		"L": 4,
		"TRIANGLE": 5,
		"S": 6
	},
	Keys: {
		LEFT: 37,
		RIGHT: 39,
		DOWN: 40,
		UP: 38,
		SPACE: 32 
	},

	setKeyDown(key, val) {
		if (val === false) {
			if (key === this.Keys.SPACE) {
				this.canDropPiece = true;
			}
			
			if (key === this.Keys.UP) {
				this.canRotatePiece = true;
			}
		}

		this.keysDown[key] = val;
	},

	toggleMusic() {
		this.playMusic = !this.playMusic;

		if (this.playMusic) {
			BMusicPlayer.play();
		} else {
			BMusicPlayer.pause();
		}

		return this.playMusic;
	},

	calculateClearScore(hardDrop = false, numLinesCleared = 1) {
		return 10 * (hardDrop ? 2 : 1) * numLinesCleared;
	},

	makeNextPiece(excludePieceType) {
		const r = Math.floor(Math.random() * 6);
		let newPiece = this.availablePieces[r];
		
		newPiece.reset();

//		while(newPiece.getType() === excludePieceType) {
//		}
		
		return newPiece;
	},

	movePieceDown() {
		if (this.currentPiece.moveDown(this.gameBoard.getBoard())) {
			return true;
		}

		return false;
	},

	movePiece(
		moveLeft = false,
		moveRight = false,
		moveDown = false,
		moveUp = false,
		drop = false) {
		const origin = this.currentPiece.getOrigin();
		const board = this.gameBoard.getBoard();

		if (moveLeft && !moveRight) {
			if (this.currentPiece.moveLeft(0, board)) {
				TetrisSoundEffects.playMoveSound();
			}
		}

		if (moveRight && !moveLeft) {
			if(this.currentPiece.moveRight(this.cols - 1, board)) {
				TetrisSoundEffects.playMoveSound();
			}
		}

		if (moveDown) {
			this.movePieceDown();
		}

		if (moveUp && !moveLeft && !moveRight && this.canRotatePiece) {
			this.canRotatePiece = false;
			this.currentPiece.rotate(this.cols - 1);
			TetrisSoundEffects.playRotateSound();
		}

		if (drop && this.canDropPiece) {
			this.canDropPiece = false;
			this.currentPiece.drop(board);
			TetrisSoundEffects.playDropSound();
		}

		this.currentPiece.updatePreviewDrop(board);

		return (moveLeft || moveRight || moveDown || moveUp || drop);
	},

	startNextPiece() {
		const oldPieceType = this.currentPiece.getType();

		this.currentPiece = this.nextPiece;
		this.nextPiece = this.makeNextPiece(oldPieceType);
		this.currentPiece.updatePreviewDrop(this.gameBoard.getBoard());
		TetrisHUD.drawNextPiece(this.nextPiece);
	},
	
	increaseLevel() {
		this.level++;
		if (this.maxDropTimer > 5) {
			this.maxDropTimer -= 5;
		}
	},

	reset() {
		this.level = 1;
		this.score = 0;
		this.clearedLines = 0;
		this.maxDropTimer = 30;
		this.dropTimer = this.maxDropTimer;

		this.Animation.reset(this.rows, this.cols);
		this.gameBoard.reset();	

		this.currentPiece = this.makeNextPiece(0);
		this.nextPiece = this.makeNextPiece(this.currentPiece.getType());
		this.currentPiece.updatePreviewDrop(this.gameBoard.getBoard());

		TetrisHUD.drawNextPiece(this.nextPiece);
		TetrisHUD.drawStats(this.score, this.clearedLines, this.level);
		TetrisGraphics.draw(this.currentPiece, this.gameBoard.getBoard()); 
	},
	gameOver() {
		document.getElementById('finalScore').innerHTML = this.score;
		document.getElementById('finalLines').innerHTML = this.clearedLines;
		document.getElementById('finalLevel').innerHTML = this.level;
		this.isRunning = false;
		this.Animation.animateGameOver();
	},

	retry() {
		this.isRunning = true;
		$removeClass(document.getElementById('game'), 'see-through');
		$addClass(document.getElementById('gameOver'), 'hide');
		this.reset();
	},	

	clearRows(rowsToClear) {
		this.isClearingRow = true;
		this.clearedLines += rowsToClear.length;
		this.shouldRedraw = false;

	//	TetrisGraphics.draw(this.currentPiece, this.gameBoard.getBoard(), false);

		for (let c = 0; c < rowsToClear.length; c++) {
			this.Animation.animateRowClear(rowsToClear[c], 5, 5);
		}

		if (
			this.clearedLines > 10 && this.level === 1 ||
			this.clearedLines > 20 && this.level === 2 ||
			this.clearedLines > 30 && this.level === 3 ||
			this.clearedLines > 40 && this.level === 4
		) {
			this.increaseLevel();
		}

		TetrisHUD.drawStats(this.score, this.clearedLines, this.level);
		TetrisSoundEffects.playClearSound();
	},
	
	update() {
		if (!this.isRunning || this.isClearingRow) return;

		if (this.currentPiece.isStuck(this.gameBoard.getBoard())) {
			this.gameOver();
		}

		let rowsToClear = 0;
		let isHardDrop = false;

		if (this.keyDebounceTimer === 0) {
			// force redraw if player moves piece
			this.shouldRedraw = this.movePiece(
				this.keysDown[this.Keys.LEFT],
				this.keysDown[this.Keys.RIGHT],
				this.keysDown[this.Keys.DOWN],
				this.keysDown[this.Keys.UP],
				this.keysDown[this.Keys.SPACE]
			);
			this.keyDebounceTimer = this.MAX_KEY_DEBOUNCE_TIMER;

			if (this.canDropPiece && this.keysDown[this.Keys.SPACE]) {
				// immediatly trigger piece hit check 
				this.dropTimer = 0;
			}
		} else {
			this.keyDebounceTimer--;
		}

		isHardDrop = this.keysDown[this.Keys.DOWN] && this.canDropPiece;

		if (this.dropTimer === 0) {
			// progress piece downwards

			this.dropTimer = this.maxDropTimer;
			this.shouldRedraw = true;

			if(!this.movePieceDown(this.currentPiece)) {
				// piece has hit bottom or another piece

				this.gameBoard.mergePieceToBoard(this.currentPiece);
				this.startNextPiece();
				rowsToClear = this.gameBoard.checkClear();

				if (rowsToClear.length > 0) {
					this.score += this.calculateClearScore(isHardDrop, rowsToClear.length);
					this.clearRows(rowsToClear);
					this.shouldRedraw = false;
				}	
			}
		} else {
			this.dropTimer--;
		}

		if (this.shouldRedraw) {
			this.shouldRedraw = false;
			TetrisGraphics.draw(
				this.currentPiece,
				this.gameBoard.getBoard()
			); 
		}
	},

	initAudio() {
		this.audioInitialized = true;
			
		TetrisSoundEffects.init();	
		BMusicPlayer.init(TetrisSong);			
	},

	start() {
		this.isRunning = true;
	},
	
	togglePause() {
		return this.isRunning = !this.isRunning;
	},

	loadScores() {},

	saveScore() {},

	init() {
		this.$finalScore = document.getElementById('finalScore');
		this.$finalLines = document.getElementById('finalLines');
		this.$finalLevel = document.getElementById('finalLevel');
		this.$highScoreName = document.getElementById('highScoreName');

		this.availablePieces = [
			new TetrisPiece(1),
			new TetrisPiece(2),
			new TetrisPiece(3),
			new TetrisPiece(4),
			new TetrisPiece(5),
			new TetrisPiece(6)
		];
		this.gameBoard = new GameBoard(this.rows, this.cols);
		this.gameBoard.init();
		TetrisGraphics.init(this.rows, this.cols);
		this.initAudio();
		this.reset();
		this.toggleMusic();
	}
};
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
function $(id) {
	return document.getElementById(id);
}
function $hasClass($el, cls) {
	return $el.className.indexOf(cls) !== -1;
}
function $addClass($el, cls) {
	if (!$hasClass($el, cls)) {
		$el.className += ` ${cls}`;
	}
}

function $removeClass($el, cls) {
	$el.className = $el.className.replace(cls, '');
}

function $toggleClass($el, cls) {
	if (!$hasClass($el, cls)) {
		$el.className += ` ${cls}`;
	} else {
		$el.className = $el.className.replace(cls, '');
	}
}

function updateGame() {
	Tetris.update();

	window.requestAnimationFrame(updateGame);
}

function $on($el, event, callback) {
	$el.addEventListener(event, callback);
}
function toggleSFX(e) {
	const $button = e.target;

	$toggleClass($button, 'disabled');
	if ($hasClass($button, 'disabled')) {
		TetrisSoundEffects.mute();
	} else {
		TetrisSoundEffects.unmute();
	}
}
function toggleMusic(e) {
	const $button = e.target;

	$toggleClass($button, 'disabled');
	Tetris.toggleMusic();
}

function togglePause(e) {
	const $button = e.target;

	$toggleClass($button, 'disabled');
	Tetris.togglePause();
}

function addGameEventListeners() {
	const $leftBtn = $('leftBtn');
	const $rightBtn = $('rightBtn');
	const $rotateBtn = $('rotateBtn');
	const $dropBtn = $('dropBtn');
	const $hardDropBtn = $('hardDropBtn');
	const $musicToggleButton = $('musicToggleButton');
	const $pauseToggleButton = $('pauseToggleButton');
	const $sfxToggleButton = $('sfxToggleButton');

	$on($leftBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.LEFT, true);
	});
	$on($leftBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.LEFT, false);
	});

	$on($rightBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.RIGHT, true);
	});
	$on($rightBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.RIGHT, false);
	});

	$on($rotateBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.UP, true);
	});
	$on($rotateBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.UP, false);
	});

	$on($dropBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.DOWN, true);
	});
	$on($dropBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.DOWN, false);
	});

	$on($hardDropBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.SPACE, true);
	});
	$on($hardDropBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.SPACE, false);
	});

	$on($musicToggleButton, "click", toggleMusic);
	$on($pauseToggleButton, "click", togglePause);
	$on($sfxToggleButton, "click", toggleSFX);

	$on(window, "keydown", function(e) {
		Tetris.setKeyDown(e.keyCode, true);
	});
	$on(window, "keyup", function(e) {
		Tetris.setKeyDown(e.keyCode, false);
	});
}
function startGame() {
	Tetris.init();
	Tetris.start();
	$addClass($('startScreen'), 'hide');

	window.requestAnimationFrame(updateGame);
}
window.onload = function() {
	addGameEventListeners();
}
