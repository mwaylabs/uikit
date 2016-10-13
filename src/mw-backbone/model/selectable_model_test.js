describe('Model Selectable', function () {

  it('should be initialized as unselected', function () {
    var model = new mwUI.Backbone.Model ();
    expect(model.selectable.isSelected()).toBe(false);
  });

  it('should be initialized as selected when selected option was set', function() {
    var SelectedModel = mwUI.Backbone.Model .extend({
      selectableOptions: function(){
        return {
          selected: true
        };
      }
    });
    var model = new SelectedModel();
    expect(model.selectable.isSelected()).toBe(true);
  });

  it('should return true when a isDisabled function is defined', function(){
    var SelectedModel = mwUI.Backbone.Model .extend({
      selectableOptions: function(){
        return {
          isDisabled: function(){
            return true;
          }
        };
      }
    });
    var model = new SelectedModel();
    expect(model.selectable.hasDisabledFn).toBeTruthy();
  });

  it('should return false when no isDisabled function is defined', function(){
    var model = new mwUI.Backbone.Model ();
    expect(model.selectable.hasDisabledFn).toBeFalsy();
  });

  it('should be selectable and unselectable', function(){
    var model = new mwUI.Backbone.Model ();
    model.selectable.select();
    expect(model.selectable.isSelected()).toBe(true);
    model.selectable.unSelect();
    expect(model.selectable.isSelected()).toBe(false);
  });

  it('should be able to toggle its selected state', function(){
    var model = new mwUI.Backbone.Model ();
    model.selectable.toggleSelect();
    expect(model.selectable.isSelected()).toBe(true);
    model.selectable.toggleSelect();
    expect(model.selectable.isSelected()).toBe(false);
  });

  it('should accept a isDisabled function', function(){
    var isDisabledFn = jasmine.createSpy('isDisabledFn');
    var DisabledModel = mwUI.Backbone.Model .extend({
      selectableOptions: function(){
        return {
          isDisabled: isDisabledFn
        };
      }
    });
    var model = new DisabledModel();

    isDisabledFn.and.returnValue(false);
    model.selectable.select();
    expect(isDisabledFn).toHaveBeenCalled();
    expect(model.selectable.isSelected()).toBe(true);

    model.selectable.unSelect();
    isDisabledFn.and.returnValue(true);
    model.selectable.select();
    expect(isDisabledFn).toHaveBeenCalledWith();
    expect(model.selectable.isSelected()).toBe(false);
  });

  it('should throw an error if provided model is not a Backbone model instance', function(){
    var createModel = function(){
      new mwUI.Backbone.Selectable.Model({}, {});
    };
    expect(createModel).toThrow();
  });

  it('should fire the correct change events', function(){
    var changeHandler = jasmine.createSpy('changeHandler');
    var changeSelectHandler = jasmine.createSpy('changeSelectHandler');
    var changeUnselectHandler = jasmine.createSpy('changeUnselectHandler');

    var model = new mwUI.Backbone.Model ();
    model.selectable.on('change', changeHandler);
    model.selectable.on('change:select', changeSelectHandler);
    model.selectable.on('change:unselect', changeUnselectHandler);

    model.selectable.select();
    expect(changeHandler.calls.count()).toBe(1);
    expect(changeSelectHandler.calls.count()).toBe(1);

    model.selectable.unSelect();
    expect(changeHandler.calls.count()).toBe(2);
    expect(changeUnselectHandler.calls.count()).toBe(1);
  });

});