define(['config', 'pixi'], function(config, PIXI) {
	/**
	 * Tile class
	 * @param position - array [x, y]
	 * @constructor
	 */
	var Tile = function(position) {
		var instance = this;

		// 0 - empty
		// 1 - block
		// -1 - static block
		instance.state = 0;
		instance.size = config.tile.size;

		// tile position, not in pixels
		instance.position = position;
		instance.setState = setState;
		instance.setPosition = setPosition;
		instance.redraw = redraw;
		instance.getSprite = getSprite;

		var texture = new PIXI.Texture.fromImage(config.tile.defaultTexture);
		var sprite = new PIXI.Sprite(texture);

		sprite.position.x = instance.size.width * instance.position[0];
		sprite.position.y = instance.size.height * instance.position[1];

		function setState(state) {
			instance.state = state;
		}

		function setPosition(position) {
			instance.position = position;
		}

		function redraw(image) {
			texture = new PIXI.Texture.fromImage(image);
			sprite.setTexture(texture);
		}

		function getSprite() {
			return sprite;
		}
	};

	return Tile;
});