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

jstestdriver.console.warn("devices/media/cehtml.js poorly tested!");


(function() {

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/cehtml"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.CEHTMLTest = AsyncTestCase("CEHTML Media Device Modifier");

    this.CEHTMLTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.CEHTMLTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.CEHTMLTest.prototype.testCreateMediaInterfaceReturnsCEHTMLPlayerWhenCEHTMLDeviceModifierUsed = function (queue) {
        expectAsserts(1);

        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                var result = device.createMediaInterface("id", "video", callbackStub);

                assertInstanceOf(CEHTMLPlayer, result);
            }, config);
    };

    this.CEHTMLTest.prototype.testCreateMediaInterfacePassesArgumentsThroughToCEHTMLPlayerConstructorWhenCEHTMLDeviceModifierUsed = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var spy = self.sandbox.spy(CEHTMLPlayer.prototype, "init");
                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                device.createMediaInterface("id", "video", callbackStub);

                assertTrue(spy.calledOnce);
                assertTrue(spy.calledWith("id", "video", callbackStub));
            }, config);
    };

    this.CEHTMLTest.prototype.testSetSourcesCausesCanPlayEventCallback = function (queue) {
        expectAsserts(3);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent"],
            function(application, CEHTMLPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertTrue(callbackStub.calledOnce);
                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals("canplay", callbackStub.args[0][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testSetSourcesAddsOnPlayStateChangeFunctionToMediaElement = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                assertUndefined(mediaElement.onPlayStateChange);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);


            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesErrorsToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaerrorevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaErrorEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                mediaElement.playState = 6;
                mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaErrorEvent, callbackStub.args[1][0]);
                assertEquals(0, callbackStub.args[1][0].code);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesEndedMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                mediaElement.playState = 5;
                mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('ended', callbackStub.args[1][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                mediaElement.playState = 4;
                mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('waiting', callbackStub.args[1][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesLoadStartMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                mediaElement.playState = 3;
                mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('loadstart', callbackStub.args[1][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesPauseMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                mediaElement.playState = 2;
                mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('pause', callbackStub.args[1][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesPlayLifecycleMediaEventsToEventHandlingCallback = function (queue) {
        expectAsserts(11);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");
                mediaElement.stop = this.sandbox.stub();

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                mediaElement.playState = 1;
                mediaElement.onPlayStateChange();

                assertEquals(5, callbackStub.callCount);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('loadedmetadata', callbackStub.args[1][0].type);

                assertInstanceOf(MediaEvent, callbackStub.args[2][0]);
                assertEquals('canplaythrough', callbackStub.args[2][0].type);

                assertInstanceOf(MediaEvent, callbackStub.args[3][0]);
                assertEquals('play', callbackStub.args[3][0].type);

                assertInstanceOf(MediaEvent, callbackStub.args[4][0]);
                assertEquals('playing', callbackStub.args[4][0].type);

                // Clean up to stop launched timer...
                mediaInterface.stop();

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesTimeUpdateMediaEventsToEventHandlingCallbackEvery900MillisecondsAfterPlayEvent = function (queue) {
        expectAsserts(6);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");
                mediaElement.stop = this.sandbox.stub();

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);

                var clock = sinon.useFakeTimers();
                // t = 0

                mediaElement.playState = 1;
                mediaElement.onPlayStateChange();

                assertEquals(5, callbackStub.callCount);

                clock.tick(899);
                // t = 899;

                assertEquals(5, callbackStub.callCount);

                clock.tick(2);
                // t = 901;

                assertEquals(6, callbackStub.callCount);

                assertInstanceOf(MediaEvent, callbackStub.args[5][0]);
                assertEquals('timeupdate', callbackStub.args[5][0].type);

                clock.restore();

                // Clean up to stop launched timer...
                mediaInterface.stop();


            }, config);
    };


    this.CEHTMLTest.prototype.testMediaElementHasCorrectStyleSet = function (queue) {
        expectAsserts(4);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                device.createMediaInterface("id", "video", callbackStub);

                assertEquals("100%", mediaElement.style.width);
                assertEquals("100%", mediaElement.style.height);
                assertEquals("absolute", mediaElement.style.position);
                assertEquals("-1", mediaElement.style.zIndex);
            }, config);
    };

    this.CEHTMLTest.prototype.testSeekStateIsCalledWithEventHandlingCallbackWhenCreateMediaInterfaceIsCalled = function(queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/seekstate"],
            function(application, SeekState) {

                var eventHandlingCallbackStub = self.sandbox.stub();
                var seekStateSpy = self.sandbox.spy(SeekState.prototype, "init");

                application.getDevice().createMediaInterface("id", "video", eventHandlingCallbackStub);

                assertTrue(seekStateSpy.calledOnce);
                assertSame(eventHandlingCallbackStub, seekStateSpy.args[0][0]);

            }, config);
    };

    this.CEHTMLTest.prototype.testSeekStateIsCalledWithEventHandlingCallbackWhenSetSourcesIsCalled = function(queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/seekstate"],
            function(application, SeekState) {

                var eventHandlingCallbackStub = self.sandbox.stub();
                var seekStateSpy = self.sandbox.spy(SeekState.prototype, "init");

                var mediaInterface = application.getDevice().createMediaInterface("id", "video", eventHandlingCallbackStub);
                mediaInterface.setSources([
                    {
                        getURL : function() { return "url"; },
                        getContentType : function() { return "video/mp4"; }
                    }
                ], { });

                assertTrue(seekStateSpy.calledTwice);
                assertSame(eventHandlingCallbackStub, seekStateSpy.args[1][0]);

            }, config);
    };

})();
