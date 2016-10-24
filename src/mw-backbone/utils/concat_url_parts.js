mwUI.Backbone.Utils.concatUrlParts = function () {
  var urlParts = _.toArray(arguments),
    trimmedUrlParts = [];

  _.forEach(urlParts, function (url, index) {
    if (!_.isString(url) || url === '') {
      return;
    } else if (index !== 0 || url === '/') {
      //Removes slash at the beginning of the string except when it is the first argument or it is only a slash
      url = url.replace(/^\//, '');
    }

    // Removes trailing slash
    url = url.replace(/\/$/, '');

    trimmedUrlParts.push(url);
  });

  return trimmedUrlParts.join('/');
};