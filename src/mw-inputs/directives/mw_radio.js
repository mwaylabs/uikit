angular.module('mwUI.Inputs')

  .directive('input', function () {
    return {
      restrict: 'E',
      link: function (scope, el, attrs) {
        // render custom radio
        // to preserve the functionality of the original checkbox we just wrap it with a custom element
        // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
        // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
        var render = function () {
          var customRadio = angular.element('<span class="custom-radio mw-radio"></span>'),
            customRadioStateIndicator = angular.element('<span class="state-indicator"></span>'),
            customRadioStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

          el.wrap(customRadio);
          customRadioStateIndicator.insertAfter(el);
          customRadioStateFocusIndicator.insertAfter(customRadioStateIndicator);
        };

        var init = function() {
          //after this the remaining element is removed
          scope.$on('$destroy', function () {
            el.off();
            el.parent('.mw-radio').remove();
          });

          render();

        };

        if(attrs.type === 'radio'){
          init();
        }
      }
    };
  });