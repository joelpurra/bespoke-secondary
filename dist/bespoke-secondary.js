/*!
 * bespoke-secondary v1.0.1
 *
 * Copyright 2021, Joel Purra
 * This content is released under the MIT license
 * https://joelpurra.mit-license.org/2013-2014
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var o=n;o=o.bespoke||(o.bespoke={}),o=o.plugins||(o.plugins={}),o.secondary=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*global module:true, require:true, window:true, document:true, Math:true */

"use strict";

var pluginName = "secondary",
    // Hack to get around having to write all browser code with require().
    browserGlobal = (function(f) {
        return f("return this")();
    }(Function)),
    convenient = ((browserGlobal.bespoke && browserGlobal.bespoke.plugins && browserGlobal.bespoke.plugins.convenient) || _dereq_("bespoke-convenient")),
    cv = convenient.builder(pluginName),

    // Making sure indexfinger is available.
    // TODO: check that indexfinger has been loaded; maybe checking for deck.getActiveSlide().
    indexfinger = ((browserGlobal.bespoke && browserGlobal.bespoke.plugins && browserGlobal.bespoke.plugins.indexfinger) || _dereq_("bespoke-indexfinger")),

    KeyConstants = {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Virtual_key_codes
        S: 0x53, // (83) "S" key.
    },

    defaults = {
        notes: "aside",
        keys: {
            toggle: KeyConstants.S
        }
    },

    randomInteger = function(from, to) {
        // TODO: look for someone else's implementation - they've probably covered all the corner cases.
        // This should do for 0 <= from < to < (random's resolution) though.
        var diff,
            rnd;

        if (to === undefined) {
            to = from;
            from = 0;
        }

        diff = to - from;

        rnd = from + Math.floor(Math.random() * diff);

        return rnd;
    },

    baseWindowName = pluginName + "-window-",

    generateWindowName = function() {
        var rnd = randomInteger(1000, 10000),
            windowName = baseWindowName + rnd;

        return windowName;
    },

    initializeSecondaryWindowContents = function(doc) {
        doc.body.innerHTML = "<h1>Notes</h1><div id='notes'></div>";
    },

    plugin = function(options) {
        var decker = function(deck) {
            var cvBoundToDeck = cv.activateDeck(deck),

                off = {},

                unboundSecondaryDeckMethods = {
                    // Plugin functions expect to be executed in a deck context
                    getNotesElement: function() {
                        return this.secondary.window && this.secondary.window.document && this.secondary.window.document.getElementById("notes");
                    },

                    isOpen: function() {
                        var s = this.secondary,
                            w = s.window,
                            // isInitialized, isNotNull, isNotClosed, isOwnedByThisWindow, containsNotesElement
                            result = !!(s !== undefined && w !== null && w.closed !== true && w.opener === window && this.secondary.getNotesElement() !== null);

                        return result;
                    },

                    open: function() {
                        if (!this.secondary.isOpen()) {
                            this.secondary.window = window.open();
                            initializeSecondaryWindowContents(this.secondary.window.document);
                        }

                        return this.secondary.isOpen();
                    },

                    close: function() {
                        if (this.secondary.isOpen()) {
                            this.secondary.window.close();
                        }

                        return !this.secondary.isOpen();
                    },

                    focus: function() {
                        if (this.secondary.isOpen()) {
                            this.secondary.window.focus();
                        }

                        return this.secondary.isOpen();
                    },

                    toggle: function() {
                        if (this.secondary.isOpen()) {
                            this.secondary.close();
                        } else {
                            this.secondary.open();
                        }

                        return this.secondary.isOpen();
                    },

                    synchronize: function() {
                        var element,
                            slide,
                            slideNotes,
                            allNotes;

                        if (!this.secondary.isOpen()) {
                            return false;
                        }

                        element = this.secondary.getNotesElement();
                        slide = this.getActiveSlide();

                        slideNotes = convenient.copyArray(slide.querySelectorAll(options.notes));

                        allNotes = slideNotes.reduce(function(notesHtml, slideNote) {
                            return notesHtml + slideNote.outerHTML;
                        }, "");

                        element.innerHTML = allNotes;

                        return this.secondary.isOpen();
                    }
                },

                registerDeckExtensions = function() {
                    deck.secondary = {
                        window: null,
                        secondaryWindowName: generateWindowName(),
                        getNotesElement: unboundSecondaryDeckMethods.getNotesElement.bind(deck),
                        isOpen: unboundSecondaryDeckMethods.isOpen.bind(deck),
                        open: unboundSecondaryDeckMethods.open.bind(deck),
                        close: unboundSecondaryDeckMethods.close.bind(deck),
                        focus: unboundSecondaryDeckMethods.focus.bind(deck),
                        toggle: unboundSecondaryDeckMethods.toggle.bind(deck),
                        synchronize: unboundSecondaryDeckMethods.synchronize.bind(deck)
                    };
                },

                initOptions = function() {
                    // TODO: merge function?
                    // Only merge known options
                    var merged = {};

                    options = options || {};

                    merged.keys = {};
                    merged.keys.toggle = (options.keys && options.keys.toggle) || defaults.keys.toggle;

                    merged.notes = options.notes || defaults.notes;

                    options = merged;
                },

                keyDownListener = function(e) {
                    var eventHandled = false;

                    // No modifier keys, please
                    if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        eventHandled = eventHandled || (e.which === options.keys.toggle && cvBoundToDeck.fire("toggle", e) && deck.secondary.toggle() && deck.secondary.synchronize());
                    }

                    if (eventHandled) {
                        e.preventDefault();
                    }

                    return !eventHandled;
                },

                onBeforeUnload = function() {
                    deck.secondary.close();

                    return null;
                },

                onActivate = function() {
                    deck.secondary.synchronize();
                },

                enable = function() {
                    // window.addEventListener doesn't seem to work for onbeforeunload
                    window.onbeforeunload = onBeforeUnload;

                    document.addEventListener("keydown", keyDownListener, false);
                    off.activate = deck.on("activate", onActivate);
                },

                init = function() {
                    initOptions();
                    registerDeckExtensions();
                    enable();
                };

            init();
        };

        return decker;
    };

module.exports = plugin;

},{"bespoke-indexfinger":2}],2:[function(_dereq_,module,exports){
/*global module:true, require:true */

"use strict";

var pluginName = "indexfinger",
    // Hack to get around having to write all browser code with require().
    browserGlobal = (function(f) {
        return f("return this")();
    }(Function)),
    convenient = ((browserGlobal.bespoke && browserGlobal.bespoke.plugins && browserGlobal.bespoke.plugins.convenient) || _dereq_("bespoke-convenient")),
    cv = convenient.builder(pluginName),

    plugin = function(options) {
        var decker = function(deck) {
            var cvBoundToDeck = cv.activateDeck(deck),

                off = {},

                activeSlide = null,

                activeSlideIndex = -1,

                unboundActiveSlideDeckMethods = {
                    // Plugin functions expect to be executed in a deck context
                    enableActiveSlideListener: function() {
                        off.saveActiveSlide = this.on("activate", unboundActiveSlideDeckMethods.saveActiveSlide.bind(this));
                    },

                    saveActiveSlide: function(e) {
                        activeSlide = e.slide;
                        activeSlideIndex = e.index;
                    },

                    getActiveSlide: function() {
                        return activeSlide;
                    },

                    getActiveSlideIndex: function() {
                        return activeSlideIndex;
                    }
                },

                registerDeckExtensions = function() {
                    deck.getActiveSlide = unboundActiveSlideDeckMethods.getActiveSlide.bind(deck);
                    deck.getActiveSlideIndex = unboundActiveSlideDeckMethods.getActiveSlideIndex.bind(deck);
                },

                enable = function() {
                    unboundActiveSlideDeckMethods.enableActiveSlideListener.call(deck);
                },

                init = function() {
                    registerDeckExtensions();
                    enable();
                };

            init();
        };

        return decker;
    };

module.exports = plugin;

},{}]},{},[1])
(1)
});