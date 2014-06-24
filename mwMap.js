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
        centerLat: '=',
        centerLng: '=',
        zoom: '=',
        type:'@'
      },
      transclude: true,
      templateUrl: 'modules/ui/templates/mwMap/mwMap.html',
      controller: function ($window,$scope, LayoutWatcher) {
        if(!$window.ol){
          throw new Error('The directive mwMap needs the Openlayer 3 library. Make sure you included it!');
        }

        var openlayer = this.openlayer = $window.ol;


        var centerCoords = [$scope.lng || 9.178977, $scope.lat || 48.812951],
            zoom = $scope.zoom || 1,
            type = $scope.type || 'osm';

        var centerMap = function(){
          if($scope.lat && $scope.lng){
            $scope.map.getView().setCenter(openlayer.proj.transform([$scope.lng,$scope.lat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        var resize = function(){
          $scope.map.updateSize();
        };

        $scope.map = this.map = new openlayer.Map({
          layers: [
            new openlayer.layer.Tile({
              source: new openlayer.source.MapQuest({layer: type,minZoom:6})
            })
          ],
          ol3Logo:false,
          view: new openlayer.View2D({
            center: openlayer.proj.transform(centerCoords, 'EPSG:4326', 'EPSG:3857'),
            zoom: zoom,
            minZoom: 6
          })
        });

        $scope.$watch('zoom',function(value) {
          if (value) {
            $scope.map.getView().setZoom(value);
          }
        });

        $scope.$watch('lat',centerMap);
        $scope.$watch('lng',centerMap);

        LayoutWatcher.registerCallback(resize);

        $scope.$on('$destroy',function(){
          $scope.map.removeLayer();
          $scope.map.removeOverlay();
        });
      },
      link:function(scope,el){
        scope.map.setTarget(el.find('#map')[0]);
      }
    };
  })

  .directive('mwMapMarker', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '='
      },
      require: '^mwMap',
      template: '<div class="marker"></div>',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
            openlayer = mwMapCtrl.openlayer,
            coords = [scope.lng || 0, scope.lat || 0];

        var marker = new openlayer.Overlay({
          position: openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'),
          positioning: 'center-center',
          element: el[0],
          stopEvent: false
        });

        var setPosition = function(){
          if(scope.lat && scope.lng){
            marker.setPosition(openlayer.proj.transform([scope.lng, scope.lat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        map.addOverlay(marker);

        scope.$watch('lat',setPosition);
        scope.$watch('lng',setPosition);

        scope.$on('$destroy',function(){
          map.removeOverlay(marker);
        });
      }
    };
  })

  .directive('mwMapOverlay', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '=',
        display: '='
      },
      transclude: true,
      require: '^mwMap',
      template: '<div ng-transclude class="overlay mw-map-overlay"></div>',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
          openlayer = mwMapCtrl.openlayer,
          coords = [scope.lng || 0, scope.lat || 0];

        var overlay = new openlayer.Overlay({
          position: openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'),
          positioning: 'center-center',
          element: el.find('.mw-map-overlay')[0],
          stopEvent: false
        });

        var setPosition = function(){
          if(scope.lat && scope.lng){
            overlay.setPosition(openlayer.proj.transform([scope.lng, scope.lat], 'EPSG:4326', 'EPSG:3857'));
          }
        };

        map.addOverlay(overlay);

        scope.$watch('lat',setPosition);
        scope.$watch('lng',setPosition);

        scope.$watch('display',function(display){
          if(display){
            map.addOverlay(overlay);
            setPosition();
          } else {
            map.removeOverlay(overlay);
          }
        });

        scope.$on('$destroy',function(){
          map.removeOverlay(overlay);
        });
      }
    };
  })

  .directive('mwMapCircle', function () {
    return {
      restrict: 'A',
      scope: {
        lat: '=',
        lng: '=',
        radius: '=',
        fill: '@',
        stroke: '@',
        strokeWidth: '@'
      },
      require: '^mwMap',
      link: function (scope,el,attr,mwMapCtrl) {
        var map = mwMapCtrl.map,
          openlayer = mwMapCtrl.openlayer,
          coords = [scope.lng || 0, scope.lat || 0],
          radius = scope.radius || 1000,
          fill = scope.fill || 'rgba(255, 255, 255, .5)',
          stroke = scope.stroke || '#fff',
          strokeWidth = scope.strokeWidth || 3;

        map.on('postcompose', function(evt) {
          evt.vectorContext.setFillStrokeStyle(
            new openlayer.style.Fill({color: fill}),
            new openlayer.style.Stroke({color: stroke, width: strokeWidth}));
          evt.vectorContext.drawCircleGeometry(
            new openlayer.geom.Circle(openlayer.proj.transform(coords, 'EPSG:4326', 'EPSG:3857'), radius));
        });
      }
    };
  });

