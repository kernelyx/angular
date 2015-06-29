angular.module('chummy').controller('HeaderCtrl', function ($scope, $modal, $log, $http, $rootScope, $cookies, $location, $interval) {

  $rootScope.$on('routeCheck', function() {
    $scope.updateHeader();
  });

  $scope.payment = false;
  $scope.notifyAlert = {};
  $scope.notifyAlert.status = 'closed';
  $scope.notifyAlert.msg = '';
  $scope.notifyAlert.close = function() {
    $scope.notifyAlert.status = 'closed';
    $scope.notifyAlert.msg = '';
  }

  $scope.notifyAlert.open = function(msg) {
    console.log(msg);
    $scope.notifyAlert.msg = msg;
    $scope.notifyAlert.status = 'open';
    // Close self after 3s.
    $interval($scope.notifyAlert.close, 3000);
  }

  $scope.isCollapsed = true;
  $scope.updateHeader = function() {
    if($cookies.get('active') && $cookies.get('user_name') && $cookies.get('email')) {
      if($cookies.get('active') === 'true') {
        $scope.signedIn = true;
      } else {
        $scope.signedIn = false;
      }
      $scope.name = $cookies.get('user_name');
      $scope.id = $cookies.get('user_id');
      if($cookies.get('is_admin') === 'true') {
        $scope.isAdmin = true;
      } else {
        $scope.isAdmin = false;
      }
    } else {
      $scope.signedIn = false;
    }
  };

  $scope.updateHeader();

  $scope.animationsEnabled = true;
  $rootScope.$on('signIn', function(name, args) {
    if(args && args.payment) {
      $scope.payment = true;
    }
    console.log('Sign In dropdown');
    $scope.signIn();
  });

  $rootScope.$on('signUp', function(name, args) {
    if(args && args.payment) {
      $scope.payment = true;
    }
    $scope.signUp();
  });

  $scope.signUp = function() {
    var signupModalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'signup.html',
      controller: 'SignUpCtrl',
      size: 'sm'
    });

    signupModalInstance.result.then(function (userData) {
      $scope.updateHeader();

      var notifyString = $scope.payment ? '注册成功请再次预约。': '注册成功';
      $scope.payment = false;
      $scope.notifyAlert.open(notifyString);
    }, function (reason) {
      $log.info('Modal dismissed at: ' + new Date());
      if(reason === 'switch') {
        $scope.signIn();
      }
    });
  };

  $scope.signIn = function() {
    var signinModalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'signin.html',
      controller: 'SignInCtrl',
      size: 'sm'
    });

    signinModalInstance.result.then(function (userData) {
      $scope.updateHeader();
      console.log('sing in');
      console.log($scope.payment);
      var notifyString = '登录成功';
      if($scope.payment) {
        notifyString = '登录成功，请再次预约。';
      }
      $scope.notifyAlert.open(notifyString);
      $scope.payment = false;
    }, function (reason) {
      if(reason === 'switch') {
        $scope.signUp();
      }
    });
  };

  $scope.signout = function() {
    $http.post('/api/user/signout')
      .success(function(data, status, headers, config) {
        $scope.updateHeader();
        $location.path('/');
      })
      .error(function(data, status, headers, config) {
        // Error
      });
  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
angular.module('chummy').controller('SignUpCtrl', function ($scope, $modalInstance, $http) {
  $scope.status = 'NORMAL';

  $scope.open = function() {
    $modalInstance.dismiss('switch');
  };

  $scope.submitForm = function() {
    var samePassword = ($scope.userData.password === $scope.userData.passwordAgain);

    if(!samePassword) {
      $scope.errorMsg = "密码不一致";
      $scope.status = 'ERROR';
    } else if($scope.signUpForm.$valid) {
      console.log($scope.userData);

      $http.post('/api/user', $scope.userData).
        success(function(data, status, headers, config) {
          $scope.status = 'NORMAL';
          $modalInstance.close();
        }).
        error(function(data, status, headers, config) {
          if(status == 400) {
            $scope.errorMsg = "用户已经存在";
            $scope.status = 'ERROR';
          }
        });
    }
  };

  $scope.closeAlert = function() {
    $scope.status = 'NORMAL';
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('chummy').controller('SignInCtrl', function ($scope, $modalInstance, $http) {
  $scope.userData = {
    'email': '',
    'password': ''
  };

  $scope.status = "NORMAL";

  $scope.open = function() {
    $modalInstance.dismiss('switch');
  };

  $scope.closeAlert = function() {
    $scope.status = 'NORMAL';
  };

  $scope.submitForm = function() {
    $http.put('/api/user', $scope.userData).
      success(function(data, status, headers, config) {
        $scope.status = 'NORMAL';
        $modalInstance.close();
      }).
      error(function(data, status, headers, config) {
        $scope.status = 'ERROR';
      });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});