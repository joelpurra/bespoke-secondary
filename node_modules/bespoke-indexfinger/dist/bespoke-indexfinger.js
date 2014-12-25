/*!
 * bespoke-indexfinger v1.0.0
 *
 * Copyright 2014, Joel Purra
 * This content is released under the MIT license
 * http://joelpurra.mit-license.org/2013-2014
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var f=n;f=f.bespoke||(f.bespoke={}),f=f.plugins||(f.plugins={}),f.indexfinger=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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