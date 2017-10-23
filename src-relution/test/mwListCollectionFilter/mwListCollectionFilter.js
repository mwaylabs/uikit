'use strict';

describe('MwListCollectionFilter', function () {
  var $q,
    $locationSpy,
    RuntimeStorageSpy,
    LocalForageSpy,
    MwListCollectionFilter,
    filterInLocalStorage = {},
    currentUserUuid,
    FilterHolderProviderSpy,
    FilterHolderSpy,
    $rootScope,
    url = '',
    queryParams = {},
    appliedSearchTerm = {},
    listCollectionFilter;

  beforeEach(module('mwCollection'));

  beforeEach(module(function ($provide) {
    //create stubs to mimic external input-methods from the real context
    RuntimeStorageSpy = jasmine.createSpyObj('runtimeStorage', ['getItem', 'setItem', 'deleteItem']);
    var RuntimeStorageStub = {
      getItem: function (key) {
        RuntimeStorageSpy.getItem(key);
        if (key === 'applied_filter_IRRELEVANT') {
          return filterInLocalStorage;
        } else if (key === 'applied_search_IRRELEVANT') {
         return appliedSearchTerm;
        }
      },
      setItem: function (key, value) {
        RuntimeStorageSpy.setItem(key, value);
        return value;
      },
      removeItem: function (key) {
        RuntimeStorageSpy.deleteItem(key);
        return true;
      }
    };

    var FilterHolderStub = function (dummy, type) {
      this.type = type;
      this.fetch = function () {
        var dfd = $q.defer();
        dfd.resolve([]);
        return dfd.promise;
      };
      this.get = function (filter) {
        if (filter.uuid === 'BELONGS_TO_USER') {
          return new mwUI.Backbone.Model(filter);
        } else if (filter.uuid === 'IRRELEVANT') {
          return new mwUI.Backbone.Model(filter);
        } else {
          return null;
        }
      };
      this.findWhere = function (query) {
        return this.get(query);
      }
    };

    //create spies to mimic output-methods to external real context
    FilterHolderProviderSpy = {
      createFilterHolder: function () {
      }
    };

    FilterHolderSpy = {
      get: function () {
      },
      set: function (value) {
      }
    };

    //redirect calls-to-this-external-methods to the stubs / spies
    $provide.value('mwRuntimeStorage', RuntimeStorageStub);
    $provide.value('FilterHoldersCollection', FilterHolderStub);
    $provide.value('FilterHolderProvider', FilterHolderProviderSpy);

    $locationSpy = jasmine.createSpyObj('$location', ['search']);
    $provide.service('$location', function () {
      return {
        url: function () {
          return url;
        },
        search: function () {
          $locationSpy.search.apply($locationSpy, arguments);
          return queryParams;
        }
      };
    });
    $provide.service('$route', function () {
      return {
        current: {
          $$route: {}
        }
      };
    });

    var RlnModel = mwUI.Backbone.Model.extend({idAttribute: 'uuid'});
    //spy on these methods to see if they get called
    spyOn(FilterHolderProviderSpy, 'createFilterHolder').and.returnValue(new RlnModel());
    spyOn(FilterHolderSpy, 'set');

    currentUserUuid = null;
  }));


  beforeEach(inject(function (_$rootScope_, _MwListCollectionFilter_, _$q_) {
    $rootScope = _$rootScope_;
    MwListCollectionFilter = _MwListCollectionFilter_;
    $q = _$q_;
  }));

  beforeEach(function () {
    listCollectionFilter = new MwListCollectionFilter('IRRELEVANT');
  });

  afterEach(function () {
    queryParams = {};
    filterInLocalStorage = {};
    appliedSearchTerm = {};
  });

  describe('testing ownership', function () {
    it('returns true when current user is the filter owner', function (done) {
      listCollectionFilter.filterWasSetByUser({uuid: 'BELONGS_TO_USER'}).then(function (belongsToUser) {
        expect(belongsToUser).toBeTruthy();
        done();
      });
      $rootScope.$digest();
    });

    it('returns false when current user is not the filter owner', function (done) {
      listCollectionFilter.filterWasSetByUser({uuid: 'BELONGS_NOT_TO_USER'}).then(function (belongsToUser) {
        expect(belongsToUser).toBeFalsy();
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('testing fetching applied filter', function () {
    it('returns url filter when query params are present and filter is available for user', function (done) {
      queryParams = {f: 'BELONGS_TO_USER'};

      listCollectionFilter.fetchAppliedFilter().then(function (appliedFilter) {
        expect(appliedFilter.get('uuid')).toMatch('BELONGS_TO_USER');
        done();
      });
      $rootScope.$digest();
    });

    it('returns local storage filter when no query params are set but localstorage has persisted filter', function (done) {
      filterInLocalStorage.uuid = 'IRRELEVANT';

      listCollectionFilter.fetchAppliedFilter().then(function (appliedFilter) {
        expect(appliedFilter.get('uuid')).toMatch('IRRELEVANT');
        done();
      });
      $rootScope.$digest();
    });

    it('returns null when no query params are set and no filter is in local storage', function () {
      listCollectionFilter.fetchAppliedFilter().then(function (appliedFilter) {
        expect(appliedFilter.get('uuid')).not.toBeDefined();
      });
      $rootScope.$digest();
    });

    it('updates local storage filter when query params are present and filter is available for user', function (done) {
      filterInLocalStorage.uuid = 'IRRELEVANT';
      queryParams = {f: 'BELONGS_TO_USER'};

      listCollectionFilter.fetchAppliedFilter().then(function () {
        expect(RuntimeStorageSpy.setItem.calls.mostRecent().args[1]).toEqual({uuid: 'BELONGS_TO_USER'});
        done();
      });
      $rootScope.$digest();
    });

    it('discards url filter when query params are present and filter is not available for user', function (done) {
      queryParams = {f: 'BELONGS_NOT_TO_USER'};

      listCollectionFilter.fetchAppliedFilter().then(function (appliedFilter) {
        expect(appliedFilter.get('uuid')).not.toBeDefined();
        done();
      });
      $rootScope.$digest();
    });

    it('discards url filter when query params are present and filter is not available for user and deletes local storage', function (done) {
      filterInLocalStorage.uuid = 'IRRELEVANT';
      queryParams = {f: 'BELONGS_NOT_TO_USER'};

      listCollectionFilter.fetchAppliedFilter().then(function (appliedFilter) {
        expect(RuntimeStorageSpy.deleteItem).toHaveBeenCalled();
        expect($locationSpy.search.calls.mostRecent().args[0]).toEqual({f: null, qAttr: null, q: null});
        expect(appliedFilter.get('uuid')).not.toBeDefined();
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('setting applied filter', function () {
    it('sets local storage and updates url when calling apply filter', function (done) {
      listCollectionFilter.applyFilter({uuid: 'NEW_FILTER'}).then(function (appliedFilter) {
        expect(RuntimeStorageSpy.setItem.calls.mostRecent().args[1]).toEqual({uuid: 'NEW_FILTER'});
        expect($locationSpy.search.calls.mostRecent().args[0]).toEqual({f: 'NEW_FILTER', qAttr: null, q: null});
        expect(appliedFilter.get('uuid')).toMatch('NEW_FILTER');
        done();
      });
      $rootScope.$digest();
    });

    it('does not overwrite exisitng search params', function(done){
      queryParams = {
        xyz: 'IRRELEVANT'
      };

      listCollectionFilter.applyFilter({uuid: 'NEW_FILTER'}).then(function () {
        expect($locationSpy.search.calls.mostRecent().args[0]).toEqual({f: 'NEW_FILTER', qAttr: null, q: null, xyz: 'IRRELEVANT'});
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('testing fetching applied search term', function () {
    it('returns url filter when query params are present and filter is available for user', function (done) {
      queryParams = {q: 'IRRELEVANT', qAttr: 'IRRELEVANT'};

      listCollectionFilter.fetchAppliedSearchTerm().then(function (appliedSearchTerm) {
        expect(appliedSearchTerm.val).toMatch('IRRELEVANT');
        done();
      });
      $rootScope.$digest();
    });

    it('returns local storage filter when no query params are set but localstorage has persisted filter', function (done) {
      appliedSearchTerm = {val: 'IRRELEVANT', attr: 'IRRELEVANT'};

      listCollectionFilter.fetchAppliedSearchTerm().then(function (appliedSearchTerm) {
        expect(appliedSearchTerm.val).toMatch('IRRELEVANT');
        done();
      });
      $rootScope.$digest();
    });

    it('returns null when no query params are set and no filter is in local storage', function () {
      listCollectionFilter.fetchAppliedSearchTerm().then(function (appliedSearchTerm) {
        expect(appliedSearchTerm.val).toBe(null);
      });
      $rootScope.$digest();
    });

    it('returns null when query param is missing attr', function () {
      queryParams = {q: 'IRRELEVANT'};

      listCollectionFilter.fetchAppliedSearchTerm().then(function (appliedSearchTerm) {
        expect(appliedSearchTerm.val).toBe(null);
      });
      $rootScope.$digest();
    });

    it('returns null when query param is missing val', function () {
      queryParams = {qAttr: 'IRRELEVANT'};

      listCollectionFilter.fetchAppliedSearchTerm().then(function (appliedSearchTerm) {
        expect(appliedSearchTerm.val).toBe(null);
      });
      $rootScope.$digest();
    });

    it('updates local storage filter when query params are present', function (done) {
      appliedSearchTerm = {val: 'IRRELEVANT', attr: 'IRRELEVANT'};
      queryParams = {q: 'Q_IRRELEVANT', qAttr: 'Q_IRRELEVANT'};

      listCollectionFilter.fetchAppliedSearchTerm().then(function () {
        expect(RuntimeStorageSpy.setItem.calls.mostRecent().args[1]).toEqual({val: 'Q_IRRELEVANT', attr: 'Q_IRRELEVANT'});
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('setting search term', function () {
    it('sets local storage and updates url when calling apply search term', function (done) {
      listCollectionFilter.applySearchTerm('IRRELEVANT', 'NEW_SEARCH').then(function (appliedSearchTerm) {
        expect(RuntimeStorageSpy.setItem.calls.mostRecent().args[1]).toEqual({val: 'NEW_SEARCH', attr: 'IRRELEVANT'});
        expect($locationSpy.search.calls.mostRecent().args[0]).toEqual({f: null, q: 'NEW_SEARCH', qAttr: 'IRRELEVANT'});
        expect(appliedSearchTerm.val).toMatch('NEW_SEARCH');
        done();
      });
      $rootScope.$digest();
    });

    it('does not overwrite exisitng search params', function(done){
      queryParams = {
        xyz: 'IRRELEVANT'
      };

      listCollectionFilter.applySearchTerm('IRRELEVANT', 'NEW_SEARCH').then(function () {
        expect($locationSpy.search.calls.mostRecent().args[0]).toEqual({f: null, q: 'NEW_SEARCH', qAttr: 'IRRELEVANT', xyz: 'IRRELEVANT'});
        done();
      });
      $rootScope.$digest();
    });
  });
});