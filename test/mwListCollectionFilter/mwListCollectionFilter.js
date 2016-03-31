'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter;

  beforeEach(module('mwCollection'));

  beforeEach(module(function($provide) {
    var LocalForage = {
      getItem: function(identifier) {
        return {
          then: function() {
            return null;
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
      var appliedFilter = new MwListCollectionFilter('foo').fetchAppliedFilter();

      expect(appliedFilter).toBe(null);
    });
  });

});