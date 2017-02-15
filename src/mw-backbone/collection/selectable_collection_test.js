// PhantomJS doesn't support bind yet
Function.prototype.bind = Function.prototype.bind || function (thisp) {
    var fn = this;
    return function () {
      return fn.apply(thisp, arguments);
    };
  };

describe('Collection Selectable', function () {

  var collection;
  var TestModel;
  var DisabledModel;
  var __selectedCount = function () {
    return collection.selectable.getSelected().length;
  };

  beforeEach(function () {
    collection = new mwUI.Backbone.Collection();
    TestModel = mwUI.Backbone.Model;
    DisabledModel = mwUI.Backbone.Model.extend({
      selectableOptions: function () {
        return {
          isDisabled: function () {
            return true;
          }
        };
      }
    });
    collection.add([new TestModel({id: 1}), new TestModel({id: 2}), new TestModel({id: 3})]);
  });

  describe('testing selection basics', function () {
    it('should return all selected models', function () {
      var model = collection.at(0);
      model.selectable.select();
      expect(__selectedCount()).toBe(1);
    });

    it('should select models', function () {
      expect(__selectedCount()).toBe(0);
      collection.selectable.select(collection.at(0));
      expect(__selectedCount()).toBe(1);
      expect(collection.at(0).selectable.isSelected()).toBeTruthy();
    });

    it('should preselect models', function () {
      var preselect = new mwUI.Backbone.Collection([{id: 1}, {id: 2}]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {preSelected: preselect};
        },
        model: TestModel
      });
      var mainCollection = new MainCollection();
      expect(mainCollection.selectable.getSelected().length).toBe(2);
    });

    it('should convert the model that is selected to the type of the collection model type when the type differs ', function () {
      var preselect = new mwUI.Backbone.Collection([new Backbone.Model({id: 1}), new TestModel({id: 2})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {preSelected: preselect};
        },
        model: TestModel
      });
      var mainCollection = new MainCollection();
      expect(mainCollection.selectable.getSelected().at(0) instanceof TestModel).toBeTruthy();
    });

    it('should update the selected model when model in collection changes', function () {
      collection.get(1).set('name', 'a');
      collection.selectable.select(collection.get(1));
      collection.get(1).set('name', 'b');
      expect(collection.selectable.getSelected().get(1).get('name')).toEqual('b');

      var addModel = new mwUI.Backbone.Model({id: 100});
      collection.add(addModel);
      collection.selectable.select(addModel);
      addModel.set('name', 'c');
      expect(collection.selectable.getSelected().get(100).get('name')).toEqual('c');
    });

    it('should update the preselectedModel values when a model is added to the collection', function () {
      var preSelectModel = new mwUI.Backbone.Model({id: 100});
      var preSelectedCollection = new ( mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {
            preSelected: preSelectModel
          };
        }
      }) )();
      var addModel = new mwUI.Backbone.Model({id: 100, name: 'Max'});

      preSelectedCollection.add(addModel);

      expect(preSelectedCollection.selectable.getSelected().get(100).get('name')).toEqual('Max');
      addModel.set('surName', 'Musterman');
      expect(preSelectedCollection.selectable.getSelected().get(100).get('surName')).toEqual('Musterman');
    });

    it('should select models without an idAttribute', function () {
      collection.reset();
      collection.add([new mwUI.Backbone.Model(), new mwUI.Backbone.Model(), new mwUI.Backbone.Model()]);
      expect(__selectedCount()).toBe(0);
      collection.selectable.select(collection.at(0));
      expect(__selectedCount()).toBe(1);
    });

    it('should not preselect a model without an id', function () {
      var preselectModel = new TestModel();
      var preselect = new mwUI.Backbone.Collection([preselectModel]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {
            preSelected: preselect,
            addPreSelectedToCollection: false
          };
        }
      });
      var addModel = new TestModel({id: 1});
      var mainCollection = new MainCollection();

      expect(mainCollection.selectable.getSelected().length).toBe(0);
      mainCollection.selectable.select(addModel);
      expect(mainCollection.selectable.getSelected().length).toBe(1);
      expect(mainCollection.selectable.getSelected().first().cid).not.toBe(preselectModel.cid);
    });

    it('should unselect models', function () {
      collection.selectable.select(collection.at(0));
      expect(__selectedCount()).toBe(1);
      collection.selectable.unSelect(collection.at(0));
      expect(__selectedCount()).toBe(0);
    });

    it('should recognise when a model instance is selected directly', function () {
      var model = collection.at(0);
      model.selectable.select();
      expect(__selectedCount()).toBe(1);
      expect(collection.selectable.getSelected().first().get('id')).toBe(1);
    });

    it('should recognise when a model instance is unselected directly', function () {
      collection.selectable.select(collection.at(0));
      expect(__selectedCount()).toBe(1);
      var model = collection.at(0);
      model.selectable.unSelect();
      expect(__selectedCount()).toBe(0);
    });

    it('should return model as selected even when it is was removed from the collection', function () {
      collection.selectable.select(collection.at(0));
      collection.remove(collection.at(0));
      expect(__selectedCount()).toBe(1);
    });

    it('should return model as selected even when it collection was reset', function () {
      collection.selectable.select(collection.at(0));
      collection.selectable.select(collection.at(2));
      collection.reset();
      expect(__selectedCount()).toBe(2);
    });

    it('should not return model as selected when it was removed from the collection and the option unselectOnRemove is set to true', function () {
      var unSelectCollection = new (mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {
            unSelectOnRemove: true
          };
        }
      }) )();
      unSelectCollection.add(new TestModel({id: 1}));
      unSelectCollection.add(new TestModel({id: 2}));
      unSelectCollection.add(new TestModel({id: 3}));
      unSelectCollection.selectable.select(collection.at(0));
      expect(unSelectCollection.selectable.getSelected().length).toBe(1);
      unSelectCollection.remove(collection.at(0));
      expect(unSelectCollection.selectable.getSelected().length).toBe(0);
    });

    it('should not return model as selected when it was removed from the collection and the option unselectOnRemove is set to true', function () {
      var unSelectCollection = new (mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {
            unSelectOnRemove: true
          };
        }
      }) )();
      unSelectCollection.add(new TestModel({id: 1}));
      unSelectCollection.add(new TestModel({id: 2}));
      unSelectCollection.add(new TestModel({id: 3}));
      unSelectCollection.selectable.select(collection.at(0));
      unSelectCollection.selectable.select(collection.at(1));
      unSelectCollection.selectable.select(collection.at(2));
      expect(unSelectCollection.selectable.getSelected().length).toBe(3);
      unSelectCollection.reset();
      expect(unSelectCollection.selectable.getSelected().length).toBe(0);
    });

    it('should select all models', function () {
      collection.selectable.selectAll();
      expect(__selectedCount()).toBe(collection.length);
    });

    it('should unselect all models', function () {
      collection.selectable.select(collection.at(0));
      collection.selectable.select(collection.at(1));
      expect(__selectedCount()).toBe(2);
      collection.selectable.unSelectAll();
      expect(__selectedCount()).toBe(0);
    });

    it('should provide if all models are selected when calling selectAll', function () {
      expect(collection.selectable.allSelected()).toBeFalsy(false);
      collection.selectable.selectAll();
      expect(collection.selectable.allSelected()).toBeTruthy(true);
    });

    it('should provide if all models are selected when the models are selected', function () {
      expect(collection.selectable.allSelected()).toBeFalsy();
      collection.selectable.select(collection.at(0));
      expect(collection.selectable.allSelected()).toBeFalsy();
      collection.selectable.select(collection.at(1));
      collection.selectable.select(collection.at(2));
      expect(collection.selectable.allSelected()).toBeTruthy();
      collection.selectable.unSelect(collection.at(2));
      expect(collection.selectable.allSelected()).toBeFalsy();
    });
  });

  describe('testing events', function () {
    it('should trigger a change event when something was selected ', function () {
      var onSelect = jasmine.createSpy();
      collection.selectable.on('change:add', onSelect);
      collection.selectable.select(collection.at(0));
      expect(onSelect).toHaveBeenCalled();
    });

    it('should trigger a change event when something was unselected ', function () {
      var onUnSelect = jasmine.createSpy();
      collection.selectable.on('change:remove', onUnSelect);
      collection.selectable.select(collection.at(0));
      collection.selectable.unSelect(collection.at(0));
      expect(onUnSelect).toHaveBeenCalled();
    });

    it('should trigger a change event when the model was selected', function () {
      var onSelect = jasmine.createSpy();
      var onUnSelect = jasmine.createSpy();
      collection.selectable.on('change:add', onSelect);
      collection.selectable.on('change:remove', onUnSelect);
      collection.at(0).selectable.select();
      collection.at(0).selectable.unSelect();
      expect(onSelect).toHaveBeenCalled();
      expect(onUnSelect).toHaveBeenCalled();
    });

  });

  describe('testing selectable disabled case', function () {
    it('should call the isDisabled function of the model when a isDisabled function is provided', function () {
      var m = new DisabledModel(),
        c = new (mwUI.Backbone.Collection.extend({model: DisabledModel}))(),
        s = m.selectable;

      spyOn(m.selectable, 'isDisabled').and.callThrough();
      c.add(m);
      c.selectable.getDisabled();
      expect(s.isDisabled).toHaveBeenCalled();
    });

    it('should not call the isDisabled function of the model when no isDisabled function is provided', function () {
      var M = mwUI.Backbone.Model,
        m = new M(),
        c = new (mwUI.Backbone.Collection.extend({model: M}))(),
        s = m.selectable;

      spyOn(m.selectable, 'isDisabled').and.callThrough();
      c.add(m);
      c.selectable.getDisabled();

      expect(s.isDisabled).not.toHaveBeenCalled();
    });

    it('should return models where the selectable is disabled', function () {
      var disabledModel = new DisabledModel();
      expect(collection.selectable.getDisabled().length).toBe(0);
      collection.add(disabledModel);
      expect(collection.selectable.getDisabled().length).toBe(1);
      collection.remove(disabledModel);
      expect(collection.selectable.getDisabled().length).toBe(0);
    });


    it('should ignore disabled models when providing if all models are selected', function () {
      var disabledModel = new DisabledModel(),
        modelIsDisabled = true;

      disabledModel.selectable.isDisabled = function () {
        return modelIsDisabled;
      };

      collection.add(disabledModel);
      collection.selectable.select(collection.at(0));
      collection.selectable.select(collection.at(1));
      collection.selectable.select(collection.at(2));
      expect(collection.selectable.allSelected()).toBeTruthy();
      modelIsDisabled = false;
      expect(collection.selectable.allSelected()).toBeFalsy();
      collection.remove(disabledModel);
      expect(collection.selectable.allSelected()).toBeTruthy();
      collection.add(disabledModel);
    });

    it('should provide if all models are disabled', function () {
      expect(collection.selectable.allDisabled()).toBeFalsy();
      collection.reset();
      expect(collection.selectable.getSelected().length).toBe(0);
      collection.add(new DisabledModel());
      expect(collection.selectable.allDisabled()).toBeTruthy();
    });
  });

  describe('testing select all/un select all toggeling', function () {
    it('should toggle all models selected', function () {
      expect(__selectedCount()).toBe(0);
      collection.selectable.toggleSelectAll();
      expect(__selectedCount()).toBe(collection.length);
    });

    it('should toggle all models selected when not every model is already selected', function () {
      collection.selectable.select(collection.at(0));
      expect(__selectedCount()).toBe(1);
      collection.selectable.toggleSelectAll();
      expect(__selectedCount()).toBe(collection.length);
    });

    it('should toggle all models unselected when all models are already selected', function () {
      collection.selectable.selectAll();
      collection.selectable.toggleSelectAll();
      expect(__selectedCount()).toBe(0);
    });
  });

  describe('testing single selection mode', function () {
    it('should not initialize in single selection model when no options passed', function () {
      //make a new selection with the already existing collection (ust for testing)
      var selectable = new mwUI.Backbone.Selectable.Collection(collection, {});
      expect(selectable.isSingleSelection()).toBe(false);
    });

    it('should initialize in single selection model when passed via options', function () {
      var selectable = new mwUI.Backbone.Selectable.Collection(collection, {isSingleSelection: true});
      expect(selectable.isSingleSelection()).toBe(true);
    });

    it('should not initialize in single selection model  when the "selected" option is a collection', function () {
      var selectable = new mwUI.Backbone.Selectable.Collection(collection, {preSelected: new mwUI.Backbone.Collection()});
      expect(selectable.isSingleSelection()).toBe(false);
    });

    it('should initialize in single selection model when the "selected" option is a model', function () {
      var selectable = new mwUI.Backbone.Selectable.Collection(collection, {preSelected: new mwUI.Backbone.Model()});
      expect(selectable.isSingleSelection()).toBe(true);
    });

    it('should return a model which is an instance of the the main collections model type when calling getSelected when single selection mode is on', function () {
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function(){
          return {
            isSingleSelection: true
          };
        },
        model: TestModel
      });
      var mainCollection = new MainCollection();
      mainCollection.add(new TestModel({id: 123}));
      mainCollection.selectable.select(mainCollection.at(0));
      expect(mainCollection.selectable.getSelected().first() instanceof TestModel).toBe(true);
    });

    it('should remove the model from the selection when model is cleared', function () {
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function(){
          return {
            isSingleSelection: true
          };
        },
        model: TestModel
      });
      var mainCollection = new MainCollection();
      var selectModel = new TestModel({id: 123});
      mainCollection.add(selectModel);
      mainCollection.selectable.select(mainCollection.at(0));
      expect(mainCollection.selectable.getSelected().length).toBe(1);
      selectModel.clear();
      expect(mainCollection.selectable.getSelected().length).toBe(0);
    });

    it('should unselect the preselected model when another model is selected', function () {
      var preSelectedModel = new mwUI.Backbone.Model({id: 1}),
        addModel = new mwUI.Backbone.Model({id: 1}),
        addModel2 = new mwUI.Backbone.Model({id: 2}),
        MainCollection = mwUI.Backbone.Collection.extend({
          selectableOptions: function () {
            return {
              preSelected: preSelectedModel
            };
          }
        }),
        mainCollection = new MainCollection();

      mainCollection.add(addModel);
      mainCollection.add(addModel2);
      addModel2.selectable.select();
      expect(addModel.selectable.isSelected()).toBeFalsy();
    });

    it('should remove the model from the selection when the id of the model is set to null or emptystring', function () {
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function(){
          return {
            isSingleSelection: true
          };
        },
        model: TestModel
      });
      var mainCollection = new MainCollection();
      var selectModel = new TestModel({id: 123});
      mainCollection.add(selectModel);
      mainCollection.selectable.select(mainCollection.at(0));
      expect(mainCollection.selectable.getSelected().length).toBe(1);
      selectModel.set('id', null);
      expect(mainCollection.selectable.getSelected().length).toBe(0);

      selectModel.set('id', 123);
      mainCollection.selectable.select(mainCollection.at(0));
      expect(mainCollection.selectable.getSelected().length).toBe(1);
      selectModel.set('id', '');
      expect(mainCollection.selectable.getSelected().length).toBe(0);
    });

    it('should always only have one selected model when in single selection mode and model is selected through the collection', function () {
      var RadioCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function(){
          return {
            isSingleSelection: true
          };
        }
      });
      var radioCollection = new RadioCollection();
      radioCollection.add(new TestModel({id: 1}));
      radioCollection.add(new TestModel({id: 2}));
      expect(radioCollection.selectable.getSelected().length).toBe(0);
      radioCollection.selectable.select(radioCollection.at(0));
      expect(radioCollection.selectable.getSelected().length).toBe(1);
      expect(radioCollection.at(0).selectable.isSelected()).toBeTruthy();
      radioCollection.selectable.select(radioCollection.at(1));
      expect(radioCollection.selectable.getSelected().length).toBe(1);
      expect(radioCollection.at(0).selectable.isSelected()).toBeFalsy();
      expect(radioCollection.at(1).selectable.isSelected()).toBeTruthy();
    });

    it('should always only have one selected model when in single selection mode and model is selected through the model', function () {
      var RadioCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function(){
          return {
            isSingleSelection: true
          };
        }
      });
      var radioCollection = new RadioCollection();
      radioCollection.add(new TestModel({id: 1}));
      radioCollection.add(new TestModel({id: 2}));
      expect(radioCollection.selectable.getSelected().length).toBe(0);
      radioCollection.at(0).selectable.select();
      expect(radioCollection.selectable.getSelected().length).toBe(1);
      radioCollection.at(1).selectable.select();
      expect(radioCollection.selectable.getSelected().length).toBe(1);
      expect(radioCollection.selectable.getSelected().first().get('id')).toBe(2);
    });
  });

  describe('testing preselection', function () {
    it('should select all models which are in the preselected collection', function () {
      var preselect = new mwUI.Backbone.Collection([new mwUI.Backbone.Model({id: 1}), new mwUI.Backbone.Model({id: 2})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {preSelected: preselect};
        }
      });
      var mainCollection = new MainCollection();

      expect(mainCollection.selectable.getSelected().length).toBe(2);
    });

    it('should select all models that are added to the preselected collection when collection has already been initialised', function () {
      var preselect = new mwUI.Backbone.Collection([new TestModel({id: 1})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {preSelected: preselect};
        }
      });
      var mainCollection = new MainCollection();

      preselect.add(new TestModel({id: 2}));
      expect(mainCollection.selectable.getSelected().length).toBe(2);
    });

    it('should unselect all models that are removed from the preselected collection', function () {
      var preselect = new mwUI.Backbone.Collection([new TestModel({id: 1})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {preSelected: preselect};
        }
      });
      var mainCollection = new MainCollection();

      preselect.remove(preselect.at(0));
      expect(mainCollection.selectable.getSelected().length).toBe(0);
    });

    it('should unselect models that preselected collection when they are cleared', function () {
      var preselect = new mwUI.Backbone.Collection([new TestModel({id: 1})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {preSelected: preselect};
        }
      });
      var mainCollection = new MainCollection();

      expect(mainCollection.selectable.getSelected().length).toBe(1);
      preselect.at(0).clear();
      expect(mainCollection.selectable.getSelected().length).toBe(0);
    });

    it('should select all models which are in the preselected collection, not add them to collection when addPreSelectedToCollection is not set and set attribute in model selectable isInCollection to false', function () {
      var preselect = new mwUI.Backbone.Collection([new TestModel({id: 1})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {preSelected: preselect};
        }
      });
      var mainCollection = new MainCollection(new TestModel({id: 1}));

      preselect.add(new TestModel({id: 2}));
      expect(mainCollection.selectable.getSelected().length).toBe(2);
      expect(mainCollection.get(2)).toBeUndefined();
      expect(mainCollection.selectable.getSelected().get(2).selectable.isInCollection).toBeFalsy();
    });

    it('should always have the correct reference', function () {
      var modelA = new mwUI.Backbone.Model({id: 1});
      var modelB = new mwUI.Backbone.Model({id: 1});
      var mainCollection = new mwUI.Backbone.Collection();

      mainCollection.add(modelA);
      modelA.selectable.select();
      mainCollection.reset();
      mainCollection.add(modelB);
      expect(modelB.selectable.isSelected()).toBeTruthy();
      mainCollection.selectable.unSelectAll();
      expect(modelB.selectable.isSelected()).toBeFalsy();
    });

    it('should select all models which are in the preselected collection, add them to collection when addPreSelectedToCollection is set to true and set attribute in model selectable isInCollection to true', function () {
      var preselect = new mwUI.Backbone.Collection([new TestModel({id: 1})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {
            preSelected: preselect,
            addPreSelectedToCollection: true
          };
        }
      });
      var mainCollection = new MainCollection(new TestModel({id: 1}));

      preselect.add(new TestModel({id: 2}));
      expect(mainCollection.selectable.getSelected().length).toBe(2);
      expect(mainCollection.get(2)).toBeDefined();
      mainCollection.selectable.getSelected().each(function (model) {
        expect(model.selectable.isInCollection).toBeTruthy();
        expect(model.selectable.isSelected()).toBeTruthy();
      });
    });

    it('should not remove models which have been added by the preselected collection from the main collection when they are unselected', function () {
      var preselect = new mwUI.Backbone.Collection([new TestModel({id: 1}), new TestModel({id: 2})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {
            preSelected: preselect,
            addPreSelectedToCollection: true
          };
        }
      });
      var mainCollection = new MainCollection();
      mainCollection.add(new TestModel({id: 1}));
      expect(mainCollection.selectable.getSelected().length).toBe(2);
      mainCollection.get(1).selectable.unSelect();
      expect(mainCollection.length).toBe(2);
      expect(mainCollection.selectable.getSelected().length).toBe(1);
    });

    it('should reset all models to the preselected collection', function () {
      var preselect = new mwUI.Backbone.Collection([new TestModel({id: 1}), new TestModel({id: 2})]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function(){
          return {
            preSelected: preselect
          };
        }
      });
      var mainCollection = new MainCollection();
      mainCollection.add([
        new TestModel({id: 1}),
        new TestModel({id: 2}),
        new TestModel({id: 3}),
        new TestModel({id: 4})
      ]);

      expect(mainCollection.selectable.getSelected().length).toBe(2);
      mainCollection.selectable.selectAll();
      expect(mainCollection.selectable.getSelected().length).toBe(4);

      mainCollection.selectable.reset();
      expect(mainCollection.selectable.getSelected().length).toBe(2);
    });
  });

  describe('testing that selectable of model is working', function () {
    it('should set the selectable options of the model correctly', function () {
      var preselectModel = new TestModel({id: 1});
      var preselect = new mwUI.Backbone.Collection([preselectModel]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {
            preSelected: preselect,
            addPreSelectedToCollection: false
          };
        }
      });
      var addModel = new TestModel({id: 1});
      var mainCollection = new MainCollection();

      expect(mainCollection.selectable.getSelected().length).toBe(1);
      expect(preselectModel.selectable.isSelected()).toBeTruthy();
      expect(preselectModel.selectable.isInCollection).toBeFalsy();
      expect(addModel.selectable.isInCollection).toBeFalsy();
      expect(mainCollection.selectable.getSelected().first().selectable.isSelected()).toBeTruthy();

      mainCollection.add(addModel);

      expect(mainCollection.selectable.getSelected().length).toBe(1);
      expect(preselectModel.selectable.isSelected()).toBeTruthy();
      expect(addModel.selectable.isSelected()).toBeTruthy();
      expect(preselectModel.selectable.isInCollection).toBeTruthy();
      expect(addModel.selectable.isInCollection).toBeTruthy();
      expect(mainCollection.selectable.getSelected().first().selectable.isSelected()).toBeTruthy();

    });

    it('should trigger event on model selectable when model is selected', function () {
      var preselectModel = new TestModel({id: 1});
      var preselect = new mwUI.Backbone.Collection([preselectModel]);
      var MainCollection = mwUI.Backbone.Collection.extend({
        selectableOptions: function () {
          return {
            preSelected: preselect,
            addPreSelectedToCollection: false
          };
        }
      });
      var onSelect = jasmine.createSpy();
      var onUnSelect = jasmine.createSpy();
      var addModel = new TestModel({id: 1});
      var mainCollection = new MainCollection();

      addModel.selectable.on('change:select', onSelect);
      addModel.selectable.on('change:unselect', onUnSelect);
      preselectModel.selectable.on('change:select', onSelect);
      preselectModel.selectable.on('change:unselect', onUnSelect);

      mainCollection.selectable.select(addModel);
      expect(onSelect).toHaveBeenCalled();
      mainCollection.selectable.unSelect(addModel);
      expect(onUnSelect).toHaveBeenCalled();

      onSelect.calls.reset();
      mainCollection.selectable.select(addModel, {silent: true});
      expect(onSelect).not.toHaveBeenCalled();

      onSelect.calls.reset();
      onUnSelect.calls.reset();
      mainCollection.selectable.unSelect(preselectModel);
      expect(onUnSelect).toHaveBeenCalled();
      mainCollection.selectable.select(preselectModel);
      expect(onSelect).toHaveBeenCalled();
    });

    it('should set isSelected of model to false when calling unselectAll', function () {
      collection.selectable.select(collection.at(0));
      collection.selectable.select(collection.at(1));
      collection.selectable.select(collection.at(2));
      collection.selectable.unSelectAll();
      collection.each(function (model) {
        expect(model.selectable.isSelected()).toBeFalsy();
      });
    });
  });

  describe('testing exception handling', function () {
    it('should throw an error if the collection parameter is not a collection', function () {
      var testFn = function () {
        new mwUI.Backbone.Selectable.Collection({}, {});
      };
      expect(testFn).toThrow();
    });

    it('should throw an error if the selected option is not a collection or model', function () {
      var testFn = function () {
        new mwUI.Backbone.Selectable.Collection(collection, {preSelected: {}});
      };
      expect(testFn).toThrow();
    });

    /* Special Cases */
    it('should throw an error when something is passed to be selected what is not a model', function () {
      var testFn = function () {
        collection.selectable.select({id: 1});
      };
      expect(testFn).toThrow();
    });

    it('should not select (ignore) when a model is passed to be selected which has no selectable', function () {
      var ModelWithoutSelectable = mwUI.Backbone.Model.extend({
        selectable: false
      });
      var modelWithoutSelectable = new ModelWithoutSelectable({id: 1});
      var CustomCollection = mwUI.Backbone.Collection.extend({
        model: ModelWithoutSelectable
      });

      var customCollection = new CustomCollection();
      customCollection.add(modelWithoutSelectable);
      customCollection.selectable.select(customCollection.at(0));
      expect(customCollection.selectable.getSelected().length).toBe(0);
      customCollection.selectable.selectAll();
      expect(customCollection.selectable.getSelected().length).toBe(0);
    });
  });

  describe('event registration', function(){
    it('adds a change:select listener on every model.selectable in the selectable collection', function(){
      expect(collection.first().selectable._events['change:select']).not.toBeUndefined();
      expect(collection.first().selectable._events['change:select'].length).toBe(1);
    });

    it('does not add a new change:select listener on a model.selectable when model is selected', function(){
      collection.first().selectable.select();

      expect(collection.first().selectable._events['change:select'].length).toBe(1);
    });

    it('adds a change:unselect listener on every model.selectable in the selectable collection', function(){
      expect(collection.first().selectable._events['change:unselect']).not.toBeUndefined();
      expect(collection.first().selectable._events['change:unselect'].length).toBe(1);
    });

    it('does not add a new change:unselect listener on a model.selectable when model is selected', function(){
      collection.first().selectable.select();

      collection.first().selectable.unSelect();

      expect(collection.first().selectable._events['change:unselect'].length).toBe(1);
    });

    it('adds a change listener on every model in the selectable collection when model is selected', function(){
      collection.first().selectable.select();

      expect(collection.first()._events.change).not.toBeUndefined();
      expect(collection.first()._events.change.length).toBe(1);
    });

    it('does not add a new change listener on a model when model is selected again', function(){
      collection.first().selectable.select();
      collection.first().unset('id');

      collection.first().selectable.select();

      expect(collection.first()._events.change.length).toBe(1);
    });
  });
});