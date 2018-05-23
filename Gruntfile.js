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
			},
			test: {
				options: {
					globals: {
						describe: true,
						it: true,
						beforeEach: true,
						afterEach: true
					}
				},
				files: {
					src: ['test/**/*.js']
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
					'test/**/*.js',
					'*.js',
					'*.json',
					'!package.json',
					'!package-lock.json'
				]
			}
		},
		mochaTest: {
			test: {
				src: ['test/**/*.js']
			}
		},
		exec: {
			install: 'npm install'
		}
	});
	
	grunt.registerTask('hint', ['jshint', 'lintspaces']);
	grunt.registerTask('test', ['hint', 'mochaTest']);
	grunt.registerTask('default', ['test']);
};
