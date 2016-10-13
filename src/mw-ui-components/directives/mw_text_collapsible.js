angular.module('mwUI.UiComponents')
  .directive('mwTextCollapsible', function ($filter) {
    return {
      restrict: 'A',
      scope: {
        collapsibleText: '@mwTextCollapsible',
        length: '='
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_text_collapsible.html',
      link: function (scope) {

        // set default length
        if (scope.length && typeof scope.length === 'number') {
          scope.defaultLength = scope.length;
        } else {
          scope.defaultLength = 200;
        }

        // set start length for filter
        scope.filterLength = scope.defaultLength;

        // apply filter length to text
        scope.text = function () {
          return $filter('reduceStringTo')(
            scope.collapsibleText, scope.filterLength
          );
        };

        // show Button if text is longer than desired
        scope.showButton = false;
        if (scope.collapsibleText && scope.collapsibleText.length > scope.defaultLength) {
          scope.showButton = true;
        }

        // set button to "show more" or "show less"
        scope.showLessOrMore = function () {
          if (scope.filterLength === scope.defaultLength) {
            return 'UiComponents.mwTextCollapsible.showMore';
          } else {
            return 'UiComponents.mwTextCollapsible.showLess';
          }
        };

        // collapse/expand text by setting filter length
        scope.toggleLength = function () {
          if (scope.filterLength === scope.defaultLength) {
            delete scope.filterLength;
          } else {
            scope.filterLength = scope.defaultLength;
          }
        };
      }
    };
  });
