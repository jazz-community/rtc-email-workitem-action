define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojox/data/dom",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_FocusMixin",
    "dijit/focus",
    "dojo/text!./EmailWorkItemContent.html",
    "dojo/domReady!"
], function (declare, array, domAttr, domConstruct, dataDom, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FocusMixin, focus, template) {
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

            // Set the mailto link
            this._setMailtoLink();
        },

        // Set the link href based on the work item data
        _setMailtoLink: function () {
            var subject = this._createSubjectString();
            var body = this._createBasicBodyString();

            // Only add the additional string when the radio button is set to "full"
            body += this._createAdditionalBodyString();
            domAttr.set(this.mailtoLink, "href", this._createMailtoHref(subject, body));
        },

        // Put the subject and body into a mailto string
        _createMailtoHref: function (subject, body) {
            return "mailto:?to=&subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        },

        _createSubjectString: function () {
            var subject = "Emailing Work Item: ";
            subject += this._getVisibleAttributeValue("workItemType");
            subject += " ";
            subject += this._getVisibleAttributeValue("id");
            subject += " (";
            subject += this._getVisibleAttributeValue("summary");
            subject += ")";

            return subject;
        },

        _createBasicBodyString: function () {
            var newLine = "\n";
            var body = this._getVisibleAttributeValue("workItemType");
            body += " ";
            body += this._getVisibleAttributeValue("id");
            body += newLine.repeat(2);
            body += "Web Url: " + this.workingCopy.object.locationUri;
            body += newLine.repeat(2);
            body += this._createBodyLabelValueString(this._getVisibleAttributeLabel("summary") + ": ", this._getVisibleAttributeValue("summary"));
            body += this._createBodyLabelValueString(this._getVisibleAttributeLabel("description") + ": ", this._getVisibleAttributeValue("description"), true);

            return body;
        },

        _createAdditionalBodyString: function () {
            var excludedAttributes = ["id", "workItemType", "summary", "description"];
            var body = "";

            array.forEach(this.visibleAttributes, function (attribute) {
                if (array.some(excludedAttributes, function (excludedAttribute) {
                    return excludedAttribute === attribute.id;
                })) {
                    return;
                }

                body += this._createBodyLabelValueString(this._getVisibleAttributeLabel(attribute.id) + ": ", this._getVisibleAttributeValue(attribute.id));
            }, this);

            return body;
        },

        _createBodyLabelValueString: function (label, value, multiLine) {
            var newLine = "\n";
            var result = label;

            if (multiLine) {
                result += newLine;
            }

            result += value + newLine.repeat(2);

            return result;
        },

        _getVisibleAttribute: function (attributeId) {
            // Change this to not use "find" so that it will work in internet explorer
            var visibleAttribute = this.visibleAttributes.find(function (attribute) {
                return attribute.id === attributeId;
            });

            return visibleAttribute;
        },

        _getVisibleAttributeLabel: function (attributeId) {
            var visibleAttribute = this._getVisibleAttribute(attributeId);

            return visibleAttribute && visibleAttribute.label || "";
        },

        _getVisibleAttributeValue: function (attributeId) {
            var visibleAttribute = this._getVisibleAttribute(attributeId);

            return visibleAttribute && visibleAttribute.value || "";
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
            // Replace br tags with new lines
            textWithHtml = textWithHtml.replace(/<br\s*[\/]?>/gi, "\n");

            // Create a div containing the HTML of the passed in string
            var div = domConstruct.create("div", {
                innerHTML: textWithHtml
            });

            // Get the text without the HTML tags
            return dataDom.textContent(div);
        }
    });
});