angular.module('mwFileUpload')

  .directive('mwFileUploadButton', function ($q, $timeout, mwMimetype) {
    return {
      restrict: 'A',
      scope: {
        uploaderOptions: '=?',
        maxFileSizeByte: '=?',
        dropZoneElement: '=?',
        onBeforeUploadCallback: '=?',
        onProgressCallback: '=?',
        onSuccessCallback: '=?',
        onErrorCallback: '=?',
        onAbortCallback: '=?',
        abortFlag: '=?',
        accepts: '@?',
      },
      transclude: true,
      templateUrl: 'uikit/templates/mwFileUpload/mwFileUploadButton.html',
      link: function (scope, elm) {

        var hiddenfileEl = elm.find('input[type=file]'),
          userHasCanceled = false,
          uploadXhr;

        scope.mimeTypeGroup = mwMimetype.getMimeTypeGroup(scope.accepts);

        scope.file = null;

        if (!scope.mimeTypeGroup) {
          scope.inputValidator = '*/*';
        } else {
          scope.inputValidator = scope.accepts;
        }

        var error = function (xhr, type, result) {
          if (typeof scope.onErrorCallback === 'function') {
            $timeout(scope.onErrorCallback.bind(this, {type: type, xhr: xhr, result: result}));
          }
        };

        var getFileFromResponse = function (response) {
          if (response && response.results && _.isArray(response.results) && response.results.length > 0) {
            response = response.results[0];
          }
          return response;
        };

        var success = function (xhr, result) {
          if (typeof scope.onSuccessCallback === 'function') {
            $timeout(scope.onSuccessCallback.bind(this, {
              xhr: xhr,
              file: getFileFromResponse(result),
              response: result
            }));
          }
        };

        var abort = function () {
          if (typeof scope.onAbortCallback === 'function') {
            $timeout(scope.onAbortCallback.bind(this));
          }
        };

        var stateChange = function (data) {
          if (data && typeof scope.onProgressCallback === 'function') {
            var dataLoaded = data.loaded;
            var dataTotal = data.total;
            var progress = parseInt(dataLoaded / dataTotal * 100, 10);
            $timeout(scope.onProgressCallback.bind(this, {
                data: data,
                progress: progress,
                total: dataTotal,
                loaded: dataLoaded
              }
            ));
          }
        };

        var validateFileSize = function (files) {
          var isValid = true;
          if (scope.maxFileSizeByte) {
            // check each file if it is too large to upload.
            angular.forEach(files, function (file) {
              if (file.size > scope.maxFileSizeByte) {
                isValid = false;
              }
            });
          }
          return isValid;
        };

        scope.abort = function () {
          if (uploadXhr) {
            userHasCanceled = true;
            uploadXhr.abort();
          }
        };

        hiddenfileEl.fileupload({
          url: scope.url,
          dataType: 'json',
          formData: scope.formData,
          autoUpload: false
        });

        hiddenfileEl.bind('fileuploadadd', function (e, data) {
          if (!data || !angular.isArray(data.files) || data.files.length === 0) {
            return;
          }
          scope.file = data.files;
          userHasCanceled = false;

          if (typeof scope.onBeforeUploadCallback === 'function') {
            var result = scope.onBeforeUploadCallback(data.files);
            if (result === false) {
              error(this, 'CUSTOM_VALIDATION_FAILED', {
                files: data.files,
                response: null
              });
              scope.file = null;
              return;
            }
          }

          if (!validateFileSize(data.files)) {
            error(this, 'FILE_TOO_BIG', {
              files: data.files,
              response: null
            });
            scope.file = null;
            return;
          }

          uploadXhr = data.submit();
        });

        hiddenfileEl.bind('fileuploadstart', function () {
          scope.abortFlag = false;
        });

        hiddenfileEl.bind('fileuploadprogress', function (e, data) {
          stateChange(data);
        });

        hiddenfileEl.bind('fileuploaddone', function (e, data) {
          success(data, data.result);
        });

        hiddenfileEl.bind('fileuploadfail', function (e, data) {
          if (!userHasCanceled) {
            scope.uploadError = data.statusText;
            error(this, 'SERVER', {
              files: null,
              response: data.responseJSON
            });
          } else {
            abort();
          }
        });

        scope.triggerUploadDialog = function () {
          /*Unbind listener to prevent loop, prevent bubbling of event does not work */
          elm.off('click', scope.triggerUploadDialog);
          /*Make sure to use selector to have correct reference because the blueimpfileuplaoder changes reference*/
          elm.find('input[type=file]').click();
          elm.on('click', scope.triggerUploadDialog);
        };

        /*
          {
            url: ''
            formData: {}
          }
        */
        scope.$watch('uploaderOptions', function (val) {
          if (val) {
            hiddenfileEl.fileupload('option', val);
          }
        }, true);

        scope.$watch('abortFlag', function (abortFlag) {
          if (abortFlag) {
            scope.abort();
          }
        });

        scope.$watch('dropZoneElement', function (val) {
          if (val) {
            hiddenfileEl.fileupload('option', {
              dropZone: val
            });
          }
        });

        elm.on('click', scope.triggerUploadDialog);

        scope.$on('$destroy', function () {
          elm.off('click', scope.triggerUploadDialog);
          /*Make sure to use selector to have correct reference because the blueimpfileuplaoder changes reference*/
          elm.find('input[type=file]').fileupload('destroy');
        });
      }
    };
  });