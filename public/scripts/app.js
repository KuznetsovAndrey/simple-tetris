/**
 * Tetris application
 * Created by Andrey Kuznetsov, tiqurillo@gmail.com
 * Used: requirejs and PIXI
 */

requirejs.config({
	paths: {
		config: 'config/params',
		pixi: 'lib/pixi'
	}
});

require(['engine/field', 'engine/ticker', 'engine/control', 'engine/generator'],
	function(field, ticker, control, generator) {
		ticker.start();
		control.setKeyboardListeners();
		field.appendBlock(generator.next());
	}
);