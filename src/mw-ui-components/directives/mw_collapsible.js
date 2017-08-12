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

        var open = function(){
          var collapsedBody = el.find('.mw-collapsible-body');

          collapsedBody.css('max-height', getHeight(collapsedBody));
          scope.viewModel.collapsed = false;
        };

        var close = function(){
          var collapsedBody = el.find('.mw-collapsible-body');

          collapsedBody.css('max-height', 0);
          scope.viewModel.collapsed = true;
        };

        scope.toggle = function () {
          if (scope.viewModel.collapsed) {
            open();
          } else {
            close();
          }
        };

        scope.$watch('mwCollapsable', function () {
          if (scope.mwCollapsable === false) {
            close();
          } else {
            open();
          }
        });
      }
    };
  });