/**
 * Created by zarges on 29/05/15.
 */
'use strict';

describe('mwUi Response Handler', function () {
  var ResponseToastHandlerProvider,
    ResponseToastHandler,
    ResponseHandler,
    Toast,
    i18n;

  var _handleResponse = function(){
    ResponseHandler.handle({
      config: {
        url: '/test',
        method: 'POST'
      },
      status: 200
    });
  };

  beforeEach(module('mwUI.ResponseToastHandler'));

  beforeEach(module(function ($provide) {
    $provide.service('i18n', function(){
      var i18n = jasmine.createSpyObj('i18n', ['get']);
      i18n.get.and.callFake(function(input){
        return input;
      });
      return i18n;
    });
  }));

  beforeEach(function () {
    module('mwUI.ResponseToastHandler', function (_ResponseToastHandlerProvider_) {
      ResponseToastHandlerProvider = _ResponseToastHandlerProvider_;
    });
  });

  beforeEach(inject(function (_ResponseToastHandler_, _ResponseHandler_, _Toast_, _i18n_) {
    ResponseToastHandler = _ResponseToastHandler_;
    ResponseHandler = _ResponseHandler_;
    Toast = _Toast_;
    i18n = _i18n_;
  }));

  describe('configuring provider', function () {

    beforeEach(function(){
      ResponseToastHandlerProvider.registerToast('/test', {
        singular: 'One',
        plural: 'Plural'
      }, {
        method: 'POST',
        statusCodes: [200, 201]
      });
    });

    it('should add the singular message to the Toast handler when the route is matching', function () {
      var spy = spyOn(Toast, 'addToast');

      _handleResponse();

      expect(spy.calls.argsFor(0)[0]).toBe('One');
      expect(spy.calls.argsFor(0)[1].id).toBe('/test_POST_200');
    });

    it('should throw an exception when no messages object was defined or no messages.singular', function(){
      var throwFn = function() {
        ResponseToastHandlerProvider.registerToast('/test/123', {}, {
          method: 'POST',
          statusCodes: [404]
        });
      };
      expect(throwFn).toThrow();
    });

    it('should not possible to define multiple message for the same route and method and different statuscodes', function(){
      var throwFn = function() {
        ResponseToastHandlerProvider.registerToast('/test/123', {
          singular: 'Not Found'
        }, {
          method: 'POST',
          statusCodes: [404]
        });

        ResponseToastHandlerProvider.registerToast('/test/123', {
          singular: 'Exception',
          plural: 'Exceptions'
        }, {
          method: 'POST',
          statusCodes: [500]
        });
      };
      expect(throwFn).not.toThrow();

      ResponseHandler.handle({
        config: {
          url: '/test/123',
          method: 'POST'
        },
        status: 404
      });

      ResponseHandler.handle({
        config: {
          url: '/test/123',
          method: 'POST'
        },
        status: 500
      });

      expect(Toast.getToasts().length).toBe(2);
      expect(Toast.getToasts()[0].message).toEqual('Not Found');
      expect(Toast.getToasts()[1].message).toEqual('Exception');

      ResponseHandler.handle({
        config: {
          url: '/test/123',
          method: 'POST'
        },
        status: 500
      });

      expect(Toast.getToasts()[1].message).toEqual('Exceptions');

    });

    it('should not be possible to define multiple message for the same route and method and statuscode', function(){
      var throwFn = function() {
        ResponseToastHandlerProvider.registerToast('/test/123', {
          singular: 'Sina',
          plural: 'Pluto'
        }, {
          method: 'POST',
          statusCodes: [200, 201]
        });
        ResponseToastHandlerProvider.registerToast('/test/123', {
          singular: 'Sina',
          plural: 'Pluto'
        }, {
          method: 'POST',
          statusCodes: [200, 201]
        });
      };
      expect(throwFn).toThrow();
    });

    it('should only display one message per route at a time even though multiple responses are coming in', function(){
      _handleResponse();
      _handleResponse();
      _handleResponse();
      _handleResponse();
      _handleResponse();
      expect(Toast.getToasts().length).toBe(1);
    });

    it('should always display the singular message when no plural message is defined', function(){
      ResponseToastHandlerProvider.registerToast('/test/123', {
        singular: 'Singular'
      }, {
        method: 'POST',
        statusCodes: [200]
      });
      var handleResponse = function(){
        ResponseHandler.handle({
          config: {
            url: '/test/123',
            method: 'POST'
          },
          status: 200
        });
      };
      handleResponse();
      handleResponse();
      handleResponse();
      expect(Toast.getToasts()[0].message).toEqual('Singular');
    });

    it('should provide how often the message was duplicated', function(){
      _handleResponse();
      _handleResponse();
      _handleResponse();
      expect(i18n.get.calls.argsFor(0)[1].$count).toBe(1);
      expect(i18n.get.calls.argsFor(1)[1].$count).toBe(2);
      expect(i18n.get.calls.argsFor(2)[1].$count).toBe(3);
    });

    it('should add the singular message when the route is matching the first and replace it with the plural message when another request is coming', function () {
      spyOn(Toast, 'addToast').and.callThrough();

      _handleResponse();
      expect(Toast.getToasts()[0].message).toEqual('One');

      _handleResponse();
      expect(Toast.getToasts()[0].message).toEqual('Plural');
    });

    it('should execute the pre process message function when it is defined in options', function(){

      var spy = jasmine.createSpy('preProcessFn').and.callFake(function(){
        return 'CUSTOM';
      });
      ResponseToastHandlerProvider.registerToast('/test/2', {
        singular: 'One',
        plural: 'Plural'
      }, {
        method: 'POST',
        statusCodes: [200, 201],
        preProcess: spy
      });

      ResponseHandler.handle({
        config: {
          url: '/test/2',
          method: 'POST'
        },
        status: 200
      });

      ResponseHandler.handle({
        config: {
          url: '/test/2',
          method: 'POST'
        },
        status: 200
      });

      expect(spy.calls.argsFor(0)[0]).toBe('One');
      expect(spy.calls.argsFor(0)[1].$count).toBe(1);
      expect(spy.calls.argsFor(0)[2]).toBe(i18n);
      expect(spy.calls.argsFor(1)[0]).toBe('Plural');
      expect(spy.calls.argsFor(1)[1].$count).toBe(2);
      expect(Toast.getToasts()[0].message).toEqual('CUSTOM');

    });

    it('should be possible to define different toastTypes', function(){
      ResponseToastHandlerProvider.registerToastType('success', {
        autoHide: true,
        autoHideTime: 10,
        isHtmlMessage: true
      });

      ResponseToastHandlerProvider.registerToast('/test/2', {
        singular: 'One',
        plural: 'Plural'
      }, {
        method: 'POST',
        statusCodes: [200, 201],
        toastType: 'success'
      });

      ResponseHandler.handle({
        config: {
          url: '/test/2',
          method: 'POST'
        },
        status: 200
      });

      expect(Toast.getToasts()[0].autoHide).toBeTruthy();
      expect(Toast.getToasts()[0].autoHideTime).toBe(10);
      expect(Toast.getToasts()[0].isHtmlMessage).toBeTruthy();

    });

  });
});