mwUI.Backbone.Utils.request = function (url, method, options, instance) {
  options = options || {};
  var requestOptions = {
    url: url,
    type: method
  }, hostName;

  if (instance) {
    requestOptions.instance = instance;
  }

  if (url && !url.match(/\/\//)) {
    if (instance instanceof mwUI.Backbone.Model || instance instanceof mwUI.Backbone.Collection) {
      hostName = _.result(instance, 'hostName');
    } else {
      hostName = mwUI.Backbone.hostName || '';
    }
    requestOptions.url = mwUI.Backbone.Utils.concatUrlParts(hostName, url);
  }

  return Backbone.ajax(_.extend(requestOptions, options));
};