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
