mwUI.Backbone.Utils.concatUrlParts = function () {
  var urlParts = _.toArray(arguments), cleanedUrlParts = [];

  //remove empty strings
  urlParts = _.compact(urlParts);

  _.forEach(urlParts, function (url, index) {
    if (index === 0) {
      //remove only trailing slash
      url = url.replace(/\/$/g, '');
    } else {
      //Removing leading and trailing slash
      url = url.replace(/^\/|\/$/g, '');
    }
    cleanedUrlParts.push(url);
  });

  return cleanedUrlParts.join('/');
};