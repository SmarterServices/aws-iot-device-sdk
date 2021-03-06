/*
 * Copyright 2010-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

//node.js deps

//npm deps

//app deps
var assert = require('assert');
var sinon = require('sinon');
var mqtt = require('mqtt');
var device = require('../device');
var mockMQTTClient = require('./mock/mockMQTTClient');

describe( "thing shadow class unit tests", function() {
    var thingShadow = require('..').thingShadow;
    var mockMQTTClientObject;

    // Mock the connect API for mqtt.js
    var fakeConnect = sinon.spy(function(wrapper,options) {
        mockMQTTClientObject = new mockMQTTClient(); // return the mocking object
        mockMQTTClientObject.reInitCommandCalled();
        mockMQTTClientObject.resetPublishedMessage();
        return mockMQTTClientObject;
    });

    sinon.stub(mqtt, 'MqttClient', fakeConnect);

  // Test cases begin
  describe( "register a thing shadow name", function() {
//
// Verify that the thing shadow module does not throw an exception
// when all connection parameters are specified and we register and
// unregister thing shadows.
//
      it("does not throw an exception", function() { 
         assert.doesNotThrow( function( err ) { 
            var thingShadows = thingShadow( { 
               keyPath:'test/data/private.pem.key', 
               certPath:'test/data/certificate.pem.crt', 
               caPath:'test/data/root-CA.crt',
               clientId:'dummy-client-1',
               region:'us-east-1'
               }  );

               thingShadows.register( 'testShadow1' );
               thingShadows.unregister( 'testShadow1' );
            }, function(err) { console.log('\t['+err+']'); return true; }
            ); 
      });
   });

   describe( "subscribe to/unsubscribe from a non-thing topic", function() {
//
// Verify that the thing shadow module does not throw an exception
// when we subscribe to and unsubscribe from a non-thing topic.
//
      it("does not throw an exception", function() { 
         assert.doesNotThrow( function( err ) { 
            var thingShadows = thingShadow( { 
               keyPath:'test/data/private.pem.key', 
               certPath:'test/data/certificate.pem.crt', 
               caPath:'test/data/root-CA.crt',
               clientId:'dummy-client-1',
               region:'us-east-1'
               } );
               thingShadows.subscribe( 'nonThingTopic1' );
               thingShadows.unsubscribe( 'nonThingTopic1' );
            }, function(err) { console.log('\t['+err+']'); return true;}
            ); 
      });
   });

   describe( "publish to a non-thing topic", function() {
//
// Verify that the thing shadow module does not throw an exception
// when we publish to a non-thing topic.
//
      it("does not throw an exception", function() { 
         assert.doesNotThrow( function( err ) { 
            var thingShadows = thingShadow( { 
               keyPath:'test/data/private.pem.key', 
               certPath:'test/data/certificate.pem.crt', 
               caPath:'test/data/root-CA.crt',
               clientId:'dummy-client-1',
               region:'us-east-1'
               } );
               thingShadows.publish( 'nonThingTopic1', { data: 'value' } );
            }, function(err) { console.log('\t['+err+']'); return true;}
            ); 
      });
   });

   describe( "subscribe to an illegal non-thing topic", function() {
//
// Verify that the thing shadow module throws an exception if we
// attempt to subscribe to an illegal non-thing topic.
//
      it("throws an exception", function() { 
         assert.throws( function( err ) { 
            var thingShadows = thingShadow( { 
               keyPath:'test/data/private.pem.key', 
               certPath:'test/data/certificate.pem.crt', 
               caPath:'test/data/root-CA.crt',
               clientId:'dummy-client-1',
               region:'us-east-1'
               } );
               thingShadows.subscribe( '$aws/things/nonThingTopic1' );
            }, function(err) { console.log('\t['+err+']'); return true;}
            ); 
      });
   });

   describe( "publish to an illegal non-thing topic", function() {
//
// Verify that the thing shadow module throws an exception if we
// attempt to publish to an illegal non-thing topic.
//
      it("throws an exception", function() { 
         assert.throws( function( err ) { 
            var thingShadows = thingShadow( { 
               keyPath:'test/data/private.pem.key', 
               certPath:'test/data/certificate.pem.crt', 
               caPath:'test/data/root-CA.crt',
               clientId:'dummy-client-1',
               region:'us-east-1'
               } );
               thingShadows.publish( '$aws/things/nonThingTopic1', 
                                     { data: 'value' } );
            }, function(err) { console.log('\t['+err+']'); return true;}
            ); 
      });
   });

   describe( "unsubscribe from an illegal non-thing topic", function() {
//
// Verify that the thing shadow module throws an exception if we
// attempt to unsubscribe from an illegal non-thing topic.
//
      it("throws an exception", function() { 
         assert.throws( function( err ) { 
            var thingShadows = thingShadow( { 
               keyPath:'test/data/private.pem.key', 
               certPath:'test/data/certificate.pem.crt', 
               caPath:'test/data/root-CA.crt',
               clientId:'dummy-client-1',
               region:'us-east-1'
               } );
               thingShadows.unsubscribe( '$aws/things/nonThingTopic1' );
            }, function(err) { console.log('\t['+err+']'); return true;}
            ); 
      });
   });

//
// Verify that the thing shadow module does not throw an exception
// when the end() method is invoked.
//
   describe( "end method does not throw an exception", function() {
      it("does not throw an exception", function() { 
         assert.doesNotThrow( function( err ) { 
            var thingShadows = thingShadow( { 
               keyPath:'test/data/private.pem.key', 
               certPath:'test/data/certificate.pem.crt', 
               caPath:'test/data/root-CA.crt',
               clientId:'dummy-client-1',
               region:'us-east-1'
               }  );

               thingShadows.end( true );
            }, function(err) { console.log('\t['+err+']'); return true;}
            ); 
      });
   });

/**** shadow register/unregister ****/
//
// Verify that the corresponding delta topic is subscribed after the registration of a thing shadow
// if the user is interested in delta (default), and is unsubscribed when unregistered.
//
    describe("Thing shadow registration/unregistration", function(){
    	it("properly subscribes/unsubscribes to delta topic", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          // Init thingShadowsClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing, using default delta settings
          thingShadows.register('testShadow1');
          assert.equal(mockMQTTClientObject.commandCalled['subscribe'], 2); // Called twice, one for delta, one for GUD
          mockMQTTClientObject.reInitCommandCalled();
          thingShadows.unregister('testShadow1');
          assert.equal(mockMQTTClientObject.commandCalled['unsubscribe'], 2);
    	});
    });

//
// Verify that the delta topic is never subscribed when the option ignoreDeltas is set to be true
//
    describe("Thing shadow registration with ignoreDeltas set to be true", function() {
      it("never subscribes to delta topic", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1',
            debug: true
          } );
          // Register a thing, using default delta settings
          thingShadows.register('testShadow1', {ignoreDeltas:true});
          assert.equal(mockMQTTClientObject.commandCalled['subscribe'], 1); // Called once, for GUD
          // Register it again and make sure no additional subscriptions
          // were generated; this will also generate a console warning 
          // since the device was instantiated with debug===true
          thingShadows.register('testShadow1', {ignoreDeltas:true});
          assert.equal(mockMQTTClientObject.commandCalled['subscribe'], 1); // Called once, for GUD
          mockMQTTClientObject.reInitCommandCalled();
          thingShadows.unregister('testShadow1');
          assert.equal(mockMQTTClientObject.commandCalled['unsubscribe'], 2); // Called twice, unsub from ALL
      });
    });

//
// Verify that registering a thing shadow with malformed inputs should be ignored.
//
    describe("Thing shadow registration with malformed options", function() {
    	it("should properly ignore them", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );

          assert.doesNotThrow(function(err) {
            thingShadows.register('testShadow1', {troubleMaker:123});
            thingShadows.unregister('testShadow1');
          }, function(err) {console.log('\t['+err+']'); return true;}
          );
    	});
    });

//
// Verify that unregistering a thing shadow that is never registered is ignored.
//
    describe("Unregister a thing shadow that is never registered", function() {
    	it("should properly ignore it", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );

          assert.doesNotThrow(function(err) {
            thingShadows.unregister('IamNeverRegistered');
          }, function(err) {console.log('\t['+err+']'); return true;});
    	});
    });

//
// Verify that new delta messages with bigger version number triggers the callback.
//
    describe("Incoming delta message with bigger version number", function() {
    	it("should call the corresponding callback", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing
          thingShadows.register('testShadow2');
          // Register a fake callback
          var fakeCallback = sinon.spy();
          thingShadows.on('delta', fakeCallback);
          // Now emit a message from delta topic
          mockMQTTClientObject.emit('message', '$aws/things/testShadow2/shadow/update/delta', '{"version":3}');
          // Now emit another message from  delta topic again, with bigger version number
          mockMQTTClientObject.emit('message', '$aws/things/testShadow2/shadow/update/delta', '{"version":5}');
          // Check spy
          assert(fakeCallback.calledTwice);
          // clean up
          thingShadows.unregister('testShadow2');
    	});
    });

//
// Verify that new delta message with smaller version number does not trigger the callback.
//
    describe("Incoming delta message with smaller version number", function() {
    	it("should never call callback", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1',
            debug: true
          } );
          // Register a thing
          thingShadows.register('testShadow2');
          // Register a fake callback
          var fakeCallback = sinon.spy();
          thingShadows.on('delta', fakeCallback);
          // Now emit a message from delta topic
          mockMQTTClientObject.emit('message', '$aws/things/testShadow2/shadow/update/delta', '{"version":3}');
          // Now emit another message from  delta topic again, with bigger version number
          mockMQTTClientObject.emit('message', '$aws/things/testShadow2/shadow/update/delta', '{"version":1}');
          // Check spy
          assert(fakeCallback.calledOnce);
          // clean up
          thingShadows.unregister('testShadow2');
    	});
    });

//
// Verify that the delta message from some unregistered thing does not trigger the callback.
//
    describe("Incoming delta message from unregistered thing", function() {
      it("should never call callback", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing
          thingShadows.register('testShadow2');
          // Register a fake callback
          var fakeCallback = sinon.spy();
          thingShadows.on('delta', fakeCallback);
          // Now emit a message from delta topic for some other thing
          mockMQTTClientObject.emit('message', '$aws/things/IamNeverRegistered/shadow/update/delta', '{"version":3}');
          // Check spy
          sinon.assert.notCalled(fakeCallback);
          // clean up
          thingShadows.unregister('testShadow2');
      });
    });

/**** shadow get/delete ****/
//
// Verify that a message without clientToken is properly published
// when a shadow Get request is issued.
//
    describe("No token is specified for shadow Get/Delete", function() {
      it("should generate a token", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Faking timer
          var clock = sinon.useFakeTimers();
          // Faking callback
          var fakeCallback = sinon.spy();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          }, {  
            operationTimeout:1000 // Set operation timeout to be 1 sec
          } );
          // Register callback
          thingShadows.on('timeout', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow3');
          // Fire a shadow get
          var thisToken = thingShadows.get('testShadow3');
          clock.tick(3000); // 3 sec later...
          assert(fakeCallback.calledOnce);
          assert.equal(mockMQTTClientObject.lastPublishedMessage, '{"clientToken":"dummy-client-1-0"}');
          mockMQTTClientObject.resetPublishedMessage();
          thatToken = thingShadows.delete('testShadow3');
          clock.tick(3000); // 3 sec later...
          assert(fakeCallback.calledTwice);
          assert.equal(mockMQTTClientObject.lastPublishedMessage, '{"clientToken":"dummy-client-1-1"}');
          assert.equal(mockMQTTClientObject.commandCalled['publish'], 2);
          // Unregister it
          thingShadows.unregister('testShadow3');
      });
    });

//
// Verify that a message containing clientToken is properly published
// when a shadow Get request is issued.
//
    describe("User clientToken is specified for shadow Get/Delete", function() {
      it("should keep and use the user token", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Faking timer
          var clock = sinon.useFakeTimers();
          // Faking callback
          var fakeCallback = sinon.spy();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          }, {
            operationTimeout:1000 // Set operation timeout to be 1 sec
          } );
          // Register callback
          thingShadows.on('timeout', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow3');
          // Fire a shadow get
          var thisToken = thingShadows.get('testShadow3', 'CoolToken1');
          clock.tick(3000); // 3 sec later...
          assert(fakeCallback.calledOnce);
          assert.equal(mockMQTTClientObject.lastPublishedMessage, '{"clientToken":"CoolToken1"}');
          mockMQTTClientObject.resetPublishedMessage();
          thatToken = thingShadows.delete('testShadow3', 'CoolToken2');
          clock.tick(3000); // 3 sec later...
          assert(fakeCallback.calledTwice);
          assert.equal(mockMQTTClientObject.lastPublishedMessage, '{"clientToken":"CoolToken2"}');
          assert.equal(mockMQTTClientObject.commandCalled['publish'], 2);
          // Unregister it
          thingShadows.unregister('testShadow3');
      });
    });

//
// Verify that a proper incoming message triggers the callback for shadow Get/Delete accepted/rejected.
//
    describe("A proper incoming message for shadow Get/Delete is received (accepted/rejected)", function() {
      it("should call status callback", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Faking callbacks
          var fakeCallback = sinon.spy();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a callback
          thingShadows.on('status', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow3');
          // Get
          thingShadows.get('testShadow3', 'CoolToken1');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/get/accepted', '{"clientToken":"CoolToken1", "version":2}');
          assert(fakeCallback.calledOnce);
          thingShadows.get('testShadow3', 'CoolToken2');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/get/rejected', '{"clientToken":"CoolToken2", "version":2}')
          assert(fakeCallback.calledTwice);
          // Delete
          thingShadows.delete('testShadow3', 'CoolToken3');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/delete/accepted', '{"clientToken":"CoolToken3", "version":2}');
          assert(fakeCallback.calledThrice);
          thingShadows.delete('testShadow3', 'CoolToken4');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/delete/rejected', '{"clientToken":"CoolToken4", "version":2}');
          assert.equal(fakeCallback.callCount, 4);
          //
          assert.equal(mockMQTTClientObject.commandCalled['unsubscribe'], 0); // Never unsubscribe since persistent
          // Unregister it
          thingShadows.unregister('testShadow3');
      });
    });

//
// Verify that the related topics are properly unsubscribed when it is registered as 
// NOT persistent subscribe.
//
    describe("Shadow Get/Delete feedback for NOT persistent subscribe thing comes", function() {
      it("should unsubscribe from related topics (accepted/rejected)", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing
          thingShadows.register('testShadow3', {persistentSubscribe:false}); // Unsub once there is a feedback
          // Get
          thingShadows.get('testShadow3', 'CoolToken1');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/get/accepted', '{"clientToken":"CoolToken1", "version":2}');
          assert.equal(mockMQTTClientObject.commandCalled['unsubscribe'], 1);
          // Delete
          mockMQTTClientObject.reInitCommandCalled();
          thingShadows.delete('testShadow3', 'CoolToken2');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/delete/accepted', '{"clientToken":"CoolToken2", "version":2}');
          assert.equal(mockMQTTClientObject.commandCalled['unsubscribe'], 1);
          // Unregister it
          thingShadows.unregister('testShadow3');
      });
    });

//
// Verify that timeout triggers the callback for shadow Get/Delete timeout.
//
    describe("Get/Delete request timeout", function() {
      it("should call timeout callback", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Faking timer
          var clock = sinon.useFakeTimers();
          // Faking callback
          var fakeCallback = sinon.spy();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1',
          }, {
            operationTimeout:1000 // Set operation timeout to be 1 sec
          } );
          // Register callback
          thingShadows.on('timeout', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow3');
          // Get
          thingShadows.get('testShadow3', 'CoolToken1');
          // Delete
          clock.tick(3000); // 3 sec later...
          assert(fakeCallback.calledOnce);
          thingShadows.delete('testShadow3', 'CoolToken2');
          clock.tick(3000); // 3 sec later...
          assert(fakeCallback.calledTwice);
          //
          // Unregister it
          thingShadows.unregister('testShadow3');
          clock.restore();
      });
    });

//
// Verify that incoming messages with wrong/none token for shadow Get/Delete are ignored.
//
    describe("Incoming messages for shadow Get/Delete are missing/messed up with token", function() {
      it("should never call callback", function() {
          // Faking callback
          fakeCallback = sinon.spy();
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a callback
          thingShadows.on('status', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow3');
          // Get
          thingShadows.get('testShadow3');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/get/accepted', '{"clientToken":"Garbage1", "version":2}'); // wrong token
          thingShadows.get('testShadow3');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/get/accepted', '{"version":2}'); // no token
          // Delete
          thingShadows.delete('testShadow3');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/delete/accepted', '{"clientToken":"Garbage2", "version":2}'); // wrong token
          thingShadows.delete('testShadow3');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/delete/accepted', '{"version":2}'); // no token
          // Check
          sinon.assert.notCalled(fakeCallback); // Should never trigger the callback
          // Unregister it
          thingShadows.unregister('testShadow3');
      });
    });

//
// Verify that incoming message with out-of-date/none version for shadow Get/Delete are ignored.
//
    describe("Incoming messages for shadow Get/Delete are missing/messed up with version", function() {
      it("should never call callback", function() {
          // Faking callback
          fakeCallback = sinon.spy();
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a callback
          thingShadows.on('status', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow3');
          // Get
          thingShadows.get('testShadow3', 'CoolToken1');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/get/accepted', '{"clientToken":"CoolToken1", "version":3}');
          fakeCallback.reset(); // Reset spy
          thingShadows.get('testShadow3', 'CoolToken2');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/get/accepted', '{"clientToken":"CoolToken2", "version":1}'); // old version
          // Delete
          thingShadows.delete('testShadow3', 'CoolToken4');
          mockMQTTClientObject.emit('message', '$aws/things/testShadow3/shadow/delete/accepted', '{"clientToken":"CoolToken4", "version":1}'); // old version
          // Check
          sinon.assert.notCalled(fakeCallback);
          //Unregister it
          thingShadows.unregister('testShadow3');
      });
    });

/**** shadow update ****/
//
// Verify that token can be generated for shadow update request
// when it is missing in the payload.
//
    describe("Token is not specified for shadow Update", function() {
      it("should generate the token and insert it into the payload to be published", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing
          thingShadows.register('testShadow4');
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}}}'; // No token
          myStateObject = JSON.parse(myPayload);
          // Update
          var thisToken = thingShadows.update('testShadow4', myStateObject);
          assert.equal(mockMQTTClientObject.lastPublishedMessage, '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"dummy-client-1-0"}');
          // Unregister it
          thingShadows.unregister('testShadow4');
      });
    });

//
// Verify that token can be provided by the user for shadw update request.
//
    describe("Token is specified for shadow Update", function() {
      it("should keep and use user token", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing
          thingShadows.register('testShadow4');
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}'; // No token
          myStateObject = JSON.parse(myPayload);
          // Update
          var thisToken = thingShadows.update('testShadow4', myStateObject);
          assert.equal(mockMQTTClientObject.lastPublishedMessage, '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}');
          // Unregister it
          thingShadows.unregister('testShadow4');
      });
    });

//
// Verify that proper incoming messages trigger the callback for shadow update, accepted and rejected.
//
    describe("Proper incoming messages for shadow Update come", function() {
      it("should call status callback", function() {
          // Faking callback
          fakeCallback = sinon.spy();
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a callback
          thingShadows.on('status', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow4');
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update accepted
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientToken":"CoolToken1","version":2}');
          // Check
          assert(fakeCallback.calledOnce);
          // Reset
          fakeCallback.reset();
          // Update rejected
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/rejected', '{"clientToken":"CoolToken1","version":2}');
          // Check
          assert(fakeCallback.calledOnce);
          // Unregister it
          thingShadows.unregister('testShadow4');
      });
    });

//
// Verify that related topics are unsubscribed when the thing is registered as NOT persistent subscribe,
// for shadow update.
//
    describe("Shadow Update request for NOT persistent subscribe thing", function() {
      it("should unsubscribe from related topics (accepted/rejected)", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing
          thingShadows.register('testShadow4', {persistentSubscribe:false}); // Unsub once there is a feedback
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientToken":"CoolToken1", "version":2}');
          assert.equal(mockMQTTClientObject.commandCalled['unsubscribe'], 1);
          // Unregister it
          thingShadows.unregister('testShadow4');
      });
    });

//
// Verify that related topics are not unsubscribed on feedback for persistent subscription
//
    describe("Feedback comes for persistent subscribed thing for shadow Update", function() {
      it("should never unsubscribe to the related topics", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          });
          // Register a thing
          thingShadows.register('testShadow4');
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientToken":"CoolToken1","version":7}'); // sync local version
          // Check
          assert.equal(mockMQTTClientObject.commandCalled['unsubscribe'], 0); // Never unsub
          // Unregister it
          thingShadows.unregister('testShadow4');
      });
    });

//
// Verify that version is added to the payload if it is available when the thing is registered as NOT persistent subscribe,
// for shadow update.
//
    describe("Version available in local for NOT persistent subscribe thing for shadow Update", function() {
      it("should include version in published payload", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Faking timer
          var clock = sinon.useFakeTimers();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          });
          // Register a thing
          thingShadows.register('testShadow4', {persistentSubscribe:false}); // Unsub once there is a feedback
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update
          thingShadows.update('testShadow4', myStateObject);
          clock.tick(3000);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientToken":"CoolToken1","version":7}'); // sync local version
          // Update again
          thingShadows.update('testShadow4', myStateObject);
          clock.tick(3000);
          assert.equal(mockMQTTClientObject.lastPublishedMessage, '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1","version":7}');
          // Unregister it
          thingShadows.unregister('testShadow4');
          clock.restore();
      });
    });

//
// Verify that timeout triggers the callback for shadow Update timeout.
//
    describe("Update request timeout", function() {
      it("should call timeout callback", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Faking timer
          var clock = sinon.useFakeTimers();
          // Faking callback
          var fakeCallback = sinon.spy();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1',
          }, {
            operationTimeout:1000, // Set operation timeout to be 1 sec
            postSubscribeTimeout:3000 // Set post-subscribe timeout to be 3 sec
          } );
          // Register callback
          thingShadows.on('timeout', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow4', { persistentSubscribe: false } );
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update
          thingShadows.update('testShadow4', myStateObject);
          //
          clock.tick(3000); // 3 sec later...
          //
          assert(fakeCallback.calledOnce);
          // Unregister it
          thingShadows.unregister('testShadow4');
          clock.restore();
      });
    });

//
// Verify that incoming messages with wrong/none token for shadow Get/Delete are ignored.
//
    describe("Incoming messages are missing/messed up with token for shadow Update", function() {
      it("should never call callback", function() {
          // Faking callback
          fakeCallback = sinon.spy();
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a callback
          thingShadows.on('status', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow4');
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientToken":"Garbage1", "version":2}'); // wrong token
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"version":2}'); // no token
          // Check
          sinon.assert.notCalled(fakeCallback); // Should never trigger the callback
          // Unregister it
          thingShadows.unregister('testShadow4');
      });
    });

//
// Verify that incoming message with out-of-date/none version for shadow Get/Delete are ignored.
//
    describe("Incoming messages are missing/messed up with version for shadow Update", function() {
      it("should never call callback", function() {
          // Faking callback
          fakeCallbackStatus = sinon.spy();
          fakeCallbackTimeout = sinon.spy();
          // Faking timer
          var clock = sinon.useFakeTimers();
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          }, {
            operationTimeout:1000 // Set operation timeout to be 1 sec
          } );
          // Register a callback
          thingShadows.on('status', fakeCallbackStatus);
          thingShadows.on('timeout', fakeCallbackTimeout);
          // Register a thing
          thingShadows.register('testShadow4');
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientToken":"CoolToken1", "version":3}');
          // delay 3 sec and check if the callback is not called
          clock.tick(3000);
          assert(fakeCallbackStatus.calledOnce);
          sinon.assert.notCalled(fakeCallbackTimeout);
          fakeCallbackStatus.reset(); // Reset spy status
          fakeCallbackTimeout.reset(); // Reset spy timeout
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientToken":"CoolToken1", "version":1}'); // old version
          clock.tick(3000);
          // Check
          sinon.assert.notCalled(fakeCallbackStatus);
          assert(fakeCallbackTimeout.calledOnce);
          //Unregister it
          thingShadows.unregister('testShadow4');
          //
          clock.restore();
      });
    });

//
// Verify that inbound malformed JSON is properly ignored.
//
    describe("Inbound message contains malformed JSON for shadow Update feedback", function() {
      it("should properly ignore the malformed JSON", function() {
          // Faking callback
          fakeCallback = sinon.spy();
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1',
            debug: true
          } );
          // Register a callback
          thingShadows.on('status', fakeCallback);
          // Register a thing
          thingShadows.register('testShadow4');
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientTo'); // Malformed inbound JSON
          // Check
          sinon.assert.notCalled(fakeCallback);
          //Unregister it
          thingShadows.unregister('testShadow4');
      });
    });

//
// Verify that version is inserted in the outbound payload for shadow update when available.
//
    describe("Update when local version is available (persistent subscribe)", function() {
      it("should automatically include the local version into the payload", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing
          thingShadows.register('testShadow4', { debug: true, discardStale: true } );
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1"}';
          myStateObject = JSON.parse(myPayload);
          // Update
          thingShadows.update('testShadow4', myStateObject);
          mockMQTTClientObject.emit('message', '$aws/things/testShadow4/shadow/update/accepted', '{"clientToken":"CoolToken1","version":7}'); // sync local version
          // Update again
          thingShadows.update('testShadow4', myStateObject);
          assert.equal(mockMQTTClientObject.lastPublishedMessage, '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1","version":7}');
          // Unregister it
          thingShadows.unregister('testShadow4');
      });
    });

//
// Verify that including version in the payload for update is not allowed.
//
    describe("Include version in the payload for shadow update", function() {
      it("should return null", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register a thing
          thingShadows.register('testShadow4');
          // Generate fake payload
          myPayload = '{"state":{"desired":{"color":"RED"},"reported":{"color":"BLUE"}},"clientToken":"CoolToken1","version":10}';
          myStateObject = JSON.parse(myPayload);
          // Update
          assert.equal(thingShadows.update('testShadow4', myStateObject), null);
      });
    });

/**** non-shadow inbound MQTT messages handling ****/
//
// Verify that non-shadow MQTT messages are well handled.
//
    describe("Inbound non-shadow messages handling", function() {
      it("should call corresponding callback", function() {
          // Faking callback
          fakeCallback = sinon.spy();
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register non-shadow callback
          thingShadows.on('message', fakeCallback);
          // subscribe to some topic
          thingShadows.subscribe("some/topic");
          mockMQTTClientObject.emit('message', 'some/topic', 'A Brand New Message.');
          mockMQTTClientObject.emit('message', 'some/topic', 'Another Brand New Message.');
          // Check
          assert(fakeCallback.calledTwice);
      });
    });

/**** multiple shadows ****/
//
// Verify that registering/unregistering multiple shadows will not affect each other
//
    describe("Register 3 different shadows and then unregister 2", function() {
      it("should never throw error", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          assert.doesNotThrow(function(err) {
            // Register 3 shadows
            thingShadows.register('Triplets1');
            thingShadows.register('Triplets2');
            thingShadows.register('Triplets3');
            // Unregister 2 shadows
            thingShadows.unregister('Triplets2');
            thingShadows.unregister('Triplets3');
            // Fire a get
            thingShadows.get('Triplets1');
            // Clean up
            thingShadows.unregister('Triplets1');
          }, function(err) { console.log('\t['+err+']'); return true;});
      })
    });

//
// Verify that incoming deltas can be distributed to the correct user callbacks
//
    describe("Deltas from different shadows come in", function() {
      it("should call the correct user callbacks", function() {
        var called1 = false;
        var called2 = false;
        var called3 = false;
        // Define a general delta callback
        var distributor = function(thingName, stateObject) {
            if(thingName === 'Triplets1') {called1 = true;}
            else if(thingName === 'Triplets2') {called2 = true;}
            else if(thingName === 'Triplets3') {called3 = true;}
        };
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1'
          } );
          // Register delta callback
          thingShadows.on('delta', distributor);
          // Register 3 shadows
          thingShadows.register('Triplets1');
          thingShadows.register('Triplets2');
          thingShadows.register('Triplets3');
          // Faking deltas
          mockMQTTClientObject.emit('message', '$aws/things/Triplets1/shadow/update/delta', '{"state":{"desired":{"color":"RED"}}, "version":1}');
          mockMQTTClientObject.emit('message', '$aws/things/Triplets3/shadow/update/delta', '{"state":{"desired":{"color":"BLUE"}}, "version":2}');
          // Check
          assert.equal(called1, true);
          assert.equal(called2, false);
          assert.equal(called3, true);
          // Unregister them
          thingShadows.unregister('Triplets1');
          thingShadows.unregister('Triplets2');
          thingShadows.unregister('Triplets3');
      });
    });

//
// Verify that unregistered thing operations give an error.
//
    describe("Unregistered things give errors", function() {
      it("should return null for update/get/delete", function() {
          // Reinit mockMQTTClientObject
          mockMQTTClientObject.reInitCommandCalled();
          mockMQTTClientObject.resetPublishedMessage();
          // Init thingShadowClient
          var thingShadows = thingShadow( {
            keyPath:'test/data/private.pem.key',
            certPath:'test/data/certificate.pem.crt',
            caPath:'test/data/root-CA.crt',
            clientId:'dummy-client-1',
            region:'us-east-1',
            debug:true
          } );
          clientToken = thingShadows.get('UnknownThing1');
          assert.equal(clientToken, null);
          clientToken = thingShadows.update('UnknownThing2', { } );
          assert.equal(clientToken, null);
          clientToken = thingShadows.delete('UnknownThing3' );
          assert.equal(clientToken, null);
      });
    });

});

