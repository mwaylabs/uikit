fdescribe('mwHideOnRequest', function () {
  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.UiComponents'));

  window.mockI18nFilter();

  beforeEach(inject(function ($compile, $rootScope, $httpBackend) {
    this.$compile = $compile;
    this.$httpBackend = $httpBackend;
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$httpBackend.when('GET', /\/irrelevant.*/).respond(200);
    this.$httpBackend.when('POST', /\/irrelevant.*/).respond(200, {id: 'IRREVELVANT'});
    this.$httpBackend.when('DELETE', /\/irrelevant.*/).respond(200, {id: 'IRREVELVANT'});
  }));

  afterEach(function () {
    this.$httpBackend.verifyNoOutstandingRequest();
    this.scope.$destroy();
  });

  describe('with backbone model', function(){
    beforeEach(function () {
      this.Model = mwUI.Backbone.Model.extend({
        urlRoot: '/irrelevant'
      });
      this.scope.model = new this.Model();
      this.el = '<div mw-hide-on-request="model">IRRELEVANT</div>';
      this.$el = this.$compile(this.el)(this.scope);
      this.scope.$digest();
    });

    it('displays content when model is not fetching stuff', function(){
      expect(this.$el.find('.spinner-holder').length).toBe(0);
      expect(this.$el.find('.content-holder').length).toBe(1);
      expect(this.$el.find('.content-holder').text()).toBe('IRRELEVANT');
    });

    it('displays spinner but no content when model is fetching stuff', function(){
      this.scope.model.fetch();
      this.scope.$digest();

      expect(this.$el.find('.content-holder').length).toBe(0);
      expect(this.$el.find('.spinner-holder').length).toBe(1);
      expect(this.$el.find('.spinner-holder').find('.mw-spinner').length).toBe(1);

      this.$httpBackend.flush();
      this.scope.$digest();
    });

    it('displays spinner but no content when model is saving stuff', function(){
      this.scope.model.save();
      this.scope.$digest();

      expect(this.$el.find('.content-holder').length).toBe(0);
      expect(this.$el.find('.spinner-holder').length).toBe(1);
      expect(this.$el.find('.spinner-holder').find('.mw-spinner').length).toBe(1);

      this.$httpBackend.flush();
      this.scope.$digest();
    });

    it('displays spinner but no content when model is destroyed', function(){
      this.scope.model.set({id: 'IRRELEVANT'});
      this.scope.model.destroy();
      this.scope.$digest();

      expect(this.$el.find('.content-holder').length).toBe(0);
      expect(this.$el.find('.spinner-holder').length).toBe(1);
      expect(this.$el.find('.spinner-holder').find('.mw-spinner').length).toBe(1);

      this.$httpBackend.flush();
      this.scope.$digest();
    });

    it('hides spinner and displays content when the request was successful', function(){
      this.scope.model.fetch();
      this.$httpBackend.flush();
      this.scope.$digest();

      expect(this.$el.find('.content-holder').length).toBe(1);
      expect(this.$el.find('.spinner-holder').length).toBe(0);
    });

    it('hides spinner and displays content when the request was not successful', function(){
      this.$httpBackend.expectGET('/404').respond(404);
      this.scope.model.urlRoot = '/404';
      this.scope.model.fetch();
      this.$httpBackend.flush();
      this.scope.$digest();

      expect(this.$el.find('.content-holder').length).toBe(1);
      expect(this.$el.find('.spinner-holder').length).toBe(0);
    });
  });

  describe('with backbone collection', function(){
    beforeEach(function () {
      this.Collection = mwUI.Backbone.Collection.extend({
        url: '/irrelevant'
      });
      this.scope.collection = new this.Collection();
      this.el = '<div mw-hide-on-request="collection">IRRELEVANT</div>';
      this.$el = this.$compile(this.el)(this.scope);
      this.scope.$digest();
    });

    it('displays content when model is not fetching stuff', function(){
      expect(this.$el.find('.spinner-holder').length).toBe(0);
      expect(this.$el.find('.content-holder').length).toBe(1);
      expect(this.$el.find('.content-holder').text()).toBe('IRRELEVANT');
    });

    it('displays spinner but no content when model is fetching stuff', function(){
      this.scope.collection.fetch();
      this.scope.$digest();

      expect(this.$el.find('.content-holder').length).toBe(0);
      expect(this.$el.find('.spinner-holder').length).toBe(1);

      this.$httpBackend.flush();
      this.scope.$digest();
    });

    it('hides spinner and displays content when the request was successful', function(){
      this.scope.collection.fetch();
      this.$httpBackend.flush();
      this.scope.$digest();

      expect(this.$el.find('.content-holder').length).toBe(1);
      expect(this.$el.find('.spinner-holder').length).toBe(0);
    });

    it('hides spinner and displays content when the request was not successful', function(){
      this.$httpBackend.expectGET(/\/404.*/).respond(404);
      this.scope.collection.url = '/404';
      this.scope.collection.fetch();
      this.$httpBackend.flush();
      this.scope.$digest();

      expect(this.$el.find('.content-holder').length).toBe(1);
      expect(this.$el.find('.spinner-holder').length).toBe(0);
    });
  });

  it('throws error when no collection or model is set', function(){
      var errorFn = function(){
        this.el = '<div mw-hide-on-request>IRRELEVANT</div>';
        this.$el = this.$compile(this.el)(this.scope);
        this.scope.$digest();
      }.bind(this);

      expect(errorFn).toThrowError(/.*model or collection.*/);
  });

  it('throws error when the value is neither a collection nor a model', function(){
    var errorFn = function(){
      this.scope.value = 'String';
      this.el = '<div mw-hide-on-request="value">IRRELEVANT</div>';
      this.$el = this.$compile(this.el)(this.scope);
      this.scope.$digest();
    }.bind(this);

    expect(errorFn).toThrowError(/.*model or collection.*/);
  });

});
