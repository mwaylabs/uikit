mwUI.Backbone.Filter = function () {
  // If it is an invalid value return null otherwise the provided object
  var returnNullOrObjectFor = function (value, object) {
    return (_.isUndefined(value) || value === null || value === '' || value.length===0 || (_.isArray(value) && _.compact(value).length===0)) ? null : object;
  };

  var returnNullOrObjectForMultipleValues = function (values, object) {
    var hasValue = false;
    if(!_.isObject(values)){
      console.log(values);
      throw new Error('The argument values has to be an object');
    }
    for(var key in values){
      if(returnNullOrObjectFor(values[key], true)){
        hasValue = true;
      } else {
        delete object[key];
      }
    }
    return hasValue ? object : null;
  };

  return {
    containsString: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'containsString',
        fieldName: fieldName,
        contains: value
      });
    },

    string: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'string',
        fieldName: fieldName,
        value: value
      });
    },

    and: function (filters) {
      return this.logOp(filters, 'AND');
    },

    nand: function (filters) {
      return this.logOp(filters, 'NAND');
    },

    or: function (filters) {
      return this.logOp(filters, 'OR');
    },

    logOp: function (filters, operator) {
      filters = _.without(filters, null); // Removing null values from existing filters

      return filters.length === 0 ? null : { // Ignore logOps with empty filters
        type: 'logOp',
        operation: operator,
        filters: filters
      };
    },

    boolean: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'boolean',
        fieldName: fieldName,
        value: value
      });
    },

    stringMap: function (fieldName, key, value) {
      if(value === '%%'){
        value = '';
      }
      return returnNullOrObjectFor(value, {
        type: 'stringMap',
        fieldName: fieldName,
        value: value,
        key: key
      });
    },

    stringEnum: function (fieldName, values) {
      return returnNullOrObjectFor(values, {
        type: 'stringEnum',
        fieldName: fieldName,
        values: _.flatten(values)
      });
    },

    long: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'long',
        fieldName: fieldName,
        value: value
      });
    },

    like: function (fieldName, value) {
      return returnNullOrObjectFor(value, {
        type: 'like',
        fieldName: fieldName,
        like: value
      });
    },

    notNull: function (fieldName) {
      return returnNullOrObjectFor(true, {
        type: 'null',
        fieldName: fieldName
      });
    },

    dateRange: function(fieldName, min, max){
      min = min ? +new Date(min) : null;
      max = max ? +new Date(max) : null;
      return returnNullOrObjectForMultipleValues({min: min, max: max}, {
        type: 'dateRange',
        fieldName: fieldName,
        min: min,
        max: max
      });
    },

    longRange: function(fieldName, min, max){
      return returnNullOrObjectForMultipleValues({min: min, max: max}, {
        type: 'longRange',
        fieldName: fieldName,
        min: min,
        max: max
      });
    }
  };

};
