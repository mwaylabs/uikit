describe('mwModal', function() {

  beforeEach(module('mwModal'));

  describe('EnterKeyUpValidation', function() {
    var validateEnterKeyUp;
    var elementSpy = { click: function() {} };

    function EventStub(keyCode, targetNodeName, defaultPrevented) {
      this.keyCode = keyCode;
      this.target = {};
      this.target.nodeName = targetNodeName;
      this.isDefaultPrevented = function() {
        return defaultPrevented;
      };
    };

    beforeEach(inject(function(_validateEnterKeyUp_) {
      validateEnterKeyUp = _validateEnterKeyUp_;

      spyOn(elementSpy, 'click');
    }));

    it('does not click element if other key than enter pressed', function() {
      validateEnterKeyUp.clickIfValid(elementSpy, new EventStub(42, 'IRRELEVANT'), undefined);

      expect(elementSpy.click).not.toHaveBeenCalled();
    });

    it('clicks element if enter key pressed, controller undefined and event target nodename not SELECT', function() {
      validateEnterKeyUp.clickIfValid(elementSpy, new EventStub(13, 'NOT_SELECT'), undefined);

      expect(elementSpy.click).toHaveBeenCalled();
    });

    it('does not click element if target nodename is SELECT', function() {
      validateEnterKeyUp.clickIfValid(elementSpy, new EventStub(13, 'SELECT'), undefined);

      expect(elementSpy.click).not.toHaveBeenCalled();
    });

    it('does not click element if controller not valid', function() {
      var invalidController = {
        $valid : false
      };

      validateEnterKeyUp.clickIfValid(elementSpy, new EventStub(13, 'NOT_SELECT'), invalidController);

      expect(elementSpy.click).not.toHaveBeenCalled();
    });

    it('does not click the element if default action was prevented', function() {
      var DEFAULT_PREVENTED = true;

      validateEnterKeyUp.clickIfValid(elementSpy, new EventStub(13, 'NOT_SELECT', DEFAULT_PREVENTED), undefined);

      expect(elementSpy.click).not.toHaveBeenCalled();
    });

    it('clicks the element if default not prevented', function() {
      var DEFAULT_PREVENTED = false;

      validateEnterKeyUp.clickIfValid(elementSpy, new EventStub(13, 'NOT_SELECT', DEFAULT_PREVENTED), undefined);

      expect(elementSpy.click).toHaveBeenCalled();
    })
  });
});