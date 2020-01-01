function $(id) {
	return document.getElementById(id);
}
function $addClass($el, cls) {
	if ($el.className.indexOf(cls) === -1) {
		$el.className += ` ${cls}`;
	}
}

function $removeClass($el, cls) {
	$el.className.replace(cls, '');
}

function updateGame() {
	Tetris.update();

	window.requestAnimationFrame(updateGame);
}

function $on($el, event, callback) {
	$el.addEventListener(event, callback);
}
function toggleMusic(e) {
	const $button = e.target;

	if (Tetris.toggleMusic()) {
		$addClass($button, 'disabled');
	} else {
		$removeClass($button, 'disabled');
	}
}

function pauseGame() {
	Tetris.pause();
	$('unpauseButton').style.display = 'block';
	$('pauseButton').style.display = 'none';
}
function unpauseGame() {
	Tetris.start();
	$('unpauseButton').style.display = 'none';
	$('pauseButton').style.display = 'block';
}

function addGameEventListeners() {
	const $leftBtn = $('leftBtn');
	const $rightBtn = $('rightBtn');
	const $rotateBtn = $('rotateBtn');
	const $dropBtn = $('dropBtn');
	const $hardDropBtn = $('hardDropBtn');
	const $musicToggleButton = $('musicToggleButton');

	$on($leftBtn, "mousedown", function(e) {
		Tetris.setKeyDown(Tetris.Keys.LEFT, true);
	});
	$on($leftBtn, "mouseup", function(e) {
		Tetris.setKeyDown(Tetris.Keys.LEFT, false);
	});

	$on($rightBtn, "mousedown", function(e) {
		Tetris.setKeyDown(Tetris.Keys.RIGHT, true);
	});
	$on($rightBtn, "mouseup", function(e) {
		Tetris.setKeyDown(Tetris.Keys.RIGHT, false);
	});

	$on($rotateBtn, "mousedown", function(e) {
		Tetris.setKeyDown(Tetris.Keys.UP, true);
	});
	$on($rotateBtn, "mouseup", function(e) {
		Tetris.setKeyDown(Tetris.Keys.UP, false);
	});

	$on($dropBtn, "mousedown", function(e) {
		Tetris.setKeyDown(Tetris.Keys.DOWN, true);
	});
	$on($dropBtn, "mouseup", function(e) {
		Tetris.setKeyDown(Tetris.Keys.DOWN, false);
	});

	$on($hardDropBtn, "mousedown", function(e) {
		Tetris.setKeyDown(Tetris.Keys.SPACE, true);
	});
	$on($hardDropBtn, "mouseup", function(e) {
		Tetris.setKeyDown(Tetris.Keys.SPACE, false);
	});

	$on($musicToggleButton, "click", toggleMusic);

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
