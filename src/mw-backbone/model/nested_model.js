mwUI.Backbone.NestedModel = Backbone.NestedModel = Backbone.Model.extend({

  nested: function () {
    return {};
  },

  _prepare: function () {
    var nestedAttributes = this.nested(),
      instanceObject = {};
    for (var key in nestedAttributes) {
      if (typeof nestedAttributes[key] === 'function') {
        var instance = new nestedAttributes[key]();

        instance.parent = this;
        instanceObject[key] = instance;
      } else {
        throw new Error('Nested attribute ' + key + ' is not a valid constructor. Do not set an instance as nested attribute.');
      }
    }

    return instanceObject;
  },

  _setNestedModel: function (key, value) {
    if (_.isObject(value)) {
      this.get(key).set(value);
    } else {
      var id = this.get(key).idAttribute;
      this.get(key).set(id, value);
    }
  },

  _setNestedCollection: function (key, value) {
    if (_.isObject(value) && !_.isArray(value)) {
      this.get(key).add(value);
    } else if (_.isArray(value)) {
      value.forEach(function (val) {
        this._setNestedCollection(key, val);
      }.bind(this));
    } else {
      var id = this.get(key).model.prototype.idAttribute,
        obj = {};

      obj[id] = value;
      this.get(key).add(obj);
    }
  },

  _setNestedAttributes: function (obj) {

    for (var key in obj) {
      var nestedAttrs = this.nested(),
        value = obj[key],
        nestedValue = nestedAttrs[key];

      if (nestedValue && !(value instanceof nestedValue) && this.get(key)) {

        if (this.get(key) instanceof Backbone.Model) {
          this._setNestedModel(key, value);
        } else if (this.get(key) instanceof Backbone.Collection) {
          this._setNestedCollection(key, value);
        }

        delete obj[key];
      }
    }

    return obj;
  },

  _nestedModelToJson: function (model) {
    var result;

    if (model instanceof Backbone.NestedModel) {
      result = model._prepareDataForServer();
    } else {
      result = model.toJSON();
    }

    return result;
  },

  _prepareDataForServer: function () {
    var attrs = _.extend({}, this.attributes),
      nestedAttrs = this.nested();

    for (var key in nestedAttrs) {
      var nestedAttr = this.get(key);

      if (nestedAttr instanceof Backbone.Model) {
        attrs[key] = this._nestedModelToJson(nestedAttr);
      } else if (nestedAttr instanceof Backbone.Collection) {
        var result = [];

        nestedAttr.each(function (model) {
          result.push(this._nestedModelToJson(model));
        }.bind(this));

        attrs[key] = result;
      }
    }

    return this.compose(attrs);
  },

  constructor: function (attributes, options) {
    options = options || {};
    if (options.parse) {
      attributes = this.parse(attributes);
      options.parse = false;
    }
    this.attributes = this._prepare();
    this.set(attributes);
    attributes = this.attributes;
    return Backbone.Model.prototype.constructor.call(this, attributes, options);
  },

  set: function (attributes, options) {
    var obj = {};

    if (_.isString(attributes)) {
      obj[attributes] = options;
    } else if (_.isObject(attributes)) {
      obj = attributes;
    }

    if(!_.isObject(options)){
      options = null;
    }

    obj = this._setNestedAttributes(obj);

    return Backbone.Model.prototype.set.call(this, obj, options);
  },

  compose: function (attrs) {
    return attrs;
  },

  toJSON: function (options) {
    // When options are set toJSON is called from the sync method so it is called before the object is send to the server
    // We use this to transform our data before we are sending it to the server
    // It is the counterpart of parse for the server
    if (options) {
      return this._prepareDataForServer();
    } else {
      return Backbone.Model.prototype.toJSON.apply(this, arguments);
    }
  },

  clear: function () {
    var superClear = Backbone.Model.prototype.clear.apply(this, arguments);
    this.attributes = this._prepare();
    return superClear;
  }
});

