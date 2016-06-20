describe('testing mwModel', function () {

  beforeEach(module('mwUI.Backbone'));

  beforeEach(inject(function ($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$compile = $compile;
    this.testCollection = new mwUI.Backbone.Collection()
  }));

  it('sets ng-model to value of mw-collection when at least one model is in collection', function () {
    var input = '<input type="text" ng-model="text" mw-collection="testCollection"/>';
    this.$compile(input)(this.scope);
    this.scope.testCollection = this.testCollection;
    this.testCollection.add({id:1});
    this.scope.$digest();

    expect(this.scope.text).toEqual(this.testCollection);
  });

  it('does not set ng-model to value of mw-collection when no model is in collection', function () {
    var input = '<input type="text" ng-model="text" mw-collection="testCollection"/>';
    this.$compile(input)(this.scope);
    this.scope.testCollection = this.testCollection;
    this.scope.$digest();

    expect(this.scope.text).toBeUndefined();
  });

  it('sets ng-model to value of mw-collection when a model is added to collection', function () {
    var input = '<input type="text" ng-model="text" mw-collection="testCollection"/>';
    this.$compile(input)(this.scope);
    this.scope.testCollection = this.testCollection;
    this.scope.$digest();

    this.testCollection.add({id: 1});
    this.scope.$digest();

    expect(this.scope.text).toEqual(this.testCollection);
  });

  it('sets ng-model to value of mw-collection when a model is added to collection', function () {
    var input = '<input type="text" ng-model="text" mw-collection="testCollection"/>';
    this.$compile(input)(this.scope);
    this.scope.testCollection = this.testCollection;
    this.testCollection.add({id: 1});
    this.scope.$digest();

    this.testCollection.remove({id: 1});
    this.scope.$digest();

    expect(this.scope.text).toBeUndefined();
  });


});