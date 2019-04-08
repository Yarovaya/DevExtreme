import $ from "../../core/renderer";
import Button from "../button";
import translator from "../../animation/translator";
import messageLocalization from "../../localization/message";
import FunctionTemplate from "../widget/function_template";
import deferredUtils from "../../core/utils/deferred";

const DROPDOWN_APPOINTMENTS_CLASS = "dx-scheduler-dropdown-appointments",
    COMPACT_DROPDOWN_APPOINTMENTS_CLASS = DROPDOWN_APPOINTMENTS_CLASS + "-compact",
    DROPDOWN_APPOINTMENTS_CONTENT_CLASS = "dx-scheduler-dropdown-appointments-content";

const WEEK_VIEW_BUTTON_OFFSET = 5;

export class CompactAppointmentsHelper {
    constructor(instance) {
        this.instance = instance;
        this.elements = [];
    }

    render(options) {
        const { $container, buttonWidth, buttonHeight, items, isCompact, isVertical, coordinates, buttonColor } = options;
        const template = this._createTemplate(items.data.length, isCompact);
        const button = this._createCompactButton($container, buttonWidth, buttonHeight, template, items, isCompact, isVertical, coordinates);
        const $button = button.$element();

        this._makeBackgroundColor($button, items.colors, buttonColor);
        this._makeBackgroundDarker($button);

        this.elements.push($button);
        $button.data("items", this._createAppointmentsData(items));

        return $button;
    }

    clear() {
        this.elements.forEach(button => {
            button.detach();
            button.remove();
        });
        this.elements = [];
    }

    _createAppointmentsData(items) {
        return items.data.map((item, index) => {
            return {
                data: item,
                color: items.colors[index]
            };
        });
    }

    _onButtonClick(e) {
        const $button = $(e.element);
        this.instance.showAppointmentTooltipCore($button, $button.data("items"));
    }

    _getButtonOffset(width) {
        return this.instance.fire("getCellWidth") - width - WEEK_VIEW_BUTTON_OFFSET;
    }

    _makeBackgroundDarker(button) {
        button.css("boxShadow", `inset ${button.get(0).getBoundingClientRect().width}px 0 0 0 rgba(0, 0, 0, 0.3)`);
    }

    _makeBackgroundColor($button, colors, color) {
        deferredUtils.when.apply(null, colors).done(function() {
            this._makeBackgroundColorCore($button, color, arguments);
        }.bind(this));
    }

    _makeBackgroundColorCore($button, color, itemsColors) {
        let paintButton = true,
            currentItemColor;

        color && color.done(function(color) {
            if(itemsColors.length) {
                currentItemColor = itemsColors[0];

                for(let i = 1; i < itemsColors.length; i++) {
                    if(currentItemColor !== itemsColors[i]) {
                        paintButton = false;
                        break;
                    }
                    currentItemColor = color;
                }
            }
            color && paintButton && $button.css("backgroundColor", color);
        }.bind(this));
    }

    _setPosition(element, position) {
        translator.move(element, {
            top: position.top,
            left: position.left
        });
    }

    _createCompactButton($container, width, height, template, items, isCompact, isVertical, coordinates) {
        const $button = this._createCompactButtonElement($container, width, isCompact, isVertical, coordinates);

        return this.instance._createComponent($button, Button, {
            type: 'default',
            width: width,
            height: height,
            onClick: (e) => this._onButtonClick(e),
            template: this._renderTemplate(template, items, isCompact)
        });
    }

    _createCompactButtonElement($container, width, isCompact, isVertical, coordinates) {
        const result = $("<div>")
            .addClass(DROPDOWN_APPOINTMENTS_CLASS)
            .toggleClass(COMPACT_DROPDOWN_APPOINTMENTS_CLASS, isCompact)
            .appendTo($container);

        const offset = isVertical ? this._getButtonOffset(width) : 0;
        this._setPosition(result, { top: coordinates.top, left: coordinates.left + offset });

        return result;
    }

    _renderTemplate(template, items, isCompact) {
        return new FunctionTemplate(options => {
            return template.render({
                model: {
                    appointmentCount: items.data.length,
                    isCompact: isCompact
                },
                container: options.container
            });
        });
    }

    _createTemplate(count, isCompact) {
        this._initButtonTemplate(count, isCompact);
        return this.instance._getAppointmentTemplate("appointmentCollectorTemplate");
    }

    _initButtonTemplate(count, isCompact) {
        this.instance._defaultTemplates["appointmentCollector"] = new FunctionTemplate(options => {
            return this._createButtonTemplate(count, $(options.container), isCompact);
        });
    }

    _createButtonTemplate(appointmentCount, element, isCompact) {
        const text = isCompact ? appointmentCount : messageLocalization.getFormatter("dxScheduler-moreAppointments")(appointmentCount);

        return element
            .append($("<span>").text(text))
            .addClass(DROPDOWN_APPOINTMENTS_CONTENT_CLASS);
    }
}
