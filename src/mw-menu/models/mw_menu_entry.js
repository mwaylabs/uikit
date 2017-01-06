var routeToRegex = mwUI.Utils.shims.routeToRegExp;

var MwMenuEntry = window.mwUI.Backbone.NestedModel.extend({
  idAttribute: 'id',
  defaults: function () {
    return {
      url: null,
      label: null,
      icon: null,
      activeUrls: [],
      order: null,
      isVisible: true
    };
  },
  nested: function () {
    return {
      subEntries: window.mwUI.Menu.MwMenuSubEntries
    };
  },
  _throwMissingIdError: function (entry) {
    throw new Error('No id is specified for the entry', entry);
  },
  _throwNoTypeCouldBeDeterminedError: function (entry) {
    throw new Error('No type could be determinded for the given entry: ', entry);
  },
  _throwNotValidEntryError: function (entry) {
    throw new Error('Is not a valid entry', entry);
  },
  _determineType: function (entry) {
    if (!entry.type) {
      if (!entry.url && (!entry.subEntries || entry.subEntries.length === 0) && !(entry.label || entry.icon)) {
        entry.type = 'DIVIDER';
      } else if (entry.url || entry.subEntries && entry.subEntries.length > 0 && (entry.label || entry.icon)) {
        entry.type = 'ENTRY';
      } else {
        this._throwNoTypeCouldBeDeterminedError();
      }
    }

    return entry;
  },
  _missingLabel: function (entry) {
    return entry.type === 'ENTRY' && !entry.label && !entry.icon;
  },
  _urlsAreMatching: function (url, matchUrl) {
    if (matchUrl.match('#')) {
      matchUrl = matchUrl.split('#')[1];
    }
    return url.match(routeToRegex(matchUrl));
  },
  validate: function (entry) {
    if (entry && _.isObject(entry)) {
      entry = this._determineType(entry);
      if (!entry.id) {
        this._throwMissingIdError();
      }
      if (!this.isValidEntry(entry)) {
        this._throwNotValidEntryError(entry);
      }
    }
  },
  set: function (entry, options) {
    options = options || {};
    if (_.isUndefined(options.validate)) {
      this.validate(entry);
    }
    return window.mwUI.Backbone.NestedModel.prototype.set.call(this, entry, options);
  },
  show: function () {
    this.set('isVisible', true);
  },
  hide: function () {
    this.set('isVisible', false);
  },
  isValidEntry: function (entry) {
    if (entry.type) {
      return !this._missingLabel(entry);
    } else {
      return false;
    }
  },
  ownUrlIsActiveForUrl: function (url) {
    if (this.get('url')) {
      return this._urlsAreMatching(url, this.get('url'));
    } else {
      return false;
    }
  },
  activeUrlIsActiveForUrl: function (url) {
    var isActive = false;
    this.get('activeUrls').forEach(function (activeUrl) {
      if (!isActive) {
        isActive = this._urlsAreMatching(url, activeUrl);
      }
    }.bind(this));
    return isActive;
  },
  isSubEntry: function () {
    if (this.collection && this.collection.parent) {
      return true;
    }
    return false;
  },
  hasSubEntries: function () {
    return this.get('subEntries').length > 0;
  },
  isActiveForUrl: function (url) {
    return this.ownUrlIsActiveForUrl(url) || this.activeUrlIsActiveForUrl(url);
  },
  getActiveSubEntryForUrl: function (url) {
    return this.get('subEntries').getActiveEntryForUrl(url);
  },
  hasActiveSubEntryOrIsActiveForUrl: function (url) {
    return this.get('type') === 'ENTRY' && (!!this.getActiveSubEntryForUrl(url) || this.isActiveForUrl(url));
  },
  constructor: function (model, options) {
    options = options || {};
    options.validate = model ? true : false;
    return window.mwUI.Backbone.NestedModel.prototype.constructor.call(this, model, options);
  }
});

window.mwUI.Menu.MwMenuEntry = MwMenuEntry;