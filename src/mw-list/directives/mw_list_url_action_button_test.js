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
});
