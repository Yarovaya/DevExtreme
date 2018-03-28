"use strict";

var Class = require("../../core/class");


var GroupedStrategy = Class.inherit({

    ctor: function(workSpace) {
        this._workSpace = workSpace;
    }
});


module.exports = GroupedStrategy;
