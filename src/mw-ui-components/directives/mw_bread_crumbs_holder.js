angular.module('mwUI.UiComponents')

  .directive('mwBreadCrumbsHolder', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_bread_crumbs_holder.html'
    };
  });