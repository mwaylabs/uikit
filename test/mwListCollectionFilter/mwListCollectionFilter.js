'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter,
    filterInLocalStorage;

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
    MCAPFilterHolder.prototype.get = function fn() {
    };
    $provide.value('MCAPFilterHolder', MCAPFilterHolder);

    function MCAPFilterHolders(irrelevant, type) {
      this.type = type;
    };
    $provide.value('MCAPFilterHolders', MCAPFilterHolders);
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
  });

});