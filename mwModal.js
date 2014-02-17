'use strict';

angular.module('mwModal', [])

/**
 *
 * @ngdoc object
 * @name mwModal.Modal
 * @description The Modal service is used to manage Bootstrap modals.
 * @example
 * <doc:example>
 *   <doc:source>
 *     <script>
 *       function Controller($scope, Modal) {
 *        var modal = Modal.create({
 *          templateUrl: 'myModal.html',
 *          scope: $scope,
 *          controller: function() {
 *            // do something on initialization
 *          }
 *        });
 *        $scope.onClick = function() {
 *          Modal.show(modal)
 *        }
 *       }
 *     </script>
 *   </doc:source>
 * </doc:example>
 */
  .service('Modal', function ($rootScope, $templateCache, $document, $compile, $controller, $q, $http) {

    /**
     * TODO: Modals have to be removed from the dom at some time. There are several options for this:
     * * Don't append it to the body, but put it inside ng-view so that it will be destroyed on every location change
     * * Remove it from the body at some point in time. The only question is when. On Modal close?
     * * Maybe it makes sense to limit the existence in the dom to the actual display of the modal. Create it on open,
     *   remove it on close!
     */

    var _scope,
      _template,
      _cachedTemplate,
      _modals = {},
      that = this,
      _body = $document.find('body').eq(0);

    var getTemplate = function(templateId){
      var dfd = $q.defer();

      if (!templateId) {
        throw new Error('Modal service: templateUrl options is required.');
      }

      // Get template from cache
      _cachedTemplate = $templateCache.get(templateId);

      if(!_cachedTemplate){
        $http.get(templateId).then(function(resp){
          $templateCache.put(templateId, resp.data);
          dfd.resolve(resp.data);
        },function(){
          throw new Error('Modal service: template \'' + templateId + '\' has not been found. Does a template with this ID/Path exist?');
        });
      } else {
        dfd.resolve(_cachedTemplate);
      }

      return dfd.promise;

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
     * @returns {String} modalId Modal identifier
     */
    this.create = function (modalOptions) {
      var _modal, _modalId, _ctrl;

      // Generate modal id from templateUrl: '/url/to/myModal.html' -> 'myModal'
      _modalId = modalOptions.templateUrl;

      if (!_modals[_modalId]) {
        // Create new scope if scope is not given in options
        _scope = (modalOptions.scope || $rootScope).$new();

        getTemplate(_modalId).then(function(template){

          _cachedTemplate = template;
          // Build element
          _template = angular.element(_cachedTemplate.trim());

          _modal = $compile(_template)(_scope);
          _modals[_modalId] = _modal;

          _modal.addClass('mw-modal');
          _body.append(_modal);

          _scope.$on('$destroy', function () {
            that.destroy(_modalId);
          });

          if (modalOptions.controller) {
            _ctrl = $controller(modalOptions.controller, { $scope: _scope, modalId: _modalId });
          }

          _modal.modal({ show: false });
        });
      }
      return _modalId;
    };

    /**
     * Helper method to return modal instance from _modals
     * @param modalId ID of the modal to return the instance from
     * @returns {angular.element} Modal instance (DOM element)
     */
    var getModal = function (modalId) {
      if (_modals[modalId]) {
        return _modals[modalId].find('.modal');
      } else {
        throw new Error('Modal service: modal "' + modalId + '" not found. Please call "create" method first.');
      }
    };

    /**
     *
     * @ngdoc function
     * @name mwModal.Modal#show
     * @methodOf mwModal.Modal
     * @function
     * @description Shows the modal
     * @param {String} modalId Modal identifier
     */
    this.show = function (modalId) {
      getModal(modalId).modal('show');
    };

    /**
     *
     * @ngdoc function
     * @name mwModal.Modal#hide
     * @methodOf mwModal.Modal
     * @function
     * @description Hides the modal
     * @param {String} modalId Modal identifier
     * @returns {Object} Promise which will be resolved when modal is successfully closed
     */
    this.hide = function (modalId) {
      var dfd = $q.defer();
      getModal(modalId).on('hidden.bs.modal', function () {
        dfd.resolve();
      });
      getModal(modalId).modal('hide');
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
    this.toggle = function (modalId) {
      getModal(modalId).modal('toggle');
    };

    /**
     *
     * @ngdoc function
     * @name mwModal.Modal#destroy
     * @methodOf mwModal.Modal
     * @function
     * @description Removes the modal from the dom
     * @param {String} modalId Modal identifier
     */
    this.destroy = function (modalId) {
      if (_modals[modalId]) {
        _modals[modalId].remove();
        delete _modals[modalId];
      }
    };
  })


/**
 * @ngdoc directive
 * @name mwModal.directive:mwModal
 * @element div
 * @description
 * Shortcut directive for Bootstraps modal.
 *
 * @scope
 *
 * @param {string} title Modal title
 * @example
 * <doc:example>
 *   <doc:source>
 *     <div mw-modal title="My modal">
 *       <div mw-modal-body>
 *         <p>One fine body&hellip;</p>
 *       </div>
 *       <div mw-modal-footer>
 *         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
 *         <button type="button" class="btn btn-primary">Save changes</button>
 *       </div>
 *     </div>
 *   </doc:source>
 * </doc:example>
 */

  .directive('mwModal', function () {
    return {
      restrict: 'A',
      scope: {
        title: '@'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwModal/mwModal.html'
    };
  })

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModalBody
 * @element div
 * @description
 * Shortcut directive for Bootstraps body. See {@link mwModal.directive:mwModal `mwModal`} for more information
 * about mwModal.
 */
  .directive('mwModalBody', function () {
    return {
      restrict: 'A',
      transclude: true,
      replace:true,
      template: '<div class="modal-body clearfix" ng-transclude></div>'
    };
  })

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModalFooter
 * @element div
 * @description
 * Shortcut directive for Bootstraps footer. See {@link mwModal.directive:mwModal `mwModal`} for more information
 * about mwModal.
 */
  .directive('mwModalFooter', function () {
    return {
      restrict: 'A',
      transclude: true,
      replace:true,
      template: '<div class="modal-footer" ng-transclude></div>'
    };
  })

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModalOnEnter
 * @element button
 * @description
 * Adds ability to trigger button with enter key. Checks validation if button is part of a form.
 */
.directive('mwModalOnEnter', function () {
  return {
    restrict: 'A',
    require: '?^form',
    link: function (scope, elm, attr, ctrl) {
      elm.parents('.modal').first().on('keyup', function(event){
        if(event.keyCode === 13 && event.target.nodeName !== 'SELECT') {
          if((ctrl && ctrl.$valid) || !ctrl) {
            elm.click();
          }
        }
      });
    }
  };
})

/**
 * @ngdoc directive
 * @name mwModal.directive:mwModalConfirm
 * @element div
 * @description
 *
 * Opens a simple confirm modal.
 *
 * @scope
 *
 * @param {expression} ok Expression to evaluate on click on 'ok' button
 * @param {expression} cancel Expression to evaluate on click on 'cancel' button
 */
  .directive('mwModalConfirm', function () {
    return {
      restrict: 'A',
      transclude: true,
      templateUrl: 'modules/ui/templates/mwModal/mwModalConfirm.html',
      link: function (scope, elm, attr) {
        angular.forEach(['ok', 'cancel'], function (action) {
          scope[action] = function () {
            scope.$eval(attr[action]);
          };
        });

      }
    };
  });