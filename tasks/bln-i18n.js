'use strict';

var _ = require('lodash');
var l20n = require('l20n');

module.exports = function(grunt) {
	grunt.registerMultiTask('i18n-extract-keys', function () {
		var options = this.options({
			keyRegexp: /\b_t\s*\(\s*'(\w+)'([^)]*)?\)/g
		});
		_.each(this.files, function (file) {
			var keys = [];
			_.each(file.src, function (file) {
				if (!grunt.file.exists(file)) {
					grunt.fail.warn('Could not open source file ' + file);
				}
				var contents = grunt.file.read(file, {encoding: 'utf-8'});
				var matches = options.keyRegexp;
				var match;
				while ((match = matches.exec(contents)) !== null) {
					var key = match[1];
					keys.push(key);
				}
			});
			keys = _.chain(keys).uniq().sort().value();
			if (keys.length) {
				grunt.file.write(file.dest, '[\n\t"' + keys.join('",\n\t"') + '"\n]\n');
			}
			else {
				grunt.file.write(file.dest, '[]\n');
			}
			grunt.log.writeln(keys.length + ' translation keys extracted to ' + file.dest + '.');
		});
	});
	
	grunt.registerMultiTask('i18n-check-keys', function () {
		var options = this.options({
			keys: 'keys.json'
		});
		if (!grunt.file.exists(options.keys)) {
			grunt.fail.fatal('Could not open keys file ' + options.keys);
		}
		var keys = grunt.file.readJSON(options.keys);
		var parser = new l20n.Parser();
		parser.addEventListener('error', function (e) {
			grunt.fail.fatal('Error while parsing translation file: ' + e);
		});
		var compiler = new l20n.Compiler();
		compiler.addEventListener('error', function (e) {
			grunt.fail.fatal('Error while compiling translation entries: ' + e);
		});
		_.each(keys, function (key) {
			if (key[0] == '_') {
				grunt.log.errorlns('Key <' + key + '> should not start with an underscore!');
			}
		});
		_.each(this.filesSrc, function (file) {
			grunt.log.writeln('Checking file ' + file + '...');
			var contents = grunt.file.read(file, {encoding: 'utf-8'});
			var ast = parser.parse(contents);
			var entities = compiler.compile(ast);
			_.each(keys, function (key) {
				if (!_.has(entities, key)) {
					grunt.log.errorlns('Key <' + key + '> not found in translations!');
				}
			});
		});
		if (this.errorCount) {
			grunt.fail.fatal('Missing or invalid keys encountered.');
		}
	});
};
