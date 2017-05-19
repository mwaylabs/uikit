angular.module('mwUI.Modal')

  .service('Modal', function ($rootScope, $templateCache, $document, $compile, $controller, $injector, $q, $templateRequest, $timeout, mwModalOptions, Toast) {

    var _openedModals = [];

    var Modal = function (modalOptions, bootStrapModalOptions) {
      var _id = modalOptions.templateUrl,
        _scope = modalOptions.scope || $rootScope,
        _scopeAttributes = modalOptions.scopeAttributes || {},
        _resolve = modalOptions.resolve || {},
        _controller = modalOptions.controller,
        _modalOptions = _.extend(mwModalOptions.getOptions(), modalOptions),
        _bootStrapModalOptions = _.extend(_modalOptions.bootStrapModalOptions, bootStrapModalOptions),
        _watchers = [],
        _modalOpened = false,
        _self = this,
        _modal,
        _usedScope = _scope.$new(),
        _usedController,
        _bootstrapModal,
        _previousFocusedEl;

      var _setAttributes = function (target, attributes) {
        if (_.isObject(attributes) && _.isObject(target)) {
          for (var key in attributes) {
            target[key] = attributes[key];
          }
        }
      };

      var _prepareController = function(locals){
        _setAttributes(_usedScope, _scopeAttributes);

        if (_controller) {
          locals.$scope = _usedScope;
          locals.modalId = _id;
          var ctrl = $controller(_controller, locals, true, _modalOptions.controllerAs);
          _setAttributes(ctrl.instance, _scopeAttributes);
          _usedController = ctrl();
        }
      };

      var _getTemplate = function () {
        if (!_id) {
          throw new Error('Modal service: templateUrl options is required.');
        }
        return $templateRequest(_id);
      };

      var _bindModalCloseEvent = function () {
        _bootstrapModal.on('hidden.bs.modal', function () {
          _self.destroy();
        });
      };

      var _destroyOnRouteChange = function () {
        var changeLocationOff = $rootScope.$on('$locationChangeStart', function (ev, newUrl) {
          if (_bootstrapModal && _modalOpened) {
            ev.preventDefault();
            _self.hide().then(function () {
              document.location.href = newUrl;
              changeLocationOff();
            });
          } else {
            changeLocationOff();
          }
        });
      };

      var _setScopeWatcher = function(){
        _watchers.forEach(function(watcher){
          _usedScope.$watch(watcher.expression,watcher.callback);
        });
      };

      var _resolveLocals = function () {
        var locals = angular.extend({}, _resolve);
        angular.forEach(locals, function (value, key) {
          locals[key] = angular.isString(value) ?
            $injector.get(value) :
            $injector.invoke(value, null, null, key);
        });
        locals.$template = _getTemplate();
        return $q.all(locals);
      };

      var _compileTemplate = function (locals) {
        _prepareController(locals);
        return $compile(locals.$template)(_usedScope);
      };

      var _buildModal = function () {

        var dfd = $q.defer();

        _resolveLocals().then(function (locals) {
          _setScopeWatcher();
          _scopeAttributes.hideModal = function(){
            return _self.hide();
          };

          _modal = _compileTemplate(locals);

          _usedScope.$on('COMPILE:FINISHED', function () {
            _modal.addClass('mw-modal');
            _modal.addClass(_modalOptions.styleClass);
            _bootstrapModal = _modal.find('.modal');
            _bootStrapModalOptions.show = false;

            if(!_modalOptions.dismissible){
              _bootStrapModalOptions.backdrop =  'static';
              _bootStrapModalOptions.keyboard =  false;
            }

            _bootstrapModal.modal(_bootStrapModalOptions);

            // We need to overwrite the the original backdrop method with our own one
            // to make it possible to define the element where the backdrop should be placed
            // This enables us a backdrop per modal because we are appending the backdrop to the modal
            // When opening multiple modals the previous will be covered by the backdrop of the latest opened modal
            /* jshint ignore:start */
            if (_bootstrapModal.data()) {
              var bootstrapModal = _bootstrapModal.data()['bs.modal'],
                $bootstrapBackdrop = bootstrapModal.backdrop;

              bootstrapModal.backdrop = function (callback) {
                $bootstrapBackdrop.call(bootstrapModal, callback, $(_modalOptions.holderEl).find('.modal'));
              };
            }
            /* jshint ignore:end */

            _bindModalCloseEvent();
            _destroyOnRouteChange();
            dfd.resolve();
          });

        }.bind(this), function (err) {
          dfd.reject(err);
        });

        return dfd.promise;
      };

      this.id = _id;

      this.getScope = function () {
        return _usedScope;
      };

      this.watchScope = function(expression, callback){
        _watchers.push({
          expression: expression,
          callback: callback
        });
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#show
       * @methodOf mwModal.Modal
       * @function
       * @description Shows the modal
       */
      this.show = function () {
        var dfd = $q.defer();
        Toast.clear();
        _previousFocusedEl = angular.element(document.activeElement);
        $rootScope.$broadcast('$modalOpenStart');
        $rootScope.$broadcast('$modalResolveDependenciesStart');
        _buildModal.call(this).then(function () {
          $rootScope.$broadcast('$modalResolveDependenciesSuccess');
          angular.element(_modalOptions.holderEl).append(_modal);
          _bootstrapModal.modal('show');
          _modalOpened = true;
          _openedModals.push(this);
          _bootstrapModal.on('shown.bs.modal', function () {
            angular.element(this).find('input:text:visible:first').focus();
            $rootScope.$broadcast('$modalOpenSuccess');
            dfd.resolve();
          });
          if (_previousFocusedEl) {
            _bootstrapModal.on('hidden.bs.modal', function () {
              _previousFocusedEl.focus();
            });
          }

        }.bind(this), function (err) {
          $rootScope.$broadcast('$modalOpenError', err);
          dfd.reject(err);
        });

        return dfd.promise;
      };

      this.setScopeAttributes = function (obj) {
        _setAttributes(_scopeAttributes, obj);

        $timeout(function () {
          if (_usedScope) {
            _setAttributes(_usedScope, obj);
          }

          if (_usedController) {
            _setAttributes(_usedController, obj);
          }
        });
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#hide
       * @methodOf mwModal.Modal
       * @function
       * @description Hides the modal
       * @returns {Object} Promise which will be resolved when modal is successfully closed
       */
      this.hide = function () {
        var dfd = $q.defer();

        $rootScope.$broadcast('$modalCloseStart');
        if (_bootstrapModal && _modalOpened) {
          _bootstrapModal.one('hidden.bs.modal', function () {
            _bootstrapModal.off();
            _self.destroy();
            _modalOpened = false;
            $rootScope.$broadcast('$modalCloseSuccess');
            dfd.resolve();
          });
          _bootstrapModal.modal('hide');
        } else {
          dfd.resolve();
        }

        return dfd.promise;
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#toggle
       * @methodOf mwModal.Modal
       * @function
       * @description Toggles the modal
       * @param {String} modalId Modal identifier
       */
      this.toggle = function () {
        _bootstrapModal.modal('toggle');
      };

      /**
       *
       * @ngdoc function
       * @name mwModal.Modal#destroy
       * @methodOf mwModal.Modal
       * @function
       * @description Removes the modal from the dom
       */
      this.destroy = function () {
        _openedModals = _.without(_openedModals, this);
        var toasts = Toast.getToasts();
        toasts.forEach(function (toast) {
          if (+new Date() - toast.initDate > 500) {
            Toast.removeToast(toast.id);
          }
        });

        $timeout(function () {
          if (_modal) {
            _modal.remove();
            _modalOpened = false;
          }

          if (_usedScope) {
            _usedScope.$destroy();
            _usedScope = _scope.$new();
          }

          _scopeAttributes = modalOptions.scopeAttributes || {};
        }.bind(this));
      };

      (function main() {

        _getTemplate();

        _scope.$on('$destroy', function () {
          _self.hide();
        });

      })();

    };

    /**
     *
     * @ngdoc function
     * @name mwModal.Modal#create
     * @methodOf mwModal.Modal
     * @function
     * @description Create and initialize the modal element in the DOM. Available options
     *
     * - **templateUrl**: URL to a template (_required_)
     * - **scope**: scope that should be available in the controller
     * - **controller**: controller instance for the modal
     *
     * @param {Object} modalOptions The options of the modal which are used to instantiate it
     * @returns {Object} Modal
     */
    this.create = function (modalOptions, bootstrapModalOptions) {
      if(modalOptions && modalOptions.el){
        modalOptions.holderEl = modalOptions.el;
        window.mwUI.Utils.shims.deprecationWarning('[Modal] The modal options property el was renamed to holderEl');
      }

      if(modalOptions && modalOptions.class){
        modalOptions.styleClass = modalOptions.class;
        window.mwUI.Utils.shims.deprecationWarning('[Modal] The modal options property class was renamed to styleClass');
      }

      return new Modal(modalOptions, bootstrapModalOptions);
    };

    this.prepare = function (modalOptions, bootstrapModalOptions) {
      return this.create.bind(this, modalOptions, bootstrapModalOptions);
    };

    this.getOpenedModals = function () {
      return _openedModals;
    };
  });
