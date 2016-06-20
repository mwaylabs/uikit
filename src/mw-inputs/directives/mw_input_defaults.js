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
        if(attrs.type){
          mwInputWrapperCtrl.setType(attrs.type);
        } else if(el[0].tagName){
          mwInputWrapperCtrl.setType(el[0].tagName.toLowerCase());
        }
      }
    }
  };
};

angular.module('mwUI.Inputs')

  .directive('select', extendInput)

  .directive('input', extendInput)

  .directive('textarea', extendInput);
