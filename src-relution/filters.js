'use strict';

angular.module('mwFilters', [])

.filter('humanize', function () {
  return function (input) {
    return input ? 'common.yes' : 'common.no';
  };
})

.filter('neverIfZero', function (i18n) {
  var filterFn =  function (input) {
    return input === 0 ? i18n.get('common.never') : input;
  };
  filterFn.$stateful = true;
  return filterFn;
})

.filter('dashIfBlank', function () {
  return function (input) {
    return input ? input : '-';
  };
})

.filter('starIfBlank', function () {
  return function (input) {
    return input ? input : '*';
  };
})

.filter('join', function () {
  return function (input, opts) {

    if(!angular.isArray(input)){
      return input;
    }
    if(opts.lastSeparator){
      var els = _.clone(input),
      lastEl = els.pop();
      return els.join(opts.separator)+' '+opts.lastSeparator+' '+lastEl;
    } else {
      return input.join(opts.separator);
    }

  };
})

.filter('zeroIfEmpty', function () {
  return function (input) {
    return input ? input : 0;
  };
})

.filter('readableFilesize', function () {
  return function (fileSizeInBytes, startUnit) {
    if (fileSizeInBytes === 0) {
      return '0.0 kB';
    }
    var i = -1,
    byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if(startUnit !== undefined) {
      i = byteUnits.indexOf(startUnit);
    }
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + byteUnits[i];
  };
});
