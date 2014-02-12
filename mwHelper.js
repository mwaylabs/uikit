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
          if(!attr.mwStopPropagation) {
            throw new Error('Directive mwStopPropagation: This directive must have an event name as attribute e.g. mw-stop-propagation="keyup"');
          }
          elm.on(attr.mwStopPropagation, function(event) {
            event.stopPropagation();
          });
        }
      };
    })
;