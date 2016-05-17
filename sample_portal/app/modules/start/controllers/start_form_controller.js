/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Start')

  .controller('StartFormController', function (model) {
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
      test: +new Date(1)
    };

    this.model.on('change', function(model){
      console.log('CHANGE', model.changed);
    });

    this.setDate = function(){
      this.model.set('dati',new Date(Math.floor(Math.random()*1000000000000)));
    };
  })

  .constant('StartFormControllerResolver', {
    model: function(){
      return new ( mwUI.Backbone.Model.extend({
        defaults: function(){
          return {
            name: 'Alex',
            dati: new Date(1),
            urli: 'http://jo.de',
            checki: true,
            radio: 'blue',
            selecti: {
              id: 2,
              label: 'bLabel',
              subItem: { name: 'bSubItem' }
            }
          };
        }
      }))();
    }
  });