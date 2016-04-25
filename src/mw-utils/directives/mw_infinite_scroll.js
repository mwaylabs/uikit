angular.module('mwUI.Utils')

  .directive('mwInfiniteScroll', function ($window, $document) {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {

        var collection,
          loading = false,
          throttledScrollFn,
          scrollFn,
          documentEl,
          scrollEl;

        if (attrs.mwListCollection) {
          collection = scope.$eval(attrs.mwListCollection).getCollection();
        } else if (attrs.collection) {
          collection = scope.$eval(attrs.collection);
        } else {
          console.warn('No collection was found for the infinite scroll pleas pass it as scope attribute');
        }

        if (!collection || (collection && !collection.filterable)) {
          return;
        }

        var scrollCallback = function () {
          if (!loading && scrollEl.scrollTop() >= ((documentEl.height() - scrollEl.height()) - 100) && collection.filterable.hasNextPage()) {
            loading = true;
            collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };
        var modalScrollCallback = function () {
          if (!loading &&
            collection.filterable.hasNextPage() &&
            scrollEl[0].scrollHeight > 0 &&
            (scrollEl[0].scrollHeight - scrollEl.scrollTop() - scrollEl[0].clientHeight < 2)) {
            loading = true;
            collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };

        if (el.parents('.modal').length) {
          //element in modal
          scrollEl = el.parents('.modal-body');
          scrollFn = modalScrollCallback;
        }
        else {
          //element in window
          documentEl = angular.element($document);
          scrollEl = angular.element($window);
          scrollFn = scrollCallback;
        }

        throttledScrollFn = _.throttle(scrollFn, 500);

        // Register scroll callback
        scrollEl.on('scroll', throttledScrollFn);

        // Deregister scroll callback if scope is destroyed
        scope.$on('$destroy', function () {
          scrollEl.off('scroll', throttledScrollFn);
        });

      }
    };
  });