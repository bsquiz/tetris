const TetrisSoundEffects = {
        playOscillator(oscillator, freq = 100, duration = 100, vol = 0.1) {
                BAudio.playOscillator(oscillator, freq, duration, vol);
        },

	playRotateSound() {
		this.playOscillator(this.sineWave, 500);
	},
	
	playMoveSound() {
		this.playOscillator(this.sineWave, 400, 50);
	},

	playDropSound() {
		this.playOscillator(this.sineWave, 1000, 25);
	},
	
	playClearSound() {
		const duration = 100;

		this.playOscillator(this.sineWave, 400, duration);
		window.setTimeout(() => {
			this.playOscillator(this.sineWave, 500, duration);
			window.setTimeout(() => {
				this.playOscillator(this.sineWave, 1000, duration);
			}, duration);
		}, duration);
	},

	init() {
		this.sineWave = BAudio.createOscillator(BAudio.Oscillators.SINE);
	}
}
