angular.module('mwUI.UiComponents')

  .directive('mwIcon', function (mwIcon) {
    return {
      scope: {
        icon: '@mwIcon',
        tooltip: '@'
      },
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_icon.html',
      link: function (scope) {
        scope.viewModel = {
          icon: null,
          iconSet: null,
          oldIcon: null
        };

        var setIconOld = function(iconStr){
          var isFontAwesome = iconStr.match(/^fa-/),
            isRlnIcon = iconStr.match(/rln-icon/);

          if (isFontAwesome) {
            scope.viewModel.oldIcon = 'fa ' + iconStr;
          } else if (isRlnIcon) {
            scope.viewModel.oldIcon = 'rln-icon ' + iconStr;
          } else {
            scope.viewModel.oldIcon = 'glyphicon glyphicon-' + iconStr;
          }
        };

        var setViewIcon = function(key){
          scope.viewModel.iconSet.getIconForKey(key).then(function(icon){
            scope.viewModel.icon = icon;
          });
        };

        var setIcon = function(iconStr){
          var splicedStr = iconStr.split('.'),
            iconSetId,
            iconKey;

          if (splicedStr.length > 1) {
            iconSetId = splicedStr.splice(0, 1)[0];
            iconKey = splicedStr.join('.');

            scope.viewModel.iconSet = mwIcon.getIconSet(iconSetId);

            setViewIcon(iconKey);

            scope.viewModel.iconSet.on('icons:replace', function(){
              setViewIcon(iconKey);
            });

          } else {
            setIconOld(iconStr);
          }
        };

        scope.$watch('icon', function (newVal) {
          if (newVal) {
            setIcon(newVal);
          }
        });
      }
    };
  });