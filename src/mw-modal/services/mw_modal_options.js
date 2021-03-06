angular.module('mwUI.Modal')

  .provider('mwModalOptions', function () {

    var _options = {
      controllerAs: '$ctrl',
      styleClass: '',
      holderEl: 'body',
      dismissible: true,
      bootStrapModalOptions: {},
      size: mwUI.Modal.Sizes.DEFAULT // can be DEFAULT, BIGGER, LARGE, FULLSCREEN
    };

    this.config = function (options) {
      if (_.isObject(options)) {
        _.extend(_options, options);
      }
    };

    this.$get = function () {
      return {
        getOptions: function () {
          return _.clone(_options);
        }
      };
    };
  });