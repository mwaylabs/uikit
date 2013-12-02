angular.module('Relution.UI')

/**
 * @ngdoc directive
 * @name Relution.Common.directive:rlnListable
 * @element table
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} selectable Instance of selectable for this listable item
 * @param {string} filterable Instance of filterable for this listable item. Needed for pagination
 */
    .directive('rlnListable', function ($compile, $window, $document) {
      var _element,
          _scope,
          _header,
          _footer;

      var compileHeaderCheckbox = function () {
        _header.prepend(
            '<th>' +
                '<input type="checkbox" ng-click="toggleAll()" ng-checked="selectable.allSelected()" />' +
                '</th>');
        $compile(_header)(_scope);
      };

      var compileFooterNoneFound = function () {
        _footer.prepend(
            '<td ng-if="filterable.items().length < 1"' +
                'colspan="{{ columns.length + 1 }}" class="text-center">' +
                '<p class="lead">{{ \'common.noneFound\' | i18n }}</p>' +
                '</td>');
        $compile(_footer)(_scope);
      };

      var compileFooterLoadMore = function () {
        _footer.append(
            '<td ng-if="filterable.items().length < filterable.total()"' +
                'colspan="{{ columns.length + 1 }}">' +
                '<button class="btn btn-lg col-md-12" ng-click="filterable.loadMore()">' +
                '{{ \'common.loadMore\' | i18n }}' +
                '</button>' +
                '</td>');
        $compile(_footer)(_scope);
      };

      return {
        restrict: 'A',
        scope: {
          selectable: '=',
          filterable: '='
        },
        link: function (scope, elm) {
          _element = elm;
          _scope = scope;
          _header = elm.find('thead tr');
          _footer = elm.find('tr#listableFooter');


          _element.addClass('table table-striped relution');

          /**
           * Compile fragments of header and footer into template
           * This has to be done this way since td/tr elements cannot be inserted via directive
           *
           * The basic problem behind this approach is documented here:
           * https://github.com/angular/angular.js/issues/1459
           */
          compileHeaderCheckbox();
          compileFooterNoneFound();
          compileFooterLoadMore();

          scope.toggleAll = function () {
            if (scope.selectable.allSelected()) {
              scope.selectable.unselectAll();
            } else {
              scope.selectable.selectAll();
            }
          };

          /**
           * Infinite scrolling
           */
          var w = angular.element($window);
          var d = angular.element($document);
          w.scroll(function () {
            if (w.scrollTop() === d.height() - w.height()) {
              scope.filterable.loadMore();
            }
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
        }
      };
    })


/**
 * @ngdoc directive
 * @name Relution.Common.directive:rlnListableHeader
 * @element th
 * @description
 *
 * Directive for table to add 'Select all' checkbox in header and content related displays like 'None found'
 * or pagination logic. Use this directive when you want to display items in a list without any hassle.
 *
 * @param {string} title Title of the table header
 * @param {string} sort Property key of the model to sort by
 */
    .directive('rlnListableHeader', function () {
      return {
        restrict: 'A',
        require: '^rlnListable',
        scope: {
          title: '@',
          property: '@sort'
        },
        template: '<th ng-click="toggleSortOrder()" ng-class="{ clickable: property }">' +
            '<span ng-if="property">' +
            '<i ng-if="isSelected(\'-\')" rln-icon="sort-by-attributes-alt"></i>' +
            '<i ng-if="isSelected(\'+\')" rln-icon="sort-by-attributes" ></i>' +
            '</span>' +
            ' {{ title }}' +
            '</th>',
        link: function (scope, elm, attr, rlnListableCtrl) {
          var ascending = '+',
              descending = '-';

          scope.toggleSortOrder = function () {
            if (scope.property) {
              var sortOrder = ascending; //default
              if (rlnListableCtrl.getSort() === ascending + scope.property) {
                sortOrder = descending;
              }
              rlnListableCtrl.sort(scope.property, sortOrder);
            }
          };

          scope.isSelected = function(prefix) {
            return rlnListableCtrl.getSort() === prefix + scope.property;
          };

          rlnListableCtrl.registerColumn(scope);
        }
      }
          ;
    })


    .
    directive('rlnListableColumnCheckbox', function () {
      return {
        restrict: 'A',
        template: '<input type="checkbox" ' +
            'ng-click="selectable.toggle(item)" ' +
            'ng-checked="selectable.isSelected(item)">'
      };
    });