mwUI.Backbone.SelectableModel = Backbone.SelectableModel = Backbone.Model.extend({
  selectable: true,
  selectableOptions: function(){
    return {
      selected: false,
      isDisabled: null
    };
  },
  selectableModelConstructor: function(options){
    if (this.selectable) {
      this.selectable = new mwUI.Backbone.Selectable.Model(this, this.selectableOptions.call(this, options));
    }
    this.on('destroy', function(){
      //Decrement counter of parent collection when model is destroyed
      if (this.collection && this.collection.filterable && this.collection.filterable.getTotalAmount() > 0) {
        this.collection.filterable.setTotalAmount(this.collection.filterable.getTotalAmount() - 1);
      }
    });
  },
  constructor: function (attributes, options) {
    var superConstructor = Backbone.Model.prototype.constructor.call(this, attributes, options);
    this.selectableModelConstructor(options);
    return superConstructor;
  }

});