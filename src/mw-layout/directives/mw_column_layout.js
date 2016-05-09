angular.module('mwUI.Layout')

  .directive('mwColumnLayout', function () {
    return {
      link: function(scope, el){
        el.addClass('mw-column-layout');
      }
    };
  });