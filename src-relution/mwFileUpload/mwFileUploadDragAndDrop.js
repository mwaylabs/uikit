angular.module('mwFileUpload')

  .directive('mwFileUploadDragAndDrop', function ($timeout) {
    return {
      restrict: 'A',
      templateUrl: 'uikit/templates/mwFileUpload/mwFileUploadDragAndDrop.html',
      scope: {
        id: '@',
        onDocumentDragOverCallback: '=?',
        onDropzoneDragOverCallback: '=?',
        onDrop: '=?'
      },
      link: function (scope, el) {
        var timeout;

        var onDocumentDragOverChange = function (newState) {
          if (typeof scope.onDocumentDragOverCallback === 'function') {
            $timeout(scope.onDocumentDragOverCallback.bind(this, newState));
          }
        };

        var onDropZoneDragOverChange = function (newState) {
          if (typeof scope.onDropzoneDragOverCallback === 'function') {
            $timeout(scope.onDropzoneDragOverCallback.bind(this, newState));
          }
        };

        var onDrop = function () {
          if (typeof scope.onDrop === 'function') {
            $timeout(scope.onDrop.bind(this));
          }
          onDropZoneDragOverChange('DROPZONE_DRAG_LEAVE');
          onDocumentDragOverChange('DOCUMENT_DRAG_LEAVE');
        };

        var documentDragOver = function (e) {
          e.preventDefault();
          if (!timeout) {
            $timeout(function () {
              scope.isInDragState = true;
              onDocumentDragOverChange('DOCUMENT_DRAG_OVER');
            });
          }
          else {
            clearTimeout(timeout);
          }

          timeout = setTimeout(function () {
            timeout = null;
            $timeout(function () {
              scope.isInDragState = false;
              if (!scope.isInDragOverState) {
                onDocumentDragOverChange('DOCUMENT_DRAG_LEAVE');
              }
            });
          }, 100);
        };

        var documentDrop = function (ev) {
          ev.preventDefault();
          onDrop();
        };

        var elDragOver = function () {
          $timeout(function () {
            scope.isInDragOverState = true;
            onDropZoneDragOverChange('DROPZONE_DRAG_OVER');
          });
        };

        var elDragLeave = function () {
          $timeout(function () {
            scope.isInDragOverState = false;
            onDropZoneDragOverChange('DROPZONE_DRAG_LEAVE');
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
          el.on('dragover', elDragOver);
          el.on('dragleave', elDragLeave);
          angular.element(document).on('drop', documentDrop);
        };

        var deInitDragAndDrop = function () {
          angular.element(document).off('dragover', documentDragOver);
          el.off('dragover', elDragOver);
          el.off('dragleave', elDragLeave);
          angular.element(document).off('drop', documentDrop);
        };

        initDragAndDrop();

        scope.$on('$destroy', function () {
          deInitDragAndDrop();
        });
      }
    };
  });