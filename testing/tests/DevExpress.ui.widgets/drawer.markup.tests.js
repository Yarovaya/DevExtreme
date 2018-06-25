"use strict";


import $ from "jquery";
import "ui/drawer";

import "common.css!";

QUnit.testStart(() => {
    const markup =
        '<div id="drawer"></div>\
        \
        <div id="drawerWithTemplate">\
            <div data-options="dxTemplate: { name: \'content\' }" data-bind="text: text"></div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

var DRAWER_CLASS = "dx-drawer",
    DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper",
    // DRAWER_SCHADER_CLASS = "dx-drawer-shader",
    // DRAWER_BUTTON_CLASS = "dx-drawer-button",
    DRAWER_BUTTON_ID = "dx-drawer-navigation",
    DRAWER_CHECKBOX_CLASS = "dx-drawer-checkbox";


QUnit.module("Drawer markup", () => {
    QUnit.test("markup init", (assert) => {
        let element = $("#drawer").dxDrawer();

        assert.ok(element.hasClass(DRAWER_CLASS));
    });

    QUnit.test("drawer should have a wrapper", (assert) => {
        let $element = $("#drawer").dxDrawer(),
            $wrapper = $element.find("." + DRAWER_WRAPPER_CLASS);

        assert.ok($wrapper.length, "Wrapper is rendered");
    });

    QUnit.test("drawer should have a checkBox", (assert) => {
        let $element = $("#drawer").dxDrawer(),
            $wrapper = $element.find("." + DRAWER_WRAPPER_CLASS),
            $checkBox = $wrapper.find("." + DRAWER_CHECKBOX_CLASS);

        assert.ok($checkBox.length, "CheckBox is rendered");
        assert.equal($checkBox.attr("type"), "checkbox", "Element type is correct");
        assert.equal($checkBox.attr("id"), DRAWER_BUTTON_ID, "Element id is correct");
    });
});

QUnit.module("aria accessibility", () => {
    QUnit.test("aria role", (assert) => {
        let $element = $("#drawer").dxDrawer();

        assert.equal($element.attr("role"), "drawer", "aria role is correct");
    });
});
