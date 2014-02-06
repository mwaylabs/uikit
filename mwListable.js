'use strict';

angular.module('mwListable', [])

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
 * @param {string} filterable Instance of filterable for this listable item. Needed for pagination
 * @example
 * <doc:example>
 *   <doc:source>
 *    <table mw-listable
 *           selectable="selectable"
 *           filterable="filterable">
 *      <thead>
 *        <tr>
 *          <th mw-listable-header
 *          title="A column"></th>
 *        </tr>
 *      </thead>
 *      <tbody>
 *        <tr ng-repeat="item in filterable.items()">
 *          <td mw-listable-column-checkbox
 *              item="item"></td>
 *          <td>Column content</td>
 *        </tr>
 *      </tbody>
 *      <tfoot>
 *        <tr id="listableFooter"></tr>
 *      </tfoot>
 *    </table>
 *   </doc:source>
 * </doc:example>
 */
    .directive('mwListable', function ($compile, $window, $document) {

      return {
        restrict: 'A',
        scope: {
          selectable: '=',
          filterable: '='
        },
        link: function (scope, elm) {



          var _footer = elm.find('tr#listableFooter');

          var compileFooterNoneFound = function () {
            _footer.prepend(
                '<td ng-if="filterable.items().length < 1"' +
                    'colspan="{{ columns.length + 1 }}" class="text-center">' +
                    '<p class="lead">{{ \'common.noneFound\' | i18n }}</p>' +
                    '</td>');
            $compile(_footer)(scope);
          };

          var compileFooterLoadMore = function () {
            _footer.append(
                '<td ng-if="filterable.items().length < filterable.total()"' +
                    'colspan="{{ columns.length + 1 }}">' +
                    '<button class="btn btn-default btn-lg col-md-12" ng-click="filterable.loadMore()">' +
                    '{{ \'common.loadMore\' | i18n }}' +
                    '</button>' +
                    '</td>');
            $compile(_footer)(scope);
          };


          elm.addClass('table table-striped mw-listable');

          /**
           * Compile fragments of header and footer into template
           * This has to be done this way since td/tr elements cannot be inserted via directive
           *
           * The basic problem behind this approach is documented here:
           * https://github.com/angular/angular.js/issues/1459
           */
          compileFooterNoneFound();
          compileFooterLoadMore();

          /**
           * Infinite scrolling
           */
          var w = angular.element($window);
          var d = angular.element($document);
          var scrollCallback = function () {
            if (w.scrollTop() === d.height() - w.height()) {
              if (scope.filterable) {
                scope.filterable.loadMore();
              }
            }
          };
          // Register scroll callback
          w.on('scroll', scrollCallback);

          // Deregister scroll callback if scope is destroyed
          scope.$on('$destroy', function() {
            w.off('scroll', scrollCallback);
          });
        },
        controller: function ($scope) {
          var columns = $scope.columns = [];

          this.sort = function (property, order) {
            $scope.filterable.setSortOrder(order + property);
          };

          this.getSort = function () {
            return $scope.filterable.sortOrder();
          };

          this.registerColumn = function (scope) {
            columns.push(scope);
          };

          this.getFilterable = function () {
            return $scope.filterable;
          };

          this.getSelectable = function () {
            return $scope.selectable;
          };

          this.toggleAll = function () {
            if ($scope.selectable.allSelected()) {
              $scope.selectable.unselectAll();
            } else {
              $scope.selectable.selectAll();
            }
          };
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
 * @param {string} title Title of the table header
 * @param {string} sort Property key of the model to sort by
 */
    .directive('mwListableHeader', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          title: '@',
          property: '@sort'
        },
        template: '<th ng-click="toggleSortOrder()" ng-class="{ clickable: property }" width="1%">' +
            '<span ng-if="property">' +
            '<i ng-if="isSelected(\'-\')" mw-icon="sort-by-attributes-alt"></i>' +
            '<i ng-if="isSelected(\'+\')" mw-icon="sort-by-attributes" ></i>' +
            '</span>' +
            '<span> {{ title }}</span>' +
            '</th>',
        link: function (scope, elm, attr, mwListableCtrl) {
          var ascending = '+',
              descending = '-';

          scope.toggleSortOrder = function () {
            if (scope.property) {
              var sortOrder = ascending; //default
              if (mwListableCtrl.getSort() === ascending + scope.property) {
                sortOrder = descending;
              }
              mwListableCtrl.sort(scope.property, sortOrder);
            }
          };

          scope.isSelected = function (prefix) {
            return mwListableCtrl.getSort() === prefix + scope.property;
          };

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
 */
    .directive('mwListableColumnCheckbox', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          disabled: '=',
          item: '='
        },
        template: '<input type="checkbox" ' +
            'ng-click="click(item, $event)" ' +
            'ng-disabled="{{ disabled || false }}"' +
            'ng-checked="selectable.isSelected(item)"' +
            'mw-custom-checkbox>',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.selectable = mwListableCtrl.getSelectable();
          scope.click = function(item, $event) {
            $event.stopPropagation();
            scope.selectable.toggle(item);
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
 */
    .directive('mwListableHeaderCheckbox', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: true,
        template: '<input type="checkbox" ' +
            'ng-if="!filterable || filterable.items().length > 0"' +
            'ng-click="toggleAll()" ' +
            'ng-checked="selectable.allSelected()"' +
            'mw-custom-checkbox>',
        link: function (scope, elm, attr, mwListableCtrl) {

          scope.filterable = mwListableCtrl.getFilterable();
          scope.selectable = mwListableCtrl.getSelectable();
          scope.toggleAll = mwListableCtrl.toggleAll;
        }
      };
    });