(function () {
	'use strict';

	define(function () {
		var _$main = $('.main');
		var pathPrefix = 'content/';
		var fileSuffix = '.html';

		var _load = function (what) {

			// Delete all content from main element
			_$main.empty();

			$
				.get(pathPrefix + what + fileSuffix, function (data) {
					_$main.append(data);
				}, 'html')

				.fail(function () {
					if (what !== '404') {
						_load('404');
					}
				});
		};

		return {
			load: _load
		};
	});
}());
