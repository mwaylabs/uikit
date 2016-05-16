angular.module('mwUI.UiComponents')

  .directive('mwButtonHelp', function (i18n, $compile) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, elm) {
        var popup;
        var helpIcon =
          $compile(angular.element('<div mw-icon="mwUI.question">'))(scope)
          .addClass('help-icon hidden-sm hidden-xs');

        elm.addClass('mw-button-help');
        elm.prepend(helpIcon);

        var buildPopup = function () {
          popup = angular.element('<div>' + scope.helpText + '<ul></ul></div>').addClass('mw-button-help-popover popover');
          angular.forEach(scope.hintsToShow, function (hint) {
            popup.find('ul').append('<li>' + hint.text + '</li>');
          });
        };

        helpIcon.hover(function () {
          buildPopup();
          var targetOffset = angular.element(this).offset();
          angular.element('body').append(popup);
          popup.css('top', targetOffset.top - (popup.height() / 2) + 10 - angular.element(document).scrollTop());
          popup.css('left', (targetOffset.left + 40));
        }, function () {
          angular.element('body > .mw-button-help-popover').remove();
        });

        scope.$watch('hintsToShow', function (newVal) {
          if (newVal && newVal.length) {
            helpIcon.removeClass('hidden');
          } else {
            helpIcon.addClass('hidden');
          }
        });

        scope.$on('$destroy', function () {
          if (popup) {
            popup.remove();
          }
        });
      },
      controller: function ($scope) {
        $scope.registeredHints = [];
        $scope.hintsToShow = [];
        $scope.helpText = i18n.get('UiComponents.mwButtonHelp.isDisabledBecause');
        $scope.$on('i18n:localeChanged', function () {
          $scope.helpText = i18n.get('common.buttonHelp');
        });

        var showHelp = function () {
          $scope.hintsToShow = [];
          angular.forEach($scope.registeredHints, function (registered) {
            if (registered.condition) {
              $scope.hintsToShow.push(registered);
            }
          });
        };

        //check if any condition changes
        this.register = function (registered) {
          $scope.$watch(function () {
            return registered.condition;
          }, showHelp);
          $scope.registeredHints.push(registered);
        };


      }
    };
  });
