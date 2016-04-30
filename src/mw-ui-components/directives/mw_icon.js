angular.module('mwUI.UiComponents')

  .directive('mwIcon', function (mwIcon) {
    return {
      scope: {
        icon: '@mwIcon'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_icon.html',
      link: function (scope) {
        scope.viewModel = {
          icon: null
        };

        if(scope.icon){
          mwIcon.getIconSet(scope.icon).then(function(icon){
            scope.viewModel.icon = icon;
          });
        }
      }
    };
  });