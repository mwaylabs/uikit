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
    .directive('mwListable', function ($compile, $window, $document) {

      return {
        restrict: 'A',
        scope: {
          selectable: '=',
          filterable: '='
        },
        compile: function  (elm) {

          elm.append('<tfoot mw-listable-footer></tfoot>');

          return function (scope, elm) {
            elm.addClass('table table-striped mw-listable');

            /**
             * Infinite scrolling
             */
            var scrollCallback = function () {
              if(scope.filterable){
                if (w.scrollTop() >= (d.height() - w.height())*0.8) {
                  scope.filterable.loadMore();
                }
              }
            };
            var modalScrollCallback = function () {
              if(scope.filterable &&
                 modalBody[0].scrollHeight > 0 &&
                 (modalBody[0].scrollHeight - modalBody.scrollTop() - modalBody[0].clientHeight < 2)) {
                scope.filterable.loadMore();
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
            if($scope.filterable){
              $scope.filterable.setSortOrder(order + property);
            }
          };

          this.getSort = function () {
            if($scope.filterable){
              return $scope.filterable.sortOrder();
            }
          };

          this.registerColumn = function (scope) {
            columns.push(scope);
          };

          this.getColumns = function() {
            return columns;
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

          this.isRadio = function(){
            if($scope.selectable){
              return $scope.selectable.isRadio();
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

  .directive('mwListableHead', function($compile) {
    return {
      require: '^mwListable',
      scope:{
        title:'@mwListableHead'
      },
      link: function(scope,el,attr,mwListable){
        scope.filterable = mwListable.getFilterable();
        scope.selectable = mwListable.getSelectable();

        var tmpl = '<tr>' +
          '<th colspan="20" class="listable-amount" ng-if="filterable.total()">' +
            '<span ng-if="selectable.selected().length>0">{{selectable.selected().length}}/{{filterable.total()}} {{title}} {{ \'common.selected\' | i18n }}</span>' +
            '<span ng-if="!selectable || selectable.selected().length<1">{{filterable.total()}} {{title}}</span>' +
          '</th>' +
        '</tr>',
        $tmpl = angular.element(tmpl),
        compiled = $compile($tmpl);

        el.prepend($tmpl);
        compiled(scope);
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

    .directive('mwListableFooter', function(Loading) {
      return {
        require: '^mwListable',
        templateUrl: 'uikit/templates/mwListable/mwListableFooter.html',
        link: function(scope, elm, attr, mwListableCtrl) {
          scope.Loading = Loading;
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
    .directive('mwListableHeader', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          property: '@sort',
          width:'@',
          sortActive:'='
        },
        transclude: true,
        replace:true,
        templateUrl: 'uikit/templates/mwListable/mwListableHeader.html',
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
            if(prefix){
              return mwListableCtrl.getSort() === prefix + scope.property;
            } else {
              return (mwListableCtrl.getSort() === '+' + scope.property || mwListableCtrl.getSort() === '-' + scope.property);
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
    .directive('mwListableColumnCheckbox', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          mwDisabled: '=',
          item: '='
        },
        templateUrl: 'uikit/templates/mwListable/mwListableColumnCheckbox.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.selectable = mwListableCtrl.getSelectable();
          scope.radio = mwListableCtrl.isRadio();
          scope.click = function (item, $event) {
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
 *
 * @scope
 *
 * Note: this directive has to be nested inside an `mwListable` table.
 */
    .directive('mwListableHeaderCheckbox', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: true,
        templateUrl: 'uikit/templates/mwListable/mwListableHeaderCheckbox.html',
        link: function (scope, elm, attr, mwListableCtrl) {
          scope.radio = mwListableCtrl.isRadio();
          scope.filterable = mwListableCtrl.getFilterable();
          scope.selectable = mwListableCtrl.getSelectable();
          scope.toggleAll = mwListableCtrl.toggleAll;
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
    .directive('mwListableBodyRow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        compile: function (elm) {

          elm.prepend('<td ng-if="selectable" mw-listable-column-checkbox mw-disabled="isDisabled()" item="item"></td>');

          return function (scope, elm, attr) {
            var selectedClass = 'selected';
            if(scope.selectable){
              elm.addClass('selectable');
            }

            elm.on('click', function () {
              if (scope.selectable && !scope.isDisabled(scope.item)) {
                scope.selectable.toggle(scope.item);
                scope.$apply();
              }
            });

            scope.$watch('selectable.isSelected(item)', function (value) {
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
    .directive('mwListableHeaderRow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: true,
        compile: function (elm) {
          elm.prepend('<th ng-if="selectable" mw-listable-header-checkbox width="1%"></th>');
          elm.append('<th ng-if="actionColumns.length > 0" colspan="{{ actionColumns.length }}" width="1%" class="action-button"></th>');

          return function (scope, elm, attr, mwListableCtrl) {
            scope.selectable = mwListableCtrl.getSelectable();
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
    .directive('mwListableLinkEdit', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          link: '@mwListableLinkEdit'
        },
        template: '<a ng-href="{{ link }}" class="btn btn-default btn-sm"><span mw-icon="rln-icon edit"></span></a>',
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
    .directive('mwListableLinkShow', function () {
      return {
        restrict: 'A',
        require: '^mwListable',
        scope: {
          link: '@mwListableLinkShow'
        },
        template: '<span mw-link-show="{{link}}"></span>',
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
    .directive('mwRowIdentifier', function () {
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