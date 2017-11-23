angular.module('mwUI.UiComponents')

  .directive('mwViewChangeLoader', function ($rootScope) {
    return {
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_view_change_loader.html',
      link: function (scope) {
        var routeUpdateInProgress = false;
        scope.viewModel = {
          loading: false
        };

        var showLoaderListener = $rootScope.$on('$showViewChangeLoader', function () {
          scope.viewModel.loading = true;
        });

        var hideLoaderListener = $rootScope.$on('$hideViewChangeLoader', function () {
          scope.viewModel.loading = false;
        });

        var locationChangeSuccessListener = $rootScope.$on('$locationChangeSuccess', function () {
          if(!routeUpdateInProgress){
            scope.viewModel.loading = true;
          } else {
            routeUpdateInProgress = false;
          }
        });

        var routeChangeSuccessListener = $rootScope.$on('$routeChangeSuccess', function () {
          scope.viewModel.loading = false;
        });

        var routeChangeErrorListener = $rootScope.$on('$routeChangeError', function () {
          scope.viewModel.loading = false;
        });

        var routeChangeUpdateListener = $rootScope.$on('$routeUpdate', function () {
          routeUpdateInProgress = true;
        });

        scope.$on('$destroy', function () {
          locationChangeSuccessListener();
          routeChangeSuccessListener();
          routeChangeErrorListener();
          routeChangeUpdateListener();
          showLoaderListener();
          hideLoaderListener();
        });
      }
    };
  });