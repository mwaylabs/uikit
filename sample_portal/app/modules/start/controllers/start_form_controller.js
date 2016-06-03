/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Start')

  .controller('StartFormController', function (model) {
    var CheckboxGroupOptionsWithDisabledItems = mwUI.Backbone.Collection.extend({
      model: mwUI.Backbone.Model.extend({
        selectableOptions: function(){
          return {
            isDisabled: function(){
              return this.get('id') === 1;
            }
          };
        }
      })
    });

    this.model = model;

    this.viewModel = {
      selectOptions: [
        {
          id: 1,
          label: 'aLabel',
          subItem: { name: 'aSubItem' }
        },
        {
          id: 2,
          label: 'bLabel',
          subItem: { name: 'bSubItem' }
        }
      ],
      checkboxGroupOptionsCollection: new CheckboxGroupOptionsWithDisabledItems()
    };

    this.viewModel.checkboxGroupOptionsCollection.add([
      {
        id: 1,
        label: 'Should be Disabled'
      },
      {
        id: 2,
        label: 'Option B'
      },
      {
        id: 3,
        label: 'Option C'
      }
    ]);

    this.model.on('change', function(model){
      console.log('CHANGE', model.changed);
    });
  })

  .constant('StartFormControllerResolver', {
    model: function(){
      return new ( mwUI.Backbone.Model.extend({
        nested: function(){
          return {
            checkboxGroup: mwUI.Backbone.Collection
          };
        },
        defaults: function(){
          return {
            name: 'Muster',
            url: 'http://localhost',
            checkbox: true,
            radio: 'val_b',
            number: 5,
            select: {
              id: 2,
              label: 'bLabel',
              subItem: { name: 'bSubItem' }
            }
          };
        }
      }))();
    }
  });