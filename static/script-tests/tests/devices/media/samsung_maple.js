/**
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

jstestdriver.console.warn("devices/media/samsung_maple.js is poorly tested!");

(function() {

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/samsung_maple"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.SamsungMapleTest = AsyncTestCase("SamsungMapleTest");

    this.SamsungMapleTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        // If we don't have a TVMW plugin create it...
        this.createdTVMPlugin = false;
        this.tvmwPlugin = document.getElementById('pluginObjectTVMW');
        if (!this.tvmwPlugin) {
            this.tvmwPlugin = document.createElement('object');
            this.tvmwPlugin.id = 'pluginObjectTVMW';
            document.body.appendChild(this.tvmwPlugin);
            this.createdTVMPlugin = true;

            this.tvmwPlugin.GetSource = this.sandbox.stub();

        } else {
            this.sandbox.stub(this.tvmwPlugin, "GetSource");
        }

        // If we don't have a Player plugin create it...
        this.createdPlayerPlugin = false;
        this.playerPlugin = document.getElementById('playerPlugin');
        if (!this.playerPlugin) {
            this.playerPlugin = document.createElement('object');
            this.playerPlugin.id = 'playerPlugin';
            document.body.appendChild(this.playerPlugin);
            this.createdPlayerPlugin = true;
        }
    };

    this.SamsungMapleTest.prototype.tearDown = function() {
        this.sandbox.restore();

        // Get rid of the TVMW plugin if we've created it.
        if (this.createdTVMPlugin) {
            document.body.removeChild(this.tvmwPlugin);
            this.tvmwPlugin = null;
        }

        // Get rid of the Player plugin if we've created it.
        if (this.createdPlayerPlugin) {
            document.body.removeChild(this.playerPlugin);
            this.playerPlugin = null;
        }
    };

    this.SamsungMapleTest.prototype.testCreateMediaInterfaceReturnsSamsungMaplePlayerWhenSamsungMapleDeviceModifierUsed = function (queue) {
        expectAsserts(1);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple"],
            function(application, SamsungMaplePlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                var result = device.createMediaInterface("id", "video", callbackStub);

                assertInstanceOf(SamsungMaplePlayer, result);
            }, config);
    };

    this.SamsungMapleTest.prototype.testCreateMediaInterfacePassesArgumentsThroughToSamsungMaplePlayerConstructorWhenSamsungMapleDeviceModifierUsed = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple"],
            function(application, SamsungMaplePlayer) {

                var spy = self.sandbox.spy(SamsungMaplePlayer.prototype, "init");
                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                device.createMediaInterface("id", "video", callbackStub);

                assertTrue(spy.calledOnce);
                assertTrue(spy.calledWith("id", "video", callbackStub));
            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnBufferingStartFunctionPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/events/mediaevent"],
            function(application, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnBufferingStart();

                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals('waiting', callbackStub.args[0][0].type);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnBufferingCompleteFunctionPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/events/mediaevent"],
            function(application, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnBufferingComplete();

                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals('playing', callbackStub.args[0][0].type);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnConnectionFailedFunctionPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/events/mediaerrorevent"],
            function(application, MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnConnectionFailed();

                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertEquals('Connection failed', callbackStub.args[0][0].code);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnNetworkDisconnectedFunctionPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/events/mediaerrorevent"],
            function(application, MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnNetworkDisconnected();

                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertEquals('Network disconnected', callbackStub.args[0][0].code);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnRenderErrorFunctionPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/events/mediaerrorevent"],
            function(application, MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnRenderError();

                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertEquals('Render error', callbackStub.args[0][0].code);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnStreamNotFoundFunctionPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/events/mediaerrorevent"],
            function(application, MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnStreamNotFound();

                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertEquals('Stream not found', callbackStub.args[0][0].code);

            }, config);
    };


})();
