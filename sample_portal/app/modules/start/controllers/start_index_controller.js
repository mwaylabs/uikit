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
    };
  })

  .constant('StartIndexControllerResolver', {
    collection: function () {
      var c = new mwUI.Backbone.Collection();
      for(var i= 0;i<100;i++){
        c.add({
          id: i,
          name: 'Johans',
          description: 'This is populated data'
        });
      }
      return c;
    }
  });