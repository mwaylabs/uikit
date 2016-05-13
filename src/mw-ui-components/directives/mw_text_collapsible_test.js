describe('mwTextCollapsible', function () {
  var $compile;
  var $rootScope;
  var scope;

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.UiComponents'));

  //mock i18n filter
  beforeEach(function(){
    module(function($provide){
      $provide.value('i18nFilter', function(){
        return function(input){
          return input;
        };
      });
    });
  });

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
    var textCollapse = '<span mw-text-collapsible="short text"></span>';
    var el = $compile(textCollapse)(scope);

    scope.$digest();

    expect(el.has('.toggle-btn').length).toBe(0);
    expect(el.find('.content').text()).toEqual('short text');
  });

  it('text should have a default max length of 203 chars', function () {
    var textCollapse = '<span mw-text-collapsible="' + longText + '"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    expect(el.has('.toggle-btn').length).toBe(1);

    expect(el.find('span').text().length).toEqual(203);
  });

  it('text should have a custom max length', function () {
    var textCollapse = '<span length="50" mw-text-collapsible="' + longText + '"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    expect(el.has('.toggle-btn').length).toBe(1);

    expect(el.find('.content').text().length).toEqual(53);
  });

  it('text should have a "show more" button when cut off', function () {
    var textCollapse = '<span mw-text-collapsible="' + longText + '"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    var isolateScope = el.isolateScope();
    expect(isolateScope.showLessOrMore()).toEqual('UiComponents.mwTextCollapsible.showMore');

    isolateScope.defaultLength = 999;
    expect(isolateScope.showLessOrMore()).toEqual('UiComponents.mwTextCollapsible.showLess');
  });

  it('text should be expanded when button "show more" is clicked', function () {
    var textCollapse = '<span mw-text-collapsible="' + longText + '"></span>';
    var el = $compile(textCollapse)(scope);
    scope.$digest();

    expect(el.find('span').text().length).toEqual(203);
    el.find('a').trigger('click');
    expect(el.find('span').text().length).toEqual(539);
  });

});
