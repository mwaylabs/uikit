'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter;

  beforeEach(module('mwCollection'));

  beforeEach(module(function($provide) {
    var LocalForage = {
      getItem: function(identifier) {
        return {
          then: function() {
            return 'theAppliedFilter';
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

  it('is creatable', function() {
    new MwListCollectionFilter('foo').fetchAppliedFilter();
  });
});