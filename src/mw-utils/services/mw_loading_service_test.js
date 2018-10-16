'use strict';

describe('Loading', function () {
  var service, rootScope;
  var $timeout;
  beforeEach(module('mwUI.Utils'));

  afterEach(function () {
    $timeout.verifyNoPendingTasks();
    service = null;
    rootScope = null;
    $timeout = null;
  });

  beforeEach(inject(function (_$rootScope_, _Loading_, _$timeout_) {
    rootScope = _$rootScope_;
    service = _Loading_;
    $timeout = _$timeout_;
  }));

  it('can be initialized', function () {
    expect(service).toBeDefined();
  });

  it('stores a loading key', function () {
    service.start('test-key');
    expect(service.isLoading('test-key')).toBeTruthy();
    service.done('test-key');
    expect(service.isLoading('test-key')).toBeFalsy();
  });

  it('isLoading can handle undefined as key', function () {
    expect(service.isLoading(undefined)).toBeFalsy();
  });

  it('isLoading can handle undefined as key and returns true when global loading process is in progress', function () {
    service.start();
    expect(service.isLoading()).toBeTruthy();
  });

  it('isLoading can handle undefined as key and returns false when no global loading process is in progress anymore', function () {
    service.start();
    service.done();
    $timeout.flush();

    expect(service.isLoading()).toBeFalsy();
  });

  it('isLoading can handle undefined as key and returns true when at least one global loading process is in progress', function () {
    service.start();
    service.start();

    service.done();

    expect(service.isLoading()).toBeTruthy();
  });

  it('isLoading can handle undefined as key and returns false when all global loading process are done', function () {
    service.start();
    service.start();

    service.done();
    service.done();
    $timeout.flush();

    expect(service.isLoading()).toBeFalsy();
  });

  it('isLoading can handle null as key', function () {
    expect(service.isLoading(null)).toBeFalsy();
  });

  it('isLoading can unknown key', function () {
    expect(service.isLoading('something')).toBeFalsy();
  });

  it('sets a loading session with callbacks when no key is provided', function () {
    var startCallback = jasmine.createSpy('startSpy');
    var doneCallback = jasmine.createSpy('doneSpy');
    service.registerStartCallback(startCallback);
    service.registerDoneCallback(doneCallback);
    service.start();
    rootScope.$digest();
    expect(service.isLoading()).toBeTruthy();
    service.done();
    rootScope.$digest();
    $timeout.flush();
    expect(service.isLoading()).toBeFalsy();

    expect(startCallback).toHaveBeenCalled();
    expect(doneCallback).toHaveBeenCalled();
  });
});