const BMusicPlayer = {
	sineWave: null,
	triangleWave: null,
	playing: false,
	nextNoteTimer: 0,
	tempo: 150,
	totalMeasures: 32,
	totalBeats: 32 * 4,
	FPS: 60,
	BPS: 150 / 60,
	FRAME_SCALE: 0,
	CLOCK_SCALE: 0,
	channels: {
		"SINE": {
			oscillator: {},
			track: {},
			currentNote: 0,
			nextNoteTimer: 0
		},
		"TRIANGLE": {
			oscillator: {},
			track: {},
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
		GS3: 0,
		A3: 220,
		B3: 246.942,
		A4: 440,
		B4: 493.883,
		C5: 523.251,
		D5: 587.33,
		E5: 659.255,
		F5: 698.456,
		G5: 783.991,
		A5: 880,
		REST: -1
	},

	start() {
		this.playing = true;	
		this.update();
	},
	
	update() {
		if (!this.playing) return;

		this.channels.forEach(c => {
			if (c.nextNoteTimer === 0) {
				c.currentNote++;
				if (c.currentNote > c.track.length) {
					c.currentNote = 0;
				}
				const note = c.track[c.currentNote];
				if (note.pitch !== this.Pitches.REST) {
					BAudio.playOscillator(
						c.oscillator,
						note.pitch,
						note.duration * this.CLOCK_SCALE 
					);
				}		
			}
		});			
	},

	init(song) {	
		this.sineWave = BAudio.createOscillator(BAudio.Oscillators.SINE);

				const p = this.Pitches;
		this.tracks = {
			TREBLE: [
			trebleParts.A,
			trebleParts.B,
			trebleParts.C,
			trebleParts.B,

			trebleParts.A,
			trebleParts.B,
			trebleParts.C,
			trebleParts.B,

			trebleParts.D,
			trebleParts.E,
			trebleParts.D,
			trebleParts.F
			].flat(),
			BASS: [
			bassParts.A,
			bassParts.B,
			bassParts.B	
			].flat()
		};

		this.channels.SINE.oscillator = this.sineWave;
		this.channels.TRIANGLE.oscillator = this.triangleWave;
	
		this.FRAME_SCALE = this.FPS / (this.BPS / this.FPS);		
		this.CLOCK_SCALE = 1000 / this.BPS;
	}
}
