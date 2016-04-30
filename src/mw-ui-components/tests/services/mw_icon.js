/**
 * Created by zarges on 29/05/15.
 */
xdescribe('mwUi mwIcon Service', function () {
  var mwIconProvider;

  beforeEach(module('mwUI'));

  beforeEach(function () {
    module('mwUI', function (_mwIconProvider_){
      mwIconProvider =_mwIconProvider_;
    });
  });

  beforeEach(module(function (/*$provide*/) {
    //$provide.service('$templateRequest', function ($rootScope, $q) {
    //  var $templateRequestSpy = jasmine.createSpy('$templateRequest');
    //  $templateRequestSpy.and.callFake(function (path) {
    //    var dfd = $q.defer();
    //    if (path === 'i18n/a/de_DE.json') {
    //      dfd.resolve(JSON.stringify({
    //        a1: 'DE:A1',
    //        a2: 'DE:A2',
    //        a3: 'DE:A3 {{placeholder1}} {{placeholder2}}'
    //      }));
    //    } else if (path === 'i18n/a/en_US.json') {
    //      dfd.resolve(JSON.stringify({
    //        a1: 'EN:A1',
    //        a2: 'EN:A2',
    //        a3: 'EN:A3 {{placeholder1}} {{placeholder2}}'
    //      }));
    //    } else if (path === 'i18n/b/de_DE.json') {
    //      dfd.resolve(JSON.stringify({b1: 'DE:B1', b2: 'DE:B2'}));
    //    } else if (path === 'i18n/b/en_US.json') {
    //      dfd.resolve(JSON.stringify({b1: 'EN:B1', b2: 'EN:B2'}));
    //    } else {
    //      dfd.resolve(JSON.stringify({a: 'A', b: 'B'}));
    //    }
    //    return dfd.promise;
    //  });
    //  return $templateRequestSpy;
    //});
  }));

  beforeEach(inject(function (mwIcon, $templateRequest, $rootScope, $httpBackend) {
    this.mwIcon = mwIcon;
    this.$templateRequest = $templateRequest;
    this.$rootScope = $rootScope;
    this.$httpBackend = $httpBackend;
  }));


  describe('configuring provider', function () {

    it('registers an icon', function () {
      mwIconProvider.register({
        id: 'fa',
        icons: {
          USER: 'fa-user'
        }
      });

      expect(this.mwIcon.getIcons().length).toBe(1);
    });

    it('registers an icon where the icon mapping comes from a file', function () {
      mwIconProvider.register({
        id: 'fa',
        fileUrl: '/test/fa.json'
      });

      expect(this.mwIcon.getIcons().length).toBe(1);
    });

    it('throws an error when you try to register an icon without nay icon mappping or file', function () {
      expect(function(){
        mwIconProvider.register({
          id: 'fa'
        });
      }).toThrow();
    });
  });

  describe('using mwIcon', function(){
    it('loads file during runtime when a fileUrl has been set', function(){
      mwIconProvider.register({
        id: 'fa',
        fileUrl: '/test/fa.json'
      });

      this.$httpBackend.expectGET('/test/fa.json').respond(200, JSON.stringify({}));

      this.$httpBackend.flush();
    });

    it('extends the icon mapping with the file respone when a fileUrl has been set', function(){
      mwIconProvider.register({
        id: 'fa',
        fileUrl: '/test/fa.json'
      });
      this.$httpBackend.when('GET', '/test/fa.json').respond(200, JSON.stringify({
        USER: 'fa-user',
        GROUP: 'fa-group'
      }));

      this.$httpBackend.flush();

      expect(this.mwIcon.getIcons().get('fa').get('icons')).toEqual({
        USER: 'fa-user',
        GROUP: 'fa-group'
      });
    });

    it('returns the iconkey', function(){
      mwIconProvider.register({
        id: 'fa',
        fileUrl: '/test/fa.json'
      });
      this.$httpBackend.when('GET', '/test/fa.json').respond(200, JSON.stringify({
        USER: 'fa-user',
        GROUP: 'fa-group'
      }));

      this.$httpBackend.flush();

      this.mwIcon.getIcon('USER').then(function(iconKey){
        expect(iconKey).toMatch('fa-user');
      });
      this.mwIcon.getIcon('GROUP').then(function(iconKey){
        expect(iconKey).toMatch('fa-group');
      });
    });

    it('returns the iconkey when icon mapping is nested', function(){
      mwIconProvider.register({
        id: 'fa',
        fileUrl: '/test/fa.json'
      });
      this.$httpBackend.when('GET', '/test/fa.json').respond(200, JSON.stringify({
        USER: {
          opaque: 'fa-user-o',
          default: 'fa-user'
        }
      }));

      this.$httpBackend.flush();

      this.mwIcon.getIcon('USER.opaque').then(function(iconKey){
        expect(iconKey).toMatch('fa-user-o');
      });
      this.mwIcon.getIcon('USER.default').then(function(iconKey){
        expect(iconKey).toMatch('fa-user');
      });
    });

    it('returns the iconkey when icon mapping is nested', function(){
      mwIconProvider.register({
        id: 'fa',
        fileUrl: '/test/fa.json'
      });
      this.$httpBackend.when('GET', '/test/fa.json').respond(200, JSON.stringify({
        USER: {
          opaque: 'fa-user-o',
          default: 'fa-user'
        }
      }));

      this.$httpBackend.flush();

      this.mwIcon.getIcon('USER.opaque').then(function(iconKey){
        expect(iconKey).toMatch('fa-user-o');
      });
      this.mwIcon.getIcon('USER.default').then(function(iconKey){
        expect(iconKey).toMatch('fa-user');
      });
    });
  });
});
