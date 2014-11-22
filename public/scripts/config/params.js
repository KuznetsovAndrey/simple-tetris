define(function() {
	/**
	 * App config
	 */
	var parameters = {
		tile: {
			// size in pixels
			size: {
				width: 16,
				height: 16
			},
			defaultTexture: 'resources/img/background.png'
		},
		// size in tiles
		field: {
			size: {
				width: 8,
				height: 16
			}
		},
		blocks: {
			i: {
				background: 'resources/img/block_cyan.png',
				matrix: [
					[1, 1, 1, 1]
				]
			},
			t: {
				background: 'resources/img/block_purple.png',
				matrix: [
					[0, 1, 0],
					[1, 1, 1]
				]
			},
			j: {
				background: 'resources/img/block_blue.png',
				matrix: [
					[1, 0, 0],
					[1, 1, 1]
				]
			},
			l: {
				background: 'resources/img/block_orange.png',
				matrix: [
					[0, 0, 1],
					[1, 1, 1]
				]
			},
			o: {
				background: 'resources/img/block_yellow.png',
				matrix: [
					[1, 1],
					[1, 1]
				]
			},
			s: {
				background: 'resources/img/block_green.png',
				matrix: [
					[0, 1, 1],
					[1, 1, 0]
				]
			},
			z: {
				background: 'resources/img/block_red.png',
				matrix: [
					[1, 1, 0],
					[0, 1, 1]
				]
			}
		},
		frequency: {
			default: 1000
		}
	};

	return parameters;
});