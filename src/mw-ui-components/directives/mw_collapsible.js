angular.module('mwUI.UiComponents')

//TODO rename to mwCollapsible
  .directive('mwCollapsable', function () {
    return {
      transclude: true,
      scope: {
        mwCollapsable: '=',
        title: '@mwTitle'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_collapsible.html',
      link: function (scope, el) {
        scope.viewModel = {};
        scope.viewModel.collapsed = false;

        var getHeight = function (el) {
          var totalHeight = 0;

          el.children().filter(':visible').each(function () {
            totalHeight += angular.element(this).outerHeight(true);
          });
          return totalHeight;
        };

        scope.toggle = function () {
          var collapsedBody = el.find('.mw-collapsible-body'),
            maxHeight;

          if (!scope.viewModel.collapsed) {
            maxHeight = getHeight(collapsedBody);
          } else {
            maxHeight = 0;
          }

          collapsedBody.css('max-height', maxHeight);
          scope.viewModel.collapsed = !scope.viewModel.collapsed;
        };

        scope.$watch('mwCollapsable', function () {
          if (scope.mwCollapsable === false) {
            scope.viewModel.collapsed = true;
          } else {
            scope.viewModel.collapsed = false;
          }
        });
      }
    };
  });