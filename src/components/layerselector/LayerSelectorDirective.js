(function() {
  goog.provide('ga_layerselector_directive');

  goog.require('ga_map');
  goog.require('ga_permalink');

  var module = angular.module('ga_layerselector_directive', [
    'ga_map',
    'pascalprecht.translate',
    'ga_permalink'
  ]);

  module.controller('GaLayerselectorDirectiveController',
    function($scope, $timeout, $translate, gaBrowserSniffer) {
    }
  );

  module.filter('gaReplace', function() {
    return function(str, str1, str2) {
      return str.replace(new RegExp('[' + str1 + ']', 'g'), str2);
    };
  });

  module.directive('gaLayerselector',
    function(gaPermalink, gaLayers, gaLayerFilters) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        map: '=gaLayerselectorMap'
      },
      templateUrl: 'components/layerselector/partials/layerselector.html',
      controller: 'GaLayerselectorDirectiveController',
      link: function(scope, elt, attrs) {
        var map = scope.map;
        var firstLayerChangeEvent = true;

        function setCurrentLayer(newVal, oldVal) {
          var layers = map.getLayers();
          if (newVal == 'voidLayer') {
            if (layers.getLength() > 0 &&
                layers.item(0).background === true) {
              layers.removeAt(0);
            }
          } else if (gaLayers.getLayer(newVal)) {
            var layer = gaLayers.getOlLayerById(newVal);
            layer.background = true;
            layer.displayInLayerManager = false;

            if (!oldVal || oldVal == 'voidLayer') {
              // we may have a non background layer at index 0
              layers.insertAt(0, layer);
            } else {
              layers.setAt(0, layer);
            }
          } else {
            scope.currentLayer = scope.backgroundLayers[0].id;
          }
          gaPermalink.updateParams({bgLayer: newVal});
        }

        scope.$on('gaLayersChange', function(event, data) {
          var backgroundLayers = gaLayers.getBackgroundLayers();
          backgroundLayers.push({id: 'voidLayer', label: 'void_layer'});
          scope.backgroundLayers = backgroundLayers;

          // Determine the current background layer. Strategy:
          //
          // If this is the first gaLayersChange event we receive then
          // we look at the permalink. If there's a bgLayer parameter
          // in the permalink we use that as the initial background
          // layer.
          //
          // If it's not the first gaLayersChange event, or if there's
          // no bgLayer parameter in the permalink, then we use the
          // first background layer of the background layers array.
          //
          // Unless the gaLayersChange event has labelsOnly set to
          // true, in which case we don't change the current background
          // layer.
          //
          // Specific use case when we go offline to online, in this use
          // case we want to keep the current bg layer.

          var currentLayer;
          if (firstLayerChangeEvent) {
            currentLayer = gaPermalink.getParams().bgLayer;
            scope.setActiveBackground(currentLayer);
            firstLayerChangeEvent = false;
          }
          if (!currentLayer && !data.labelsOnly) {
            currentLayer = backgroundLayers[0].id;
            scope.setActiveBackground(currentLayer);
          }
          if (currentLayer && !isOfflineToOnline) {
            scope.currentLayer = currentLayer;
          }
          isOfflineToOnline = false;

        });

        scope.setActiveBackground = function(id) {
          var layers = map.getLayers();
          var oldVal = 'voidLayer';
          if (layers.getLength() > 0 &&
                layers.item(0).background === true) {
            oldVal = layers.item(0).id;
          }
          setCurrentLayer(id,oldVal);
        };

        // We must know when the app goes from offline to online.
        var isOfflineToOnline = false;
        scope.$on('gaNetworkStatusChange', function(evt, offline) {
          isOfflineToOnline = !offline;
        });
      }
    };
  });


})();

