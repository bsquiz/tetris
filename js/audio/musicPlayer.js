const BMusicPlayer = {
	sineWave: null,
	triangleWave: null,
	noiseWave: null,
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
		},
		"NOISE": {
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

	playNote(channel) {
		const note = channel.track[channel.currentNote];
		const nextNote = channel.track[channel.currentNote + 1];
		const pitch = this.Pitches[note.pitch];

		channel.nextNoteTimer = nextNote.duration * this.FRAME_SCALE;	
		console.log(pitch);
		console.log(channel.currentNote);
		if (pitch !== this.Pitches.REST) {
			BAudio.playOscillator(
				channel.oscillator,
				pitch,
				note.duration * this.CLOCK_SCALE 
			);
		}	
	},
	
	update() {
		if (!this.playing) return;

		for(prop in this.channels) {
			if (!this.channels.hasOwnProperty(prop)) continue;

			if (prop !== 'NOISE') continue;
			const channel = this.channels[prop];
		
			if (this.firstNote) {
				this.playNote(channel);	
			}
	
			if (channel.nextNoteTimer === 0) {
				channel.currentNote++;
				if (channel.currentNote > channel.track.length - 2) {
					channel.currentNote = 0;
				}

				this.playNote(channel);
			}
			
			channel.nextNoteTimer--;		
		};
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
		
		this.channels.SINE.nextNoteTimer = 
			this.channels.SINE.track[1].duration * 50;

		this.channels.NOISE.nextNoteTimer = 
			this.channels.NOISE.track[1].duration * 50;


		this.FRAME_SCALE = this.FPS / this.BPS;		
		this.CLOCK_SCALE = 1000 / this.BPS;
	}
}
