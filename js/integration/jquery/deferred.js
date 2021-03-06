"use strict";

var $ = require("jquery"),
    compareVersion = require("../../core/utils/version").compare;

exports.fromPromise = function(promise, context) {
    var isDeferred = promise && $.isFunction(promise.done) && $.isFunction(promise.fail);
    if(isDeferred) {
        return promise;
    }

    var d = $.Deferred();
    promise.then(function() {
        d.resolveWith.apply(d, [context].concat([$.makeArray(arguments)]));
    }, function() {
        d.rejectWith.apply(d, [context].concat([$.makeArray(arguments)]));
    });
    return d;
};

exports.when = compareVersion($.fn.jquery, [3]) < 0
    ? $.when
    : function(singleArg) {
        if(arguments.length === 0) {
            return $.Deferred().resolve();
        } else if(arguments.length === 1) {
            return singleArg && singleArg.then ? singleArg : $.Deferred().resolve(singleArg);
        } else {
            return $.when.apply($, arguments);
        }
    };
