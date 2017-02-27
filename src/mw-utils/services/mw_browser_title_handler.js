'use strict';

angular.module('mwUI.Utils')

  .provider('BrowserTitleHandler', function () {

    var _keepOriginalTitle = true,
      _currentPagetitle = '',
      _originalTitle = null;

    var _setOriginalTitle = function () {
      var titleEl = angular.element('head title');
      if (titleEl && !_originalTitle) {
        _originalTitle = titleEl.text();
      }
    };

    this.setNewTitle = function (title) {
      var titleEl = angular.element('head title');
      if (titleEl) {
        titleEl.text(title);
      }
      if (!_originalTitle) {
        _originalTitle = title;
      }
    };

    this.setKeepOriginalTitle = function (keepTitle) {
      _keepOriginalTitle = keepTitle;
    };

    var provider = this;

    this.$get = function () {
      return {
        getOriginalTitle: function () {
          if (!_originalTitle) {
            _setOriginalTitle();
          }
          return _originalTitle;
        },
        setTitle: function (title) {
          _currentPagetitle = title;
          provider.setNewTitle(this.getTitle());
        },
        getTitle: function () {
          if (_currentPagetitle) {
            if (_keepOriginalTitle) {
              return this.getOriginalTitle() + '—' + _currentPagetitle;
            } else {
              return _currentPagetitle;
            }
          } else {
            return this.getOriginalTitle();
          }
        }
      };
    };
  });

