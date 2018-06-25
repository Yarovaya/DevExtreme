"use strict";

var $ = require("../core/renderer"),
    extend = require("../core/utils/extend").extend,
    registerComponent = require("../core/component_registrator"),
    getPublicElement = require("../core/utils/dom").getPublicElement,
    Widget = require("./widget/ui.widget");

var DRAWER_CLASS = "dx-drawer",
    DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper",
    DRAWER_CONTENT_CLASS = "dx-drawer-content",
    DRAWER_SCHADER_CLASS = "dx-drawer-shader",
    DRAWER_BUTTON_CLASS = "dx-drawer-button",
    DRAWER_NAVIGATION_ID = "dx-drawer-navigation",
    DRAWER_CHECKBOX_CLASS = "dx-drawer-checkbox";

/**
* @name dxDrawer
* @inherits Widget
* @module ui/drawer
* @export default
*/
var Drawer = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxDrawer.contentTemplate
            * @type template|function
            * @default "content"
            * @type_function_param1 contentElement:dxElement
            * @type_function_return string|Node|jQuery
            */
            contentTemplate: "content",
        });
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(DRAWER_CLASS);
    },

    _initMarkup: function() {
        this.callBase();
        this._renderWrapper();
        this._renderCheckBox();
        this._renderButton();
        this._renderShader();

        this.setAria("role", "drawer");
    },

    _renderWrapper: function() {
        this._$wrapper = $("<div>").addClass(DRAWER_WRAPPER_CLASS);
        this.$element().append(this._$wrapper);
    },

    _renderContentImpl: function() {
        this._$content = $("<div>").addClass(DRAWER_CONTENT_CLASS).appendTo(this._$wrapper);

        var contentTemplate = this._getTemplate(this.option("contentTemplate"));
        contentTemplate && contentTemplate.render({
            container: getPublicElement(this._$content),
            noModel: true
        });
    },

    _renderButton: function() {
        this._$button = $("<label>")
        .addClass(DRAWER_BUTTON_CLASS)
        .attr("for", DRAWER_NAVIGATION_ID)
        .appendTo(this._$wrapper);

        this._$icon = $("<div>")
            .addClass("dx-icon dx-icon-menu")
            .appendTo(this._$button);

    },

    _renderCheckBox: function() {
        this._$checkBoxInput = $("<input>")
            .attr("type", "checkbox")
            .attr("id", DRAWER_NAVIGATION_ID)
            .addClass(DRAWER_CHECKBOX_CLASS)
            .appendTo(this._$wrapper);
    },

    _renderShader: function() {
        this._$shader = $("<div>").addClass(DRAWER_SCHADER_CLASS).appendTo(this._$wrapper);
    }
});

registerComponent("dxDrawer", Drawer);

module.exports = Drawer;
