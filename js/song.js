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
			pitch: 'B4',
			duration: 2
		}],
		"E": [{
			pitch: 'C4',
			duration: 2
		},{
			pitch: 'A4',
			duration: 2
		},{
			pitch: 'GS3',
			duration: 2
		},{
			pitch: 'B4',
			duration: 2,
		}],
		"F": [{
			pitch: 'C4',
			duration: 1
		},{
			pitch: 'E4',
			duration: 1
		},{
			pitch: 'A5',
			duration: 1
		},{
			pitch: 'A5',
			duration: 1
		},{
			pitch: 'GS4',
			duration: 4
		}]
		};
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

	getTracks() {
		return {
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
		}
	}
};
