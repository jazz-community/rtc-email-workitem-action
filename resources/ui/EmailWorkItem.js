define([
    "dojo/_base/declare",
    "./EmailWorkItemContent",
    "com.ibm.team.rtc.foundation.web.ui.views.HoverView",
    "com.ibm.team.rtc.foundation.web.ui.views.ViewUtils",
    "com.ibm.team.workitem.web.ui2.internal.action.AbstractAction",
    "dojo/domReady!"
], function (declare, EmailWorkItemContent) {
    // Note that all of the above imports of ibm classes will log an error to the console but the classes are still loaded.
    // Using dojo.require doesn't log an error but also doesn't require the module when using AMD syntax.
    var HoverView = com.ibm.team.rtc.foundation.web.ui.views.HoverView;
    var ViewUtils = com.ibm.team.rtc.foundation.web.ui.views.ViewUtils;

    // Extend the AbstractAction class
    return declare("com.siemens.bt.jazz.workitemeditor.rtcEmailWorkItemAction.ui.EmailWorkItem",
        com.ibm.team.workitem.web.ui2.internal.action.AbstractAction,
    {
        contentWidth: 300, // Pixel width of the content. Needs to match what is set with CSS.
        buttonNode: null,

        // Call the inherited constructor
        constructor: function (params) {
            this.inherited(arguments);
        },

        // Run the initializer function to set the visible and enabled states
        initialize: function (initializer) {
            initializer();
        },

        // Override the _doRun function to get access to the event object
        _doRun: function (clickEvent) {
            // Get the button node from the event object
            this.buttonNode = clickEvent.currentTarget;

            // Call the inherited function (calls the run function)
            this.inherited(arguments);
        },

        // Called when the enabled button was clicked
        run: function (params) {
            // Create the content widget
            var emailWorkItemContent = new EmailWorkItemContent({ workingCopy: this.workingCopy });

            // Create the hover view and pass in the content widget
            this._createHoverView(emailWorkItemContent);
        },

        // Hide the action for new work items
        isVisible: function (params) {
            return !this.workingCopy.isNew();
        },

        // Disable the action when there are changes
        isEnabled: function (params) {
            return !this.workingCopy.isChanged();
        },

        // Create a hover view at the position of the action button
        // and set the content to the specified widget
        _createHoverView: function (content) {
            // Get the position of the action button
            var buttonPosition = ViewUtils.getDomNodePosition(this.buttonNode);

            // Create the hover view
            return new HoverView({
                x: buttonPosition.x - this.contentWidth,
                y: buttonPosition.y,
                content: content
            }, null);
        }
    });
});