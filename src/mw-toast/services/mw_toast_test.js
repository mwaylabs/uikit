/**
 * Created by zarges on 30/06/15.
 */
'use strict';
describe('mwUi Response Handler', function () {
  var $rootScope,
    $timeout,
    ToastProvider,
    Toast;


  beforeEach(module('mwUI.Toast'));

  beforeEach(function () {
    module('mwUI.Toast', function (_ToastProvider_) {
      ToastProvider = _ToastProvider_;
    });
  });

  beforeEach(inject(function (_$rootScope_, _$timeout_, _Toast_) {
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    Toast = _Toast_;
  }));

  describe('configuring provider', function () {

    it('should be possible to configure the default autoHide time', function(){
      expect(ToastProvider.setAutoHideTime).toBeDefined();
    });

  });

  describe('using service', function(){

    it('should be possible to add a toast', function(){
      var toast = Toast.addToast('Jop');
      expect(toast.message).toEqual('Jop');
    });

    it('should be possible to get registered toasts', function(){
      Toast.addToast('Jop');
      expect(Toast.getToasts().length).toBe(1);
    });

    it('should set default options of the toast when no options are defined', function(){
      Toast.addToast('Jop');
      expect(Toast.getToasts()[0].id).toMatch(/toast\d+/);
      expect(Toast.getToasts()[0].type).toBe('default');
      expect(Toast.getToasts()[0].message).toBe('Jop');
      expect(Toast.getToasts()[0].autoHide).toBeFalsy();
      expect(Toast.getToasts()[0].autoHideTime).toBe(5000);
    });

    it('should use the autoHide time that was configured', function(){
      ToastProvider.setAutoHideTime(123456);
      Toast.addToast('Jop');
      expect(Toast.getToasts()[0].autoHideTime).toBe(123456);
    });

    it('should set the toast options when they are passed as parameter', function(){
      ToastProvider.setAutoHideTime(123456);
      var spy = jasmine.createSpy('autoHideCallback');
      var opts = {
        id: 'my_id',
        type: 'success',
        autoHide: true,
        autoHideTime: 10,
        autoHideCallback: spy,
        isHtmlMessage: true,
        button: {
          title: 'OK',
          link: 'http://www.jo.de',
          action: function(){}
        }
      };

      Toast.addToast('Jop', opts);
      var toastOpts = Toast.getToasts()[0];
      expect(toastOpts.id).toEqual('my_id');
      expect(toastOpts.type).toEqual('success');
      expect(toastOpts.autoHide).toBeTruthy();
      expect(toastOpts.autoHideTime).toBe(10);
      expect(toastOpts.isHtmlMessage).toBeTruthy();
      for(var key in opts.button){
        expect(opts.button[key]).toBe(toastOpts.button[key]);
      }
      toastOpts.autoHideCallback();
      $timeout.flush();
      expect(spy).toHaveBeenCalled();
    });

    it('should find a toast by an id', function(){
      Toast.addToast('Jop', {id:'a'});

      expect(Toast.findToast('a')).toBeDefined();
      expect(Toast.findToast('a').message).toEqual('Jop');
      expect(Toast.findToast('b')).toBeFalsy();
    });

    it('should be possible to replace a toast', function(){
      Toast.addToast('Jop', {id:'a'});
      Toast.replaceToastMessage('a', 'A');
      expect(Toast.findToast('a').message).toEqual('A');
    });

    it('should replace the previous toast message when a new toast with the same id is added again', function(){
      Toast.addToast('Jop', {id:'a'});
      Toast.addToast('Jop 1', {id:'a'});
      Toast.addToast('Jop 2', {id:'a'});
      Toast.addToast('Jop 2', {id:'b'});

      expect(Toast.getToasts().length).toBe(2);
      expect(Toast.getToasts()[0].message).toEqual('Jop 2');
      expect(Toast.getToasts()[1].message).toEqual('Jop 2');
    });

    it('should be possible to remove a toast', function(){
      Toast.addToast('Jop', {id:'a'});
      Toast.addToast('Jop B', {id:'b'});
      expect(Toast.getToasts().length).toBe(2);
      Toast.removeToast('a');
      expect(Toast.getToasts().length).toBe(1);
      var removeSuccessFul = Toast.removeToast('c');
      expect(removeSuccessFul).toBeFalsy();
      expect(Toast.getToasts().length).toBe(1);
      expect(Toast.getToasts()[0].message).toEqual('Jop B');
    });

    describe('testing autoHide functionality', function(){

      beforeEach(function(){
        jasmine.clock().install();
      });

      afterEach(function(){
        jasmine.clock().uninstall();
      });

      it('should remove the toast automatically when autoHide is set to true', function(){
        ToastProvider.setAutoHideTime(100);
        Toast.addToast('Jop', {id:'a', autoHide: true});
        expect(Toast.getToasts().length).toBe(1);
        jasmine.clock().tick(99);
        expect($timeout.flush).toThrow();
        expect(Toast.getToasts().length).toBe(1);
        jasmine.clock().tick(1);
        expect($timeout.flush).not.toThrow();
        expect(Toast.getToasts().length).toBe(0);
      });

      it('should reset the autoHide counter when a message of a toast has been replaced', function(){
        ToastProvider.setAutoHideTime(100);
        Toast.addToast('Jop', {id:'a', autoHide: true});

        expect(Toast.getToasts().length).toBe(1);
        jasmine.clock().tick(50);
        expect($timeout.flush).toThrow();
        expect(Toast.getToasts().length).toBe(1);

        Toast.addToast('Jop', {id: 'a'});

        jasmine.clock().tick(50);
        expect($timeout.flush).toThrow();
        expect(Toast.getToasts().length).toBe(1);

        jasmine.clock().tick(49);
        expect($timeout.flush).toThrow();
        expect(Toast.getToasts().length).toBe(1);

        jasmine.clock().tick(1);
        expect($timeout.flush).not.toThrow();
        expect(Toast.getToasts().length).toBe(0);

      });

    });

  });

});
