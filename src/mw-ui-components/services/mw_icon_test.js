describe('mwUi mwIcon Service', function () {
  var mwIconProvider;

  beforeEach(module('mwUI'));

  beforeEach(function () {
    module('mwUI', function (_mwIconProvider_){
      mwIconProvider =_mwIconProvider_;
    });
  });

  beforeEach(inject(function (mwIcon, $templateRequest, $rootScope, $httpBackend) {
    this.mwIcon = mwIcon;
    this.$templateRequest = $templateRequest;
    this.$rootScope = $rootScope;
    this.$httpBackend = $httpBackend;
  }));


  describe('configuring provider', function () {

    it('registers an icon', function () {
      mwIconProvider.addIconSet({
        id: 'fa',
        icons: {
          USER: 'fa-user'
        }
      });

      expect(this.mwIcon.getIconSet('fa').id).toBe('fa');
    });

    it('registers an icon where the icon mapping comes from a file', function () {
      mwIconProvider.addIconSet({
        id: 'fa',
        iconsUrl: '/test/fa.json'
      });

      expect(this.mwIcon.getIconSet('fa').id).toBe('fa');
    });

    it('throws an error when you try to register an icon without nay icon mappping or file', function () {
      expect(function(){
        mwIconProvider.addIconSet({
          id: 'fa'
        });
      }).toThrow();
    });
  });

  describe('using mwIcon', function(){

    describe('querying icons', function(){
      it('returns the iconkey', function(){
        var uSpy =jasmine.createSpy('userKeySpy');
        mwIconProvider.addIconSet({
          id: 'fa',
          icons: {
            user: 'fa-user'
          }
        });

        mwIconProvider.getIconSet('fa').getIconForKey('user').then(uSpy);
        this.$rootScope.$digest();

        expect(uSpy).toHaveBeenCalledWith('fa-user');
      });

      it('returns the iconkey for nested icons', function(){
        var uSpy =jasmine.createSpy('userKeySpy');
        mwIconProvider.addIconSet({
          id: 'fa',
          icons: {
            user: {
              opaque: 'fa-user-o',
              black: 'fa-user-b'
            }
          }
        });

        mwIconProvider.getIconSet('fa').getIconForKey('user.opaque').then(uSpy);
        this.$rootScope.$digest();

        expect(uSpy).toHaveBeenCalledWith('fa-user-o');
      });
    });

    describe('testing remote icon files', function(){
      beforeEach(function(){
        mwIconProvider.addIconSet({
          id: 'fa',
          iconsUrl: '/test/fa.json'
        });
        this.$httpBackend.when('GET', '/test/fa.json').respond(200, JSON.stringify({
          USER: 'fa-user',
          GROUP: 'fa-group'
        }));
      });

      it('loads file during runtime when a fileUrl has been set and the icon set has not been loaded yet', function(){
        var spy = jasmine.createSpy('iconsUrlResolver');
        this.mwIcon.getIconSet('fa').getIconForKey('USER').then(spy);

        this.$httpBackend.flush();
      });

      it('loads file only once', function(){
        spyOn(this.mwIcon.getIconSet('fa'), 'loadFn').and.callThrough();
        this.mwIcon.getIconSet('fa').getIconForKey('USER');
        this.mwIcon.getIconSet('fa').getIconForKey('GROUP');

        this.$httpBackend.flush();

        expect(this.mwIcon.getIconSet('fa').loadFn).toHaveBeenCalledTimes(1);
      });

      it('return icon key', function(){
        var uSpy = jasmine.createSpy('userIconKey');
        this.mwIcon.getIconSet('fa').getIconForKey('USER').then(uSpy);

        this.$httpBackend.flush();

        expect(uSpy).toHaveBeenCalledWith('fa-user');
      });

      it('replaces icons when file is loaded', function(){
        var uSpy = jasmine.createSpy('userIconKey');
        this.mwIcon.getIconSet('fa').replaceIcons({USER:'other-icon'});
        this.mwIcon.getIconSet('fa').getIconForKey('USER').then(uSpy);

        this.$httpBackend.flush();

        expect(uSpy).toHaveBeenCalledWith('other-icon');
      });

    });
  });
});
