"use strict";

var $ = require("jquery"),
    themeModule = require("viz/themes"),
    ThemeManager = require("viz/gauges/theme_manager");

QUnit.module('ThemeManager');

QUnit.test('Instance type', function(assert) {
    var themeManager = new ThemeManager();
    assert.ok(themeManager instanceof ThemeManager);
});

QUnit.test('Theme - desktop', function(assert) {
    var themeManager = new ThemeManager();
    themeManager.setCallback($.noop);
    themeManager.setTheme();
    var theme = themeManager.theme();
    assert.strictEqual(themeManager.themeName(), 'generic.light', 'theme name');
    assert.ok(theme.title, 'title');
    assert.ok(theme.export, 'export');
    assert.ok(theme.indicator, 'indicator');
    assert.ok(theme.tooltip, 'tooltip');
    assert.ok(theme.scale, 'scale');
    assert.ok(theme.rangeContainer, 'rangeContainer');
    assert.ok(theme.valueIndicators, 'valueIndicators');
    assert.ok(theme._circular, '_circular');
    assert.ok(theme._linear, '_linear');
});

QUnit.test('Theme - desktop-dark', function(assert) {
    var themeManager = new ThemeManager();
    themeManager.setCallback($.noop);
    themeManager.setTheme('desktop.dark');
    var theme = themeManager.theme();
    assert.strictEqual(themeManager.themeName(), 'generic.dark', 'theme name');
    assert.ok(theme.title, 'title');
    assert.ok(theme.export, 'export');
    assert.ok(theme.indicator, 'indicator');
    assert.ok(theme.tooltip, 'tooltip');
    assert.ok(theme.scale, 'scale');
    assert.ok(theme.rangeContainer, 'rangeContainer');
    assert.ok(theme.valueIndicators, 'valueIndicators');
    assert.ok(theme._circular, '_circular');
    assert.ok(theme._linear, '_linear');
});

QUnit.test('Subtheme', function(assert) {
    themeModule.registerTheme({
        name: 'my-theme',
        gauge: {
            valueIndicator: {
                _default: {
                    offset: 100
                }
            }
        }
    });
    var themeManager = new ThemeManager();
    themeManager.setCallback($.noop);
    themeManager._subTheme = '#circular';
    themeManager.setTheme('my-theme');
    var theme = themeManager.theme();
    assert.strictEqual(theme.valueIndicator._default.offset, 100);
});
