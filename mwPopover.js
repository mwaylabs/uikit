'use strict';

angular.module('mwPopover', [])

/**
 * Helper service for internal use to communicate between popover directives
 */
    .service('Popover', function () {
      this.contents = [];
    })

/**
 * @ngdoc directive
 * @name Relution.Common.directive:mwPopoverContent
 * @element ANY
 *
 * @description
 * Provides content for a popup under the given key
 *
 * @param {String} mwPopoverContent ID where this content should be available
 *
 * @example
 <div mw-popover-content="anID">Content of the popover</div>
 */
    .directive('mwPopoverContent', function (Popover) {

      return {
        restrict: 'A',
        link: function (scope, elm, attr) {
          elm.css('display', 'none');
          Popover.contents[attr.mwPopoverContent] = elm.html();
        }
      };
    })


/**
 * @ngdoc directive
 * @name Relution.Common.directive:mwPopover
 * @element ANY
 *
 * @description
 * Adds a popover for the current element (see Bootstrap 3 component)
 *
 * @param {String} mwPopover ID of mw-popover-content
 * @param {String} popoverTrigger how tooltip is triggered - click | hover | focus | manual. You may pass multiple triggers; separate them with a space.
 * @param {String} popoverPosition how to position the tooltip - top | bottom | left | right | auto. When "auto" is specified, it will dynamically reorient the tooltip. For example, if placement is "auto left", the tooltip will display to the left when possible, otherwise it will display right.
 *
 * @example
 <div mw-popover-button="Click me to open the popover">Content of the popover</div>
 */
    .directive('mwPopover', function (Popover) {
      return {
        restrict: 'A',
        scope: {
          content: '='
        },
        link: function (scope, elm, attr) {
          var buildPopover = function () {
            var content = Popover.contents[attr.mwPopover];
            if(scope.content){
              content = scope.content;
            }
            elm.popover('destroy');
            elm.popover({
              trigger: attr.popoverTrigger,
              title: attr.popoverTitle,
              html: true,
              placement: attr.popoverPosition,
              content: content
            });
          };

          elm.on('blur', function () {
            elm.popover('hide');
          });

          buildPopover();

          //we need to set a default value here, see
          //https://github.com/angular/angular.js/commit/531a8de72c439d8ddd064874bf364c00cedabb11
          attr.popoverTitle = attr.popoverTitle || 'popoverTitle';
          attr.$observe('popoverTitle', buildPopover);
        }
      };
    })

;