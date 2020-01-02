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
		console.log(`${delay} ${frequency}`);

		oscillator.oscillator.frequency.setValueAtTime(
			frequency,
			oscillator.ctx.currentTime + delay
		);
		oscillator.gain.gain.setValueAtTime(
			volume,
			oscillator.ctx.currentTime + delay - attack 
		);
		oscillator.gain.gain.setValueAtTime(
			volume,
			oscillator.ctx.currentTime + delay + duration + attack 
		); 
		oscillator.gain.gain.linearRampToValueAtTime(
			0,
			oscillator.ctx.currentTime + delay + duration - attack - decay 
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
