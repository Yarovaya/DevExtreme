"use strict";

var $ = require("jquery");

var hideCallback = (function() {
    /* jshint laxcomma:true */
    var callbacks = [];
    return {
        add: function(callback) {
            var indexOfCallback = $.inArray(callback, callbacks);
            if(indexOfCallback === -1) {
                callbacks.push(callback);
            }
        },
        remove: function(callback) {
            var indexOfCallback = $.inArray(callback, callbacks);
            if(indexOfCallback !== -1) {
                callbacks.splice(indexOfCallback, 1);
            }
        },
        fire: function() {
            var callback = callbacks.pop(), result = !!callback;
            if(result) {
                callback();
            }
            return result;
        },
        hasCallback: function() {
            return callbacks.length > 0;
        }
        ///#DEBUG
        , reset: function() {
            callbacks = [];
        }
        ///#ENDDEBUG
    };
})();

/**
 * @name hideTopOverlay
 * @publicName hideTopOverlay()
 * @return Boolean
 * @module mobile/hide_top_overlay
 * @export default
 */
module.exports = function() {
    return hideCallback.fire();
};
module.exports.hideCallback = hideCallback;
