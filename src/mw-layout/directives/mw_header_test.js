describe('mwHeader', function () {
  var $compile;
  var $rootScope;
  var scope;
  var el;
  var route;
  var location;
  var i18n;
  var i18nProvider;

  beforeEach(module('karmaDirectiveTemplates'));
  beforeEach(module('ngRoute'));
  beforeEach(module('mwUI.Layout'));

  beforeEach(function () {
    module('mwUI', function (_i18nProvider_) {
      i18nProvider = _i18nProvider_;
    });
  });

  beforeEach(
    inject(
      function (_$compile_, _$rootScope_, _$location_, _$route_, _i18n_) {
        i18n = _i18n_;

        i18nProvider.addLocale('de_DE', 'Deutsch');
        i18nProvider.addLocale('en_US', 'English');
        i18nProvider.addResource('i18n/a');
        i18nProvider.addResource('i18n/b');
        i18nProvider.setDefaultLocale('en_US');

        $compile = _$compile_;
        $rootScope = _$rootScope_;
        scope = _$rootScope_.$new();

        location = _$location_;
        route = _$route_;

        el = angular.element(
          '<div mw-header ' +
          'title="test" ' +
          'mw-bread-crumbs="[{title:title,url:\'#/devices\'}]" ' +
          'show-back-button="true">' +
          '<button></button>' +
          '</div>'
        );

        $compile(el)(scope);
        scope.$digest();
      }));

  it('changes location when clicking back button', function () {
    spyOn(location, 'path');

    el.isolateScope().back();

    expect(location.path).toHaveBeenCalledWith('/devices');
  });

  it('does a page refresh', function () {
    spyOn(route, 'reload');
    expect(route.reload).not.toHaveBeenCalled();

    el.isolateScope().refresh();

    expect(route.reload).toHaveBeenCalled();
  });

  it('adds class no-buttons when nothing is transcluded', function () {
    el = angular.element(
      '<div mw-header ' +
      'title="test1" ' +
      'mw-bread-crumbs="[{title:\'abc1\',url:\'#/devices\'}]" ' +
      '</div>'
    );

    $compile(el)(scope);
    scope.$digest();

    expect(el.find('.mw-header').hasClass('no-buttons')).toBeTruthy();
  });

  it('adds class no-buttons when nothing is transcluded and back buttons are disabled', function () {
    el = angular.element(
      '<div mw-header ' +
      'title="test2" ' +
      'mw-bread-crumbs="[{title:\'abc2\',url:\'#/devices\'}]" ' +
      'show-back-button="false"' +
      '</div>'
    );

    $compile(el)(scope);
    scope.$digest();

    expect(el.find('.mw-header').hasClass('no-buttons')).toBeTruthy();
  });

  it('does not add class no-buttons when nothing is transcluded and back buttons are enabled', function () {
    el = angular.element(
      '<div mw-header ' +
      'title="test3" ' +
      'mw-bread-crumbs="[{title:\'abc3\',url:\'#/devices\'}]" ' +
      'show-back-button="true"' +
      '</div>'
    );

    $compile(el)(scope);
    scope.$digest();

    expect(el.find('.mw-header').hasClass('no-buttons')).toBeFalsy();
  });

  it('removes "#" from url when calling back', function () {
    el = angular.element(
      '<div mw-header ' +
      'title="test4" ' +
      'url="#/devices" ' +
      '</div>'
    );
    $compile(el)(scope);
    scope.$digest();
    spyOn(location, 'path');

    el.isolateScope().back();

    expect(location.path).toHaveBeenCalledWith('/devices');
  });

  it('throws an error when show back button is set to true but no url is present', function () {
    el = angular.element(
      '<div mw-header ' +
      'title="test4" ' +
      'show-back-button="true"' +
      '</div>'
    );
    $compile(el)(scope);

    expect( scope.$digest).toThrow();
  });

});
