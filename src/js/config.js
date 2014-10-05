/**
 * RequireJS configuration
 */
require.config({
	deps: ['plugins/console', 'jquery', 'main'],

	paths: {
		'jquery': '../../bower_components/jquery/dist/jquery.min',
		'bacon': '../../bower_components/bacon/dist/Bacon.min',
		'player': '../../bower_components/wdPlayer/wdPlayer',
		'timejump': '../../bower_components/TimeJump/timeJump'
	}
});
