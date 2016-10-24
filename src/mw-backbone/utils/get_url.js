mwUI.Backbone.Utils.getUrl = function(instance){
  var hostName, basePath;

  if(instance instanceof window.mwUI.Backbone.Model || instance instanceof window.mwUI.Backbone.Collection){
    hostName = _.result(instance, 'hostName');
    basePath = _.result(instance, 'basePath');
  } else {
    hostName = _.result(window.mwUI.Backbone, 'hostName');
    basePath = _.result(window.mwUI.Backbone, 'basePath');
  }

  hostName = hostName || '';
  basePath = basePath || '';

  return window.mwUI.Backbone.Utils.concatUrlParts(hostName, basePath);
};