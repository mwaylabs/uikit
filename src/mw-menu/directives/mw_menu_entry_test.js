'use strict';

describe('mwUi menu entry directive', function () {
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

  it('registers mw-menu-entry', function () {
    this.buildMenuEl('<div mw-menu-entry label="xxx" url="xxx"></div>');
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.length).toBe(1);
    expect(this.menu.first().get('label')).toBe('xxx');
  });

  it('unregisters mw-menu-entry when element is removed', function () {
    this.buildMenuEl('<div ng-if="displayEntry" mw-menu-entry label="xxx" url="xxx"></div>');
    this.$scope.displayEntry = true;
    jasmine.clock().tick(1);
    this.$scope.$digest();
    this.$timeout.flush();

    this.$scope.displayEntry = false;
    jasmine.clock().tick(1);
    this.$scope.$digest();

    expect(this.menu.length).toBe(0);
  });

  it('sets order by it itself by using the position where it is in the dom and sort entries by it', function () {
    this.buildMenuEl('' +
      '<div mw-menu-entry label="xxx1" url="xxx1"></div>' +
      '<div mw-menu-entry label="xxx2" url="xxx2"></div>' +
      '<div mw-menu-entry label="xxx3" url="xxx3"></div>'
    );

    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.length).toBe(3);
    expect(this.menu.findWhere({label: 'xxx1'}).get('order')).toBe(1);
    expect(this.menu.findWhere({label: 'xxx2'}).get('order')).toBe(2);
    expect(this.menu.findWhere({label: 'xxx3'}).get('order')).toBe(3);
  });

  it('sets order without carring when it is wrapped in another element', function () {
    this.buildMenuEl('' +
      '<div mw-menu-entry label="xxx1" url="xxx1"></div>' +
      '<div><div><div><div mw-menu-entry label="xxx2" url="xxx2"></div></div></div></div>' +
      '<div><div mw-menu-entry label="xxx3" url="xxx3"></div></div>'
    );

    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.length).toBe(3);
    expect(this.menu.findWhere({label: 'xxx1'}).get('order')).toBe(1);
    expect(this.menu.findWhere({label: 'xxx2'}).get('order')).toBe(2);
    expect(this.menu.findWhere({label: 'xxx3'}).get('order')).toBe(3);
  });

  it('is possible to define custom order order by it itself by using the position where it is in the dom', function () {
    this.buildMenuEl('' +
      '<div mw-menu-entry label="xxx1" url="xxx1" order="3"></div>' +
      '<div mw-menu-entry label="xxx2" url="xxx2" order="1"></div>' +
      '<div mw-menu-entry label="xxx3" url="xxx3" order="2"></div>'
    );

    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.length).toBe(3);
    expect(this.menu.findWhere({label: 'xxx1'}).get('order')).toBe(3);
    expect(this.menu.findWhere({label: 'xxx2'}).get('order')).toBe(1);
    expect(this.menu.findWhere({label: 'xxx3'}).get('order')).toBe(2);
  });

  it('sorts elements by its order', function () {
    this.buildMenuEl('' +
      '<div mw-menu-entry label="xxx1" url="xxx1" order="3"></div>' +
      '<div mw-menu-entry label="xxx2" url="xxx2" order="1"></div>' +
      '<div mw-menu-entry label="xxx3" url="xxx3" order="2"></div>'
    );

    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.at(0).get('label')).toBe('xxx2');
    expect(this.menu.at(1).get('label')).toBe('xxx3');
    expect(this.menu.at(2).get('label')).toBe('xxx1');
  });

  it('keeps order when element is removed from dom', function () {
    this.buildMenuEl('' +
      '<div mw-menu-entry label="xxx1" url="xxx1"></div>' +
      '<div mw-menu-entry label="xxx2" url="xxx2" ng-if="displayEntry"></div>' +
      '<div mw-menu-entry label="xxx3" url="xxx3"></div>'
    );
    this.$scope.displayEntry = true;
    jasmine.clock().tick(1);
    this.$scope.$digest();
    this.$timeout.flush();

    this.$scope.displayEntry = false;
    jasmine.clock().tick(1);
    this.$scope.$digest();

    expect(this.menu.at(0).get('label')).toBe('xxx1');
    expect(this.menu.at(1).get('label')).toBe('xxx3');
  });

  it('keeps order when element becomes visible later on', function () {
    this.buildMenuEl('' +
      '<div mw-menu-entry label="xxx1" url="xxx1"></div>' +
      '<div mw-menu-entry label="xxx2" url="xxx2" ng-if="displayEntry"></div>' +
      '<div mw-menu-entry label="xxx3" url="xxx3"></div>'
    );
    this.$scope.displayEntry = false;
    jasmine.clock().tick(1);
    this.$scope.$digest();
    this.$timeout.flush();

    this.$scope.displayEntry = true;
    jasmine.clock().tick(1);
    this.$scope.$digest();
    this.$timeout.flush();


    expect(this.menu.at(0).get('label')).toBe('xxx1');
    expect(this.menu.at(1).get('label')).toBe('xxx2');
    expect(this.menu.at(2).get('label')).toBe('xxx3');
  });

  it('keeps order when element is removed from dom and re-added later on', function () {
    this.buildMenuEl('' +
      '<div mw-menu-entry label="xxx1" url="xxx1"></div>' +
      '<div mw-menu-entry label="xxx2" url="xxx2" ng-if="displayEntry"></div>' +
      '<div mw-menu-entry label="xxx3" url="xxx3"></div>'
    );
    this.$scope.displayEntry = true;
    jasmine.clock().tick(1);
    this.$scope.$digest();
    this.$timeout.flush();
    this.$scope.displayEntry = false;
    this.$scope.$digest();

    this.$scope.displayEntry = true;
    jasmine.clock().tick(1);
    this.$scope.$digest();
    this.$timeout.flush();

    expect(this.menu.at(0).get('label')).toBe('xxx1');
    expect(this.menu.at(1).get('label')).toBe('xxx2');
    expect(this.menu.at(2).get('label')).toBe('xxx3');
  });

  describe('nested sub-entries', function () {
    it('can nest entries', function () {
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1">' +
        '<div mw-menu-entry label="xxx1_sub1" url="xxx1_sub1"></div>' +
        '<div mw-menu-entry label="xxx1_sub2" url="xxx1_sub2"></div>' +
        '<div mw-menu-entry label="xxx1_sub3" url="xxx1_sub3"></div>' +
        '</div>'
      );

      this.$scope.$digest();
      this.$timeout.flush();

      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').length).toBe(3);
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(0).get('label')).toBe('xxx1_sub1');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(2).get('label')).toBe('xxx1_sub3');
    });

    it('gives nested entries an order number in dependency of their dom position', function () {
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1">' +
        '<div mw-menu-entry label="xxx1_sub1" url="xxx1_sub1"></div>' +
        '<div><div><div mw-menu-entry label="xxx1_sub2" url="xxx1_sub2"></div></div></div>' +
        '<div mw-menu-entry label="xxx1_sub3" url="xxx1_sub3"></div>' +
        '</div>'
      );

      this.$scope.$digest();
      this.$timeout.flush();

      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').findWhere({label: 'xxx1_sub1'}).get('order')).toBe(1);
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').findWhere({label: 'xxx1_sub2'}).get('order')).toBe(2);
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').findWhere({label: 'xxx1_sub3'}).get('order')).toBe(3);
    });

    it('keeps order when element is becoming visible later on', function () {
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1">' +
        '<div mw-menu-entry label="xxx1_sub1" url="xxx1_sub1"></div>' +
        '<div ng-if="displayEntry"><div mw-menu-entry label="xxx1_sub2" url="xxx1_sub2"></div></div>' +
        '<div mw-menu-entry label="xxx1_sub3" url="xxx1_sub3"></div>' +
        '</div>'
      );
      this.$scope.displayEntry = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.displayEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(0).get('label')).toBe('xxx1_sub1');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(1).get('label')).toBe('xxx1_sub2');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(2).get('label')).toBe('xxx1_sub3');
    });

    it('keeps order when element is removed', function () {
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1">' +
        '<div mw-menu-entry label="xxx1_sub1" url="xxx1_sub1"></div>' +
        '<div ng-if="displayEntry"><div mw-menu-entry label="xxx1_sub2" url="xxx1_sub2"></div></div>' +
        '<div mw-menu-entry label="xxx1_sub3" url="xxx1_sub3"></div>' +
        '</div>'
      );
      this.$scope.displayEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.displayEntry = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(0).get('label')).toBe('xxx1_sub1');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(1).get('label')).toBe('xxx1_sub3');
    });

    it('keeps order when element is removed and added later on', function () {
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1">' +
        '<div mw-menu-entry label="xxx1_sub1" url="xxx1_sub1"></div>' +
        '<div ng-if="displayEntry"><div mw-menu-entry label="xxx1_sub2" url="xxx1_sub2"></div></div>' +
        '<div mw-menu-entry label="xxx1_sub3" url="xxx1_sub3"></div>' +
        '</div>'
      );
      this.$scope.displayEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();
      this.$scope.displayEntry = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.displayEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(0).get('label')).toBe('xxx1_sub1');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(1).get('label')).toBe('xxx1_sub2');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(2).get('label')).toBe('xxx1_sub3');
    });

    it('keeps order when parent element becomes visible', function () {
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1" ng-if="displayEntry">' +
        '<div mw-menu-entry label="xxx1_sub1" url="xxx1_sub1"></div>' +
        '<div mw-menu-entry label="xxx1_sub2" url="xxx1_sub2"></div>' +
        '<div mw-menu-entry label="xxx1_sub3" url="xxx1_sub3"></div>' +
        '</div>'
      );
      this.$scope.displayEntry = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.displayEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(0).get('label')).toBe('xxx1_sub1');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(1).get('label')).toBe('xxx1_sub2');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(2).get('label')).toBe('xxx1_sub3');
    });

    it('keeps order when parent element is removed and added later on', function () {
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1" ng-if="displayEntry">' +
        '<div mw-menu-entry label="xxx1_sub1" url="xxx1_sub1"></div>' +
        '<div mw-menu-entry label="xxx1_sub2" url="xxx1_sub2"></div>' +
        '<div mw-menu-entry label="xxx1_sub3" url="xxx1_sub3"></div>' +
        '</div>'
      );
      this.$scope.displayEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();
      this.$scope.displayEntry = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.displayEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(0).get('label')).toBe('xxx1_sub1');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(1).get('label')).toBe('xxx1_sub2');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(2).get('label')).toBe('xxx1_sub3');
    });

    it('keeps order when parent element and nested elment is removed and added later on', function () {
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1" ng-if="displayParentEntry">' +
        '<div mw-menu-entry label="xxx1_sub1" url="xxx1_sub1"></div>' +
        '<div mw-menu-entry label="xxx1_sub2" url="xxx1_sub2" ng-if="displaySubEntry"></div>' +
        '<div mw-menu-entry label="xxx1_sub3" url="xxx1_sub3"></div>' +
        '</div>'
      );
      this.$scope.displaySubEntry = true;
      this.$scope.displayParentEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.displaySubEntry = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();
      this.$scope.displaySubEntry = true;
      this.$scope.displayParentEntry = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();
      this.$scope.displayParentEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();
      this.$scope.displaySubEntry = false;
      this.$scope.displayParentEntry = false;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();
      this.$scope.displaySubEntry = true;
      this.$scope.displayParentEntry = true;
      jasmine.clock().tick(1);
      this.$scope.$digest();
      this.$timeout.flush();

      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(0).get('label')).toBe('xxx1_sub1');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(1).get('label')).toBe('xxx1_sub2');
      expect(this.menu.findWhere({label: 'xxx1'}).get('subEntries').at(2).get('label')).toBe('xxx1_sub3');
    });
  });

  describe('updating entry', function(){
    it('updates id', function(){
      this.$scope.id = 'ABC';
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1", id="{{id}}"></div>'
      );
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.id = 'XXX';
      this.$scope.$digest();

      expect(this.menu.first().get('id')).toBe('XXX');
    });

    it('updates label', function(){
      this.$scope.label = 'ABC';
      this.buildMenuEl('' +
        '<div mw-menu-entry label="{{label}}" url="xxx1"></div>'
      );
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.label = 'XXX';
      this.$scope.$digest();

      expect(this.menu.first().get('label')).toBe('XXX');
    });

    it('updates url', function(){
      this.$scope.url = 'ABC';
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="{{url}}"></div>'
      );
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.url = 'XXX';
      this.$scope.$digest();

      expect(this.menu.first().get('url')).toBe('XXX');
    });

    it('updates icon', function(){
      this.$scope.icon = 'ABC';
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1" icon="{{icon}}"></div>'
      );
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.icon = 'XXX';
      this.$scope.$digest();

      expect(this.menu.first().get('icon')).toBe('XXX');
    });

    it('updates class', function(){
      this.$scope.class = 'ABC';
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1" style-class="{{class}}"></div>'
      );
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.class = 'XXX';
      this.$scope.$digest();

      expect(this.menu.first().get('class')).toBe('XXX');
    });

    it('updates order and reorders entries', function(){
      this.$scope.order = 1;
      this.buildMenuEl('' +
        '<div mw-menu-entry label="xxx1" url="xxx1" order="order"></div>' +
        '<div mw-menu-entry label="xxx2" url="xxx2" order="2"></div>' +
        '<div mw-menu-entry label="xxx3" url="xxx3" order="3"></div>'
      );
      this.$scope.$digest();
      this.$timeout.flush();

      this.$scope.order = 4;
      this.$scope.$digest();
      jasmine.clock().tick(1);
      this.$timeout.flush();

      expect(this.menu.findWhere({url: 'xxx1'}).get('order')).toBe(4);
      expect(this.menu.first().get('label')).toBe('xxx2');
      expect(this.menu.last().get('label')).toBe('xxx1');
    });
  });
});
