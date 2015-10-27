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
  .directive('mwListableBb', function () {

    return {
      restrict: 'A',
      scope: {
        collection: '=',
        mwListCollection: '='
      },
      compile: function (elm) {
        elm.append('<tfoot mw-listable-footer-bb></tfoot>');

        return function (scope, elm) {
          elm.addClass('table table-striped mw-listable');
        };
      },
      controller: function ($scope) {
        var _columns = $scope.columns = [],
            _collection = null,
            _mwListCollectionFilter = null;

        this.actionColumns = [];

        this.sort = function (property, order) {
          var sortOrder = order + property;
          _collection.filterable.setSortOrder(sortOrder);
          _collection.fetch();

          if(_mwListCollectionFilter){
            _mwListCollectionFilter.applySortOrder({
              property: property,
              order: order
            });
          }

        };

        this.getSortOrder = function () {
          return _collection.filterable.getSortOrder();
        };

        this.registerColumn = function (scope) {
          _columns.push(scope);
        };

        this.unRegisterColumn = function (scope) {
          if (scope && scope.$id) {
            var scopeInArray = _.findWhere(_columns, {$id: scope.$id}),
              indexOfScope = _.indexOf(_columns, scopeInArray);

            if (indexOfScope > -1) {
              _columns.splice(indexOfScope, 1);
            }
          }
        };

        this.getColumns = function () {
          return _columns;
        };

        this.getCollection = function () {
          return _collection;
        };

        this.isSingleSelection = function () {
          if (_collection && _collection.selectable) {
            return _collection.selectable.isSingleSelection();
          }
          return false;
        };

        $scope.$on('$destroy', function () {
          this.actionColumns = [];
        }.bind(this));

        if($scope.mwListCollection){
          _collection = $scope.mwListCollection.getCollection();
          _mwListCollectionFilter = $scope.mwListCollection.getMwListCollectionFilter();
        } else if($scope.collection){
          console.warn('The scope attribute collection is deprecated please use the mwCollection instead');
          _collection = $scope.collection;
        }
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

  .directive('mwListableHeadBb', function ($compile) {
    return {
      require: '^mwListableBb',
      scope: {
        title: '@mwListableHeadBb',
        noCounter: '='
      },
      link: function (scope, el, attr, mwListable) {
        scope.collection = mwListable.getCollection();

        if (angular.isUndefined(scope.noCounter)) {
          var tmpl = '<tr>' +
              '<th colspan="20" class="listable-amount" ng-if="collection.filterable.getTotalAmount()">' +
              '<span ng-if="collection.selectable.getSelected().length > 0">{{collection.selectable.getSelected().length}}/{{collection.filterable.getTotalAmount() || collection.length}} {{title}} {{ \'common.selected\' | i18n }}</span>' +
              '<span ng-if="!collection.selectable || collection.selectable.getSelected().length<1">{{collection.filterable.getTotalAmount() || collection.length}} {{title}}</span>' +
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

  .directive('mwListableFooterBb', function (Loading) {
    return {
      require: '^mwListableBb',
      templateUrl: 'uikit/templates/mwListableBb/mwListableFooter.html',
      link: function (scope, elm, attr, mwListableCtrl) {
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
        property: '@sort'
      },
      transclude: true,
      replace: true,
      templateUrl: 'uikit/templates/mwListableBb/mwListableHeader.html',
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

        if (scope.property) {
          elm.find('.title').on('click', scope.toggleSortOrder);
        }

        mwListableCtrl.registerColumn(scope);

        scope.$on('$destroy', function () {
          mwListableCtrl.unRegisterColumn(scope);
        });
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
        item: '='
      },
      templateUrl: 'uikit/templates/mwListableBb/mwListableColumnCheckbox.html',
      link: function (scope, elm, attr, mwListableCtrl) {
        scope.isSingleSelection = mwListableCtrl.isSingleSelection();
        scope.click = function (item, $event) {
          $event.stopPropagation();
          if (item.selectable) {
            item.selectable.toggleSelect();
          }
        };

        scope.$watch('item.selectable.isDisabled()', function (isDisabled) {
          if (isDisabled) {
            scope.item.selectable.unSelect();
          }
        });
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
      templateUrl: 'uikit/templates/mwListableBb/mwListableHeaderCheckbox.html',
      link: function (scope, elm, attr, mwListableCtrl) {
        scope.isSingleSelection = mwListableCtrl.isSingleSelection();
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
  .directive('mwListableBodyRowBb', function ($timeout) {
    return {
      restrict: 'A',
      require: '^mwListableBb',
      compile: function (elm) {

        elm.prepend('<td  ng-if="collection.selectable && item.selectable" mw-listable-column-checkbox-bb item="item"></td>');

        return function (scope, elm, attr, ctrl) {
          var selectedClass = 'selected';

          scope.collection = ctrl.getCollection();

          if (!scope.item) {
            throw new Error('No item available in the list! Please make sure to use ng-repeat="item in collection"');
          }

          if (scope.item && scope.item.selectable && !scope.item.selectable.isDisabled()) {
            elm.addClass('selectable clickable');
          } else if (ctrl.actionColumns && ctrl.actionColumns.length > 0) {
            elm.addClass('clickable');
          }

          elm.on('click', function () {
            if (scope.item && scope.item.selectable && !scope.item.selectable.isDisabled()) {
              $timeout(function () {
                scope.item.selectable.toggleSelect();
              });
            }
          });

          elm.on('dblclick', function () {
            if (ctrl.actionColumns && angular.isNumber(scope.$index) && ctrl.actionColumns[scope.$index]) {
              document.location.href = ctrl.actionColumns[scope.$index];
            }
          });

          scope.$watch('item.selectable.isSelected()', function (value) {
            if (value) {
              elm.addClass(selectedClass);
            } else {
              elm.removeClass(selectedClass);
            }
          });
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
        elm.prepend('<th ng-if="hasCollection" width="1%"></th>');
        elm.append('<th ng-if="actionColumns.length > 0" colspan="{{ actionColumns.length }}" width="1%" class="action-button"></th>');

        return function (scope, elm, attr, mwListableCtrl) {
          //empty collection is [] so ng-if would not work as expected
          //we also have to check if the collection has a selectable
          scope.hasCollection = false;
          var collection = mwListableCtrl.getCollection();
          if (collection) {
            scope.hasCollection = angular.isDefined(collection.length) && collection.selectable;
          }
          scope.actionColumns = mwListableCtrl.actionColumns;
        };
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
      template: '<span mw-link-show="{{link}}"></span>',
      link: function (scope, elm, attr, mwListableCtrl) {
        mwListableCtrl.actionColumns.push(scope.link);
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
        if (attr.mwRowIdentifier) {
          attr.$set('title', attr.mwRowIdentifier);
        }
      }
    };
  })

  .directive('mwListableHead2', function ($window, i18n, MCAPCollection) {
    return {
      scope: {
        collection: '=',
        affix: '=',
        affixOffset: '=',
        collectionName: '@',
        nameFn: '&',
        nameAttribute: '@',
        localizeName: '@',
        nameI18nPrefix: '@',
        nameI18nSuffix: '@'
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwListableBb/mwListableHead.html',
      link: function (scope, el, attrs, ctrl, $transclude) {
        var scrollEl,
          bodyEl = angular.element('body'),
          modalEl = el.parents('.modal .modal-body'),
          lastScrollYPos = 0,
          canShowSelected = false,
          _affix = angular.isDefined(scope.affix)?scope.affix:true,
          affixOffset = scope.affixOffset,
          isSticked = false;

        scope.selectable = false;
        scope.selectedAmount = 0;
        scope.collectionName = scope.collectionName || i18n.get('common.items');
        scope.isModal = modalEl.length>0;
        scope.isLoadingModelsNotInCollection = false;
        scope.hasFetchedModelsNotInCollection = false;
        scope.isLoadingModelsNotInCollection = false;
        scope.hasFetchedModelsNotInCollection = false;

        var throttledScrollFn = _.throttle(function () {

          var currentScrollPos = scrollEl.scrollTop();

          if (currentScrollPos > affixOffset && _affix) {
            if (currentScrollPos < lastScrollYPos) {
              var newTopVal = currentScrollPos - affixOffset;
              newTopVal = newTopVal<0?0:newTopVal;
              el.css('top', newTopVal);
              el.css('opacity', 1);
              isSticked = true;
            } else {
              el.css('opacity', 0);
              el.css('top', 0);
              isSticked = false;
            }
          } else {
            el.css('top', 0);
            el.css('opacity', 1);
            isSticked = false;
          }

          lastScrollYPos = currentScrollPos;
        },10);

        var loadItemsNotInCollection = function(){
          if(scope.hasFetchedModelsNotInCollection){
            return;
          }
          var selectedNotInCollection = [];
          scope.selectable.getSelected().each(function(model){
            if(!model.selectable.isInCollection && !scope.getModelAttribute(model)){
              selectedNotInCollection.push(model);
            }
          });

          if(selectedNotInCollection.length === 0){
            return;
          }

          var Collection = scope.collection.constructor.extend({
            filterableOptions: function(){
              return {
                filterDefinition: function () {
                  var filter = new window.mCAP.Filter(),
                    filters = [];

                  selectedNotInCollection.forEach(function(model){
                    if(model.id){
                      filters.push(
                        filter.string(model.idAttribute, model.id)
                      );
                    }
                  });

                  return filter.or(filters);
                }
              };
            }
          });
          var collection = new Collection();
          collection.url = scope.collection.url();

          scope.isLoadingModelsNotInCollection = true;

          collection.fetch().then(function(collection){
            scope.hasFetchedModelsNotInCollection = true;
            var selected = scope.selectable.getSelected();
            collection.each(function(model){
              selected.get(model.id).set(model.toJSON());
            });

            var deletedUuids = _.difference(_.pluck(selectedNotInCollection,'id'), collection.pluck('uuid'));

            deletedUuids.forEach(function(id){
              selected.get(id).selectable.isDeletedItem = true;
            });

            scope.isLoadingModelsNotInCollection = false;
          });
        };

        scope.showSelected = function(){
          canShowSelected = true;
          loadItemsNotInCollection();
          setTimeout(function(){
            var height;
            if(scope.isModal){
              height = modalEl.height() + (modalEl.offset().top - el.find('.selected-items').offset().top) + 25;
              modalEl.css('overflow', 'hidden');
            } else {
              height = angular.element($window).height()-el.find('.selected-items').offset().top + scrollEl.scrollTop() - 25;
              bodyEl.css('overflow', 'hidden');
            }

            el.find('.selected-items').css('height',height);
            el.find('.selected-items').css('bottom',height*-1);
          });
        };

        scope.hideSelected = function(){
          if(scope.isModal){
            modalEl.css('overflow', 'auto');
          } else {
            bodyEl.css('overflow', 'inherit');
          }
          canShowSelected = false;
        };

        scope.canShowSelected = function(){
          return scope.selectable && canShowSelected && scope.selectedAmount>0;
        };

        scope.unSelect = function(model){
          model.selectable.unSelect();
        };

        scope.toggleSelectAll = function(){
          scope.selectable.toggleSelectAll();
        };

        scope.getTotalAmount = function(){
          if(scope.collection.filterable && scope.collection.filterable.getTotalAmount()){
            return scope.collection.filterable.getTotalAmount();
          } else {
            return scope.collection.length;
          }
        };

        scope.toggleShowSelected = function(){
          if( canShowSelected ){
            scope.hideSelected();
          } else {
            scope.showSelected();
          }
        };

        scope.getModelAttribute = function(model){
          if(scope.nameAttribute){
            var modelAttr = model.get(scope.nameAttribute);

            if(scope.nameI18nPrefix || scope.nameI18nSuffix){
              var i18nPrefix = scope.nameI18nPrefix || '',
                  i18nSuffix = scope.nameI18nSuffix || '';

              return i18n.get(i18nPrefix + '.' + modelAttr + '.' + i18nSuffix);
            } else if(angular.isDefined(scope.localizeName)){
              return i18n.localize(modelAttr);
            } else {
              return modelAttr;
            }
          } else {
            return scope.nameFn({item: model});
          }
        };

        var init = function(){
          scope.selectable = scope.collection.selectable;
          if (scope.isModal) {
            //element in modal
            scrollEl = modalEl;
          }
          else {
            //element in window
            scrollEl = angular.element($window);
          }

          if(!affixOffset){
            if(scope.isModal){
              affixOffset = 73;
            } else {
              affixOffset = 35;
            }
          }

          // Register scroll callback
          scrollEl.on('scroll', throttledScrollFn);

          // Deregister scroll callback if scope is destroyed
          scope.$on('$destroy', function () {
            scrollEl.off('scroll', throttledScrollFn);
          });

        };

        $transclude(function (clone) {
          if (clone && clone.length > 0) {
            el.addClass('has-extra-content');
          }
        });

        scope.$watch(function(){
          if(scope.selectable){
            return scope.selectable.getSelected().length;
          } else {
            return 0;
          }
        }, function(val){
          scope.selectedAmount = val;
          if(val < 1){
            scope.hideSelected();
          }
        });

        scope.$watch('collection', function(collection){
          if(collection && collection instanceof MCAPCollection){
            init();
          }
        });
      }
    };
  })
;
