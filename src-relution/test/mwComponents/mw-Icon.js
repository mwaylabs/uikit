describe('mwIcon', function () {
  var $compile;
  var $rootScope;
  var scope;

  beforeEach(module('mwUI'));
  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();
  }));

  it('should add the class "mw-icon" to the parent element', function () {
    var icon = '<span mw-icon="search"></span>';
    var el = $compile(icon)(scope);
    scope.$digest();
    expect(el.hasClass('mw-icon')).toBe(true);

    var iconTooltip = '<span mw-icon="search" tooltip="This is a tooltip"></span>';
    var el = $compile(iconTooltip)(scope);
    scope.$digest();
    expect(el.hasClass('mw-icon')).toBe(true);
  });

  it('should have a font awesome icon class', function () {
    var icon = '<span mw-icon="fa-star"></span>';
    var el = $compile(icon)(scope);
    scope.$digest();

    expect(el.children().hasClass('fa')).toBe(true);
    expect(el.children().hasClass('fa-star')).toBe(true);
  });

  it('should have a relution icon', function () {
    var icon = '<span mw-icon="rln-icon new_app_native"></span>';
    var el = $compile(icon)(scope);
    scope.$digest();

    expect(el.children().hasClass("rln-icon")).toBe(true);
    expect(el.children().hasClass("new_app_native")).toBe(true);
  });

  it('should have a default bootstrap glyphicon', function () {
    var icon = '<span mw-icon="search"></span>';
    var el = $compile(icon)(scope);
    scope.$digest();

    expect(el.children().hasClass('glyphicon')).toBe(true);
    expect(el.children().hasClass('glyphicon-search')).toBe(true);
  });

  it('should change the class according to the new icon', function () {
    var icon = '<span mw-icon="search"></span>';
    var el = $compile(icon)(scope);

    scope.$digest();

    var isolatedScope = el.isolateScope();

    expect(el.children().hasClass('glyphicon')).toBe(true);
    expect(el.children().hasClass('glyphicon-search')).toBe(true);

    isolatedScope.mwIcon = 'fa-star';
    scope.$digest();

    expect(el.children().hasClass('fa')).toBe(true);
    expect(el.children().hasClass('fa-star')).toBe(true);
  });

});
