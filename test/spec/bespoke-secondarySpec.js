/*global require:true, document:true, jasmine:true, describe:true, it:true, expect:true, beforeEach:true, runs:true, waitsFor:true, spyOn:true */

Function.prototype.bind = Function.prototype.bind || require("function-bind");

var bespoke = require("bespoke"),
    convenient = require("bespoke-convenient"),
    indexfinger = require("bespoke-indexfinger"),
    secondary = require("../../lib-instrumented/bespoke-secondary.js");

(function(global, document, jasmine, bespoke, describe, it, expect, beforeEach) {
    "use strict";

    describe("bespoke-secondary", function() {

        var deck,

            createDeck = function() {
                var parent = document.createElement("article");
                for (var i = 0; i < 10; i++) {
                    parent.appendChild(document.createElement("section"));
                }

                deck = bespoke.from(parent, [
                    indexfinger(),
                    secondary()
                ]);
            };

        beforeEach(createDeck);

        // TODO: write tests.
        // NOTE: there is no public API, as it only listens for a keystroke, which is why I haven't bothered.
        // TODO: make code testable.
        describe("nothing", function() {
            it("should happen", function() {
                expect(true).not.toBe(false);
            });
        });
    });
}(this, document, jasmine, bespoke, describe, it, expect, beforeEach));
