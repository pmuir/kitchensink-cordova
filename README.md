AeroGear Cordova Kitchensink Quickstart
=======================================
Author: Kris Borchers

Summary
-------
This project serves as an example of AeroGear's [kitchensink quickstart](http://www.github.com/aerogear/as-quickstarts/tree/master/kitchensink-html5-mobile),
converted to an [Apache Cordova](http://incubator.apache.org/cordova/) based, hybrid application. What does all of that
mean? Basically, this takes our [POH5](https://community.jboss.org/wiki/POH5PlainOldHTML5Applications) /
[jQuery Mobile](http://www.jquerymobile.com) based web app and converts it to a native app for both iOS and
Android. Currently, these apps will need to be built separately but in the future, we hope to provide a single build
step for all supported mobile OS types.

Repo Structure
--------------
Before getting started, it is important to note the structure of this repo and how it may effect your environment. In
order to avoid duplicating both files and effort, the web app assets (HTML, CSS, JS) files have been housed in a
separate folder called `shared`. In there, you will find a folder called `www` under which are the files. In order for
this structure to work during your builds, a symbolic link to the `www` folder from each of the app's respective `www`
folders has been created. In iOS, that is in the `/ios/KitchensinkCordova` folder and in Android, the symbolic link is
in the `/android/assets` folder.

iOS Build
---------

### System Requirements

* A Mac running OSX 10.7 Lion or later
* XCode 4.3 or later
* The appropriate iOS SDK for your needs
* To test on iOS devices instead of the simulator:
 * An Apple Developer account
 * An iOS Development Certificate
 * A provisioning profile for each device you plan to test with

### Building the App for the Simulator
First, we will look at building the app for the iOS Simulator. Once you have cloned the repo, it is time to start the
build process. In order to build a Cordova iOS app, you need to install CordovaLib, Cordova Framework and Cordova
XCode templates. At this time, there is not a pre-built installer so it must be built from source before it can be
installed. Go to <https://github.com/apache/incubator-cordova-ios>, click the Tags link and download the latest release
which at this time is 1.5.0. Unzip the file to a known location, then follow the instructions
[here](https://github.com/apache/incubator-cordova-ios) under the section titled "Build and install the Installer
Package".

Next, just open Xcode, then select File -> Open, then browse to the `<repo-folder>/ios/KitchensinkCordova`
folder and select the KitchensinkCordova.xcodeproj file. Click Open and you should see the project in XCode. If the
`www` folder is not visible in the project or appears broken, that means your OS was unable to create the symbolic
link from the file in the repo. If it is there but XCode shows it as missing or broken, all you have to do is create the
symbolic link. Now you can just open Terminal, navigate to the `<repo-folder>/ios/KitchensinkCordova` folder and then
create the link like this:

	ln -s <full-path-to-your-repo>/shared/www www

This will create the symbolic link and the folder should be fixed in XCode. If the folder is missing, there is a little
trick that you have to do to get XCode to see it. First in the `<repo-folder>/ios/KitchensinkCordova` delete the www
file which came from the repo if it exists. Then create a new folder called `www`. Now from finder, drag that folder
into XCode and drop it on the KitchensinkCordova project on the left side of the window. A dialog window should appear
and you want to select the option to add the folder as a reference. You should now see that folder listed in XCode.
This is where it gets tricky. Go back to Finder and delete the `www` folder you just created. It will now show as
broken in XCode but that's ok. In Terminal, create the symbolic link using the instructions above and you should be
ready to go.

The last step before we can test is to update the path to our Cordova JavaScript file. In order to share the `www`
resources, a placeholder has been added to the index.html file that must be replaced with the path to the appropriate
Cordova file for the app you are building.

In XCode, expand the `www` folder and click on the `index.html` file. This will open the file for editing in the center
pane in XCode. Around line 40, you should see

	<!-- Cordova script will be replaced with appropriate version at build time -->
	<script type="text/javascript" src="{{CORDOVA_SCRIPT}}"></script>

Replace the `{{CORDOVA_SCRIPT}}` with `js/libs/cordova-ios-1.5.0.js` and save the file. That's it! You should now be
ready to see it in action. Click the Run button in the upper left corner of XCode and the iOS Simulator should start
and you will see the Kitchensink app running. Going to the list page should show you the list of members from
[poh5-aerogear.rhcloud.com](http://poh5-aerogear.rhcloud.com), which is the [OpenShift](http://openshift.redhat.com)
hosted version of the AeroGear kitchensink quickstart. You can also add to that member list from the add screen of
the app and also on that add screen, you will see a note referring to your current network connection. That note is
proof that Cordova has given you access to native APIs.

### Building the App for Devices

Coming Soon!

Android Build
-------------

### System Requirements

Coming Soon!

### Building the App for the Simulator

Coming Soon!

### Building the App for Devices

Coming Soon!
