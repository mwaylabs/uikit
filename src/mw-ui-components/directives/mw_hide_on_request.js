angular.module('mwUI.UiComponents')

  .directive('mwHideOnRequest', function () {
    return {
      scope: {
        modelOrCollection: '=mwHideOnRequest'
      },
      transclude: true,
      templateUrl: 'uikit/mw-ui-components/directives/templates/mw_hide_on_request.html',
      link: function (scope) {
        scope.modelCollectionIsRequesting = false;

        if(scope.modelOrCollection instanceof Backbone.Collection || scope.modelOrCollection instanceof Backbone.Model){
          scope.modelOrCollection.on('request', function(){
            scope.modelCollectionIsRequesting = true;
          });

          scope.modelOrCollection.on('sync error', function(){
            scope.modelCollectionIsRequesting = false;
          });
        } else {
          throw new Error('The directive attribute has to be a model or collection (mw-hide-on-request="backboneModelOrCollectionInstance")');
        }
      }
    };
  });