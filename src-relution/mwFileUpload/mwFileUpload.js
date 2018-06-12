angular.module('mwFileUpload', [])

  .provider('mwFileUpload', function () {
    var _defaultConfig = {};

    this.setGlobalConfig = function (conf) {
      _.extend(_defaultConfig, conf);
    };

    this.$get = function () {
      return {
        getGlobalConfig: function () {
          return _defaultConfig;
        }
      };
    };

  })

  .directive('mwFileUpload', function ($q, $timeout, mwFileUpload, ResponseHandler, mwMimetype, i18n) {
    return {
      restrict: 'A',
      scope: {
        url: '@',
        name: '@',
        model: '=?',
        attribute: '@',
        labelAttribute: '@',
        showFileName: '=',
        mwRequired: '=',
        validator: '@',
        text: '@',
        formData: '=',
        successCallback: '&',
        errorCallback: '&',
        stateChangeCallback: '&',
        fullScreen: '=',
        hiddenBtn: '=',
        hasDropZone: '=?',
        hideCancelBtn: '=?',
        abortFlag: '=?',
        maxFileSizeByte: '=?',
        showUploadBtnAlways: '=?',
        hideRemoveBtn: '=?'
      },
      require: '?^form',
      templateUrl: 'uikit/templates/mwFileUpload/mwFileUpload.html',
      link: function (scope, elm, attrs, formController) {

        var timeout,
          fileUploaderEl = elm.find('.mw-file-upload'),
          hiddenfileEl = elm.find('input[type=file]'),
          userHasCanceledUpload = false,
          uploadXhr;

        scope._showFileName = angular.isDefined(scope.showFileName) ? scope.showFileName : true;

        scope.uploadState = 'none';

        scope.isInvalid = false;

        scope.uploadError = false;

        scope.selectedFile = null;

        scope.uploadMessage = '';

        scope.mimeTypeGroup = mwMimetype.getMimeTypeGroup(attrs.validator);

        if (!scope.mimeTypeGroup) {
          scope.inputValidator = '*/*';
        } else {
          scope.inputValidator = attrs.validator;
        }

        var handle = function (response, isError) {
          var ngResponse = {
            config: {
              method: response.type,
              url: response.url
            },
            data: response.result,
            headers: response.headers,
            status: response.xhr().status,
            statusText: response.xhr().statusText
          };
          var handler = ResponseHandler.handle(ngResponse, isError);
          if (handler) {
            return handler;
          } else if (isError) {
            return $q.reject(ngResponse);
          } else {
            return $q.when(ngResponse);
          }
        };

        var error = function (data, result) {
          handle(data, true).catch(function () {
            $timeout(scope.errorCallback.bind(this, {result: result}));
          });
        };

        var getResult = function (msg) {
          if (msg && msg.results && _.isArray(msg.results) && msg.results.length > 0) {
            msg = msg.results[0];
          }
          return msg;
        };

        var success = function (data, result) {
          var parsedResult = getResult(result);
          if (scope.model instanceof Backbone.Model) {
            scope.model.set(scope.model.parse(parsedResult));
          } else if (scope.attribute) {
            scope.model = parsedResult[scope.attribute];
          } else {
            scope.model = parsedResult;
          }

          if (formController) {
            formController.$setDirty();
          }

          handle(data, false).then(function () {
            $timeout(scope.successCallback.bind(this, {result: parsedResult}));
          });

          if (attrs.validator && !mwMimetype.checkMimeType(parsedResult.contentType, attrs.validator)) {
            if (data.result && data.result.message) {
              scope.uploadError = i18n.get('rlnUikit.mwFileUpload.invalidMimeType', {mimeType: attrs.validator});
              scope.isInvalid = true;
            }
          }
        };

        var stateChange = function (data) {
          scope.dataLoaded = data.loaded;
          scope.dataTotal = data.total;
          scope.uploadProgress = parseInt(scope.dataLoaded / scope.dataTotal * 100, 10);
          scope.stateChangeCallback({data: data, progress: scope.uploadProgress});
        };

        var documentDragOver = function () {
          if (!timeout) {
            $timeout(function () {
              scope.isInDragState = true;
            });
          }
          else {
            clearTimeout(timeout);
          }

          timeout = setTimeout(function () {
            timeout = null;
            $timeout(function () {
              scope.isInDragState = false;
            });
          }, 100);
        };

        var documentDrop = function (ev) {
          ev.preventDefault();
        };

        var elDragOver = function () {
          $timeout(function () {
            scope.isInDragOverState = true;
          });
        };

        var elDragLeave = function () {
          $timeout(function () {
            scope.isInDragOverState = false;
          });
        };

        var initDragAndDrop = function () {
          /*
         * This implementation was found on https://github.com/blueimp/jQuery-File-Upload/wiki/Drop-zone-effects
         * The tricky part is the dragleave stuff when the user decides not to drop the file
         * You can not just use the dragleave event. This implemtation did solve the problem
         * It was a bit modified
         */
          angular.element(document).on('dragover', documentDragOver);
          fileUploaderEl.on('dragover', elDragOver);
          fileUploaderEl.on('dragleave', elDragLeave);
          angular.element(document).on('drop dragover', documentDrop);
        };

        var deInitDragAndDrop = function () {
          angular.element(document).off('dragover', documentDragOver);
          fileUploaderEl.off('dragover', elDragOver);
          fileUploaderEl.off('dragleave', elDragLeave);
          angular.element(document).off('drop dragover', documentDrop);
        };

        function readableFileSize(bytes) {
          if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
          var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
          return (bytes / Math.pow(1024, Math.floor(number))).toFixed(2) +  ' ' + units[number];
        }

        scope.triggerUploadDialog = function () {
          elm.find('input').click();
        };

        scope.fileIsSet = function () {
          if (scope.model instanceof window.mCAP.Model) {
            return !scope.model.isNew();
          } else {
            return !!scope.model;
          }
        };

        scope.getFileName = function () {
          if (scope.fileIsSet) {
            var labelAttr = scope.labelAttribute || 'name';
            if (scope.model instanceof window.mCAP.Model) {
              return scope.model.get(labelAttr);
            } else {
              return scope.model[labelAttr];
            }
          }
        };

        scope.remove = function () {
          if (formController) {
            formController.$setDirty();
          }
          if (scope.model instanceof window.mCAP.Model) {
            scope.model.clear();
          } else {
            scope.model = null;
          }
          scope.uploadError = false;
          scope.isInvalid = false;
        };

        scope.abort = function () {
          if (uploadXhr) {
            userHasCanceledUpload = true;
            uploadXhr.abort();
          }
        };

        hiddenfileEl.fileupload({
          url: scope.url,
          dropZone: elm.find('.drop-zone'),
          dataType: 'json',
          formData: scope.formData,
          progress: function (e, data) {
            $timeout(function () {
              stateChange(data);
            });
          },
          done: function (e, data) {
            scope.isInvalid = false;
            $timeout(function () {
              scope.uploadState = 'done';
              scope.uploadProgress = 0;
              success(data, data.result);
            });
          },
          error: function (rsp) {
            $timeout(function () {
              scope.uploadState = 'done';
              scope.uploadProgress = 0;

              if (!userHasCanceledUpload) {
                scope.uploadError = rsp.statusText;
                scope.isInvalid = true;
                error(this, rsp.responseJSON);
              } else {
                scope.isInvalid = false;
              }
            }.bind(this));
          },
          add: function (e, data) {
            var hasFileSizeError = false;
            if (scope.maxFileSizeByte) {
              // check each file if it is too large to upload.
              angular.forEach(data.files, function (file) {
                if(file.size > scope.maxFileSizeByte) {
                  hasFileSizeError = true;
                  var errorMsg = i18n.get('rlnUikit.mwFileUpload.fileTooLarge', {fileName: file.name, max: readableFileSize(scope.maxFileSizeByte), actual: '(' + readableFileSize(file.size) + ')'});
                  $timeout(scope.errorCallback.bind(this, {
                    result: {
                      msg: errorMsg,
                      code: 413,
                      fileSize: file.size,
                      fileName: file.name,
                      fileType: file.type,
                      maxFileSizeByte: scope.maxFileSizeByte,
                    }
                  }));
                  scope.uploadError = errorMsg;
                  scope.isInvalid = true;
                }
              });
            }

            if (hasFileSizeError) {
              return;
            }

            userHasCanceledUpload = false;
            var fileName = data.originalFiles[0].name || '';
            scope.uploadError = false;
            scope.isInvalid = true;
            scope.uploadMessage = i18n.get('rlnUikit.mwFileUpload.uploading', {fileName: fileName});
            $timeout(function () {
              scope.uploadState = 'uploading';
            });
            scope.selectedFile = hiddenfileEl.val();
            uploadXhr = data.submit();
          }
        });

        hiddenfileEl.fileupload('option', mwFileUpload.getGlobalConfig());

        scope.$watch('model', function (val, previousVal) {
          if (val) {
            scope.selectedFile = val;
          } else {
            if (previousVal) {
              scope.selectedFile = '';
            } else {
              scope.selectedFile = null;
            }
          }
        });

        scope.$watch('url', function (val) {
          if (val) {
            hiddenfileEl.fileupload('option', {
              url: val
            });
          }
        });

        scope.$watch('formData', function (val) {
          if (val) {
            hiddenfileEl.fileupload('option', {
              formData: scope.formData
            });
          }
        }, true);

        if (angular.isUndefined(scope.hasDropZone)) {
          initDragAndDrop();
        }
        scope.$watch('hasDropZone', function (hasDropZone) {
          if (angular.isUndefined(hasDropZone) || hasDropZone) {
            initDragAndDrop();
          } else {
            deInitDragAndDrop();
          }
        });

        scope.$watch('abortFlag', function (abortFlag) {
          if (abortFlag) {
            scope.abort();
          }
        });

        scope.$on('$destroy', function () {
          deInitDragAndDrop();
          try {
            hiddenfileEl.fileupload('destroy');
          } catch (err) {
          }
        });
      }
    };
  });