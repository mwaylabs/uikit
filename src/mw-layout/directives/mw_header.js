angular.module('mwUI.Layout')

  .directive('mwHeader', function ($rootScope, $route, $location, BrowserTitleHandler) {
    return {
      transclude: true,
      scope: {
        title: '@',
        url: '@?',
        mwTitleIcon: '@?',
        showBackButton: '=?',
        mwBreadCrumbs: '=?',
        description: '@?',
        disableReload: '=?'
      },
      require: '^?mwUi',
      templateUrl: 'uikit/mw-layout/directives/templates/mw_header.html',
      link: function (scope, el, attrs, mwUiCtrl, $transclude) {
        $rootScope.siteTitleDetails = scope.title;
        BrowserTitleHandler.setTitle(scope.title);
        scope.showRefreshButton = true;
        if (scope.mwTitleIcon) {
          el.find('.description').addClass('has-title-icon');
        }
        $transclude(function (clone) {
          if ((!clone || clone.length === 0) && !scope.showBackButton) {
            el.find('.mw-header').addClass('no-buttons');
          }
          if (el.find('[mw-form-actions]') && el.find('[mw-form-actions]').length > 0) {
            scope.showRefreshButton = false;
          }
        });

        scope.refresh = function () {
          $route.reload();
        };

        scope.toggleDescription = function () {
          scope.showDescription = !scope.showDescription;
        };

        scope.back = function () {
          var path = scope.url.replace('#', '');
          $location.path(path);
        };

        scope.canShowDescriptionButton = function () {
          return angular.isDefined(scope.description);
        };

        scope.canShowBackButton = function () {
          return (angular.isUndefined(scope.showBackButton) || scope.showBackButton) && angular.isDefined(scope.url);
        };

        if (!scope.url && scope.mwBreadCrumbs && scope.mwBreadCrumbs.length > 0) {
          scope.url = scope.mwBreadCrumbs[scope.mwBreadCrumbs.length - 1].url;
        } else if (!scope.url && scope.showBackButton) {
          throw new Error('[mwHeader] Can not show back button when the attribute url is not defined');
        }

        if (mwUiCtrl) {
          mwUiCtrl.addClass('has-mw-header');
          scope.$on('$destroy', function () {
            mwUiCtrl.removeClass('has-mw-header');
          });
        }

        if (scope.disableReload) {
          scope.showRefreshButton = false;
        }
      }
    };
  });