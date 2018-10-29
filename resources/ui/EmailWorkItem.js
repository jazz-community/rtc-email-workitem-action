define([
    "dojo/_base/declare"
], function (declare) {
    return declare("com.siemens.bt.jazz.workitemeditor.rtcEmailWorkItemAction.ui.EmailWorkItem",
        com.ibm.team.workitem.web.ui2.internal.action.AbstractAction,
    {
        constructor: function (params) {
            console.log("EmailWorkItem constructor arguments", arguments);
        },

        isEnabled: function (params) {
            return true; // Should this always be enabled or only when not changed?
        },

        run: function () {
            alert("Running EmailWorkItem action");
        }
    });
});