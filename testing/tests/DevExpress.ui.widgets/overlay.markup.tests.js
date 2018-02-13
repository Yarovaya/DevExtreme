"use strict";

var $ = require("jquery"),
    fx = require("animation/fx");

require("common.css!");
require("ui/overlay");

QUnit.testStart(function() {
    var markup =
        '<style>\
            html, body {\
                height: 100%;\
                margin: 0;\
            }\
            \
            #qunit-fixture {\
                width: 100%;\
                height: 100%;\
            }\
        </style>\
        \
        <div id="customTargetContainer">\
            <div id="parentContainer">\
                <input id="overlayInputTarget" type="text" />\
                <div id="overlay"></div>\
            </div>\
        </div>/>';

    $("#qunit-fixture").html(markup);
});

var OVERLAY_CLASS = "dx-overlay",
    OVERLAY_CONTENT_CLASS = "dx-overlay-content",
    OVERLAY_WRAPPER_CLASS = "dx-overlay-wrapper",
    OVERLAY_CONTENT_CLASS = "dx-overlay-content",
    OVERLAY_SHADER_CLASS = "dx-overlay-shader",

    DISABLED_STATE_CLASS = "dx-state-disabled",

    viewport = function() { return $(".dx-viewport"); };

var toSelector = function(cssClass) {
    return "." + cssClass;
};

var moduleConfig = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.module("Overlay markup", moduleConfig);

QUnit.test("overlay class should be added to overlay", function(assert) {
    var $element = $("#overlay").dxOverlay();
    assert.ok($element.hasClass(OVERLAY_CLASS));
});

QUnit.test("default markup", function(assert) {
    var instance = $("#overlay").dxOverlay().dxOverlay("instance"),
        $content = $(instance.$content());

    assert.ok(!$content.is(":visible"));
    assert.ok(!viewport().children("." + OVERLAY_SHADER_CLASS).is(":visible"));
    assert.ok($content.width() < $(window).width());
    assert.ok($content.height() < $(window).height());
});

QUnit.test("markup when disabled = true", function(assert) {
    var $overlay = $("#overlay").dxOverlay({
            disabled: true
        }),
        overlay = $overlay.dxOverlay("instance"),
        $content = $(overlay.content());

    assert.ok($content.hasClass(DISABLED_STATE_CLASS), "disabled state present in content element");

    overlay.option("disabled", false);
    assert.ok(!$content.hasClass(DISABLED_STATE_CLASS), "disabled state not present in content element");

    overlay.option("disabled", undefined);
    assert.ok(!$content.hasClass(DISABLED_STATE_CLASS), "disabled state not present in content element");
});

QUnit.test("visible overlay should have wrapper and content", function(assert) {
    $("#overlay").dxOverlay({
        visible: true
    });

    assert.ok($(toSelector(OVERLAY_WRAPPER_CLASS)).length, "Overlay has wrapper");
    assert.ok($(toSelector(OVERLAY_CONTENT_CLASS)).length, "Overlay has content");
});

QUnit.test("shading color should be customized by option", function(assert) {
    var overlay = $("#overlay").dxOverlay({
            shading: true,
            shadingColor: "rgb(255, 0, 0)",
            visible: true
        }).dxOverlay("instance"),
        $wrapper = $(overlay.$content().parent());

    assert.ok(/rgb\(255,\s?0,\s?0\)/.test($wrapper.css("background-color")));

    overlay.option("shading", false);
    assert.ok(!/rgb\(255,\s?0,\s?0\)/.test($wrapper.css("background-color")));
});



