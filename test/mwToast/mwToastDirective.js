'use strict';

describe('mwUi Toast directive', function () {
  var $rootScope,
    $scope,
    $timeout,
    element,
    ToastProvider,
    Toast;

  beforeEach(module('mwUI'));

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(function () {
    module('mwUI', function (_ToastProvider_) {
      ToastProvider = _ToastProvider_;
    });
  });

  beforeEach(function(){
    jasmine.clock().install();
  });

  afterEach(function(){
    jasmine.clock().uninstall();
  });

  beforeEach(inject(function (_$rootScope_, _$timeout_, _Toast_, $compile) {
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $timeout = _$timeout_;
    Toast = _Toast_;

    element = $compile('<div mw-toasts></div>')($scope);
    $scope.$digest();
  }));

  describe('toast handling', function(){
    it('displays toasts when a toast was added', function(){
      expect(angular.element(element).find('li').length).toBe(0);
      Toast.addToast('My Message');
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(1);
    });

    it('can display multiple toasts', function(){
      Toast.addToast('My Message');
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(1);
      Toast.addToast('My Message 2');
      Toast.addToast('My Message 3');
      Toast.addToast('My Message 4');
      Toast.addToast('My Message 5');
      Toast.addToast('My Message 6');
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(6);
    });

    it('update the toast when the message was updated', function(){
      var toast = Toast.addToast('My Message');
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(1);
      expect(angular.element(element).find('li').text().trim()).toEqual('My Message');
      Toast.replaceToastMessage(toast.id, 'My updated message');
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(1);
      expect(angular.element(element).find('li').text().trim()).toEqual('My updated message');
    });

    it('updates the toastlist when a toast was removed', function(){
      var toast = Toast.addToast('My Message');
      var toast2 = Toast.addToast('My Message 2');
      var toast3 = Toast.addToast('My Message 3');
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(3);
      expect(angular.element(element).find('li')[1].textContent.trim()).toEqual('My Message 2');

      Toast.removeToast(toast2.id);
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(2);
      expect(angular.element(element).find('li')[1].textContent.trim()).toEqual('My Message 3');
    });

    it('removes a toast when clicking on the hide button', function(){
      var toast = Toast.addToast('My Message');
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(1);
      $scope.hideToast(toast.id);
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(0);
    });

    it('automatically removes a toast when autoHide is set to true', function(){
      Toast.addToast('My Message', {autoHide: true, autoHideTime: 10});
      $scope.$digest();
      expect(angular.element(element).find('li').length).toBe(1);
      jasmine.clock().tick(9);
      $scope.$digest();
      $timeout.flush();
      expect(angular.element(element).find('li').length).toBe(1);
      jasmine.clock().tick(1);
      $scope.$digest();
      $timeout.flush();
      expect(angular.element(element).find('li').length).toBe(0);
    });
  });
});
