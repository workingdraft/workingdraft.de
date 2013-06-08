/**
 * @author:
 * @date:
 */

require([
	'jquery',
	'loader',
	'player'
], function ($, L, player) {
	'use strict';

	// Function that requests soundwaves via wdPlayer
	var drawSoundwaves = function () {
		var soundwaveContainer = document.getElementsByClassName('soundwave');
		if (soundwaveContainer.length > 0) {
			soundwaveContainer = soundwaveContainer[0];

			player({
				sources: {
					'audio/mp3': soundwaveContainer.dataset.fileMp3 || '',
					'audio/ogg': soundwaveContainer.dataset.fileOgg || ''
				},
				timelineStyle: {
					height: 150,
					width: 1100,
					color: '#850051',
					altColor: '#CCC'
				}
			}).appendTo('.soundwave');
		}
	};

	var loadContent = function () {
		var loadAction = 'index';

		if (location.hash) {
			if (location.hash.match(/^#\//)) {
				loadAction = location.hash.replace(/^#\//, '');
			}
		}

		// Load content, callback: do soundwaves
		L.load(loadAction, drawSoundwaves);
	};

	$(window).on('load hashchange', loadContent);
});
