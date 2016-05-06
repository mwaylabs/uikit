angular.module('mwUI.Utils')

  .service('callbackHandler', function($injector){
    return {
      execFn: function(cb, params, scope){
        if(params && angular.isArray(params)){
          return cb.apply(scope, params);
        } else {
          return cb.call(scope, params);
        }
      },
      getFn: function(cb){
        if(angular.isString(cb)){
          return $injector.get(cb);
        } else if(angular.isFunction(cb)){
          return cb;
        } else {
          throw new Error('First argument has to be either a valid service or function');
        }
      },
      exec: function(cb, params, scope){
        this.execFn(this.getFn(cb), params, scope);
      }
    };
  });