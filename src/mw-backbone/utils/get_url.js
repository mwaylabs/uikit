mwUI.Backbone.Utils.getUrl = function(instance){
  var hostName, basePath, endpoint;

  if(instance instanceof mwUI.Backbone.Model || instance instanceof mwUI.Backbone.Collection){
    hostName = _.result(instance, 'hostName') || '';
    basePath = _.result(instance, 'basePath') || '';
    endpoint = _.result(instance, 'endpoint');
  } else {
    throw new Error('An instance of a collection or a model has to be passed as argument to the function');
  }

  if (!endpoint || endpoint.length === 0) {
    throw new Error('An endpoint has to be specified');
  }

  return window.mwUI.Backbone.Utils.concatUrlParts(hostName, basePath, endpoint);
};