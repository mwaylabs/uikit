/**
 * Created by zarges on 08/01/16.
 */
'use strict';

angular.module('mwUI.mwLayout')

  .provider('mwMenu', function () {

    var _entries = [];

    var Entry = function (url, label, icon, options) {
      this.url = url;
      this.label = label;
      this.icon = icon;

      this.options = _.extend({
        order: null,
        activeUrls: [url],
        subEntries: [],
        divider: false
      },options || {});

      this.isDivider = this.options.divider;

      if(!this.url && !options.divider){
        throw new Error('Url is a required constructor param');
      }

      return this;
    };

    _.extend(Entry.prototype, {
      isActive: function () {

      },
      getActive: function(){

      }
    });

    var SubEntry = function () {
      var superConstr = Entry.apply(this, arguments);
      return superConstr;
    };

    SubEntry.prototype = Object.create(Entry.prototype);
    SubEntry.prototype.constructor = SubEntry;

    var MainEntry = function (url, label, icon, options) {
      var superConstr = Entry.apply(this, arguments);
      this._subEntries = [];
      if (this.options.subEntries) {
        this.options.subEntries.forEach(function (entry) {
          this.registerSubEntry(entry.url,entry.label,entry.icon,options);
        }.bind(this));
      }
      return superConstr;
    };

    MainEntry.prototype = Object.create(Entry.prototype);
    MainEntry.prototype.constructor = MainEntry;

    _.extend(MainEntry.prototype, {
      addSubEntry: function (url, label, icon, options) {
        options = _.extend({order: this._subEntries.length}, options || {});
        var entry = new SubEntry(url, url, label, icon, options);

        if (_.findWhere(this._subEntries, {url: entry.url})) {
          throw new Error('Sub entry with the url ' + entry.url + ' already exists');
        } else {
          this._subEntries.push(entry);
        }
        return entry;
      },
      getSubEntries: function () {
        return this._subEntries;
      },
      getSubEntriesWithoutDividers: function(){
        return _.where(this._subEntries,{isDivider: false});
      },
      addDivider: function(id, label, icon, options){
        options = _.extend({order: this._subEntries.length}, options || {});
        options.divider = true;
        var entry = new SubEntry(id, null, label, icon, options);
        if (_.findWhere(this._subEntries, {id: entry.id})) {
          throw new Error('Entry with the id ' + entry.id + ' already exists');
        } else {
          this._subEntries.push(entry);
        }
      },
      getDividers: function(){
        return _.where(this._subEntries,{isDivider: true});
      }
    });

    this.$get =  function () {
      return {
        getEntries: function () {
          return _entries;
        },
        getActiveEntry: function(){

        },
        addEntry: function (url, label, icon, options) {
          options = _.extend({order: _entries.length}, options || {});
          var entry = new MainEntry(url, url, label, icon, options);

          if (_.findWhere(_entries, {url: entry.url})) {
            throw new Error('Entry with the url ' + entry.url + ' already exists');
          } else {
            _entries.push(entry);
          }
          return entry;
        },
        removeEntry: function (entry) {
          entry = _.findWhere(_entries, {id: entry.id || entry});
          if (!entry) {
            throw new Error('The entry could not be found');
          } else {
            _entries = _.without(_entries, entry);
          }
        }
      };
    };

  })

  .directive('mwMenu', function () {
    return {
      transclude: true,
      templateUrl: 'uikit/templates/mwLayout/mw_menu.html',
      link: function () {

      }
    };
  });