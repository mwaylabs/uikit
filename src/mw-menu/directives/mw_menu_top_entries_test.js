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

  beforeEach(function () {
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  describe('building the menu', function () {
    it('uses mw-top-item-directive for menu entries', function () {
      var el = this.buildMenuEl('<div mw-menu-entry label="abc" url="abc"></div>');
      this.$scope.$digest();
      this.$timeout.flush();

      expect(el.find('.mw-menu-top-item').length).toBe(1);
    });

    it('uses mw-top-item-directive for menu dividers', function () {
      var el = this.buildMenuEl('<div mw-menu-entry label="abc" url="abc"></div>');
      this.$scope.$digest();
      this.$timeout.flush();

      expect(el.find('.mw-menu-top-item').length).toBe(1);
    });

    it('uses mw-top-item-drop-down-directive for menu entries that have nested entries', function () {
      var el = this.buildMenuEl('' +
        '<div mw-menu-entry label="abc" url="abc">' +
        '<div mw-menu-entry label="sub_abc" url="abc/sub">' +
        '</div>'
      );
      this.$scope.$digest();
      this.$timeout.flush();

      expect(el.find('.mw-menu-top-drop-down-item').length).toBe(1);
    });

    it('removes items from the visible menu when they are removed from the menu', function(){
      var el = this.buildMenuEl('' +
        '<div mw-menu-entry label="abc" url="abc">' +
        '<div ng-if="isVisible" mw-menu-entry label="sub_abc" url="abc/sub1"></div>' +
        '<div mw-menu-entry label="sub_abc2" url="abc/sub2"></div>' +
        '</div>'
      );
      this.$scope.isVisible = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.isVisible = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      expect(el.find('a[href="abc/sub1"]').length).toBe(0);
      expect(el.find('a[href="abc/sub2"]').length).toBe(1);
    });

    it('add items to the visible menu when they are removed from the menu', function(){
      var el = this.buildMenuEl('' +
        '<div mw-menu-entry label="abc" url="abc">' +
        '<div ng-if="isVisible" mw-menu-entry label="sub_abc" url="abc/sub1"></div>' +
        '<div mw-menu-entry label="sub_abc2" url="abc/sub2"></div>' +
        '</div>'
      );
      this.$scope.isVisible = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.isVisible = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      expect(el.find('a[href="abc/sub1"]').length).toBe(1);
    });

    it('resorts items to the visible menu when the order is changing', function(){
      var el = this.buildMenuEl('' +
        '<div mw-menu-entry label="abc" url="abc">' +
        '<div mw-menu-entry label="sub_abc1" url="abc/sub1" order="order"></div>' +
        '<div mw-menu-entry label="sub_abc2" url="abc/sub2"></div>' +
        '</div>'
      );
      this.$scope.order = 1;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.order = 3;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      jasmine.clock().tick(1);
      this.$timeout.flush();

      expect(el.find('.mw-menu-top-drop-down-item ul li a').first().attr('href')).toBe('abc/sub2');
      expect(el.find('.mw-menu-top-drop-down-item ul li a').last().attr('href')).toBe('abc/sub1');
    });
  });
});
