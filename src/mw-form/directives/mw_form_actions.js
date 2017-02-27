angular.module('mwUI.Form')

  .directive('mwFormActions', function ($route, $timeout, $parse) {
    return {
      scope: {
        save: '&',
        cancel: '&',
        showSave: '=',
        showCancel: '='
      },
      templateUrl: 'uikit/mw-form/directives/templates/mw_form_actions.html',
      link: function (scope, elm, attr) {
        scope.form = elm.inheritedData('$formController');
        scope.viewModel = {
          isLoading: false,
          hasSave: angular.isDefined(attr.save),
          hasCancel: angular.isDefined(attr.cancel),
          showSave: true,
          showCancel: true
        };

        scope.$watch('showSave', function (val) {
          if (angular.isDefined(val)) {
            scope.viewModel.showSave = val;
          }
        });

        scope.$watch('showCancel', function (val) {
          if (angular.isDefined(val)) {
            scope.viewModel.showCancel = val;
          }
        });

        var showLoadingSpinner = function () {
          scope.viewModel.isLoading = true;
        };

        var hideLoadingSpinner = function () {
          $timeout(function () {
            scope.viewModel.isLoading = false;
          }, 500);
        };

        var setFormPristineAndEvaluate = function (exec) {
          if (scope.form) {
            scope.form.$setPristine();
          }
          var execFn = scope.$eval(exec);
          if (execFn && execFn.then) {
            showLoadingSpinner();
            execFn.then(hideLoadingSpinner, hideLoadingSpinner);
          }
        };

        scope.saveFacade = function () {
          setFormPristineAndEvaluate(scope.save);
        };

        scope.cancelFacade = function () {
          if (!angular.isDefined(attr.cancel)) {
            setFormPristineAndEvaluate(function () {
              return $route.reload();
            });
          } else {
            setFormPristineAndEvaluate(scope.cancel);
          }
        };
      }
    };
  });