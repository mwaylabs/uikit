'use strict';

describe('mwUi mwMultiSelectBoxes', function(){
  var inputCollection,
      selectedCollection,
      scope,
      element,
      $rootScope,
      $compile;

  beforeEach(module('mCAP'));
  beforeEach(module('karmaDirectiveTemplates'));
  beforeEach(module('mwUI'));

  beforeEach(function(){
    inputCollection = new mCAP.Collection();
    for(var i=0;i<10;i++){
      inputCollection.add(new mCAP.Model({uuid: i}));
    }
    selectedCollection = new mCAP.Collection();
  });

  beforeEach(module(function($provide){
    $provide.value('i18n', function(){
      var i18n = jasmine.createSpyObj('i18n', ['get']);
      i18n.get.and.returnValue('not_translated');
      return i18n;
    });
    $provide.value('i18nFilter', function(){
      return function(input){
        return input;
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    scope = _$rootScope_.$new();
    scope.inputCollection = inputCollection;
    scope.selectedCollection = selectedCollection;

    element = _$compile_('<div mw-multi-select-boxes mw-options-collection="inputCollection" mw-collection="selectedCollection"></div>')(scope);
    scope.$digest();
  }));


  it('should display one selectbox in initial state', function(){
    expect(element.find('select').length).toBe(1);
  });

  it('should not select anything in initial state', function(){
    expect(scope.selectedCollection.length).toBe(0);
  });

  it('should enable the add button when a selectbox has an active option', function(){
    var scope = $rootScope.$new(),
        isolateScope;
    scope.inputCollection = inputCollection;
    scope.selectedCollection = selectedCollection;
    element = $compile('<div mw-multi-select-boxes mw-options-collection="inputCollection" mw-collection="selectedCollection"></div>')(scope);
    scope.$digest();
    isolateScope = element.isolateScope();
    expect(element.find('button.add[disabled]').length).toBe(1);
    isolateScope.viewModel.tmpModel.set('uuid',1);
    scope.$digest();
    expect(element.find('button.add[disabled]').length).toBe(0);
  });

  it('should remove model from option list on add', function(){
    var scope = $rootScope.$new(),
      isolateScope;
    scope.inputCollection = inputCollection;
    scope.selectedCollection = selectedCollection;
    element = $compile('<div mw-multi-select-boxes mw-options-collection="inputCollection" mw-collection="selectedCollection"></div>')(scope);
    scope.$digest();
    isolateScope = element.isolateScope();
    expect(inputCollection.length).toBe(10);
    expect(selectedCollection.length).toBe(0);
    isolateScope.add(inputCollection.at(0));
    scope.$digest();
    expect(inputCollection.length).toBe(9);
    expect(selectedCollection.length).toBe(1);
    expect(selectedCollection.first().id).toBe(0);
  });

  it('should add model to option list when it is removed from the selected list', function(){
    var scope = $rootScope.$new(),
      isolateScope;
    scope.inputCollection = inputCollection;
    scope.selectedCollection = selectedCollection;
    scope.selectedCollection.add(scope.inputCollection.at(0));
    element = $compile('<div mw-multi-select-boxes mw-options-collection="inputCollection" mw-collection="selectedCollection"></div>')(scope);
    scope.$digest();
    isolateScope = element.isolateScope();
    expect(inputCollection.length).toBe(9);
    expect(selectedCollection.length).toBe(1);
    isolateScope.remove(selectedCollection.at(0));
    scope.$digest();
    expect(inputCollection.length).toBe(10);
    expect(selectedCollection.length).toBe(0);
  });


  it('should not show already selected items in the options', function(){
    var scope = $rootScope.$new();
    scope.inputCollection = inputCollection;
    scope.selectedCollection = selectedCollection;
    scope.selectedCollection.add(scope.inputCollection.at(0));
    scope.selectedCollection.add(scope.inputCollection.at(1));
    scope.selectedCollection.add(scope.inputCollection.at(2));

    element = $compile('<div mw-multi-select-boxes mw-options-collection="inputCollection" mw-collection="selectedCollection"></div>')(scope);
    scope.$digest();

    expect(element.find('ul li').length).toBe(3);
    //has to be 8 because it should not show the already selected ones (10-3=7) but is has to show the currently selected one (7+1=8)
    expect(element.find('select:first > option').length).toBe(8);
  });

});