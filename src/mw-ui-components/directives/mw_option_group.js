angular.module('mwUI.UiComponents')

  .directive('mwOptionGroup', function () {
    return {
      scope: {
        title: '@',
        description: '@',
        icon: '@',
        mwDisabled: '='
      },
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_option_group.html',
      link: function (scope, el) {
        scope.randomId = _.uniqueId('option_group_');
        el.find('input').attr('id', scope.randomId);
      }

    };
  });