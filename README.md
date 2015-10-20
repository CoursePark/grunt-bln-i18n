# grunt-bln-i18n

> Utility tasks for BLN i18n support


## Getting Started
Install the plugin with this command:

```shell
npm install grunt-bln-i18n --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bln-i18n');
```

An alternative way is to use a plugin loader like `load-grunt-tasks`.


## i18n-extract-keys task

Extracts translation keys from application source.

Uses standard grunt multi-task configuration.

### Sample configuration

```js
'i18n-extract-keys': {
	options: {
		keyRegexp: /\b_t\s*\(\s*'(\w+)'([^)]*)?\)/g
	},
	all: {
		src: ['app/scripts/**/*.js', 'app/scripts/**/*.html'],
		dest: '.tmp/keys.json'
	}
}
```

#### src
Type: `String|Array`

Application source files. These files are searched for translation function
calls.

#### dest
Type: `String`

The destination JSON files for storing encountered translation keys. The keys
are stored as a sorted array without duplicates. 

#### options.keyRegexp
Type: `RegExp`

Regular expression used to find calls to the translation function. The first
parenthesized substring match is used as the resulting translation key.


## i18n-check-keys task

Checks specified translation file content, with expected translation keys
specified in format matching `i18n-extract-keys` task output.

Translation files checks:

* must be parseable by the [l20n](http://l20n.org) library
* must contain all the expected translation keys

Expected translation key file checks:

* must be in correct format
* must not contain any translation keys starting with an underscore (such keys
  are considered private & internal to each translation file and should not be
  directly used from application code)

Uses standard grunt multi-task configuration without a destination file.

### Sample configuration

```js
'i18n-check-keys': {
	all: {
		options: {
			keys: '.tmp/keys.json'
		},
		src: 'app/locales/*.l20n'
	}
}
```

#### src
Type: `String|Array`

Translation files. These files will be checked for validity and key presence.
Every file will be parsed and compiled using the `l20n` library. If this step
fails the task will be immediately aborted.

Afterwards, the files will be checked to make sure that they contain all the
expected translation keys. Missing keys are will be logged. The task is marked
as failed if any file has any missing keys.

#### options.keys
Type: `String`

A JSON file containing array of keys to search for in translation files.


## Development
We use `grunt` as our task runner so make sure you have it installed globally
for your `node`.

To lint the code and run tests use:

```shell
grunt test
```
