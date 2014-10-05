(function () {
	'use strict';

	define(function () {
		var _$main = $('.main');
		var pathPrefix = 'content/';
		var fileSuffix = '.html';

		var _load = function (what, callback) {

			// Delete all content from main element
			_$main.empty();

			$
				// Load requested file
				.get(pathPrefix + what + fileSuffix, function (data) {
					_$main.append(data);

					if (typeof callback === 'function') {
						callback.call(this);
					}
				}, 'html')

				// If load fails
				.fail(function () {
					if (what !== '404') {
						_load('404');
					}
				});
		};

		// Public API
		return {
			load: _load
		};
	});
}());
