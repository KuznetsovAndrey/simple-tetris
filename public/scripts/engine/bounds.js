define(['require'], function(require) {
	/**
	 * Bounds is the container of the method which helps watch for bounds of the field and another blocks
	 */
	var Bounds = (function() {
		var bounds = {
			canBlockMove: canBlockMove,
			getBlockCoordinatesAfterRotate: getBlockCoordinatesAfterRotate
		};

		return bounds;

		// function watch for field matrix and get answer if we can move block in this direction
		// important - block should not be in field's matrix at the execution time
		function canBlockMove(block, coord) {
			var field = require('./field');

			// watch for moving of every cell in block matrix
			for (var i = 0; i < block.matrix.length; i++) {
				for (var j = 0; j < block.matrix[i].length; j++) {
					if (block.matrix[i][j] === 0) continue;

					// if there is no cell like this
					if (!field.matrix[block.position[1] + i + coord[1]]) {
						return false;
					}
						// or there is something in the cell
						// 0 is empty cell, 1 and -1 - block cell
					if (field.matrix[block.position[1] + i + coord[1]][block.position[0] + j + coord[0]] !== 0) {
						return false;
					}
				}
			}

			return true;
		}

		function getBlockCoordinatesAfterRotate(block) {
			var field = require('./field');

			if (block.position[0] < 0) block.position[0] = 0;
			if (block.position[1] < 0) block.position[1] = 0;

			if (block.position[0] + block.matrix[0].length > field.matrix[0].length)
				block.position[0] = field.matrix[0].length - block.matrix[0].length;

			if (block.position[1] + block.matrix.length > field.matrix.length)
				block.position[1] = field.matrix.length - block.matrix.length;
		}

		return bounds;
	})();

	return Bounds;
})