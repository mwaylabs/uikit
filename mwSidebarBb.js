'use strict';

angular.module('mwSidebarBb', [])

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarSelect
 * @element div
 * @description
 *
 * Creates a select input which provides possible values for a filtering.
 *
 * @param {collection} collection with option models. by default model.key() and model.label() functions will be called as key label
 * @param {expression} mwDisabled If expression evaluates to true, input is disabled.
 * @param {string} property The name of the property on which the filtering should happen.
 * @param {string} placeholder The name of the default selected label with an empty value.
 * @param {expression} persist If true, filter will be saved in runtime variable
 * @param {string} keyProperty property of model to use instead of models key() method
 * @param {string | object} labelProperty property of model to use instead of models label() method. if object it will be translated with i18n service.
 * @param {function} labelTransformFn function to use instead of label() method or labelProperty. Will be called with model as parameter.
 * @param {string} translatePrefix prefix to translate the label with i18n service (prefix + '.' + model.key()).
 */
  .directive('mwSidebarSelectBb', function (i18n) {
    return {
      require: '^mwSidebarFiltersBb',
      scope: {
        property: '@',
        options: '=',
        placeholder: '@',
        mwDisabled: '=',
        persist: '=',
        keyProperty: '@',
        labelProperty: '@',
        labelTransformFn: '=',
        translatePrefix: '@',
        customUrlParameter: '@'
      },
      templateUrl: 'modules/ui/templates/mwSidebarBb/mwSidebarSelect.html',
      link: function (scope, elm, attr, ctrl) {

        //set key function for select key
        scope.key = function(model) {
          return model.key();
        };

        if(angular.isDefined(scope.keyProperty)) {
          scope.key = function(model) {
            return model.attributes[scope.keyProperty];
          };
        }

        //set label function fo select label
        scope.label = function(model){
          //translate with i18n service if translatePrefix is defined (use key not label!)
          if(scope.translatePrefix){
            return i18n.get(scope.translatePrefix + '.' + model.key());
          }
          return model.label();
        };

        if(angular.isDefined(scope.labelProperty)){
          scope.label = function(model){
            //translate if value is a translation object
            if(angular.isObject(model.attributes[scope.labelProperty])){
              return i18n.localize(model.attributes[scope.labelProperty]);
            }
            return model.attributes[scope.labelProperty];
          };
        }

        if(angular.isDefined(scope.labelTransformFn)){
          scope.label = scope.labelTransformFn;
        }

        scope.collection = ctrl.getCollection();

        //TODO implement filter persistance
        /*scope.$watch('filterable', function () {
          if (scope.filterable) {
            scope.model = scope.filterable.properties[scope.property];
            if (scope.persist) {
              scope.filterable.properties[scope.property].persist = scope.persist;
            }
          }
        });*/
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarPanel
 * @element div
 * @description
 *
 * Directive for the filter panel.
 *
 * @param {boolean} affix Make the filterbar affix by listening on window scroll event and changing top position so that the filterbar can be postion relative instead of fixed
 * @param {number} offset If needed an offset to the top for example when a nav bar is over the sidebar that is not fixed.
 *
 */
  .directive('mwSidebarPanelBb', function ($document, $window, $timeout) {
    return {
      replace: true,
      transclude: true,
      templateUrl: 'modules/ui/templates/mwSidebarBb/mwSidebarPanel.html',
      link: function (scope, el, attr) {
        var offsetTop = angular.element(el).offset().top,
          newOffset;

        var repos = function () {
          offsetTop = angular.element(el).offset().top;

          if ($document.scrollTop() < attr.offset) {
            newOffset = offsetTop - $document.scrollTop();
          } else {
            newOffset = offsetTop - attr.offset;
          }

          angular.element(el).find('.content-container').css('top', newOffset);

          if ($document.scrollTop() < 1) {
            angular.element(el).find('.content-container').css('top', 'initial');
          }

        };

        var setMaxHeight = function () {
          var containerEl = el.find('.content-container'),
            windowHeight = angular.element(window).height(),
            containerElOffsetTop = containerEl.offset().top,
            footerHeight = angular.element('body > footer').height(),
            padding = 20,
            maxHeight = windowHeight - containerElOffsetTop - footerHeight - padding;

            if(maxHeight>0){
              containerEl.css('max-height', maxHeight);
            } else {
              containerEl.css('max-height', 'initial');
            }
        };


        $timeout(setMaxHeight,500);
        angular.element($window).on('resize', _.throttle(setMaxHeight, 300));

        if (attr.affix && attr.offset) {
          angular.element($window).scroll(function () {
            repos();
          });
        }
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarActions
 * @element div
 * @description
 *
 * Container for actions
 *
 */
  .directive('mwSidebarActionsBb', function () {
    return {
      transclude: true,
      template: '<div ng-transclude></div><hr>'
    };
  })

/**
 * @ngdoc directive
 * @name mwSidebar.directive:mwSidebarFilters
 * @element div
 * @description
 *
 * Container for filters
 *
 */
  .directive('mwSidebarFiltersBb', function () {
    return {
      transclude: true,
      templateUrl: 'modules/ui/templates/mwSidebarBb/mwSidebarFilters.html',
      link: function (scope, elm, attr) {

        scope.collection = scope.$eval(attr.collection);
        if(!angular.isDefined(scope.collection)){
          throw new Error('mwSidebarFiltersBb does not have a collection!');
        }

        scope.resetFiltersOnClose = function () {
          if (!scope.toggleFilters) {
            scope.collection.filterable.resetFilters();
            scope.collection.fetch();
          }
        };

        /*if (scope.collection.hasPersistedFilters()) {
          scope.toggleFilters = true;
        }*/
      },
      controller: function($scope){
        this.getCollection = function(){
          return $scope.collection;
        };
      }
    };
  });


