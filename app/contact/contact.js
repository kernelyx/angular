angular.module('chummy')
  .controller('ContactCtrl', function($scope, $http, $route, $interval, $rootScope) {
    'use strict';

    $rootScope.$emit('routeCheck');

    $scope.alert = {
      'status': null,
      'type': null,
      'content': null
    };

    $scope.closeAlert = function() {
      $scope.alert.status = null;
    };

    $scope.userData = {
      'email': null,
      'name': null,
      'wechat': null,
      'message': null
    };

    var resetForm = function(form) {
      form.$setPristine();
      $scope.userData = {
        'email': null,
        'name': null,
        'wechat': null,
        'message': null
      };
    };

    $scope.submitForm = function() {
      var currentTime = Date.now();

      $scope.userData.time = currentTime;
      console.log($scope.userData);
      $http.post('/api/contact', $scope.userData)
        .success(function(data, status, header, config) {
          $scope.alert.status = 'DISPLAY';
          $scope.alert.type = 'success';
          $scope.alert.content = '我们已经收到您的信息';
          resetForm($scope.contactForm);
          $interval($scope.closeAlert, 3000);
        })
        .error(function(data, status, header, config) {
          $scope.alert.status = 'DISPLAY';
          $scope.alert.type = 'danger';
          $scope.alert.content = '请求错误，请稍后再试。';
          resetForm($scope.contactForm);
          $interval($scope.closeAlert, 3000);
        });
    };
  });