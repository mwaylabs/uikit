describe('mwTextCollapse', function () {
  var $compile;
  var $rootScope;
  var scope;

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwComponents'));

  window.mockI18nFilter();

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();
  }));


  var longText = 'long text long text long text long text long text ' +
    'long text long text long text long text long text long text long text ' +
    'long text long text long text long text long text long text long text ' +
    'long text long text long text long text long text long text long text ' +
    'long text long text long text long text long text long text long text ' +
    'long text long text long text long text long text long text long text ' +
    'long text long text long text long text long text long text long text ' +
    'long text long text long text long text long text long text long text';

  it('should not cut off text when text is shorter than 200 characters', function () {
    var textCollapse = '<span mw-text-collapse="short text"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();
    expect(el.has('span').length).toBe(1);
    expect(el.has('a').length).toBe(0);

    expect(el.find('span').text()).toEqual('short text');
  });

  it('text should have a default max length of 203 chars', function () {
    var textCollapse = '<span mw-text-collapse="' + longText + '"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    expect(el.has('span').length).toBe(1);
    expect(el.has('a').length).toBe(1);

    expect(el.find('span').text().length).toEqual(203);
  });

  it('text should have a custom max length', function () {
    var textCollapse = '<span length="50" mw-text-collapse="' + longText + '"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    expect(el.has('span').length).toBe(1);
    expect(el.has('a').length).toBe(1);

    expect(el.find('span').text().length).toEqual(53);
  });

  it('text should be rendered in markdown', function () {
    var textCollapse = '<span markdown="true" mw-text-collapse="*hi*"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    expect(el.has('span').length).toBe(0);
    expect(el.has('a').length).toBe(0);

    expect(el.find('div').eq(1).html()).toBe('<p><em>hi</em></p>');
  });

  it('text should have a "show more" button when cut off', function () {
    var textCollapse = '<span mw-text-collapse="' + longText + '"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    var isolateScope = el.isolateScope();
    expect(isolateScope.showLessOrMore()).toEqual('common.showMore');

    isolateScope.defaultLength = 999;
    expect(isolateScope.showLessOrMore()).toEqual('common.showLess');
  });

  it('text should be expanded when button "show more" is clicked', function () {
    var textCollapse = '<span mw-text-collapse="' + longText + '"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    expect(el.find('span').text().length).toEqual(203);
    el.find('a').trigger('click');
    expect(el.find('span').text().length).toEqual(539);
  });

});
