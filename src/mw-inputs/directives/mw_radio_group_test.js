describe('testing mwRadioGroup', function () {

  beforeEach(module('mwUI.Inputs'));

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(inject(function ($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$compile = $compile;
    this.optionsCollection = new mwUI.Backbone.Collection();
    this.optionsCollection.add([{id: 1, label:'Option 1'}, {id: 2, label: 'Option 2'}]);
    this.testModel = new mwUI.Backbone.Model();
  }));

  describe('testing general attributes', function(){
    beforeEach(function(){
      var input = '<div mw-radio-group ' +
        'mw-model="testModel"' +
        'mw-model-attr="radioSelect"' +
        'mw-options-collection="optionsCollection"' +
        'mw-options-key="id"' +
        'mw-options-label-key="label"' +
        'mw-disabled="isDisabled"' +
        'mw-required="isRequired"/>';
      this.$input = this.$compile(input)(this.scope);
      this.scope.optionsCollection = this.optionsCollection;
      this.scope.testModel = this.testModel;
    });

    it('displays the options from the optionsCollection', function () {
      this.scope.$digest();

      expect(this.$input.find('label').length).toBe(2);
    });

    it('displays the value of the optionsCollection model defined by the attr mw-options-label-key', function () {
      this.scope.$digest();

      expect(this.$input.find('.radio-label').first().text()).toMatch('Option 1');
      expect(this.$input.find('.radio-label').last().text()).toMatch('Option 2');
    });

    it('disables items that are disabled in the selectable of the optionsColelction', function () {
      var CheckboxGroupOptionsWithDisabledItems = mwUI.Backbone.Collection.extend({
        model: mwUI.Backbone.Model.extend({
          selectableOptions: function(){
            return {
              isDisabled: function(){
                return this.get('id') % 2 === 1;
              }
            };
          }
        })
      });
      var checkboxGroupOptionsWithDisabledItems = new CheckboxGroupOptionsWithDisabledItems();
      checkboxGroupOptionsWithDisabledItems.add([{id:1, label: 'Opt 1'}, {id:2, label:'Opt 2'},{id:3, label:'Opt 3'}])
      this.scope.optionsCollection = checkboxGroupOptionsWithDisabledItems;

      this.scope.$digest();

      expect(this.$input.find(':disabled').length).toBe(2);
      expect(this.$input.find(':disabled').first().scope().model.id).toBe(1);
      expect(this.$input.find(':disabled').last().scope().model.id).toBe(3);
    });

    it('disables everything when mw-disabled is set', function () {
      this.scope.isDisabled=true;
      this.scope.$digest();

      expect(this.$input.find('input[type="radio"]:disabled').length).toBe(2);
    });

    it('enables everything when mw-disabled is set to true', function () {
      this.scope.isDisabled=true;
      this.scope.$digest();

      this.scope.isDisabled=false;
      this.scope.$digest();

      expect(this.$input.find('input[type="radio"]:disabled').length).toBe(0);
    });

    it('is invalid when isRequired is set to true and nothing is selected', function () {
      this.scope.isRequired=true;
      this.scope.$digest();

      expect(this.$input.find('input[required]').length).toBe(1);
      expect(this.$input.find('input[required]').controller('ngModel').$valid).toBeFalsy();
    });

    it('is valid when isRequired is set to true and something is selected', function () {
      this.scope.isRequired=true;
      this.scope.testModel.set('radioSelect','5');
      this.scope.$digest();

      expect(this.$input.find('input[required]').length).toBe(1);
      expect(this.$input.find('input[required]').controller('ngModel').$valid).toBeTruthy();
    });
  });

  describe('testing selection functionality', function(){
    describe('setting one attribute of mwModel by using attribute mwModelAttr', function(){
      beforeEach(function(){
        var input = '<div mw-radio-group ' +
          'mw-options-collection="optionsCollection"' +
          'mw-options-key="id"' +
          'mw-options-label-key="label"' +
          'mw-model="testModel"' +
          'mw-model-attr="selectedRadio"/>';
        this.$input = this.$compile(input)(this.scope);
        this.scope.optionsCollection = this.optionsCollection;
        this.scope.testModel = this.testModel;
      });

      it('sets value of mw-model defined as mw-model-attr attribute with the value of the mw-options-collection defined as mw-options-key', function () {
        this.scope.$digest();

        this.$input.find('input[type="radio"]').last().triggerHandler('click');
        this.scope.$digest();

        expect(this.scope.testModel.get('selectedRadio')).toBe(2);
      });

      it('unselects item when clicking on the value again', function () {
        this.scope.$digest();

        this.$input.find('input[type="radio"]').last().triggerHandler('click');
        this.scope.$digest();
        this.$input.find('input[type="radio"]').last().triggerHandler('click');
        this.scope.$digest();

        expect(this.$input.find('input:checked').length).toBe(0);
      });

      it('selects item during initialisation when mw-model has a value', function () {
        this.scope.testModel.set('selectedRadio',2);

        this.scope.$digest();

        expect(this.$input.find('input:checked').scope().model.id).toBe(2);
      });
    });

    describe('setting the whole model by not using mwModelAttr', function(){
      beforeEach(function(){
        var input = '<div mw-radio-group ' +
          'mw-options-collection="optionsCollection"' +
          'mw-options-label-key="label"' +
          'mw-model="testModel"/>';
        this.$input = this.$compile(input)(this.scope);
        this.scope.optionsCollection = this.optionsCollection;
        this.scope.testModel = this.testModel;
      });

      it('sets model witch value of optionModel', function () {
        this.scope.$digest();

        this.$input.find('input[type="radio"]').last().triggerHandler('click');
        this.scope.$digest();

        expect(this.scope.testModel.toJSON()).toEqual({
          id: 2,
          label: 'Option 2'
        });
      });

      it('unselects item when clicking on the value again', function () {
        this.scope.$digest();

        this.$input.find('input[type="radio"]').last().triggerHandler('click');
        this.scope.$digest();
        this.$input.find('input[type="radio"]').last().triggerHandler('click');
        this.scope.$digest();

        expect(this.$input.find('input:checked').length).toBe(0);
      });

      it('selects item during initialisation when mw-model has a value', function () {
        this.scope.testModel.set('id',2);

        this.scope.$digest();

        expect(this.$input.find('input:checked').scope().model.id).toBe(2);
      });
    });
  });
});