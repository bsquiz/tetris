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
	const $gameCanvas = $('gameCanvas');

	$on($gameCanvas, "touchstart", e => {
		e.preventDefault();

		Tetris.touchControls = true;
		Tetris.touchStartX = e.touches[0].pageX;
		Tetris.touchStartY = e.touches[0].pageY;
		Tetris.touchStartDropY = e.touches[0].pageY;
		Tetris.shouldTouchRotate = true;
		Tetris.setKeyDown(Tetris.Keys.UP, false);
		Tetris.setKeyDown(Tetris.Keys.SPACE, false);
	});
	
	$on($gameCanvas, "touchmove", e => {
		const x = e.touches[0].pageX;
		const y = e.touches[0].pageY;
		const diffX = x - Tetris.touchStartX;
		const diffY = y - Tetris.touchStartY;

		if (Math.abs(diffX) > Tetris.dragThreshold) {
			Tetris.touchStartX = x;

			if (diffX < 0) {
				Tetris.setKeyDown(Tetris.Keys.LEFT, true);	
			} else {
				Tetris.setKeyDown(Tetris.Keys.RIGHT, true);	
			}
			Tetris.shouldTouchRotate = false;
		}

		if (Math.abs(diffY) > Tetris.dragThreshold) {
			Tetris.touchStartY = y;

			if (diffY > 0) {
				Tetris.setKeyDown(Tetris.Keys.DOWN, true);
			}

			Tetris.shouldTouchRotate = false;
		}
	
	});

	$on($gameCanvas, "touchend", e => {
		Tetris.setKeyDown(Tetris.Keys.LEFT, false);
		Tetris.setKeyDown(Tetris.Keys.RIGHT, false);
		Tetris.setKeyDown(Tetris.Keys.DOWN, false);

		/* swipe down check */
		if (
			Math.abs(
				Tetris.touchStartDropY - Tetris.touchStartY
			) > Tetris.dragThreshold * 4
			) {
				Tetris.setKeyDown(Tetris.Keys.SPACE, true);
		}

		if (Tetris.shouldTouchRotate) {
			Tetris.setKeyDown(Tetris.Keys.UP, true);
		}
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
	TetrisSoundEffects.mute();
	document.getElementsByTagName('body')[0].removeChild($('startScreen'));
	$removeClass($('game'), 'hide');

	window.requestAnimationFrame(updateGame);
}
window.onload = function() {
	addGameEventListeners();
}
