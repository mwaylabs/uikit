/**
 * Return the DOM siblings between the first and last node in the given array.
 * @param {Array} array like object
 * @returns {Array} the inputted object or a jqLite collection containing the nodes
 */
function getBlockNodes(nodes) {
  // TODO(perf): update `nodes` instead of creating a new object?
  var node = nodes[0];
  var endNode = nodes[nodes.length - 1];
  var blockNodes;

  for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
    if (blockNodes || nodes[i] !== node) {
      if (!blockNodes) {
        blockNodes = jqLite(slice.call(nodes, 0, i));
      }
      blockNodes.push(node);
    }
  }

  return blockNodes || nodes;
}

window.AuthenticatedUser = mwUI.Backbone.Model.extend({
  nested: function () {
    return {
      permissions: mwUI.Backbone.Collection
    };
  }
}, {
  getInstance() {
    if (!window.authenticatedUser) {
      window.authenticatedUser = new window.AuthenticatedUser();
    }
    return window.authenticatedUser;
  }
});

angular.module('SampleApp.Main')
  .factory('authenticatedUser', function () {
    return window.AuthenticatedUser.getInstance();
  })

  .factory('Permission', function (authenticatedUser) {
    var checkPermissions = function (permissions) {
      if (!_.isArray(permissions)) {
        throw new Error('Permission:checkPermissions: parameter has to be an array');
      }
      var checkedPermissions = permissions.filter(function (permission) {
        return !!authenticatedUser.get('permissions').get(permission);
      });
      return checkedPermissions.length > 0;
    };
    return {
      checkPermissions: checkPermissions
    };
  })

  .directive('rlnPermission', function ($animate, $compile, Permission, authenticatedUser) {
    return {
      multiElement: true,
      transclude: 'element',
      priority: 600,
      terminal: true,
      restrict: 'A',
      $$tlb: true,
      link: function ($scope, $element, $attr, ctrl, $transclude) {
        var block, childScope, previousElements;
        var ngIfWatchAction = function (show) {
          if (show) {
            if (!childScope) {
              $transclude(function (clone, newScope) {
                childScope = newScope;
                clone[clone.length++] = $compile.$$createComment('end rlnPermission', $attr.rlnPermission);
                // Note: We only need the first/last node of the cloned nodes.
                // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                // by a directive with templateUrl when its template arrives.
                block = {
                  clone: clone
                };
                $animate.enter(clone, $element.parent(), $element);
              });
            }
          } else {
            if (previousElements) {
              previousElements.remove();
              previousElements = null;
            }
            if (childScope) {
              childScope.$destroy();
              childScope = null;
            }
            if (block) {
              previousElements = getBlockNodes(block.clone);
              $animate.leave(previousElements).done(function (response) {
                if (response !== false) previousElements = null;
              });
              block = null;
            }
          }
        };

        var hideOrShow = function () {
          var permissions = $scope.$eval($attr.rlnPermission),
            rlnIf = $scope.$eval($attr.rlnIf);
          try {
            if (permissions && Permission.checkPermissions(permissions) && (rlnIf || angular.isUndefined(rlnIf))) {
              ngIfWatchAction(true);
            } else {
              ngIfWatchAction(false);
            }
          } catch (err) {
            console.warn(err);
          }
        };


        $scope.$watch($attr.rlnIf, hideOrShow);

        $scope.$watch($attr.rlnPermission, hideOrShow);

        authenticatedUser.get('permissions').on('add reset remove', hideOrShow);

        authenticatedUser.get('permissions').on('add', function(model){
          console.log('GROUPS WAS ADDED', model.id);
        });
      }
    };
  });