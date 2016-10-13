angular.module('mwUI.Backbone')

  .directive('mwCollection', function () {
    return {
      require: '?ngModel',
      link: function (scope, el, attrs, ngModel) {
        var collection;

        var updateNgModel = function () {
          if(collection.length>0){
            ngModel.$setViewValue(collection);
            ngModel.$render();
          } else {
            ngModel.$setViewValue(null);
            ngModel.$render();
          }
        };


        var init = function () {
          collection = scope.$eval(attrs.mwCollection);

          if (collection) {
            updateNgModel();
            collection.on('add remove reset', updateNgModel);
          }
        };

        if (ngModel) {
          if (scope.mwModel) {
            init();
          } else {
            var off = scope.$watch('mwCollection', function () {
              off();
              init();
            });
          }
        }
      }
    };
  });