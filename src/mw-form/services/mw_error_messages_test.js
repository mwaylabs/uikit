describe('testing mwErrorMessages', function(){
  var mwValidationMessagesProvider;

  beforeEach(module('mwUI.Form'));

  beforeEach(function () {
    module('mwUI.Form', function (_mwValidationMessagesProvider_) {
      mwValidationMessagesProvider = _mwValidationMessagesProvider_;
    });
  });

  beforeEach(function() {
    module(function ($provide) {
      $provide.service('i18n', function () {
        return {
          get: function (key, opts) {
            if(key === 'i18n.validatorMsg'){
              return 'TRANSLATION';
            } else if(key ==='i18n.validatorMsgOpts' && opts && opts.min){
              return 'TRANSLATION '+opts.min;
            }
          },
          translationIsAvailable: function (key) {
            if (key === 'i18n.validatorMsg' || key === 'i18n.validatorMsgOpts') {
              return true;
            } else {
              return false;
            }
          }
        };
      });
    });
  });

  beforeEach(inject(function (mwValidationMessages, i18n) {
    this.mwValidationMessages = mwValidationMessages;
    this.i18n = i18n;
  }));

  describe('provider', function(){
    it('registers a validation message as string', function(){
      mwValidationMessagesProvider.registerValidator('custom','Custom validator');
    });

    it('registers a validation message as function', function(){
      mwValidationMessagesProvider.registerValidator('custom',function(){});
    });

    it('registers not something else as a validation message', function(){
      var registerWrongType = function(){
        mwValidationMessagesProvider.registerValidator('custom',{});
      };
      expect(registerWrongType).toThrow();
    });

    it('is not possible to register the same validator twice', function(){
      var registerWrongType = function(){
        mwValidationMessagesProvider.registerValidator('custom','ABC');
        mwValidationMessagesProvider.registerValidator('custom','DEF');
      };
      expect(registerWrongType).toThrow();
    });
  });

  describe('service', function(){
    beforeEach(function(){
      mwValidationMessagesProvider.registerValidator('TEST','ABC');
      this.validatorSpy = jasmine.createSpy('validatorSpy').and.callFake(function(){
        return 'JO';
      });
      mwValidationMessagesProvider.registerValidator('TESTFN',this.validatorSpy);
      mwValidationMessagesProvider.registerValidator('TESTI18N','i18n.validatorMsg');
      mwValidationMessagesProvider.registerValidator('TESTI18NOPTS','i18n.validatorMsgOpts');
    });

    it('returns all registered messages', function(){
      expect(_.size(this.mwValidationMessages.getRegisteredValidators())).toBeGreaterThan(0);
    });

    it('returns a message for a registered validator', function(){
      expect(this.mwValidationMessages.getMessageFor('TEST')).toBe('ABC');
    });

    it('returns a message for a registered string validator', function(){
      expect(this.mwValidationMessages.getMessageFor('TEST')).toBe('ABC');
    });

    it('returns a message for a registered translation validator', function(){
      expect(this.mwValidationMessages.getMessageFor('TESTI18N')).toBe('TRANSLATION');
    });

    it('returns a message for a registered translation validator', function(){
      expect(this.mwValidationMessages.getMessageFor('TESTI18NOPTS',{min: 5})).toBe('TRANSLATION 5');
    });

    it('returns a message for a registered function validator', function(){
      this.mwValidationMessages.getMessageFor('TESTFN');

      expect(this.validatorSpy).toHaveBeenCalled();
      expect(this.validatorSpy.calls.mostRecent().args[0]).toEqual(this.i18n);
    });

    it('returns a message for a registered string validator with options', function(){
      var options = {test: true};
      this.mwValidationMessages.getMessageFor('TESTFN',options);

      expect(this.validatorSpy.calls.mostRecent().args[1]).toEqual(options);
    });
  });

});