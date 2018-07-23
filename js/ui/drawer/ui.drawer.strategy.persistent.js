"use strict";

import { animation } from "./ui.drawer.strategy";

var DrawerStrategy = require("./ui.drawer.strategy"),
    $ = require("../../core/renderer"),
    translator = require("../../animation/translator");


var PersistentStrategy = DrawerStrategy.inherit({
    renderPosition: function(offset, animate) {
        var width = this._drawer._calculateMenuWidth(offset);

        var contentPos = width;

        translator.move($(this._drawer.content()), { left: 0 });

        if(animate) {
            animation.paddingLeft($(this._drawer.content()), contentPos, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
        } else {
            $(this._drawer.content()).css("paddingLeft", contentPos);
        }

        if(this._drawer.option("showMode") === "slide") {
            var menuPos = this._drawer._calculatePixelOffset(offset) * this._drawer._getRTLSignCorrection();
            if(animate) {
                animation.moveTo($(this._drawer._$menu), menuPos, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
            } else {
                translator.move($(this._drawer._$menu), { left: menuPos });
            }
        }

        if(this._drawer.option("showMode") === "shrink") {
            width = this._calculateMenuWidth(offset);
            if(animate) {
                animation.width($(this._drawer._$menu), width, this._drawer.option("animationDuration"), this._drawer._animationCompleteHandler.bind(this._drawer));
            } else {
                $(this._$menu).css("width", width);
            }
        }
    }
});

module.exports = PersistentStrategy;
