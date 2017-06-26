angular.module('mwUI.List')

// TODO:  rename to something else
// TODO: extract functionalities into smaller directives
  .directive('mwListableHead2', function ($window, $document, i18n) {
    return {
      scope: {
        collection: '=',
        mwListCollection: '=',
        affix: '=',
        affixOffset: '=',
        collectionName: '@',
        nameFn: '&',
        nameAttribute: '@',
        localizeName: '@',
        nameI18nPrefix: '@',
        nameI18nSuffix: '@',
        searchAttribute: '@'
      },
      transclude: true,
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_head.html',
      link: function (scope, el, attrs, ctrl, $transclude) {
        var scrollEl,
          bodyEl = angular.element('body'),
          modalEl = el.parents('*[mw-modal-body]'),
          mwHeaderEl = angular.element('*[mw-header]'),
          canShowSelected = false,
          _affix = angular.isDefined(scope.affix) ? scope.affix : true,
          windowEl = angular.element($window),
          collection;

        scope.selectable = false;
        scope.selectedAmount = 0;
        scope.collectionName = scope.collectionName || i18n.get('List.mwListHead.items');
        scope.isModal = modalEl.length > 0;
        scope.isLoadingModelsNotInCollection = false;
        scope.hasFetchedModelsNotInCollection = false;
        scope.isLoadingModelsNotInCollection = false;
        scope.hasFetchedModelsNotInCollection = false;

        var newOffset;

        var throttledScrollFn = _.throttle(function () {
          if (!el.is(':visible')) {
            return;
          }

          if (!newOffset) {
            var headerOffset,
              headerHeight,
              headerBottomOffset,
              listHeaderOffset,
              spacer;

            if (scope.isModal) {
              var modalHeaderEl = el.parents('.modal-content').find('.modal-header');
              headerOffset = modalHeaderEl.offset().top;
              headerHeight = modalHeaderEl.innerHeight();
              spacer = 0;
            } else if (mwHeaderEl.length) {
              headerOffset = mwHeaderEl.last().offset().top;
              headerHeight = mwHeaderEl.last().innerHeight();
              spacer = 5;
            } else {
              return;
            }

            headerBottomOffset = headerOffset + headerHeight;
            listHeaderOffset = el.offset().top;

            newOffset = listHeaderOffset - headerBottomOffset - spacer;
          }

          var scrollTop = scrollEl.scrollTop();

          if (scrollTop > newOffset && _affix) {
            el.find('.mw-listable-header').css('top', scrollTop - newOffset);
            el.addClass('affixed');
          } else if (!_affix) {
            scrollEl.off('scroll', throttledScrollFn);
          } else {
            el.find('.mw-listable-header').css('top', 'initial');
            el.removeClass('affixed');
          }

        }, 10);

        var throttledRecalculate = _.throttle(function () {
          el.find('.mw-listable-header').css('top', 'initial');
          newOffset = null;
        });

        var loadItemsNotInCollection = function () {
          if (scope.hasFetchedModelsNotInCollection) {
            return;
          }
          var selectedNotInCollection = [];
          scope.selectable.getSelected().each(function (model) {
            if (!model.selectable.isInCollection && !scope.getModelAttribute(model)) {
              selectedNotInCollection.push(model);
            }
          });

          if (selectedNotInCollection.length === 0) {
            return;
          }

          var Collection = collection.constructor.extend({
            filterableOptions: function () {
              return {
                filterDefinition: function () {
                  var filter = new window.mCAP.Filter(),
                    filters = [];

                  selectedNotInCollection.forEach(function (model) {
                    if (model.id) {
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
          collection.url = collection.url();

          scope.isLoadingModelsNotInCollection = true;

          collection.fetch().then(function (collection) {
            scope.hasFetchedModelsNotInCollection = true;
            var selected = scope.selectable.getSelected();
            collection.each(function (model) {
              selected.get(model.id).set(model.toJSON());
            });

            var deletedUuids = _.difference(_.pluck(selectedNotInCollection, 'id'), collection.pluck('uuid'));

            deletedUuids.forEach(function (id) {
              selected.get(id).selectable.isDeletedItem = true;
            });

            scope.isLoadingModelsNotInCollection = false;
          });
        };

        scope.getCollection = function () {
          return collection;
        };

        scope.showSelected = function () {
          canShowSelected = true;
          loadItemsNotInCollection();
          setTimeout(function () {
            var height;
            if (scope.isModal) {
              height = modalEl.height() + (modalEl.offset().top - el.find('.selected-items').offset().top) + 25;
              modalEl.css('overflow', 'hidden');
            } else {
              height = angular.element($window).height() - el.find('.selected-items').offset().top + scrollEl.scrollTop() - 25;
              bodyEl.css('overflow', 'hidden');
            }

            el.find('.selected-items').css('height', height);
            el.find('.selected-items').css('bottom', height * -1);
          });
        };

        scope.hideSelected = function () {
          if (scope.isModal) {
            modalEl.css('overflow', 'auto');
          } else {
            bodyEl.css('overflow', 'inherit');
          }
          canShowSelected = false;
        };

        scope.canShowSelected = function () {
          return scope.selectable && canShowSelected && scope.selectedAmount > 0;
        };

        scope.unSelect = function (model) {
          model.selectable.unSelect();
        };

        scope.toggleSelectAll = function () {
          scope.selectable.toggleSelectAll();
        };

        scope.getTotalAmount = function () {
          if (collection.filterable && collection.filterable.getTotalAmount()) {
            return collection.filterable.getTotalAmount();
          } else {
            return collection.length;
          }
        };

        scope.toggleShowSelected = function () {
          if (canShowSelected) {
            scope.hideSelected();
          } else {
            scope.showSelected();
          }
        };

        scope.getModelAttribute = function (model) {
          if (scope.nameAttribute) {
            var modelAttr = model.get(scope.nameAttribute);

            if (scope.nameI18nPrefix || scope.nameI18nSuffix) {
              var i18nPrefix = scope.nameI18nPrefix || '',
                i18nSuffix = scope.nameI18nSuffix || '';

              return i18n.get(i18nPrefix + '.' + modelAttr + '.' + i18nSuffix);
            } else if (angular.isDefined(scope.localizeName)) {
              return i18n.localize(modelAttr);
            } else {
              return modelAttr;
            }
          } else {
            return scope.nameFn({item: model});
          }
        };

        var init = function () {
          scope.selectable = collection.selectable;
          if (scope.isModal) {
            //element in modal
            scrollEl = modalEl;
          }
          else {
            //element in window
            scrollEl = windowEl;
          }

          // Register scroll callback
          scrollEl.on('scroll', throttledScrollFn);

          scrollEl.on('resize', throttledRecalculate);

          // Deregister scroll callback if scope is destroyed
          scope.$on('$destroy', function () {
            scrollEl.off('scroll', throttledScrollFn);
          });

          scope.$on('$destroy', function () {
            scrollEl.off('resize', throttledRecalculate);
          });

          el.on('focus', 'input[type=text]', function () {
            el.find('.search-bar').addClass('focused');
          });

          el.on('blur', 'input[type=text]', function () {
            el.find('.search-bar').removeClass('focused');
          });
        };

        $transclude(function (clone) {
          if (clone && clone.length > 0) {
            el.addClass('has-extra-content');
          }
        });

        scope.$watch(function () {
          if (scope.selectable) {
            return scope.selectable.getSelected().length;
          } else {
            return 0;
          }
        }, function (val) {
          scope.selectedAmount = val;
          if (val < 1) {
            scope.hideSelected();
          }
        });

        if (scope.mwListCollection) {
          collection = scope.mwListCollection.getCollection();
        } else if (scope.collection) {
          collection = scope.collection;
        } else {
          throw new Error('[mwListableHead2] Either a collection or a mwListCollection has to be passed as attribute');
        }
        init();
      }
    };
  });