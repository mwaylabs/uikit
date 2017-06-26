'use strict';

describe('MwListCollectionFilter', function() {
  var $q,
    MwListCollectionFilter,
    filterInLocalStorage,
    currentUserUuid,
    FilterHolderProviderSpy,
    FilterHolderSpy,
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
      this.fetch = function(){
        var dfd = $q.defer();
        dfd.resolve([]);
        return dfd.promise;
      };
      this.get = function(filter){
        if(filter.id === 'BELONGS_TO_USER'){
          return true;
        } else {
          return false;
        }
      };
    };

    //create spies to mimic output-methods to external real context
    FilterHolderProviderSpy = { createFilterHolder: function() {}};

    FilterHolderSpy = {
      get: function() {},
      set: function(value) {}
    };

    //redirect calls-to-this-external-methods to the stubs / spies
    $provide.value('LocalForage', LocalForageStub);
    $provide.value('FilterHoldersCollection', FilterHolderStub);
    $provide.value('FilterHolderProvider', FilterHolderProviderSpy);

    //spy on these methods to see if they get called
    spyOn(FilterHolderProviderSpy, 'createFilterHolder').and.returnValue(FilterHolderSpy);
    spyOn(FilterHolderSpy, 'set');

    currentUserUuid = null;
  }));


  beforeEach(inject(function(_$rootScope_, _MwListCollectionFilter_, _$q_) {
    $rootScope = _$rootScope_;
    MwListCollectionFilter = _MwListCollectionFilter_;
    $q = _$q_;
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

    it('return true when current user is the filter owner', function(done) {
      listCollectionFilter.filterWasSetByUser({id: 'BELONGS_TO_USER'}).then(function(belongsToUser){
        expect(belongsToUser).toBeTruthy();
        done();
      });
      $rootScope.$digest();
    });

    it('returns false when current user is not the filter owner', function(done) {
      listCollectionFilter.filterWasSetByUser({id: 'BELONGS_NOT_TO_USER'}).then(function(belongsToUser){
        expect(belongsToUser).toBeFalsy();
        done();
      });
      $rootScope.$digest();
    });
  });

});