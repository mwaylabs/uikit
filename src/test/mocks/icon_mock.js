'use strict';
var mockIconService = function() {

  beforeEach(function () {
    module(function ($provide) {
      $provide.service('mwIcon', function ($q) {
        return {
          getIconSet: function(){
            return {
              getIconForKey: function(){
                var dfd = $q.defer();
                dfd.resolve('icn');
                return dfd.promise;
              },
              on: function(){}
            };
          }
        };
      });
    });
  });
};