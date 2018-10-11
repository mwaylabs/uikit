angular.module('mwUI.Inputs')

  .directive('mwAutocomplete', function ($q, $timeout, i18n) {
    return {
      scope: {
        mwModel: '=',
        mwModelAttr: '@',
        mwModelLabelKey: '@',
        mwSearchProperty: '@',
        mwOptionsCollection: '=',
        mwOptionsKey: '@',
        mwOptionsLabelKey: '@',
        mwOptionsLabelI18nPrefix: '@?',
        mwMinSearchLength: '=?',
        mwPlaceholder: '@?',
        mwRequired: '=?',
        mwDisabled: '=?'
      },
      replace: true,
      templateUrl: 'uikit/mw-inputs/directives/templates/mw_autocomplete.html',
      link: function (scope, el) {
        var orgInputPadding = el.find('input').css('padding-left');

        scope.viewModel = {
          searchVal: '',
          isSearching: false,
          searchActive: false
        };

        var scrollToSelected = function (toBottom) {
          var selected = scope.mwOptionsCollection.selectable.getSelected().first();
          if (selected) {
            var selectedEl = el.find('#' + selected.cid),
              scrollContainerEl = el.find('.auto-complete-holder');

            if (selectedEl.length) {
              var selectedElOffset = selectedEl.offset().top,
                selectedElHeight = selectedEl.outerHeight(true),
                scrollContainerElOffset = scrollContainerEl.offset().top,
                scrollContainerHeight = scrollContainerEl.height(),
                scrollContainerScroll = scrollContainerEl.scrollTop();

              var selY = selectedEl[0].getBoundingClientRect().y,
                scrollConY = scrollContainerEl[0].getBoundingClientRect().y;

              if (selY + selectedElHeight <= scrollConY || selY >= scrollConY + scrollContainerHeight) {
                if (toBottom) {
                  scrollContainerEl.scrollTop(((selectedElOffset - scrollContainerElOffset) - scrollContainerHeight + scrollContainerScroll) + selectedElHeight);
                } else {
                  scrollContainerEl.scrollTop(((selectedElOffset - scrollContainerElOffset) + scrollContainerScroll));
                }
              }
            }
          }
        };

        var setInputPadding = function () {
          $timeout(function () {
            if (scope.getSelectedModelLabel()) {
              el.find('input').css('padding-left', el.find('.selected-item').outerWidth(true) + 15);
              el.find('.auto-complete-text').css('padding-left', el.find('.selected-item').outerWidth(true) + 3);
            } else {
              el.find('input').css('padding-left', orgInputPadding);
              el.find('.auto-complete-text').css('padding-left', 0);
            }
          });
        };

        var setFilterVal = function (val) {
          var filter = {};
          filter[scope.mwSearchProperty] = val;
          scope.mwOptionsCollection.filterable.setFilters(filter);
        };

        var setResult = function (item) {
          scope.viewModel.searchVal = '';
          scope.viewModel.searchActive = false;

          if (scope.mwModelAttr) {
            scope.mwModel.set(scope.mwModelAttr, item.get(scope.mwOptionsKey));
          } else {
            scope.mwModel.set(item.toJSON());
          }
        };

        var unsetResult = function () {
          if (scope.getSelectedModelLabel()) {
            if (scope.mwModelAttr) {
              scope.mwModel.unset(scope.mwModelAttr);
            } else {
              scope.mwModel.clear();
            }
          }
        };

        var selectAt = function (index) {
          var selectedItem = scope.mwOptionsCollection.selectable.getSelected().first(),
            indexOfSelectedItem = scope.mwOptionsCollection.indexOf(selectedItem);
          if (scope.mwOptionsCollection.at(indexOfSelectedItem + index)) {
            selectedItem.selectable.unSelect();
            scope.mwOptionsCollection.at(indexOfSelectedItem + index).selectable.select();
          }
        };

        var selectNext = function () {
          if (scope.mwOptionsCollection.selectable.getSelected().length > 0) {
            selectAt(1);
          } else if (scope.mwOptionsCollection.length > 0) {
            scope.mwOptionsCollection.first().selectable.select();
          }
          scrollToSelected(true);
        };

        var selectPrevious = function () {
          selectAt(-1);
          scrollToSelected(false);
        };

        var setToSearching = function () {
          scope.viewModel.isSearching = true;
        };

        var unsetSearching = function () {
          $timeout(function () {
            scope.viewModel.isSearching = false;
          }, 200);
        };

        var handleKeyPress = function (ev) {
          // Arrow up otherwise cursor is navigating in text backwards
          if (ev.keyCode === 38) {
            ev.preventDefault();
          }
          $timeout(function () {
            switch (ev.keyCode) {
              case 39: //key right
                if (scope.getAutocompleteText()) {
                  var selectedItem = scope.mwOptionsCollection.selectable.getSelected().first() || scope.mwOptionsCollection.first();
                  if (selectedItem) {
                    setResult(selectedItem);
                  }
                }
                break;
              case 40: //key down
                selectNext();
                break;
              case 38: //key up
                selectPrevious();
                break;
              case 13: //enter
                if (scope.mwOptionsCollection.selectable.getSelected().length > 0) {
                  setResult(scope.mwOptionsCollection.selectable.getSelected().first());
                }
                break;
              case 8: //backspace
              case 27: //escape
                unsetResult();
                break;
              case 91: //CMD
                break;
              default:
                /* All letters on keyboard */
                if (ev.keyCode >= 46) {
                  unsetResult();
                }
            }
          });
        };

        scope.getSelectedModelLabel = function () {
          var labelAttr = scope.mwModelLabelKey || scope.mwModelAttr || scope.mwOptionsLabelKey;
          if (scope.mwModel && labelAttr && scope.mwModel.get(labelAttr)) {
            return scope.mwModel.get(labelAttr);
          }
        };

        scope.select = function (item) {
          setResult(item);
        };

        scope.tmpSelect = function(model){
          scope.mwOptionsCollection.selectable.unSelectAll();
          model.selectable.select();
        };

        scope.unselect = function () {
          unsetResult();
        };

        scope.getLabel = function (model) {
          var modelAttr = model.get(scope.mwOptionsLabelKey);

          if (modelAttr) {
            if (scope.mwOptionsLabelI18nPrefix) {
              return i18n.get(scope.mwOptionsLabelI18nPrefix + '.' + modelAttr);
            } else {
              return modelAttr;
            }
          }
        };

        scope.getModelAttribute = function () {
          return scope.mwModelAttr || scope.mwModel.idAttribute;
        };

        scope.search = function () {
          if (scope.mwMinSearchLength && scope.viewModel.searchVal.length < scope.mwMinSearchLength) {
            return;
          }
          scope.viewModel.searchActive = true;
          scope.searching = true;
          //backup searched text to reset after fetch complete in case of search text was empty
          setFilterVal(scope.viewModel.searchVal);
          return scope.mwOptionsCollection.fetch().finally(function () {
            $timeout(function () {
              scope.searching = false;
              scope.mwOptionsCollection.selectable.unSelectAll();
              el.find('.auto-complete-holder').scrollTop(0);
              if (scope.mwOptionsCollection.length > 0) {
                scope.mwOptionsCollection.first().selectable.select();
              }
            }, 500);
          });
        };

        scope.getAutocompleteText = function () {
          if (scope.viewModel.searchVal.length > 0 && scope.mwOptionsCollection.length > 0) {
            var firstItemText,
              selectedItem = scope.mwOptionsCollection.selectable.getSelected().first() || scope.mwOptionsCollection.first();
            if (selectedItem) {
              firstItemText = scope.getLabel(selectedItem);
            }
            var safeSearchVal = scope.viewModel.searchVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var searchTermRegex = new RegExp('(^' + safeSearchVal + ')(.*)$', 'i');
            if (firstItemText) {
              var matcher = firstItemText.match(searchTermRegex);
              if (matcher && matcher.length === 3) {
                return scope.viewModel.searchVal + matcher[2];
              }
            }
          }
        };

        scope.fetchSuggestions = function () {
          scope.search();
        };

        scope.setSearchActive = function (setActive) {
          if (setActive) {
            scope.viewModel.searchActive = true;
            scope.fetchSuggestions();
          } else {
            scope.viewModel.searchActive = false;
          }
        };

        scope.mwOptionsCollection.on('request', setToSearching);
        scope.mwOptionsCollection.on('sync error', unsetSearching);
        scope.mwModel.on('change', setInputPadding);
        el.on('keydown', handleKeyPress);

        setInputPadding();

        scope.$on('$destroy', function () {
          scope.mwOptionsCollection.off('request', setToSearching);
          scope.mwOptionsCollection.off('sync error', unsetSearching);
          scope.mwModel.off('change', setInputPadding);
          el.off('keydown', handleKeyPress);
        });
      }
    };
  });