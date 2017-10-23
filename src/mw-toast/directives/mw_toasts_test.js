'use strict';

 describe('mwUi Toast directive', function () {
  var $rootScope,
    $scope,
    $timeout,
    element,
    ToastProvider,
    Toast;

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.Toast'));

  beforeEach(function () {
    module('mwUI.Toast', function (_ToastProvider_) {
      ToastProvider = _ToastProvider_;
    });
  });

  beforeEach(inject(function (_$rootScope_, _$timeout_, _Toast_, $compile) {
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $timeout = _$timeout_;
    Toast = _Toast_;

    element = $compile('<div mw-toasts></div>')($scope);
  }));

  beforeEach(function(){
    jasmine.clock().install();
  });

  afterEach(function(){
    jasmine.clock().uninstall();
  });

  describe('toast handling', function(){
    it('displays toasts when a toast was added', function(){
      Toast.addToast('xxx');

      $scope.$digest();

      expect(angular.element(element).find('li').length).toBe(1);
    });

    it('displays multiple toasts', function(){
      Toast.addToast('xxx');
      Toast.addToast('xxx 2');
      $scope.$digest();

      expect(angular.element(element).find('li').length).toBe(2);
    });

    it('updates the toast when the message was updated', function(){
      var toast = Toast.addToast('xxx');
      Toast.replaceToastMessage(toast.id, 'abc');

      $scope.$digest();

      expect(angular.element(element).find('li').length).toBe(1);
      expect(angular.element(element).find('li').text().trim()).toEqual('abc');
    });

    it('updates the toastlist when a toast was removed', function(){
      Toast.addToast('xxx', {id: 1});
      Toast.addToast('xxx 2', {id: 2});
      Toast.removeToast(1);

      $scope.$digest();
      $timeout.flush();

      expect(angular.element(element).find('li').length).toBe(1);
      expect(angular.element(element).find('li')[0].textContent.trim()).toEqual('xxx 2');
    });

    it('removes a toast when clicking on the hide button', function(){
      $scope.$digest();
      var toast = Toast.addToast('My Message');
      $scope.hideToast(toast.id);

      $scope.$digest();
      $timeout.flush();

      expect(angular.element(element).find('li').length).toBe(0);
    });
  });
});
