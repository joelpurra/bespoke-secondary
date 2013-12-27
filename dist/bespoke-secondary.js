/*!
 * bespoke-secondary v0.2.0
 * https://github.com/joelpurra/bespoke-secondary
 *
 * Copyright 2013, Joel Purra
 * This content is released under the MIT license
 */

(function(window, document, Math, bespoke, convenient, ns, pluginName, undefined) {
    "use strict";

    var cv = convenient.builder({
        pluginName: pluginName,
        dependencies: ["indexfinger"]
    }),

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
            var diff;

            if (to === undefined) {
                to = from;
                from = 0;
            }

            diff = to - from;

            var rnd = from + Math.floor(Math.random() * diff);

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

        plugin = function(deck, options) {
            var off = {},

                unboundSecondaryDeckMethods = {
                    // Plugin functions expect to be executed in a deck context
                    getNotesElement: function() {
                        return this.secondary.window && this.secondary.window.document && this.secondary.window.document.getElementById("notes");
                    },

                    isOpen: function() {
                        var s = this.secondary,
                            w = s.window,
                            // isInitialized, isNotNull, isNotClosed, isOwnedByThisWindow, containsNotesElement
                            result = (true && s !== undefined && w !== null && w.closed !== true && w.opener === window && this.secondary.getNotesElement() !== null);

                        return result;
                    },

                    open: function() {
                        if (!this.secondary.isOpen()) {
                            (this.secondary.window = window.open());
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

                        slideNotes = cv.copyArray(slide.querySelectorAll(options.notes));

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

                    merged.keys = {};
                    merged.keys.toggle = options.keys && options.keys.toggle || defaults.keys.toggle;

                    merged.notes = options.notes || defaults.notes;

                    options = merged;
                },

                keyDownListener = function(e) {
                    var eventHandled = false;

                    // No modifier keys, please
                    if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        eventHandled = eventHandled || (e.which === options.keys.toggle && cv.fire(deck, "toggle", e) && deck.secondary.toggle() && deck.secondary.synchronize());
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
                    cv.activateDeck(deck);

                    initOptions();
                    registerDeckExtensions();
                    enable();
                };

            init();
        };

    if (ns[pluginName] !== undefined) {
        throw cv.generateErrorObject("The " + pluginName + " plugin has already been loaded.");
    }

    ns[pluginName] = plugin;
}(window, document, Math, bespoke, bespoke.plugins.convenient, bespoke.plugins, "secondary"));
