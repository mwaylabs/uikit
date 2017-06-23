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

  it('is active when an isActive function is defined and the function returns true', function(){
    this.$scope.entry.set('isActive', function(){return true;});
    this.$compile('<div mw-menu-toggle-active-class="entry"></div>')(this.$scope);

    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeTruthy();
  });

  it('is not active when an isActive function is defined and the function returns false', function(){
    this.$scope.entry.set('isActive', function(){return false;});
    this.$compile('<div mw-menu-toggle-active-class="entry"></div>')(this.$scope);

    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeFalsy();
  });

  it('is still active when an isActive function is but it is not matching the current url', function(){
    this.$scope.entry.set('isActive', function(){return true;});
    this.$scope.entry.set('url', '/abc');
    this.$compile('<div mw-menu-toggle-active-class="entry"></div>')(this.$scope);

    this.$location.setUrl('/xyz');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeTruthy();
  });

  it('is sets the parent entry to active when a subentry has an isActive function', function(){
    this.$scope.entry = new mwUI.Menu.MwMenuEntry({
      id: 1,
      label: 'xxx',
      url: '/xxx',
      subEntries: [{
        id: 2,
        label: 'sub_xxx',
        url: '/abc/xxx',
        isActive: function(){return true;}
      }]
    });
    this.$compile('<div mw-menu-toggle-active-class="entry"></div>')(this.$scope);

    this.$location.setUrl('/xyz');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeTruthy();
  });

  it('does not set parent entry to active when a subentry has an isActive function but the parent has one as well', function(){
    this.$scope.entry = new mwUI.Menu.MwMenuEntry({
      id: 1,
      label: 'xxx',
      url: '/xxx',
      isActive: function(){return false;},
      subEntries: [{
        id: 2,
        label: 'sub_xxx',
        url: '/abc/xxx',
        isActive: function(){return true;}
      }]
    });
    this.$compile('<div mw-menu-toggle-active-class="entry"></div>')(this.$scope);

    this.$location.setUrl('/xyz');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeFalsy();
  });

  it('updates state when isActive function changes returns true first but changes to false later', function(){
    this.$scope.isActive = true;
    this.$scope.entry = new mwUI.Menu.MwMenuEntry({
      id: 1,
      label: 'xxx',
      url: '/xxx',
      isActive: function(){return this.$scope.isActive;}.bind(this)
    });
    this.$compile('<div mw-menu-toggle-active-class="entry"></div>')(this.$scope);
    this.$location.setUrl('/xyz');
    this.$scope.$digest();
    this.$timeout.flush();

    this.$scope.isActive = false;
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeFalsy();
  });

  it('updates state when isActive function changes returns false first but changes to true later', function(){
    this.$scope.isActive = false;
    this.$scope.entry = new mwUI.Menu.MwMenuEntry({
      id: 1,
      label: 'xxx',
      url: '/xxx',
      isActive: function(){return this.$scope.isActive;}.bind(this)
    });
    this.$compile('<div mw-menu-toggle-active-class="entry"></div>')(this.$scope);
    this.$location.setUrl('/xyz');
    this.$scope.$digest();
    this.$timeout.flush();

    this.$scope.isActive = true;
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.element.hasClass('active')).toBeTruthy();
  });
});
