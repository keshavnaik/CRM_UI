'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 * written BY KESHAV NAIK (OCT-03-2018)
 */
angular.module('letsService')
  .controller('CrmSupportLoginCtrl', function ($scope,$window,$cookies,$http,$state,$filter,$rootScope,TokenService,AdminGoogleLoginService,toastr) {

    var id = parseInt(Math.random() * 100);
    var lsToken = TokenService.getToken(id);

    /* $scope.login = function(loginData) {
        var data = {
          username: loginData.adminUsername,
          password: loginData.adminLoginPassword
        };
        AdminLoginService.save({id: id, token: lsToken},data,function(data) {
          $scope.loginData = data;
          console.log('login:',data);
          //$rootScope.letsServiceInitialization();
          if(data.role === 'support'){
             $state.go('supportTool');
          } else {
            $window.alert('Invalid User..!');
          }
        }, function(err) {
          $scope.loginErrorMsg = err.data.message;
          console.log(err);
        });
    };*/

   // $window.sessionStorage.clear();
 
     
  var userLoginLocation;
    function getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
      } else {
          $window.alert('Geolocation is not supported by this browser');
      }
  }

  getLocation();

  function showPosition(position) {
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude).then(function(data) {
        if(data.data.results){
            console.log(data.data);
            if(data.data.results[0] !== undefined){
                userLoginLocation = data.data.results[0].formatted_address;
            }
            console.log('user Login Location ::',userLoginLocation);
        }
      }, function(err) {
        console.log(err);
      });
  }

 //$scope.googleLogin = function(){
 //toastr.info('You are being logged in LetsService Support Console ','LetsService');
  $scope.$on('event:google-plus-signin-success', function (event,authResult) {
    console.log('authResult',authResult);
      $window.sessionStorage.clear();
      $window.localStorage.clear();
      //toastr.info('You are being logged in LetsService Support Console ','LetsService');
      $scope.msg = '';
      $http.get('https://www.googleapis.com/plus/v1/people/me', {
        params: {
          access_token: authResult.Zi.access_token
        }
      }).then(function(res) {
        console.log('res ++++',res);
        var adminLoginData = {
          email: res.data.emails[0].value,
          username : res.data.displayName,
          location: userLoginLocation
        };
        adminGoogleLogin(adminLoginData);
      }, function(err) {
        console.log(err);
      });
    });
//}
  
    $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
      console.log(event);
      console.log(authResult);
    });

    function adminGoogleLogin(loginData) {
      console.log(JSON.stringify(loginData));
      var loginObj = {
        emailId : loginData.email
      };
      console.log(JSON.stringify(loginObj));
      var id = parseInt(Math.random() * 100);
      var lsToken = TokenService.getToken(id);
      AdminGoogleLoginService.save({id:id,token:lsToken}, loginObj, function (data) {
        console.log('data:::',data);
        toastr.success('You are Successfully logged in LetsService Support Console as ' + loginData.username,'LetsService');
        $window.sessionStorage.setItem('loggedInUser',loginData.username);
        $window.sessionStorage.setItem('loggedInSupportRole',data.role);
        $window.sessionStorage.setItem('loggedInSupportId',data.logInId);
        $window.sessionStorage.setItem('loginMobile',data.callermobile);
        $rootScope.letsServiceSupportInitialization();
        if(data.role === 'support'){
           $state.go('supportView');   
        } else if(data.role === 'admin'){
           $state.go('supportStats');   
        } else if(data.role === 'superadmin'){
           $state.go('supportView');   
        }
      }, function (err) {
        console.log(err);
        //$scope.msg = err.data.message;
        console.log(err.data.message);
        toastr.info(err.data.message,'LetsService');
        //$window.alert(err.data.message);
      });
    }

    
  });
