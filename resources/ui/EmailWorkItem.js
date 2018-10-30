define([
    "dojo/_base/declare",
    "./EmailWorkItemContent",
    "com.ibm.team.rtc.foundation.web.ui.views.HoverView",
    "com.ibm.team.rtc.foundation.web.ui.views.ViewUtils",
    "dojo/domReady!"
], function (declare, EmailWorkItemContent) {
    var HoverView = com.ibm.team.rtc.foundation.web.ui.views.HoverView;
    var ViewUtils = com.ibm.team.rtc.foundation.web.ui.views.ViewUtils;

    return declare("com.siemens.bt.jazz.workitemeditor.rtcEmailWorkItemAction.ui.EmailWorkItem",
        com.ibm.team.workitem.web.ui2.internal.action.AbstractAction,
    {
        buttonNode: null,

        constructor: function (params) {
            this.inherited(arguments);
        },

        initialize: function (initializer) {
            initializer();
        },

        _doRun: function (clickEvent) {
            this.buttonNode = clickEvent.currentTarget;

            this.inherited(arguments);
        },

        run: function (params) {
            var emailWorkItemContent = new EmailWorkItemContent();
            var hoverView = this.createHoverView(emailWorkItemContent);
        },

        // Hide the action for new work items
        isVisible: function (params) {
            return !this.workingCopy.isNew();
        },

        // Disable the action when there are changes
        isEnabled: function (params) {
            return !this.workingCopy.isChanged();
        },

        createHoverView: function (content) {
            var domNodePosition = ViewUtils.getDomNodePosition(this.buttonNode);
            return new HoverView({
                x: domNodePosition.x,
                y: domNodePosition.y,
                content: content
            }, null);
        }
    });
});