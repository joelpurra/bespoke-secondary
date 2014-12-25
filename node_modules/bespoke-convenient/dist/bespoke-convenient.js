/*!
 * bespoke-convenient v1.0.0
 *
 * Copyright 2014, Joel Purra
 * This content is released under the MIT license
 * http://joelpurra.mit-license.org/2013-2014
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var o=n;o=o.bespoke||(o.bespoke={}),o=o.plugins||(o.plugins={}),o.convenient=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*global module:true, console:true */

"use strict";

var pluginName = "convenient",
    browserGlobal = (function(f) {
        return f("return this")();
    }(Function)),

    cv,

    // The defaults object is passed as a reference, and can be modified by browserGlobal.convenientInit
    defaults = {
        logger: {
            log: function() {
                // Workaround for phantom-polyfill.js problems binding console.log (window.console.log)
                console.log.apply(console, arguments);
            }
        }
    },

    initOptions = function() {
        var merged = {};

        // Only merge known options
        merged.logger = {};
        merged.logger.log = (browserGlobal.convenientOptions && browserGlobal.convenientOptions.logger && browserGlobal.convenientOptions.logger.log) || defaults.logger.log;

        browserGlobal.convenientOptions = merged;
    },

    plugin = {},

    decksStorages = [],

    isStorageAlreadyInitiatedForDeck = function(deck) {
        if (!deck) {
            throw cv.generateErrorObject("deck must be defined.");
        }

        var deckAlreadyStored = decksStorages.some(function(deckStorage) {
            return deckStorage.deck === deck;
        });

        return deckAlreadyStored;
    },

    storeDeck = function(deck) {
        var deckAlreadyStored = isStorageAlreadyInitiatedForDeck(deck);

        if (!deckAlreadyStored) {
            decksStorages.push({
                deck: deck,
                storage: {}
            });
        }
    },

    isStorageAlreadyInitiatedForDeckAndPlugin = function(pluginName, deck) {
        if (!pluginName) {
            throw cv.generateErrorObject("pluginName must be defined.");
        }

        if (!deck) {
            throw cv.generateErrorObject("deck must be defined.");
        }

        var storage = plugin.getDeckStorage(deck),
            isStorageInitiated = !!(storage && storage[pluginName]);

        return isStorageInitiated;
    },

    initiateDeckPluginStorage = function(pluginName, deck) {
        if (!pluginName) {
            throw cv.generateErrorObject("pluginName must be defined.");
        }

        if (!deck) {
            throw cv.generateErrorObject("deck must be defined.");
        }

        var storage = plugin.getDeckStorage(deck);

        if (!storage) {
            storeDeck(deck);
            storage = plugin.getDeckStorage(deck);
        }

        storage[pluginName] = {};
    },

    isNumber = function(n) {
        // http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
        // From http://stackoverflow.com/a/1830844
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    init = function() {
        initOptions();
    };

// For plugins themselves
plugin.builder = function self(options) {
    if (!options) {
        throw cv.generateErrorObject("The plugin options were not properly defined.");
    }

    if (typeof options === "string") {
        options = {
            pluginName: options
        };
    }

    if (typeof options.pluginName !== "string") {
        throw cv.generateErrorObject("The plugin name was not properly defined.");
    }

    var external = {},

        tag = "bespoke." + options.pluginName,

        generateErrorObject = function(message) {
            return new Error(tag + ": " + message);
        },

        eventNamespace = options.pluginName,

        eventInNamespace = function(eventName) {
            return eventNamespace + "." + eventName;
        },

        // Plugin functions expect to be executed in a deck context
        // Mimicing, and extending,the internal createEventData bespoke uses
        createEventData = function(deck, eventNamespace, eventName, innerEvent, slide, eventData) {
            var result = plugin.createEventData.call(deck, eventNamespace, eventName, innerEvent, slide, eventData);

            return result;
        },

        // TODO: create a second object bound to both this external object and the deck,
        // to avoid passing the deck parameter every time. (Which can be alleviated with simpler function binding though.)
        fire = function(deck, eventName, innerEvent, slide, customData) {
            return deck.fire(eventInNamespace(eventName), createEventData(deck, eventNamespace, eventName, innerEvent, slide, customData));
        },

        log = function() {
            var prefixes = [tag];

            // browserGlobal.convenientOptions.logger.log is dynamic, so can't bind directly to it
            browserGlobal.convenientOptions.logger.log.apply(browserGlobal.convenientOptions.logger.log, prefixes.concat(plugin.copyArray(arguments)));
        },

        throwIfPluginWasAlreadyInitiatedForDeck = function(deck) {
            var isStorageInitiated = isStorageAlreadyInitiatedForDeckAndPlugin(options.pluginName, deck);

            if (isStorageInitiated) {
                throw cv.generateErrorObject("The '" + options.pluginName + "' plugin has already been activated for this deck, can't activate it twice.");
            }
        },

        bindToDeck = function(deck) {
            var deckBound = {};

            deckBound.createEventData = external.createEventData.bind(this, deck);
            deckBound.fire = external.fire.bind(this, deck);
            deckBound.getStorage = external.getStorage.bind(this, deck);
            deckBound.log = external.log.bind(this, deck);

            return deckBound;
        },

        activateDeck = function(deck) {
            var deckBound;

            throwIfPluginWasAlreadyInitiatedForDeck(deck);
            initiateDeckPluginStorage(options.pluginName, deck);

            deckBound = bindToDeck(deck);

            return deckBound;
        },

        bindExternal = function() {
            external.createEventData = createEventData.bind(this);
            external.generateErrorObject = generateErrorObject.bind(this);
            external.fire = fire.bind(this);
            external.log = log.bind(this);
            external.activateDeck = activateDeck.bind(this);
            external.getStorage = plugin.getDeckPluginStorage.bind(this, options.pluginName);
        },

        init = function() {
            bindExternal();
        };

    init();

    return external;
};

plugin.getDeckStorage = function(deck) {
    if (!deck) {
        throw cv.generateErrorObject("deck must be defined.");
    }

    var storage = null;

    decksStorages.some(function(deckStorage) {
        if (deckStorage.deck === deck) {
            storage = deckStorage.storage;
            return true;
        }

        return false;
    });

    return storage;
};

plugin.getDeckPluginStorage = function(pluginName, deck) {
    if (!pluginName) {
        throw cv.generateErrorObject("pluginName must be defined.");
    }

    if (!deck) {
        throw cv.generateErrorObject("deck must be defined.");
    }

    var storage = plugin.getDeckStorage(deck);

    if (!storage) {
        throw cv.generateErrorObject("storage was not initiated for this deck.");
    }

    return storage[pluginName];
};

// Plugin functions expect to be executed in a deck context
// Mimicing, and extending,the internal createEventData bespoke uses
plugin.createEventData = function(eventNamespace, eventName, innerEvent, slide, eventData) {
    eventData = eventData || {};

    eventData.eventNamespace = eventNamespace || null;

    eventData.eventName = eventName || null;

    // Can be either a DOM/browser event or a bespoke event
    eventData.innerEvent = innerEvent || null;

    if (isNumber(slide)) {
        eventData.index = slide;
        eventData.slide = this.slides[slide];
    } else {
        eventData.index = this.slides.indexOf(slide);
        eventData.slide = slide;
    }

    return eventData;
};

plugin.copyArray = function(arr) {
    return [].slice.call(arr, 0);
};

cv = plugin.builder(pluginName);

init();

module.exports = plugin;

},{}]},{},[1])
(1)
});