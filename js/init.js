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

	$on($leftBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.LEFT, true);
	});
	$on($leftBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.LEFT, false);
	});

	$on($rightBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.RIGHT, true);
	});
	$on($rightBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.RIGHT, false);
	});

	$on($rotateBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.UP, true);
	});
	$on($rotateBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.UP, false);
	});

	$on($dropBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.DOWN, true);
	});
	$on($dropBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.DOWN, false);
	});

	$on($hardDropBtn, "touchstart", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.SPACE, true);
	});
	$on($hardDropBtn, "touchend", function(e) {
		e.preventDefault();
		Tetris.setKeyDown(Tetris.Keys.SPACE, false);
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
	$addClass($('startScreen'), 'hide');

	window.requestAnimationFrame(updateGame);
}
window.onload = function() {
	addGameEventListeners();
}
