/**
 * Created by zarges on 17/02/16.
 */
window.mwUI.Utils.shims.concatUrlParts = function(){
  var concatUrl = '';
  _.forEach(arguments,function(url){
    url = url.replace(/^\//,'');
    url = url.replace(/\/$/,'');
    concatUrl += ( url +('/') );
  });
  return concatUrl;
};