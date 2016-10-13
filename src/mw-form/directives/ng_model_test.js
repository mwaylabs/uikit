describe('testing mwForm ngModel', function () {
  beforeEach(module('mwUI.Form'));

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(inject(function ($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$compile = $compile;
  }));

  describe('testing setting error state', function () {
    it('adds errors to ngModelErrors directive when ng-model is invalid', function () {
      var input = '' +
        '<div ng-model-errors>' +
        '<input type="text" ng-model="test" required/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      var ngModelErrorsCtrl = el.controller('ngModelErrors');
      spyOn(ngModelErrorsCtrl, 'addErrorsForInput');

      this.scope.$digest();

      expect(ngModelErrorsCtrl.addErrorsForInput).toHaveBeenCalled();
      expect(ngModelErrorsCtrl.addErrorsForInput.calls.mostRecent().args[0]).toEqual(['required']);
    });

    it('removes errors from ngModelErrors directive when ng-model becomes valid', function () {
      var input = '' +
        '<div ng-model-errors>' +
        '<input type="text" ng-model="test" required/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      var ngModelErrorsCtrl = el.controller('ngModelErrors');
      spyOn(ngModelErrorsCtrl, 'removeErrorsForInput');

      this.scope.$digest();
      el.find('input').val('irrelevant').triggerHandler('input');
      this.scope.$digest();

      expect(ngModelErrorsCtrl.removeErrorsForInput).toHaveBeenCalled();
      expect(ngModelErrorsCtrl.removeErrorsForInput.calls.mostRecent().args[0]).toEqual(['required']);
    });

    it('removes errors from ngModelErrors directive when ng-model becomes valid', function () {
      var input = '' +
        '<div ng-model-errors>' +
        '<input type="text" ng-model="test" required ng-minlength="2"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      var ngModelErrorsCtrl = el.controller('ngModelErrors');
      spyOn(ngModelErrorsCtrl, 'addErrorsForInput');
      spyOn(ngModelErrorsCtrl, 'removeErrorsForInput');

      this.scope.$digest();
      el.find('input').val('a').triggerHandler('input');
      this.scope.$digest();
      el.find('input').val('ab').triggerHandler('input');
      this.scope.$digest();

      expect(ngModelErrorsCtrl.addErrorsForInput.calls.all()[0].args[0]).toEqual(['required']);
      expect(ngModelErrorsCtrl.removeErrorsForInput.calls.all()[0].args[0]).toEqual([]);
      expect(ngModelErrorsCtrl.addErrorsForInput.calls.all()[1].args[0]).toEqual(['minlength']);
      expect(ngModelErrorsCtrl.removeErrorsForInput.calls.all()[1].args[0]).toEqual(['required']);
      expect(ngModelErrorsCtrl.addErrorsForInput.calls.all()[2].args[0]).toEqual([]);
      expect(ngModelErrorsCtrl.removeErrorsForInput.calls.all()[2].args[0]).toEqual(['minlength']);
    });
  });

  describe('testing setting model state', function () {

    it('sets model state on initialisation when input has no errors', function () {
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test"/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      expect(inputWrapperCtrl.getModelState().valid).toBeTruthy();
    });

    it('sets model state on initialisation when input has errors', function () {
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" required/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      expect(inputWrapperCtrl.getModelState().valid).toBeFalsy();
    });

    it('updates model state when input is modified', function () {
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" required/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      $inputWrapper.find('input').val('XYZ').triggerHandler('input');

      expect(inputWrapperCtrl.getModelState().valid).toBeTruthy();
      expect(inputWrapperCtrl.getModelState().dirty).toBeTruthy();
      expect(inputWrapperCtrl.getModelState().touched).toBeFalsy();
    });

    it('updates model state when focus of input is left', function () {
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" required/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      $inputWrapper.find('input').triggerHandler('blur');

      expect(inputWrapperCtrl.getModelState().touched).toBeTruthy();
    });

  });

  describe('testing setting input state', function(){
    it('sets input state on initialisation when input is not required', function () {
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test"/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      expect(inputWrapperCtrl.getInputState().required).toBeFalsy();
    });

    it('sets input state on initialisation when input is required', function () {
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" required/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      expect(inputWrapperCtrl.getInputState().required).toBeTruthy();
    });

    it('sets input focus state on initialisation', function () {
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test"/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      expect(inputWrapperCtrl.getInputState().focused).toBeFalsy();
    });

    it('updates required state when input becomes required', function(){
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" ng-required="isRequired"/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var inputElScope = $inputWrapper.find('input').scope();
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      inputElScope.isRequired = true;
      this.scope.$digest();

      expect(inputWrapperCtrl.getInputState().required).toBeTruthy();
    });

    it('updates focus state when input becomes focused', function(){
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test"/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var $inputEl = $inputWrapper.find('input');
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      $inputEl.focus().triggerHandler('focus');
      this.scope.$digest();

      expect(inputWrapperCtrl.getInputState().focused).toBeTruthy();
    });

    it('updates focus state when focus of input is left', function(){
      var inputWrapper = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test"/>' +
        ' </div>';
      var $inputWrapper = this.$compile(inputWrapper)(this.scope);
      this.scope.$digest();
      var $inputEl = $inputWrapper.find('input');
      var inputWrapperCtrl = $inputWrapper.controller('mwInputWrapper');

      $inputEl.focus().triggerHandler('focus');
      this.scope.$digest();
      $inputEl.blur().triggerHandler('blur');
      this.scope.$digest();

      expect(inputWrapperCtrl.getInputState().focused).toBeFalsy();
    });
  });

});