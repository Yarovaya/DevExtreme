"use strict";

require("common.css!");
require("generic_light.css!");

var pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js");

var $ = require("jquery"),
    SchedulerTimelineMonth = require("ui/scheduler/ui.scheduler.timeline_month"),
    SchedulerResourcesManager = require("ui/scheduler/ui.scheduler.resource_manager"),
    domUtils = require("core/utils/dom"),
    dateLocalization = require("localization/date"),
    resizeCallbacks = require("core/utils/resize_callbacks"),
    dateUtils = require("core/utils/date"),
    dataUtils = require("core/element_data");

QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="scheduler-timeline"></div>\
                                <div id="scheduler-timeline-rtl"></div>');
});

var CELL_CLASS = "dx-scheduler-date-table-cell";

var stubInvokeMethod = function(instance) {
    sinon.stub(instance, "invoke", function() {
        var subscribe = arguments[0];
        if(subscribe === "createResourcesTree") {
            return new SchedulerResourcesManager().createResourcesTree(arguments[1]);
        }
        if(subscribe === "convertDateByTimezone") {
            return arguments[1];
        }
    });
};

var formatWeekdayAndDay = function(date) {
    return dateLocalization.getDayNames("abbreviated")[date.getDay()] + " " + dateLocalization.format(date, "day");
};

QUnit.module("Timeline Base", {

    beforeEach: function() {
        this.createInstance = function(options) {
            if(this.instance) {
                this.instance.invoke.restore();
                delete this.instance;
            }

            this.instance = $("#scheduler-timeline").dxSchedulerTimeline().dxSchedulerTimeline("instance");
            stubInvokeMethod(this.instance, options);
        };

        this.createInstance();
    }
});

QUnit.test("Header scrollable should update position if date scrollable position is changed to right", function(assert) {
    var $element = this.instance.$element(),
        headerScrollable = $element.find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    dateTableScrollable.scrollTo({ left: 100 });

    assert.equal(headerScrollable.scrollLeft(), 100, "Scroll position is OK");
});

QUnit.test("Header scrollable shouldn't update position if date scrollable position is changed to bottom", function(assert) {
    var $element = this.instance.$element(),
        headerScrollable = $element.find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    dateTableScrollable.scrollTo({ top: 100 });

    assert.equal(headerScrollable.scrollLeft(), 0, "Scroll position is OK");
});

QUnit.test("Sidebar scrollable should update position if date scrollable position is changed", function(assert) {
    this.instance.option({
        crossScrollingEnabled: true,
        width: 400,
        height: 200,
        groups: [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }, { id: 3, text: "c" }, { id: 4, text: "d" }] }]
    });

    var $element = this.instance.$element(),
        groupPanelScrollable = $element.find(".dx-scheduler-sidebar-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    dateTableScrollable.scrollTo({ top: 200 });

    assert.equal(groupPanelScrollable.scrollTop(), 200, "Scroll position is OK");
});

QUnit.test("Date table scrollable should update position if sidebar position is changed", function(assert) {
    this.instance.option({
        crossScrollingEnabled: true,
        width: 400,
        height: 200,
        groups: [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }, { id: 3, text: "c" }, { id: 4, text: "d" }] }]
    });

    var $element = this.instance.$element(),
        groupPanelScrollable = $element.find(".dx-scheduler-sidebar-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    groupPanelScrollable.scrollTo({ top: 200 });

    assert.equal(dateTableScrollable.scrollTop(), 200, "Scroll position is OK");
});

QUnit.test("Date table scrollable should update position if header scrollable position is changed", function(assert) {
    var $element = this.instance.$element(),
        headerScrollable = $element.find(".dx-scheduler-header-scrollable").dxScrollable("instance"),
        dateTableScrollable = $element.find(".dx-scheduler-date-table-scrollable").dxScrollable("instance");

    domUtils.triggerHidingEvent($element);
    domUtils.triggerShownEvent($element);

    headerScrollable.scrollTo({ left: 100 });

    assert.equal(dateTableScrollable.scrollLeft(), 100, "Scroll position is OK");
});

QUnit.test("Sidebar should be hidden in simple mode", function(assert) {
    var $element = this.instance.$element();

    var $sidebar = $element.find(".dx-scheduler-sidebar-scrollable");

    assert.equal($sidebar.css("display"), "none", "Sidebar is invisible");
});

QUnit.test("Sidebar should be visible in grouped mode", function(assert) {
    var $element = this.instance.$element();

    this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);
    var $sidebar = $element.find(".dx-scheduler-sidebar-scrollable");

    assert.equal($sidebar.css("display"), "block", "Sidebar is visible");
});

QUnit.test("Fixed appointments container should have correct left", function(assert) {
    var $element = this.instance.$element();

    this.instance.option("groups", [
        { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] },
        { name: "two", items: [{ id: 1, text: "c" }, { id: 2, text: "d" }] }
    ]);

    var $fixedAppt = $element.find(".dx-scheduler-fixed-appointments"),
        $sidebar = $element.find(".dx-scheduler-sidebar-scrollable");

    assert.equal($fixedAppt.position().left, $sidebar.outerWidth(true), "Container position is correct");
});

QUnit.test("Group table cells should have correct height", function(assert) {
    var $element = this.instance.$element();

    this.instance.option("groups", [
        { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] },
        { name: "two", items: [{ id: 1, text: "1" }, { id: 2, text: "2" }] }
    ]);

    var $groupTable = $element.find(".dx-scheduler-sidebar-scrollable .dx-scheduler-group-table"),
        $groupRows = $groupTable.find(".dx-scheduler-group-row"),
        $groupHeader = $groupRows.eq(1).find(".dx-scheduler-group-header").eq(0),
        dateTableCellHeight = $element.find(".dx-scheduler-date-table-cell").get(0).getBoundingClientRect().height,
        groupHeaderHeight = $groupHeader.get(0).getBoundingClientRect().height;

    assert.roughEqual(dateTableCellHeight, groupHeaderHeight, 1.1, "Cell height is OK");
});

QUnit.test("the 'getCoordinatesByDate' method should return right coordinates", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 10, 16),
        startDayHour: 9,
        hoursInterval: 1
    });

    var coordinates = this.instance.getCoordinatesByDate(new Date(2015, 10, 16, 10, 30), 0, false);
    var $expectedCell = this.instance.$element()
        .find(".dx-scheduler-date-table-cell").eq(1),
        expectedPositionLeft = $expectedCell.position().left + 0.5 * $expectedCell.outerWidth();

    assert.roughEqual(coordinates.left, expectedPositionLeft, 1.001, "left coordinate is OK");
});

QUnit.test("the 'getCoordinatesByDate' method should return right coordinates for rtl mode", function(assert) {
    this.createInstance({ rtlEnabled: true });

    this.instance.option({
        width: 100,
        currentDate: new Date(2015, 10, 16),
        startDayHour: 9,
        hoursInterval: 1
    });

    var coordinates = this.instance.getCoordinatesByDate(new Date(2015, 10, 16, 10, 30), 0, false);
    var $expectedCell = this.instance.$element()
        .find(".dx-scheduler-date-table-cell").eq(1);

    var expectedPositionLeft = $expectedCell.position().left + $expectedCell.outerWidth() - 0.5 * $expectedCell.outerWidth();

    assert.roughEqual(coordinates.left, expectedPositionLeft, 1.001, "left coordinate is OK");
});

QUnit.test("the 'getCoordinatesByDate' method should return right coordinates for grouped timeline", function(assert) {
    var instance = $("#scheduler-timeline").dxSchedulerTimelineDay({
        "currentDate": new Date(2015, 9, 28),
        groupOrientation: "vertical"
    }).dxSchedulerTimelineDay("instance");

    stubInvokeMethod(instance);
    try {
        instance.option("groups", [
            { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] },
            { name: "two", items: [{ id: 1, text: "1" }, { id: 2, text: "2" }] }
        ]);
        var coordinates = instance.getCoordinatesByDate(new Date(2015, 9, 28, 1), 1);
        var expectedPosition = instance.$element()
            .find(".dx-scheduler-date-table-row").eq(1)
            .find(".dx-scheduler-date-table-cell").eq(2)
            .position();

        assert.equal(coordinates.left, expectedPosition.left, "Coordinates are OK");
        assert.equal(coordinates.top, expectedPosition.top, "Coordinates are OK");
    } finally {
        instance.invoke.restore();
    }
});


QUnit.test("the 'getCellIndexByCoordinates' method should return right coordinates", function(assert) {
    var cellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth();
    var cellIndex = this.instance.getCellIndexByCoordinates({ left: cellWidth * 15, top: 1 });

    assert.equal(cellIndex, 15, "Cell index is OK");
});

QUnit.test("the 'getCellIndexByCoordinates' method should return right coordinates for fractional value", function(assert) {
    this.instance.option("groups", [
        { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] },
        { name: "two", items: [{ id: 1, text: "1" }, { id: 2, text: "2" }] }
    ]);

    var cellWidth = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerWidth(),
        cellHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(0).outerHeight();

    var cellIndex = this.instance.getCellIndexByCoordinates({ left: cellWidth * 15 + 0.656, top: cellHeight * 2 - 0.656 });

    assert.equal(cellIndex, 111, "Cell index is OK");
});

QUnit.test("Timeline should not have time panel offset", function(assert) {
    var offset = this.instance.getTimePanelWidth();

    assert.strictEqual(offset, 0, "Offset is 0");
});

QUnit.test("Tables should be rerendered if dimension was changed and horizontal scrolling is enabled", function(assert) {
    this.instance.option("crossScrollingEnabled", true);
    var stub = sinon.stub(this.instance, "_setTableSizes");

    resizeCallbacks.fire();

    assert.ok(stub.calledOnce, "Tables were updated");
});

QUnit.test("dateUtils.getTimezonesDifference should be called when calculating interval between dates", function(assert) {
    var stub = sinon.stub(dateUtils, "getTimezonesDifference"),
        minDate = new Date("Thu Mar 10 2016 00:00:00 GMT-0500"),
        maxDate = new Date("Mon Mar 15 2016 00:00:00 GMT-0400");

    this.instance._getIntervalBetween(minDate, maxDate, true);

    assert.ok(stub.calledOnce, "getTimezonesDifference was called");

    dateUtils.getTimezonesDifference.restore();
});

QUnit.test("Ensure cell min height is equal to cell height(T389468)", function(assert) {
    var stub = sinon.stub(this.instance, "getCellHeight").returns(10);

    this.instance.option({
        groups: [
            { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }
        ],
        height: 400
    });

    try {
        this.instance.option("currentDate", new Date(2010, 10, 10));
        var height = this.instance.$element().find(".dx-scheduler-group-header-content").eq(0).outerHeight(),
            expectedHeight = this.instance.$element().find(".dx-scheduler-date-table-cell").first().outerHeight() - 1;

        assert.roughEqual(height, expectedHeight, 2.001, "Group cell height is OK");

    } finally {
        stub.restore();
    }
});

QUnit.test("Ensure cell min height is equal to cell height if crossScrollingEnabled = true", function(assert) {
    this.instance.option({
        groups: [
            { name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }
        ],
        height: 400,
        crossScrollingEnabled: true
    });

    var recalculateGroupHeader = sinon.spy(this.instance, "_setGroupHeaderCellsHeight");
    resizeCallbacks.fire();

    assert.ok(recalculateGroupHeader.called, "Group header was recalculated");
});

QUnit.module("Timeline Day", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineDay().dxSchedulerTimelineDay("instance");
        stubInvokeMethod(this.instance);
    }
});

QUnit.test("Get visible bounds", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 5, 30),
        height: 400,
        width: 950
    });

    var scrollable = this.instance.getScrollable();

    domUtils.triggerShownEvent(this.instance.$element());

    scrollable.scrollBy(0);

    var bounds = this.instance.getVisibleBounds();

    assert.deepEqual(bounds.left, { hours: 0, minutes: 0, date: new Date(2015, 5, 30) }, "Left bound is OK");
    assert.deepEqual(bounds.right, { hours: 2, minutes: 0, date: new Date(2015, 5, 30) }, "Right bound is OK");
});

QUnit.test("Get visible bounds if scroll position is not null", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 5, 30),
        height: 400,
        width: 950
    });

    var scrollable = this.instance.getScrollable();

    domUtils.triggerShownEvent(this.instance.$element());

    scrollable.scrollBy(1000);

    var bounds = this.instance.getVisibleBounds();

    assert.deepEqual(bounds.left, { hours: 2, minutes: 30, date: new Date(2015, 5, 30) }, "Left bound is OK");
    assert.deepEqual(bounds.right, { hours: 4, minutes: 30, date: new Date(2015, 5, 30) }, "Right bound is OK");
});

QUnit.test("Get visible bounds if hoursInterval is set", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 2, 2),
        height: 400,
        width: 850,
        hoursInterval: 1.5
    });

    var scrollable = this.instance.getScrollable();

    domUtils.triggerShownEvent(this.instance.$element());

    scrollable.scrollBy(1000);

    var bounds = this.instance.getVisibleBounds();

    assert.deepEqual(bounds.left, { hours: 7, minutes: 30, date: new Date(2015, 2, 2) }, "Left bound is OK");
    assert.deepEqual(bounds.right, { hours: 13, minutes: 30, date: new Date(2015, 2, 2) }, "Right bound is OK");
});

QUnit.module("Timeline Day, groupOrientation = horizontal", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineDay({
            groupOrientation: "horizontal"
        }).dxSchedulerTimelineDay("instance");
        stubInvokeMethod(this.instance);

        this.instance.option("groups", [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]);
    }
});

QUnit.test("Get visible bounds, groupOrientation = horizontal", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 5, 30),
        height: 400,
        width: 950
    });

    var scrollable = this.instance.getScrollable();

    domUtils.triggerShownEvent(this.instance.$element());

    scrollable.scrollBy(0);

    var bounds = this.instance.getVisibleBounds();

    assert.deepEqual(bounds.left, { hours: 0, minutes: 0, date: new Date(2015, 5, 30) }, "Left bound is OK");
    assert.deepEqual(bounds.right, { hours: 2, minutes: 0, date: new Date(2015, 5, 30) }, "Right bound is OK");
});

QUnit.test("Sidebar should not be visible in grouped mode, groupOrientation = horizontal", function(assert) {
    var $element = this.instance.$element();

    var $sidebar = $element.find(".dx-scheduler-sidebar-scrollable");

    assert.equal($sidebar.css("display"), "none", "Sidebar is visible");
});

QUnit.test("Group table cells should have correct height, groupOrientation = horizontal", function(assert) {
    var $element = this.instance.$element();

    var $groupRows = $element.find(".dx-scheduler-header-panel .dx-scheduler-group-row"),
        $groupHeader = $groupRows.eq(0).find(".dx-scheduler-group-header").eq(0),
        groupHeaderHeight = $groupHeader.get(0).getBoundingClientRect().height;

    assert.roughEqual(40, groupHeaderHeight, 1.1, "Cell height is OK");
});

QUnit.test("the 'getCoordinatesByDate' method should return right coordinates for grouped timeline, groupOrientation = horizontal", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 21),
        firstDayOfWeek: 1,
        startDayHour: 5,
        endDayHour: 8,
        hoursInterval: 1
    });

    var coordinates = this.instance.getCoordinatesByDate(new Date(2015, 9, 21, 6), 1);
    var expectedPosition = this.instance.$element()
        .find(".dx-scheduler-date-table-row").eq(0)
        .find(".dx-scheduler-date-table-cell").eq(4)
        .position();

    assert.equal(coordinates.left, expectedPosition.left, "Coordinates are OK");
    assert.equal(coordinates.top, expectedPosition.top, "Coordinates are OK");

});

QUnit.module("Timeline Week", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineWeek().dxSchedulerTimelineWeek("instance");
        stubInvokeMethod(this.instance);
    }
});

QUnit.test("Scheduler timeline week header cells should have right width", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 29)
    });
    var $element = this.instance.$element(),
        $firstRow = $element.find(".dx-scheduler-header-row").first(),
        $lastRow = $element.find(".dx-scheduler-header-row").last(),
        $firstHeaderCell = $firstRow.find(".dx-scheduler-header-panel-cell").eq(0),
        $lastHeaderCell = $lastRow.find(".dx-scheduler-header-panel-cell").eq(0);

    assert.roughEqual($firstHeaderCell.outerWidth(), 48 * $lastHeaderCell.outerWidth(), 1.5, "First row cell has correct width");
});

QUnit.test("Scheduler timeline week header cells should have right width if crossScrollingEnabled = true", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 29),
        crossScrollingEnabled: true
    });

    resizeCallbacks.fire();

    var $element = this.instance.$element(),
        $firstRow = $element.find(".dx-scheduler-header-row").first(),
        $lastRow = $element.find(".dx-scheduler-header-row").last(),
        $firstHeaderCell = $firstRow.find(".dx-scheduler-header-panel-cell").eq(0),
        $lastHeaderCell = $lastRow.find(".dx-scheduler-header-panel-cell").eq(0),
        $dateTableCell = $element.find(".dx-scheduler-date-table-cell").eq(0);

    assert.roughEqual($firstHeaderCell.outerWidth(), 48 * $lastHeaderCell.outerWidth(), 1.5, "First row cell has correct width");
    assert.roughEqual($lastHeaderCell.outerWidth(), $dateTableCell.outerWidth(), 1.5, "Last row cell has correct width");
});

QUnit.test("Scheduler timeline week cells should have right height if crossScrollingEnabled = true", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 29),
        crossScrollingEnabled: true,
        groups: [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" } ] }]
    });

    resizeCallbacks.fire();

    var $element = this.instance.$element(),
        $firstRowCell = $element.find(".dx-scheduler-date-table-cell").first(),
        $lastRowCell = $element.find(".dx-scheduler-date-table-cell").eq(336);

    assert.roughEqual($firstRowCell.outerHeight(), $lastRowCell.outerHeight(), 1.5, "Cells has correct height");
});

QUnit.test("The part of long appointment should have right coordinates on current week (T342192)", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 1, 23),
        firstDayOfWeek: 1,
        startDayHour: 1,
        endDayHour: 10,
        hoursInterval: 0.5
    });
    var coordinates = this.instance.getCoordinatesByDate(new Date(2015, 2, 1, 0, 30), 0, false);
    var $expectedCell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(108);

    var expectedPositionLeft = $expectedCell.position().left;

    assert.roughEqual(coordinates.left, expectedPositionLeft, 1.001, "left coordinate is OK");

});

QUnit.test("The part of long appointment should have right coordinates on current week (T342192)", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 1, 23),
        firstDayOfWeek: 1,
        startDayHour: 1,
        endDayHour: 10,
        hoursInterval: 0.5
    });
    var coordinates = this.instance.getCoordinatesByDate(new Date(2015, 1, 28, 10, 30), 0, false);
    var $expectedCell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(108);

    var expectedPositionLeft = $expectedCell.position().left;

    assert.roughEqual(coordinates.left, expectedPositionLeft, 1.001, "left coordinate is OK");

});

QUnit.test("The part of long appointment should have right coordinates on current week (T342192)", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 1, 23),
        firstDayOfWeek: 1,
        startDayHour: 1,
        endDayHour: 10,
        hoursInterval: 0.5
    });
    var coordinates = this.instance.getCoordinatesByDate(new Date(2015, 2, 1, 4, 30), 0, false);
    var $expectedCell = this.instance.$element().find(".dx-scheduler-date-table-cell").eq(115);

    var expectedPositionLeft = $expectedCell.position().left;

    assert.roughEqual(coordinates.left, expectedPositionLeft, 1.001, "left coordinate is OK");

});

QUnit.test("Timeline should find cell coordinates by date depend on start/end day hour & hoursInterval", function(assert) {
    var $element = this.instance.$element();

    this.instance.option({
        currentDate: new Date(2015, 2, 1),
        firstDayOfWeek: 0,
        startDayHour: 5,
        endDayHour: 10,
        hoursInterval: 0.75
    });

    var coords = this.instance.getCoordinatesByDate(new Date(2015, 2, 2, 8, 0));

    assert.equal(coords.top, $element.find(".dx-scheduler-date-table-cell").eq(11).position().top, "Cell coordinates are right");
    assert.equal(coords.left, $element.find(".dx-scheduler-date-table-cell").eq(11).position().left, "Cell coordinates are right");
});

QUnit.test("Get visible bounds for timelineWeek on init", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 2, 2),
        firstDayOfWeek: 1,
        startDayHour: 1,
        height: 400,
        width: 850
    });

    var scrollable = this.instance.getScrollable();

    domUtils.triggerShownEvent(this.instance.$element());

    scrollable.scrollBy(0);

    var bounds = this.instance.getVisibleBounds();

    assert.deepEqual(bounds.left, { hours: 1, minutes: 0, date: new Date(2015, 2, 2) }, "Left bound is OK");
    assert.deepEqual(bounds.right, { hours: 3, minutes: 0, date: new Date(2015, 2, 2) }, "Right bound is OK");
});

QUnit.test("Get visible bounds for timelineWeek", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 2, 2),
        firstDayOfWeek: 1,
        height: 400,
        width: 850
    });
    var scrollable = this.instance.getScrollable();

    domUtils.triggerShownEvent(this.instance.$element());

    scrollable.scrollBy(10600);

    var bounds = this.instance.getVisibleBounds();

    assert.deepEqual(bounds.left, { hours: 2, minutes: 30, date: new Date(2015, 2, 3) }, "Left bound is OK");
    assert.deepEqual(bounds.right, { hours: 4, minutes: 30, date: new Date(2015, 2, 3) }, "Right bound is OK");
});

QUnit.test("Get visible bounds for timelineWeek, rtl mode", function(assert) {
    var instance = $("#scheduler-timeline-rtl").dxSchedulerTimelineWeek({
        width: 850,
        rtlEnabled: true,
        currentDate: new Date(2015, 2, 2),
        firstDayOfWeek: 1,
        height: 400
    }).dxSchedulerTimelineWeek("instance");

    var scrollable = instance.getScrollable();

    domUtils.triggerShownEvent(instance.$element());

    scrollable.scrollBy(-10600);

    var bounds = instance.getVisibleBounds();

    assert.deepEqual(bounds.left, { hours: 2, minutes: 30, date: new Date(2015, 2, 3) }, "Left bound is OK");
    assert.deepEqual(bounds.right, { hours: 4, minutes: 30, date: new Date(2015, 2, 3) }, "Right bound is OK");
});

QUnit.module("Timeline Month", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineMonth({ currentDate: new Date(2015, 9, 16) }).dxSchedulerTimelineMonth("instance");
        stubInvokeMethod(this.instance);
    }
});

QUnit.test("Scheduler timeline month should be initialized", function(assert) {
    assert.ok(this.instance instanceof SchedulerTimelineMonth, "dxSchedulerTimeLineMonth was initialized");
});

QUnit.test("Scheduler timeline month should have a right css class", function(assert) {
    var $element = this.instance.$element();
    assert.ok($element.hasClass("dx-scheduler-timeline"), "dxSchedulerTimelineMonth has 'dx-scheduler-timeline' css class");
    assert.ok($element.hasClass("dx-scheduler-timeline-month"), "dxSchedulerTimelineMonth has 'dx-scheduler-timeline' css class");
});

QUnit.test("Scheduler timeline month view should have right cell & row count", function(assert) {
    var $element = this.instance.$element();

    assert.equal($element.find(".dx-scheduler-date-table-row").length, 1, "Date table has 1 rows");
    assert.equal($element.find(".dx-scheduler-date-table-cell").length, 31, "Date table has 240 cells");
});

QUnit.test("Scheduler timeline month header panel should have right quantity of cells", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 8, 21)
    });
    var $element = this.instance.$element();

    assert.equal($element.find(".dx-scheduler-header-panel-cell").length, 30, "Time panel has a right count of cells");
    $element.find(".dx-scheduler-header-panel-cell").each(function(index) {
        var header = formatWeekdayAndDay(new Date(new Date(2015, 8, 1).getTime() + 3600000 * 24 * index));
        assert.equal($(this).text(), header, "Header text is OK");
    });

});

QUnit.test("Scheduler timeline month should have rigth first view date", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 21),
        firstDayOfWeek: 1,
        startDayHour: 4
    });

    assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 1, 4), "First view date is OK");

    this.instance.option({
        startDayHour: 0
    });

    assert.deepEqual(this.instance.getStartViewDate(), new Date(2015, 9, 1, 0), "First view date is OK after startDayHour option changed");
});


QUnit.test("Each cell of scheduler timeline month should contain rigth jQuery dxCellData", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 3, 1),
        startDayHour: 1,
        endDayHour: 10,
        firstDayOfWeek: 1
    });

    var $cells = this.instance.$element().find("." + CELL_CLASS);

    $cells.each(function(index) {
        assert.deepEqual(dataUtils.data($(this)[0], "dxCellData"), {
            startDate: new Date(2015, 3, 1 + index, 1),
            endDate: new Date(2015, 3, 1 + index, 10),
            allDay: false
        }, "data of first cell is rigth");
    });
});

QUnit.test("Scheduler timeline month getPositionShift should return null shift", function(assert) {
    this.instance.option({
        currentDate: new Date(2015, 9, 21)
    });

    assert.deepEqual(this.instance.getPositionShift(), { top: 0, left: 0 }, "First view date is OK");
});

QUnit.test("Cells should have right date", function(assert) {
    this.instance.option({
        currentDate: new Date(2016, 3, 21),
        firstDayOfWeek: 1,
        hoursInterval: 1,
        startDayHour: 8,
        endDayHour: 20
    });

    var $cells = this.instance.$element().find("." + CELL_CLASS);
    assert.deepEqual(dataUtils.data($cells.get(25), "dxCellData").startDate, new Date(2016, 3, 26, 8), "Date is OK");
});

QUnit.test("Scrollables should be updated after currentDate changing", function(assert) {
    this.instance.option({
        currentDate: new Date(2017, 1, 15)
    });

    var scrollable = this.instance.$element().find(".dx-scheduler-date-table-scrollable").dxScrollable("instance"),
        updateSpy = sinon.spy(scrollable, "update");

    try {
        this.instance.option("currentDate", new Date(2017, 2, 15));

        assert.ok(updateSpy.calledOnce, "update was called");
    } finally {
        scrollable.update.restore();
    }
});

QUnit.module("Timeline Keyboard Navigation", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineMonth({
            currentDate: new Date(2015, 9, 16)
        }).dxSchedulerTimelineMonth("instance");
        stubInvokeMethod(this.instance);
    }
});


QUnit.test("Timeline should select/unselect cells with shift & arrows", function(assert) {
    this.instance.option({
        focusStateEnabled: true,
        width: 1000,
        height: 800,
        currentDate: new Date(2015, 3, 1),
        groups: [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }, { id: 3, text: "c" }] }]
    });

    var $element = this.instance.$element(),
        $cells = this.instance.$element().find("." + CELL_CLASS),
        keyboard = keyboardMock($element);

    pointerMock($cells.eq(2)).start().click();
    keyboard.keyDown("down", { shiftKey: true });
    assert.equal($cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
    assert.equal($cells.slice(1, 3).filter(".dx-state-focused").length, 1, "right cells are focused");

    keyboard.keyDown("right", { shiftKey: true });
    assert.equal($cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
    assert.equal($cells.slice(1, 4).filter(".dx-state-focused").length, 2, "right cells are focused");

    keyboard.keyDown("left", { shiftKey: true });
    assert.equal($cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
    assert.equal($cells.slice(1, 3).filter(".dx-state-focused").length, 1, "right cells are focused");

    keyboard.keyDown("left", { shiftKey: true });
    assert.equal($cells.filter(".dx-state-focused").length, 2, "right quantity of focused cells");
    assert.equal($cells.slice(1, 3).filter(".dx-state-focused").length, 2, "right cells are focused");
});

QUnit.test("Timeline should select/unselect cells with mouse", function(assert) {
    this.instance.option({
        focusStateEnabled: true,
        width: 1000,
        height: 800,
        currentDate: new Date(2015, 3, 1),
        groups: [{ name: "one", items: [{ id: 1, text: "a" }, { id: 2, text: "b" }] }]
    });

    var $element = this.instance.$element(),
        cells = $element.find("." + CELL_CLASS),
        $table = $element.find(".dx-scheduler-date-table");

    $($table).trigger($.Event("dxpointerdown", { target: cells.eq(3).get(0), which: 1, pointerType: "mouse" }));

    $($table).trigger($.Event("dxpointermove", { target: cells.eq(35).get(0), which: 1 }));

    assert.equal(cells.filter(".dx-state-focused").length, 1, "right quantity of focused cells");
});

QUnit.module("TimelineDay with intervalCount", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineDay({
            currentDate: new Date(2015, 9, 16)
        }).dxSchedulerTimelineDay("instance");
        stubInvokeMethod(this.instance);
    }
});

QUnit.test("TimelineDay has right intervalCount of cells with view option intervalCount", function(assert) {
    this.instance.option("intervalCount", 2);

    var cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
    assert.equal(cells.length, this.instance._getCellCountInDay() * 2, "view has right cell count");

    this.instance.option("intervalCount", 4);

    cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
    assert.equal(cells.length, this.instance._getCellCountInDay() * 4, "view has right cell count");
});

QUnit.test("TimelineDay Day view cells have right cellData with view option intervalCount=2", function(assert) {
    this.instance.option("intervalCount", 2);
    this.instance.option("currentDate", new Date(2017, 5, 29));

    var firstCellData = dataUtils.data(this.instance.$element().find(".dx-scheduler-date-table-cell").get(0), "dxCellData"),
        secondCellData = dataUtils.data(this.instance.$element().find(".dx-scheduler-date-table-cell").get(95), "dxCellData");

    assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 29, 0), "cell has right startDate");
    assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 29, 0, 30), "cell has right endtDate");

    assert.deepEqual(secondCellData.startDate, new Date(2017, 5, 30, 23, 30), "cell has right startDate");
    assert.deepEqual(secondCellData.endDate, new Date(2017, 5, 31, 0), "cell has right endtDate");
});

QUnit.test("Get date range", function(assert) {
    this.instance.option("currentDate", new Date(2015, 2, 16));
    this.instance.option("intervalCount", 2);

    assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 17, 23, 59)], "Range is OK");

    this.instance.option("intervalCount", 4);
    assert.deepEqual(this.instance.getDateRange(), [new Date(2015, 2, 16, 0, 0), new Date(2015, 2, 19, 23, 59)], "Range is OK");
});

QUnit.module("TimelineWeek with intervalCount", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineWeek({
            currentDate: new Date(2015, 9, 16)
        }).dxSchedulerTimelineWeek("instance");
        stubInvokeMethod(this.instance);
    }
});

QUnit.test("TimelineWeek has right count of cells with view option intervalCount", function(assert) {
    this.instance.option("intervalCount", 2);

    var cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
    assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 2, "view has right cell count");

    this.instance.option("intervalCount", 4);

    cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
    assert.equal(cells.length, this.instance._getCellCountInDay() * 7 * 4, "view has right cell count");
});

QUnit.test("TimelineWeek view cells have right cellData with view option intervalCount=2", function(assert) {
    this.instance.option("intervalCount", 2);
    this.instance.option("currentDate", new Date(2017, 5, 29));

    var firstCellData = dataUtils.data(this.instance.$element().find(".dx-scheduler-date-table-cell").get(7 * 48), "dxCellData"),
        secondCellData = dataUtils.data(this.instance.$element().find(".dx-scheduler-date-table-cell").get(2 * 7 * 48 - 1), "dxCellData");

    assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 2, 0), "cell has right startDate");
    assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 2, 0, 30), "cell has right endtDate");

    assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 8, 23, 30), "cell has right startDate");
    assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 9, 0), "cell has right endtDate");
});

QUnit.test("Get date range", function(assert) {
    this.instance.option("currentDate", new Date(2017, 5, 26));
    this.instance.option("intervalCount", 2);
    this.instance.option("firstDayOfWeek", 1);

    assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 9, 23, 59)], "Range is OK");

    this.instance.option("intervalCount", 4);
    assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 23, 23, 59)], "Range is OK");
});

QUnit.test("TimelineWeek view should contain right header if intervalCount=3", function(assert) {
    this.instance.option("currentDate", new Date(2017, 5, 26));
    this.instance.option("intervalCount", 3);

    var $element = this.instance.$element(),
        $firstRow = $element.find(".dx-scheduler-header-row").first();

    assert.equal($firstRow.find(".dx-scheduler-header-panel-cell").length, 21, "Header row has 21 cells");
});

QUnit.module("TimelineWorkWeek with intervalCount", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineWorkWeek({
            currentDate: new Date(2015, 9, 16)
        }).dxSchedulerTimelineWorkWeek("instance");
        stubInvokeMethod(this.instance);
    }
});

QUnit.test("TimelineWorkWeek has right count of cells with view option intervalCount", function(assert) {
    this.instance.option("intervalCount", 2);

    var cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
    assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 2, "view has right cell count");

    this.instance.option("intervalCount", 4);

    cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
    assert.equal(cells.length, this.instance._getCellCountInDay() * 5 * 4, "view has right cell count");
});

QUnit.test("'getCoordinatesByDate' should return right coordinates with view option intervalCount", function(assert) {
    this.instance.option({
        intervalCount: 2,
        currentDate: new Date(2017, 5, 25),
        startDayHour: 8,
        endDayHour: 20
    });

    var $element = this.instance.$element();

    var coords = this.instance.getCoordinatesByDate(new Date(2017, 6, 6, 12, 0), 0, false),
        targetCellPosition = $element.find(".dx-scheduler-date-table tbody td").eq(200).position();

    assert.equal(coords.top, targetCellPosition.top, "Cell coordinates are right");
    assert.equal(coords.left, targetCellPosition.left, "Cell coordinates are right");
});

QUnit.test("TimelineWorkWeek view cells have right cellData with view option intervalCount=2", function(assert) {
    this.instance.option("intervalCount", 2);
    this.instance.option("currentDate", new Date(2017, 5, 29));

    var firstCellData = dataUtils.data(this.instance.$element().find(".dx-scheduler-date-table-cell").get(5 * 48), "dxCellData"),
        secondCellData = dataUtils.data(this.instance.$element().find(".dx-scheduler-date-table-cell").get(2 * 5 * 48 - 1), "dxCellData");

    assert.deepEqual(firstCellData.startDate, new Date(2017, 6, 3, 0), "cell has right startDate");
    assert.deepEqual(firstCellData.endDate, new Date(2017, 6, 3, 0, 30), "cell has right endtDate");

    assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 7, 23, 30), "cell has right startDate");
    assert.deepEqual(secondCellData.endDate, new Date(2017, 6, 8, 0), "cell has right endtDate");
});

QUnit.test("Get date range", function(assert) {
    this.instance.option("currentDate", new Date(2017, 5, 26));
    this.instance.option("intervalCount", 2);
    this.instance.option("firstDayOfWeek", 1);

    assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 7, 23, 59)], "Range is OK");

    this.instance.option("intervalCount", 4);
    assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 26, 0, 0), new Date(2017, 6, 21, 23, 59)], "Range is OK");
});

QUnit.test("TimelineWorkWeek view should contain right header if intervalCount=3", function(assert) {
    this.instance.option("currentDate", new Date(2017, 5, 26));
    this.instance.option("intervalCount", 3);

    var $element = this.instance.$element(),
        $firstRow = $element.find(".dx-scheduler-header-row").first(),
        $headerCells = $firstRow.find(".dx-scheduler-header-panel-cell");

    assert.equal($headerCells.length, 15, "Header row has 15 cells");
    assert.equal($headerCells.eq(0).text(), "Mon 26", "Header cell text is correct");
    assert.equal($headerCells.eq(5).text(), "Mon 3", "Header cell text is correct");
    assert.equal($headerCells.eq(14).text(), "Fri 14", "Header cell text is correct");
});

QUnit.module("TimelineMonth with intervalCount", {
    beforeEach: function() {
        this.instance = $("#scheduler-timeline").dxSchedulerTimelineMonth({
            currentDate: new Date(2015, 9, 16)
        }).dxSchedulerTimelineMonth("instance");
        stubInvokeMethod(this.instance);
    }
});

QUnit.test("TimelineMonth has right count of cells with view option intervalCount", function(assert) {
    this.instance.option("intervalCount", 2);

    var cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
    assert.equal(cells.length, 61, "view has right cell count");

    this.instance.option("intervalCount", 4);

    cells = this.instance.$element().find(".dx-scheduler-date-table-cell");
    assert.equal(cells.length, 123, "view has right cell count");
});

QUnit.test("TimelineMonth view cells have right cellData with view option intervalCount=2", function(assert) {
    this.instance.option("intervalCount", 2);
    this.instance.option("currentDate", new Date(2017, 5, 29));

    var firstCellData = dataUtils.data(this.instance.$element().find(".dx-scheduler-date-table-cell").get(0), "dxCellData"),
        secondCellData = dataUtils.data(this.instance.$element().find(".dx-scheduler-date-table-cell").last().get(0), "dxCellData");

    assert.deepEqual(firstCellData.startDate, new Date(2017, 5, 1, 0), "cell has right startDate");
    assert.deepEqual(firstCellData.endDate, new Date(2017, 5, 2, 0), "cell has right endtDate");

    assert.deepEqual(secondCellData.startDate, new Date(2017, 6, 31, 0), "cell has right startDate");
    assert.deepEqual(secondCellData.endDate, new Date(2017, 7, 1, 0), "cell has right endtDate");
});

QUnit.test("Get date range", function(assert) {
    this.instance.option("currentDate", new Date(2017, 5, 26));
    this.instance.option("intervalCount", 2);
    this.instance.option("firstDayOfWeek", 1);

    assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 1), new Date(2017, 6, 31, 23, 59)], "Range is OK");

    this.instance.option("intervalCount", 4);
    assert.deepEqual(this.instance.getDateRange(), [new Date(2017, 5, 1), new Date(2017, 8, 30, 23, 59)], "Range is OK");
});
