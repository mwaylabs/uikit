angular.module('mwUI.Utils')

  .service('mwBootstrapBreakpoint', function ($rootScope) {
    var breakPointEls = [];
    var activeBreakPoint = null;

    var createBreakPointEls = function () {
      for (var key in mwUI.Utils.ViewportBreakPoints) {
        var breakPointEl = angular.element('<div class="visible-' + mwUI.Utils.ViewportBreakPoints[key] + '" data-type="' + key + '">');

        angular.element('body').append(breakPointEl);
        breakPointEls.push(breakPointEl);
      }
    };

    var setActiveBreakPoint = function(){
      var oldBreakPoint = activeBreakPoint;
      breakPointEls.forEach(function(breakPointEl){
        if(breakPointEl.is(':visible')){
          activeBreakPoint = mwUI.Utils.ViewportBreakPoints[breakPointEl.attr('data-type')];
        }
      });

      if(oldBreakPoint !== activeBreakPoint){
        $rootScope.$broadcast('mwBootstrapBreakpoint:changed', activeBreakPoint);
      }
    };

    var throttleSetActiveBreakPoint = _.debounce(setActiveBreakPoint, 200);

    createBreakPointEls();
    setActiveBreakPoint();
    angular.element(window).on('resize', throttleSetActiveBreakPoint);

    return {
      getActiveBreakpoint: function () {
        return activeBreakPoint;
      }
    };
  });