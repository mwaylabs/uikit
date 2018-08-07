angular.module('mwUI.Utils')
  .filter('mwReadableFileSize', function () {
    return function (fileSizeInBytes, startUnit, integer) {
      if (!fileSizeInBytes || !angular.isNumber(fileSizeInBytes) || fileSizeInBytes === 0) {
        return '0.0 kB';
      }
      var i = -1,
        byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        fileSize;

      if (startUnit !== undefined) {
        i = byteUnits.indexOf(startUnit);
      }
      do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
      } while (fileSizeInBytes > 1024);

      fileSize = Math.max(fileSizeInBytes, 0.1);
      if (integer) {
        return fileSize.toFixed(0) + ' ' + byteUnits[i];
      } else {
        return fileSize.toFixed(1) + ' ' + byteUnits[i];
      }
    };
  });