describe('mwListHeader', function () {

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.List'));

  window.mockI18nFilter();

  beforeEach(inject(function ($compile, $rootScope, $httpBackend) {

    this.$compile = $compile;
    this.$httpBackend = $httpBackend;
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.template = '<table mw-listable-bb collection="collection"></table>';
    this.collection = new (mwUI.Backbone.Collection.extend({
      url: '/test'
    }))();
    this.collectionHasNextPage = false;
    this.collection.filterable.hasNextPage = jasmine.createSpy('hasNextPage').and.callFake(function(){
      return this.collectionHasNextPage;
    }.bind(this));
    this.scope.collection = this.collection;
    this.$el = $compile(this.template)(this.scope);
    this.scope.$digest();
    this.$footerRowEl = this.$el.find('.mw-list-footer');
  }));

  afterEach(function () {
    this.collectionHasNextPage = false;
    this.$httpBackend.verifyNoOutstandingExpectation();
    this.scope.$destroy();
  });

  it('shows no spinner when the collection is not loading', function(){
    this.collectionHasNextPage = true;
    var $spinnerEl = this.$footerRowEl.find('.mw-spinner');
    this.scope.$digest();

    expect($spinnerEl.length).toBe(0);
  });

  it('shows a spinner when the collection is loading and has a next page', function(){
    this.collectionHasNextPage = true;
    this.scope.collection.fetch();
    this.$httpBackend.expectGET(/\/test.*/).respond(200);
    this.scope.$digest();

    var $spinnerEl = this.$footerRowEl.find('.mw-spinner');
    expect($spinnerEl.length).toBe(1);

    this.$httpBackend.flush();
  });

  it('shows removes spinner when the loading of the collection is done', function(){
    this.collectionHasNextPage = true;
    this.scope.collection.fetch();
    this.$httpBackend.expectGET(/\/test.*/).respond(200);
    this.scope.$digest();
    this.$httpBackend.flush();

    var $spinnerEl = this.$footerRowEl.find('.mw-spinner');
    expect($spinnerEl.length).toBe(0);
  });

  it('shows no spinner when the collection is loading but has no next page', function(){
    this.collectionHasNextPage = false;
    this.scope.collection.fetch();
    this.$httpBackend.expectGET(/\/test.*/).respond(200);
    this.scope.$digest();
    var $spinnerEl = this.$footerRowEl.find('.mw-spinner');

    expect($spinnerEl.length).toBe(0);

    this.$httpBackend.flush();
  });
});