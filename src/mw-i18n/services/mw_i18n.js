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

      if (activeLocale && _dictionary && _dictionary[activeLocale.id]) {
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
      if (!result) {
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
    var _getUsedPlaceholdersInTranslationStr = function (str) {

      var re = /{{\s*([a-zA-Z0-9$_]+)\s*}}/g,
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
      if (placeholders) {
        var usedPlaceHolders = _getUsedPlaceholdersInTranslationStr(str);
        usedPlaceHolders.forEach(function (usedPlaceholder) {
          var escapedPlaceholder = usedPlaceholder.replace(/[$_]/g, '\\$&'),
            replaceRegex = new RegExp('{{\\s*' + escapedPlaceholder + '\\s*}}');

          str = str.replace(replaceRegex, placeholders[usedPlaceholder]);
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
    this.addLocale = function (locale, name, fileExtension, basePath) {
      fileExtension = fileExtension || locale + '.json';

      var existingLocale = _.findWhere(_locales, {id: locale});
      if (!existingLocale) {
        _locales.push({
          id: locale,
          name: name,
          active: locale === _defaultLocale,
          basePath: basePath || '',
          fileExtension: fileExtension
        });
        _dictionary[locale] = {};
      } else {
        existingLocale.name = name;
        existingLocale.fileExtension = fileExtension;
        existingLocale.basePath = basePath;
      }
    };

    /**
     * Registers a resource so it can be accessed later by calling the public method get
     * @param resourcePath {String}
     * @param fileNameForLocale {String}
     */
    this.addResource = function (resourcePath, basePath) {
      basePath = basePath || '';

      var existingResource = _.findWhere(_resources, {path: resourcePath});
      if (!existingResource) {
        _resources.push({
          path: resourcePath,
          basePath: basePath
        });
      } else {
        existingResource.basePath = basePath;
      }
    };

    this.setDefaultLocale = function (locale) {
      _defaultLocale = locale;
      if (_.findWhere(_locales, {id: locale})) {
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
            filePath = '';

          if (resource && activeLocale) {
            filePath = mwUI.Backbone.Utils.concatUrlParts(activeLocale.basePath, resource.basePath, resource.path, activeLocale.fileExtension);

            return $templateRequest(filePath).then(function (content) {
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
        getLocales: function () {
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
          } else if (_isLoadingresources) {
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
          $rootScope.$broadcast('i18n:loadResourcesStart');
          _isLoadingresources = true;
          _oldLocale = this.getActiveLocale();
          _setActiveLocale(localeid);
          _.each(_resources, function (resource) {
            loadTasks.push(this._loadResource(resource.path));
          }, this);
          return $q.all(loadTasks).then(function () {
            _isLoadingresources = false;
            $rootScope.$broadcast('i18n:loadResourcesSuccess');
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
        translationIsAvailable: function (key) {
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
        },

        extendForLocale: function (locale, translations) {
          if (!locale) {
            throw new Error('Locale is a required argument!');
          }
          if (!_.isObject(translations)) {
            throw new Error('The translations argument is of type ' + typeof translations + ' but it has to be an object!');
          }
          if (!_.findWhere(_locales, {id: locale})) {
            throw new Error('The locale ' + locale + ' does not exist! Make sure you have registered it.');
          }
          if (!_isLoadingresources) {
            mwUI.Utils.shims.deepExtendObject(_dictionary[locale], translations);
          }
          $rootScope.$on('i18n:loadResourcesSuccess', function () {
            mwUI.Utils.shims.deepExtendObject(_dictionary[locale], translations);
          });
        },

        extend: function (localesWithTranslations) {
          if (!_.isObject(localesWithTranslations)) {
            throw new Error('The localesWithTranslations argument is from type ' + typeof localesWithTranslations + ' but it has to be an object!');
          }

          for (var locale in localesWithTranslations) {
            this.extendForLocale(locale, localesWithTranslations[locale]);
          }
        }
      };
    }];

  });