"use strict";

var registerComponent = require("../../core/component_registrator"),
    SchedulerWorkSpace = require("./ui.scheduler.work_space.indicator");

var DAY_CLASS = "dx-scheduler-work-space-day";

var SchedulerWorkSpaceDay = SchedulerWorkSpace.inherit({
    _getElementClass: function() {
        return DAY_CLASS;
    },

    _getRowCount: function() {
        if(this.option("rotated")) {
            return 1;
        } else {
            return this._getCellCountInDay();
        }
    },

    _getCellCount: function() {
        if(this.option("rotated")) {
            return this._getCellCountInDay();
        } else {
            return this.option("intervalCount");
        }
    },

    _getCellCoordinatesByIndex: function(index) {
        var cellIndex,
            rowIndex;


        cellIndex = Math.floor(index / this._getRowCount());
        rowIndex = index - this._getRowCount() * cellIndex;


        return {
            cellIndex: cellIndex,
            rowIndex: rowIndex
        };
    },

    _setFirstViewDate: function() {
        this._firstViewDate = this._getViewStartByOptions();
        this._setStartDayHour(this._firstViewDate);
    },

    _getDateByIndex: function(headerIndex) {
        if(this.option("intervalCount") === 1) {
            return this._firstViewDate;
        }

        var resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate;
    },

    _getFormat: function() {
        return this._formatWeekdayAndDay;
    },

    _renderDateHeader: function() {
        if(this.option("intervalCount") === 1) {
            return;
        }

        return this.callBase();
    },

    _getRightCell: function(isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(isMultiSelection);
        }

        return this._$focusedCell;
    },

    _getLeftCell: function(isMultiSelection) {
        if(!isMultiSelection) {
            return this.callBase(isMultiSelection);
        }

        return this._$focusedCell;
    }
});

registerComponent("dxSchedulerWorkSpaceDay", SchedulerWorkSpaceDay);

module.exports = SchedulerWorkSpaceDay;
