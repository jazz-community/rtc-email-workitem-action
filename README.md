[![Build Status](https://travis-ci.org/jazz-community/rtc-email-workitem-action.svg?branch=master)](https://travis-ci.org/jazz-community/rtc-email-workitem-action)

# Email Work Item Action for RTC
Have you ever wanted to send an RTC work item as an email? Maybe you need to send it to someone that doesn't even have an account on your Jazz server? You can now do that using this plugin.

This plugin provides a work item toolbar action for sending the work item using the local email client.

![Overview](https://github.com/jazz-community/rtc-email-workitem-action/blob/master/documentation/email-work-item-action.png)

## Usage
Simply click the email icon in the work item action toolbar. You'll see a popup with two options `Basic` and `Full`.
- `Basic` will create a minimal email body with only a few work item attributes.
- `Full` will create an email body also including the rest of the work item attributes.

After choosing the mode, click the `Open Email Client` button to open your email client (e.g. Outlook).

![Basic Email Example](https://github.com/jazz-community/rtc-email-workitem-action/blob/master/documentation/basic-email-example.png)

You can then choose who to send it to and optionally edit the text.

## Setup

### Download
You can find the latest release on the [releases page of this repository](https://github.com/jazz-community/rtc-email-workitem-action/releases).

### Installation
Deploy just like any other update site:

1. Extract the `com.siemens.bt.jazz.workitemeditor.rtcEmailWorkItemAction_updatesite.ini` **file** from the zip file to the `server/conf/ccm/provision_profiles` directory
2. Extract the `com.siemens.bt.jazz.workitemeditor.rtcEmailWorkItemAction_updatesite` **folder** to the `server/conf/ccm/sites` directory
3. Restart the server

### Updating an existing installation
1. Request a server reset in **one** of the following ways:
    * If the server is currently running, call `https://server-address/ccm/admin/cmd/requestReset`
    * Navigate to `https://server-address/ccm/admin?internaltools=true` so you can see the internal tools (on the left in the side-pane). Click on `Server Reset` and press the `Request Server Reset` button
    * If your server is down, you can delete the ccm `built-on.txt` file. Liberty packed with 6.0.3 puts this file in a subfolder of `server/liberty/servers/clm/workarea/org.eclipse.osgi/**/ccm`. The easiest way to locate the file is by using your operating system's search capabilities.
2. Delete previously deployed updatesite folder
3. Follow the file extraction steps from the section above
4. Restart the server

## Contributing
Please use the [Issue Tracker](https://github.com/jazz-community/rtc-email-workitem-action/issues) of this repository to report issues or suggest enhancements.

For general contribution guidelines, please refer to [CONTRIBUTING.md](https://github.com/jazz-community/welcome/blob/master/CONTRIBUTING.md).

## Licensing
Copyright (c) Siemens AG. All rights reserved.  
Licensed under the [MIT](https://github.com/jazz-community/rtc-email-workitem-action/blob/master/LICENSE) License.
