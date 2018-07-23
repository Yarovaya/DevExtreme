"use strict";

import { animation } from "./ui.drawer.strategy";

var DrawerStrategy = require("./ui.drawer.strategy"),
    $ = require("../../core/renderer"),
    translator = require("../../animation/translator");


var TemporaryStrategy = DrawerStrategy.inherit({
    renderPosition: function(offset, animate) {
        var menuPos = this._drawer._calculatePixelOffset(offset) * this._drawer._getRTLSignCorrection();

        $(this._drawer.content()).css("paddingLeft", this._drawer.option("minWidth"));

        if(this._drawer.option("showMode") === "slide") {
            menuPos = this._drawer._calculatePixelOffset(offset) * this._drawer._getRTLSignCorrection();
            if(animate) {
                animation.moveTo($(this._drawer._$menu), menuPos, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
            } else {
                translator.move($(this._drawer._$menu), { left: menuPos });
            }
        }

        if(this._drawer.option("showMode") === "shrink") {
            var width = this._drawer._calculateMenuWidth(offset);
            if(animate) {
                animation.width($(this._drawer._$menu), width, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
            } else {
                $(this._drawer._$menu).css("width", width);
            }
        }
    }
});

module.exports = TemporaryStrategy;
