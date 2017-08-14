describe('mwCollapsable', function () {
  var $compile;
  var $rootScope;
  var scope;
  var el;
  var collapsable;
  var isolateScope;

  beforeEach(module('karmaDirectiveTemplates'));

  beforeEach(module('mwUI.UiComponents'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();

    collapsable = '<div mw-collapsable mw-title="TITLE">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
    el = $compile(collapsable)(scope);
    scope.$digest();
    isolateScope = el.isolateScope();
  }));

  afterEach(function(){
    angular.element('body *[mw-collapsable]').remove();
  });

  it('should have an arrow to the right and not visible text when collapsed',
    function () {
      expect(isolateScope.isCollapsed).toBe(true);

      expect(el.find('i').hasClass('fa fa-angle-right')).toBe(true);
      expect(el.find('i').hasClass('fa-rotate-90')).toBe(false);
      expect(el.find('.mw-collapsible-body').hasClass('is-collapsed')).toBe(true);
    });

  it('should have an arrow down and visible text when expanded',
    function () {
      el.find('div').eq(1).click();
      expect(isolateScope.isCollapsed).toBe(false);

      expect(el.find('i').hasClass('fa fa-angle-right fa-rotate-90')).toBe(true);
      expect(el.find('.mw-collapsible-body').hasClass('is-collapsed')).toBe(false);
    });

  it('should toggle collapsed between true and false',
    function () {
      expect(isolateScope.isCollapsed).toBe(true);
      isolateScope.toggle();
      expect(isolateScope.isCollapsed).toBe(false);
    });

  describe('define toggle state', function () {
    beforeEach(function () {
      scope = $rootScope.$new();
      collapsable = '<div mw-collapsable="closed" mw-title="TITLE">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
    });

    it('should be opened when mw-collapsable="false"',
      function () {
        scope.closed = false;

        el = $compile(collapsable)(scope);
        scope.$digest();
        isolateScope = el.isolateScope();

        expect(isolateScope.isCollapsed).toBe(false);
      });

    it('should be closed when mw-collapsable="true"',
      function () {
        scope.closed = true;

        el = $compile(collapsable)(scope);
        scope.$digest();
        isolateScope = el.isolateScope();

        expect(isolateScope.isCollapsed).toBe(true);
      });

    it('should update its toggle state when scope attribute changes with initial state closed',
      function () {
        scope.closed = true;
        el = $compile(collapsable)(scope);
        scope.$digest();
        isolateScope = el.isolateScope();

        scope.closed = false;
        scope.$digest();

        expect(isolateScope.isCollapsed).toBe(false);
      });

    it('should update its toggle state when scope attribute changes with initial state opened',
      function () {
        scope.closed = false;
        el = $compile(collapsable)(scope);
        scope.$digest();
        isolateScope = el.isolateScope();

        scope.closed = true;
        scope.$digest();

        expect(isolateScope.isCollapsed).toBe(true);
      });

  });

  describe('testing height', function () {
    it('sets max-height when element is opened when transcluded element has no padding and margin', function () {
      var transcludedContent = '<div id="testContent">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
      collapsable = '<div mw-collapsable="opened" mw-title="TITLE">' + transcludedContent + '</div>';
      scope.opened = false;

      el = $compile(collapsable)(scope);
      angular.element('body').append(el);
      scope.$digest();
      isolateScope = el.isolateScope();
      isolateScope.toggle();
      scope.$digest();

      expect(el.find('.mw-collapsible-body').css('max-height')).toBe(el.find('#testContent').innerHeight() + 'px');
    });

    it('sets max-height when element is opened when transcluded element has padding', function () {
      var transcludedContent = '<div id="testContent" style="padding: 100px">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
      collapsable = '<div mw-collapsable="opened" mw-title="TITLE">' + transcludedContent + '</div>';
      scope.opened = false;

      el = $compile(collapsable)(scope);
      angular.element('body').append(el);
      scope.$digest();
      isolateScope = el.isolateScope();
      isolateScope.toggle();
      scope.$digest();

      expect(el.find('.mw-collapsible-body').css('max-height')).toBe(el.find('#testContent').innerHeight() + 'px');
    });

    it('sets max-height when element is opened when multiple elements are transcluded', function () {
      var transcludedContent1 = '<div id="testContent1">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>',
        transcludedContent2 = '<div id="testContent2">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
      collapsable = '<div mw-collapsable="opened" mw-title="TITLE">' + transcludedContent1 + transcludedContent2 + '</div>';
      scope.opened = false;

      el = $compile(collapsable)(scope);
      angular.element('body').append(el);
      scope.$digest();
      isolateScope = el.isolateScope();
      isolateScope.toggle();
      scope.$digest();

      var expectedHeight = el.find('#testContent1').innerHeight() + el.find('#testContent2').innerHeight();
      expect(el.find('.mw-collapsible-body').css('max-height')).toBe(expectedHeight + 'px');
    });

    it('sets max-height when element is opened when multiple elements are transcluded and one of them is hidden', function () {
      var transcludedContent1 = '<div id="testContent1">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>',
        transcludedContent2 = '<div id="testContent2" style="display: none">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
      collapsable = '<div mw-collapsable="opened" mw-title="TITLE">' + transcludedContent1 + transcludedContent2 + '</div>';
      scope.opened = false;

      el = $compile(collapsable)(scope);
      angular.element('body').append(el);
      scope.$digest();
      isolateScope = el.isolateScope();
      isolateScope.toggle();
      scope.$digest();

      var expectedHeight = el.find('#testContent1').innerHeight();
      expect(el.find('.mw-collapsible-body').css('max-height')).toBe(expectedHeight + 'px');
    });

    it('sets max-height when element is opened when multiple elements are transcluded and they have a margin', function () {
      var margin = 10,
        transcludedContent1 = '<div id="testContent1" style="margin: ' + margin + 'px">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>',
        transcludedContent2 = '<div id="testContent2" style="margin: ' + margin + 'px">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
      collapsable = '<div mw-collapsable="opened" mw-title="TITLE">' + transcludedContent1 + transcludedContent2 + '</div>';
      scope.opened = false;

      el = $compile(collapsable)(scope);
      angular.element('body').append(el);
      scope.$digest();
      isolateScope = el.isolateScope();
      isolateScope.toggle();
      scope.$digest();

      var expectedHeight = el.find('#testContent1').innerHeight() + el.find('#testContent2').innerHeight() + 4 * margin;
      expect(el.find('.mw-collapsible-body').css('max-height')).toBe(expectedHeight + 'px');
    });

    it('extends its height when its opened', function(){
      var transcludedContent = '<div id="testContent">TEXTTEXTTEXTTEXTTEXTTEXTTEXTTEXT</div>';
      collapsable = '<div mw-collapsable="opened" mw-title="TITLE">' + transcludedContent + '</div>';
      scope.opened = false;

      el = $compile(collapsable)(scope);
      angular.element('body').append(el);
      scope.$digest();
      isolateScope = el.isolateScope();
      isolateScope.toggle();
      el.find('.mw-collapsible-body').trigger('transitionendFromTest');
      scope.$digest();

      expect(el.find('.mw-collapsible-body').css('max-height')).toBe('none');
    });
  });
});
