define(['config'], function(config) {
	/**
	 * Ticker is the clocks of the app.
	 * It has global timer and array of listeners.
	 * Every item in this array will call on every timer tick
	 */
	var Ticker = (function() {
		var frequency = config.frequency.default,
			callbacks = [],
			fPause = false,
			boosted = false,
			timerId = null;

		var ticker = {
			register: register,
			start: start,
			unbind: unbind,
			setFrequency: setFrequency,
			dropFrequency: dropFrequency,
			pause: pause,
			boost: boost
		};

		return ticker;

		// starts the ticker
		function start() {
			timerId = setInterval(function() {
				tick();
			}, frequency);
		}

		function setFrequency(fr) {
			frequency = fr;
		}

		function dropFrequency() {
			boosted = false;
			frequency = config.frequency.default;

			clearInterval(timerId);
			start();
		}

		function tick() {
			if (fPause) return;

			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i]();
			}
		}

		function boost() {
			// to avoid infinity boost
			if (boosted) return;

			boosted = true;
			frequency = frequency / 10;
			clearInterval(timerId);
			start();
		}

		function register(cb) {
			// returns index of callback
			// it will help us to delete this listener
			return callbacks.push(cb) - 1;
		}

		function unbind(id) {
			callbacks.splice(id, 1);
		}

		function pause() {
			fPause = !fPause;
		}
	})();

	return Ticker;
});