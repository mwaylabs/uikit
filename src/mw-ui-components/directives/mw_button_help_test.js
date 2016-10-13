describe('mwButtonHelp', function () {
  var i18n;
  var $compile;
  var $rootScope;
  var scope;
  var el;

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.UiComponents'));

  window.mockIconService();

  beforeEach(module(function ($provide) {
    $provide.service('i18n', function () {
      var i18n = jasmine.createSpyObj('i18n', ['get', 'setLocale']);
      i18n.get.and.callFake(function (input) {
        return input;
      });
      i18n.setLocale.and.callFake(function (localeId) {
        $rootScope.$broadcast('i18n:localeChanged', localeId);
      });
      return i18n;
    });
  }));

  beforeEach(inject(function (_$compile_, _i18n_, _$rootScope_) {
    i18n = _i18n_;

    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();
  }));

  afterEach(function () {
    scope.$destroy();
  });

  it('should not display the popover icon when help condition is false',
    function () {
      el = angular.element(
        '<div mw-button-help>' +
          '<button>' +
            '<span mw-button-help-condition="false" ' +
            'mw-button-help-text="text">' +
            '</span>' +
          '</button>' +
        '</div>');
      $compile(el)(scope);
      scope.$digest();

      expect(
        el.find('div')
          .eq(0)
          .hasClass('hidden'))
        .toBe(true);
    });

  it('should display the popover icon when help condition is true', function () {
      el = angular.element(
        '<div mw-button-help>' +
          '<button>' +
            '<span mw-button-help-condition="true" ' +
            'mw-button-help-text="HELP TEXT">' +
            '</span>' +
          '</button>' +
        '</div>');
      $compile(el)(scope);
      scope.$digest();

      expect(
        el.find('div')
          .eq(0)
          .hasClass('hidden'))
        .toBe(false);

      el.find('.help-icon').trigger('mouseover');

      expect(angular.element('.mw-button-help-popover').html()).toBe(
        'UiComponents.mwButtonHelp.isDisabledBecause' +
        '<ul>' +
          '<li>HELP TEXT</li>' +
        '</ul>'
      );
    });

  it('should display the popover icon when multiple help conditions are true', function () {
      el = angular.element(
        '<div mw-button-help>' +
          '<button>' +
            '<span mw-button-help-condition="true" ' +
            'mw-button-help-text="HELP TEXT1">' +
            '<span mw-button-help-condition="false" ' +
            'mw-button-help-text="HELP TEXT2">' +
            '<span mw-button-help-condition="true" ' +
            'mw-button-help-text="HELP TEXT3">' +
            '</span>' +
          '</button>' +
        '</div>');
      $compile(el)(scope);
      scope.$digest();

      expect(
        el.find('div')
          .eq(0)
          .hasClass('hidden'))
        .toBe(false);

      el.find('.help-icon').trigger('mouseover');
      expect(angular.element('.mw-button-help-popover').html()).toBe(
        'UiComponents.mwButtonHelp.isDisabledBecause' +
        '<ul>' +
          '<li>HELP TEXT3</li>' +
          '<li>HELP TEXT1</li>' +
        '</ul>'
      );
    });

  it('should display popover if help condition changes', function () {
      scope.condition1 = false;
      scope.condition2 = false;
      scope.condition3 = false;

      el = angular.element(
        '<div mw-button-help>' +
          '<button>' +
            '<span mw-button-help-condition="condition1" ' +
            'mw-button-help-text="HELP TEXT1">' +
            '<span mw-button-help-condition="condition2" ' +
            'mw-button-help-text="HELP TEXT2">' +
            '<span mw-button-help-condition="condition3" ' +
            'mw-button-help-text="HELP TEXT3">' +
            '</span>' +
          '</button>' +
        '</div>');
      $compile(el)(scope);
      scope.$digest();

      expect(
        el.find('div')
          .eq(0)
          .hasClass('hidden'))
        .toBe(true);

      scope.condition2 = true;
      scope.$digest();

      expect(
        el.find('div')
          .eq(0)
          .hasClass('hidden'))
        .toBe(false);

      el.find('.help-icon').trigger('mouseover');
      expect(angular.element('.mw-button-help-popover').html()).toBe(
        'UiComponents.mwButtonHelp.isDisabledBecause' +
        '<ul>' +
          '<li>HELP TEXT2</li>' +
        '</ul>'
      );
    });


  it('should remove popover on $destroy event', function () {
    scope.condition1 = true;
    scope.text = 'Yo';

    el = angular.element(
      '<div mw-button-help>' +
      '<button>' +
      '<span mw-button-help-condition="condition1" ' +
      'mw-button-help-text="{{text}}">' +
      '</span>' +
      '</button>' +
      '</div>');
    $compile(el)(scope);
    scope.$digest();

    expect(
      el.find('div')
        .eq(0)
        .hasClass('hidden'))
      .toBe(false);

    el.find('.help-icon').trigger('mouseover');
    expect(angular.element('.mw-button-help-popover').html()).toBe(
      'UiComponents.mwButtonHelp.isDisabledBecause' +
      '<ul>' +
      '<li>Yo</li>' +
      '</ul>'
    );

    scope.$destroy();
    scope.$digest();

    expect(angular.element('.mw-button-help-popover').html()).toBeFalsy();
  });

  it('should change locale', function () {

    scope.condition1 = true;
    scope.text = 'Yo';

    el = angular.element(
      '<div mw-button-help>' +
        '<button>' +
          '<span mw-button-help-condition="condition1" ' +
                'mw-button-help-text="{{text}}">' +
          '</span>' +
        '</button>' +
      '</div>');
    $compile(el)(scope);
    scope.$digest();

    expect(i18n.get.calls.count()).toBe(1);

    i18n.setLocale('en_US');

    scope.$digest();

    expect(i18n.get.calls.count()).toBe(2);
  });

});
