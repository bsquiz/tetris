<?php
$html = fopen('html/tetrisTemplate.html', 'r+');
$files = array("startScreen.html", "gameArea.html", "modals.html");
$output = fopen('tetris.html', 'w');

while (!feof($html)) {
	$line = fgets($html);
	$parts = explode('{{', $line);
	echo $line;

	if (count($parts) > 1) {
		$parts = explode('}}', $parts[1]);
		$lineContents = trim($parts[0]);

		for($i=0; $i<count($files); $i++) {
			$fileNameParts = explode('.html', $files[$i]);
			$fileName = $fileNameParts[0];
			$newHTMLFile = fopen('html/' . $files[$i], 'r');
			echo 'checking [' .
				$lineContents .
				'] with ['
				. $files[$i] . "]\n";

			if ($fileName == $lineContents) {
				echo 'replacing [' .
				$lineContents .
				'] with ['
				. $files[$i] . "]\n";

				while(!feof($newHTMLFile)) {
					$newHTMLLine = fgets($newHTMLFile);
					fwrite($output, $newHTMLLine);
				}
			}

			fclose($newHTMLFile);
		}
	} else {
		fwrite($output, $line);
	}
}

fflush($output);
fclose($output);

shell_exec('cat css/shapes.css css/startScreen.css css/tetris.css > all.css');
shell_exec('cat js/audio/audio.js js/audio/soundEffects.js js/audio/song.js js/audio/musicPlayer.js js/graphics/graphics.js js/graphics/hud.js js/objects/GameBoard.js js/objects/TetrisPiece.js js/game.js js/animation.js js/init.js > all.js');
?>
