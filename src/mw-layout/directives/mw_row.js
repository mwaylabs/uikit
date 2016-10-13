angular.module('mwUI.Layout')

  .directive('mwRow', function () {
    return {
      require: '^mwRowLayout',
      link: function(scope, el, attrs, mwRowLayoutCtrl){
        var parObserver,
            elObserver,
            parentEl = el.parent();

        var calculateHeight = function(){
          var rows = mwRowLayoutCtrl.getRegistered(),
              heightOfOtherEls = 0;

          rows.forEach(function(row){
            if(row.el !== el){
              heightOfOtherEls += row.el.height();
            }
          });
          el.css('height','calc(100vh - '+heightOfOtherEls+'px)');
        };

        el.addClass('mw-row');
        mwRowLayoutCtrl.register({scope: scope, el:el});

        if(angular.isDefined(attrs.mwExtend)){
          parObserver = mwUI.Utils.shims.domObserver(parentEl, calculateHeight);
          elObserver = mwUI.Utils.shims.domObserver(el, calculateHeight);
          scope.$on('$destroy', function(){
            parObserver.disconnect();
            elObserver.disconnect();
          });
        }

      }
    };
  });