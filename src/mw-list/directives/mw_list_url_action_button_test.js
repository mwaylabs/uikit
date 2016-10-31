describe('mwListUrlActionButton', function() {

  beforeEach(function() {
    module('karmaDirectiveTemplates');
    module('mwUI');
  });

  beforeEach(inject(function($compile, $rootScope) {
    this.$compile = $compile;
    this.scope = $rootScope.$new();
  }));

  it('contains the link', function() {
    var element = this.$compile('<mw-listable-bb><span mw-listable-link-show-bb="http://blog.mwaysolutions.com/"></span></mw-listable-bb>')(this.scope);

    this.scope.$digest();

    expect(element.html()).toContain('href="http://blog.mwaysolutions.com/"');
  });

});
