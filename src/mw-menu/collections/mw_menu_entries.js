/**
 * Created by zarges on 15/02/16.
 */
var MwMenuEntries = Backbone.Collection.extend({
  model: window.mwUI.Menu.MwMenuEntry,
  comparator: 'order',
  _isAlreadyRegistered: function(entry) {
    return (
      this.get(entry.id) ||
      (entry.url && this.findWhere({url: entry.url}))
    );
  },
  _throwIsAlreadyRegisteredError: function(entry){
    if(entry.url){
      throw new Error('The entry with the id ' + entry.id + ' and the url ' + entry.url + ' has already been registered');
    } else {
      throw new Error('The entry with the id ' + entry.id + ' has already been registered');
    }
  },
  add: function(entries){
    if(_.isArray(entries)){
      entries.forEach(function(entry){
        if(this._isAlreadyRegistered(entry)){
          this._throwIsAlreadyRegisteredError(entry);
        }
      }.bind(this));
    } else {
      if(this._isAlreadyRegistered(entries)){
        this._throwIsAlreadyRegisteredError(entries);
      }
    }
    return Backbone.Collection.prototype.add.apply(this, arguments);
  },
  addEntry: function(id, url, label, options){
    options = options || {};
    var addObj = {
      id: id,
      url: url,
      label: label,
      icon: options.icon,
      activeUrls: options.activeUrls || [],
      order: options.order,
      subEntries: options.subEntries || [],
      type: 'ENTRY'
    };

    return this.add(addObj);
  },
  addDivider: function(id, options){
    options = options || {};
    var addObj = {
      id: id,
      label: options.label,
      order: options.order,
      type: 'DIVIDER'
    };

    return this.add(addObj);
  },

  getActiveEntryForUrl: function(url){
    var activeEntryFound = false,
        activeEntry = null;

    this.each(function(model){
      if(!activeEntryFound && model.hasActiveSubEntryOrIsActiveForUrl(url)){
        activeEntryFound = true;
        activeEntry = model;
      }
    });

    return activeEntry;
  }
});

window.mwUI.Menu.MwMenuEntries = MwMenuEntries;