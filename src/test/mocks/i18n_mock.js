'use strict';
var mockI18nFilter = function(){
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