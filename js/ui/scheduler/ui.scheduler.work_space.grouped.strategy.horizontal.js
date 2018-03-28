"use strict";

var GroupedStrategy = require("./ui.scheduler.work_space.grouped.strategy");


var HorizontalGroupedStrategy = GroupedStrategy.inherit({
    prepareCellIndexes: function(cellCoordinates, groupIndex) {
        return {
            rowIndex: cellCoordinates.rowIndex,
            cellIndex: cellCoordinates.cellIndex + groupIndex * this._workSpace._getCellCount()
        };
    },

    calculateCellIndex: function(rowIndex, cellIndex) {
        cellIndex = cellIndex % this._workSpace._getCellCount();

        return this._workSpace._getRowCount() * cellIndex + rowIndex;
    },

    getGroupIndex: function(rowIndex, cellIndex) {
        return Math.floor(cellIndex / this._workSpace._getCellCount());
    }
});

module.exports = HorizontalGroupedStrategy;
