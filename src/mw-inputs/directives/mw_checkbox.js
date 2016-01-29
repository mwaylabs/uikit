angular.module('mwUI.Inputs')

  .directive('mwCheckbox', function () {
    return {
      restrict: 'A',
      link: function (scope, el) {
        // render custom checkbox
        // to preserve the functionality of the original checkbox we just wrap it with a custom element
        // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
        // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
        var render = function () {
          var customCheckbox = angular.element('<span class="custom-checkbox mw-checkbox"></span>'),
            customCheckboxStateIndicator = angular.element('<span class="state-indicator"></span>'),
            customCheckboxStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

          el.wrap(customCheckbox);
          customCheckboxStateIndicator.insertAfter(el);
          customCheckboxStateFocusIndicator.insertAfter(customCheckboxStateIndicator);
        };

        (function init() {
          //after this the remaining element is removed
          scope.$on('$destroy', function () {
            el.off();
            el.parent('.mw-checkbox').remove();
          });

          render();

        }());
      }
    };
  });