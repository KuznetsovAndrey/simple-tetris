define(['config', './tile', 'pixi', './ticker', './bounds', './generator'], function(config, tile, PIXI, ticker, bounds, generator) {
	/**
	 * Field.
	 * Contains method for appending, moving, rotating current block on stage
	 * Watch for active block, disable it
	 * Contains stage and render
	 */
	var Field = (function() {
		var blocks = [],
			tiles = [],
			matrix = [],
			currentBlock = null,
			stage,
			renderer;

		/* --------- init stage --------- */
		stage = new PIXI.Stage(0xFFFFFF);

		renderer = PIXI.autoDetectRenderer(config.tile.size.width * config.field.size.width,
			config.tile.size.height * config.field.size.height);

		document.body.appendChild(renderer.view);
		requestAnimFrame(animate);

		function animate() {
			requestAnimFrame(animate);
			renderer.render(stage);
		}
		/* --------- end of stage init --------- */


		// fill field's matrix with zeros
		// and paint the background
		for (var i = 0; i < config.field.size.height; i++) {
			for (var j = 0; j < config.field.size.width; j++) {
				var mTile = new tile([j, i]);
				tiles.push(mTile);
				stage.addChild(mTile.getSprite());

				if (!matrix[i]) matrix[i] = [];
				matrix[i][j] = 0;
			}
		}

		var field = {
			blocks: blocks,
			appendBlock: appendBlock,
			replaceCurrentBlock: replaceCurrentBlock,
			rotateCurrentBlock: rotateCurrentBlock,
			getCurrentBlock: getCurrentBlock,
			matrix: matrix
		};

		return field;

		function getCurrentBlock() {
			return currentBlock;
		}

		function appendBlock(block) {
			currentBlock = block;

			if (!bounds.canBlockMove(block, [0, 0])) {
				currentBlock = null;
				return;
			}

			checkForFullLines();

			var blockTiles = block.getSprites();
			for (var i = 0; i < blockTiles.length; i++) {
				if (blockTiles[i])
					stage.addChild(blockTiles[i]);
			}

			placeBlockToMatrix(block);

			var blockTickId = null;

			blockTickId = ticker.register(function() {
				// static direction for moving down
				var direction = [0, 1];

				// remove block from field's matrix for the checking function
				removeBlockFromMatrix(block);

				// on tick block can move only forward
				// so if it reached the bottom we can stop it
				if (!bounds.canBlockMove(block, direction)) {
					currentBlock.freeze();
					ticker.unbind(blockTickId);

					// to avoid stack overflow
					// we should call function on next tick
					setTimeout(function() {
						appendBlock(generator.next());
						delete block;
					}, 4);

					currentBlock = null;
				}

				block.move.call(block, direction[0], direction[1]);

				// and after all operations return block matrix to field's matrix
				placeBlockToMatrix(block);
			});
		}

		// insert block's matrix into field's
		function placeBlockToMatrix(block) {
			for (var i = 0; i < block.matrix.length; i++) {
				for (var j = 0; j < block.matrix[i].length; j++) {
					try {
						if (matrix[i + block.position[1]] && matrix[i + block.position[1]][j +  block.position[0]] === 0)
							matrix[i + block.position[1]][j +  block.position[0]] = block.matrix[i][j];
					}
					catch (err) {
						console.log('Error in placeBlockToMatrix', err);
					}
				}
			}
		}

		// remove block's matrix into field's
		function removeBlockFromMatrix(block) {
			for (var i = 0; i < block.matrix.length; i++) {
				for (var j = 0; j < block.matrix[i].length; j++) {
					try {
						if (block.matrix[i][j] <= 0) continue;
						if (matrix[i + block.position[1]][j +  block.position[0]] < 0) continue;
						matrix[i + block.position[1]][j +  block.position[0]] = 0;
					}
					catch (err) {
						console.log('Error in removeBlockFromMatrix', err);
					}
				}
			}
		}

		// we need to remove block from field's matrix
		// then rotate and check bounds
		// and then add it back
		function rotateCurrentBlock() {
			if (!currentBlock) return;

			removeBlockFromMatrix(currentBlock);
			currentBlock.rotate.call(currentBlock);
			placeBlockToMatrix(currentBlock);
		}

		function replaceCurrentBlock(direction) {
			if (!currentBlock) return;

			removeBlockFromMatrix(currentBlock);
			if (bounds.canBlockMove(currentBlock, direction))
				currentBlock.move.call(currentBlock, direction[0], direction[1]);

			placeBlockToMatrix(currentBlock);
		}

		function removeLine(lineIndex) {
			var linePosition = lineIndex * config.tile.size.height,
				i;

			// first of all we should remove sprites which were destroyed
			for (i = stage.children.length - 1; i >= 0; i--) {
				// if this sprite is background we should skip it
				if (stage.children[i].texture.baseTexture.imageUrl == config.tile.defaultTexture) continue;

				// we can calculate the tile position, because we know tile size and sprite coordinates
				var tilePosition = [
					stage.children[i].position.x / config.tile.size.width,
					stage.children[i].position.y / config.tile.size.height
				];

				// if this sprite is on line
				if (stage.children[i].position.y === linePosition) {
					// delete value from matrix
					matrix[tilePosition[1]][tilePosition[0]] = 0;
					// and remove sprite from stage
					stage.removeChild(stage.children[i]);
					continue;
				}

				// also we need to move another sprites which is above destroyed line
				if (stage.children[i].position.y < linePosition && matrix[tilePosition[1]][tilePosition[0]] === -1) {
					stage.children[i].position.y += config.tile.size.height;
				}
			}

			// now we should append all changes to field's matrix
			for (i = lineIndex - 1; i >= 0; i--) {
				for (var j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j] === -1) {
						matrix[i][j] = 0;
						matrix[i + 1][j] = -1;
					}
				}
			}
		}

		function checkForFullLines() {
			var i = matrix.length - 1;
			while (i >= 0) {
				var isFull = true;
				for (var j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j] != -1) isFull = false;
				}

				if (isFull) {
					removeLine(i);
				}
				else {
					i--;
				}
			}
		}
	})();

	return Field;
});