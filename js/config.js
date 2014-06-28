/**
 * RequireJS configuration
 */
require.config({

	// Initialize the application with the main application file and the
	// console-stub from HTML5 Boilerplate
	deps: ['plugins/console', 'jquery', 'main'],

	paths: {
		'jquery': '../components/jquery/dist/jquery.min',
		'bacon': '../components/bacon/dist/Bacon.min',
		'player': '../components/wdPlayer/wdPlayer',
		'timejump': '../components/TimeJump/timeJump'
	},

	shim: {
		// If you need to shim anything
	}

});
