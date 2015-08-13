/**
 * Created by zarges on 29/05/15.
 */
'use strict';

describe('mwUi Response Handler', function () {
  var ResponseHandlerProvider,
    $provide,
    $http,
    $httpBackend,
    $rootScope,
    ResponseHandler;

  beforeEach(module('mwUI'));

  beforeEach(function () {
    module('mwUI', function (_ResponseHandlerProvider_, _$provide_) {
      ResponseHandlerProvider = _ResponseHandlerProvider_;
      $provide = _$provide_;
    });
  });

  beforeEach(inject(function (_$http_, _$httpBackend_, _ResponseHandler_, _$rootScope_) {
    ResponseHandler = _ResponseHandler_;
    $httpBackend = _$httpBackend_;
    $http = _$http_;
    $rootScope = _$rootScope_;
  }));

  describe('configuring provider', function () {
    describe('testing basics', function () {
      it('should be possible to register an action for a route', function () {
        ResponseHandlerProvider.registerAction('/test', function () {
        }, {
          method: 'POST',
          statusCodes: [200, 201]
        });
        var handler = ResponseHandler.getHandlerForUrlAndCode('POST', '/test', 200);
        expect(handler).toBeDefined();
      });

      it('should be possible to register an action for different routes', function () {
        ResponseHandlerProvider.registerAction('/test', function () {
        }, {
          method: 'POST',
          statusCodes: [200, 201]
        });
        ResponseHandlerProvider.registerAction('/test/abc', function () {
        }, {
          method: 'PUT',
          statusCodes: [200, 201]
        });
        expect(ResponseHandler.getHandlerForUrlAndCode('POST', '/test', 200)).toBeDefined();
        expect(ResponseHandler.getHandlerForUrlAndCode('PUT', '/test/abc', 200)).toBeDefined();
      });

      it('should be possible to register an action for a route multiple times', function () {
        ResponseHandlerProvider.registerAction('/test', function () {
        }, {
          method: 'POST',
          statusCodes: [200]
        });
        ResponseHandlerProvider.registerAction('/test', function () {
        }, {
          method: 'POST',
          statusCodes: [200]
        });
        ResponseHandlerProvider.registerAction('/test', function () {
        }, {
          method: 'POST',
          statusCodes: [200]
        });
        var handler = ResponseHandler.getHandlerForUrlAndCode('POST', '/test', 200);
        expect(handler.getCallbacksForStatusCode(200).length).toBe(3);
      });

      it('should be possible to register different actions for a route', function () {
        ResponseHandlerProvider.registerAction('/test', function () {
        }, {
          method: 'POST',
          statusCodes: [200, 201]
        });
        ResponseHandlerProvider.registerAction('/test', function () {
        }, {
          method: 'POST',
          statusCodes: [200, 201, 202]
        });
        ResponseHandlerProvider.registerAction('/test', function () {
        }, {
          method: 'PUT',
          statusCodes: [200, 201]
        });
        var handler = ResponseHandler.getHandlerForUrlAndCode('POST', '/test', 200);
        var handler2 = ResponseHandler.getHandlerForUrlAndCode('POST', '/test', 201);
        var handler3 = ResponseHandler.getHandlerForUrlAndCode('POST', '/test', 202);
        var handler4 = ResponseHandler.getHandlerForUrlAndCode('PUT', '/test', 200);
        expect(handler.getCallbacksForStatusCode(200).length).toBe(2);
        expect(handler2.getCallbacksForStatusCode(201).length).toBe(2);
        expect(handler3.getCallbacksForStatusCode(202).length).toBe(1);
        expect(handler4.getCallbacksForStatusCode(200).length).toBe(1);
      });

      it('should be possible to register actions for success case without specific status codes', function () {
        ResponseHandlerProvider.registerSuccessAction('/test', function () {
        }, 'POST');
        ResponseHandlerProvider.registerSuccessAction('/test', function () {
        }, 'POST');
        ResponseHandlerProvider.registerSuccessAction('/test/123', function () {
        }, 'POST');
        var handler = ResponseHandler.getHandlerForUrlAndCode('POST', '/test');
        var handler2 = ResponseHandler.getHandlerForUrlAndCode('POST', '/test/123');
        expect(handler.getCallbacksForSuccess().length).toBe(2);
        expect(handler2.getCallbacksForSuccess().length).toBe(1);
      });

      it('should be possible to register actions for error case without specific status codes', function () {
        ResponseHandlerProvider.registerErrorAction('/test', function () {
        }, 'POST');
        ResponseHandlerProvider.registerErrorAction('/test', function () {
        }, 'DELETE');
        var handler = ResponseHandler.getHandlerForUrlAndCode('POST', '/test', undefined, true);
        var handler2 = ResponseHandler.getHandlerForUrlAndCode('DELETE', '/test', undefined, true);
        expect(handler.getCallbacksForError().length).toBe(1);
        expect(handler2.getCallbacksForError().length).toBe(1);
      });

      it('should be possible to register a default action for a method', function () {
        var fn = function () {
          },
          fn2 = function () {
          };
        ResponseHandlerProvider.registerAction('/test', fn, {
          method: 'GET',
          statusCodes: [200, 201]
        });
        ResponseHandlerProvider.registerDefaultAction(fn2, {
          method: 'POST',
          statusCodes: [200, 201]
        });
        var handler = ResponseHandler.getHandlerForUrlAndCode('POST', '/test', 200);
        expect(handler.getCallbacksForStatusCode(200)[0]).toBe(fn2);
      });

      it('should be possible to register a default success action for a method', function () {
        var fn = function () {
          },
          fn2 = function () {
          };
        ResponseHandlerProvider.registerAction('/test', fn, {
          method: 'GET',
          statusCodes: [200, 201]
        });
        ResponseHandlerProvider.registerDefaultSuccessAction(fn2, 'PUT');
        var handler = ResponseHandler.getHandlerForUrlAndCode('PUT', '/test');
        expect(handler.getCallbacksForSuccess()[0]).toBe(fn2);
      });

      it('should be possible to register a default error action for a method', function () {
        var fn = function () {
          },
          fn2 = function () {
          };
        ResponseHandlerProvider.registerAction('/test', fn, {
          method: 'GET',
          statusCodes: [200, 201]
        });
        ResponseHandlerProvider.registerDefaultErrorAction(fn2, 'PUT');
        var handler = ResponseHandler.getHandlerForUrlAndCode('PUT', '/test', undefined, true);
        expect(handler.getCallbacksForError()[0]).toBe(fn2);
      });

      it('should be possible to register two actions for different urls (which both match) and different status codes', function () {

        var fn = function () {
        };
        var fn2 = jasmine.createSpy('spy2');

        ResponseHandlerProvider.registerAction('*/api/v1/*', fn, {
          method: 'GET',
          statusCodes: [403]
        });

        ResponseHandlerProvider.registerAction('*', fn2, {
          method: 'GET',
          statusCodes: [404]
        });

        ResponseHandler.handle({
          config: {
            method: 'GET',
            url: '/api/v1/dashboard'
          },
          status: 404
        });
        expect(fn2.calls.count()).toEqual(1);

        ResponseHandler.handle({
          config: {
            method: 'GET',
            url: '/xyz'
          },
          status: 404
        });
        expect(fn2.calls.count()).toEqual(2);
      });

    });

    describe('testing regex functionality', function () {

      it('should be possible to register an action for a route that was defined as regex', function () {
        ResponseHandlerProvider.registerAction('/test/:id', function () {
        }, {
          method: 'POST',
          statusCodes: [200, 201]
        });
        var handler = ResponseHandler.getHandlerForUrlAndCode('POST', '/test/1', 200);
        expect(handler).toBeDefined();
      });

      it('should call the correct action when multiple routes with regex are defined', function () {
        var fn1 = function () {
          },
          fn2 = function () {
          },
          fn3 = function () {
          },
          fn4 = function () {
          };

        ResponseHandlerProvider.registerSuccessAction('/test/:id', fn1, 'POST');
        ResponseHandlerProvider.registerSuccessAction('/test', fn2, 'POST');
        ResponseHandlerProvider.registerSuccessAction('/test/:id/action', fn3, 'POST');
        ResponseHandlerProvider.registerSuccessAction('/test/:id/action/*', fn4, 'POST');

        var handler = ResponseHandler.getHandlerForUrlAndCode('POST', '/test/1');
        var handler2 = ResponseHandler.getHandlerForUrlAndCode('POST', '/test');
        var handler3 = ResponseHandler.getHandlerForUrlAndCode('POST', '/test/1/action');
        var handler4 = ResponseHandler.getHandlerForUrlAndCode('POST', '/test/1/action/2423423');

        expect(handler.getCallbacksForSuccess()[0]).toBe(fn1);
        expect(handler2.getCallbacksForSuccess()[0]).toBe(fn2);
        expect(handler3.getCallbacksForSuccess()[0]).toBe(fn3);
        expect(handler4.getCallbacksForSuccess()[0]).toBe(fn4);
      });

    });

    describe('testing error handling', function () {
      it('should throw an error when no methods are defined options param', function () {
        var noMethods = function () {
            ResponseHandlerProvider.registerAction('/test', function () {
            }, {
              statusCodes: [200, 201]
            });
          },
          noMethods2 = function () {
            ResponseHandlerProvider.registerAction('/test', function () {
            }, {
              statusCodes: [200, 201],
              method: []
            });
          };
        expect(noMethods).toThrow();
        expect(noMethods2).toThrow();
      });
      it('should throw an error when onSuccess and onError are passed as options param', function () {
        var unPreciseFn = function () {
          ResponseHandlerProvider.registerAction('/test', function () {
          }, {
            methods: ['POST', 'PUT'],
            onSuccess: true,
            onError: true
          });
        };
        expect(unPreciseFn).toThrow();
      });

      it('should throw an error when onSuccess or onError and status codes are passed as options param', function () {
        var unPreciseFn1 = function () {
            ResponseHandlerProvider.registerAction('/test', function () {
            }, {
              methods: 'POST',
              statusCodes: [100, 200],
              onSuccess: true
            });
          },
          unPreciseFn2 = function () {
            ResponseHandlerProvider.registerAction('/test', function () {
            }, {
              method: 'POST',
              statusCodes: [100, 200],
              onError: true
            });
          };
        expect(unPreciseFn1).toThrow();
        expect(unPreciseFn2).toThrow();
      });

      it('should throw an error when an inappropriate method was passed', function () {
        var inappropriateMethodFn = function () {
          ResponseHandlerProvider.registerSuccessAction('/test', function () {
          }, 'dfsa');
        };
        expect(inappropriateMethodFn).toThrow();
      });
    });
  });

  describe('using service', function () {
    it('should execute callbacks for the route test statuscode 200', function () {
      var spy = jasmine.createSpy('statusCodeSpy');
      ResponseHandlerProvider.registerAction('/test', spy, {method: 'POST', statusCodes: [200]});
      ResponseHandler.handle({
        config: {
          url: '/test',
          method: 'POST'
        },
        status: 200
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should execute callbacks for the case success and no specific statuscode', function () {
      var spy = jasmine.createSpy('successPostSpy');
      ResponseHandlerProvider.registerSuccessAction('/test', spy, 'POST');
      ResponseHandler.handle({
        config: {
          url: '/test',
          method: 'POST'
        },
        status: 200
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should execute callbacks for the case error and no specific statuscode', function () {
      var spy = jasmine.createSpy('errorPostSpy');
      ResponseHandlerProvider.registerErrorAction('/test', spy, 'POST');
      ResponseHandler.handle({
        config: {
          url: '/test',
          method: 'POST'
        },
        status: 200
      }, true);
      expect(spy).toHaveBeenCalled();
    });

    it('should execute no callbacks when no callbacks are deined for a route', function () {

    });

    it('should be possible to define callbacks as a factory', function () {
      var spy = jasmine.createSpy();
      $provide.factory('test', function () {
        return spy;
      });
      ResponseHandlerProvider.registerSuccessAction('/test', 'test', 'POST');
      ResponseHandler.handle({
        config: {
          url: '/test',
          method: 'POST'
        },
        status: 200
      });

      expect(spy).toHaveBeenCalled();
    });

    it('should execute callbacks for the route test/123/abc statuscode 200', function () {
      var fn1 = jasmine.createSpy('fn1'),
        fn2 = jasmine.createSpy('fn2'),
        fn3 = jasmine.createSpy('fn3');

      ResponseHandlerProvider.registerAction('/test', fn3, {
        method: 'POST',
        statusCodes: [200, 201, 202]
      });
      ResponseHandlerProvider.registerAction('/test/:id', fn3, {
        method: 'POST',
        statusCodes: [200, 201, 202]
      });
      ResponseHandlerProvider.registerAction('/test/:id/a', fn3, {
        method: 'POST',
        statusCodes: [200, 201, 202]
      });
      ResponseHandlerProvider.registerAction('/test/:id/abc', fn1, {
        method: 'POST',
        statusCodes: [200, 201, 202]
      });
      ResponseHandlerProvider.registerAction('/test/:id/abc', fn2, {
        method: 'POST',
        statusCodes: [200, 201, 202]
      });
      ResponseHandlerProvider.registerAction('/test2', fn3, {
        method: 'POST',
        statusCodes: [200, 201, 202]
      });

      ResponseHandler.handle({
        config: {
          url: '/test/123/abc',
          method: 'POST'
        },
        status: 200
      });

      expect(fn1).toHaveBeenCalled();
      expect(fn2).toHaveBeenCalled();
      expect(fn3).not.toHaveBeenCalled();
    });

    it('should use the value returned by the handler function', function(){
      var resolveFnSpy = jasmine.createSpy('resolveFn');

      ResponseHandlerProvider.registerAction('/test', function(){return 'HANDLERDATA'}, {
        method: 'POST',
        onSuccess: true
      });
      $http.post('/test').then(function (rsp) {
        resolveFnSpy(rsp);
      });
      $httpBackend.when('POST', '/test').respond(200, 'ABC');
      $httpBackend.flush();
      $rootScope.$digest();
      expect(resolveFnSpy.calls.first().args[0]).toEqual('HANDLERDATA');
    });

    it('should use the original response value when the handler function', function(){
      var resolveFnSpy = jasmine.createSpy('resolveFn');

      ResponseHandlerProvider.registerAction('/test', function(){}, {
        method: 'POST',
        onSuccess: true
      });
      $http.post('/test').then(function (rsp) {
        resolveFnSpy(rsp);
      });
      $httpBackend.when('POST', '/test').respond(200, 'ABC');
      $httpBackend.flush();
      $rootScope.$digest();
      expect(resolveFnSpy.calls.first().args[0].data).toEqual('ABC');
    })

  });

  describe('testing promise chain', function () {

    var $q;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
    }));

    describe('testing success case', function(){
      it('should block chain when a function was registered that returns a promise and continue when promise is resolved', function () {
        var resolveFnSpy = jasmine.createSpy('resolveFn'),
          handlerResolveFnSpy = jasmine.createSpy('handlerResolveFnSpy'),
          handlerResolveFn;

        $provide.factory('promiseFn', function ($q) {
          return function () {
            var dfd = $q.defer();
            handlerResolveFn = function () {
              handlerResolveFnSpy();
              dfd.resolve({a: 1});
            };
            return dfd.promise;
          }
        });
        ResponseHandlerProvider.registerAction('/test', 'promiseFn', {
          method: 'POST',
          onSuccess: true
        });
        $http.post('/test').then(function (rsp) {
          resolveFnSpy(rsp);
        });
        $httpBackend.when('POST', '/test').respond(200);
        $httpBackend.flush();
        expect(resolveFnSpy).not.toHaveBeenCalled();
        handlerResolveFn();
        $rootScope.$digest();
        expect(handlerResolveFnSpy).toHaveBeenCalled();
        expect(resolveFnSpy).toHaveBeenCalledWith({a: 1});
      });

      it('should reject promise when promise of handler rejects it even though the request was successful', function () {
        var resolveFnSpy = jasmine.createSpy('resolveFn'),
          rejectFnSpy = jasmine.createSpy('resolveFn'),
          handlerResolveFnSpy = jasmine.createSpy('handlerResolveFnSpy'),
          handlerResolveFn;

        $provide.factory('promiseFn', function ($q) {
          return function () {
            var dfd = $q.defer();
            handlerResolveFn = function () {
              handlerResolveFnSpy();
              dfd.reject({a: 1});
            };
            return dfd.promise;
          }
        });
        ResponseHandlerProvider.registerAction('/test', 'promiseFn', {
          method: 'POST',
          onSuccess: true
        });
        $http.post('/test').then(
          function (rsp) {
            resolveFnSpy(rsp);
          }, function (rsp) {
            rejectFnSpy(rsp);
          }
        );
        $httpBackend.when('POST', '/test').respond(200);
        $httpBackend.flush();
        expect(resolveFnSpy).not.toHaveBeenCalled();
        handlerResolveFn();
        $rootScope.$digest();
        expect(handlerResolveFnSpy).toHaveBeenCalled();
        expect(resolveFnSpy).not.toHaveBeenCalledWith({a: 1});
        expect(rejectFnSpy).toHaveBeenCalledWith({a: 1});
      });

      it('should resolve promise when handler function does not return a promise and the request was successful', function () {
        var resolveFnSpy = jasmine.createSpy('resolveFn');

        ResponseHandlerProvider.registerAction('/test', function(){}, {
          method: 'POST',
          onSuccess: true
        });
        $http.post('/test').then(
          function (rsp) {
            resolveFnSpy(rsp);
          }
        );
        $httpBackend.when('POST', '/test').respond(200, {a:1});
        $httpBackend.flush();
        expect(resolveFnSpy).toHaveBeenCalled();
        expect(resolveFnSpy.calls.first().args[0].data).toEqual({a:1});
      });
    });

    describe('testing error case', function(){
      it('should block chain when a function was registered that returns a promise and continue when promise is resolved', function () {
        var resolveFnSpy = jasmine.createSpy('resolveFn'),
          rejectFnSpy = jasmine.createSpy('rejectFn'),
          handlerResolveFnSpy = jasmine.createSpy('handlerResolveFnSpy'),
          handlerResolveFn;

        $provide.factory('promiseFn', function ($q) {
          return function () {
            var dfd = $q.defer();
            handlerResolveFn = function () {
              handlerResolveFnSpy();
              dfd.reject({a: 1});
            };
            return dfd.promise;
          }
        });
        ResponseHandlerProvider.registerAction('/test', 'promiseFn', {
          method: 'POST',
          onError: true
        });
        $http.post('/test').then(function (rsp) {
          resolveFnSpy(rsp);
        }, function(rsp){
          rejectFnSpy(rsp);
        });
        $httpBackend.when('POST', '/test').respond(500);
        $httpBackend.flush();
        expect(resolveFnSpy).not.toHaveBeenCalled();
        expect(rejectFnSpy).not.toHaveBeenCalled();
        handlerResolveFn();
        $rootScope.$digest();
        expect(handlerResolveFnSpy).toHaveBeenCalled();
        expect(resolveFnSpy).not.toHaveBeenCalledWith({a: 1});
        expect(rejectFnSpy).toHaveBeenCalledWith({a: 1});
      });

      it('should resolve promise when promise of handler resolves it even though the request was not successful', function () {
        var resolveFnSpy = jasmine.createSpy('resolveFn'),
          rejectFnSpy = jasmine.createSpy('resolveFn'),
          handlerResolveFnSpy = jasmine.createSpy('handlerResolveFnSpy'),
          handlerResolveFn;

        $provide.factory('promiseFn', function ($q) {
          return function () {
            var dfd = $q.defer();
            handlerResolveFn = function () {
              handlerResolveFnSpy();
              dfd.resolve({a: 1});
            };
            return dfd.promise;
          }
        });
        ResponseHandlerProvider.registerAction('/test', 'promiseFn', {
          method: 'POST',
          onError: true
        });
        $http.post('/test').then(
          function (rsp) {
            resolveFnSpy(rsp);
          }, function (rsp) {
            rejectFnSpy(rsp);
          }
        );
        $httpBackend.when('POST', '/test').respond(500);
        $httpBackend.flush();
        expect(resolveFnSpy).not.toHaveBeenCalled();
        expect(rejectFnSpy).not.toHaveBeenCalled();
        handlerResolveFn();
        $rootScope.$digest();
        expect(handlerResolveFnSpy).toHaveBeenCalled();
        expect(rejectFnSpy).not.toHaveBeenCalled();
        expect(resolveFnSpy).toHaveBeenCalledWith({a: 1});
      });

      it('should reject promise when handler function does not return a promise and the request was not successful', function () {
        var rejectFnSpy = jasmine.createSpy('rejectFn');

        ResponseHandlerProvider.registerAction('/test', function(){}, {
          method: 'POST',
          onError: true
        });
        $http.post('/test').then(
          function () {},
          function(rsp){
            rejectFnSpy(rsp);
          }
        );
        $httpBackend.when('POST', '/test').respond(500, {a:1});
        $httpBackend.flush();
        expect(rejectFnSpy).toHaveBeenCalled();
        expect(rejectFnSpy.calls.first().args[0].data).toEqual({a:1});
      });
    });
  });

  describe('config $http', function () {

    it('should handle response on correct status code', function () {
      var spy = jasmine.createSpy('successSpy');
      ResponseHandlerProvider.registerAction('/test', spy, {method: 'POST', statusCodes: [200]});
      $http.post('/test');
      $httpBackend.when('POST', '/test').respond(200);
      $httpBackend.flush();
      expect(spy).toHaveBeenCalled();
    });

    it('should handle response on success', function () {
      var spy = jasmine.createSpy('successSpy');
      ResponseHandlerProvider.registerSuccessAction('/test', spy, 'POST');
      $http.post('/test');
      $httpBackend.when('POST', '/test').respond(200);
      $httpBackend.flush();
      expect(spy).toHaveBeenCalled();
    });

    it('should handle response on error', function () {
      var spy = jasmine.createSpy('successSpy');
      ResponseHandlerProvider.registerErrorAction('/test', spy, 'POST');
      $http.post('/test');
      $httpBackend.when('POST', '/test').respond(400);
      $httpBackend.flush();
      expect(spy).toHaveBeenCalled();
    });
  });
});