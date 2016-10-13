angular.module('mwUI.Utils')

  .filter('reduceStringTo', function () {
    return function (input, count) {
      if(count && input && input.length > count) {
        return input.substr(0, count) + '...';
      }
      return input;
    };
  });