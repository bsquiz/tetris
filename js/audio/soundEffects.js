const TetrisSoundEffects = {
        playOscillator(oscillator, freq = 100, duration = 0.1, vol = 0.1) {
                BAudio.playOscillator(oscillator, freq, duration, vol);
        },

	playRotateSound() {
		this.playOscillator(this.sineWave, 0, 500);
	},
	
	playMoveSound() {
		this.playOscillator(this.sineWave, 0, 400, 0.05);
	},

	playDropSound() {
		this.playOscillator(this.sineWave, 0, 1000, 0.025);
	},
	
	playClearSound() {
		const duration = 0.1;

		this.playOscillator(this.sineWave, 0, 400, duration);
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
