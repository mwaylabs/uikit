'use strict';

describe('mwUi menu toggle active class directive', function () {
  beforeEach(module('mwUI.Menu'));

  beforeEach(function () {
    module(function ($provide) {
      var _url = '/';
      $provide.service('$location', function ($rootScope) {
        return {
          url: function () {
            return _url;
          },
          setUrl: function(url){
            _url = url;
            $rootScope.$broadcast('$locationChangeSuccess');
          }
        };
      });
    });
  });

  beforeEach(inject(function ($rootScope, $timeout, $compile, $location) {
    this.$rootScope = $rootScope;
    this.$scope = $rootScope.$new();
    this.$timeout = $timeout;
    this.$compile = $compile;
    this.$location = $location;
    this.element = this.$compile('<div mw-menu-toggle-active-class="entry"></div>')(this.$scope);
    this.$scope.entry = new mwUI.Menu.MwMenuEntry({
      id: 1,
      label: 'xxx',
      url: '/xxx'
    });
  }));

  afterEach(function () {
    this.$location.setUrl('/');
  });

  it('sets active class when url of entry matches with current url', function () {
    this.$location.setUrl('/xxx');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeTruthy();
  });

  it('sets active class when url of sub entry matches with current url', function () {
    this.$scope.entry = new mwUI.Menu.MwMenuEntry({
      id: 1,
      label: 'xxx',
      url: '/abc',
      subEntries: [{
        id: 2,
        label: 'sub_xxx',
        url: '/abc/xxx'
      }]
    });
    this.$location.setUrl('/abc/xxx');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeTruthy();
  });

  it('has no active class when url of entry does not match with current url', function () {
    this.$location.setUrl('/abc');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeFalsy();
  });

  it('has active class when url is changing and url is now matching', function () {
    this.$location.setUrl('/abc');
    this.$scope.$digest();
    this.$timeout.flush();

    this.$location.setUrl('/xxx');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeTruthy();
  });

  it('has active class when url is changing and url of sub entry is now matching', function () {
    this.$scope.entry = new mwUI.Menu.MwMenuEntry({
      id: 1,
      label: 'xxx',
      url: '/xxx',
      subEntries: [{
        id: 2,
        label: 'sub_xxx',
        url: '/abc/xxx'
      }]
    });
    this.$location.setUrl('/abc');
    this.$scope.$digest();
    this.$timeout.flush();

    this.$location.setUrl('/abc/xxx');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeTruthy();
  });

  it('has no active class when url is changing and url is not matching anymore', function () {
    this.$location.setUrl('/xxx');
    this.$scope.$digest();
    this.$timeout.flush();

    this.$location.setUrl('/abc');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeFalsy();
  });

  it('has no active class when url is changing and url of sub entry is not matching anymore', function () {
    this.$scope.entry = new mwUI.Menu.MwMenuEntry({
      id: 1,
      label: 'xxx',
      url: '/xxx',
      subEntries: [{
        id: 2,
        label: 'sub_xxx',
        url: '/abc/xxx'
      }]
    });
    this.$location.setUrl('/abc/xxx');
    this.$scope.$digest();
    this.$timeout.flush();

    this.$location.setUrl('/abc');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeFalsy();
  });
});
