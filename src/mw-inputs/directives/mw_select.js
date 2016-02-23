angular.module('mwUI.Inputs')

  .directive('mwSelect', function () {
    return {
      require: '^?ngModel',
      link: function (scope, el) {
        var customSelectWrapper = angular.element('<span class="custom-select mw-select"></span>');

        var render = function () {
          el.wrap(customSelectWrapper);
          el.addClass('custom');
        };

        render();
      }
    };
  });