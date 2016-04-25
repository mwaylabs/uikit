/**
 * Created by zarges on 22/01/16.
 */
'use strict';

angular.module('SampleApp.Start')

  .controller('StartIndexController', function (Toast, TestModal, collection) {
    var testModal = new TestModal();
    this.collection = collection;

    this.openTestModal = function(){
      testModal.show();
    };

    this.showToast = function(){
      Toast.addToast('Hello')
    }

  })

  .constant('StartIndexControllerResolver', {
    collection: function () {
      var c = new mwUI.Backbone.Collection();
      c.add([
        {
          name: 'a',
          description: 'A wie Adam'
        },
        {
          name: 'b',
          description: 'B wie Berthold'
        }
      ]);
      return c;
    }
  });