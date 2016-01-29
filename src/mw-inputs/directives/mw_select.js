angular.module('mwUI.Inputs')

  .directive('mwSelect', function () {
    return {
      require: '^?ngModel',
      link: function (scope, el, attrs, ngModel) {
        var customSelectWrapper = angular.element('<span class="custom-select mw-select"></span>');

        var render = function () {
          el.wrap(customSelectWrapper);
          el.addClass('custom');
        };

        scope.$watch(
          function () {
            return ngModel.$modelValue;
          },
          function (val) {
            if (angular.isUndefined(val)) {
              el.addClass('default-selected');
            } else {
              el.removeClass('default-selected');
            }
          }
        );

        render();
      }
    };
  });