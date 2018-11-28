'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 * written BY KESHAV NAIK (JULY-03-2017)
 */
angular.module('letsService')
  .controller('CrmLoginCtrl', function ($scope,$window,$cookies,$http,$state,$filter,$rootScope,TokenService,AdminLoginService,ForgotPasswordService,ChangePasswordService,GetPresentHourService,Idle) {

    var id = parseInt(Math.random() * 100);
    var randomIdCookies = $cookies.put('randomId',id);
    var randomIdSession = $window.sessionStorage.setItem('randomId',id);
    var lsToken = TokenService.getToken(id);

    var presentDateData;
    function getPresentDate() {
      GetPresentHourService.get(function (data) {
        console.log('present date : ',data);
        presentDateData = data.date;
      }, function (err) {
      });
    }
    getPresentDate();
    
    $scope.login = function(loginData) {
      console.log($cookies.get('randomId'));
      console.log($window.sessionStorage.getItem('randomId'));
      $rootScope.creTableData = [];
      $rootScope.showTable = false;

      $rootScope.defaultDataTypename = '';
      $rootScope.defaultStatus = '';
      $rootScope.defaultDataTypeId = '';
      $rootScope.defaultSubStatus = '';
      $rootScope.selDataTypeValue = '';
      $rootScope.defaultDataTypenameOthers = '';
      $rootScope.defaultStatusOthers = '';
      $rootScope.defaultDataTypeIdOthers = '';
      $rootScope.defaultSubStatusOthers= '';
      $rootScope.selDataTypeValueOthers = '';
      $rootScope.defaultStatusInsurance = '';
      $rootScope.defaultSubStatusInsurance = '';
      $rootScope.defaultStatusSales = '';
      $rootScope.defaultDataTypeSales = '';
      $rootScope.globalSerarchStatus = false;
      $cookies.remove('loggedInUserId');
      $cookies.remove('loggedInUserScId');
      $cookies.remove('loggedInUserRole');
      $cookies.remove('loggedInUserName');
      $cookies.remove('loggedInUserToken');
      $cookies.remove('loggedInUserSessionToken');
      $cookies.remove('loggedInUserBikeBrand');
      $cookies.remove('loggedInVersionCode');
      $cookies.remove('csvFileUploadStatus');
      $cookies.remove('insuranceAccess');

      //$cookies.remove('randomId');
      $cookies.remove('loggedInUserIdAdmin');
      $cookies.remove('loggedInUserScIdAdmin');
      $cookies.remove('loggedInUserRoleAdmin');
      $cookies.remove('loggedInUserNameAdmin');
      $cookies.remove('loggedInUserTokenAdmin');
      $cookies.remove('loggedInUserSessionTokenAdmin');
      $cookies.remove('loggedInUserBikeBrandAdmin');
      $cookies.remove('loggedInVersionCodeAdmin');
      $cookies.remove('csvFileUploadStatusAdmin');
      $cookies.remove('insuranceAccessAdmin');
      $cookies.remove('loggedInModelCode');
      //$cookies.remove('loginIpAddress');
      //$cookies.remove('loggedInScToken');
      $cookies.remove('loggedInZone');

      if($cookies.get('randomId') === $window.sessionStorage.getItem('randomId')){
        var loginIpAddress = $cookies.get('loginIpAddress'); 
        //var loginFcmToken = $cookies.get('loginFcmToken'); 
        var data = {
          username: loginData.adminUsername,
          password: loginData.adminLoginPassword,
          loginIp : loginIpAddress
        };
        console.log('login req :',JSON.stringify(data));
        AdminLoginService.save({id: id, token: lsToken},data,function(data) {
          $scope.loginData = data;
          console.log('login:',data);
          //updateFcmToken(data.loginId,loginFcmToken);
          Idle.watch();
      $rootScope.$on('IdleStart', function() {
       $("#timeOutMsgModal").modal('show');
      });
      $rootScope.$on('IdleTimeout', function() { 
      $("#timeOutMsgModal").modal('hide');
      $("#logoutMsgModalForInactive").modal('show');
      $rootScope.letsServiceLogout();
      $state.reload();
       });
        /*var expireDate = new Date(presentDateData);
        expireDate.setHours(18,8,0,0);

        console.log('++++++++++++++',expireDate);
        */
        //else {

          // Setting a cookie
          if(data.otp !== 'Yes'){
          $cookies.put('loggedInUserId', data.loginId);/*, {expires: expireDate}*/
          $cookies.put('loggedInUserScId', data.scId);
          $cookies.put('loggedInUserRole', data.role);
          $cookies.put('loggedInUserName', data.username);
          $cookies.put('loggedInUserToken', data.password_token);
          $cookies.put('loggedInUserSessionToken', data.sessionToken);
          $cookies.put('loggedInUserBikeBrand', data.bikeBrand);
          $cookies.put('loggedInVersionCode', data.version);
          $cookies.put('csvFileUploadStatus', data.autoFileUpload);
          $cookies.put('insuranceAccess', data.insuranceAccess);
          $cookies.put('loginCallingType', data.callingType);
          $cookies.put('loginMobile', data.mobile);
          $cookies.put('loggedInUserIdAdmin', data.loginId);
          $cookies.put('loggedInEmail', data.ticketingEmail);
          $cookies.put('loggedInDealerName', data.scName);
          $cookies.put('loggedInModelCode', data.modelCode);
          //$cookies.put('loggedInScToken', data.scToken);
          $cookies.put('loggedInZone', data.zone);/* {expires: expireDate}*/
         }
          $rootScope.letsServiceInitialization();
          if(data.role === 'caller') {
            $state.go('dashboard');
          } /*else if(data.role === 'support'){
             $state.go('supportView');
          }*/
          else {
          if(data.otp !== 'Yes'){
          $cookies.put('loggedInUserIdAdmin', data.loginId);/* {expires: expireDate}*/
          $cookies.put('loggedInUserScIdAdmin', data.scId);
          $cookies.put('loggedInUserRoleAdmin', data.role);
          $cookies.put('loggedInUserNameAdmin', data.username);
          $cookies.put('loggedInUserTokenAdmin', data.password_token);
          $cookies.put('loggedInUserSessionTokenAdmin', data.sessionToken);
          $cookies.put('loggedInUserBikeBrandAdmin', data.bikeBrand);
          $cookies.put('loggedInVersionCodeAdmin', data.version);
          $cookies.put('csvFileUploadStatusAdmin', data.autoFileUpload);
          $cookies.put('insuranceAccessAdmin', data.insuranceAccess);
          $cookies.put('loginOtp', data.otp);
          $cookies.put('loggedInEmail', data.ticketingEmail);
          $cookies.put('loggedInDealerName', data.scName);
          $cookies.put('loggedInModelCode', data.modelCode);
          //$cookies.put('loggedInScToken', data.scToken);
          $cookies.put('loggedInZone', data.zone);
        
             $state.go('tcAdminDashboard');
            }
          else if(data.otp === 'Yes'){
            $rootScope.signedInUserRole = '';
            $rootScope.signedInUser = '';
            $rootScope.signedInBrand = '';
            $('#confirmEmailModal').modal('show');
            }
          }
       // }
        }, function(err) {
          $scope.loginErrorMsg = err.data.message;
          console.log(err);
        });
      }
      else if($cookies.get('randomId') !== $window.sessionStorage.getItem('randomId')){
        $window.alert('Invalid User. You cannot access two login in same browser Simultaneously.!!');
        //$rootScope.letsServiceLogout();
      }
    };
   // $window.sessionStorage.clear();

    var otp;
    $scope.forgotPassword = function(forgotPasswordObj) {
      $scope.forgotPasswordObj = {};
      $scope.forgotPasswordForm.$setPristine();
      ForgotPasswordService.save({id: id, token: lsToken},forgotPasswordObj,function(data) {
        //console.log('forgot password resp:',data);
        $('#forgotPasswordModal').modal('hide');
        $("#changePasswordModal").modal('show');
        otp = data.message;
      }, function(err) {
        $scope.forgotPasswordErrorMsg = err.data.message;
        console.log(err);
      });
    };

    $scope.checkOtp = function (enteredOtp) {
      if(parseInt(otp) === parseInt(enteredOtp)){
        $scope.showPassword = true;
        $scope.invalidOtpErrorMsg = '';
      }
      else{
        $scope.invalidOtpErrorMsg = 'Invalid OTP';
      }
    };

    $scope.checkOtpForEmailConfirm = function (enteredOtp) {
      if(parseInt(otp) === parseInt(enteredOtp)){
        $scope.showPassword = false;
        $('#confirmEmailModal').modal('hide');
        $("#otpModal").modal('hide');
         /*$rootScope.signedInUser = $cookies.get('loggedInUserName');
         $rootScope.signedInUserRole = $cookies.get('loggedInUserRole');
         $rootScope.signedInBrand = $cookies.get('loggedInUserBikeBrand');
         */
          $cookies.put('loggedInUserId', $scope.loginData.loginId);
          $cookies.put('loggedInUserScId', $scope.loginData.scId);
          $cookies.put('loggedInUserRole', $scope.loginData.role);
          $cookies.put('loggedInUserName', $scope.loginData.username);
          $cookies.put('loggedInUserToken', $scope.loginData.password_token);
          $cookies.put('loggedInUserSessionToken', $scope.loginData.sessionToken);
          $cookies.put('loggedInUserBikeBrand', $scope.loginData.bikeBrand);
          $cookies.put('loggedInVersionCode', $scope.loginData.version);
          $cookies.put('csvFileUploadStatus', $scope.loginData.autoFileUpload);
          $cookies.put('insuranceAccess', $scope.loginData.insuranceAccess);
          $cookies.put('loginCallingType', $scope.loginData.callingType);
          $cookies.put('loginMobile', $scope.loginData.mobile);
          $cookies.put('loggedInEmail', $scope.loginData.ticketingEmail);
          $cookies.put('loggedInDealerName', $scope.loginData.scName);
          $cookies.put('loggedInModelCode', $scope.loginData.modelCode);
          //$cookies.put('loggedInScToken', $scope.loginData.scToken);
          $cookies.put('loggedInZone', $scope.loginData.zone);

          $cookies.put('loggedInUserIdAdmin', $scope.loginData.loginId);
          $cookies.put('loggedInUserScIdAdmin', $scope.loginData.scId);
          $cookies.put('loggedInUserRoleAdmin', $scope.loginData.role);
          $cookies.put('loggedInUserNameAdmin', $scope.loginData.username);
          $cookies.put('loggedInUserTokenAdmin', $scope.loginData.password_token);
          $cookies.put('loggedInUserSessionTokenAdmin', $scope.loginData.sessionToken);
          $cookies.put('loggedInUserBikeBrandAdmin', $scope.loginData.bikeBrand);
          $cookies.put('loggedInVersionCodeAdmin', $scope.loginData.version);
          $cookies.put('csvFileUploadStatusAdmin', $scope.loginData.autoFileUpload);
          $cookies.put('insuranceAccessAdmin', $scope.loginData.insuranceAccess);
          $rootScope.signedInUser = $cookies.get('loggedInUserName');
          $rootScope.signedInUserRole = $cookies.get('loggedInUserRole');
          $rootScope.signedInBrand = $cookies.get('loggedInUserBikeBrand');
          $state.go('tcAdminDashboard');
          $scope.invalidOtpForEmailErrorMsg = '';
      }
      else{
        $scope.invalidOtpForEmailErrorMsg = 'Invalid OTP';
      }
    };

    $scope.clearPasswordUpdateMsg = function () {
      $scope.forgotPasswordErrorMsg = '';
    };

    $scope.changePassword = function(changePasswordObj) {
      $scope.changePasswordObj = {};
      $scope.changePasswordForm.$setPristine();
      ChangePasswordService.save({id: id, token: lsToken},changePasswordObj,function(data) {
        console.log(data);
      //  $scope.changePasswordSuccessMsg = data.message;
        $scope.changePasswordSuccessMsg = ' Username : ' + data.username+  '   Password : ' + data.password;
      }, function(err) {
        $scope.changePasswordSuccessMsg = err.data.message;
        console.log(err);
      });
    };

    $scope.confirmEmail = function(confirmEmailObj) {
      $scope.confirmEmailObj = {};
      confirmEmailObj.username = $scope.loginData.username;
      $scope.confirmEmailForm.$setPristine();
      console.log(JSON.stringify(confirmEmailObj));
      ForgotPasswordService.save({id: id, token: lsToken},confirmEmailObj,function(data) {
        console.log('Confirm OTP resp:',data);
        $scope.confirmEmailErrorMsg = '';
        $('#confirmEmailModal').modal('hide');
        $("#otpModal").modal('show');
        otp = data.message;
      }, function(err) {
        $scope.confirmEmailErrorMsg = err.data.message;
        console.log(err);
      });
    };

     /*function updateFcmToken(loginId,fcmToken) {
      var fcmObj = {
           loginId: loginId,
           fcmToken: fcmToken
      }
      console.log(JSON.stringify(fcmObj));
      var lsToken = TokenService.getToken(loginId);
      UpdateFcmTokenService.save({id: loginId, token: lsToken},fcmObj,function(data) {
        console.log('Update FCM Token Resp::',data);
        }, function(err) {
        console.log('Update FCM Token Error::',err);
      });
    };*/
     

    
  });
