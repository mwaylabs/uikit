fdescribe('mwListUrlActionButton', function() {

  beforeEach(function() {
    module('karmaDirectiveTemplates');
    module('mwUI');
  });

  beforeEach(inject(function($compile, $rootScope, $timeout) {
    this.$compile = $compile;
    this.$timeout = $timeout;
    this.scope = $rootScope.$new();
    this.scope.action = this.action;
    this.scope.items = [{id: 1, visible: true, action: function(){}}, {id: 2, visible: true, action: function(){console.log('JAU')}}];
  }));

  it('registers the action to mw-list-body-row', function(){
    var compiledElement = this.$compile('<mw-listable-bb><mw-listable-body-row-bb><div ng-repeat="item in items" mw-listable-action="item.action"></div></mw-listable-body-row-bb></mw-listable-bb>')(this.scope);
    var mwListableBbCtrl = compiledElement.controller('mwListableBb');

    this.scope.$digest();

    expect(mwListableBbCtrl.actionColumns.length).toBe(1);
    expect(mwListableBbCtrl.actionColumns[0].actions.length).toBe(2);
  });

  it('removes the action when the scope is destroyed', function(){
    var compiledElement = this.$compile('<mw-listable-bb><mw-listable-body-row-bb><div ng-repeat="item in items" ng-if="item.visible" mw-listable-action="item.action"></div></mw-listable-body-row-bb></mw-listable-bb>')(this.scope);
    var mwListableBbCtrl = compiledElement.controller('mwListableBb');
    this.scope.$digest();
    var secFn = mwListableBbCtrl.actionColumns[0].actions[1];

    this.scope.items[0].visible = false;
    this.scope.$digest();

    expect(mwListableBbCtrl.actionColumns[0].actions[0]).toBe(secFn);
  });

  it('removes the the whole action column when the scope is destroyed and it was the only action column', function(){
    var compiledElement = this.$compile('<mw-listable-bb><mw-listable-body-row-bb><div ng-repeat="item in items" ng-if="item.visible" mw-listable-action="item.action"></div></mw-listable-body-row-bb></mw-listable-bb>')(this.scope);
    var mwListableBbCtrl = compiledElement.controller('mwListableBb');
    this.scope.$digest();

    this.scope.items[0].visible = false;
    this.scope.items[1].visible = false;
    this.scope.$digest();

    expect(mwListableBbCtrl.actionColumns.length).toBe(0);
  });

  it('uses the id of mw-list-body-row', function(){
    var compiledElement = this.$compile('<mw-listable-bb><mw-listable-body-row-bb><div ng-repeat="item in items" mw-listable-action="item.action"></div></mw-listable-body-row-bb></mw-listable-bb>')(this.scope);
    var mwListableBbCtrl = compiledElement.controller('mwListableBb');
    this.scope.$digest();
    var rowId = compiledElement.find('mw-listable-body-row-bb').scope().$id;

    expect(mwListableBbCtrl.actionColumns[0].id).toBe(rowId);
  });
});
