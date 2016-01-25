/**
 * Created by zarges on 29/05/15.
 */
describe('mwUi i18n Service', function () {
  var $templateRequest,
    $rootScope,
    i18nProvider,
    i18n;

  beforeEach(module('mwUI'));

  beforeEach(function () {
    module('mwUI', function (_i18nProvider_) {
      i18nProvider = _i18nProvider_;
    });
  });

  beforeEach(module(function ($provide) {
    $provide.service('$templateRequest', function ($rootScope, $q) {
      var $templateRequest = jasmine.createSpy('$templateRequest');
      $templateRequest.and.callFake(function (path) {
        var dfd = $q.defer();
        if (path === 'i18n/a/de_DE.json') {
          dfd.resolve(JSON.stringify({
            a1: 'DE:A1',
            a2: 'DE:A2',
            a3: 'DE:A3 {{placeholder1}} {{placeholder2}}'
          }));
        } else if (path === 'i18n/a/en_US.json') {
          dfd.resolve(JSON.stringify({
            a1: 'EN:A1',
            a2: 'EN:A2',
            a3: 'EN:A3 {{placeholder1}} {{placeholder2}}'
          }));
        } else if (path === 'i18n/b/de_DE.json') {
          dfd.resolve(JSON.stringify({b1: 'DE:B1', b2: 'DE:B2'}));
        } else if (path === 'i18n/b/en_US.json') {
          dfd.resolve(JSON.stringify({b1: 'EN:B1', b2: 'EN:B2'}));
        } else {
          dfd.resolve(JSON.stringify({a: 'A', b: 'B'}));
        }
        return dfd.promise;
      });
      return $templateRequest;
    });
  }));

  beforeEach(inject(function (_i18n_, _$templateRequest_, _$rootScope_) {
    i18n = _i18n_;
    $templateRequest = _$templateRequest_;
    $rootScope = _$rootScope_;
  }));


  describe('configuring provider', function () {

    it('should register a locale with a name', function () {
      i18nProvider.addLocale('de_DE', 'Deutsch');
      expect(i18n.getLocales().length).toBe(1);
      expect(i18n.getLocales()[0].id).toEqual('de_DE');
      expect(i18n.getLocales()[0].name).toEqual('Deutsch');
      expect(i18n.getLocales()[0].active).toBeFalsy();
      expect(i18n.getLocales()[0].fileExtension).toEqual('de_DE.json');
    });

    it('should register locales with a custom filename', function () {
      i18nProvider.addLocale('de_DE', 'Deutsch', 'abc.json');
      i18nProvider.addLocale('en_US', 'English', 'def.js');
      i18nProvider.addLocale('en_UK', 'English');

      expect(i18n.getLocales().length).toBe(3);
      expect(i18n.getLocales()[0].fileExtension).toEqual('abc.json');
      expect(i18n.getLocales()[1].fileExtension).toEqual('def.js');
      expect(i18n.getLocales()[2].fileExtension).toEqual('en_UK.json');
    });

    it('should set a local to active when a default locale was defined', function () {
      i18nProvider.addLocale('de_DE', 'Deutsch', 'abc.json');
      i18nProvider.addLocale('en_US', 'English', 'jo.js');
      i18nProvider.addLocale('en_UK', 'English');
      i18nProvider.setDefaultLocale('en_US');


      expect(i18n.getLocales()[0].active).toBeFalsy();
      expect(i18n.getLocales()[1].active).toBeTruthy();
      expect(i18n.getLocales()[2].active).toBeFalsy();
    });

    it('should not add a locale twice', function () {
      i18nProvider.addLocale('de_DE', 'Deutsch');
      i18nProvider.addLocale('de_DE', 'Deutsch');
      expect(i18n.getLocales().length).toBe(1);
    });

    it('should add a resource that is loaded when a locale is set', function () {
      i18nProvider.addLocale('de_DE', 'Deutsch');
      i18nProvider.addResource('folder');
      i18n.setLocale('de_DE');
      expect($templateRequest).toHaveBeenCalledWith('folder/de_DE.json');
    });
  });

  describe('using i18n', function () {

    beforeEach(function () {

      i18nProvider.addLocale('de_DE', 'Deutsch');
      i18nProvider.addLocale('en_US', 'English');
      i18nProvider.addResource('i18n/a');
      i18nProvider.addResource('i18n/b');
    });

    it('should set a locale active when it was registered before', function () {
      i18n.setLocale('de_DE');
      expect(i18n.getActiveLocale().id).toEqual('de_DE');
    });

    it('should not set a locale active when it was not registered before', function () {
      expect(function () {
        i18n.setLocale('tr_TR');
      }).toThrow();
      expect(function () {
        i18n.setLocale();
      }).toThrow();
    });

    it('should return loading dots when the locale has been set the first time and the resources have not been loaded yet', function () {
      i18n.setLocale('de_DE');
      expect(i18n.get('a1')).toEqual('...');
      $rootScope.$digest();
    });

    it('should load all registered resources when the locale is set', function () {
      spyOn(i18n, '_loadResource');
      i18n.setLocale('de_DE');
      expect(i18n._loadResource).toHaveBeenCalledWith('i18n/a');
      expect(i18n._loadResource).toHaveBeenCalledWith('i18n/b');
    });

    it('should get translation for a key when it is available in dictionary', function (done) {
      i18n.setLocale('de_DE').then(function () {
        expect(i18n.get('a1')).toEqual('DE:A1');
        expect(i18n.get('a2')).toEqual('DE:A2');
        expect(i18n.get('b1')).toEqual('DE:B1');
        expect(i18n.get('b2')).toEqual('DE:B2');
        done();
      });
      $rootScope.$digest();
    });

    it('should get translation for a key when it is available in dictionary and replace placeholders with value', function (done) {
      i18n.setLocale('de_DE').then(function () {
        expect(i18n.get('a3', {
          placeholder1: 'PH1',
          placeholder2: 'PH2'
        })).toEqual('DE:A3 PH1 PH2');
        done();
      });
      $rootScope.$digest();
    });

    it('should return MISSING TRANSLATION when key is not available in dictionary', function (done) {
      i18n.setLocale('de_DE').then(function () {
        expect(i18n.get('test')).toMatch(/MISSING TRANSLATION/);
        done();
      });
      $rootScope.$digest();
    });

    it('should return old translation value when the locale is changed and the new resources have not been loaded yet', function (done) {
      i18n.setLocale('de_DE').then(function () {
        var localeChange = i18n.setLocale('en_US');
        expect(i18n.get('a1')).toEqual('DE:A1');
        localeChange.then(function () {
          expect(i18n.get('a1')).toEqual('EN:A1');
          done();
        });
      });
      $rootScope.$digest();
    });

    it('should return true when a translation is available', function (done) {
      i18n.setLocale('de_DE').then(function () {
        expect(i18n.translationIsAvailable('a2')).toBeTruthy();
        done();
      });
      $rootScope.$digest();
    });

    it('should return false when no translation is available', function (done) {
      i18n.setLocale('de_DE').then(function () {
        expect(i18n.translationIsAvailable('a3000')).toBeFalsy();
        done();
      });
      $rootScope.$digest();
    });

    it('should localize a i18n object by using the active locale', function () {
      //jshint -W106
      var i18nObject = {de_DE: 'DE:A', en_US: 'EN:A'};
      //jshint +W106
      i18n.setLocale('de_DE');
      expect(i18n.localize(i18nObject)).toEqual('DE:A');
      i18n.setLocale('en_US');
      expect(i18n.localize(i18nObject)).toEqual('EN:A');
    });

    it('should localize a i18n object with the default locale when no value for the active locale is available', function () {
      //jshint -W106
      var i18nObject = {dk_DK: 'DK:A', de_DE: 'DE:A'};
      //jshint +W106
      i18nProvider.setDefaultLocale('de_DE');
      i18n.setLocale('en_US');
      expect(i18n.localize(i18nObject)).toEqual('DE:A');
    });

    it('should localize a i18n object with another registered locale when no value for the active locale is available', function () {
      //jshint -W106
      var i18nObject = {en_US: 'EN:A', dk_DK: 'DK:A'};
      //jshint +W106
      i18n.setLocale('de_DE');
      expect(i18n.localize(i18nObject)).toEqual('EN:A');
    });

    it('should localize a i18n object with the first value when neither a value for the active nor for another registered locale is available', function () {
      //jshint -W106
      var i18nObject = {se_SE: 'SE:A', dk_DK: 'DK:A'};
      //jshint +W106
      i18n.setLocale('de_DE');
      expect(i18n.localize(i18nObject)).toEqual('SE:A');
    });

  });
});
