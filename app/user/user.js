angular.module('chummy')
  .controller('UserCtrl', function($scope, $rootScope, $http, $routeParams, $location, $modal, $interval, $cookies, Upload) {
    var admin = $cookies.get('active');

    if(admin === 'false') {
      console.log('redirect');
      $location.path('/');
    }

    $rootScope.$emit('routeCheck');

    $scope.alert = {
      'status': null,
      'type': null,
      'content': null
    };

    $scope.closeAlert = function() {
      $scope.alert = {
        'status': null,
        'type': null,
        'content': null
      };
    };

    $scope.user = {};

    $http.get('/api/user/' + $routeParams.id)
      .success(function(data, status, headers, config) {
        console.log(JSON.stringify(data));

        if(data.result && data.result.user) {
          $scope.user = data.result.user;
          if($scope.user.gender === 'F') {
            $scope.user.gender = '女';
          } else {
            $scope.user.gender = '男';
          }
          if(data.result.user.image_url) {
            $scope.user.user_image = data.result.user.image_url;
          } else {
            $scope.user.user_image = 'imgs/plus.png';
          }
        }

        // TO make sure data.transactions is an array
        if(data.result && data.result.transactions) {
          var transactions = data.result.transactions;
          console.log(transactions);
          transactions.forEach(function(transaction) {
            transaction.createdDate = transaction.createdDate.split('T')[0];
          });
          $scope.transactions = transactions;
        }
      })
      .error(function(data, status, headers, config) {
        console.log("Failed to get User information.");
      });

    $scope.changePassword = function() {
      var passwordModalInstance = $modal.open({
        animation: true,
        templateUrl: 'password.html',
        controller: 'PasswordCtrl',
        size: 'sm',
        resolve: {
          data: function() {
            console.log($routeParams.id);

            return {
              'id': $routeParams.id
            };
          }
        }
      });

      passwordModalInstance.result.then(function() {

      }, function(reason) {

      });
    };

    $scope.upload = function(files) {
      console.log('upload a file');
      console.log(files);

      if(files && files.length) {
        if(files[0].size > 300000) {
          console.log('图片应小于300Kb');
          $scope.alert = {
            'status': 'DISPLAY',
            'type': 'danger',
            'content': '图片应小于300Kb'
          };

          $interval($scope.closeAlert, 3000);
          return;
        }


        Upload.upload({
          url: '/api/user/' + $routeParams.id + '/upload/',
          file: files[0]
        }).progress(function(evt) {
          // TODO: Put a progress bar.
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function(data, status, headers, config) {
          console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
          $scope.user.user_image = data.result.url;
        });
      }

    };
  });

angular.module('chummy')
  .controller('PasswordCtrl', function($scope, $modalInstance, data, $http) {
    $scope.status = "NORMAL";
    $scope.data = data;

    $scope.submitForm = function() {
      if($scope.oldPassword && $scope.newPassword && $scope.newPasswordConfirm) {
        if($scope.newPassword === $scope.newPasswordConfirm) {
          if($scope.oldPassword === $scope.newPassword) {
            $scope.status = "ERROR";
            $scope.errorMsg = '新旧密码不能一样';
          } else {
            var url = '/api/user/' + $scope.data.id + '/password',
              data = {'oldpassword': $scope.oldPassword, 'newpassword': $scope.newPassword};

            $http.put(url, data)
              .success(function(data, status, header, config) {
                $scope.status = "NORMAL";
                $modalInstance.close();
              })
              .error(function(data, status, header, config) {
                $scope.status = "ERROR";
                $scope.errorMsg = '密码错误';
              });
            }
        } else {
          $scope.status = 'ERROR';
          $scope.errorMsg = '密码不一致';
        }
      }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.closeAlert = function() {
      $scope.status = "NORMAL";
    };
  });
