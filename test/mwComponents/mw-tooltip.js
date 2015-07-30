describe('mwTooltip', function () {
  var $compile;
  var $rootScope;
  var scope;
  var el;
  var isolateScope;

  beforeEach(module('mwComponents'));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();

    el = angular.element(
      '<span mw-tooltip="Tooltip"></span>'
    );

    $compile(el)(scope);
    isolateScope = el.isolateScope();
    scope.$digest();
  }));

  afterEach(function () {
    scope.$destroy();

  });

  it('should show and remove a tooltip', function (done) {
    el.trigger('mouseover');
    expect(angular.element('.popover').text()).toEqual('Tooltip');

    //this test passes when run as a single test, fails when run with all tests
    //needs a timeout of 1000s
    el.trigger('mouseleave');
    setTimeout(function(){
      expect(angular.element('.popover').text()).toEqual('');
      done();
    }, 1000);
  });

  it('should change the popovercontent when the popover is open and the content is changing', function () {
    isolateScope.text = 'JO';
    scope.$digest();
    el.trigger('mouseover');
    expect(angular.element('.popover').text()).toEqual('JO');

    isolateScope.text = 'JO2';
    scope.$digest();
    expect(angular.element('.popover').text()).toEqual('JO2');

  });

  it('should destroy the popover when the scope is destroyed', function () {
    el.trigger('mouseover');
    expect(angular.element('.popover').length).toBe(1);
    scope.$destroy();
    expect(angular.element('.popover').length).toBe(0);
  });

});
