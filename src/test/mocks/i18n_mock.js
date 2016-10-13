'use strict';
window.mockI18nFilter = function(){
  beforeEach(function(){
    module(function($provide){
      $provide.value('i18nFilter', function(){
        return function(input){
          return input;
        };
      });
    });
  });
};

window.mockI18nService = function(){
  beforeEach(function(){
    module(function($provide){
      $provide.service('i18n', function(){
        return {
          get: function (input) {
            return input;
          },
          translationIsAvailable: function(){
            return true;
          }
        };
      });
    });
  });
};