angular.module('mwUI.UiComponents')

  .directive('mwViewChangeLoader', function ($rootScope) {
    return {
      templateUrl: 'uikit/mw-ui-components/templates/mw_view_change_loader.html',
      link: function (scope) {
        scope.viewModel = {
          loading: false
        };

        var locationChangeSuccessListener = $rootScope.$on('$locationChangeSuccess', function () {
          scope.viewModel.loading = true;
        });

        var routeChangeSuccessListener = $rootScope.$on('$routeChangeSuccess', function () {
          scope.viewModel.loading = false;
        });

        var routeChangeErrorListener = $rootScope.$on('$routeChangeError', function () {
          scope.viewModel.loading = false;
        });

        scope.$on('$destroy', function () {
          locationChangeSuccessListener();
          routeChangeSuccessListener();
          routeChangeErrorListener();
        });
      }
    };
  });