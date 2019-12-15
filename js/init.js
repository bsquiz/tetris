function updateGame() {
	Tetris.update();

	window.requestAnimationFrame(updateGame);
}

function $on($el, event, callback) {
	$el.addEventListener(event, callback);
}

function addGameEventListeners() {
	const $leftBtn = document.getElementById('leftBtn');
	const $rightBtn = document.getElementById('rightBtn');

	$on($leftBtn, "mousedown", function(e) {
		Tetris.setKeyDown(Tetris.Keys.LEFT, true);
	});

	$on($leftBtn, "mouseup", function(e) {
		Tetris.setKeyDown(Tetris.Keys.LEFT, false);
	});
	$on($rightBtn, "mousedown", function(e) {
		Tetris.setKeyDown(Tetris.Keys.LEFT, true);
	});
	$rightBtn.addEventListener("mouseup", function(e) {
		Tetris.setKeyDown(Tetris.Keys.LEFT, false);
	});

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

	window.requestAnimationFrame(updateGame);
}
window.onload = function() {
	addGameEventListeners();
	startGame();
}
