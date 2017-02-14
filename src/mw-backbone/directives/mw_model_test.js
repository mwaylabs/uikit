describe('testing mwModel', function () {

  beforeEach(module('mwUI.Backbone'));

  beforeEach(inject(function ($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$compile = $compile;
    this.testModel = new (mwUI.Backbone.Model.extend({
      defaults: function () {
        return {
          text: 'Abc',
          date: new Date(1),
          checkbox: true,
          radio: 'green',
          select: {
            id: 1,
            label: 'Eins'
          }
        };
      }
    }))();
  }));

  describe('sets ngModel val from Backbone model', function () {
    it('for input type text', function () {
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      expect(this.scope.text).toBe('Abc');
    });

    it('for input type text when ngModel a nested object', function () {
      var input = '<input type="text" ng-model="viewModel.text" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.viewModel = {
        text: ''
      };
      this.scope.testModel = this.testModel;

      this.scope.$digest();

      expect(this.scope.viewModel.text).toBe('Abc');
    });

    it('for input type date', function () {
      var input = '<input type="date" ng-model="date" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;

      this.scope.$digest();

      expect(this.scope.date).toEqual(this.testModel.get('date'));
    });

    it('for input type checkbox', function () {
      var input = '<input type="checkbox" ng-model="checkbox" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;

      this.scope.$digest();

      expect(this.scope.checkbox).toBeTruthy();
    });

    it('for input type radio', function () {
      var input = '<div>' +
        '<input type="radio" ng-model="radio" mw-model="testModel" value="red" />' +
        '<input type="radio" ng-model="radio" mw-model="testModel" value="green"/>' +
        '<input type="radio" ng-model="radio" mw-model="testModel" value="blue"/>' +
        '</div>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;

      this.scope.$digest();

      expect(this.scope.radio).toBe('green');
    });

    it('for selectbox', function () {
      var input = '<select ng-options="item as item.label for item in options track by item.id" ng-model="select" mw-model="testModel"></select>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.options = [{id: 1, label: 'eins'}, {id: 2, label: 'zwei'}];

      this.scope.$digest();

      expect(this.scope.select).toEqual({id: 1, label: 'Eins'});
    });
  });

  describe('dirty check', function(){
    it('is not dirty when it sets value from backbone model during initialization', function(){
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      var $el = this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      expect($el.hasClass('ng-pristine')).toBeTruthy();
    });

    it('is dirty when ng-model changes', function(){
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      var $el = this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      $el.val('XYZ').triggerHandler('input');
      this.scope.$digest();

      expect($el.hasClass('ng-pristine')).toBeFalsy();
    });

    it('is dirty when mw-model changes', function(){
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      var $el = this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      this.scope.testModel.set('text','XYZ');
      this.scope.$digest();

      expect($el.hasClass('ng-pristine')).toBeFalsy();
    });
  });

  describe('updates ngModel when Backbone model changes', function () {
    it('for input type text', function () {
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      this.testModel.set('text', '123');
      this.scope.$digest();

      expect(this.scope.text).toBe('123');

    });

    it('for input type date', function () {
      var input = '<input type="date" ng-model="date" mw-model="testModel"/>',
        date = new Date();
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      this.testModel.set('date', date);
      this.scope.$digest();

      expect(this.scope.date).toEqual(date);

    });

    it('for input type checkbox', function () {
      var input = '<input type="checkbox" ng-model="checkbox" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      this.testModel.set('checkbox', false);
      this.scope.$digest();

      expect(this.scope.checkbox).toBeFalsy();
    });

    it('for input type radio', function () {
      var input = '<div>' +
        '<input type="radio" ng-model="radio" mw-model="testModel" value="red" />' +
        '<input type="radio" ng-model="radio" mw-model="testModel" value="green"/>' +
        '<input type="radio" ng-model="radio" mw-model="testModel" value="blue"/>' +
        '</div>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      this.testModel.set('radio', 'blue');
      this.scope.$digest();

      expect(this.scope.radio).toBe('blue');
    });

    it('for selectbox', function () {
      var input = '<select ng-options="item as item.label for item in options track by item.id" ng-model="select" mw-model="testModel"></select>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.options = [{id: 1, label: 'eins'}, {id: 2, label: 'zwei'}];
      this.scope.$digest();

      this.testModel.set('select', this.scope.options[1]);
      this.scope.$digest();

      expect(this.scope.select).toEqual(this.scope.options[1]);
    });
  });

  describe('updates Backbone model when ng-Model changes', function () {
    it('sets value of backbone model from ng-model', function () {
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.testModel.unset('text');

      this.scope.text = 'VALUE';
      this.scope.$digest();

      expect(this.scope.testModel.get('text')).toBe('VALUE');
    });

    it('updates backbone model when ng-model changes', function () {
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      var el = this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      el.val('XYZ').triggerHandler('input');
      this.scope.$digest();

      expect(this.scope.testModel.get('text')).toBe('XYZ');
    });

    it('unsets backbone model when value of ng-model is invalid', function () {
      var input = '<input type="url" ng-model="text" mw-model="testModel" ng-minlength="3"/>';
      var el = this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.$digest();

      el.val('A').triggerHandler('input');
      this.scope.$digest();

      expect(this.scope.testModel.get('text')).toBeUndefined();
    });

    it('fires backbone change events when ng-Model changes', function () {
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      var el = this.$compile(input)(this.scope);
      var changeSpy = jasmine.createSpy('backboneChangeSpy');
      this.scope.testModel = this.testModel;
      this.scope.testModel.on('change:text',changeSpy);
      this.scope.$digest();

      el.val('XYZ').triggerHandler('input');
      this.scope.$digest();

      expect(changeSpy).toHaveBeenCalled();
    });
  });

  describe('testing backbone attribute options', function(){
    it('uses attribute name that was defined in mw-model-attr', function(){
      var input = '<input type="text" ng-model="text" mw-model="testModel" mw-model-attr="abc"/>';
      var el = this.$compile(input)(this.scope);
      var changeSpy = jasmine.createSpy('backboneChangeSpy');
      this.scope.testModel = this.testModel;
      this.scope.testModel.on('change:abc',changeSpy);
      this.scope.$digest();

      el.val('XYZ').triggerHandler('input');
      this.scope.$digest();

      expect(changeSpy).toHaveBeenCalled();
    });

    it('uses attribute name that was defined in mw-model-attr as function', function(){
      var input = '<input type="text" ng-model="text" mw-model="testModel" mw-model-attr="{{getModelAttr()}}"/>';
      var el = this.$compile(input)(this.scope);
      var changeSpy = jasmine.createSpy('backboneChangeSpy');
      this.scope.testModel = this.testModel;
      this.scope.getModelAttr = function(){
        return 'fn';
      };
      this.scope.testModel.on('change:fn',changeSpy);
      this.scope.$digest();

      el.val('XYZ').triggerHandler('input');
      this.scope.$digest();

      expect(changeSpy).toHaveBeenCalled();
    });

    it('uses ng-model attribute that was defined in dot notation', function(){
      var input = '<input type="text" ng-model="viewModel.text" mw-model="testModel"/>';
      var el = this.$compile(input)(this.scope);
      var changeSpy = jasmine.createSpy('backboneChangeSpy');
      this.scope.testModel = this.testModel;
      this.scope.testModel.on('change:text',changeSpy);
      this.scope.$digest();

      el.val('XYZ').triggerHandler('input');
      this.scope.$digest();

      expect(changeSpy).toHaveBeenCalled();
    });
  });

  it('throws error when ng-model and backbone model is defined and values are different', function(){
    var exception = function(){
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.testModel.set('text','VALUE_1');

      this.scope.text = 'VALUE_2';
      this.scope.$digest();
    }.bind(this);

    expect(exception).toThrowError();
  });

  it('throws no error when ng-model and backbone model is defined but the values are the same', function(){
    var exception = function(){
      var input = '<input type="text" ng-model="text" mw-model="testModel"/>';
      this.$compile(input)(this.scope);
      this.scope.testModel = this.testModel;
      this.scope.testModel.set('text','VALUE');

      this.scope.text = 'VALUE';
      this.scope.$digest();
    }.bind(this);

    expect(exception).not.toThrowError();
  });
});