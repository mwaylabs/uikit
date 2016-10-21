mwUI.Backbone.Utils.request = function (url, method, options, instance) {
  options = options || {};
  var requestOptions = {
    url: url,
    type: method
  };

  if (instance) {
    requestOptions.instance = instance;
  }

  if (url && !url.match(/\/\//)) {
    requestOptions.url = mwUI.Backbone.Utils.concatUrlParts(mwUI.Backbone.Utils.getUrl(instance), url);
  }

  return Backbone.ajax(_.extend(requestOptions, options));
};