'use strict';

var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;
var lib = require('../tasks/bln-i18n.js');
var sinon = require('sinon');

chai.use(require('sinon-chai'));

describe('bln-i18n', function () {
	var extract, check;
	var grunt = {
		registerMultiTask: function (key, runner) {
			if (key == 'i18n-extract-keys') {
				extract = runner;
			}
			else if (key == 'i18n-check-keys') {
				check = runner;
			}
		}
	};
	lib(grunt);
	
	describe('i18n-extract-keys', function () {
		var context;
		
		beforeEach(function () {
			grunt.file = {
				exists: sinon.spy(_.constant(true)),
				write: sinon.spy()
			};
			grunt.log = { writeln: _.noop };
			context = {
				files: [{ src: ['aa', 'bb'], dest: 'dd' }],
				options: _.constant({ keyRegexp: /_t\(([^)]+)\)/g })
			};
		});
		
		it('should read all source files', function () {
			grunt.file.read = sinon.spy();
			extract.call(context);
			expect(grunt.file.read).to.have.been.calledWith('aa');
			expect(grunt.file.read).to.have.been.calledWith('bb');
		});
		
		it('should write empty JSON array if no keys found', function () {
			grunt.file.read = sinon.spy(_.constant('dummy content'));
			extract.call(context);
			expect(grunt.file.write).to.have.been.calledWithExactly('dd', '[]\n');
		});
		
		it('should write correct JSON keys array if keys found', function () {
			grunt.file.read = sinon.spy(_.constant('dummy _t(context) _t(zz)\nsome _t(more) _t(zz)\n'));
			extract.call(context);
			expect(grunt.file.write).to.have.been.calledWithExactly('dd', '[\n\t"context",\n\t"more",\n\t"zz"\n]\n');
		});
	});
	
	describe('i18n-check-keys', function () {
		var context;
		
		beforeEach(function () {
			grunt.file = {
				exists: sinon.spy(_.constant(true)),
				read: sinon.spy(_.constant('<zz "zz">')),
				readJSON: sinon.spy(_.constant('[]'))
			};
			grunt.log = {
				writeln: _.noop,
				errorlns: sinon.spy()
			};
			context = {
				filesSrc: ['aa', 'bb'],
				options: _.constant({ keys: 'keys.json' })
			};
		});
		
		it('should read all source files', function () {
			check.call(context);
			expect(grunt.file.read).to.have.been.calledWith('aa');
			expect(grunt.file.read).to.have.been.calledWith('bb');
		});
		
		it('should read the keys JSON file', function () {
			check.call(context);
			expect(grunt.file.readJSON).to.have.been.calledWith('keys.json');
		});
		
		it('should detect keys starting with underscore', function () {
			grunt.file.read = sinon.spy(_.constant('<zz "zz">\n<_zz "zz">'));
			grunt.file.readJSON = sinon.spy(_.constant(['zz', '_zz']));
			check.call(context);
			expect(grunt.log.errorlns).to.have.been.calledWith('Key <_zz> should not start with an underscore!');
		});
		
		it('should detect missing keys', function () {
			grunt.file.readJSON = sinon.spy(_.constant(['aa', 'zz']));
			check.call(context);
			expect(grunt.log.errorlns).to.have.been.calledWith('Key <aa> not found in translations!');
		});
	});
});
