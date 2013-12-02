[![Build Status](https://secure.travis-ci.org/joelpurra/bespoke-secondary.png?branch=master)](https://travis-ci.org/joelpurra/bespoke-secondary)

# bespoke-secondary

Show slide notes in a secondary window/screen with [Bespoke.js][bespoke.js]

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/joelpurra/bespoke-secondary/master/dist/bespoke-secondary.min.js
[max]: https://raw.github.com/joelpurra/bespoke-secondary/master/dist/bespoke-secondary.js

## Usage

When you've followed the instructions below, load your presentation and hit the <kbd>S</kbd> key on your keyboard to toggle the secondary window. Move it to a secondary screen, and you're set!

### Scripts

First, include `bespoke.js`, `bespoke-convenient.js`, `bespoke-indexfinger.js` and `bespoke-jumpy.js` in your page.

Then, simply include the plugin when instantiating your presentation.

```js
bespoke.horizontal.from('article', {
  secondary: true
});
```

### HTML

In your presentation, add some notes:

```html
<article>
  <section>
    <h2>Slide 1</h2>
    <!-- Put your notes inside of each slide, in an <aside> tag -->
    <aside>
      <h2>I must remember to mention this, and then that.</h2>
    </aside>
  </section>
  <section>
    <h2>Slide 2</h2>
    <aside>
      <h2>There's also a corner case I must tell everyone about.</h2>
    </aside>
  </section>
</article>
```

### You probably want to hide your notes in your actual slides.

```css
.bespoke-slide aside {
    display: none;
}
```

## Configuration

```js
bespoke.horizontal.from('article', {
  secondary: {
      // Change the selector used to find notes, in a .bespoke-slide context
      notes: ".my-notes",
      keys: {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Virtual_key_codes
        // Change the key used to toggle the secondary window
        toggle: 0x54, // (84) "T" key.
      }
    }
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
require('bespoke-convenient');
require('bespoke-indexfinger');
require('bespoke-secondary');
```


## TODO

- Move the HTML for the secondary window to a separate file, and load it when needed, or a separate tag/element within the presentation.
- Add some styling to the secondary window.
- Make the presentation controllable (next, previous) from the secondary window.

## See also

You should check out [bespoke-remote prototype](https://github.com/markdalgleish/bespoke-remote-prototype), by [Mark Dalgleish][markdalgleish], who created [Bespoke.js][bespoke.js]. It also has support for notes, and an unlimited number of screens - but it requires server side software for synchronization.

The notes from bespoke-secondary should be compatible with bespoke-remote prototype, so go ahead!


## Credits

[Mark Dalgleish][markdalgleish] for [Bespoke.js][bespoke.js] and related tools. This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

Brooklyn Museum, [brooklyn_museum on flickr](https://secure.flickr.com/photos/brooklyn_museum/), for their photo [really good idea for wikipedia loves art](https://secure.flickr.com/photos/brooklyn_museum/3264857348/) ([CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)).

My bestest friends, [bespoke-convenient](https://github.com/joelpurra/bespoke-convenient) and [bespoke-indexfinger](https://github.com/joelpurra/bespoke-indexfinger), for their continued support - rain and shine. I love you, guys.


## License

Copyright (c) 2013, [Joel Purra](http://joelpurra.com/) All rights reserved.

When using bespoke-secondary, comply to the [MIT license](http://joelpurra.mit-license.org/2013). Please see the LICENSE file for details, and the [MIT License on Wikipedia](http://en.wikipedia.org/wiki/MIT_License).

[bespoke.js]: https://github.com/markdalgleish/bespoke.js
[markdalgleish]: http://markdalgleish.com/


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/joelpurra/bespoke-secondary/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

