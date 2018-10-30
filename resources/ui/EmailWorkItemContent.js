define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojox/data/dom",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_FocusMixin",
    "dijit/focus",
    "dojo/text!./EmailWorkItemContent.html",
    "dojo/domReady!"
], function (declare, domConstruct, dataDom, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FocusMixin, focus, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FocusMixin], {
        templateString: template,
        workingCopy: null,
        visibleAttributes: null,

        constructor: function (params) {
            this.workingCopy = params.workingCopy;
            this.visibleAttributes = this._getVisibleAttributesFromWorkItem(this.workingCopy);

            console.log("this.workingCopy: ", this.workingCopy);
            console.log("this.visibleAttributes: ", this.visibleAttributes);
        },

        startup: function () {
            // Focus the dom node on startup so that when the user clicks
            // away the _onBlur event will be raised. This will cause the
            // containing hover view to be destroyed and removed from the dom.
            focus.focus(this.domNode);
        },

        // Gets a list of all attributes that have a value
        _getVisibleAttributesFromWorkItem: function (workingCopy) {
            var allAttributes = workingCopy.object.attributes;
            var visibleAttributes = [];

            for (var attributeName in allAttributes) {
                if (allAttributes.hasOwnProperty(attributeName)) {
                    console.log("attributeName: ", attributeName);
                    var attributeDefinition = workingCopy.getAttribute(attributeName);
                    console.log("attributeDefinition: ", attributeDefinition);

                    if (attributeDefinition) {
                        var visibleAttribute = {
                            id: attributeDefinition.getIdentifier(),
                            label: attributeDefinition.getLabel()
                        };
                        var value = workingCopy.getValue({
                            path: ["attributes", attributeName]
                        });

                        if (value && value.label) {
                            visibleAttribute.value = value.label;
                        } else if (value && value.content) {
                            visibleAttribute.value = this._getTextValue(value.content);
                        }

                        if (visibleAttribute.value) {
                            visibleAttributes.push(visibleAttribute);
                        }
                    }
                }
            }

            return visibleAttributes;
        },

        // Strip HTML tags from a string
        _getTextValue: function (textWithHtml) {
            textWithHtml = textWithHtml.replace(/<br\s*[\/]?>/gi, "\n");
            var div = domConstruct.create("div", {
                innerHTML: textWithHtml
            });
            return dataDom.textContent(div);
        }
    });
});