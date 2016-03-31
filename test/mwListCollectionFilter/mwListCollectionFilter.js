'use strict';

describe('MwListCollectionFilter', function() {
  var MwListCollectionFilter;

  beforeEach(module('mwCollection'));

  beforeEach(module(function($provide) {
    $provide.value('LocalForage', {});
    $provide.value('MCAPFilterHolder', {});
    $provide.value('MCAPFilterHolders', {});
  }));

  beforeEach(inject(function(_MwListCollectionFilter_) {
    MwListCollectionFilter = _MwListCollectionFilter_;
  }));

  it('is creatable', function() {

  });
});