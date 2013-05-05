(function () {
	'use strict';

	define(function () {
		var _$main = $('.main');

		return {
			load: function (what) {

				// Delete all content from main element
				_$main.empty();

				$.get('content/' + what + '.html', function (data) {
					_$main.append(data);
				});
			}
		};
	});
}());
