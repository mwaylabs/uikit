'use strict';

describe('MwUrlStorageTest', function () {
  var queryParams = {},
    currentUrl = '',
    $rootScope,
    $q,
    subject,
    routeSpy,
    locationSpy;

  beforeEach(module('mwUI.Utils'));

  beforeEach(module(function ($provide) {
    locationSpy = {
      url: function () {
        return currentUrl;
      },
      path: function (newPath) {
        function getQueryParamsFrom(url) {
          var request = {};
          if(url && url.indexOf('?')){
            var pairs = url.substring(url.indexOf('?') + 1).split('&');
            if (url.indexOf('?') === -1) {
              return request;
            }
            for (var i = 0; i < pairs.length; i++) {
              if (!pairs[i]) {
                continue;
              }
              var pair = pairs[i].split('=');
              request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
          }
          return request;
        }
        _.extend(queryParams, getQueryParamsFrom(newPath));
        $rootScope.$broadcast('$locationChangeStart', newPath, currentUrl);
        $rootScope.$broadcast('$routeChangeStart', {originalPath: newPath}, {originalPath: currentUrl});
        $rootScope.$broadcast('$locationChangeSuccess', newPath, currentUrl);
        $rootScope.$broadcast('$routeChangeSuccess');
        currentUrl = newPath;
        return locationSpy;
      },
      search: function (params) {
        if (params && _.isObject(params)) {
          queryParams = params;
          this.path(currentUrl);
        }
        return queryParams;
      },
      replace: function () {
      }
    };
    spyOn(locationSpy, 'path').and.callThrough();
    spyOn(locationSpy, 'search').and.callThrough();
    spyOn(locationSpy, 'url').and.callThrough();
    spyOn(locationSpy, 'replace');
    $provide.value('$location', locationSpy);

    routeSpy = {
      current: {
        $$route: {}
      }
    };
    $provide.value('$route', routeSpy);
  }));

  beforeEach(inject(function (_$rootScope_, _$q_, mwUrlStorage) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    subject = mwUrlStorage;
  }));

  afterEach(function () {
    queryParams = {};
    currentUrl = '';
    subject.clear();
  });

  it('sets query param when calling setItem', function () {
    subject.setItem('abc', 'IRRELEVANT');

    expect(locationSpy.search).toHaveBeenCalledWith({abc: 'IRRELEVANT'});
  });

  it('does not create a new navigation history entry when calling setItem', function () {
    subject.setItem('abc', 'IRRELEVANT');

    expect(locationSpy.replace).toHaveBeenCalled();
  });

  it('updated query param when calling setItem and a previous value does exist', function () {
    subject.setItem('abc', 'IRRELEVANT');

    subject.setItem('abc', 'IRRELEVANT_UPDATE');

    expect(locationSpy.search).toHaveBeenCalledWith({abc: 'IRRELEVANT_UPDATE'});
  });

  it('removes query param when calling removeItem', function () {
    subject.setItem('abc', 'IRRELEVANT');

    subject.removeItem('abc');

    expect(locationSpy.search).toHaveBeenCalledWith({abc: null});
  });

  it('keeps the query param after a route change', function () {
    locationSpy.path('/irrelevant');
    subject.setItem('abc', 'IRRELEVANT', {removeOnUrlChange: false});

    locationSpy.path('/irrelevant-change');

    expect(locationSpy.search()).toEqual({abc: 'IRRELEVANT'});
  });

  it('does not overwrite a changed url query param with the storage param on a route change', function () {
    locationSpy.path('/irrelevant');
    subject.setItem('abc', 'IRRELEVANT');

    locationSpy.path('/irrelevant-change?abc=CHANGED_IRRELEVANT');

    expect(subject.getItem('abc')).toEqual('CHANGED_IRRELEVANT');
  });

  it('discard the query param after a route change when the option removeOnUrlChange is set to true', function () {
    locationSpy.path('/irrelevant');
    subject.setItem('abc', 'IRRELEVANT', {removeOnUrlChange: true});

    locationSpy.path('/irrelevant-change');

    expect(locationSpy.search()).toEqual({abc: null});
  });

  it('discard the query param after a route change when the option removeOnUrlChange is set to true and the url still contains the param', function () {
    locationSpy.path('/irrelevant');
    subject.setItem('abc', 'IRRELEVANT', {removeOnUrlChange: true});

    locationSpy.path('/irrelevant-change?abc=IRRELEVANT');

    expect(locationSpy.search()).toEqual({abc: null});
  });

  it('discard the query param after a route change when the option removeOnUrlChange is set to true but keeps the other', function () {
    locationSpy.path('/irrelevant');
    subject.setItem('abc', 'IRRELEVANT', {removeOnUrlChange: true});
    subject.setItem('xyz', 'IRRELEVANT-STAY', {removeOnUrlChange: false});

    locationSpy.path('/irrelevant-change');

    expect(locationSpy.search()).toEqual({xyz: 'IRRELEVANT-STAY', abc: null});
  });
});