angular.module('mwUI.Form')

  .directive('ngModelErrors', function () {
    return {
      scope: true,
      controller: function () {
        var ErrorModel = mwUI.Backbone.Model.extend({
            idAttribute: 'error',
            nested: function () {
              return {
                inputIds: Backbone.Collection
              };
            }
          }),
          Errors = Backbone.Collection.extend({
            model: ErrorModel
          }),
          allErrors = new Errors();

        var addErrorForInput = function (error, inputId, attrs) {
          var alreadyExistingError = allErrors.get(error);

          if (alreadyExistingError) {
            var inputIds = alreadyExistingError.get('inputIds');

            _.extend(alreadyExistingError.get('attrs'),attrs);
            inputIds.add({id: inputId});
          } else {
            allErrors.add({error: error, inputIds: [inputId], attrs: attrs});
          }
        };

        var removeErrorForInput = function (error, inputId) {
          var existingError = allErrors.get(error);

          if(existingError){
            var inputIdsInError = existingError.get('inputIds'),
              inputIdModel = inputIdsInError.get(inputId);

            if (inputIdModel) {
              inputIdsInError.remove(inputIdModel);

              if (inputIdsInError.length === 0) {
                allErrors.remove(existingError);
              }
            }
          }
        };

        this.addErrorsForInput = function (errors, inputId, attrs) {
          errors.forEach(function(error){
            addErrorForInput(error, inputId, attrs);
          });
        };

        this.removeErrorsForInput = function (errors, inputId) {
          errors.forEach(function(error){
            removeErrorForInput(error, inputId);
          });
        };

        this.getErrors = function(){
          return allErrors;
        };

      }
    };
  });