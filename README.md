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

Application source files. These files will be searched for translation function
calls.

#### dest
Type: `String`

The destination JSON files for storing encountered translation keys. Keys will
be stored as a sorted array without duplicates. 

#### options.keyRegexp
Type: `RegExp`

Regular expression used to find calls to the translation function. The first
parenthesized substring match will be used as the resulting translation key.


## i18n-check-keys task

Checks translation files to make sure they are parseable as well as that they
contain all the expected keys.

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
fails the task will be immediately aborted. Afterwards, the file will be
checked to make sure that it contains all translation keys. All missing keys
will be logged. The task is marked as failed if any file has any missing keys.

#### options.keys
Type: `String`

A JSON file containing array of keys to search for in translation files.
