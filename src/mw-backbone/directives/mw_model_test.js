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
});