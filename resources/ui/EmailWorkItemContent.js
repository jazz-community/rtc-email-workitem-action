define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/query",
    "dojox/data/dom",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_FocusMixin",
    "dijit/focus",
    "dojo/text!./EmailWorkItemContent.html",
    "dojo/domReady!"
], function (declare, array, lang, dom, domAttr, domConstruct, on, query, dataDom,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FocusMixin,
    focus, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _FocusMixin], {
        templateString: template,
        workingCopy: null,
        visibleAttributes: null,
        newLine: "\n",

        constructor: function (params) {
            // Get the working copy object from the parameters
            this.workingCopy = params.workingCopy;

            // Get a list of all work item attributes that have values
            this.visibleAttributes = this._getVisibleAttributesFromWorkItem(this.workingCopy);

            console.log("this.workingCopy: ", this.workingCopy);
            console.log("this.visibleAttributes: ", this.visibleAttributes);
        },

        startup: function () {
            // Focus the dom node on startup so that when the user clicks
            // away the _onBlur event will be raised. This will cause the
            // containing hover view to be destroyed and removed from the dom.
            focus.focus(this.domNode);

            // Set the mailto link in the dom
            this._setMailtoLink();

            // Set the mailto link whenever a radio button is clicked
            query(".emailWorkItemContentRadioContainer .emailWorkItemContentRadio input[name=emailFormat]", this.domNode)
                .on("click", lang.hitch(this, this._setMailtoLink));
        },

        // Set the link href based on the work item data
        _setMailtoLink: function () {
            // Get the email subject string
            var subject = this._createSubjectString();

            // Get the basic version of the email body string
            var body = this._createBasicBodyString();

            // Check if the "Full" radio button is selected
            if (domAttr.get(dom.byId("emailWorkItemFullChoice"), "checked")) {
                // Add the additional string to the email body
                body += this._createAdditionalBodyString();
            }

            // Set the mailto link with the subject and body as the target of
            // the link in the dom.
            domAttr.set(this.mailtoLink, "href", this._createMailtoHref(subject, body));
        },

        // Put the subject and body into a mailto string
        _createMailtoHref: function (subject, body) {
            // Encode any special characters in the subject and body before
            // adding them to the mailto string.
            return "mailto:?to=&subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        },

        // Create the string to use as the email subject
        _createSubjectString: function () {
            var subject = "[Work Item ";
            subject += this._getVisibleAttributeValue("id");
            subject += "] ";
            subject += this._getVisibleAttributeValue("workItemType");
            subject += ": ";
            subject += this._getVisibleAttributeValue("summary");

            // The subject string will look something like this:
            // [Work Item 123] Defect: This is the summary.
            return subject;
        },

        // Create a plain text string with the summary and description for the email body
        _createBasicBodyString: function () {
            var body = this._getVisibleAttributeValue("workItemType");
            body += " ";
            body += this._getVisibleAttributeValue("id");
            body += this.newLine.repeat(2);
            body += "Web Url: " + this.workingCopy.object.locationUri;
            body += this.newLine.repeat(2);
            body += this._createLabelValueString("summary");
            body += this._createLabelValueString("description", true);

            // The basic email body only contains the type, id, url, summary, and description
            return body;
        },

        // Create a plain text string with the labels and values of the additional attributes
        _createAdditionalBodyString: function () {
            // Exclude some attributes because they are already in the basic body string
            var excludedAttributes = ["id", "workItemType", "summary", "description"];
            var body = "";

            // Iterate over all attributes in the visible attributes list
            array.forEach(this.visibleAttributes, function (attribute) {
                // Jump to the next iteration if this is an excluded attribute
                if (array.some(excludedAttributes, function (excludedAttribute) {
                    return excludedAttribute === attribute.id;
                })) {
                    return;
                }

                // Add the attribute label/value to the body string
                body += this._createLabelValueStringFromAttribute(attribute);
            }, this);

            // The body is a simple string with attribute labels and values:
            // Status: New // Followed by a new line
            return body;
        },

        // Create a label/value string using an attribute id
        _createLabelValueString: function (attributeId, multiLine) {
            // Get the attribute object using the attribute id
            var attribute = this._getVisibleAttribute(attributeId);

            // Return the label/value string created from the attribute object
            return this._createLabelValueStringFromAttribute(attribute, multiLine);
        },

        // Create a label/value string using an attribute object
        _createLabelValueStringFromAttribute: function (attribute, multiLine) {
            var result = "";

            // Leave the result empty if the attribute is missing
            if (attribute) {
                // Add the attribute label to the result
                result += attribute.label + ": ";

                // Check the multi line parameter
                if (multiLine) {
                    // Add a new line between the label and value
                    // if the multi line parameter is true
                    result += this.newLine;
                }

                // Add the attribute value followed by two new lines to the result
                result += attribute.value + this.newLine.repeat(2);
            }

            // Return the result in the following format:
            // Label: Value
            return result;
        },

        // Get an attribute object from the list of visible attributes using the
        // attribute id.
        _getVisibleAttribute: function (attributeId) {
            // The array "find" method will be available in Internet Explorer because
            // Jazz provides a pollyfill and it's added to the array prototype.
            return this.visibleAttributes.find(function (attribute) {
                return attribute.id === attributeId;
            });
        },

        // Get the attribute value from the list of visible attributes using the
        // attribute id.
        _getVisibleAttributeValue: function (attributeId) {
            // Get the attribute object using the attribute id
            var visibleAttribute = this._getVisibleAttribute(attributeId);

            // Return the attribute value or an empty string if the
            // attribute wasn't found.
            return visibleAttribute && visibleAttribute.value || "";
        },

        // Gets a list of all attributes that have a value
        _getVisibleAttributesFromWorkItem: function (workingCopy) {
            // Get all the attributes from the work item working copy
            var allAttributes = workingCopy.object.attributes;

            // Start an empty array for storing attributes that have values
            var visibleAttributes = [];

            // Iterate over all properties of the allAttributes object
            for (var attributeName in allAttributes) {
                // Check that the property is not an inherited property
                if (allAttributes.hasOwnProperty(attributeName)) {
                    // Get the attribute definition from the working copy using the attribute name
                    var attributeDefinition = workingCopy.getAttribute(attributeName);

                    console.log("attributeName: ", attributeName);
                    console.log("attributeDefinition: ", attributeDefinition);

                    // Check if we got an attribute definition
                    if (attributeDefinition) {
                        // Create the visible attribute object with the attribute id and label
                        var visibleAttribute = {
                            id: attributeDefinition.getIdentifier(),
                            label: attributeDefinition.getLabel()
                        };

                        // Get the attribute value from the working copy using the attribute name
                        var value = workingCopy.getValue({
                            path: ["attributes", attributeName]
                        });

                        // Check if the attribute value has a "label" property (most attributes)
                        if (value && value.label) {
                            // Use the attribute value label as the value
                            visibleAttribute.value = value.label;
                        } else if (value && value.content) {
                            // Use the "content" property if there is no "label" property.
                            // This is the case for HTML string attributes. That's why the
                            // HTML needs to be removed first.
                            visibleAttribute.value = this._getTextValue(value.content);
                        }

                        // Only add the attribute to the list of visible attributes if it has a value
                        if (visibleAttribute.value) {
                            visibleAttributes.push(visibleAttribute);
                        }
                    }
                }
            }

            // Return the list of attributes with values
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