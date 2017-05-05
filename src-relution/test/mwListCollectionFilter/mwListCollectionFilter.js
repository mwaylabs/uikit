'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter,
    filterInLocalStorage,
    currentUserUuid,
    FilterHolderProviderSpy,
    FilterHolderSpy,
    AuthenticatedUserSpy,
    $rootScope;

  beforeEach(module('mwCollection'));

  beforeEach(module(function($provide) {
    //create stubs to mimic external input-methods from the real context
    var LocalForageStub = {
      getItem: function(dummyParameter) {
        return {
          then: function() {
            return filterInLocalStorage;
          }
        };
      }
    };

    var FilterHolderStub = function (dummy, type) {
      this.type = type;
    };

    //create spies to mimic output-methods to external real context
    FilterHolderProviderSpy = { createFilterHolder: function() {}};

    FilterHolderSpy = {
      get: function() {},
      set: function(value) {}
    };

    AuthenticatedUserSpy = {
      get: function() {},
      set: function(attr, val){
        if(attr === 'uuid'){
          currentUserUuid = val;
          if(this.callback){
            this.callback();
          }
        }
      },
      once: function(evName, callback){
        this.callback = callback
      }
    };

    //redirect calls-to-this-external-methods to the stubs / spies
    $provide.value('LocalForage', LocalForageStub);
    $provide.value('FilterHoldersCollection', FilterHolderStub);
    $provide.value('FilterHolderProvider', FilterHolderProviderSpy);
    $provide.value('AuthenticatedUser', AuthenticatedUserSpy);

    //spy on these methods to see if they get called
    spyOn(FilterHolderProviderSpy, 'createFilterHolder').and.returnValue(FilterHolderSpy);
    spyOn(FilterHolderSpy, 'set');
    spyOn(AuthenticatedUserSpy, 'get').and.callFake(function(attr){
      if(attr === 'authenticated'){
        return !!currentUserUuid;
      }
      return currentUserUuid;
    });

    currentUserUuid = null;
  }));


  beforeEach(inject(function(_$rootScope_, _MwListCollectionFilter_) {
    $rootScope = _$rootScope_;
    MwListCollectionFilter = _MwListCollectionFilter_;
  }));



  describe('fetching applied filters', function() {
    var listCollectionFilter;

    beforeEach(function() {
      listCollectionFilter = new MwListCollectionFilter('IRRELEVANT');
    });

    it('returns null if no applied filter is in localstorage', function() {
      filterInLocalStorage = null;

      var appliedFilter = listCollectionFilter.fetchAppliedFilter();

      expect(appliedFilter).toBeNull();
    });

    it('returns filter in localstorage if present', function() {
      filterInLocalStorage = 'IRRELEVANT';

      var appliedFilter = listCollectionFilter.fetchAppliedFilter();

      expect(appliedFilter).not.toBeNull();
    });

    it('waits until the user is authenticated before setting appliedfilter', function(done) {
      var filterInLocalStorage = {
        aclEntries: ['USER1:rw']
      };
      listCollectionFilter._setAppliedFilter(filterInLocalStorage).then(function(){
        done();
      });

      AuthenticatedUserSpy.set('uuid', 'USER1');
      $rootScope.$digest();
    });

    it('sets applied filter when current user is the filter owner', function(done) {
      var filterInLocalStorage = {
        aclEntries: ['USER1:rw']
      };

      listCollectionFilter._setAppliedFilter(filterInLocalStorage).then(function(appliedFilter){
        expect(appliedFilter).not.toBeNull();
        expect(FilterHolderSpy.set).toHaveBeenCalledWith(filterInLocalStorage);
        done();
      });

      AuthenticatedUserSpy.set('uuid', 'USER1');
      $rootScope.$digest();
    });

    it('does not set applied filter when current user is not the filter owner', function(done) {
      var filterInLocalStorage = {
        aclEntries: ['USER1:rw']
      };
      listCollectionFilter._setAppliedFilter(filterInLocalStorage).then(function(appliedFilter){
        expect(appliedFilter).not.toBeNull();
        expect(FilterHolderSpy.set).not.toHaveBeenCalledWith(filterInLocalStorage);
        done();
      });

      AuthenticatedUserSpy.set('uuid', 'USER2');
      $rootScope.$digest();
    });
  });

});