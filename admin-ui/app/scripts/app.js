'use strict';
var module = angular.module('newadminApp', [
  'newadminApp.services',
  'ngResource',
  'ngRoute',
  'ui.bootstrap',
  'ups.directives',
  'patternfly.notification']);

var auth = {};
var logout = function(){
  console.log('*** LOGOUT');
  auth.loggedIn = false;
  auth.authz = null;
  window.location = auth.logoutUrl;
};


angular.element(document).ready(function ($http) {
  var keycloakAuth = new Keycloak('keycloak.json');
  auth.loggedIn = false;

  keycloakAuth.init({ onLoad: 'login-required' }).success(function () {
    auth.loggedIn = true;
    auth.authz = keycloakAuth;
    auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/demo/tokens/logout?redirect_uri=http://localhost:8080/angular-product/index.html";
    module.factory('Auth', function() {
      return auth;
    });
    window.location = "#/main"
  }).error(function () {
    window.location.reload();
  });

});

module.factory('Auth', function() {
  return auth;
});

module.config(function ($routeProvider) {

    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController',
        crumb: {
          level: 0,
          label: 'Applications'
        }
      })
      .when('/detail/:applicationId', {
        templateUrl: 'views/detail.html',
        controller: 'DetailController',
        crumb: {
          level: 1,
          label: '$ application.name ? application.name : "Current Application"'
        }
      })
      .when('/:applicationId/installations/:variantId', {
        templateUrl: 'views/installation.html',
        controller: 'InstallationController',
        crumb: {
          level: 2,
          label: '$ variant.name ? variant.name : "Registering Installations"'
        }
      })
      .when('/example/:applicationId/:variantType/:variantId', {
        templateUrl: 'views/example.html',
        controller: 'ExampleController',
        crumb: {
          level: 2,
          label: 'Example'
        }
      })
      .when('/example/:applicationId/:variantType', {
        templateUrl: 'views/example.html',
        controller: 'ExampleController',
        crumb: {
          level: 2,
          label: 'Example'
        }
      })
      .when('/compose/:applicationId', {
        templateUrl: 'views/compose.html',
        controller: 'ComposeController',
        crumb: {
          level: 2,
          label: 'Compose'
        }
      })


  }) ;
module.factory('authInterceptor', function($q, Auth) {
  return {
    request: function (config) {
      var deferred = $q.defer();
      if (Auth.authz.token) {
        Auth.authz.updateToken(5).success(function() {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + Auth.authz.token;

          deferred.resolve(config);
        }).error(function() {
          deferred.reject('Failed to refresh token');
        });
      }
      return deferred.promise;
    }
  };
});

 module.config(function($httpProvider) {
    //$httpProvider.responseInterceptors.push('errorInterceptor');
    $httpProvider.interceptors.push('authInterceptor');

  });

