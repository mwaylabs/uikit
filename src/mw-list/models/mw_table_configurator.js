var MwTableConfigurator = window.mwUI.Backbone.Model.extend({
  fetched: false,
  nested: function(){
    return {
      columns: window.mwUI.List.MwTableColumns
    };
  },
  sync: function(){
    var dfd = Backbone.$.Deferred();
    dfd.resolve(this);
    return dfd.promise();
  },
  fetch: function(){
    if(!this.fetched){
      console.log('FETCH', this.id);
      var localStorageResult = localStorage.getItem(window.mwUI.List.localStoragePrefix+'_'+this.id);
      if(localStorageResult){
        this.set(JSON.parse(localStorageResult));
      }
      this.fetched = true;
    }
    return this.sync();
  },
  save: function(){
    localStorage.setItem(window.mwUI.List.localStoragePrefix+'_'+this.id, JSON.stringify(this.toJSON(true)));
    return this.sync();
  },
  destroy: function(){
    this.clear();
    localStorage.removeItem(window.mwUI.List.localStoragePrefix+'_'+this.id);
    return this.sync();
  },
  clear: function(){
    var id = this.get('id');
    mwUI.Backbone.Model.prototype.clear.apply(this, arguments);
    this.set('id', id);
  }
});

window.mwUI.List.MwTableConfigurator = MwTableConfigurator;