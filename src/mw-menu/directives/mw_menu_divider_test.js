'use strict';

describe('mwUi menu divider directive', function () {
  beforeEach(module('mwUI.Menu'));

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(inject(function ($rootScope, $timeout, $compile) {
    this.$rootScope = $rootScope;
    this.$scope = $rootScope.$new();
    this.$timeout = $timeout;
    this.$compile = $compile;
    this.menu = this.$scope.menu = new mwUI.Menu.MwMenu();
    this.$scope.$digest();

    this.buildMenuEl = function (menuEntryEl) {
      var $menuTopEntriesEl = angular.element('<div mw-menu-top-entries="menu"></div>');
      $menuTopEntriesEl.append(angular.element(menuEntryEl));
      return this.$compile($menuTopEntriesEl)(this.$scope);
    };
  }));

  beforeEach(function(){
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it('registers mw-menu-divider', function () {
    this.buildMenuEl('<div mw-menu-divider></div>');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.length).toBe(1);
    expect(this.menu.first().get('type')).toBe('DIVIDER');
  });

  it('registers mw-menu-divider with a label', function () {
    this.buildMenuEl('<div mw-menu-divider label="XXX"></div>');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.first().get('label')).toBe('XXX');
  });

  it('registers mw-menu-divider with an icon', function () {
    this.buildMenuEl('<div mw-menu-divider icon="XXX"></div>');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.first().get('icon')).toBe('XXX');
  });

  it('updates icon and label', function () {
    this.$scope.label = 'XXX';
    this.$scope.icon = 'XXX';
    this.buildMenuEl('<div mw-menu-divider icon="{{icon}}" label="{{label}}"></div>');
    this.$scope.$digest();
    this.$timeout.flush();

    this.$scope.label = 'ABC';
    this.$scope.icon = 'ABC';
    this.$scope.$digest();

    expect(this.menu.first().get('label')).toBe('ABC');
    expect(this.menu.first().get('icon')).toBe('ABC');
  });
});
