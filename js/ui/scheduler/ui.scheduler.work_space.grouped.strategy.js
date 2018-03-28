"use strict";

var Class = require("../../core/class"),
    abstract = Class.abstract;


var GroupedStrategy = Class.inherit({

    ctor: function(workSpace) {
        this._workSpace = workSpace;
    },

    prepareCellIndexes: abstract,
    calculateCellIndex: abstract,
    getGroupIndex: abstract
});


module.exports = GroupedStrategy;
