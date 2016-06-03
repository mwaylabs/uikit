angular.module('mwUI.Relution')

  .directive('mwFormInput', function(){
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@',
        hideErrors: '='
      },
      templateUrl: 'uikit/templates/deprecated/mw_form_input.html',
      link: function(){
        uiDeprecationWarning('The directive mw-form-input has been renamed to mw-input-wrapper. Please use the new directive instead!');
      }
    };
  })

  .directive('mwFormWrapper', function () {
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@',
        hideErrors: '='
      },
      templateUrl: 'uikit/templates/deprecated/mw_form_input.html',
      link: function () {
        uiDeprecationWarning('The directive mw-form-wrapper does not exist anymore. Please use the directive mw-input-wrapper instead!');
      }
    };
  })

  .directive('mwFormCheckbox', function(){
    return {
      transclude: true,
      scope: {
        label: '@',
        tooltip: '@',
        hideErrors: '=',
        badges: '@'
      },
      templateUrl: 'uikit/templates/deprecated/mw_form_checkbox.html',
      link: function(scope) {
        uiDeprecationWarning('The directive mw-form-checkbox does not exist anymore. Please use the directive mw-input-wrapper instead!');

        if (scope.badges) {
          var formatBadges = function () {
            uiDeprecationWarning('The badges attribute of the deprecated mw-form-checkbox is not supported anymore. Please transclude the badges instead');
            scope.typedBadges = [];
            var splittedBadges = scope.badges.split(',');
            angular.forEach(splittedBadges, function (badge) {
              var type = 'info';
              if (badge.toLowerCase().indexOf('android') > -1) {
                type = 'android';
              }
              if (badge.toLowerCase().indexOf('ios') > -1) {
                type = 'ios';
              }
              if (badge.toLowerCase().indexOf('knox') > -1) {
                type = 'knox';
              }
              if (badge.toLowerCase().indexOf('-knox-') > -1) {
                badge = 'KNOX';
                type = 'notsafe';
              }
              if (badge.toLowerCase().indexOf('knox') > -1 &&
                badge.toLowerCase().indexOf('android') > -1) {
                type = 'multi';
              }
              scope.typedBadges.push({
                text: badge,
                type: type
              });
            });
          };
          scope.$watch('badges', formatBadges);
        }
      }
    };
  })

  .directive('mwCustomCheckbox', function(){
    return {
      link: function(){
        uiDeprecationWarning('The directive mw-custom-checkbox is deprecated. The custom checkbox is default now. You can remove this directive from the checkbox input element');
      }
    };
  })

  .directive('mwCustomRadio', function(){
    return {
      link: function(){
        uiDeprecationWarning('The directive mw-custom-radio is deprecated. The custom radio box is default now. You can remove this directive from the radio input element');
      }
    };
  })

  .directive('mwCustomSelect', function(){
    return {
      link: function(){
        uiDeprecationWarning('The directive mw-custom-select is deprecated. The custom selectbox is default now. You can remove this directive from the select input');
      }
    };
  });