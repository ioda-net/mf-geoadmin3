(function() {
  goog.provide('ga_attribution_directive');

  var module = angular.module('ga_attribution_directive', []);

  module.directive('gaAttribution', function($translate, $window) {
    return {
      restrict: 'A',
      scope: {
        map: '=gaAttributionMap'
      },
      link: function(scope, element, attrs) {
        var control = new ol.control.Attribution({
          label: '',
          target: element[0],
          tipLabel: ''
        });
        scope.map.addControl(control);

        element.on('click', '.ga-warning-tooltip', function() {
          $window.alert($translate.instant('third_party_data_warning'));
        });
      }
    };
  });

})();
