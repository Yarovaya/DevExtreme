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

QUnit.test("content should be present when widget instance exists", function(assert) {
    var $element = $("#overlay").dxOverlay(),
        instance = $element.dxOverlay("instance");

    assert.ok($(toSelector(OVERLAY_CONTENT_CLASS)).length);

    instance._dispose();
    assert.ok(!$(toSelector(OVERLAY_CONTENT_CLASS)).length);
});


