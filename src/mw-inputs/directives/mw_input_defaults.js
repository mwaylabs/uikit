var extendInput = function () {
  return {
    restrict: 'E',
    require: '?^mwInputWrapper',
    link: function (scope, el, attrs, mwInputWrapperCtrl) {
      var skipTypes = ['radio','checkbox'];

      if(mwInputWrapperCtrl){
        if(skipTypes.indexOf(attrs.type)===-1){
          el.addClass('form-control');
        }
      }
    }
  };
};

angular.module('mwUI.Inputs')

  .directive('select', extendInput)

  .directive('input', extendInput)

  .directive('textarea', extendInput);
