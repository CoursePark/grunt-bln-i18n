'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				bitwise: true,
				curly: true,
				forin: true,
				latedef: true,
				newcap: true,
				noarg: true,
				nonew: true,
				undef: true,
				unused: true,
				strict: true,
				trailing: true,
				quotmark: 'single',
				smarttabs: true,
				node: true
			},
			src: {
				files: {
					src: ['Gruntfile.js', 'tasks/**/*.js']
				}
			}
		},
		lintspaces: {
			options: {
				editorconfig: '.editorconfig',
				ignores: [
					'js-comments'
				]
			},
			js: {
				src: [
					'tasks/**/*.js',
					'*.js',
					'*.json'
				]
			}
		},
		exec: {
			install: 'npm install'
		}
	});
	
	grunt.registerTask('setup', ['exec:install']);
	grunt.registerTask('hint', ['setup', 'jshint', 'lintspaces']);
	grunt.registerTask('default', ['hint']);
};
