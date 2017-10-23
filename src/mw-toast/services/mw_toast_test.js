describe('ToastTest', function () {
  var $rootScope,
    $timeout,
    mwScheduler,
    ToastProvider,
    subject;


  beforeEach(module('mwUI.Toast'));

  beforeEach(function () {
    module('mwUI.Toast', function (_ToastProvider_) {
      ToastProvider = _ToastProvider_;
    });
  });

  beforeEach(module(function ($provide) {
    //create stubs to mimic external input-methods from the real context
    var mwSchedulerStub = {
      add: function (callback, execIn, id, scope) {
        this.task = {
          execute: function(){
            if(callback){
              callback.apply(scope);
            }
          },
          resetTime: function(){}
        };
      },
      get: function () {
       if(this.task){
         return this.task;
       }
      },
      remove: function(){
        this.task = null;
      }
    };


    //redirect calls-to-this-external-methods to the stubs / spies
    $provide.value('mwScheduler', mwSchedulerStub);
  }));

  beforeEach(inject(function (_$rootScope_, _$timeout_, _Toast_, _mwScheduler_) {
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    mwScheduler = _mwScheduler_;
    subject = _Toast_;
  }));

  describe('using service', function(){

    it('adds a toast', function(){
      subject.addToast('xxx');

      expect(subject.getToasts().length).toBe(1);
    });

    it('sets defaults when adding a toast', function(){
      var toast = subject.addToast('xxx');

      expect(toast.id).toMatch(/toast\d+/);
      expect(toast.type).toBe('default');
      expect(toast.message).toBe('xxx');
      expect(toast.autoHide).toBeFalsy();
      expect(toast.autoHideTime).toBe(5000);
    });

    it('uses global auto hide time when it was configured', function(){
      ToastProvider.setAutoHideTime(123456);
      var toast = subject.addToast('xxx');

      expect(toast.autoHideTime).toBe(123456);
    });

    it('uses parameter for toast when defined', function(){
      ToastProvider.setAutoHideTime(123456);
      var callback = function(){};
      var opts = {
        id: 'my_id',
        type: 'success',
        autoHide: true,
        autoHideTime: 10,
        autoHideCallback: callback,
        isHtmlMessage: true,
        button: {
          title: 'xxx',
          link: 'xxx',
          action: function(){}
        }
      };
      var toast = subject.addToast('xxx', opts);

      expect(toast.id).toEqual('my_id');
      expect(toast.type).toEqual('success');
      expect(toast.autoHide).toBeTruthy();
      expect(toast.autoHideTime).toBe(10);
      expect(toast.isHtmlMessage).toBeTruthy();
      expect(toast.autoHideCallback).toBe(callback);
      for(var key in opts.button){
        expect(opts.button[key]).toBe(toast.button[key]);
      }
    });

    it('finds toast by id', function(){
      var toastId = 1;
      var toast = subject.addToast('xxx', {id:toastId});

      expect(subject.findToast(toastId)).toBe(toast);
    });

    it('replaces a toast', function(){
      var toastId = 1;
      var toast = subject.addToast('xxx', {id:toastId});

      subject.replaceToastMessage(toastId, 'abc');

      expect(toast.message).toEqual('abc');
    });

    it('replaces the previous toast message when a new toast with the same id is added again', function(){
      subject.addToast('xxx', {id:1});
      subject.addToast('abc', {id:1});

      expect(subject.getToasts().length).toBe(1);
      expect(subject.getToasts()[0].message).toEqual('abc');
    });

    it('removes a toast', function(){
      var toastId = 1;
      subject.addToast('xxx', {id:toastId});

      subject.removeToast(toastId);
      $timeout.flush();

      expect(subject.getToasts().length).toBe(0);
    });

    it('registers autoHide task at mwScheduler when autoHide is set to true', function(){
      var addSpy = spyOn(mwScheduler, 'add');
      subject.addToast('xxx', {autoHide: true});

      expect(addSpy).toHaveBeenCalled();
    });

    it('does not register autoHide task at mwScheduler when autoHide is set to false', function(){
      var addSpy = spyOn(mwScheduler, 'add');
      subject.addToast('xxx', {autoHide: false});

      expect(addSpy).not.toHaveBeenCalled();
    });

    it('removes autoHide task from mwScheduler when toast is removed', function(){
      var toastId = 1;
      var removeSpy = spyOn(mwScheduler, 'remove');
      subject.addToast('xxx', {autoHide: false, id: toastId});

      subject.removeToast(toastId);

      expect(removeSpy).toHaveBeenCalled();
    });

    it('resets autoHide task time when updating toast message', function(){
      var toastId = 1;
      subject.addToast('xxx', {autoHide: true, id: toastId});
      var task = mwScheduler.get();
      var resetSpy = spyOn(task, 'resetTime');

      subject.replaceToastMessage(toastId, 'abc');

      expect(resetSpy).toHaveBeenCalled();
    });

    it('hides toast when autoHide task of mwScheduler is executed', function(){
      var toastId = 1;
      subject.addToast('xxx', {autoHide: true, id: toastId});
      var task = mwScheduler.get();

      task.execute();
      $timeout.flush();

      expect(subject.getToasts().length).toBe(0);
    });
  });
});
