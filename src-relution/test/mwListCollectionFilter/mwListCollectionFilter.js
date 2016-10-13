'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter,
    filterInLocalStorage,
    currentUserUuid = 'userUuid',
    FilterHolderProviderSpy,
    FilterHolderSpy,
    AuthenticatedUserSpy;

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
      get: function() {}
    };

    //redirect calls-to-this-external-methods to the stubs / spies
    $provide.value('LocalForage', LocalForageStub);
    $provide.value('FilterHoldersCollection', FilterHolderStub);
    $provide.value('FilterHolderProvider', FilterHolderProviderSpy);
    $provide.value('AuthenticatedUser', AuthenticatedUserSpy);

    //spy on these methods to see if they get called
    spyOn(FilterHolderProviderSpy, 'createFilterHolder').and.returnValue(FilterHolderSpy);
    spyOn(FilterHolderSpy, 'set');
    spyOn(AuthenticatedUserSpy, 'get').and.returnValue(currentUserUuid);
  }));


  beforeEach(inject(function(_MwListCollectionFilter_) {
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

    it('does not set filter if the one in localstorage does not contain current users id', function() {
      var filterInLocalStorage = {
        acl: '172FB965-64B2-4B6A-BF8C-679B02460B7B:rw'
      };
      currentUserUuid = 'DFD04C8B-519A-4D0A-BE60-F47EB4D563E8';

      var appliedFilter = listCollectionFilter._setAppliedFilter(filterInLocalStorage);

      expect(appliedFilter).not.toBeNull();
      expect(FilterHolderSpy.set).not.toHaveBeenCalledWith(filterInLocalStorage);
    });

    it('sets appliedfilter if current user uuid matches with the filter owner', function() {
      currentUserUuid = 'DFD04C8B-519A-4D0A-BE60-F47EB4D563E8';
      var filterInLocalStorage = {
        acl: currentUserUuid + ':rw'
      };

      var appliedFilter = listCollectionFilter._setAppliedFilter(filterInLocalStorage);

      expect(appliedFilter).not.toBeNull();
      expect(FilterHolderSpy.set).toHaveBeenCalledWith(filterInLocalStorage);
    });
  });

});