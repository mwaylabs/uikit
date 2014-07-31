'use strict';

angular.module('mwFormBb', [])

  .directive('mwFormMultiSelectBb', function () {
    return {
      restrict: 'A',
      transclude: true,
      require:'^?form',
      scope: {
        model: '=',
        collection: '=',
        mwRequired: '='
      },
      templateUrl: 'modules/ui/templates/mwFormBb/mwFormMultiSelect.html',
      link: function(scope,el,attr,form){

        if (!scope.collection instanceof window.mCAP.Collection) {
          throw new Error('mwFormMultiSelect: options have to be a collection');
        }

        scope.toggleKeyIntoModelArray = function (key) {

          scope.model = scope.model || [];
          //Check if key is already in the model array
          //When user unselects a checkbox it will be deleted from the model array
          if (scope.model.indexOf(key) >= 0) {
            // Delete key from model array
            scope.model.splice(scope.model.indexOf(key), 1);
            // Delete model if no attribute is in there (for validation purposes)
            if (scope.model.length === 0) {
              delete scope.model;
            }
          } else {
            scope.model.push(key);
          }
        };

        scope.showRequiredMessage = function(){
          return ( (!scope.model || scope.model.length<1) && scope.mwRequired);
        };

        scope.setDirty = function(){
          if(form){
            form.$setDirty();
          }
        };
      }
    };
  });
