angular.module('mwUI.Backbone')

  .directive('mwCollection', function () {
    return {
      require: ['?ngModel', '?^form'],
      link: function (scope, el, attrs, ctrls) {
        var collection, ngModelCtrl, formCtrl;

        if(ctrls.length>0){
          ngModelCtrl = ctrls[0];
        }
        if(ctrls.length>1){
          formCtrl = ctrls[1];
        }

        var updateNgModel = function () {
          if(collection.length>0){
            ngModelCtrl.$setViewValue(collection);
            ngModelCtrl.$render();
          } else {
            ngModelCtrl.$setViewValue(null);
            ngModelCtrl.$render();
          }
        };


        var init = function () {
          collection = scope.$eval(attrs.mwCollection);

          if (collection) {
            updateNgModel();
            collection.on('add remove reset', updateNgModel);
            ngModelCtrl.$setPristine();
            if(formCtrl){
              formCtrl.$setPristine(ngModelCtrl);
            }
          }
        };

        if (ngModelCtrl) {
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