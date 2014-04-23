'use strict';

angular.module('mwMap', [])

/**
 * @ngdoc directive
 * @name mwWizard.directive:mwWizard
 * @element div
 * @description
 *
 * Multiple wizard steps can be transcluded into this directive. This Directive handles the
 * registration of every single wizard step
 *
 * @param {wizard} mw-wizard Wizard instance created by the Wizard service.
 */
  .directive('mwMap', function () {
    return {
      restrict: 'A',
      scope: {
        centerCoords: '=',
        zoom: '=',
        type:'@'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwMap/mwMap.html',
      controller: function ($window,$scope) {
        if(!$window.ol){
          throw new Error('The directive mwMap needs the Openlayer 3 library. Make sure you included it!');
        }

        var openlayer = this.openlayer = $window.ol;

        var centerCoords = $scope.centerCoords || [0,0],
            zoom = $scope.zoom || 1,
            type = $scope.type || 'osm';

        $scope.map = this.map = new openlayer.Map({
          target: 'map',
          layers: [
            new openlayer.layer.Tile({
              source: new openlayer.source.MapQuest({layer: type})
            })
          ],
          ol3Logo:false,
          view: new openlayer.View2D({
            center: openlayer.proj.transform(centerCoords, 'EPSG:4326', 'EPSG:3857'),
            zoom: zoom
          })
        });

        $scope.$watch('zoom',function(value) {
          if (value) {
            $scope.map.getView().setZoom(value);
          }
        });

        $scope.$watch('centerCoords',function(value){
          if(value){
            $scope.map.getView().setCenter(openlayer.proj.transform(value, 'EPSG:4326', 'EPSG:3857'));
          }
        });
        var resize = function(){
          $scope.map.updateSize();
        };

        setTimeout( resize, 201);
        angular.element($window).on('resize', _.throttle(resize, 300));
      }
    };
  })

  .directive('mwMapMarker', function () {
    return {
      restrict: 'A',
      scope: {
        coords: '='
      },
      require: '^mwMap',
      template: '<div class="marker"></div>',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
            openlayer = mwMapCtrl.openlayer,
            coords = scope.coords || [0,0];

        var marker = new openlayer.Overlay({
          position: openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'),
          positioning: 'center-center',
          element: el[0],
          stopEvent: false
        });
        map.addOverlay(marker);

        scope.$watch('coords',function(value){
          if(value){
            marker.setPosition(openlayer.proj.transform(value, 'EPSG:4326', 'EPSG:3857'));
          }
        });
      }
    };
  })

  .directive('mwMapOverlay', function () {
    return {
      restrict: 'A',
      scope: {
        coords: '='
      },
      transclude: true,
      require: '^mwMap',
      template: '<div ng-transclude class="overlay mw-map-overlay"></div>',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
          openlayer = mwMapCtrl.openlayer,
          coords = scope.coords || [0,0];

        var overlay = new openlayer.Overlay({
          position: openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'),
          positioning: 'center-center',
          element: el.find('.mw-map-overlay')[0],
          stopEvent: false
        });
        map.addOverlay(overlay);

        scope.$watch('coords',function(value){
          if(value){
            overlay.setPosition(openlayer.proj.transform(value, 'EPSG:4326', 'EPSG:3857'));
          }
        });
      }
    };
  })

  .directive('mwMapCircle', function () {
    return {
      restrict: 'A',
      scope: {
        coords: '=',
        radius: '='
      },
      require: '^mwMap',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
          openlayer = mwMapCtrl.openlayer,
          coords = scope.coords || [0,0],
          radius = scope.radius || 1000;

        map.on('postcompose', function(evt) {
          evt.vectorContext.setFillStrokeStyle(
            new openlayer.style.Fill({color: 'rgba(255, 0, 0, .1)'}),
            new openlayer.style.Stroke({color: 'rgba(255, 0, 0, .8)', width: 3}));
          evt.vectorContext.drawCircleGeometry(
            new openlayer.geom.Circle(openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'), radius));
        });
      }
    };
  });

