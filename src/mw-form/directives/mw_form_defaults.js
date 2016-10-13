var extendForm = function () {
  return {
    restrict: 'E',
    link: function (scope, el) {
      el.addClass('form-horizontal');
      el.attr('novalidate', 'true');
    }
  };
};

angular.module('mwUI.Form')

  .directive('form', extendForm);