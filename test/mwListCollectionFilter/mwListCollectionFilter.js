'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter;

  beforeEach(module('mwCollection'));

  beforeEach(module(function($provide) {
    $provide.value('LocalForage', {});

    function MCAPFilterHolder() {};
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
    new MwListCollectionFilter('foo');
  });
});