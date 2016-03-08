mwUI.Backbone.SelectableCollection = Backbone.SelectableCollection = Backbone.Collection.extend({
  selectable: true,
  selectableOptions: function(){
    return {
      isSingleSelection: false,
      addPreSelectedToCollection: false,
      unSelectOnRemove: false,
      preSelected: new Backbone.Collection()
    };
  },
  selectableCollectionConstructor: function(options){
    if (this.selectable) {
      this.selectable = new mwUI.Backbone.Selectable.Collection(this, this.selectableOptions.call(this,options));
    }
  },
  constructor: function (attributes, options) {
    var superConstructor = Backbone.Collection.prototype.constructor.call(this, attributes, options);
    this.selectableCollectionConstructor(options);
    return superConstructor;
  }
});