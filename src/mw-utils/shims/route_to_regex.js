/**
 * Created by zarges on 17/02/16.
 */
window.mwUI.Utils.shims.routeToRegExp = function(route){
  var  optionalParam = /\((.*?)\)/g,
    namedParam = /(\(\?)?:\w+/g,
    splatParam = /\*\w?/g,
    escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  if(!_.isString(route)){
    throw new Error('The route ' + JSON.stringify(route) + 'has to be a URL');
  }

  route = route.replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function (match, optional) {
      return optional ? match : '([^/?]+)';
    })
    .replace(splatParam, '([^?]*?)');
  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
};