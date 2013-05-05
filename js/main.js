/**
 * @author:
 * @date:
 */

require([
	'jquery',
	'loader'
], function ($, L) {
	'use strict';

	var loadContent = function () {
		var loadAction = 'index';

		if (location.hash) {
			if (location.hash.match(/^#\//)) {
				loadAction = location.hash.replace(/^#\//, '');
			}
		}

		L.load(loadAction);
	};

	$(window).on('load hashchange', loadContent);
});
