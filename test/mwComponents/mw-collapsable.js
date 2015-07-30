describe('mwCollapsable', function () {
  var $compile;
  var $rootScope;
  var scope;
  var el;
  var collapsable;
  var isolateScope;

  beforeEach(module('mwUI'));
  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();

    collapsable = '<div mw-collapsable mw-title="TITLE">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
    el = $compile(collapsable)(scope);
    scope.$digest();
    isolateScope = el.isolateScope();
  }));

  it('should have an arrow to the right and not visible text when collapsed',
    function () {
      expect(isolateScope.viewModel.collapsed).toBe(false);

      expect(el.find('i').hasClass('fa fa-angle-right')).toBe(true);
      expect(el.find('i').hasClass('fa-rotate-90')).toBe(false);
      expect(el.find('.mw-collapsable-body').hasClass('collapsed')).toBe(false);
    });

  it('should have an arrow down and visible text when expanded',
    function () {
      el.find('div').eq(1).click();
      expect(isolateScope.viewModel.collapsed).toBe(true);

      expect(el.find('i').hasClass('fa fa-angle-right fa-rotate-90')).toBe(true);
      expect(el.find('.mw-collapsable-body').hasClass('collapsed')).toBe(true);
    });

  it('should toggle collapsed between true and false',
    function () {
      expect(isolateScope.viewModel.collapsed).toBe(false);
      isolateScope.toggle();
      expect(isolateScope.viewModel.collapsed).toBe(true);
    });

  it('should have a margin when collapsed over more than one level',
    function () {
      collapsable =
        '<div mw-collapsable>' +
          '<div mw-collapsable>' +
            '<div mw-collapsable mw-title="TITLE">' +
              'TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT' +
            '</div>' +
          '<div>' +
        '<div>';
      el = $compile(collapsable)(scope);
      scope.$digest();
      isolateScope = el.isolateScope();

      expect(el.find('.mw-collapsable').length).toBe(3);
      expect(el.find('.mw-collapsable-heading').length).toBe(3);
      expect(el.find('.mw-collapsable-body').length).toBe(3);

      // level 1
      expect(
        el.find('.mw-collapsable-body')
          .eq(0)
          .find('div')
          .attr('style'))
        .toBe('margin-left: 20px; ');

      // level 2
      expect(
        el.find('.mw-collapsable-body')
          .eq(1)
          .find('div')
          .attr('style'))
        .toBe('margin-left: 40px; ');
    });

});
