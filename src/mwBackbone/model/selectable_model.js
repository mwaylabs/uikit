/**
 * Created by zarges on 04/03/16.
 */
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
  },
  constructor: function (attributes, options) {
    var superConstructor = Backbone.Model.prototype.constructor.call(this, attributes, options);
    this.selectableModelConstructor(options);
    return superConstructor;
  }

});