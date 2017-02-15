'use strict';
window.mockModal = function(){
  var Modal = this.Modal = jasmine.createSpyObj('Modal', ['show', 'hide', 'setScopeAttributes']);
  beforeEach(function(){
    module(function($provide){
      $provide.service('Modal', function(){

        return {
          create: function(){
            return Modal;
          },
          prepare: function(){
            return this.create;
          }
        };
      });
    });
  });
  return Modal;
};