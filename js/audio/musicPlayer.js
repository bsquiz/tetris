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
					0.1,
					0.01,
					0.01
				);

				nextTime += duration;
			}
		}
	}
}
