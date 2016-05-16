/**
 * Created by zarges on 25/02/16.
 */
angular.module('mwUI.UiComponents')

  .provider('mwIcon', function () {

    var IconSet = Backbone.Model.extend({
        defaults: function () {
          return {
            classPrefix: '',
            type: 'FONTICON',
            iconsUrl: null,
            isLoading: false,
            loaded: false,
            icons: {}
          };
        },
        _throwNotValidIconError: function () {
          throw new Error('You have to set either icons or set a filePath');
        },
        _needsToBeLoaded: function(){
          return this.get('iconsUrl') && !this.get('loaded');
        },
        loadFn: function () {
          throw new Error('Has to overwritten with a real loader fn');
        },
        getIconForKey: function (key) {
          var keys = key.split('.'),
            icons = this.get('icons'),
            dfd = Backbone.$.Deferred(),
            icon;

          keys.forEach(function (key) {
            if (icon && icon[key]) {
              icon = icon[key];
            } else {
              icon = icons[key];
            }
          });

          if (icon && !this._needsToBeLoaded()) {
            dfd.resolve(icon);
          } else if (this._needsToBeLoaded()) {

            this.on('change:loaded', function () {
              return this.getIconForKey(key).then(function (icon) {
                dfd.resolve(icon);
              });
            }.bind(this));

            if (!this.get('isLoading')) {
              this.set('isLoading', true);
              this.loadFn().then(function (icons) {
                _.extend(this.get('icons'), icons);
                this.set('isLoading', false);
                this.set('loaded', true);
              }.bind(this));
            }

          } else {
            throw new Error('No Icon was found for the key ' + key);
          }
          return dfd.promise();
        },
        isValidIcon: function (icon) {
          return (icon.icons && _.size(icon.icons) > 0 || icon.iconsUrl);
        },
        addIcons: function (icons, replace) {
          var alreadyRegistered = _.intersection(_.keys(this.get('icons')), _.keys(icons));
          if (alreadyRegistered.length > 0 && !replace) {
            throw new Error('The icons ' + alreadyRegistered.join(',') + ' already exists. If you want to replace them use the method replaceIcons');
          } else {
            _.extend(this.get('icons'), icons);
            if(alreadyRegistered.length>0){
              this.trigger('icons:replace');
            } else {
              this.trigger('icons:add', icons);
            }
          }
        },
        replaceIcons: function (icons) {
          if (!this._needsToBeLoaded()) {
            this.addIcons(icons, true);
          } else {
            this.on('change:loaded', function () {
              this.addIcons(icons, true);
            }.bind(this));
          }
        },
        constructor: function (icon, options) {
          if (!this.isValidIcon(icon)) {
            this._throwNotValidIconError();
          }
          if (icon.iconsUrl) {
            icon.loaded = false;
          }
          return Backbone.Model.prototype.constructor.call(this, icon, options);
        }
      }),
      IconSets = Backbone.Collection.extend({
        model: IconSet
      }),
      icons = new IconSets();

    var _addIconSet = function (iconSet) {
      if (!iconSet.id) {
        throw new Error('You have to set an identifier for you iconset');
      } else if (icons.get(iconSet.id)) {
        throw new Error('The iconset has already been registered');
      } else {
        icons.add(iconSet);
      }
    };

    var _getIconSet = function (id) {
      var icon = icons.get(id);
      if (icon) {
        return icon;
      } else {
        throw new Error('No iconset has been found for the id ' + id);
      }
    };

    this.addIconSet = _addIconSet;

    this.getIconSet = _getIconSet;

    this.$get = function ($q, $templateRequest) {
      var _loadIconFile = function (icon) {
        icon.loadFn = function () {
          return $templateRequest(icon.get('iconsUrl')).then(function (content) {
            return JSON.parse(content);
          });
        };
      };

      icons.each(_loadIconFile);
      icons.on('add', _loadIconFile);

      return {
        addIconSet: _addIconSet,
        getIconSet: _getIconSet
      };
    };

  });