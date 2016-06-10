describe('testing mwErrorMessages', function () {
  beforeEach(module('mwUI.Form'));

  beforeEach(module('karmaDirectiveTemplates'));

  window.mockI18nService();

  beforeEach(inject(function ($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$compile = $compile;
  }));

  it('displays default registered isRequired error message on required error', function(){
    var el = '' +
      '<div ng-model-errors>' +
      '<input type="text" ng-model="test" required/>' +
      '<div mw-error-messages></div> ' +
      '</div>';
    var $el = this.$compile(el)(this.scope);

    this.scope.$digest();

    expect($el.find('.error-message').length).toBe(1);
    expect($el.find('.error-message').first().text()).toBe('mwErrorMessages.required');
  });

  it('does not display default registered isRequired error message when ngModel becomes valid', function(){
    var el = '' +
      '<div ng-model-errors>' +
      '<input type="text" ng-model="test" required/>' +
      '<div mw-error-messages></div> ' +
      '</div>';
    var $el = this.$compile(el)(this.scope);
    this.scope.$digest();

    $el.find('input').val('A').triggerHandler('input');
    this.scope.$digest();

    expect($el.find('.error-message').length).toBe(0);
  });

  it('displays default registered validation error message on validation error', function(){
    var el = '' +
      '<div ng-model-errors>' +
      '<input type="text" ng-model="test" required ng-minlength="2"/>' +
      '<div mw-error-messages></div> ' +
      '</div>';
    var $el = this.$compile(el)(this.scope);
    this.scope.$digest();

    $el.find('input').val('A').triggerHandler('input');
    this.scope.$digest();

    expect($el.find('.error-message').length).toBe(1);
    expect($el.find('.error-message').first().text()).toBe('mwErrorMessages.hasToBeMinLength');
  });
});