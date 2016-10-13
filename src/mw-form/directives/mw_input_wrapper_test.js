describe('testing mwForm ngModel', function () {
  beforeEach(module('mwUI.Form'));

  beforeEach(module('karmaDirectiveTemplates'));

  window.mockI18nService();

  beforeEach(inject(function ($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$compile = $compile;
  }));

  describe('testing setting error state', function () {
    it('adds invalid class when input is invalid', function () {
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" ng-minlength="4"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);

      this.scope.$digest();
      el.find('input').val('abc').triggerHandler('input');

      expect(el.children().hasClass('is-invalid')).toBeTruthy();
    });

    it('removes invalid class when input becomes valid', function () {
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" ng-minlength="4"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);

      this.scope.$digest();
      el.find('input').val('abc').triggerHandler('input');
      el.find('input').val('abcd').triggerHandler('input');

      expect(el.children().hasClass('is-invalid')).toBeFalsy();
    });

    it('adds dirty class when something is written into the input', function () {
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" ng-minlength="4"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);

      this.scope.$digest();
      el.find('input').val('abc').triggerHandler('input');

      expect(el.children().hasClass('is-dirty')).toBeTruthy();
    });

    it('adds touched class when something is written into the input and then unfocused', function () {
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" ng-minlength="4"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);

      this.scope.$digest();
      el.find('input').val('abc').triggerHandler('input');
      el.find('input').triggerHandler('blur');

      expect(el.children().hasClass('is-touched')).toBeTruthy();
    });

    it('adds required class when input is required', function () {
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" ng-required="isRequired"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.$digest();
      el.find('input').scope().isRequired = true;

      this.scope.$digest();

      expect(el.children().hasClass('is-required')).toBeTruthy();
    });

    it('removes required class when input is not required anymore', function () {
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test" ng-required="isRequired"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.$digest();
      el.find('input').scope().isRequired = true;
      this.scope.$digest();

      el.find('input').scope().isRequired = false;
      this.scope.$digest();

      expect(el.children().hasClass('is-required')).toBeFalsy();
    });

    it('adds focus class when input is focused', function () {
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.$digest();

      el.find('input').triggerHandler('focus');
      this.scope.$digest();

      expect(el.children().hasClass('is-focused')).toBeTruthy();
    });

    it('removes focus class when input is blured', function () {
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="text" ng-model="test"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.$digest();

      el.find('input').triggerHandler('focus');
      this.scope.$digest();
      el.find('input').triggerHandler('blur');
      this.scope.$digest();

      expect(el.children().hasClass('is-focused')).toBeFalsy();
    });

    it('has error class and messages when hide-errors is set to false', function(){
      var input = '' +
        '<div mw-input-wrapper hide-errors="hideErrors">' +
        '<input type="url" ng-model="test"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.hideErrors = false;
      this.scope.$digest();

      el.find('input').val('xyz').triggerHandler('input');
      this.scope.$digest();

      expect(el.children().hasClass('has-error')).toBeTruthy();
      expect(el.find('.error-message').length).toBe(1);
    });

    it('has no error class but messages when hide-errors is set to false and it has required error but is not dirty', function(){
      var input = '' +
        '<div mw-input-wrapper hide-errors="hideErrors">' +
        '<input type="url" ng-model="test" required/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.hideErrors = false;

      this.scope.$digest();

      expect(el.children().hasClass('has-error')).toBeFalsy();
      expect(el.find('.error-message').length).toBe(1);
    });

    it('has error class and message when hide-errors is set to false and it has required error and is dirty', function(){
      var input = '' +
        '<div mw-input-wrapper hide-errors="hideErrors">' +
        '<input type="text" ng-model="test" required/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.hideErrors = false;
      this.scope.$digest();

      el.find('input').val('xyz').triggerHandler('input');
      this.scope.$digest();
      el.find('input').val('').triggerHandler('input');
      this.scope.$digest();

      expect(el.children().hasClass('has-error')).toBeTruthy();
      expect(el.find('.error-message').length).toBe(1);
    });

    it('has no error class and no messages when hide-errors is set to true', function(){
      var input = '' +
        '<div mw-input-wrapper hide-errors="hideErrors">' +
        '<input type="url" ng-model="test"/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.hideErrors = true;
      this.scope.$digest();

      el.find('input').val('xyz').triggerHandler('input');
      this.scope.$digest();

      expect(el.children().hasClass('has-error')).toBeFalsy();
      expect(el.find('.error-message').length).toBe(0);
    });

    it('has required error class when input is required and invalid', function(){
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="url" ng-model="test" required/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.hideErrors = true;
      this.scope.$digest();

      el.find('input').val('xyz').triggerHandler('input');
      this.scope.$digest();

      expect(el.children().hasClass('is-required-error')).toBeTruthy();
    });

    it('has no required error class when input is required and valid', function(){
      var input = '' +
        '<div mw-input-wrapper>' +
        '<input type="url" ng-model="test" required/>' +
        '</div>';
      var el = this.$compile(input)(this.scope);
      this.scope.hideErrors = true;
      this.scope.$digest();

      el.find('input').val('xyz').triggerHandler('input');
      this.scope.$digest();
      el.find('input').val('http://jo.de').triggerHandler('input');
      this.scope.$digest();

      expect(el.children().hasClass('is-required-error')).toBeFalsy();
    });
  });
});