angular.module('mwUI.Utils')

  .service('mwRuntimeStorage', function () {
    var storage = {};

    return {
      getItem: function (key) {
        return storage[key];
      },
      setObject: function (obj) {
        if (_.isObject(obj)) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key) && storage[key] !== obj[key]) {
              storage[key] = obj[key];
            }
          }
        } else {
          throw new Error('[mwRuntimeStorage] parameter has to be an object otherwise setItem(key, val) should be called');
        }
      },
      setItem: function (key, value) {
        if (storage[key] !== value) {
          storage[key] = value;
        }
      },
      removeObject: function (obj) {
        if (_.isObject(obj)) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key) && storage[key]) {
              storage[key] = null;
            }
          }
        } else {
          throw new Error('[mwRuntimeStorage] parameter has to be an object otherwise deleteItem(key, val) should be called');
        }
      },
      removeItem: function (key) {
        if (storage[key]) {
          storage[key] = null;
          return true;
        } else {
          return false;
        }
      },
      clear: function () {
        storage = {};
      }
    };
  });