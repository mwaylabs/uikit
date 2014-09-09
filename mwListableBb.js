'use strict';

angular.module('mwListableBb', [])

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListable
 * @element table
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} selectable Instance of selectable for this listable item
 * @param {string} filterable Instance of filterable for this listable item. Needed for pagination.
 * @example
 * <doc:example>
 *   <doc:source>
 *    <table mw-listable
 *           selectable="selectable"
 *           filterable="filterable">
 *      <thead>
 *        <tr>
 *          <th mw-listable-header>A column</th>
 *        </tr>
 *      </thead>
 *      <tbody>
 *        <tr ng-repeat="item in filterable.items()">
 *          <td>Column content</td>
 *        </tr>
 *      </tbody>
 *    </table>
 *   </doc:source>
 * </doc:example>
 */
    .directive('mwListableBb', function ($compile, $window, $document) {

      return {
        restrict: 'A',
        scope: {
          collection: '='
        },
        compile: function  (elm) {

          elm.append('<tfoot mw-listable-footer-bb></tfoot>');

          return function (scope, elm) {
            var loading = false;
            elm.addClass('table table-striped mw-listable');

            /**
             * Infinite scrolling
             */
            var scrollCallback = function () {
              if(scope.collection && scope.collection.filterable){
                if (!loading && w.scrollTop() >= ((d.height() - w.height()) - 100) && scope.collection.filterable.hasNextPage()) {
                  loading = true;
                  scope.collection.filterable.loadNextPage().then(function(){
                    loading = false;
                  });
                }
              }
            };
            var modalScrollCallback = function () {
              if(!loading &&
                 scope.collection &&
                 scope.collection.filterable &&
                 scope.collection.filterable.hasNextPage() &&
                 modalBody[0].scrollHeight > 0 &&
                 (modalBody[0].scrollHeight - modalBody.scrollTop() - modalBody[0].clientHeight < 2))
              {
                loading = true;
                scope.collection.filterable.loadNextPage().then(function(){
                  loading = false;
                });
              }
            };

            if(elm.parents('.modal').length){
              //filterable in modal
              var modalBody = elm.parents('.modal-body');

              // Register scroll callback
              modalBody.on('scroll', modalScrollCallback);

              // Deregister scroll callback if scope is destroyed
              scope.$on('$destroy', function () {
                modalBody.off('scroll', modalScrollCallback);
              });
            } else {
              //filterable in document
              var w = angular.element($window);
              var d = angular.element($document);

              // Register scroll callback
              w.on('scroll', scrollCallback);

              // Deregister scroll callback if scope is destroyed
              scope.$on('$destroy', function () {
                w.off('scroll', scrollCallback);
              });
            }
          };
        },
        controller: function ($scope) {
          var columns = $scope.columns = [];

          this.actionColumns = [];

          this.sort = function (property, order) {
            $scope.collection.filterable.setSortOrder(order + property);
            $scope.collection.fetch();
          };

          this.getSortOrder = function () {
            return $scope.collection.filterable.getSortOrder();
          };

          this.registerColumn = function (scope) {
            columns.push(scope);
          };

          this.getColumns = function() {
            return columns;
          };

          this.getCollection = function () {
            return $scope.collection;
          };

          this.isRadio = function(){
            if($scope.collection && $scope.collection.selectable){
              return $scope.collection.selectable.isRadio();
            }
            return false;
          };

        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHead
 * @element thead
 * @description
 *
 * Displays amount of items from filterable and the amount of selected items of the selectable
 *
 */

  .directive('mwListableHeadBb', function($compile) {
    return {
      require: '^mwListableBb',
      scope:{
        title:'@mwListableHeadBb',
        noCounter: '='
      },
      link: function(scope,el,attr,mwListable){
        scope.collection = mwListable.getCollection();

        if(angular.isUndefined(scope.noCounter)) {
          var tmpl = '<tr>' +
                  '<th colspan="20" class="listable-amount" ng-if="collection.filterable.getTotalAmount()">' +
                  '<span ng-if="collection.selectable.getSelectedModels().length > 0">{{collection.selectable.getSelectedModels().length}}/{{collection.filterable.getTotalAmount()}} {{title}} {{ \'common.selected\' | i18n }}</span>' +
                  '<span ng-if="!collection.selectable || collection.selectable.getSelectedModels().length < 1">{{collection.filterable.getTotalAmount()}} {{title}}</span>' +
                  '</th>' +
                  '</tr>',
              $tmpl = angular.element(tmpl),
              compiled = $compile($tmpl);

          el.prepend($tmpl);
          compiled(scope);
        }
      }
    };
  })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableFooter
 * @element tfoot
 * @description
 *
 * Displays footer with:
 * * loading spinner if list is loading
 * * 'none found' message if filterable is empty
 * * 'load more' button for pagination
 *
 */

    .directive('mwListableFooterBb', function(Loading) {
      return {
        require: '^mwListableBb',
        templateUrl: 'modules/ui/templates/mwListableBb/mwListableFooter.html',
        link: function(scope, elm, attr, mwListableCtrl) {
          scope.Loading = Loading;
          scope.collection = mwListableCtrl.getCollection();
          scope.columns = mwListableCtrl.getColumns();
        }
      };
    })


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeader
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} sort Property key of the model to sort by
 */
    .directive('mwListableHeaderBb', function () {
      return {
        restrict: 'A',
        require: '^mwListableBb',
        scope: {
          property: '@sort',
          blabla:'@'
        },
        transclude: true,
        replace:true,
        templateUrl: 'modules/ui/templates/mwListableBb/mwListableHeader.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          var ascending = '+',
              descending = '-';

          scope.toggleSortOrder = function () {
            if (scope.property) {
              var sortOrder = ascending; //default
              if (mwListableCtrl.getSortOrder() === ascending + scope.property) {
                sortOrder = descending;
              }
              mwListableCtrl.sort(scope.property, sortOrder);
            }
          };

          scope.isSelected = function (prefix) {
            if (prefix) {
              return mwListableCtrl.getSortOrder() === prefix + scope.property;
            } else {
              return (mwListableCtrl.getSortOrder() === '+' + scope.property || mwListableCtrl.getSortOrder() === '-' + scope.property);
            }
          };

          if(scope.property){
            elm.find('.title').on('click',scope.toggleSortOrder);
          }

          mwListableCtrl.registerColumn(scope);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableColumnCheckbox
 * @element th
 * @description
 *
 * Directive for table to add 'Select item' checkbox in content.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableColumnCheckboxBb', function () {
      return {
        restrict: 'A',
        require: '^mwListableBb',
        scope: {
          disabled: '=',
          item: '='
        },
        templateUrl: 'modules/ui/templates/mwListableBb/mwListableColumnCheckbox.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.radio = mwListableCtrl.isRadio();
          scope.click = function (item, $event) {
            $event.stopPropagation();
            if(item.selectable){
              item.selectable.toggleSelect();
            }
          };
        }
      };
    })


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeaderCheckbox
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header.
 *
 * @scope
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableHeaderCheckboxBb', function () {
      return {
        restrict: 'A',
        require: '^mwListableBb',
        scope: true,
        templateUrl: 'modules/ui/templates/mwListableBb/mwListableHeaderCheckbox.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.radio = mwListableCtrl.isRadio();
          scope.collection = mwListableCtrl.getCollection();
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableRow
 * @element tr
 * @description
 *
 * Directive for table row. Adds click actions. And class 'selected' if row is selected.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableBodyRowBb', function () {
      return {
        restrict: 'A',
        require: '^mwListableBb',
        compile: function (elm) {

          elm.prepend('<td  ng-if="item.selectable" mw-listable-column-checkbox-bb disabled="isDisabled()" item="item"></td>');

          return function (scope, elm, attr) {
            var selectedClass = 'selected';

            if(scope.item.selectable){
              elm.addClass('selectable');
            }

            elm.on('click', function () {
              if (scope.item.selectable && !scope.isDisabled(scope.item)) {
                scope.item.selectable.toggleSelect();
                scope.$apply();
              }
            });

            scope.$watch('item.selectable.isSelected()', function (value) {
              if(value) {
                elm.addClass(selectedClass);
              } else {
                elm.removeClass(selectedClass);
              }
            });

            scope.isDisabled = function () {
              return scope.$eval(attr.mwListableDisabled, { item: scope.item });
            };
          };
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableHeaderRow
 * @element tr
 * @description
 *
 * Directive for table header row. Adds mw-listable-header-checkbox if selectable is present and th tags for actionColumns.
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableHeaderRowBb', function () {
      return {
        restrict: 'A',
        require: '^mwListableBb',
        scope: true,
        compile: function (elm) {
          elm.prepend('<th ng-if="hasCollection" mw-listable-header-checkbox-bb width="1%"></th>');
          elm.append('<th ng-if="actionColumns.length > 0" colspan="{{ actionColumns.length }}" width="1%" class="action-button"></th>');

          return function (scope, elm, attr, mwListableCtrl) {
            //empty collection is [] so ng-if would not work as expected
            scope.hasCollection = false;
            var collection = mwListableCtrl.getCollection();
            if(collection){
              scope.hasCollection = angular.isDefined(collection.length);
            }
            scope.actionColumns = mwListableCtrl.actionColumns;
          };
        }
      };
    })


/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableLinkEdit
 * @element td
 * @description
 *
 * Directive to add a button link to edit a dataset.
 *
 * @param {string} mwListableLinkEdit URL as href
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableLinkEditBb', function () {
      return {
        restrict: 'A',
        require: '^mwListableBb',
        scope: {
          link: '@mwListableLinkEdit'
        },
        template: '<a ng-href="{{ link }}" class="btn btn-default btn-sm"><span mw-icon="pencil"></span></a>',
        link: function (scope, elm, attr, mwListableCtrl) {
          mwListableCtrl.actionColumns.push(null);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwListableLinkShow
 * @element td
 * @description
 *
 * Directive to add a button link to show a dataset.
 *
 * @param {string} mwListableLinkShow URL as href
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableLinkShowBb', function () {
      return {
        restrict: 'A',
        require: '^mwListableBb',
        scope: {
          link: '@mwListableLinkShowBb'
        },
        template: '<a ng-href="{{ link }}" class="btn btn-default btn-sm action-button"><span mw-icon="chevron-right"></span></a>',
        link: function (scope, elm, attr, mwListableCtrl) {
          mwListableCtrl.actionColumns.push(null);
        }
      };
    })

/**
 * @ngdoc directive
 * @name mwListable.directive:mwRowIdentifier
 * @description
 *
 * Directive that adds title attribute to th and td elements. Used to hide columns in css for special branding
 *
 * @param {string} mwRowIdentifier the title to be used
 *
 */
    .directive('mwRowIdentifierBb', function () {
      return {
        restrict: 'A',
        link: function (scope, elm, attr) {
          if(attr.mwRowIdentifier){
            attr.$set('title', attr.mwRowIdentifier);
          }
        }
      };
    })
;