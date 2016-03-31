'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter,
    filterInLocalStorage,
    currentUserUuid;

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

    function MCAPFilterHolder() {};
    MCAPFilterHolder.prototype.get = function() {
    };
    $provide.value('MCAPFilterHolder', MCAPFilterHolder);

    function MCAPFilterHolders(irrelevant, type) {
      this.type = type;
    };
    $provide.value('MCAPFilterHolders', MCAPFilterHolders);

    function MCAPauthenticatedUser() {};
    MCAPauthenticatedUser.prototype.get = function() {
      return currentUserUuid;
    };
    $provide.value('MCAPauthenticatedUser', MCAPauthenticatedUser);
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

    xit('returns null if filter in localstorage does not match current users id', function() {
      currentUserUuid = 'DFD04C8B-519A-4D0A-BE60-F47EB4D563E8';
      filterInLocalStorage = '{"content":"IRRELEVANT", "172FB965-64B2-4B6A-BF8C-679B02460B7B"}';

      var appliedFilter = new MwListCollectionFilter('IRRELEVANT').fetchAppliedFilter();

      expect(appliedFilter).toBeNull();
    });
  });

});