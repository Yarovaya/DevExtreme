"use strict";

var GroupedStrategy = require("./ui.scheduler.work_space.grouped.strategy");


var VerticalGroupedStrategy = GroupedStrategy.inherit({
    prepareCellIndexes: function(cellCoordinates, groupIndex) {
        var rowIndex = cellCoordinates.rowIndex + groupIndex * this._workSpace._getRowCount() + groupIndex;

        return {
            rowIndex: rowIndex,
            cellIndex: cellCoordinates.cellIndex
        };
    },

    calculateCellIndex: function(rowIndex, cellIndex) {
        rowIndex = rowIndex % this._workSpace._getRowCount();

        return this._workSpace._getRowCount() * cellIndex + rowIndex;
    },

    getGroupIndex: function(rowIndex, cellIndex) {
        return Math.floor(rowIndex / this._workSpace._getRowCount());
    },
});

module.exports = VerticalGroupedStrategy;
