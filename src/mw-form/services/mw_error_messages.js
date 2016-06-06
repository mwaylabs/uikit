angular.module('mwUI.Form')

  .provider('mwValidationMessages', function () {
    var _stringValidators = {},
      _functionValidators = {},
      _executedValidators = {};

    var _setValidationMessage = function (key, validationMessage) {
      if (typeof validationMessage === 'function') {
        _functionValidators[key] = validationMessage;
      } else if (typeof validationMessage === 'string') {
        _stringValidators[key] = validationMessage;
      } else if (validationMessage) {
        throw new Error('The validation has to be either a string or a function. String can be also a reference to i18n');
      }
    };

    this.registerValidator = function (key, validationMessage) {
      if (!_stringValidators[key] && !_functionValidators[key]) {
        _setValidationMessage(key, validationMessage);
      } else {
        throw new Error('The key ' + key + ' has already been registered');
      }
    };

    this.$get = function ($rootScope, i18n) {
      var getTranslatedValidator = function (key, options) {
        var message = _stringValidators[key];

        if (i18n.translationIsAvailable(message)) {
          return i18n.get(message, options);
        } else {
          return message;
        }
      };

      var getExecutedValidator = function (key, options) {
        return _functionValidators[key](i18n, options);
      };

      return {
        getRegisteredValidators: function () {
          return _.extend(_stringValidators, _executedValidators);
        },
        getMessageFor: function (key, options) {
          if (_functionValidators[key]) {
            return getExecutedValidator(key, options);
          } else if (_stringValidators[key]) {
            return getTranslatedValidator(key, options);
          }
        },
        updateMessage: function (key, message) {
          if (_stringValidators[key] || _functionValidators[key]) {
            _setValidationMessage(key, message);
          } else {
            throw new Error('The key ' + key + ' is not available. You have to register it first via the provider');
          }
        }
      };
    };
  });