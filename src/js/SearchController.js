goog.provide('ga_search_controller');
(function() {

  var module = angular.module('ga_search_controller', []);

  module.controller('GaSearchController',
      function($scope, gaGlobalOptions) {
        $scope.options = {
          searchUrl: gaGlobalOptions.cachedApiUrl +
              '/rest/services/demo/SearchServer?',
          featureUrl: gaGlobalOptions.cachedApiUrl +
              '/rest/services/demo/MapServer/{Layer}/{Feature}'
        };
      });
})();

