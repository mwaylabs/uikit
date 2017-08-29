angular.module('mwFileUpload', [])

  .provider('mwFileUpload', function(){
    var _defaultConfig = {};

    this.setGlobalConfig = function(conf){
      _.extend(_defaultConfig, conf);
    };

    this.$get = function(){
      return {
        getGlobalConfig: function(){
          return _defaultConfig;
        }
      };
    };

  })

  .directive('mwFileUpload', function ($q, mwFileUpload, ResponseHandler, mwMimetype, $timeout) {
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
        hiddenBtn: '='
      },
      require: '?^form',
      templateUrl: 'uikit/templates/mwFileUpload/mwFileUpload.html',
      link: function (scope, elm, attrs, formController) {

        var timeout,
          fileUploaderEl = elm.find('.mw-file-upload'),
          hiddenfileEl = elm.find('input[type=file]');

        scope._showFileName = angular.isDefined(scope.showFileName) ? scope.showFileName : true;

        scope.uploadState = 'none';

        scope.uploadError = null;

        scope.selectedFile = null;

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

        var error = function(data, result){
          handle(data, true).catch(function () {
            $timeout(scope.successCallback.bind(this,{result:result}));
          });
        };

        var getResult = function(msg){
          if(msg && msg.results && _.isArray(msg.results) && msg.results.length>0){
            msg = msg.results[0];
          }
          return msg;
        };

        var success = function(data, result){
          var parsedResult = getResult(result);
          if (!attrs.validator || mwMimetype.checkMimeType(parsedResult.contentType, attrs.validator)) {
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
              $timeout(scope.successCallback.bind(this,{result:parsedResult}));
            });
          } else {
            if (data.result && data.result.message) {
              scope.uploadError = 'Validation failed. File has to be ' + attrs.validator;
            }
          }
        };

        var stateChange = function(data){
          scope.dataLoaded = data.loaded;
          scope.dataTotal = data.total;
          scope.uploadProgress = parseInt(scope.dataLoaded / scope.dataTotal * 100, 10);
          scope.stateChangeCallback({data:data, progress: scope.uploadProgress});
        };

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
      }
    };
  });