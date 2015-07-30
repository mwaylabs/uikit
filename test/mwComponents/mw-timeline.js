describe('mwTimeline', function () {
  var $compile;
  var $rootScope;
  var scope;
  var el;
  var isolateScopeFieldset

  beforeEach(module('mwUI'));
  beforeEach(module('karmaDirectiveTemplates'));
  beforeEach(module('mwComponents'));

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

    el = angular.element(
      '<div mw-timeline collection="collection">' +
      '<div mw-timeline-fieldset collapsable="true" mw-title="title">' +
      '<div mw-timeline-entry>' +
      '</div>' +
      '</div>' +
      '</div>'
    );

    $compile(el)(scope);
    scope.$digest();

    $.fx.off = true;

    isolateScopeFieldset = el.find('.mw-timeline-fieldset').isolateScope();
  }));

  it('should have one timeline, one fieldset, one entry and not be collapsable',
    function () {
      el = angular.element(
        '<div mw-timeline collection="collection">' +
        '<div mw-timeline-fieldset mw-title="title">' +
        '<div mw-timeline-entry>' +
        '</div>' +
        '</div>' +
        '</div>'
      );

      $compile(el)(scope);
      scope.$digest();
      isolateScopeFieldset = el.find('.mw-timeline-fieldset').isolateScope();

      expect(isolateScopeFieldset.collapsable).toBeFalsy();
      expect(isolateScopeFieldset.entriesVisible).toBeTruthy();

      expect(el.hasClass('mw-timeline')).toBeTruthy();
      expect(el.find('.timeline-entry-list').length).toBe(1);
      expect(el.find('.timeline-entry').length).toBe(1);

      expect(el.find('fieldset').hasClass('collapsable')).toBeFalsy();
      expect(el.find('.toggler').length).toBe(0);
    });

  it('fieldsets should be visible on default when collapsable is enabled',
    function () {
      expect(el.find('fieldset').hasClass('collapsable')).toBeTruthy();
      expect(el.find('fieldset').hasClass('entries-are-hidden')).toBeFalsy();

      expect(isolateScopeFieldset.collapsable).toBeTruthy();
      expect(isolateScopeFieldset.entriesVisible).toBeTruthy();

      expect(el.find('.hidden-entries').hasClass('ng-hide')).toBeTruthy();
      expect(el.find('.timeline-entry-list').hasClass('ng-hide')).toBeFalsy();
    });

  it('fieldsets should be hidden when collapsed',
    function () {
      expect(isolateScopeFieldset.collapsable).toBeTruthy();
      expect(isolateScopeFieldset.entriesVisible).toBeTruthy();

      isolateScopeFieldset.toggleEntries();
      scope.$digest();

      expect(el.find('fieldset').hasClass('collapsable')).toBeTruthy();
      expect(el.find('fieldset').hasClass('entries-are-hidden')).toBeTruthy();

      expect(isolateScopeFieldset.collapsable).toBeTruthy();
      expect(isolateScopeFieldset.entriesVisible).toBeFalsy();

      expect(el.find('.hidden-entries').hasClass('ng-hide')).toBeFalsy();
      expect(el.find('.timeline-entry-list').hasClass('ng-hide')).toBeTruthy();
    });

  it('should show the correct amount of hidden fieldsets',
    function () {
      // one hidden fieldset
      el.find('*[mw-timeline-fieldset]').isolateScope().toggleEntries();
      scope.$digest();

      expect(isolateScopeFieldset.entries.length).toBe(1);
      expect(
        isolateScopeFieldset.hiddenEntriesText())
        .toBe('common.entriesHiddenSingular');

      // multiple fieldsets
      el = angular.element(
        '<div mw-timeline collection="collection">' +
        '<div mw-timeline-fieldset mw-title="title">' +
        '<div mw-timeline-entry>' +
        '</div>' +
        '<div mw-timeline-entry>' +
        '</div>' +
        '<div mw-timeline-entry>' +
        '</div>' +
        '</div>' +
        '</div>'
      );

      $compile(el)(scope);
      scope.$digest();
      isolateScopeFieldset = el.find('.mw-timeline-fieldset').isolateScope();
      isolateScopeFieldset.toggleEntries();
      scope.$digest();

      expect(isolateScopeFieldset.entries.length).toBe(3);
      expect(
        isolateScopeFieldset.hiddenEntriesText())
        .toBe('common.entriesHiddenPlural');

    });

  it('should resolve a promise',
    function () {
      el = angular.element(
        '<div mw-timeline-fieldset mw-title="title">' +
        '<div mw-timeline-entry>' +
        '</div>' +
        '</div>'
      );

      $compile(el)(scope);
      scope.$digest();

      var spy = jasmine.createSpy('spy');
      el.find('*[mw-timeline-entry]').scope().hide().then(spy);
      expect(spy).not.toHaveBeenCalled();
      scope.$digest();
      expect(spy).toHaveBeenCalled();
    });
});
