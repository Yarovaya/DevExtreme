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

var DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper",
    DRAWER_CONTENT_CLASS = "dx-drawer-content";
    // DRAWER_SCHADER_CLASS = "dx-drawer-shader",
    // DRAWER_BUTTON_CLASS = "dx-drawer-button",
    // DRAWER_BUTTON_ID = "dx-drawer-navigation",
    // DRAWER_CHECKBOX_CLASS = "dx-drawer-checkbox";


QUnit.module("Drawer", () => {
    QUnit.test("drawer should have a content", (assert) => {
        let $element = $("#drawer").dxDrawer(),
            $wrapper = $element.find("." + DRAWER_WRAPPER_CLASS),
            $content = $wrapper.find("." + DRAWER_CONTENT_CLASS);

        assert.ok($content.length, "Content is rendered");
    });
});


