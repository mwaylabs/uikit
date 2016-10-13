describe('testing mwForm ngModelErrors', function () {
  beforeEach(module('mwUI.Form'));

  beforeEach(inject(function ($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$compile = $compile;
  }));

  it('adds multiple errors for an input', function(){
    var input = '' +
      '<div ng-model-errors>' +
      '<input type="url" ng-model="test" ng-minlength="10"/>' +
      '</div>';
    var el = this.$compile(input)(this.scope);
    var ngModelErrorsCtrl = el.controller('ngModelErrors');

    el.find('input').val('abc').triggerHandler('input');
    this.scope.$digest();

    expect(ngModelErrorsCtrl.getErrors().length).toBe(2);
    expect(ngModelErrorsCtrl.getErrors().at(0).get('error')).toBe('url');
    expect(ngModelErrorsCtrl.getErrors().at(1).get('error')).toBe('minlength');
  });

  it('merges attributes of all inputs into one object', function(){
    var input = '' +
      '<div ng-model-errors>' +
      '<input type="text" ng-model="test" required ng-minlength="1"/>' +
      '<input type="text" ng-model="test2" required ng-maxlength="100"/>' +
      '</div>';
    var el = this.$compile(input)(this.scope);
    var ngModelErrorsCtrl = el.controller('ngModelErrors');

    this.scope.$digest();

    expect(ngModelErrorsCtrl.getErrors().first().get('attrs').ngMinlength).toBe('1');
    expect(ngModelErrorsCtrl.getErrors().first().get('attrs').ngMaxlength).toBe('100');
  });

  it('removes an error for an input when it becomes valid', function(){
    var input = '' +
      '<div ng-model-errors>' +
      '<input type="url" ng-model="test" ng-minlength="100"/>' +
      '</div>';
    var el = this.$compile(input)(this.scope);
    var ngModelErrorsCtrl = el.controller('ngModelErrors');
    this.scope.$digest();

    el.find('input').val('abc').triggerHandler('input');
    this.scope.$digest();
    el.find('input').val('http://abc.de').triggerHandler('input');
    this.scope.$digest();

    expect(ngModelErrorsCtrl.getErrors().length).toBe(1);
    expect(ngModelErrorsCtrl.getErrors().first().get('error')).toBe('minlength');
  });

  it('adds the same error for multiple inputs once', function(){
    var input = '' +
      '<div ng-model-errors>' +
      '<input type="text" ng-model="test" required/>' +
      '<input type="text" ng-model="test1" required/>' +
      '<input type="text" ng-model="test2" required/>' +
      '</div>';
    var el = this.$compile(input)(this.scope);
    var ngModelErrorsCtrl = el.controller('ngModelErrors');

    this.scope.$digest();

    expect(ngModelErrorsCtrl.getErrors().length).toBe(1);
    expect(ngModelErrorsCtrl.getErrors().first().get('error')).toBe('required');
    expect(ngModelErrorsCtrl.getErrors().first().get('inputIds').length).toBe(3);
  });

  it('does not remove the error when other inputs still have the error', function(){
    var input = '' +
      '<div ng-model-errors>' +
      '<input type="text" ng-model="test" required/>' +
      '<input type="text" ng-model="test1" required/>' +
      '<input type="text" ng-model="test2" required/>' +
      '</div>';
    var el = this.$compile(input)(this.scope);
    var ngModelErrorsCtrl = el.controller('ngModelErrors');
    this.scope.$digest();

    el.find('input').first().val('abc').triggerHandler('input');
    this.scope.$digest();

    expect(ngModelErrorsCtrl.getErrors().length).toBe(1);
    expect(ngModelErrorsCtrl.getErrors().first().get('inputIds').length).toBe(2);
  });

  it('removes the error when all inputs do not have the error anymore', function(){
    var input = '' +
      '<div ng-model-errors>' +
      '<input type="text" ng-model="test" required/>' +
      '<input type="text" ng-model="test1" required/>' +
      '<input type="text" ng-model="test2" required/>' +
      '</div>';
    var el = this.$compile(input)(this.scope);
    var ngModelErrorsCtrl = el.controller('ngModelErrors');
    var scope = this.scope;
    this.scope.$digest();

    el.find('input').each(function(){
      angular.element(this).val('abc').triggerHandler('input');
      scope.$digest();
    });

    expect(ngModelErrorsCtrl.getErrors().length).toBe(0);
  });
});