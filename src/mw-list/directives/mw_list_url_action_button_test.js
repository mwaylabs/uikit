describe('mwListUrlActionButton', function() {

  beforeEach(function() {
    module('karmaDirectiveTemplates');
    module('mwUI');
  });

  beforeEach(function () {
    module(function($provide) {
      $provide.value('$window', {
        location: {href: ''}
      });
    });
  });

  beforeEach(inject(function($compile, $rootScope, $window, $timeout) {
    this.$compile = $compile;
    this.scope = $rootScope.$new();
    this.$window = $window;
    this.$timeout = $timeout;
  }));

  it('does not open the link in a new tab', function() {
    var compiledElement = this.$compile('<mw-listable-bb>' +
      '<span mw-listable-link-show-bb="http://page.xyz"></span>' +
      '</mw-listable-bb>')(this.scope);
    this.scope.$digest();

    compiledElement.find('.mw-listable-action-button').triggerHandler('click');
    this.scope.$digest();
    this.$timeout.flush();

    expect(this.$window.location.href).toBe('http://page.xyz');
  });

  it('does not open the link in a new tab', function() {
    var compiledElement = this.$compile('<mw-listable-bb>' +
      '<span mw-listable-link-show-bb="http://page.xyz"></span>' +
      '</mw-listable-bb>')(this.scope);
    this.scope.$digest();

    compiledElement.find('.mw-listable-action-button').triggerHandler('click');
    this.scope.$digest();
    this.$timeout.flush();

    expect(this.$window.location.href).toBe('http://page.xyz');
  });

  it('opens the link in a new tab when target is != self', function() {
    var compiledElement = this.$compile('<mw-listable-bb>' +
      '<span mw-listable-link-show-bb="http://page.xyz"' +
      '      link-target="_blank"></span>' +
      '</mw-listable-bb>')(this.scope);
    spyOn(window, 'open');
    this.scope.$digest();

    compiledElement.find('.mw-listable-action-button').triggerHandler('click');
    this.scope.$digest();
    this.$timeout.flush();

    expect(window.open).toHaveBeenCalledWith('http://page.xyz');
  });

});
