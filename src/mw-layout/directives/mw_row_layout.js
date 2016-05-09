angular.module('mwUI.Layout')

  .directive('mwRowLayout', function () {
    return {
      require: '?^^mwRowLayout',
      controller: function(){
        var rows = [];
        this.register = function(row){
          rows.push(row);
        };

        this.getRegistered = function(){
          return rows;
        };
      },
      link: function(scope, el, attrs, mwRowLayoutCtrl){
        el.addClass('mw-row-layout');
        console.log(mwRowLayoutCtrl);
      }
    };
  });