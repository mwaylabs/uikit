angular.module('mwUI.UiComponents')

  .directive('mwOptionGroup', function () {
    return {
      scope: {
        title: '@',
        description: '@',
        icon: '@',
        mwDisabled: '=',
        badges: '='
      },
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_option_group.html',
      link: function (scope, el) {
        scope.randomId = _.uniqueId('option_group_');
        el.find('input').attr('id', scope.randomId);

        if(scope.badges && !_.isArray(scope.badges)){
          throw new Error('[mwOptionGroup] The attribute badges only accept an array of strings');
        }
      }

    };
  });