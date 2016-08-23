angular.module('mwUI.Utils')

  .directive('mwInfiniteScroll', function ($window) {
    return {
      restrict: 'A',
      link: function (scope, el, attrs) {

        var collection,
          loading = false,
          throttledScrollFn,
          scrollContainerEl,
          scrollContentEl,
          loadedPages = 0;

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

        var loadNextPage = function () {
          if (!loading && collection.filterable.hasNextPage()) {
            loading = true;
            loadedPages++;
            return collection.filterable.loadNextPage().then(function () {
              loading = false;
            });
          }
        };

        // The threshold is controlled by how many pages are loaded
        // The first pagination request should be done quiet early so the user does not recognize that something
        // is loaded.
        // As scrollbar is getting longer and longer the threshold has to be increased as well.
        // Threshold starts at 40% and is increased by 10% until the max threshold of 90% is reached
        var getLoadNextThreshold = function(){
          var minThreshold = 4,
              maxThreshold = 9;

          return Math.min(minThreshold+loadedPages,maxThreshold)/10;
        };

        var scrollFn = function () {
          var contentHeight = scrollContentEl[0].clientHeight || scrollContentEl.height(),
              totalHeight = contentHeight - scrollContainerEl.height(),
              threshold = getLoadNextThreshold();

          if ( scrollContainerEl.scrollTop() / totalHeight > threshold) {
            loadNextPage();
          }
        };

        if(attrs.scrollContainerSelector || attrs.scrollContentSelector){
          // Custom element defined by selectors. The scrollContainer is the element that has the scrollbar
          // The scrollContent is the element inside the scroll container that should be scrolled
          // At least one of them has to be defined and if you define both they must not be the same
          if(attrs.scrollContainerSelector && el.parents(attrs.scrollContainerSelector).length > 0){
            scrollContainerEl = el.parents(attrs.scrollContainerSelector).first();
          } else if(attrs.scrollContainerSelector && el.parents(attrs.scrollContainerSelector).length===0){
            throw new Error ('No parent of the infinite scroll element with the selector '+attrs.scrollContainerSelector+' could be found!');
          } else {
            scrollContainerEl = el;
          }

          if(attrs.scrollContentSelector && el.find(attrs.scrollContentSelector).length > 0){
            scrollContentEl = el.find(attrs.scrollContentSelector).first();
          } else if(attrs.scrollContentSelector && el.find(attrs.scrollContentSelector).length === 0){
            throw new Error ('No child of the infinite scroll element with the selector '+attrs.scrollContentSelector+' could be found!');
          } else {
            scrollContentEl = el;
          }
        } else if (el.parents('.modal').length) {
          //element in modal
          scrollContainerEl = el.parents('*[mw-modal-body]');
          scrollContentEl = el.parents('.modal-body');
        } else {
          //element in window
          scrollContainerEl = angular.element($window);
          scrollContentEl = angular.element(document);
        }

        if(scrollContainerEl === scrollContentEl){
          throw new Error('The scrollContainerElement can not be the same as the actual scrollContentElement');
        }

        throttledScrollFn = _.throttle(scrollFn, 500);

        // Register scroll callback
        scrollContainerEl.on('scroll', throttledScrollFn);

        // Deregister scroll callback if scope is destroyed
        scope.$on('$destroy', function () {
          scrollContainerEl.off('scroll', throttledScrollFn);
        });
      }
    };
  });