'use strict';

describe('MwUrlStorageTest', function () {
  var queryParams = {},
    currentUrl = '',
    $rootScope,
    $q,
    subject,
    routeSpy,
    locationSpy;

  var getQueryParamsFrom = function (url) {
    var request = {};
    if (url && url.indexOf('?')) {
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
  };

  var toQueryParamString = function (obj) {
    var str = '';
    for (var key in obj) {
      if (str !== '') {
        str += '&';
      } else {
        str += '?';
      }
      if (obj[key]) {
        str += key + '=' + encodeURIComponent(obj[key]);
      }
    }
    return str;
  };

  beforeEach(module('mwUI.Utils'));

  beforeEach(module(function ($provide) {
    locationSpy = {
      url: function () {
        return currentUrl;
      },
      path: function (newPath) {
        var pathParams = getQueryParamsFrom(newPath);
        this.search(pathParams);
        if (newPath.split('?')[0] !== currentUrl.split('?')[0]) {
          $rootScope.$broadcast('$locationChangeStart', newPath, currentUrl);
          $rootScope.$broadcast('$routeChangeStart', {
            originalPath: newPath
          }, {
            originalPath: currentUrl
          });
          currentUrl = newPath.split('?')[0] + toQueryParamString(this.search());
          $rootScope.$broadcast('$locationChangeSuccess', newPath, currentUrl);
          $rootScope.$broadcast('$routeChangeSuccess');
        } else {
          $rootScope.$broadcast('$routeUpdate');
        }
        return locationSpy;
      },
      search: function (params) {
        if (params && _.isObject(params)) {
          queryParams = params;
        }
        for (var key in queryParams) {
          if (queryParams.hasOwnProperty(key) && queryParams[key] === null) {
            delete queryParams[key];
          }
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

    expect(locationSpy.search()).toEqual({});
  });

  it('keeps the query param after a route change', function () {
    locationSpy.path('/irrelevant');
    subject.setItem('abc', 'IRRELEVANT', {removeOnUrlChange: false});

    locationSpy.path('/irrelevant-change');

    expect(locationSpy.search()).toEqual({abc: 'IRRELEVANT'});
  });

  it('discard the query param after a route change when the option removeOnUrlChange is set to true', function () {
    locationSpy.path('/irrelevant');
    subject.setItem('abc', 'IRRELEVANT', {removeOnUrlChange: true});

    locationSpy.path('/irrelevant-change');

    expect(locationSpy.search()).toEqual({});
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