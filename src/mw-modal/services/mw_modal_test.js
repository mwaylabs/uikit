'use strict';

describe('mwUi Modal service', function () {
  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.Modal'));
  beforeEach(module('ngMock'));

  window.mockIconService();

  beforeEach(inject(function ($rootScope, $templateCache, Modal, $timeout) {
    this.$rootScope = $rootScope;
    this.Modal = Modal;
    this.$timeout = $timeout;
    this.$templateCache = $templateCache;
    this.asyncPromiseFn = function($timeout, $q){
      var dfd = $q.defer();
      $timeout(function () {
        dfd.resolve('resolved');
      });
      return dfd.promise;
    };

    $templateCache.put('test/xxx.html', '<div mw-modal title="test"><div mw-modal-body>xxx</div></div>');
  }));

  describe('testing configuring modal', function () {
    it('creates a modal', function () {
      var modal = this.Modal.create({
        templateUrl: 'test/xxx.html'
      });

      expect(modal.id).toBe('test/xxx.html');
    });

    it('prepares a modal for later use', function () {
      spyOn(this.Modal, 'create').and.callThrough();
      var MyModal = this.Modal.prepare({
        templateUrl: 'test/xxx.html'
      });

      new MyModal();

      expect(this.Modal.create.calls.mostRecent().args[0].templateUrl).toMatch('test/xxx.html');
    });
  });

  describe('testing model instance', function () {
    beforeEach(function () {
      this.myModal = this.Modal.create({
        templateUrl: 'test/xxx.html',
        el: 'body'
      });
    });

    afterEach(function () {
      this.myModal.destroy();
      this.$timeout.flush();
      this.$rootScope.$digest();
    });

    it('openes the modal', function () {
      this.myModal.show();

      this.$rootScope.$digest();

      expect(angular.element('body').find('.mw-modal').length).toBe(1);
    });

    it('closes the modal', function () {
      this.myModal.show();
      this.$rootScope.$digest();

      this.myModal.hide();
      this.$timeout.flush();
      this.$rootScope.$digest();

      expect(angular.element('body').find('.mw-modal').length).toBe(0);
    });

    it('returns the scope that is used in the modal', function () {
      this.myModal.show();
      this.$rootScope.$digest();

      var tmplScope = angular.element('body').find('.mw-modal').scope(),
        modalScope = this.myModal.getScope();

      expect(tmplScope).toBe(modalScope);
    });

    it('sets the scope attributes of the modal when it is called before modal was opened', function () {
      this.myModal.setScopeAttributes({test: 'abc'});
      this.myModal.show();
      this.$rootScope.$digest();
      this.$timeout.flush();

      expect(this.myModal.getScope().test).toBe('abc');
    });

    it('updates the scope attributes of the modal when it is called after the modal was opened', function () {
      this.myModal.show();
      this.$rootScope.$digest();

      this.myModal.setScopeAttributes({test2: 'xxx'});
      this.$timeout.flush();
      this.$rootScope.$digest();

      expect(this.myModal.getScope().test2).toBe('xxx');
    });
  });

  describe('testing advanced modal configurations', function(){
    afterEach(function(){
      this.$timeout.flush();
      this.$rootScope.$digest();
    });

    it('supports a custom controller', function () {
      var controllerSpy = jasmine.createSpy('controller'),
        modal = this.Modal.create({
          el: 'body',
          templateUrl: 'test/xxx.html',
          controller: controllerSpy
        });
      modal.show();
      this.$rootScope.$digest();

      expect(controllerSpy).toHaveBeenCalled();

      modal.destroy();
    });

    it('supports controllerAs syntax', function () {
      this.$templateCache.put('test/xxx2.html', '<div mw-modal title="test"><div mw-modal-body><span id="text">{{myCtrl.abc}}</span></div></div>');
      var modal = this.Modal.create({
        el: 'body',
        templateUrl: 'test/xxx2.html',
        controllerAs: 'myCtrl',
        controller: function () {
          this.abc = 'ABC';
        }
      });
      modal.show();
      this.$rootScope.$digest();

      expect(angular.element('body').find('#text').text()).toBe('ABC');

      modal.destroy();
    });

    it('supports $ctrl when no ctrlAs is defined', function () {
      this.$templateCache.put('test/xxx2.html', '<div mw-modal title="test"><div mw-modal-body><span id="text">{{$ctrl.abc}}</span></div></div>');
      var modal = this.Modal.create({
        el: 'body',
        templateUrl: 'test/xxx2.html',
        controller: function () {
          this.abc = 'ABC';
        }
      });
      modal.show();
      this.$rootScope.$digest();

      expect(angular.element('body').find('#text').text()).toBe('ABC');

      modal.destroy();
    });

    it('displays no modal when preresolvers are not yet resolved', function () {
      var modal = this.Modal.create({
        el: 'body',
        templateUrl: 'test/xxx.html',
        controller: function(){},
        resolve: {
          test: this.asyncPromiseFn
        }
      });
      modal.show();
      this.$rootScope.$digest();

      expect(angular.element('body').find('.mw-modal').length).toBe(0);

      modal.destroy();
    });

    it('displays modal when preresolvers are resolved', function () {
      var modal = this.Modal.create({
        el: 'body',
        templateUrl: 'test/xxx.html',
        controller: function(){},
        resolve: {
          test: this.asyncPromiseFn
        }
      });
      modal.show();
      this.$timeout.flush();
      this.$rootScope.$digest();

      expect(angular.element('body').find('.mw-modal').length).toBe(1);

      modal.destroy();
    });

    it('injects resolved values into controller ', function () {
      var controllerSpy = jasmine.createSpy('controller');
      var modal = this.Modal.create({
        el: 'body',
        templateUrl: 'test/xxx.html',
        controller: function(test){
          controllerSpy.call(this,test);
        },
        resolve: {
          test: this.asyncPromiseFn
        }
      });
      modal.show();
      this.$timeout.flush();
      this.$rootScope.$digest();

      expect(controllerSpy.calls.mostRecent().args[0]).toBe('resolved');

      modal.destroy();
    });
  });

  describe('testing events', function(){
    beforeEach(function () {
      this.myModal = this.Modal.create({
        templateUrl: 'test/xxx.html',
        el: 'body',
        controller: function(){},
        resolve:{
          test: this.asyncPromiseFn
        }
      });
    });

    afterEach(function () {
      this.myModal.destroy();
      this.$timeout.flush();
      this.$rootScope.$digest();
    });

    it('triggers $modalOpenStart and $modalResolveDependenciesStart event when show is called', function(){
      var modalOpenSpy = jasmine.createSpy('$modalOpenStart'),
        modalResolveSpy = jasmine.createSpy('$modalResolveDependenciesStart');
      this.$rootScope.$on('$modalOpenStart', modalOpenSpy);
      this.$rootScope.$on('$modalResolveDependenciesStart', modalResolveSpy);

      this.myModal.show();

      expect(modalOpenSpy).toHaveBeenCalled();
      expect(modalResolveSpy).toHaveBeenCalled();
    });

    it('triggers $modalResolveDependenciesSuccess when all dependencies are resolved', function(){
      var modalResolvedSpy = jasmine.createSpy('$modalResolveDependencies');
      this.$rootScope.$on('$modalResolveDependenciesSuccess', modalResolvedSpy);
      this.myModal.show();

      this.$timeout.flush();

      expect(modalResolvedSpy).toHaveBeenCalled();
    });

    it('triggers not $modalOpenSuccess when all dependencies are resolved', function(){
      var modalOpenedSpy = jasmine.createSpy('$modalOpenSuccess');
      this.$rootScope.$on('$modalOpenSuccess', modalOpenedSpy);
      this.myModal.show();

      this.$timeout.flush();

      expect(modalOpenedSpy).not.toHaveBeenCalled();
    });

    it('triggers $modalOpenSuccess when bootstrap shown event is triggered', function(){
      var modalOpenedSpy = jasmine.createSpy('$modalOpenSuccess');
      this.$rootScope.$on('$modalOpenSuccess', modalOpenedSpy);
      this.myModal.show();
      this.$timeout.flush();

      angular.element('body').find('.mw-modal .modal').trigger('shown.bs.modal');
      this.$rootScope.$digest();

      expect(modalOpenedSpy).toHaveBeenCalled();
    });

    it('triggers $modalCloseStart when modal is hidden', function(){
      var modalCloseSpy = jasmine.createSpy('$modalCloseSpy');
      this.$rootScope.$on('$modalCloseStart', modalCloseSpy);
      this.myModal.show();
      this.$timeout.flush();

      this.myModal.hide();
      this.$rootScope.$digest();

      expect(modalCloseSpy).toHaveBeenCalled();
    });

    it('triggers $modalCloseSuccess when bootstrap hidden event is triggered', function(){
      var modalCloseSpy = jasmine.createSpy('$modalCloseSuccess');
      this.$rootScope.$on('$modalCloseSuccess', modalCloseSpy);
      this.myModal.show();
      this.$timeout.flush();
      this.myModal.hide();

      angular.element('body').find('.mw-modal .modal').trigger('shown.bs.modal');
      this.$rootScope.$digest();

      expect(modalCloseSpy).toHaveBeenCalled();
    });

  });

});