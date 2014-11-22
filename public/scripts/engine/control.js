define(['require', './field'], function(require, field) {
	/**
	 * Control is watching for key press
	 */
	var Control = (function() {
		var keyCodes = {
			37: 'LEFT',
			38: 'UP',
			39: 'RIGHT',
			40: 'DOWN'
		};

		var keyDownActions = {
			UP: function() {
				if (field.getCurrentBlock())
					field.rotateCurrentBlock();
			},
			LEFT: function() {
				field.replaceCurrentBlock([-1, 0]);
			},
			RIGHT: function() {
				field.replaceCurrentBlock([1, 0]);
			},
			DOWN: function() {
				require('./ticker').boost();
			}
		};

		var keyUpActions = {
			DOWN: function() {
				require('./ticker').dropFrequency();
			}
		};

		var control = {
			setKeyboardListeners: setKeyboardListeners
		};

		return control;

		function setKeyboardListeners() {
			document.onkeydown = function(e) {
				if (keyCodes[e.keyCode]) e.preventDefault();
				else return;

				keyDownActions[keyCodes[e.keyCode]]();
			};

			document.onkeyup = function(e) {
				if (keyCodes[e.keyCode]) e.preventDefault();
				else return;

				if (keyUpActions[keyCodes[e.keyCode]])
					keyUpActions[keyCodes[e.keyCode]]();
			};
		}
	})();

	return Control;
});