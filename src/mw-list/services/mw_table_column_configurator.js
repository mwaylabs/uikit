'use strict';

angular.module('mwUI.List')

  .service('TableConfigurator', function () {
    var instances = new window.mwUI.List.MwTableConfigurators();

    return {
      getInstanceForTableId: function(id){
        if(instances.get(id)){
          return instances.get(id);
        } else {
          var configuratorInstance = new window.mwUI.List.MwTableConfigurator({id: id});
          instances.add(configuratorInstance);
          return configuratorInstance;
        }
      }
    };
  });
