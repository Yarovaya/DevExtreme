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
    DRAWER_TITLE_CLASS = "dx-drawer-title",
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

QUnit.module("Drawer markup with options", () => {
    QUnit.test("title should not be rendered if showTitle = false", (assert) => {
        let $element = $("#drawer").dxDrawer({
            title: "Title",
            showTitle: false
        });

        assert.equal($element.find("." + DRAWER_TITLE_CLASS).length, 0, "Title wasn't rendered");
    });

    QUnit.test("title should not be rendered if title = ''", (assert) => {
        let $element = $("#drawer").dxDrawer({
            title: "",
            showTitle: true
        });

        assert.equal($element.find("." + DRAWER_TITLE_CLASS).length, 0, "Title wasn't rendered");
    });

    QUnit.test("title option", (assert) => {
        let $element = $("#drawer").dxDrawer({
                title: "Title",
                showTitle: true
            }),
            $title = $element.find("." + DRAWER_TITLE_CLASS);

        assert.equal($title.length, 1, "Title wasn rendered");
        assert.equal($title.text(), "Title", "Title wasn rendered");
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
