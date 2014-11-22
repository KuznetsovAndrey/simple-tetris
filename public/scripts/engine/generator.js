define(['config', './block'], function(config, block) {
	/**
	 * Generator gets random block's config, create a new block and return it
	 */
	var Generator = (function() {
		var generator = {
			next: next
		};

		return generator;

		function next() {
			// get random block from config
			var ind = Object.keys(config.blocks)[Math.floor(Math.random() * Object.keys(config.blocks).length)],
				// simple trick to copy object without functions
				blockConfig = JSON.parse(JSON.stringify(config.blocks[ind]));

			// we create new block and send not the original matrix but the copy of it
			// this is for avoid changing config matrix
			return new block([
				Math.floor((config.field.size.width - blockConfig.matrix[0].length) / 2),
				0
			], blockConfig.matrix.slice(0), blockConfig.background);
		}
	})();

	return Generator;
});