angular.module('mwUI.List')

  .directive('mwListColumnConfigurator', function ($timeout) {
    return {
      require: '^mwListableBb',
      scope: true,
      templateUrl: 'uikit/mw-list/directives/templates/mw_list_column_configurator.html',
      link: function (scope, el, attrs, mwListCtrl) {
        var dropDownMenu = el.find('.dropdown-menu'),
          dropDownToggle = el.find('.btn-group'),
          hideDropDownEvents = 'scroll touchmove mousewheel resize';

        scope.colums = mwListCtrl.getColumns();

        var tableConfigurator = mwListCtrl.getTableConfigurator();

        var hide = function () {
          if (dropDownToggle.hasClass('open')) {
            dropDownMenu.dropdown('toggle');
          }
        };

        var saveVisibilityState = function (column) {
          if (tableConfigurator) {
            tableConfigurator.get('columns').add({
              id: column.persistId,
              visible: column.scope.isVisible()
            }, {merge: true});
            tableConfigurator.save();
          } else {
            console.warn('In order to persist the visibility of the column the table needs an id!');
          }
        };

        scope.getColTitle = function (column) {
          if (column && column.scope) {
            var title = column.scope.getTitle() || '';
            if (title.length > 0) {
              return title;
            } else {
              return false;
            }
          }
        };

        scope.reset = function () {
          scope.colums.forEach(function (column) {
            column.scope.resetColumnVisibility();
          });
          if (tableConfigurator) {
            tableConfigurator.destroy();
          }
        };

        scope.toggleColumn = function (column) {
          column.scope.toggleColumn();
          saveVisibilityState(column);
        };

        dropDownToggle.on('show.bs.dropdown', function () {
          dropDownMenu.css({
            position: 'fixed',
            top: el.offset().top + el.innerHeight() + 5,
            left: 'initial',
            right: '30px'
          });

          // We need to trigger a digest cycle otherwise it can happen that the dropdown list is not up to date
          $timeout(function () {
            angular.element(window).on(hideDropDownEvents, hide);
          });
        });

        dropDownToggle.on('hide.bs.dropdown', function () {
          angular.element(window).off(hideDropDownEvents, hide);
        });
      }
    };
  });