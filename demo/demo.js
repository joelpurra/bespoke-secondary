/*global bespoke:true */

(function(bespoke) {
    "use strict";

    bespoke.from('article', [
        bespoke.plugins.keys(),
        bespoke.plugins.touch(),
        bespoke.plugins.classes(),
        bespoke.plugins.indexfinger(),
        bespoke.plugins.secondary(),
    ]);
}(bespoke));
