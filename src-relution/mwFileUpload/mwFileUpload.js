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

  .directive('mwFileUpload', function ($q, $timeout, $filter, mwFileUpload, ResponseHandler, mwMimetype, i18n) {
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
        showUploadBtnAlways: '=?',
        hasDropZone: '=?',
        hideCancelBtn: '=?',
        hideRemoveBtn: '=?',
        abortFlag: '=?',
        maxFileSizeByte: '=?'
      },
      require: '?^form',
      templateUrl: 'uikit/templates/mwFileUpload/mwFileUpload.html',
      link: function (scope, elm, attrs, formController) {
        scope.viewModel = {
          uploaderOptions: {},
          state: null,
          uploadProgress: 0,
          fileName: null,
          uploadError: null,
          isInvalid: false,
          dropZoneId: _.uniqueId('dropzone'),
          dropZoneElmement: null,
          documentDragOver: false,
          dropzoneDragOver: false,
          hasDropzone: false
        };

        var handleResponse = function (response, isError) {
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

        var updateFileName = function () {
          var labelAttr = scope.labelAttribute || 'name';
          if (scope.model instanceof window.Backbone.Model) {
            scope.viewModel.fileName = scope.model.get(labelAttr);
          } else if (scope.model) {
            scope.viewModel.fileName = scope.model[labelAttr];
          } else {
            scope.viewModel.fileName = null;
          }
        };

        var updateModel = function (file) {
          if (scope.model instanceof Backbone.Model) {
            scope.model.set(scope.model.parse(file));
          } else if (scope.attribute) {
            scope.model = file[scope.attribute];
          } else {
            scope.model = file;
          }
          updateFileName();
        };

        var updateFile = function (xhr, response, file) {
          if (attrs.validator && !mwMimetype.checkMimeType(file.contentType, attrs.validator)) {
            if (response && response.message) {
              scope.uploadError = i18n.get('rlnUikit.mwFileUpload.invalidMimeType', {mimeType: attrs.validator});
              scope.viewModel.isInvalid = true;
              scope.viewModel.fileName = file.name;
              return;
            }
          }

          updateModel(file);

          handleResponse(xhr, false).then(function () {
            $timeout(scope.successCallback.bind(this, {result: file}));
          });
        };

        var setFormDirty = function () {
          if (formController) {
            formController.$setDirty();
          }
        };

        var triggerFileToBigError = function (files) {
          if (!files || !angular.isArray(files) || files.length === 0) {
            return;
          }
          var file = files[0];
          var actualFileSizeReadable = $filter('mwReadableFileSize')(file.size);
          var maxFileSizeReadable = $filter('mwReadableFileSize')(scope.maxFileSizeByte);
          var errorMsg = i18n.get('rlnUikit.mwFileUpload.fileTooLarge', {
            fileName: file.name,
            max: maxFileSizeReadable,
            actual: '(' + actualFileSizeReadable + ')'
          });
          $timeout(scope.errorCallback.bind(this, {
            result: {
              msg: errorMsg,
              code: 413,
              fileSize: file.size,
              fileName: file.name,
              fileType: file.type,
              maxFileSizeByte: scope.maxFileSizeByte
            }
          }));
          scope.viewModel.fileName = file.name;
          scope.viewModel.uploadError = errorMsg;
        };

        var updateUploaderOptions = function (options) {
          options = options || {};
          _.extend(scope.viewModel.uploaderOptions, options);
        };

        var setDropZone = function () {
          $timeout(function () {
            scope.viewModel.dropZoneElmement = elm.find('#' + scope.viewModel.dropZoneId);
          });
        };

        scope.abort = function () {
          scope.abortFlag = true;
        };

        scope.dragoverDocumentStateChange = function (newState) {
          if (newState === 'DOCUMENT_DRAG_OVER') {
            scope.viewModel.documentDragOver = true;
          } else {
            scope.viewModel.documentDragOver = false;
            scope.viewModel.dropzoneDragOver = false;
          }
        };

        scope.dragoverDropzoneStateChange = function (newState) {
          if (newState === 'DROPZONE_DRAG_OVER') {
            scope.viewModel.dropzoneDragOver = true;
          } else {
            scope.viewModel.dropzoneDragOver = false;
          }
        };

        scope.canShowUploadBtn = function () {
          return scope.viewModel.state !== 'UPLOADING' &&
            (!scope.viewModel.fileName || scope.showUploadBtnAlways || scope.hideRemoveBtn);
        };

        scope.canShowRemoveBtn = function () {
          return !scope.hideRemoveBtn && scope.viewModel.fileName;
        };

        scope.onUploadStart = function() {
          scope.viewModel.state = 'UPLOADING';
        };
        /* progressData = {
            data:blueImpXhr,
            progress: progress,
            total: dataTotal,
            loaded: dataLoaded
         } */
        scope.onUploadProgress = function (progressData) {
          var fileName = '';
          if (!angular.isObject(progressData)) {
            return;
          }
          if (progressData.data && angular.isArray(progressData.data.files) && progressData.data.files[0]) {
            fileName = progressData.data.files[0].name;
          }
          scope.abortFlag = false;
          scope.viewModel.isInvalid = true;
          scope.viewModel.uploadProgress = progressData.progress;
          scope.viewModel.uploadMessage = i18n.get('rlnUikit.mwFileUpload.uploading', {
            fileName: fileName
          });
          $timeout(scope.stateChangeCallback.bind(this, {
            data: progressData.data,
            progress: progressData.progress
          }));
          scope.dragoverDocumentStateChange();
          scope.dragoverDropzoneStateChange();
        };

        /* data = {
           xhr: blueImpXhr,
           response: {}
           file: {}
         } */
        scope.onUploadSuccess = function (data) {
          scope.viewModel.state = 'DONE';
          scope.viewModel.uploadProgress = 0;
          updateFile(data.xhr, data.response, data.file);
          scope.viewModel.isInvalid = false;
          setFormDirty();
          $timeout(scope.successCallback.bind(this, {result: data.file}));
        };

        /* data = {
           type: FILE_TOO_BIG | SERVER | CUSTOM_VALIDATION_FAILED,
           xhr: blueImpXhr,
           result: {
             files: [] | null,
             response: {} | null
           }
         } */
        scope.onUploadError = function (data) {
          scope.viewModel.state = 'DONE';
          switch (data.type) {
            case 'FILE_TOO_BIG':
              triggerFileToBigError(data.result.files);
              break;
            case 'SERVER':
              break;
            case 'CUSTOM_VALIDATION_FAILED':
              break;
          }
          scope.viewModel.isInvalid = true;
          setFormDirty();
          $timeout(scope.errorCallback.bind(this, {result: data.response || {}}));
        };

        scope.onUploadAbort = function () {
          scope.viewModel.state = 'DONE';
          scope.viewModel.isInvalid = false;
        };

        scope.removeFile = function () {
          updateModel(null);
          scope.viewModel.isInvalid = false;
        };

        scope.$watch('url', function (val) {
          if (val) {
            updateUploaderOptions({
              url: val
            });
          }
        });

        scope.$watch('formData', function (val) {
          if (val) {
            updateUploaderOptions({
              formData: val
            });
          }
        }, true);

        scope.$watch('hasDropZone', function (val) {
          if (val) {
            scope.viewModel.hasDropZone = true;
            setDropZone();
          } else {
            scope.viewModel.hasDropZone = false;
          }
        });

        if (angular.isUndefined(scope.hasDropZone)) {
          scope.hasDropZone = true;
        }

        updateUploaderOptions(mwFileUpload.getGlobalConfig());

        scope.$watch('model', updateFileName);
      }
    };
  });