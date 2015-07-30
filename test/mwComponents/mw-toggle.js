describe('mwToggle', function () {
  var $compile;
  var $rootScope;
  var scope;
  var el;
  var $timeout;

  beforeEach(module('mwUI'));
  beforeEach(module('karmaDirectiveTemplates'));

  //mock i18n filter
  beforeEach(function(){
    module(function($provide){
      $provide.value('i18nFilter', function(){
        return function(input){
          return input;
        };
      });
    });
  });


  beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    scope = _$rootScope_.$new();

    el = angular.element(
      '<span mw-toggle mw-model="testModel" mw-change="changeOnClick()"></span>'
    );

    scope.testModel = true;

    scope.changed = false;
    scope.changeOnClick = function() {
      scope.changed = true;
    };

    $compile(el)(scope);
    scope.$digest();
  }));

  it('button should be set to "off" when clicked on "common.off"',
    function () {
      expect(el.find('.indicator').hasClass('label-danger')).toBe(false);
      expect(el.find('.indicator').hasClass('label-success enabled')).toBe(true);
      expect(scope.changed).toBe(false);

      //confusing: off button has class yes
      el.find('.yes').click();
      $timeout.flush();

      expect(el.find('.indicator').hasClass('label-danger')).toBe(true);
      expect(el.find('.indicator').hasClass('label-success enabled')).toBe(false);
      expect(scope.changed).toBe(true);
    }
  );

  it('button should be set to "on" when clicked on "common.on"',
    function () {
      scope.testModel = false;
      scope.$digest();
      expect(el.find('.indicator').hasClass('label-danger')).toBe(true);
      expect(el.find('.indicator').hasClass('label-success enabled')).toBe(false);
      expect(scope.changed).toBe(false);

      //confusing: on button has class no
      el.find('.no').click();
      $timeout.flush();

      expect(el.find('.indicator').hasClass('label-danger')).toBe(false);
      expect(el.find('.indicator').hasClass('label-success enabled')).toBe(true);
      expect(scope.changed).toBe(true);
    }
  );

  it('nothing should happen when button is set to "on" and when clicked ' +
    'on "common.on"',
    function () {
      expect(el.find('.indicator').hasClass('label-danger')).toBe(false);
      expect(el.find('.indicator').hasClass('label-success enabled')).toBe(true);
      expect(scope.changed).toBe(false);

      //confusing: on button has class no
      el.find('.no').click();
      $timeout.flush();

      expect(el.find('.indicator').hasClass('label-danger')).toBe(false);
      expect(el.find('.indicator').hasClass('label-success enabled')).toBe(true);
      expect(scope.changed).toBe(false);
    }
  );

});
