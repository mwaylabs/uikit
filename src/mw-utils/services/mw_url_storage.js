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

    var getChangedValues = function (params) {
      var currentSearchParams = $location.search();
      return _.difference(_.values(params), _.values(currentSearchParams));
    };

    var setUrlQueryParams = function (params, preferQueryOverStorage) {
      if (getChangedValues(params).length > 0) {
        var currentSearchParams = $location.search(),
          newSearchParams;

        if(preferQueryOverStorage){
          newSearchParams = _.extend(params, currentSearchParams);
        } else {
          newSearchParams = _.extend(currentSearchParams, params);
        }

        preventRouteReload();
        $location.search(newSearchParams);
      }
    };

    $rootScope.$on('$locationChangeSuccess', function (ev, newUrl, oldUrl) {
      if (newUrl !== oldUrl) {
        setUrlQueryParams(storage, true);
      }
    });

    return {
      getItem: function (key) {
        return $location.search()[key];
      },
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
          setUrlQueryParams(obj);
        }
      },
      setItem: function (key, value, options) {
        options = options || {};
        if (storage[key] !== value) {
          if (!options.removeOnUrlChange) {
            storage[key] = value;
          }
          var obj = {};
          obj[key] = value;
          setUrlQueryParams(obj);
        }
      },
      removeObject: function (obj) {
        var wasChanged = false;
        if (_.isObject(obj)) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key) && storage[key]) {
              storage[key] = null;
              wasChanged = true;
            }
          }
        } else {
          throw new Error('[mwUrlStorage] parameter has to be an object otherwise deleteItem(key, val) should be called ');
        }

        if (wasChanged) {
          setUrlQueryParams(storage);
        }
      },
      removeItem: function (key) {
        if (storage[key]) {
          storage[key] = null;
          setUrlQueryParams(storage);
          return true;
        } else {
          return false;
        }
      },
      clear: function () {
        storage = {};
        setUrlQueryParams(storage);
      }
    };
  });