angular.module('mwUI.Inputs')

  .directive('mwToggle', function ($timeout) {
    return {
      scope: {
        mwModel: '=',
        mwDisabled: '=',
        mwChange: '&'
      },
      replace: true,
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_toggle.html',
      link: function (scope) {
        scope.toggle = function (value) {
          if (scope.mwModel !== value) {
            scope.mwModel = !scope.mwModel;
            $timeout(function () {
              scope.mwChange({value: scope.mwModel});
            });
          }
        };
      }
    };
  });