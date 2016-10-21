mwUI.Backbone.Utils.concatUrlParts = function () {
  var urlParts = _.toArray(arguments),
    trimmedUrlParts = [];

  _.forEach(urlParts, function (url, index) {
    if (!_.isString(url) || url === '') {
      return;
    } else if (index !== 0 || url === '/') {
      //Removes slash at the beginning of the string except when it is only a slash or first word
      url = url.replace(/^\//, '');
    }

    // Removes last slash
    url = url.replace(/\/$/, '');

    trimmedUrlParts.push(url);
  });

  return trimmedUrlParts.join('/');
};