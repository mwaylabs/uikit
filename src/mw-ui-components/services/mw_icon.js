/**
 * Created by zarges on 25/02/16.
 */
angular.module('mwUI.UiComponents', [])

  .provider('mwIcon', function () {

    var Icon = Backbone.Model.extend({
        defaults: function () {
          return {
            classPrefix: '',
            type: 'ICON',
            fileUrl: null,
            isLoading: false,
            loaded: false,
            icons: {}
          };
        },
        _throwNotValidIconError: function () {
          throw new Error('You have to set either icons or set a filePath');
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

          if (icon) {
            dfd.resolve(icon);
          } else if (this.get('isLoading')) {
            this.on('change:isLoading', function () {
              this.getIconForKey(key).then(function (icon) {
                dfd.resolve(icon);
              });
            }.bind(this));
          } else {
            throw new Error('No Icon was found for the key ' + key);
          }
          return dfd.promise();
        },
        isValidIcon: function (icon) {
          return (icon.icons && _.size(icon.icons) > 0 || icon.fileUrl);
        },
        constructor: function (icon, options) {
          if (!this.isValidIcon(icon)) {
            this._throwNotValidIconError();
          }
          return Backbone.Model.prototype.constructor.call(this, icon, options);
        }
      }),
      Icons = Backbone.Collection.extend({
        model: Icon
      }),
      icons = new Icons();

    this.register = function (icon) {
      return icons.add(icon);
    };

    this.$get = function ($q, $templateRequest) {
      var _loadIconFile = function (icon) {
        if (icon.get('fileUrl') && !icon.get('loaded')) {
          icon.set('isLoading', true);
          return $templateRequest(icon.get('fileUrl')).then(function (content) {
            icon.set('icons', JSON.parse(content));
            icon.set('isLoading', false);
            icon.set('loaded', true);
            return icon;
          });
        } else {
          return $q.reject('The icon has nor fileUrl');
        }
      };


      icons.each(_loadIconFile);
      icons.on('add', _loadIconFile);

      return {
        register: function (icon) {
          return icons.add(icon);
        },
        getIconSet: function (key, id) {
          var icon;

          key = key.split('.');
          if (key.length > 1 && (!id || id === key[0])) {
            id = key.splice(0, 1)[0];
          }
          key = key.join('.');

          if (id) {
            icon = icons.get(id);
          } else if (!id && icons.length < 2) {
            icon = icons.first();
          } else {
            throw new Error('Multiple icons are registered. Please pass an ID to find an icon for the key ' + key);
          }

          if (icon) {
            return icon;
          } else {
            throw new Error('No icons have been registered yet. Please register at least one icon');
          }
        },
        getIcons: function () {
          return icons;
        }
      };
    };

  });