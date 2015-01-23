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
        translationPrefix: '@',
        mwRequired: '=',
        disabledCollection: '='
      },
      templateUrl: 'modules/ui/templates/mwFormBb/mwFormMultiSelect.html',
      link: function(scope,el,attr,form){

        if (!scope.collection instanceof window.mCAP.Collection) {
          throw new Error('mwFormMultiSelect: collection attribute has to be a collection');
        }

        if (scope.disabledCollection && !scope.disabledCollection instanceof window.mCAP.Collection) {
          throw new Error('mwFormMultiSelect: disabledCollection attribuet has to be a collection');
        }

        //When user unselects a checkbox it will be deleted from the model array
        var removeFromModel = function(key){
          if (scope.model.indexOf(key) >= 0) {
            // Delete key from model array
            scope.model.splice(scope.model.indexOf(key), 1);
            // Delete model if no attribute is in there (for validation purposes)
            if (scope.model.length === 0) {
              delete scope.model;
            }
            return true;
          }
          return false;
        };

        if (scope.disabledCollection) {
          //if a an item is in the disabledCollection it will be removed from the model
          scope.disabledCollection.each(function(disabledModel) {
            removeFromModel(disabledModel.get('key'));
          });
        }

        scope.isDisabled = function(model){
          if(scope.disabledCollection){
            return !!scope.disabledCollection.get(model);
          }
        };

        scope.toggleKeyIntoModelArray = function (key) {
          scope.model = scope.model || [];
          if(!removeFromModel(key)){
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
  })

  .directive('mwMultiSelectBoxes', function($timeout){
    return {
      restrict: 'A',
      scope: {
        inputCollection: '=mwMultiSelectBoxes',
        selectedCollection: '=',
        mwRequired: '=',
        mwDisabled: '='
      },
      templateUrl: 'modules/ui/templates/mwFormBb/mwMultiSelectBoxes.html',
      link: function (scope) {
        scope.privateCollection = scope.selectedCollection.clone();
        if(scope.privateCollection.length === 0){
          var emptyClone = scope.inputCollection.first().clone().clear();
          scope.privateCollection.add(emptyClone);
        }

        $timeout(function(){
          console.log(scope.privateCollection.models);
        }, 2000);

/*        scope.$watch(scope.privateCollection.pluck('name'), function(newVal){
          console.log(newVal);
        });*/
      }
    };
  })

  .directive('mwMultiSelectBox', function(){
    return {
      restrict: 'A',
      scope: {
        optionsCollection: '=mwMultiSelectBox',
        model: '=',
        last: '='
      },
      templateUrl: 'modules/ui/templates/mwFormBb/mwMultiSelectBox.html',
      link: function (scope) {
/*        scope.change = function(){
          console.log(scope.model.get('name'));
        };*/

        scope.model.set('name', 'HELLLLOOO');
      }
    };
  });
