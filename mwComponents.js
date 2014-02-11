'use strict';

angular.module('mwComponents', [])

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwPanel
 * @element div
 * @description
 *
 * Wrapper directive for {@link http://getbootstrap.com/components/#panels Bootstraps Panel}.
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
        restrict: 'A',
        replace: true,
        scope: {
          title: '@mwPanel'
        },
        transclude: true,
        templateUrl: 'modules/ui/templates/mwComponents/mwPanel.html'
      };
    })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwAlert
 * @element div
 * @description
 *
 * Wrapper directive for {@link http://getbootstrap.com/components/#alerts Bootstraps Alert}.
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
        restrict: 'A',
        replace: true,
        scope: {
          type: '@mwAlert'
        },
        transclude: true,
        templateUrl: 'modules/ui/templates/mwComponents/mwAlert.html'
      };
    })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwHeader
 * @element div
 * @description
 *
 * Header bar for content pages.
 *
 * @param {string} title Header title
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <div mw-header title="A nice page">
 *      Header content, Buttons etc...
 *    </div>
 *  </doc:source>
 * </doc:example>
 */
    .directive('mwHeader', function ($location) {
      return {
        transclude: true,
        scope: {
          title: '@',
          url:'@',
          showBackButton: '@'
        },
        templateUrl: 'modules/ui/templates/mwComponents/mwHeader.html',
        link:function(scope,el,attrs,ctrl,$transclude){

          $transclude(function (clone) {
            if((!clone || clone.length===0) && !scope.showBackButton){
              el.find('.navbar-header').addClass('no-buttons');
            }
          });

          scope.back = function(){
            if(attrs.url){
              $location.path(attrs.url);
            } else {
              window.history.back();
            }
          };
        }
      };
    })


/**
 * @ngdoc directive
 * @name mwComponents.directive:mwIcon
 * @element span
 * @description
 *
 * Wrapper for bootstrap glyphicons.
 *
 * @param {string} mwIcon Glyphicon class suffix. Example suffix for 'glyphicon glyphicon-search' is 'search'
 * @param {string} tooltip Optional string which will be displayed as a tooltip when hovering over the icon
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <span mw-icon="search"></span>
 *    <span mw-icon="search" tooltip="This is a tooltip"></span>
 *  </doc:source>
 * </doc:example>
 */
    .directive('mwIcon', function () {
      return {
        restrict: 'A',
        replace: true,
        scope: { mwIcon: '@' },
        template: '<span class="glyphicon glyphicon-{{mwIcon}}"></span>',
        link: function(scope,el,attr){
          if(attr.tooltip){
            el.popover({
              trigger: 'hover',
              placement: 'bottom',
              content: attr.tooltip,
              container: 'body'
            });
          }

        }
      };
    })

/**
 * @ngdoc directive
 * @name Relution.Common.directive:rlnTooltip
 * @element span
 *
 * @description
 * Creates a tooltip element using Bootstraps popover component.
 *
 * @param {String} mwTooltip Content of the tooltip
 *
 * @example
 <span mw-tooltip="foobar"></span>
 */
    .directive('mwTooltip', function () {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          mwTooltip: '@'
        },
        template: '<span><span mw-icon="question-sign" tooltip="{{mwTooltip}}"></span></span>'
      };
    })

/**
 * @ngdoc directive
 * @name mwComponents.directive:mwBadge
 * @element span
 * @description
 *
 * Wrapper for bootstrap labels.
 *
 * @param {string} mwBadge label class suffix. Example: suffix for 'label label-info' is 'search'
 *
 * @example
 * <doc:example>
 *  <doc:source>
 *    <span mw-badge="info"></span>
 *  </doc:source>
 * </doc:example>
 */
    .directive('mwBadge', function () {
      return {
        restrict: 'A',
        replace: true,
        scope: { mwBadge: '@' },
        transclude: true,
        template: '<span class="label label-{{mwBadge}}" ng-transclude></span>'
      };
    });

