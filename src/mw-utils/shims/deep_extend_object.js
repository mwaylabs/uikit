var deepExtendObject = function (target, source) {
  for (var key in source) {
    if (key in target && _.isObject(target[key]) && _.isObject(source[key])) {
      deepExtendObject(target[key], source[key]);
    } else if (_.isObject(target[key]) && !_.isObject(source[key])) {
      throw new Error('Target[' + key + '] is an object but source[' + key + '] is from type '+typeof source[key]+'! You can not overwrite an object with type '+typeof source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

window.mwUI.Utils.shims.deepExtendObject = deepExtendObject;