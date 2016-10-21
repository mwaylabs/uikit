mwUI.Backbone.Utils.getUrlWithEndpoint = function(instance){
  if(instance instanceof window.mwUI.Backbone.Model || instance instanceof window.mwUI.Backbone.Collection){
    var endpoint = _.result(instance, 'endpoint');

    if (endpoint && endpoint.length > 0) {
      return window.mwUI.Backbone.Utils.concatUrlParts(window.mwUI.Backbone.Utils.getUrl(instance),endpoint);
    } else {
      throw new Error('An endpoint has to be specified');
    }
  } else {
    throw new Error('Instance is not a Backbone model or collection');
  }
};