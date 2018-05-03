angular.module('mwUI.Utils')

  .service('mwUrlStorage', function ($rootScope, $location, $route) {
      var storage = {};
      var removeOnUrlChangekeys = [];
      var unbindRouteUpdate = null;
      var unbindLocationChangeStart = null;
      var originalReloadOnSearchValue = null;

      var preventRouteReload = function () {
        // In case the path has not route definition do nothing
        if (!$route.current || !$route.current.$$route) {
          return;
        }
        if (unbindRouteUpdate) {
          unbindRouteUpdate();
        }
        if (unbindLocationChangeStart) {
          unbindLocationChangeStart();
        }
        if (originalReloadOnSearchValue === null) {
          originalReloadOnSearchValue = $route.current.$$route.reloadOnSearch;
        }

        unbindRouteUpdate = $rootScope.$on('$routeUpdate', function () {
          unbindRouteUpdate();
          unbindRouteUpdate = null;
          var reloadPath = $location.absUrl();
          /*
           * For some reason when setting reloadOnSearch back to its original value a locationChange event is trigger
           * which has to be prevented otherwise the controller will be reinitialised
           */
          unbindLocationChangeStart = $rootScope.$on('$locationChangeStart', function (ev, newUrl) {
            unbindLocationChangeStart();
            if (newUrl === reloadPath) {
              ev.preventDefault();
            }
          });
          $route.current.$$route.reloadOnSearch = originalReloadOnSearchValue;
          originalReloadOnSearchValue = null;
        });

        // reloadOnSearch is set to false to angular will not reinitialise the controller again
        $route.current.$$route.reloadOnSearch = false;
      };

      var cleanUpInvalidQueryParams = function () {
        var removeKeys = _.clone(removeOnUrlChangekeys);
        removeKeys.forEach(function (key, index) {
          storage[key] = null;
          removeOnUrlChangekeys.splice(index, 1);
        });
      };

      var setUrlQueryParams = function () {
        var currentSearchParams = $location.search(),
          newSearchParams;

        newSearchParams = _.extend(currentSearchParams, storage);
        preventRouteReload();
        $location.search(newSearchParams);
        $location.replace();
      };

      $rootScope.$on('$routeChangeStart', function (ev, newRoute, oldRoute) {
        if (newRoute && oldRoute &&
          newRoute.originalPath !== oldRoute.originalPath) {
          if (removeOnUrlChangekeys.length > 0) {
            cleanUpInvalidQueryParams(newRoute.params);
          }
          setUrlQueryParams();
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
         * }
         */
        setObject: function (obj, options) {
          options = options || {};
          var wasChanged = false;
          if (_.isObject(obj)) {
            for (var key in obj) {
              if (obj.hasOwnProperty(key) && storage[key] !== obj[key]) {
                if (options.removeOnUrlChange && removeOnUrlChangekeys.indexOf(key) === -1) {
                  removeOnUrlChangekeys.push(key);
                }
                storage[key] = obj[key];
                wasChanged = true;
              }
            }
          } else {
            throw new Error('[mwUrlStorage] parameter has to be an object otherwise setItem(key, val) should be called ');
          }

          if (wasChanged) {
            setUrlQueryParams();
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
         *
         * params:
         * key: string
         * value: string
         * options: {
         *   removeOnUrlChange: boolean
         * }
         */
        setItem: function (key, value, options) {
          options = options || {};
          if (storage[key] !== value) {
            if (options.removeOnUrlChange && removeOnUrlChangekeys.indexOf(key) === -1) {
              removeOnUrlChangekeys.push(key);
            }
            storage[key] = value;
            setUrlQueryParams();
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
          if (_.isObject(obj)) {
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (storage[key] || this.getItem(key)) {
                  storage[key] = null;
                  wasChanged = true;
                }
                var removeOnUrlChangeKeyIndex = removeOnUrlChangekeys.indexOf(key);
                if (removeOnUrlChangeKeyIndex !== -1) {
                  removeOnUrlChangekeys.slice(removeOnUrlChangeKeyIndex, 1);
                }
              }
            }
          } else {
            throw new Error('[mwUrlStorage] parameter has to be an object otherwise deleteItem(key, val) should be called ');
          }

          if (wasChanged) {
            setUrlQueryParams();
          }
        },
        /*
         * Removes a key with its value from the url
         *
         * params:
         * key: string
         */
        removeItem: function (key) {
          var removeOnUrlChangeKeyIndex = removeOnUrlChangekeys.indexOf(key);
          if (removeOnUrlChangeKeyIndex !== -1) {
            removeOnUrlChangekeys.slice(removeOnUrlChangeKeyIndex, 1);
          }
          if (storage[key]) {
            storage[key] = null;
            setUrlQueryParams();
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
          storage = {};
          removeOnUrlChangekeys = [];
          setUrlQueryParams();
        }
      };
    }
  )
;