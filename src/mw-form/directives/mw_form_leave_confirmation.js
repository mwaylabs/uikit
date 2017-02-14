angular.module('mwUI.Form')

  .directive('mwFormLeaveConfirmation', function ($compile) {
    return {
      require: '^form',
      link: function (scope, elm, attr, formCtrl) {

        var confirmation = $compile('' +
            '<div mw-leave-confirmation="showConfirmation()" ' +
            'text="{{\'Form.leaveConfirmation\' | i18n}}">' +
            '</div>')(scope),
          isActive = true;

        scope.showConfirmation = function () {
          return formCtrl.$dirty && isActive;
        };

        elm.append(confirmation);

        scope.$on('$destroy', function () {
          isActive = false;
        });
      }
    };
  });