describe('mwListHeader', function () {

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.List'));

  window.mockI18nFilter();

  beforeEach(inject(function ($compile, $rootScope, $httpBackend) {

    this.$compile = $compile;
    this.$httpBackend = $httpBackend;
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.template = '<table mw-listable-bb collection="collection"> ' + '<thead> ' + '<tr mw-listable-header-row-bb> ' + '<th mw-listable-header-bb sort="{{sortAttr}}"> ' + 'Title ' + '</th> ' + '</tr> ' + '</thead>' + ' </table>';
    this.collection = new (mwUI.Backbone.Collection.extend({
      url: '/test'
    }))();
    this.scope.collection = this.collection;
    this.$el =  $compile(this.template)(this.scope);
    this.scope.$digest();
    this.$headerEl = this.$el.find('.mw-list-header');
  }));

  afterEach(function () {
    this.$httpBackend.verifyNoOutstandingExpectation();
    this.scope.$destroy();
  });

  it('is not clickable class when no sort attribute is defined', function(){
    var $headerEl = this.$el.find('.mw-list-header');

    expect($headerEl.hasClass('clickable')).toBeFalsy();
  });

  it('is clickable class when a sort attribute is defined', function(){
    this.scope.sortAttr = 'abc';
    this.scope.$digest();

    expect(this.$headerEl.hasClass('clickable')).toBeTruthy();
  });

  it('triggers an request with an ascending (+) sortOrder param when you click on the header for the first time', function(){
    this.scope.sortAttr = 'abc';
    this.scope.$digest();

    this.$httpBackend.expectGET(/\/test.*sortOrder=%2Babc.*/).respond(200);

    this.$headerEl.triggerHandler('click');
    this.scope.$digest();

    this.$httpBackend.flush();
  });

  it('triggers an request with a descending (-) sortOrder param when you click on the header for the second time', function(){
    this.scope.sortAttr = 'abc';
    this.scope.$digest();
    this.$httpBackend.expectGET(/\/test.*sortOrder=%2Babc.*/).respond(200);
    this.$headerEl.triggerHandler('click');
    this.scope.$digest();

    this.$httpBackend.expectGET(/\/test.*sortOrder=-abc.*/).respond(200);
    this.$headerEl.triggerHandler('click');
    this.scope.$digest();

    this.$httpBackend.flush();
  });

});
