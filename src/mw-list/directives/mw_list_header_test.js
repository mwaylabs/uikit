describe('mwListHeader', function () {

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.List'));

  window.mockI18nFilter();
  window.mockIconService();
  var activeBreakPoint = 'md';

  beforeEach(function () {
    module(function ($provide) {
      $provide.service('mwBootstrapBreakpoint', function ($q) {
        return {
          getActiveBreakpoint: function(){
            return activeBreakPoint;
          }
        };
      });
    });
    spyOn(_, 'debounce').and.callFake(function(cb) { return function() { cb(); } });
  });

  beforeEach(inject(function ($compile, $timeout, $rootScope, $httpBackend) {

    this.$compile = $compile;
    this.$httpBackend = $httpBackend;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.collection = new (mwUI.Backbone.Collection.extend({
      url: '/test'
    }))();
    this.scope.collection = this.collection;

    this.setHeaderTemplate = function(tableHeaderTemplate){
      this.template = '<table mw-listable-bb collection="collection"> ' + '<thead> ' + '<tr mw-listable-header-row-bb> ' + tableHeaderTemplate + '</tr> ' + '</thead>' + ' </table>';
      this.$el =  $compile(this.template)(this.scope);
      this.scope.$digest();
      this.$headerEl = this.$el.find('.mw-list-header');
    };
    this.setHeaderTemplate('<th mw-listable-header-bb sort="{{sortAttr}}"> ' + 'Title ' + '</th>')
  }));

  afterEach(function () {
    this.$httpBackend.verifyNoOutstandingExpectation();
    this.scope.$destroy();
    activeBreakPoint = 'md';
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

  describe('testing visibility', function(){
    it('is visible when no other attributes are set', function(){
      this.tableHeaderTemplate = '<th mw-listable-header-bb></th>';
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('is hidden when bootstrap class hidden xs is set and the active breakpoint is xs', function(){
      activeBreakPoint = 'xs';
      this.setHeaderTemplate('<th mw-listable-header-bb class="hidden-xs"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

    it('is hidden when bootstrap class visible xs is set and the active breakpoint is md', function(){
      activeBreakPoint = 'md';
      this.setHeaderTemplate('<th mw-listable-header-bb class="visible-xs"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

    it('is visible when bootstrap class hidden xs is set and the active breakpoint is not xs', function(){
      activeBreakPoint = 'md';
      this.setHeaderTemplate('<th mw-listable-header-bb class="hidden-xs"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('is visible when bootstrap class visible xs is set and the active breakpoint is xs', function(){
      activeBreakPoint = 'xs';
      this.setHeaderTemplate('<th mw-listable-header-bb class="visible-xs"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('becomes visible when class hidden xs is set and breakpoint becomes inactive', function(){
      activeBreakPoint = 'xs';
      this.setHeaderTemplate('<th mw-listable-header-bb class="hidden-xs"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      activeBreakPoint = 'lg';
      this.$rootScope.$broadcast('mwBootstrapBreakpoint:changed', activeBreakPoint);
      isolatedScope.$digest();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('is hidden when class hidden xs is set and breakpoint becomes active', function(){
      activeBreakPoint = 'lg';
      this.setHeaderTemplate('<th mw-listable-header-bb class="hidden-xs"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      activeBreakPoint = 'xs';
      this.$rootScope.$broadcast('mwBootstrapBreakpoint:changed', activeBreakPoint);
      isolatedScope.$digest();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

    it('is hidden when hidden attribute is set', function(){
      activeBreakPoint = 'md';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

    it('is hidden when hidden attribute is set to true', function(){
      activeBreakPoint = 'md';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="true"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

    it('is visible when hidden attribute is set to false', function(){
      activeBreakPoint = 'md';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="false"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('is hidden when hidden attribute is set to a breakpoint and breakpoint is becoming active', function(){
      activeBreakPoint = 'lg';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="[\'xs\', \'md\']"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      activeBreakPoint = 'xs';
      this.$rootScope.$broadcast('mwBootstrapBreakpoint:changed', activeBreakPoint);
      isolatedScope.$digest();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

    it('is hidden when hidden attribute is set to a breakpoint and breakpoint is active', function(){
      activeBreakPoint = 'xs';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="[\'xs\', \'md\']"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

    it('becomes visible when hidden attribute is set to a breakpoint and breakpoint is becoming inactive', function(){
      activeBreakPoint = 'xs';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="[\'xs\', \'md\']"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      activeBreakPoint = 'lg';
      this.$rootScope.$broadcast('mwBootstrapBreakpoint:changed', activeBreakPoint);
      isolatedScope.$digest();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('is visible when hidden attribute is set to a breakpoint and breakpoint is not active', function(){
      activeBreakPoint = 'lg';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="[\'xs\', \'md\']"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('it is visible when hidden attribute is set to a breakpoint and breakpoint active but user has set it to visible', function(){
      activeBreakPoint = 'xs';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="[\'xs\', \'md\']"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      isolatedScope.showColumn();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('it is hidden when hidden attribute is set to a breakpoint and breakpoint is inactive but user has set it to hidden', function(){
      activeBreakPoint = 'lg';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="[\'xs\', \'md\']"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();

      isolatedScope.hideColumn();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

    it('it keeps visiblity status when breakpoint is changing', function(){
      activeBreakPoint = 'xs';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="[\'xs\', \'md\']"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();
      isolatedScope.showColumn();

      activeBreakPoint = 'md';
      this.$rootScope.$broadcast('mwBootstrapBreakpoint:changed', activeBreakPoint);
      isolatedScope.$digest();

      expect(isolatedScope.isVisible()).toBeTruthy();
    });

    it('gets oriignially set visiblity status when calling resetColumnVisibility', function(){
      activeBreakPoint = 'xs';
      this.setHeaderTemplate('<th mw-listable-header-bb hidden="[\'xs\', \'md\']"></th>');
      var isolatedScope = this.$headerEl.isolateScope();
      this.$timeout.flush();
      isolatedScope.showColumn();
      activeBreakPoint = 'md';
      this.$rootScope.$broadcast('mwBootstrapBreakpoint:changed', activeBreakPoint);
      isolatedScope.$digest();

      isolatedScope.resetColumnVisibility();

      expect(isolatedScope.isVisible()).toBeFalsy();
    });

  });

});
