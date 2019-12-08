const TetrisSong = {
	sineWave: null,
	currentMusicNote: 0,
	playing: false,
	nextNoteTimer: 0,
	tempo: 200,

	start() {
		this.playing = true;	
		this.update();
	},
	
	update() {
		if (!this.playing) return;
		if (this.nextNoteTimer > 0) {
			this.nextNoteTimer--;

			return;
		}

		const currentNote = this.songNotes[this.currentMusicNote];
		// covert to fraction of a second
		const duration = currentNote.duration * 1000;

		// convert to framerate time (seconds / framerate)
		this.nextNoteTimer = duration / 60;
		
		this.currentMusicNote++;

		if (this.currentMusicNote > this.songNotes.length - 1) {
			this.currentMusicNote = 0;
		}

		if (currentNote.pitch !== this.Pitches.REST) {
			BAudio.playOscillator(
				this.sineWave,
				currentNote.pitch,
				currentNote.duration * this.tempo 
			);
		}
    },

	init() {	
		this.sineWave = BAudio.createOscillator(BAudio.Oscillators.SINE);

		this.Pitches = {
			C3: 130.813,
			D3: 146.832,
			E3: 164.814,
			F3: 176.614,
			G3: 195.998,
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
		};
		const p = this.Pitches;

		this.songParts = {
			"A": [{
				pitch: p.E5,
				duration: 1
				},{
				pitch: p.B4,
				duration: 0.5
				},{
				pitch: p.C5,
				duration: 0.5
				},{
				pitch: p.D5,
				duration: 1
				},{
				pitch: p.C5,
				duration: 0.5
				},{
				pitch: p.B4,
				duration: 0.5
				},{
				pitch: p.A4,
				duration: 1
				},{
				pitch: p.A4,
				duration: 0.5
				},{
				pitch: p.C5,
				duration: 0.5
				},{
				pitch: p.E5,
				duration: 1
				},{
				pitch: p.D5,
				duration: 0.5
				},{
				pitch: p.C5,
				duration: 0.5
				}
			],
			"B": [{
					pitch: p.B4,
					duration: 1
				},{
					pitch: p.B4,
					duration: 0.5
				},{
					pitch: p.C5,
					duration: 0.5
				},{
					pitch: p.D5,
					duration: 1
				},{
					pitch: p.E5,
					duration: 1
				},{
					pitch: p.C5,
					duration: 1
				},{
					pitch: p.A4,
					duration: 1
				},{
					pitch: p.A4,
					duration: 2
				}
			],
			"C": [{
					pitch: p.REST,
					duration: 0.5
				},{
					pitch: p.D5,
					duration: 1
				},{
					pitch: p.F5,
					duration: 0.5
				},{
					pitch: p.A5,
					duration: 1
				},{
					pitch: p.G5,
					duration: 0.5
				},{
					pitch: p.F5,
					duration: 0.5
				},{
					pitch: p.E5,
					duration: 1.5 
				},{
					pitch: p.C5,
					duration: 0.5
				},{
					pitch: p.E5,
					duration: 1
				},{
					pitch: p.D5,
					duration: 0.5
				},{
					pitch: p.C5,
					duration: 0.5
				}
			]
		};
		this.songNotes = [
			this.songParts.A,
			this.songParts.B,
			this.songParts.C,
			this.songParts.B
		].flat();
	}
}
