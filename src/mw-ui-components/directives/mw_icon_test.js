describe('mwIcon', function () {

  beforeEach(module('mwUI.UiComponents'));
  beforeEach(module('karmaDirectiveTemplates'));
  var mwIconProvider = null;

  beforeEach(function () {
    module('mwUI.UiComponents', function (_mwIconProvider_) {
      mwIconProvider = _mwIconProvider_;
    });
  });

  beforeEach(inject(function ($compile, $rootScope) {
    this.$compile = $compile;
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
  }));

  xdescribe('old implementation', function(){
    it('should have a font awesome icon class', function () {
      var icon = '<span mw-icon="fa-star"></span>';
      var el = this.$compile(icon)(this.scope);

      this.scope.$digest();

      expect(el.find('.fa.fa-star').length).toBe(1);
    });

    it('should have a relution icon', function () {
      var icon = '<span mw-icon="rln-icon new_app_native"></span>';
      var el = this.$compile(icon)(this.scope);

      this.scope.$digest();

      expect(el.find('.rln-icon.new_app_native').length).toBe(1);
    });

    it('should have a default bootstrap glyphicon', function () {
      var icon = '<span mw-icon="search"></span>';
      var el = this.$compile(icon)(this.scope);

      this.scope.$digest();

      expect(el.find('.glyphicon.glyphicon-search').length).toBe(1);
    });

    it('should change the class according to the new icon', function () {
      var icon = '<span mw-icon="search"></span>';
      var el = this.$compile(icon)(this.scope);
      var isolatedScope;
      this.scope.$digest();
      isolatedScope = el.isolateScope();


      isolatedScope.icon = 'fa-star';
      this.scope.$digest();

      expect(el.find('.fa.fa-star').length).toBe(1);
    });
  });

  describe('new implementation', function(){
    beforeEach(function(){
      mwIconProvider.addIconSet({
        id: 'FA',
        classPrefix:'fa',
        icons: {
          USER: 'fa-user',
          GROUP: 'fa-group'
        }
      });
    });

    it('finds icon from icon service', function(){
      var icon = '<span mw-icon="FA.USER"></span>';
      var el = this.$compile(icon)(this.scope);

      this.scope.$digest();

      expect(el.find('.fa-user').length).toBe(1);
    });

    it('sets classPrefix for iconset', function(){
      var icon = '<span mw-icon="FA.USER"></span>';
      var el = this.$compile(icon)(this.scope);

      this.scope.$digest();

      expect(el.find('.fa').length).toBe(1);
    });

    it('changes icon when new icon path is set', function(){
      var icon = '<span mw-icon="FA.USER"></span>';
      var el = this.$compile(icon)(this.scope);
      var isolatedScope;
      this.scope.$digest();
      isolatedScope = el.isolateScope();

      isolatedScope.icon='FA.GROUP';
      this.scope.$digest();

      expect(el.find('.fa-group').length).toBe(1);
    });

    it('changes icon when icon is replaced', function(){
      var icon = '<span mw-icon="FA.USER"></span>';
      var el = this.$compile(icon)(this.scope);
      this.scope.$digest();

      mwIconProvider.getIconSet('FA').replaceIcons({USER:'custom-user-icn'});
      this.scope.$digest();

      expect(el.find('.custom-user-icn').length).toBe(1);
    });

  });

});
