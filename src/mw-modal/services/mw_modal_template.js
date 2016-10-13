angular.module('mwUI.Modal')

  .provider('mwModalTmpl', function () {

    var _logoPath;

    this.setLogoPath = function (path) {
      _logoPath = path;
    };

    this.$get = function () {
      return {
        getLogoPath: function () {
          return _logoPath;
        }
      };
    };
  });