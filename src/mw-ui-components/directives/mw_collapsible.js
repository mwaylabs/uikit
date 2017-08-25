angular.module('mwUI.UiComponents')

//TODO rename to mwCollapsible
  .directive('mwCollapsable', function ($timeout) {
    return {
      transclude: true,
      scope: {
        isCollapsed: '=mwCollapsable',
        title: '@mwTitle'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_collapsible.html',
      link: function (scope, el) {
        var collapsedBody = el.find('.mw-collapsible > .mw-collapsible-body'),
          collapsedBodyContent = collapsedBody.find('.collapsed-content'),
          transitionDuration = parseFloat(collapsedBody.css('transition-duration')) * 1000;

        // We need to set an invisible border so the inner height of the transcluded contnet is calculated correctly
        // https://stackoverflow.com/a/2555030
        collapsedBodyContent.css('border', '1px solid transparent');

        var getHeight = function () {
          return collapsedBodyContent.innerHeight();
        };

        var removeMaxHeight = function () {
          collapsedBody.css('max-height', 'initial');
          collapsedBody.off('transitionend', removeMaxHeight);
        };

        var open = function () {
          var calculatedBodyHeight = getHeight();
          if (calculatedBodyHeight > 0) {
            //transitionendFromTest is to trigger event from test, transitionend can not be triggered
            collapsedBody.on('transitionend transitionendFromTest', removeMaxHeight);
            collapsedBody.css('max-height', calculatedBodyHeight);
          }
          $timeout(removeMaxHeight, transitionDuration);
          scope.isCollapsed = false;
        };

        var close = function () {
          collapsedBody.off('transitionend', removeMaxHeight);
          collapsedBody.css('max-height', getHeight());
          $timeout(function () {
            collapsedBody.css('max-height', 0);
          }, 5);
          scope.isCollapsed = true;
        };

        scope.toggle = function () {
          if (scope.isCollapsed) {
            open();
          } else {
            close();
          }
        };

        scope.$watch('mwCollapsable', function () {
          if (scope.isCollapsed || angular.isUndefined(scope.isCollapsed)) {
            close();
          } else {
            open();
          }
        });
      }
    };
  });