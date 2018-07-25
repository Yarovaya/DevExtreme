"use strict";

import { animation } from "./ui.drawer.rendering.strategy";

var DrawerStrategy = require("./ui.drawer.rendering.strategy"),
    $ = require("../../core/renderer"),
    translator = require("../../animation/translator");


var TemporaryStrategy = DrawerStrategy.inherit({
    renderPosition: function(offset, animate) {
        this.callBase(offset, animate);

        var menuPos = this._getMenuOffset(offset) * this._drawer._getRTLSignCorrection();

        $(this._drawer.content()).css("paddingLeft", this._drawer.option("minWidth"));

        if(this._drawer.option("showMode") === "slide") {
            if(animate) {
                animation.moveTo($(this._drawer._$menu), menuPos, this._drawer.option("animationDuration"), (function() {
                    this._contentAnimation.resolve();
                    this._menuAnimation.resolve();
                }).bind(this));
            } else {
                translator.move($(this._drawer._$menu), { left: menuPos });
            }
        }

        if(this._drawer.option("showMode") === "shrink") {
            var width = this._getMenuWidth(offset);
            if(animate) {
                animation.width($(this._drawer._$menu), width, this._drawer.option("animationDuration"), (function() {
                    this._contentAnimation.resolve();
                    this._menuAnimation.resolve();
                }).bind(this));
            } else {
                $(this._drawer._$menu).css("width", width);
            }
        }
    }
});

module.exports = TemporaryStrategy;
