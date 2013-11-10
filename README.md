[![Build Status](https://secure.travis-ci.org/joelpurra/bespoke-secondary.png?branch=master)](https://travis-ci.org/joelpurra/bespoke-secondary)

# bespoke-secondary

Show slide notes in a secondary window/screen with [Bespoke.js](http://markdalgleish.com/projects/bespoke.js)

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/joelpurra/bespoke-secondary/master/dist/bespoke-secondary.min.js
[max]: https://raw.github.com/joelpurra/bespoke-secondary/master/dist/bespoke-secondary.js

## Usage

First, include both `bespoke.js` and `bespoke-secondary.js` in your page.

Then, simply include the plugin when instantiating your presentation.

```js
bespoke.horizontal.from('article', {
  secondary: true
});
```

## Package managers

### Bower

```bash
$ bower install bespoke-secondary
```

### npm

```bash
$ npm install bespoke-secondary
```

The bespoke-secondary npm package is designed for use with [browserify](http://browserify.org/), e.g.

```js
require('bespoke');
require('bespoke-secondary');
```

## Credits

This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
