'use strict';

angular.module('mwComponents', [])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwPanel
 * @element div
 * @description
 *
 * Wrapper directive for Bootstraps Panel.
 *
 * @param {string} mwPanel Panel title
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-panel="Panel title">
 *      Panel content
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
    .directive('mwPanel', function () {
      return {
        restriction: 'A',
        replace: true,
        scope: {
          title: '@mwPanel'
        },
        transclude: true,
        templateUrl: 'modules/ui/templates/mwPanel.html'
      };
    })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwAlert
 * @element div
 * @description
 *
 * Wrapper directive for Bootstraps Alert.
 *
 * @param {string} mwAlert Alert type. Can be one of the following:
 *
 * - warning
 * - danger
 * - success
 * - info
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-alert="warning">
 *      Alert content
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
    .directive('mwAlert', function () {
      return {
        restriction: 'A',
        replace: true,
        scope: {
          type: '@mwAlert'
        },
        transclude: true,
        templateUrl: 'modules/ui/templates/mwAlert.html'
      };
    });


