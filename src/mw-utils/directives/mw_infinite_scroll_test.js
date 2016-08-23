describe('mwInfiniteScroll', function () {
  beforeEach(module('karmaDirectiveTemplates'));
  beforeEach(module('mwUI.Utils'));
  beforeEach(module('mwUI.Modal'));

  beforeEach(inject(function ($window, $q, $compile, $rootScope) {
    this.$q = $q;
    this.$compile = $compile;
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.collection = new mwUI.Backbone.Collection();
    this.hasNextPageSpy = spyOn(this.collection.filterable, 'hasNextPage').and.callFake(function () {
      return true;
    });
    this.loadNextSpy = spyOn(this.collection.filterable, 'loadNextPage').and.callFake(function () {
      var dfd = $q.defer();
      dfd.resolve();
      return dfd.promise;
    });
  }));

  describe('with custom scroll container', function () {
    beforeEach(function () {
      this.infiniteScrollTmpl =
        '<div id="scrollContainer" style="height:2000px; overflow: scroll">' +
        '<div mw-infinite-scroll ' +
        'collection="collection" ' +
        'style="height: 3000px" ' +
        'scroll-container-selector="#scrollContainer">' +
        '</div>' +
        '</div>';
      this.scope.collection = this.collection;
      this.$el = this.$compile(this.infiniteScrollTmpl)(this.scope);
      this.scope.$digest();
      this.$bodyEl = angular.element('body');
      this.$bodyEl.append(this.$el);
      this.$scrollEl = this.$el;
      jasmine.clock().install();

      this.scrollToPos = function(pos, append){
        var el = this.$el.find('*[mw-infinite-scroll]');
        this.$scrollEl.scrollTop(pos);
        this.$scrollEl.triggerHandler('scroll');
        jasmine.clock().tick(501);
        if(append!==false){
          el.height(parseInt(el.height(),10)+3000);
        }
        this.scope.$digest();
      };
    });

    afterEach(function () {
      this.$el.remove();
      jasmine.clock().uninstall();
    });

    it('paginates on scroll when filterable is available and has a next page', function () {
      this.scrollToPos(3000);

      expect(this.scope.collection.filterable.loadNextPage).toHaveBeenCalled();
    });

    it('does not paginate on scroll when filterable has no more pages', function () {
      this.hasNextPageSpy.and.callFake(function () {
        return false;
      });

      this.scrollToPos(3000);

      expect(this.scope.collection.filterable.loadNextPage).not.toHaveBeenCalled();
    });

    it('does not trigger another load request when a load request is already pending', function () {
      this.loadNextSpy.and.callFake(function () {
        return this.$q.defer().promise;
      }.bind(this));
      this.scrollToPos(2999, false);

      this.scrollToPos(3000);

      expect(this.scope.collection.filterable.loadNextPage).toHaveBeenCalledTimes(1);
    });

    it('triggers another load request when the previous one is done and another scroll happens', function () {
      var dfd = this.$q.defer();
      this.loadNextSpy.and.callFake(function () {
        return dfd.promise;
      }.bind(this));
      this.scrollToPos(2999, false);

      dfd.resolve();
      this.scope.$digest();
      this.scrollToPos(3000);

      expect(this.scope.collection.filterable.loadNextPage).toHaveBeenCalledTimes(2);
    });

    it('has a minimum threshold of 40% scrolled before a load request is triggered', function () {
      // scroll el has a height of 3000px, container 2000px, min threshold starts at 40%
      // (3000px-20000px)*0.4 = 400px
      this.scrollToPos(399, false);

      this.scrollToPos(401);

      expect(this.scope.collection.filterable.loadNextPage).toHaveBeenCalledTimes(1);
    });

    it('triggers not another request before the next threshold stage is reached', function () {
      // (3000px-20000px)*0.4 = 400px
      this.scrollToPos(401);

      // (6000px-20000px)*0.4 = 1600px
      this.scrollToPos(1601);

      expect(this.scope.collection.filterable.loadNextPage).toHaveBeenCalledTimes(1);
    });

    it('increases threshold before it loads next page over time', function () {
      // (3000px-20000px)*0.4 = 400px
      this.scrollToPos(401);
      // (6000px-20000px)*0.5 = 2000px
      this.scrollToPos(2001);
      // (9000px-20000px)*0.6 = 4200px
      this.scrollToPos(4201);

      expect(this.scope.collection.filterable.loadNextPage).toHaveBeenCalledTimes(3);
    });

    it('has a maximum threshold of 90% after that it wont be increased anymore', function () {
      this.scrollToPos(401);
      this.scrollToPos(2001);
      this.scrollToPos(4201);
      this.scrollToPos(7001);
      this.scrollToPos(10401);
      // (18000px-20000px)*0.9 = 14401px
      this.scrollToPos(14401);

      // (21000px-20000px)*0.9 = 17100px
      this.scrollToPos(17101);

      expect(this.scope.collection.filterable.loadNextPage).toHaveBeenCalledTimes(7);
    });
  });

  describe('in document', function () {
    // Can not be tested because the phantomJs viewport does not have a real height -> has to be tested by a integration test like protractor
  });

  describe('in modal', function () {
    // Can not be tested because stylesheet of modal is not available -> has to be tested by a integration test like protractor
  });
});