/**
 * Created by zarges on 15/02/16.
 */
var routeToRegex = mwUI.Utils.shims.routeToRegExp;

var MwMenuEntry = window.mwUI.Backbone.NestedModel.extend({
  idAttribute: 'id',
  defaults: function(){
    return {
      url: null,
      label: null,
      icon: null,
      activeUrls: [],
      order: null
    }
  },
  nested: function(){
    return {
      subEntries: window.mwUI.Menu.MwMenuSubEntries
    }
  },
  _throwMissingIdError: function(entry){
    throw new Error('No id is specified for the entry', entry);
  },
  _throwNoTypeCouldBeDeterminedError: function(entry){
    throw new Error('No type could be determinded for the given entry: ',entry);
  },
  _throwNotValidEntryError: function(entry){
    throw new Error('Is not a valid entry', entry);
  },
  _determineType: function(entry){
    if(!entry.type){
      if(!entry.url && (!entry.subEntries || entry.subEntries.length===0) && !(entry.label || entry.icon)){
        entry.type='DIVIDER';
      } else if(entry.url || entry.subEntries && entry.subEntries.length>0 && (entry.label || entry.icon)){
        entry.type='ENTRY';
      } else {
        this._throwNoTypeCouldBeDeterminedError();
      }
    }

    return entry;
  },
  _missingUrl: function(entry){
    return entry.type === 'ENTRY' && !entry.url && (!entry.subEntries || entry.subEntries.length === 0)
  },
  _missingLabel: function(entry){
    return entry.type === 'ENTRY' && !entry.label && !entry.icon;
  },
  isValidEntry: function(entry){
    if(entry.type){
      return !this._missingUrl(entry) && !this._missingLabel(entry);
    } else {
      return false;
    }
  },
  ownUrlIsActiveForUrl: function(url){
    return this.get('url').match(routeToRegex(url));
  },
  activeUrlIsActiveForUrl: function(url){
    var isActive = false;
    this.get('activeUrls').forEach(function(activeUrl){
      if(!isActive){
        isActive = url.match(routeToRegex(activeUrl));
      }
    });
    return isActive;
  },
  isActiveForUrl: function(url){
    return this.ownUrlIsActiveForUrl(url) || this.activeUrlIsActiveForUrl(url);
  },
  getActiveSubEntryForUrl: function(url){
    return this.get('subEntries').getActiveEntryForUrl(url);
  },
  hasActiveSubEntryOrIsActiveForUrl: function(url){
    return this.get('type') === 'ENTRY' && (!!this.getActiveSubEntryForUrl(url) || this.isActiveForUrl(url));
  },
  constructor: function(entry, options){
    entry = this._determineType(entry);
    if(!entry.id){
      this._throwMissingIdError();
    }
    if(!this.isValidEntry(entry)){
      this._throwNotValidEntryError();
    }
    return window.mwUI.Backbone.NestedModel.prototype.constructor.call(this, entry, options);
  }
});

window.mwUI.Menu.MwMenuEntry = MwMenuEntry;