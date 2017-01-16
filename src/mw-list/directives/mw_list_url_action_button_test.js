describe('mwListUrlActionButton', function() {

  beforeEach(function() {
    module('karmaDirectiveTemplates');
    module('mwUI');
  });

  beforeEach(inject(function($compile, $rootScope) {
    this.$compile = $compile;
    this.scope = $rootScope.$new();
  }));

  describe('default behaviour', function() {
    var compiledElement;
    beforeEach(function() {
      compiledElement = this.$compile('<mw-listable-bb><span mw-listable-link-show-bb="http://blog.mwaysolutions.com/"></span></mw-listable-bb>')(this.scope);
    });

    it('contains the link', function() {
      this.scope.$digest();

      expect(compiledElement.html()).toContain('href="http://blog.mwaysolutions.com/"');
    });

    it('does not open the link in a new tab', function() {
      this.scope.$digest();

      expect(compiledElement.html()).not.toContain(' target=');
    });
  });

  it('will open the link in a new tab if configured', function() {
    var compiledElement = this.$compile('<mw-listable-bb>' +
      '<span mw-listable-link-show-bb="http://blog.mwaysolutions.com/"' +
      '      link-target="_blank"></span>' +
      '</mw-listable-bb>')(this.scope);

    this.scope.$digest();

    expect(compiledElement.html()).toContain('target="_blank"');
  });

  it('updates link', function(){
    this.scope.link = 'XXX';
    var compiledElement = this.$compile('<mw-listable-bb><span mw-listable-link-show-bb="{{link}}"></span></mw-listable-bb>')(this.scope);
    this.scope.$digest();

    this.scope.link = 'ABC';
    this.scope.$digest();

    expect(compiledElement.html()).toContain('href="ABC"');
  });

  it('registers no link to mw-list-body-row when there is no ng-repeat', function(){
    this.scope.link = 'XXX';
    var compiledElement = this.$compile('<mw-listable-bb><mw-listable-body-row-bb><span mw-listable-link-show-bb="{{link}}"></span></mw-listable-body-row-bb></mw-listable-bb>')(this.scope);
    var mwListableBbCtrl = compiledElement.controller('mwListableBb');
    this.scope.$digest();

    expect(mwListableBbCtrl.actionColumns.length).toBe(0);
  });

  it('registers the link to mw-list-body-row when there is a ng-repeat', function(){
    this.scope.items = ['XXX1', 'XXX2'];
    var compiledElement = this.$compile('<mw-listable-bb><mw-listable-body-row-bb ng-repeat="link in items"><span mw-listable-link-show-bb="{{link}}"></span></mw-listable-body-row-bb></mw-listable-bb>')(this.scope);
    var mwListableBbCtrl = compiledElement.controller('mwListableBb');
    this.scope.$digest();

    expect(mwListableBbCtrl.actionColumns.length).toBe(2);
    expect(mwListableBbCtrl.actionColumns[0].link).toBe('XXX1');
    expect(mwListableBbCtrl.actionColumns[1].link).toBe('XXX2');
  });

  it('updates the link when it changes', function(){
    this.scope.items = ['XXX1', 'XXX2'];
    var compiledElement = this.$compile('<mw-listable-bb><mw-listable-body-row-bb ng-repeat="link in items"><span mw-listable-link-show-bb="{{link}}"></span></mw-listable-body-row-bb></mw-listable-bb>')(this.scope);
    var mwListableBbCtrl = compiledElement.controller('mwListableBb');
    this.scope.$digest();

    this.scope.items = ['ABC1', 'ABC2'];
    this.scope.$digest();

    expect(mwListableBbCtrl.actionColumns[0].link).toBe('ABC1');
    expect(mwListableBbCtrl.actionColumns[1].link).toBe('ABC2');
  });

  it('unregisteres the link when the scope is destroyed', function(){
    this.scope.items = [{link:'XXX1', visible: true}, {link: 'XXX2', visible: true}];
    var compiledElement = this.$compile('<mw-listable-bb><mw-listable-body-row-bb ng-repeat="item in items"><span ng-if="item.visible" mw-listable-link-show-bb="{{item.link}}"></span></mw-listable-body-row-bb></mw-listable-bb>')(this.scope);
    var mwListableBbCtrl = compiledElement.controller('mwListableBb');
    this.scope.$digest();

    this.scope.items[1].visible = false;
    this.scope.$digest();

    expect(mwListableBbCtrl.actionColumns.length).toBe(1);
    expect(mwListableBbCtrl.actionColumns[0].link).toBe('XXX1');
  });
});
