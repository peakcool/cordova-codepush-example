/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        window.codePush.notifyApplicationReady();
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        // App version 1 (current version)

        var onError = function (error) {
            console.log("An error occurred. " + error);
        };

        var onInstallSuccess = function () {
            console.log("Installation succeeded.");
        };

        var onPackageDownloaded = function (localPackage) {
            // Install regular updates after someone navigates away from the app for more than 2 minutes
            // Install mandatory updates after someone restarts the app
            localPackage.install(onInstallSuccess, onError, { installMode: InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 120, mandatoryInstallMode: InstallMode.ON_NEXT_RESTART });
        };

        var onUpdateCheck = function (remotePackage) {
            if (!remotePackage) {
                console.log("The application is up to date.");
            } else {
                // The hash of each previously reverted package is stored for later use. 
                // This way, we avoid going into an infinite bad update/revert loop.
                if (!remotePackage.failedInstall) {
                    console.log("A CodePush update is available. Package hash: " + remotePackage.packageHash);
                    remotePackage.download(onPackageDownloaded, onError);
                } else {
                    console.log("The available update was attempted before and failed.");
                }
            }
        };

        window.codePush.checkForUpdate(onUpdateCheck, onError);
     }
};

app.initialize();