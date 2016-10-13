angular.module('mwUI.UiComponents')

  .directive('mwWizardStep', function () {
    return {
      restrict: 'A',
      scope: true,
      transclude: true,
      replace: true,
      require: '^mwWizard',
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_wizard_step.html',
      link: function (scope, el, attr, mwWizardCtrl) {
        scope._isActive = false;
        //we need to set a default value here, see
        //https://github.com/angular/angular.js/commit/531a8de72c439d8ddd064874bf364c00cedabb11
        attr.title = attr.title || 'noname';
        attr.$observe('title', function (title) {
          if (title && title.length > 0) {
            scope.title = title;
          }
          mwWizardCtrl.registerStep(scope, attr.id);
        });

        scope.$on('$destroy', function () {
          mwWizardCtrl.unRegisterStep(scope);
        });
      }
    };
  });