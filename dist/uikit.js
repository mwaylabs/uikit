(function (root, angular) {
  'use strict';

  angular.module('mwUI', [
    'mwUI.Inputs',
    'mwUI.i18n',
    'mwUI.Layout'
  ]);

  root.mwUI = {};

angular.module("mwUI").run(["$templateCache", function($templateCache) {  'use strict';

  $templateCache.put('uikit/mw-layout/templates/mw_app.html',
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Title</title></head><body></body></html>"
  );


  $templateCache.put('uikit/mw-layout/templates/mw_header.html',
    "<div class=\"mw-header\"><div ng-if=\"showBackButton\" class=\"back-btn clickable\" data-text=\"{{'common.back' | i18n}}\" ng-click=\"back()\"><span mw-icon=\"fa-angle-left\"></span></div><div class=\"title-holder\"><span mw-icon=\"{{mwTitleIcon}}\" class=\"header-icon\" ng-if=\"mwTitleIcon\"></span><div ng-if=\"mwBreadCrumbs\" mw-bread-crumbs-holder><div ng-repeat=\"breadCrumb in mwBreadCrumbs\" mw-bread-crumb url=\"{{breadCrumb.url}}\" title=\"{{breadCrumb.title}}\" show-arrow=\"true\"></div></div><h1 class=\"lead page-title\" ng-click=\"refresh()\">{{title}}</h1></div><div ng-if=\"warningCondition\" class=\"warnin-content\" mw-tooltip=\"{{ warningText }}\"><span class=\"text-warning\" mw-icon=\"fa-warning\"></span> <span class=\"popover-container\"></span></div><div class=\"additional-content-holder\" ng-transclude></div></div>"
  );


  $templateCache.put('uikit/mw-ui-components/templates/mw_view_change_loader.html',
    "<div class=\"mw-view-change-loader\" ng-if=\"viewModel.loading\"><div class=\"spinner\"></div></div>"
  );


  $templateCache.put('uikit/templates/mwSidebarBb/mwSidebarInput.html',
    "<div class=\"row\"><div class=\"col-md-12 form-group\" ng-class=\"{'has-error': !isValid()}\" style=\"margin-bottom: 0\"><input type=\"{{_type}}\" ng-if=\"!customUrlParameter\" class=\"form-control\" ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" ng-model-options=\"{ debounce: 500 }\"><input type=\"{{_type}}\" ng-if=\"customUrlParameter\" class=\"form-control\" ng-model=\"viewModel.val\" ng-change=\"changed()\" ng-disabled=\"mwDisabled\" placeholder=\"{{placeholder}}\" ng-model-options=\"{ debounce: 500 }\"></div></div>"
  );
}]);

angular.module('mwUI.i18n', [

]);

angular.module('mwUI.i18n')

  .provider('i18n', function () {

    var _resources = [],
      _locales = [],
      _dictionary = {},
      _isLoadingresources = false,
      _oldLocale = null,
      _defaultLocale = null;

    var _getActiveLocale = function () {
      // This variable was set from 'LanguageService' in method setDefaultLocale()
      return _.findWhere(_locales, {active: true});
    };

    var _setActiveLocale = function (locale) {
      var oldLocale = _getActiveLocale(),
        newLocale = _.findWhere(_locales, {id: locale});

      if (newLocale) {
        if (oldLocale) {
          oldLocale.active = false;
        }

        newLocale.active = true;
      } else {
        throw new Error('You can not set a locale that has not been registered. Please register the locale first by calling addLocale()');
      }
    };

    /**
     * Returns a translation for a key when a translation is available otherwise false
     * @param key {String}
     * @returns {*}
     * @private
     */
    var _getTranslationForKey = function (key) {
      var activeLocale = _oldLocale || _getActiveLocale();

      if(activeLocale && _dictionary && _dictionary[activeLocale.id]){
        var translation = _dictionary[activeLocale.id];
        angular.forEach(key.split('.'), function (k) {
          translation = translation ? translation[k] : null;
        });
        return translation;
      } else {
        return false;
      }
    };

    /**
     * Checks all locales for an available translation until it finds one
     * @param property {String}
     * @returns {*}
     * @private
     */
    var _getContentOfOtherLocale = function (property) {
      var result;
      _.each(_locales, function (locale) {
        if (!result && property[locale.id]) {
          result = property[locale.id];
        }
      });
      if(!result){
        result = _.values(property)[0];
      }
      return result;
    };

    /**
     * Return all placeholders that are available in the translation string
     * @param property {String}
     * @returns {String}
     * @private
     */
    var _getUsedPlaceholdersInTranslationStr = function(str){

      var re = /{{([a-zA-Z0-9$_]+)}}/g,
        usedPlaceHolders = [],
        matches;

      while ((matches = re.exec(str)) !== null) {
        if (matches.index === re.lastIndex) {
          re.lastIndex++;
        }
        usedPlaceHolders.push(matches[1]);
      }

      return usedPlaceHolders;
    };

    /**
     * Replaces placeholders in transaltion string with a value defined in the placeholder param
     * @param str
     * @param placeholder
     * @returns {String}
     * @private
     */
    var _replacePlaceholders = function (str, placeholders) {
      if(placeholders){
        var usedPlaceHolders = _getUsedPlaceholdersInTranslationStr(str);
        usedPlaceHolders.forEach(function(usedPlaceholder){
          str = str.replace('{{' + usedPlaceholder + '}}', placeholders[usedPlaceholder]);
        });
      }
      return str;
    };

    /**
     * Registers a locale for which translations are available
     * @param locale
     * @param name
     * @param fileExtension
     */
    this.addLocale = function (locale, name, fileExtension) {
      if (!_.findWhere(_locales, {id: locale})) {
        _locales.push({
          id: locale,
          name: name,
          active: locale === _defaultLocale,
          fileExtension: fileExtension || locale + '.json'
        });
        _dictionary[locale] = {};
      }
    };

    /**
     * Registers a resource so it can be accessed later by calling the public method get
     * @param resourcePath {String}
     * @param fileNameForLocale {String}
     */
    this.addResource = function (resourcePath) {
      if (!_.findWhere(_resources, {path: resourcePath})) {
        _resources.push({
          path: resourcePath
        });
      }
    };

    this.setDefaultLocale = function (locale) {
      _defaultLocale = locale;
      if(_.findWhere(_locales, {id: locale})){
        _setActiveLocale(locale);
      }
    };

    this.$get = ['$templateRequest', '$q', '$rootScope', function ($templateRequest, $q, $rootScope) {
      return {
        /**
         * Fills the dictionary with the translations by using the angular templateCache
         * We need the dictionary because the get method has to be synchronous for the angular filter
         * @param resourcePath {String}
         */
        _loadResource: function (resourcePath) {
          var resource = _.findWhere(_resources, {path: resourcePath}),
            activeLocale = this.getActiveLocale(),
            fileName = '';

          if (resource && activeLocale) {
            fileName = activeLocale.fileExtension;

            return $templateRequest(resource.path + '/' + fileName).then(function (content) {
              _.extend(_dictionary[activeLocale.id], JSON.parse(content));
              return content;
            });
          } else {
            return $q.reject('Resource not available or no locale has been set');
          }
        },

        /**
         * Returns all registered locales
         * @returns {Array}
         */
        getLocales: function(){
          return _locales;
        },

        /**
         * Return the currently active locale
         * @returns {Object}
         */
        getActiveLocale: function () {
          return _getActiveLocale();
        },

        /**
         * translates key into current locale, given placeholders in {{placeholderName}} are replaced
         * @param key {String}
         * @param placeholder {Object}
         */
        get: function (key, placeholder) {
          var translation = _getTranslationForKey(key);
          if (translation) {
            return _replacePlaceholders(translation, placeholder);
          } else if(_isLoadingresources){
            return '...';
          } else {
            return 'MISSING TRANSLATION ' + this.getActiveLocale().id + ': ' + key;
          }
        },

        /**
         * set the locale and loads all resources for that locale
         * @param locale {String}
         */
        setLocale: function (localeid) {
          var loadTasks = [];
          _isLoadingresources = true;
          _oldLocale = this.getActiveLocale();
          _setActiveLocale(localeid);
          _.each(_resources, function (resource) {
            loadTasks.push(this._loadResource(resource.path));
          }, this);
          return $q.all(loadTasks).then(function () {
            _isLoadingresources = false;
            _oldLocale = null;
            $rootScope.$broadcast('i18n:localeChanged', localeid);
            return localeid;
          });
        },

        /**
         * checks if a translation for the key is available
         * @param key {String}
         * @returns {boolean}
         */
        translationIsAvailable: function(key){
          return !!_getTranslationForKey(key);
        },
        /**
         * return value of an internationalized object e.g {en_US:'English text', de_DE:'German text'}
         * When no translation is availabe for the current set locale it tries the default locale.
         * When no translation is available for the defaultLocale it tries all other available locales until
         * a translation is found
         * @param property {object}
         * @returns {String}
         */
        localize: function (property) {
          var activeLocale = this.getActiveLocale();
          var p = property[activeLocale.id];
          if (angular.isDefined(p) && p !== '') {
            return p;
          } else {
            return property[_defaultLocale] || _getContentOfOtherLocale(property);
          }
        }
      };
    }];

  });
angular.module('mwUI.i18n')

  .filter('i18n', ['i18n', function (i18n) {

    function i18nFilter(translationKey, placeholder) {
      if (_.isString(translationKey)) {
        return i18n.get(translationKey, placeholder);
      } else if(_.isObject(translationKey)){
        return i18n.localize(translationKey);
      }
    }

    i18nFilter.$stateful = true;

    return i18nFilter;
  }]);
angular.module('mwUI.Inputs', []);

angular.module('mwUI.Inputs')

  .directive('mwCheckbox', function () {
    return {
      restrict: 'A',
      link: function (scope, el) {
        // render custom checkbox
        // to preserve the functionality of the original checkbox we just wrap it with a custom element
        // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
        // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
        var render = function () {
          var customCheckbox = angular.element('<span class="custom-checkbox mw-checkbox"></span>'),
            customCheckboxStateIndicator = angular.element('<span class="state-indicator"></span>'),
            customCheckboxStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

          el.wrap(customCheckbox);
          customCheckboxStateIndicator.insertAfter(el);
          customCheckboxStateFocusIndicator.insertAfter(customCheckboxStateIndicator);
        };

        (function init() {
          //after this the remaining element is removed
          scope.$on('$destroy', function () {
            el.off();
            el.parent('.mw-checkbox').remove();
          });

          render();

        }());
      }
    };
  });
angular.module('mwUI.Inputs')

  .directive('mwRadio', function () {
    return {
      restrict: 'A',
      link: function (scope, el) {
        // render custom radio
        // to preserve the functionality of the original checkbox we just wrap it with a custom element
        // checkbox is set to opacity 0 and has to be positioned absolute inside the custom checkbox element which has to be positioned relative
        // additionally a custom status indicator is appended as a sibling of the original checkbox inside the custom checkbox wrapper
        var render = function () {
          var customRadio = angular.element('<span class="custom-radio mw-radio"></span>'),
            customRadioStateIndicator = angular.element('<span class="state-indicator"></span>'),
            customRadioStateFocusIndicator = angular.element('<span class="state-focus-indicator"></span>');

          el.wrap(customRadio);
          customRadioStateIndicator.insertAfter(el);
          customRadioStateFocusIndicator.insertAfter(customRadioStateIndicator);
        };

        (function init() {
          //after this the remaining element is removed
          scope.$on('$destroy', function () {
            el.off();
            el.parent('.mw-radio').remove();
          });

          render();

        }());
      }
    };
  });
angular.module('mwUI.Inputs')

  .directive('mwSelect', function () {
    return {
      require: '^?ngModel',
      link: function (scope, el, attrs, ngModel) {
        var customSelectWrapper = angular.element('<span class="custom-select mw-select"></span>');

        var render = function () {
          el.wrap(customSelectWrapper);
          el.addClass('custom');
        };

        scope.$watch(
          function () {
            return ngModel.$modelValue;
          },
          function (val) {
            if (angular.isUndefined(val)) {
              el.addClass('default-selected');
            } else {
              el.removeClass('default-selected');
            }
          }
        );

        render();
      }
    };
  });
angular.module('mwUI.Layout', [

]);

angular.module('mwUI.Layout')

  .directive('mwHeader', ['$rootScope', '$route', '$location', function ($rootScope, $route, $location) {
    return {
      transclude: true,
      scope: {
        title: '@',
        url: '@',
        mwTitleIcon: '@',
        mwBreadCrumbs: '='
      },
      templateUrl: 'uikit/mw-layout/templates/mw_header.html',
      link: function (scope, el, attrs, ctrl, $transclude) {
        $rootScope.siteTitleDetails = scope.title;

        $transclude(function (clone) {
          if ((!clone || clone.length === 0) && !scope.showBackButton) {
            el.find('.mw-header').addClass('no-buttons');
          }
        });

        scope.refresh = function () {
          $route.reload();
        };

        if (!scope.url && scope.mwBreadCrumbs && scope.mwBreadCrumbs.length > 0) {
          scope.url = scope.mwBreadCrumbs[scope.mwBreadCrumbs.length - 1].url;
          scope.url = scope.url.replace('#', '');
        } else if (!scope.url && scope.showBackButton) {
          console.error('Url attribute in header is missing!!');
        }

        scope.back = function () {
          $location.path(scope.url);
        };

      }
    };
  }]);
angular.module('mwUI.UiComponents', []);

angular.module('mwUI.UiComponents')

  .directive('mwViewChangeLoader', ['$rootScope', function ($rootScope) {
    return {
      templateUrl: 'uikit/mw-ui-components/templates/mw_view_change_loader.html',
      link: function (scope) {
        scope.viewModel = {
          loading: false
        };

        var locationChangeSuccessListener = $rootScope.$on('$locationChangeSuccess', function () {
          scope.viewModel.loading = true;
        });

        var routeChangeSuccessListener = $rootScope.$on('$routeChangeSuccess', function () {
          scope.viewModel.loading = false;
        });

        var routeChangeErrorListener = $rootScope.$on('$routeChangeError', function () {
          scope.viewModel.loading = false;
        });

        scope.$on('$destroy', function () {
          locationChangeSuccessListener();
          routeChangeSuccessListener();
          routeChangeErrorListener();
        });
      }
    };
  }]);

})(window, angular);