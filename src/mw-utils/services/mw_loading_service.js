'use strict';

angular.module('mwUI.Utils')

/**
 * @ngdoc service
 * @name mwUI.Utils.service:Loading
 *
 * @description
 * This service manages loading processes. It can be used e.g. by a httpInterceptor to register a loading process
 */
  .service('Loading', function ($timeout) {

    var itemsToLoad = 0,
      itemsAlreadyLoaded = 0,
      loading = false,
      keysToLoad = {},
      waitUntilDoneTimout,
      doneCallbacks = [],
      startCallbacks = [];

    var reset = function () {
      itemsToLoad = 0;
      itemsAlreadyLoaded = 0;
    };

    var executeCallbacks = function (cbs, args, scope) {
      scope = scope || this;
      cbs.forEach(function (cb) {
        cb.apply(scope, args);
      });
    };

    var setToDone = function () {
      if (waitUntilDoneTimout) {
        $timeout.cancel(waitUntilDoneTimout);
      }
      waitUntilDoneTimout = $timeout(function () {
        loading = false;
        executeCallbacks(doneCallbacks);
        reset();
      }, 100);
    };

    var registerCallback = function (array, callback) {
      if (typeof callback === 'function') {
        array.push(callback);
      } else {
        throw new Error('Callback has to be a function');
      }
    };

    /**
     * @ngdoc function
     * @name start
     * @methodOf mwUI.Utils.service:Loading
     * @description
     * Starts a loading process. When a key is passed a specified loading process is registered otherwise
     * a global loading process is registered
     * @param {String} key a unique key to start the loading process
     */
    this.start = function (key) {
      if (key) {
        keysToLoad[key] = true;
      } else {
        itemsToLoad++;
        if (!loading) {
          executeCallbacks(startCallbacks);
          loading = true;
          $timeout.cancel(waitUntilDoneTimout);
        } else {
          $timeout.cancel(waitUntilDoneTimout);
        }
      }
    };

    /**
     * @ngdoc function
     * @name done
     * @methodOf mwUI.Utils.service:Loading
     * @description
     * Stops a loading process identified by a unique key.
     * When no key is specified a global loading process counter is increased. As soon as the global loading
     * process counter is the same as the length of registered global loading processes a debounced callback is called
     * @param {String} key the unique key which belongs to the animation (optional)
     */
    this.done = function (key) {
      if (key) {
        delete keysToLoad[key];
      } else {
        if (itemsToLoad !== 0) {
          itemsAlreadyLoaded++;
          if (itemsToLoad === itemsAlreadyLoaded) {
            setToDone();
          }
        }
      }
    };

    /**
     * @ngdoc function
     * @name isLoading
     * @methodOf mwUI.Utils.service:Loading
     * @description
     * When a key is specified it returns whether the loading process for that key is active
     * otherwise it returns whether at least one process is active or none at all
     * @param {String} key the unique key which belongs to the loading process (optional)
     * @return {Boolean} Returns true if a loading is currently active for the given key
     */
    this.isLoading = function (key) {
      if (key) {
        return keysToLoad[key] || false;
      } else {
        return loading;
      }
    };

    /**
     * @ngdoc function
     * @name registerDoneCallback
     * @methodOf mwUI.Utils.service:Loading
     * @description
     * Registers a callback function which gets called when all loading processes are done
     * @param {Function} callback the callback function
     */
    this.registerDoneCallback = function (callback) {
      registerCallback(doneCallbacks, callback);
    };

    /**
     * @ngdoc function
     * @name registerStartCallback
     * @methodOf mwUI.Utils.service:Loading
     * @description
     * Registers a callback function which gets called when the loading starts
     * @param {Function} callback the callback function
     */
    this.registerStartCallback = function (callback) {
      registerCallback(startCallbacks, callback);
    };

  });