angular.module('mwUI.Utils')

  .service('mwUrlStorage', function ($rootScope, $location, $route) {
    var storage = {};

    var preventRouteReload = function () {
      //Check whether reloadOnSearch is already disabled
      if ($route.current.$$route.reloadOnSearch === false) {
        return;
      }
      // Remember the state so we can set it to the original state after we have updated the route
      var prevReloadOnSearchVal = $route.current.$$route.reloadOnSearch;
      //Set reloadOnSearch false so angular does not reinitialize the controller
      $route.current.$$route.reloadOnSearch = false;

      var unbindRouteUpdateListener,
        unbindRouteChangeSuccessListener;

      //Route update is triggered when reloadOnSearch is set to true and a search param has changed
      unbindRouteUpdateListener = $rootScope.$on('$routeUpdate', function () {
        $route.current.$$route.reloadOnSearch = prevReloadOnSearchVal;
        unbindRouteUpdateListener();
        unbindRouteChangeSuccessListener();
      });

      // //Route change success is triggered when reloadOnSearch is set to false and a search param has changed
      unbindRouteChangeSuccessListener = $rootScope.$on('$routeChangeSuccess', function () {
        $route.current.$$route.reloadOnSearch = prevReloadOnSearchVal;
        unbindRouteChangeSuccessListener();
        unbindRouteUpdateListener();
      });
    };

    var hasChangedValues = function (params, removeParams) {
      var currentSearchParams = $location.search();
      var changedParams = _.difference(_.values(params), _.values(currentSearchParams));

      removeParams = _.difference(_.values(removeParams), _.values(currentSearchParams));
      return changedParams.length > 0 || removeParams.length > 0;
    };

    var setUrlQueryParams = function (params, preferQueryOverStorage, removeKeys, options) {
      options = options || {};
      if (hasChangedValues(params, removeKeys)) {
        var currentSearchParams = $location.search(),
          newSearchParams;

        if (removeKeys) {
          removeKeys.forEach(function (key) {
            currentSearchParams[key] = null;
          });
        }

        if (preferQueryOverStorage) {
          newSearchParams = _.extend(params, currentSearchParams);
        } else {
          newSearchParams = _.extend(currentSearchParams, params);
        }

        preventRouteReload();
        $location.search(newSearchParams);

        if (!options.keepInHistory) {
          $location.replace();
        }
      }
    };

    $rootScope.$on('$locationChangeSuccess', function (ev, newUrl, oldUrl) {
      if (newUrl !== oldUrl) {
        setUrlQueryParams(storage, true);
      }
    });

    return {
      /*
       * Return the value that is stored in the url for a key
       *
       * params:
       * key: string
       */
      getItem: function (key) {
        return $location.search()[key];
      },
      /*
       * Calls setItem but allows you to set a whole object instead of a key,value
       *
       * params:
       * obj: object
       * options: {
       *   removeOnUrlChange: boolean
       *   keepInHistory: boolean
       * }
       */
      setObject: function (obj, options) {
        options = options || {};
        var wasChanged = false;
        if (_.isObject(obj)) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key) && storage[key] !== obj[key]) {
              if (!options.removeOnUrlChange) {
                storage[key] = obj[key];
              }
              wasChanged = true;
            }
          }
        } else {
          throw new Error('[mwUrlStorage] parameter has to be an object otherwise setItem(key, val) should be called ');
        }

        if (wasChanged) {
          setUrlQueryParams(obj, false, false, options);
        }
      },
      /*
       * Save a key value pair as query param in the url
       * The query will be in the url until you call removeItem('key') also on url change
       * You don't have to worry about the param it will just stay
       *
       * In cases where you don't wan't to keep the query param in the url forever you can set the options param
       * removeOnUrlChange to true (default is false
       *
       * The query won't be stored in the url history so when using the back button you will not go back to the previous
       * query state but to the previous url
       * In cases where you want to go to store the query in the history you can set the options param
       * `keepInHistory` to true
       *
       * params:
       * key: string
       * value: string
       * options: {
       *   removeOnUrlChange: boolean
       *   keepInHistory: boolean
       * }
       */
      setItem: function (key, value, options) {
        options = options || {};
        if (storage[key] !== value) {
          if (!options.removeOnUrlChange) {
            storage[key] = value;
          }
          var obj = {};
          obj[key] = value;
          setUrlQueryParams(obj, false, false, options);
        }
      },
      /*
       * Calls removeItem but allows you to remove a whole object instead of a key
       *
       * params:
       * obj: object
       */
      removeObject: function (obj) {
        var wasChanged = false;
        var removeKeys = [];
        if (_.isObject(obj)) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (storage[key] || this.getItem(key)) {
                storage[key] = null;
                wasChanged = true;
                removeKeys.push(key);
              }
            }
          }
        } else {
          throw new Error('[mwUrlStorage] parameter has to be an object otherwise deleteItem(key, val) should be called ');
        }

        if (wasChanged) {
          setUrlQueryParams(storage, false, removeKeys);
        }
      },
      /*
       * Removes a key with its value from the url
       *
       * params:
       * key: string
       */
      removeItem: function (key) {
        if (storage[key]) {
          storage[key] = null;
          setUrlQueryParams(storage, false, [key]);
          return true;
        } else if (this.getItem(key)) {
          setUrlQueryParams(storage, false, [key]);
          return true;
        } else {
          return false;
        }
      },
      /*
       * Removes all items that have been set by setItem or setObject from the url
       * Other url query params that have been set e.g. by calling $location.search() won't be affected
       */
      clear: function () {
        var removeKeys = [];
        for (var key in storage) {
          if (storage.hasOwnProperty(key) && storage[key]) {
            removeKeys.push(key);
          }
        }
        storage = {};
        setUrlQueryParams(storage, false, removeKeys);
      }
    };
  });