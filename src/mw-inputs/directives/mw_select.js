angular.module('mwUI.Inputs')

  .directive('select', function () {
    return {
      link: function (scope, el) {
        var customSelectWrapper = angular.element('<span class="mw-select"></span>');

        var render = function () {
          el.wrap(customSelectWrapper);
          el.addClass('custom');
        };

        render();
      }
    };
  });