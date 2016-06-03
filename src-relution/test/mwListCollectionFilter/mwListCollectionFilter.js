'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter,
    filterInLocalStorage,
    currentUserUuid = 'userUuid',
    MCAPFilterHolderProviderSpy,
    MCAPFilterHolderSpy,
    MCAPAuthenticatedUserSpy;

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

    var MCAPFilterHolderStub = function (dummy, type) {
      this.type = type;
    };

    //create spies to mimic output-methods to external real context
    MCAPFilterHolderProviderSpy = { createFilterHolder: function() {}};

    MCAPFilterHolderSpy = {
      get: function() {},
      set: function(value) {}
    };

    MCAPAuthenticatedUserSpy = {
      get: function() {}
    };

    //redirect calls-to-this-external-methods to the stubs / spies
    $provide.value('LocalForage', LocalForageStub);
    $provide.value('MCAPFilterHolders', MCAPFilterHolderStub);
    $provide.value('MCAPFilterHolderProvider', MCAPFilterHolderProviderSpy);
    $provide.value('MCAPauthenticatedUser', MCAPAuthenticatedUserSpy);

    //spy on these methods to see if they get called
    spyOn(MCAPFilterHolderProviderSpy, 'createFilterHolder').and.returnValue(MCAPFilterHolderSpy);
    spyOn(MCAPFilterHolderSpy, 'set');
    spyOn(MCAPAuthenticatedUserSpy, 'get').and.returnValue(currentUserUuid);
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
      expect(MCAPFilterHolderSpy.set).not.toHaveBeenCalledWith(filterInLocalStorage);
    });

    it('sets appliedfilter if current user uuid matches with the filter owner', function() {
      currentUserUuid = 'DFD04C8B-519A-4D0A-BE60-F47EB4D563E8';
      var filterInLocalStorage = {
        acl: currentUserUuid + ':rw'
      };

      var appliedFilter = listCollectionFilter._setAppliedFilter(filterInLocalStorage);

      expect(appliedFilter).not.toBeNull();
      expect(MCAPFilterHolderSpy.set).toHaveBeenCalledWith(filterInLocalStorage);
    });
  });

});