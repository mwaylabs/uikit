'use strict';

angular.module('mwHelper', [])

/**
 * @ngdoc directive
 * @name mwHelper.directive:mwStopPropagation
 * @element ANY
 * @param {string} mwStopPropagation the name of the event type
 *
 * @description
 * Stops Propagation of specified event for this element
 */
  .directive('mwStopPropagation', function () {
    return {
      restrict: 'A',
      link: function (scope, elm, attr) {
        if (!attr.mwStopPropagation) {
          throw new Error('Directive mwStopPropagation: This directive must have an event name as attribute e.g. mw-stop-propagation="keyup"');
        }
        elm.on(attr.mwStopPropagation, function (event) {
          event.stopPropagation();
        });
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwForm.directive:mwLeaveConfirmation
 * @element form
 * @description
 *
 * Opens a confirmation modal when the form has been edited and a the user wants to navigate to a new page
 *
 */

  .directive('mwLeaveConfirmation', function ($window, $document, $location, i18n, Modal) {
    return {
      scope: {
        alertBeforeLeave: '=mwLeaveConfirmation',
        text:'@'
      },
      link: function (scope) {

        var confirmationModal = Modal.create({
          templateUrl: 'modules/ui/templates/mwForm/mwLeaveConfirmation.html',
          scope: scope
        });

        // Prevent the original event so the routing will not be completed
        // Save the url where it should be navigated to in a temp variable
        var showConfirmModal = function (ev, next) {
          if (scope.alertBeforeLeave) {
            Modal.show(confirmationModal);
            ev.preventDefault();
            scope.next = next;
          }
        };

        // User wants to stay on the page
        scope.stay = function () {
          Modal.hide(confirmationModal);
        };

        // User really wants to navigate to that page which was saved before in a temp variable
        scope.continue = function () {
          if (scope.next) {
            //instead of scope.$off() we call the original eventhandler function
            scope.changeLocation();

            //hide the modal and navigate to the page
            Modal.hide(confirmationModal).then(function () {
              $window.document.location.href = scope.next;
              scope.next = null;
            });
          }
        };

        //In case that just a hashchange event was triggered
        //Angular has no $off event unbinding so the original eventhandler is saved in a variable
        scope.changeLocation = scope.$on('$locationChangeStart', showConfirmModal);

        //In case that the user clicks the refresh/back button or makes a hard url change
        $window.onbeforeunload = function () {
          if (scope.alertBeforeLeave) {
            return scope.text;
          }
        };

        if(!angular.isDefined(scope.text)){
          throw new Error('Please specify a text in the text attribute');
        }

      }
    };
  })

  .directive('mwTutorialTooltip', function ($compile, $timeout) {
    return {
      scope: {
        display: '=',
        text: '@mwTutorialTooltip',
        position: '@'
      },
      link: function (scope, el) {

        var customCheckbox,
          customCheckboxStateIndicator;

        var render = function () {
          customCheckbox = $compile('<div class="mw-tutorial clearfix btn-block" ng-class="position"></div>')(scope);
          customCheckboxStateIndicator = $compile('<div class="tutorial-badge-wrapper show"><span ng-if="display" class="tutorial-badge">{{text}}</span></div>')(scope);

          if(scope.position){
            customCheckbox.addClass(scope.position);
          }

          el.wrap(customCheckbox);
          customCheckboxStateIndicator.insertAfter(el);
        };

        $timeout(function () {
          customCheckboxStateIndicator.removeClass('show');
        }, 8000);

        render();

      }
    };
  });