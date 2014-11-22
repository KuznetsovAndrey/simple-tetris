define(['config', 'pixi', './bounds'], function(config, PIXI, bounds) {
	/**
	 * Block class
	 * @param position - array [x, y]
	 * @param matrix - shape of the block
	 * @param background - image of the block
	 * @constructor
	 */
	function Block(position, matrix, background) {
		this.matrix = matrix;
		this.background = background || config.tile.defaultTexture;
		this.position = position;

		// field rotate - it is important to know current block rotation
		// for getting coordinates after rotation
		this.fRotate = 0;
		this.sprites = [];
		this.isMoving = true;

		this.init = function() {
			this.texture = new PIXI.Texture.fromImage(this.background);
		};

		this.getSprites = function() {
			var result = [];
			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					if (!this.sprites[i]) this.sprites[i] = [];
					var tile;

					if (this.matrix[i][j] === 0) {
						tile = null;
					}
					else {
						tile = new PIXI.Sprite(new PIXI.Texture.fromImage(this.background));

						tile.position.x = (this.position[0] + j) * config.tile.size.width;
						tile.position.y = (this.position[1] + i) * config.tile.size.height;
						result.push(tile);
					}

					this.sprites[i][j] = tile;
				}
			}

			return result;
		};

		this.rotate = function() {
			this.fRotate = ++this.fRotate % 4;

			// first of all, we should find the middle of the current block state
			// we will use it later, when we will change block coordinates
			// and there is only one side important - longest
			// I played some tetris realizations and this method is more similar to tetris gameplay
			var blockMedian = Math.max(Math.floor(this.matrix[0].length / 2) - 1, Math.floor(this.matrix.length / 2) - 1);

			this.matrix = rotateMatrix(this.matrix);

			// if we cannot place block on stage after rotate we need to undo our rotation
			if (!bounds.canBlockMove(this, [0, 0])) {
				this.matrix = rotateMatrix(this.matrix, true);
				return;
			}
			this.sprites = rotateMatrix(this.sprites);

			// change coordinates
			// they should indicate top left corner of the figure
			if (this.fRotate % 2 === 0) {
				this.position = [this.position[0] - blockMedian, this.position[1] + blockMedian];
			}
			else {
				this.position = [this.position[0] + blockMedian, this.position[1] - blockMedian];
			}

			bounds.getBlockCoordinatesAfterRotate(this);

			this.redraw();
		};

		this.move = function(xOffset, yOffset) {
			if (!this.isMoving) return;

			this.position = [this.position[0] + xOffset, this.position[1] + yOffset];

			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					if (!this.sprites[i][j]) continue;
					this.sprites[i][j].position.x = (this.position[0] + j) * config.tile.size.width;
					this.sprites[i][j].position.y = (this.position[1] + i) * config.tile.size.height;
				}
			}
		};

		this.redraw = function() {
			// if we need to refresh tiles we can use this trick:
			// move function with zero directions will not move the block
			// but will refresh all block sprites
			this.move(0, 0);
		};

		this.freeze = function() {
			for (var i = 0; i < this.matrix.length; i++) {
				for (var j = 0; j < this.matrix[i].length; j++) {
					if (this.matrix[i][j] === 0) continue;

					// state 0 - is empty cell
					// state 1 - block cell
					// state -1 - freezed block cell
					this.matrix[i][j] = -1;
				}
			}

			this.isMoving = false;
		};

		this.draw = function(stage) {
			for (var i = 0; i < this.sprites.length; i++) {
				stage.addChild(this.sprites[i]);
			}
		};

		this.size = function() {
			var size = {
				width: this.matrix[0].length,
				height: this.matrix.length
			};
			return size;
		};

		// this function will transform this
		// [0, 0, 0, 0]
		// to this
		// [0]
		// [0]
		// [0]
		// [0]
		// by default - anticlockwise, but if second parameter is true function will turn array clockwise
		function rotateMatrix(matrix, clockwise) {
			var height = matrix.length,
				width = matrix[0].length,
				i, j,
				result = [];

			for (i = 0; i < width; i++) {
				for (j = 0; j < height; j++) {
					if (!result[i]) result[i] = [];
					result[i][j] = 0;
				}
			}

			if (clockwise) {
				for (i = width - 1; i >= 0; i--) {
					for (j = 0; j < height; j++) {
						result[width - i - 1][j] = matrix[j][i];
					}
				}
			}
			else {
				for (i = 0; i < width; i++) {
					for (j = 0; j < height; j++) {
						result[width - i - 1][j] = matrix[j][i];
					}
				}
			}

			return result
		}
	}


	return Block;
});