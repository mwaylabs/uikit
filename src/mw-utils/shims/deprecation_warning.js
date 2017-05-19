var shownDeprecationWarnings = [];

var deprecationWarning = function(message){
  if(shownDeprecationWarnings.indexOf(message) === -1){
    console.warn(message);
    shownDeprecationWarnings.push(message);
  }
};

window.mwUI.Utils.shims.deprecationWarning = deprecationWarning;