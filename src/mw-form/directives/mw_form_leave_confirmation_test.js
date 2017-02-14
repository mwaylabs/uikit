describe('testing mwFormLeaveConfirmation', function () {
  beforeEach(module('mwUI.Form'));

  window.mockI18nService();
  var Modal = window.mockModal();

  var fakeRouteChange = function () {
    this.$rootScope.$broadcast('$locationChangeStart');
    this.scope.$digest();
  };

  beforeEach(inject(function ($rootScope, $compile) {
    this.$rootScope = $rootScope;
    this.scope = $rootScope.$new();
    this.$compile = $compile;
    this.scope.noOp = function (ev) {
      ev.preventDefault();
    };
    var form = '<form name="testform" mw-form-leave-confirmation ng-submit="noOp($event)"><input id="testInput" ng-model="testInputModel" name="test"></form>';
    this.$form = this.$compile(form)(this.scope);
  }));

  afterEach(function () {
    Modal.show.calls.reset();
    this.$form.submit().triggerHandler('submit');
  });

  it('does not open leave-confirmation modal when form is pristine (not touched)', function () {
    fakeRouteChange.apply(this);

    expect(Modal.show).not.toHaveBeenCalled();
  });

  it('open leave-confirmation modal when form is dirty and user tries to leave the page', function () {
    this.$form.find('#testInput').val('XXX').triggerHandler('input');
    this.scope.$digest();

    fakeRouteChange.apply(this);

    expect(Modal.show).toHaveBeenCalled();
  });

  it('does not open leave-confirmation modal after form has been submitted', function () {
    this.$form.find('#testInput').val('XXX').triggerHandler('input');
    this.$form.submit().triggerHandler('submit');
    this.scope.$digest();

    fakeRouteChange.apply(this);

    expect(Modal.show).not.toHaveBeenCalled();
  });

  it('does open leave-confirmation modal when form has been submitted and modified afterwards', function () {
    this.$form.find('#testInput').val('XXX').triggerHandler('input');
    this.$form.submit().triggerHandler('submit');
    this.scope.$digest();

    this.$form.triggerHandler('input');
    this.scope.$digest();
    fakeRouteChange.apply(this);

    expect(Modal.show).toHaveBeenCalled();
  });
});