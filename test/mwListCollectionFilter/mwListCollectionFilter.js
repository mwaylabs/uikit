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
    var LocalForage = {
      getItem: function(identifier) {
        return {
          then: function() {
            return filterInLocalStorage;
          }
        };
      }
    };
    $provide.value('LocalForage', LocalForage);

    MCAPFilterHolderProviderSpy = { createFilterHolder: function() {}};
    MCAPFilterHolderSpy = {
      get: function() {},
      set: function(value) {}
    };
    spyOn(MCAPFilterHolderProviderSpy, 'createFilterHolder').and.returnValue(MCAPFilterHolderSpy);
    spyOn(MCAPFilterHolderSpy, 'set');

    $provide.value('MCAPFilterHolderProvider', MCAPFilterHolderProviderSpy);

    function MCAPFilterHolders(irrelevant, type) {
      this.type = type;
    };
    $provide.value('MCAPFilterHolders', MCAPFilterHolders);

    MCAPAuthenticatedUserSpy = { get: function() {} };
    spyOn(MCAPAuthenticatedUserSpy, 'get').and.returnValue(currentUserUuid);
    $provide.value('MCAPauthenticatedUser', MCAPAuthenticatedUserSpy);
  }));

  beforeEach(inject(function(_MwListCollectionFilter_) {
    MwListCollectionFilter = _MwListCollectionFilter_;
  }));

  describe('fetching applied filters', function() {
    it('returns null if no applied filter is in localstorage', function() {
      filterInLocalStorage = null;

      var appliedFilter = new MwListCollectionFilter('IRRELEVANT').fetchAppliedFilter();

      expect(appliedFilter).toBeNull();
    });

    it('returns filter in localstorage if present', function() {
      filterInLocalStorage = '{"content":"IRRELEVANT"}';

      var appliedFilter = new MwListCollectionFilter('IRRELEVANT').fetchAppliedFilter();

      expect(appliedFilter).not.toBeNull();
    });

    it('does not set filter if the one in localstorage does not contain current users id', function() {
      var filterInLocalStorage = {
        content:"IRRELEVANT",
        acl: "172FB965-64B2-4B6A-BF8C-679B02460B7B:rw"
      };
      currentUserUuid = 'DFD04C8B-519A-4D0A-BE60-F47EB4D563E8';

      var appliedFilter = new MwListCollectionFilter('IRRELEVANT')
        ._setAppliedFilter(filterInLocalStorage);

      expect(MCAPFilterHolderSpy.set).not.toHaveBeenCalledWith(filterInLocalStorage);
    });

    it('sets appliedfilter if current user uuid matches with the filter owner', function() {
      currentUserUuid = 'DFD04C8B-519A-4D0A-BE60-F47EB4D563E8';
      var filterInLocalStorage = {
        content:"IRRELEVANT",
        acl: currentUserUuid + ":rw"
      };

      var appliedFilter = new MwListCollectionFilter('IRRELEVANT')
        ._setAppliedFilter(filterInLocalStorage);

      expect(MCAPFilterHolderSpy.set).toHaveBeenCalledWith(filterInLocalStorage);
    });
  });

});