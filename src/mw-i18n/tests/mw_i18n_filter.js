/**
 * Created by zarges on 29/05/15.
 */
describe('mwUi i18n Service', function () {
  var $templateRequest,
    $rootScope,
    $filter,
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
            common: {
              a1: 'DE:A1',
              a2: 'DE:A2 {{placeholder}}'
            }
          }));
        } else if (path === 'i18n/a/en_US.json') {
          dfd.resolve(JSON.stringify({
            common: {
              a1: 'EN:A1',
              a2: 'EN:A2 {{placeholder}}'
            }
          }));
        }
        return dfd.promise;
      });
      return $templateRequest;
    });
  }));

  beforeEach(inject(function (_i18n_, _$templateRequest_, _$rootScope_, _$filter_) {
    i18n = _i18n_;
    $templateRequest = _$templateRequest_;
    $rootScope = _$rootScope_;
    $filter = _$filter_;

    i18nProvider.addLocale('en_US', 'English');
    i18nProvider.addLocale('de_DE', 'Deutsch');
    i18nProvider.addResource('i18n/a');
  }));


  describe('using i18n Filter', function () {

    it('should return a translation for a translation key', function (done) {

      i18n.setLocale('de_DE').then(function () {
        var translation = $filter('i18n')('common.a1');
        expect(translation).toEqual('DE:A1');
        done();
      });

      $rootScope.$digest();

    });

    it('should return a translation for a translation key and replace the placeholders', function (done) {

      i18n.setLocale('de_DE').then(function () {
        var translation = $filter('i18n')('common.a2', {placeholder: 'PH'});
        expect(translation).toEqual('DE:A2 PH');
        done();
      });

      $rootScope.$digest();

    });

    it('should return a translation for a i18nObject', function (done) {

      i18n.setLocale('de_DE').then(function () {
        //jshint -W106
        var translation = $filter('i18n')({de_DE: 'DE', en_US: 'DE'});
        //jshint +W106
        expect(translation).toEqual('DE');
        done();
      });

      $rootScope.$digest();

    });


  });

});