"use strict";

var $ = require("../core/renderer"),
    extend = require("../core/utils/extend").extend,
    registerComponent = require("../core/component_registrator"),
    getPublicElement = require("../core/utils/dom").getPublicElement,
    Widget = require("./widget/ui.widget");

var DRAWER_CLASS = "dx-drawer",
    DRAWER_WRAPPER_CLASS = "dx-drawer-wrapper",
    DRAWER_BUTTON_WRAPPER_CLASS = "dx-drawer-button-wrapper",
    DRAWER_CONTENT_CLASS = "dx-drawer-content",
    DRAWER_SCHADER_CLASS = "dx-drawer-shader",
    DRAWER_BUTTON_CLASS = "dx-drawer-button",
    DRAWER_TITLE_CLASS = "dx-drawer-title",
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
            * @name dxDrawerOptions.title
            * @type string
            * @default ""
            */
            title: "",

            /**
            * @name dxDrawerOptions.showTitle
            * @type boolean
            * @default true
            */
            showTitle: true,

             /**
            * @name dxDrawerOptions.showMode
            * @type string
            * @default "temporary"
            */
            showMode: "temporary",

            /**
            * @name dxDrawerOptions.contentTemplate
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

        this._refreshModeClass();

        this._renderCheckBox();
        this._renderShader();

        this._renderButton();

        this._renderWrapper();

        this._renderButtonWrapper();
        this._renderTitle();

        this.setAria("role", "drawer");
    },

    _renderButton: function() {
        this._$button = $("<label>")
        .addClass(DRAWER_BUTTON_CLASS)
        .attr("for", DRAWER_NAVIGATION_ID)
        .appendTo(this.$element());

        this._$icon = $("<div>")
            .addClass("dx-icon dx-icon-menu")
            .appendTo(this._$button);

    },

    _renderCheckBox: function() {
        this._$checkBoxInput = $("<input>")
            .attr("type", "checkbox")
            .attr("id", DRAWER_NAVIGATION_ID)
            .addClass(DRAWER_CHECKBOX_CLASS)
            .appendTo(this.$element());
    },

    _refreshModeClass: function(prevClass) {
        prevClass && this.$element()
            .removeClass(DRAWER_CLASS + "-" + prevClass);

        this.$element().addClass(DRAWER_CLASS + "-" + this.option("showMode"));
    },

    _renderWrapper: function() {
        this._$wrapper = $("<div>").addClass(DRAWER_WRAPPER_CLASS);
        this.$element().append(this._$wrapper);
    },

    _renderButtonWrapper: function() {
        this._$buttonWrapper = $("<div>")
        .addClass(DRAWER_BUTTON_WRAPPER_CLASS)
        .appendTo(this._$wrapper);
    },

    _renderContentImpl: function() {
        this._$content = $("<div>").addClass(DRAWER_CONTENT_CLASS).appendTo(this._$wrapper);

        var contentTemplate = this._getTemplate(this.option("contentTemplate"));
        contentTemplate && contentTemplate.render({
            container: getPublicElement(this._$content),
            noModel: true
        });
    },

    _renderTitle: function() {
        var titleText = this.option("title"),
            showTitle = this.option("showTitle");


        if(showTitle && !!titleText) {
            this._$title && this._$title.remove();
            this._$title = $("<div>")
                .addClass(DRAWER_TITLE_CLASS)
                .appendTo(this._$buttonWrapper);

            this._$title.text(titleText);
            // this._$title = this._renderTemplateByType("titleTemplate", items, $title).addClass(POPUP_TITLE_CLASS);
            // this._executeTitleRenderAction(this._$title);
        } else if(this._$title) {
            this._$title.detach();
        }
    },

    _renderShader: function() {
        this._$shader = $("<div>").addClass(DRAWER_SCHADER_CLASS).appendTo(this.$element());
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "contentTemplate":
                this._invalidate();
                break;
            case "showTitle":
            case "title":
            case "titleTemplate":
                this._renderTitle();
                break;
            case "showMode":
                this._refreshModeClass(args.previousValue);
                break;
            default:
                this.callBase(args);
        }
    }
});

registerComponent("dxDrawer", Drawer);

module.exports = Drawer;
