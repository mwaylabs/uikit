angular.module('mwUI.Form')

  .provider('mwValidationMessages', function () {
    var _registeredValidators = {},
      _translatedValidators = {},
      _functionValidators = {},
      _executedValidators = {};

    var _setValidationMessage = function (key, validationMessage) {
      if (typeof validationMessage === 'function') {
        _functionValidators[key] = validationMessage;
      } else {
        _registeredValidators[key] = validationMessage;
      }
    };

    this.registerValidator = function (key, validationMessage) {
      if (!_registeredValidators[key] && !_functionValidators[key]) {
        _setValidationMessage(key, validationMessage);
      } else {
        throw new Error('The key ' + key + ' has already been registered');
      }
    };

    this.$get = function ($rootScope, i18n) {
      var _translateRegisteredValidators = function () {
        _.pairs(_registeredValidators).forEach(function (pair) {
          var key = pair[0],
            value = pair[1];

          if (i18n.translationIsAvailable(value)) {
            _translatedValidators[key] = i18n.get(value);
          } else {
            _translatedValidators[key] = value;
          }
        });
      };

      var _executeFunctionValidators = function () {
        _.pairs(_functionValidators).forEach(function (pair) {
          var key = pair[0],
            fn = pair[1];
          _executedValidators[key] = fn();
        });
      };

      var _setValidationMessages = function () {
        _translateRegisteredValidators();
        //_executeFunctionValidators();
        $rootScope.$broadcast('mwValidationMessages:change');
      };

      _setValidationMessages();
      $rootScope.$on('i18n:localeChanged', function () {
        _setValidationMessages();
      });

      return {
        getRegisteredValidators: function () {
          return _.extend(_translatedValidators, _executedValidators);
        },
        getMessageFor: function(errorModel){
          var errorId = errorModel.get('error');

          if(_functionValidators[errorId]){
            return _functionValidators[errorId](i18n, errorModel.get('attrs'));
          } else {
            return _translatedValidators[errorId];
          }
        },
        updateMessage: function (key, message) {
          if (_registeredValidators[key] || _functionValidators[key]) {
            _setValidationMessages();
          } else {
            throw new Error('The key ' + key + ' is not available. You have to register it first via the provider');
          }
        }
      };
    };
  });