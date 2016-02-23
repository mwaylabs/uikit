/**
 * Created by zarges on 17/02/16.
 */
window.mwUI.Utils.shims.routeToRegExp = function(route){
  var  optionalParam = /\((.*?)\)/g,
    namedParam = /(\(\?)?:\w+/g,
    splatParam = /\*\w?/g,
    escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  route = route.replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function (match, optional) {
      return optional ? match : '([^/?]+)';
    })
    .replace(splatParam, '([^?]*?)');
  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
};