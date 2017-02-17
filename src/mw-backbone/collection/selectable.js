mwUI.Backbone.Selectable.Collection = function (collectionInstance, options) {
  var _collection = collectionInstance,
    _options = options || {},
    _modelHasDisabledFn = true,
    _isSingleSelection = _options.isSingleSelection || false,
    _addPreSelectedToCollection = _options.addPreSelectedToCollection || false,
    _unSelectOnRemove = _options.unSelectOnRemove,
    _preSelected = options.preSelected,
    _hasPreSelectedItems = !!options.preSelected,
    _selected = new Backbone.Collection();

  var _preselect = function () {
    if (_preSelected instanceof Backbone.Model) {
      _isSingleSelection = true;
      this.preSelectModel(_preSelected);
    } else if (_preSelected instanceof Backbone.Collection) {
      _isSingleSelection = false;
      this.preSelectCollection(_preSelected);
    } else {
      throw new Error('The option preSelected has to be either a Backbone Model or Collection');
    }
  };

  var _selectWhenModelIsSelected = function (model) {
    if (!_selected.get(model)) {
      this.select(model);
    }
  };

  var _unSelectWhenModelIsUnSelected = function (model) {
    if (_selected.get(model)) {
      this.unSelect(model);
    }
  };

  var _unSelectWhenModelIsUnset = function (model, opts) {
    opts = opts || {};
    if (opts.unset || !model.id || model.id.length < 1) {
      this.unSelect(model);
    }
  };

  var _bindModelOnSelectListener = function (model) {
    model.selectable.off('change:select', _selectWhenModelIsSelected);
    model.selectable.on('change:select', _selectWhenModelIsSelected, this);
  };

  var _bindModelOnUnSelectListener = function (model) {
    model.selectable.off('change:unselect', _unSelectWhenModelIsUnSelected);
    model.selectable.on('change:unselect', _unSelectWhenModelIsUnSelected, this);
  };

  var _setModelSelectableOptions = function (model, options) {
    if (model && model.selectable) {
      var selectedModel = _selected.get(model);

      if (selectedModel) {
        if (_collection.get(model)) {
          model.selectable.isInCollection = true;
          selectedModel.selectable.isInCollection = true;
        } else {
          model.selectable.isInCollection = false;
          selectedModel.selectable.isInCollection = false;
        }
        model.selectable.select(options);
        selectedModel.selectable.select(options);
      } else {
        model.selectable.unSelect(options);
      }

      _bindModelOnSelectListener.call(this, model);
      _bindModelOnUnSelectListener.call(this, model);
    }
  };

  var _updatePreSelectedModel = function (preSelectedModel, model) {
    if (_hasPreSelectedItems) {
      if (this.isSingleSelection()) {
        _preSelected = model;
      } else {
        _preSelected.remove(preSelectedModel, {silent: true});
        _preSelected.add(model, {silent: true});
      }
    }
  };

  var _updateSelectedModel = function (model) {
    var selectedModel = this.getSelected().get(model);
    if (selectedModel) {
      this.unSelect(selectedModel, {silent: true});
      this.select(model, {silent: true});
      _updatePreSelectedModel.call(this, selectedModel, model);
      _setModelSelectableOptions.call(this, selectedModel, {silent: true});
    }
  };

  this.getSelected = function () {
    return _selected;
  };

  this.getDisabled = function () {
    var disabled = new Backbone.Collection();
    if (_modelHasDisabledFn) {
      _collection.each(function (model) {
        if (model.selectable && model.selectable.isDisabled()) {
          disabled.add(model);
        }
      });
    }

    return disabled;
  };

  /**
   *
   * @param model
   */
  this.select = function (model, options) {
    options = options || {};
    if (model instanceof Backbone.Model) {
      if (!(model instanceof _collection.model)) {
        model = new _collection.model(model.toJSON());
      }

      if (!model.selectable || (model.selectable.isDisabled() && !options.force)) {
        return;
      }

      if (_isSingleSelection) {
        this.unSelectAll();
      }

      model.off('change', _unSelectWhenModelIsUnset);
      model.on('change', _unSelectWhenModelIsUnset, this);

      _selected.add(model, options);
      _setModelSelectableOptions.call(this, model, options);
      if (!options.silent) {
        this.trigger('change change:add', model, this);
      }
    } else {
      throw new Error('The first argument has to be a Backbone Model');
    }
  };

  this.selectAll = function () {
    _collection.each(function (model) {
      this.select(model);
    }, this);
  };

  this.unSelect = function (model, options) {
    options = options || {};
    _selected.remove(model, options);
    _setModelSelectableOptions.call(this, model, options);
    if (!options.silent) {
      this.trigger('change change:remove', model, this);
    }
  };

  this.unSelectAll = function () {
    var selection = this.getSelected().clone();
    selection.each(function (model) {
      this.unSelect(model);
    }, this);
  };

  this.toggleSelectAll = function () {
    if (this.allSelected()) {
      this.unSelectAll();
    } else {
      this.selectAll();
    }
  };

  this.allSelected = function () {
    var disabledModelsAmount = this.getDisabled().length;

    return this.getSelected().length === _collection.length - disabledModelsAmount;
  };

  this.allDisabled = function () {
    return this.getDisabled().length === _collection.length;
  };

  this.isSingleSelection = function () {
    return _isSingleSelection;
  };

  this.reset = function () {
    this.unSelectAll();
    _preselect.call(this);
  };

  this.preSelectModel = function (model) {
    if (model.id) {

      _hasPreSelectedItems = true;

      if (!_collection.get(model) && _addPreSelectedToCollection) {
        _collection.add(model);
      } else if (_collection.get(model)) {
        model = _collection.get(model);
      }

      this.select(model, {force: true, silent: true});
    }
  };

  this.preSelectCollection = function (collection) {
    collection.each(function (model) {
      this.preSelectModel(model);
    }, this);

    collection.on('add', function (model) {
      this.preSelectModel(model);
    }, this);

    collection.on('remove', function (model) {
      this.unSelect(model);
    }, this);

  };


  var main = function () {
    if (!(_collection instanceof Backbone.Collection)) {
      throw new Error('The first parameter has to be from type Backbone.Collection');
    }

    _collection.on('add', function (model) {
      _modelHasDisabledFn = model.selectable.hasDisabledFn;
      _setModelSelectableOptions.call(this, model);
      _updateSelectedModel.call(this, model);
    }, this);

    _collection.on('remove', function (model) {
      if (_unSelectOnRemove) {
        this.unSelect(model);
      } else {
        _setModelSelectableOptions.call(this, model);
      }
    }, this);

    _collection.on('reset', function () {
      if (_unSelectOnRemove) {
        this.unSelectAll();
      } else {
        this.getSelected().each(function (model) {
          _setModelSelectableOptions.call(this, model);
        }, this);
      }
    }, this);

    if (_hasPreSelectedItems) {
      _preselect.call(this);
    }
  };

  main.call(this);

};

_.extend(mwUI.Backbone.Selectable.Collection.prototype, Backbone.Events);