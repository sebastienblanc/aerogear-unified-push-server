'use strict';

/* Directives */
angular.module('ups.directives', [])

    .directive('upsNavigation', function () {
        return {
            scope: {
                current: '@'
              },
              restrict: 'E',
              replace: true,
              templateUrl: 'directives/ups-navigation.html'
            };
      })

    .directive('upsAlerts', function () {
        return {
            scope: {
            },
            controller: function($rootScope, $scope) {
                $scope.alerts = $rootScope.notifications.data;
              },
            restrict: 'E',
            replace: false,
            templateUrl: 'directives/ups-alerts.html'
          };
      })

    .directive('variants', function () {
        return {
            scope: {
                variants: '=',
                counts: '=',
                type: '@'
              },
              controller: function($scope, $routeParams) {
                $scope.expand = function(variant) {
                    variant.expand = !variant.expand;
                  };

                $scope.isCollapsed = function(variant) {
                    return !variant.expand;
                  };

                $scope.editVariant = function(variant, type) {
                    $scope.$parent.editVariant(variant, type);
                  };

                $scope.removeVariant = function(variant, type) {
                    $scope.$parent.removeVariant(variant, type);
                  };

                $scope.applicationId = $routeParams.applicationId;
              },
              templateUrl: 'directives/variant-details.html'
            };
      })

    .directive('upsFiles', function() {
        return {
            scope: {
                'files': '=upsFiles'
              },
              restrict: 'A',
              replace: false,
              link: function($scope, $element) {
                  $element.bind('change', function(e) {
                    while($scope.files.length > 0) {
                      $scope.files.pop();
                    }
                    for(var i in e.target.files) {
                      if(typeof e.target.files[i] === 'object') {
                        $scope.files.push(e.target.files[i]);
                      }
                    }
                  });
                }
            };
      });
