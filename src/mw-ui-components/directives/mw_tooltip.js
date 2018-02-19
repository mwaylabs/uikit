angular.module('mwUI.UiComponents')
  .directive('mwTooltip', function () {
    return {
      restrict: 'A',
      scope: {
        text: '@mwTooltip',
        placement: '@'
      },
      link: function (scope, el) {
        scope.$watch('text', function () {
          el.data('bs.popover').setContent();
        });

        el.popover({
          trigger: 'hover',
          placement: scope.placement || 'bottom',
          content: function () {
            return scope.text;
          },
          container: 'body'
        });

        var destroyPopOver = function () {
          if(el.popover){
            el.popover('destroy');
          }
        };

        scope.$on('$destroy', function () {
          destroyPopOver();
        });
      }
    };
  });