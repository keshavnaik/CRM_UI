'use strict';

angular.module('letsService')
  .controller('profileController', function ($scope,$window,$rootScope,$timeout,$filter,ngTableParams,$cookies,TokenService,GetCallerWiseServiceCenterService,PostServiceFeedbackService,serviceURL,TeleCallerPsfDataService,TeleCallerPerticularAppointmentDataService,TeleCallerPerticularAppointmentHistoryDataService,GetFeedbackTitleService,FeedBackDataService,TCAppointmentStatusUpdateService,TeleCallerReasonService,TeleCallingSearchService,TeleCallerWiseServiceCenterService,TeleCallingCallService,UpdateTelecallerServiceCenterService,TimeSlotSelected,AdminProfileInformation,GetScWiseTeleCallerService,ManageCallerService,CreateTeleCallerService,GetCallerService,TeleCallingSMSPackageService,TeleCallingSMSPricingService,ResetCallerCredentialsService,NotifyLicenseService) {

    /*var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var adminUserRole = $cookies.get('loggedInUserRole');*/

    var adminUserId = $cookies.get('loggedInUserIdAdmin');
    var adminUserScId = $cookies.get('loggedInUserScIdAdmin');
    var adminUserRole = $cookies.get('loggedInUserRoleAdmin');
    var loginBrandName = $cookies.get('loggedInUserBikeBrandAdmin');

function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

    function getServiceCenterTeleCallerWise() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise();

    $scope.email = [];
    $scope.branchEmail = [];
    function getAdminProfile() {
     showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      AdminProfileInformation.query({scId:adminUserScId,token:lsToken}, function(data) {
        //console.log("Admin details", data);
        showLoader(false);
        $scope.adminDetails = data[0];
        var emails= $scope.adminDetails.email;
        $scope.email = emails.split(',');
        //console.log('Email', $scope.email);
        $scope.branchDetails = data[1].braches;
        $scope.remainingCount = $scope.adminDetails.callerCount - $scope.adminDetails.activeCallers;
        //console.log("Remaining", $scope.remainingCount);

        angular.forEach($scope.branchDetails, function(val,index){
          var branchEmails = $scope.branchDetails[index].email;
          //console.log(branchEmails);
          $scope.branchEmail = branchEmails.split(',');
          //console.log('Branch Email', $scope.branchEmail);
        })

        //console.log('adminDetails : ',$scope.adminDetails);
        //console.log('branch details', $scope.branchDetails);
      }, function(err) {
         showLoader(false);
        $scope.psfStatsErrorMsg = err.data.message;
        console.log("Error", err);
      });
    }
    getAdminProfile();

    $scope.selectedCaller;
    function getScWiseCallerList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        //$scope.callerList = data;
        $scope.saasCaller = data;
        //console.log("Caller list", $scope.callerList);
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }
    getScWiseCallerList();

    // function getCaller() {
    //   var lsToken = TokenService.getToken(adminUserScId);
    //   GetCallerService.query({scId:adminUserScId,token:lsToken}, function (data) {
    //     $scope.saasCaller = data;
    //     console.log('saasCaller', $scope.saasCaller);
    //   }, function (err) {
    //     console.log(err);
    //   });
    // }
    // getCaller();

    $scope.currentStatus;
    var defaultCallerObj = [];
    var defaultSelectedCaller;
    $scope.editingCallerId;
    $scope.getCallerCredentialsByName = function (saasCaller,selectedCaller) {
      console.log('selectedCaller',selectedCaller);
      defaultSelectedCaller = selectedCaller;
      defaultCallerObj = saasCaller;
      angular.forEach(saasCaller,function (val,index) {
        if(saasCaller[index].username === selectedCaller){
          $scope.currentStatus = saasCaller[index].status;
          $scope.editingCallerId = saasCaller[index].loginId;
        }
      });
      $('editingCallerId').show();
      console.log('selectedCallerStatus', $scope.currentStatus);
    };

    $scope.getCallerCredentialsByName($scope.callerList,$scope.selectedCaller);

    $scope.createTeleCaller = function (callerData) {
      $scope.callerCreateMsg = '';
      $scope.callerCreateErrorMsg ='';
      var lsToken = TokenService.getToken(adminUserScId);
      var serviceCenters = [];
      var selectedServiceCenters = callerData.selectedServiceCenter;
      for(var count=0;count < selectedServiceCenters.length;count++){
        serviceCenters.push(selectedServiceCenters[count]);
      }
      var callData = {
        username: callerData.username,
        password: callerData.password,
        mobile: callerData.mobile,
        role: adminUserRole,
        adminId: adminUserId,
        branchIds:serviceCenters.toString(),
        scId: adminUserScId,
        bikeBrand : loginBrandName
      };
      console.log(callData);
      $scope.createTellecaller = {};
      $scope.createTelecallerForm.$setPristine();
      $scope.callerCreateMsg = false;
      CreateTeleCallerService.save({id:adminUserScId,token:lsToken}, callData, function (data) {
        $scope.callerCreateMessageAlert = false;
        $scope.callerCreateErrorMessageAlert = false;
        console.log(data);
        $scope.callerCreateMsg = ' Username : ' + data.Username+  '   Password : ' + data.Password;
        $scope.callerCreateErrorMsg = '';
        $timeout(function() {
          $('#createCaller').modal('hide');
        }, 4000);
        //getCaller();
        getScWiseCallerList();
      }, function (err) {
        console.log(err);
        $scope.callerCreateErrorMsg = err.data.message;
        $timeout(function() {
          $scope.callerCreateErrorMessageAlert = true;
        }, 3000);
      });
    };

    var selectedStatus; 
    // $scope.newCurrentStatus = selectedStatus;
    // console.log('newCurrentStatus', $scope.newCurrentStatus);
    var selectedLoginId;
    $scope.updateCallerStatus = function (saasCaller,selectedCaller) {
      angular.forEach(saasCaller, function (val,index) {
        if(saasCaller[index].username === selectedCaller){
            selectedLoginId = saasCaller[index].loginId;
            selectedStatus =  saasCaller[index].status;
        }
      });
      // console.log('newCurrentStatus', $scope.newCurrentStatus);
      console.log('selectedLoginId', selectedLoginId);
      console.log('selectedStatus',selectedStatus);
      console.log('Login', selectedCaller);
      var updateStatus, updateStatusMsg;
      if(selectedStatus === 'active') {
        updateStatus = 'inactive';
        updateStatusMsg = 'Are you sure you want to deactivate caller ' + selectedCaller;
      } else if (selectedStatus === 'inactive') {
        updateStatus = 'active';
        updateStatusMsg = 'Are you sure you want to activate caller ' + selectedCaller;
      } else {
      }
      var confirmUpdation = $window.confirm(updateStatusMsg);
      if(confirmUpdation) {
        var callerData = {
          status: updateStatus,
          callerId: selectedLoginId,
          adminId: adminUserId,
          scId: adminUserScId
        };
        var id = parseInt(Math.random() * 100);
        var lsToken = TokenService.getToken(id);
        ManageCallerService.save({id:id,token:lsToken}, callerData, function (data) {
          //getCaller();
          getScWiseCallerList();
          $window.alert(data.message);
          $scope.currentStatus = '';

          getAdminProfile();

          //$scope.getCallerCredentialsByName(defaultCallerObj,defaultSelectedCaller);
          //getCaller();
        }, function (err) {
          console.log(err);
        });
      }
    };


    function getSmsPackages() {
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallingSMSPackageService.query({scId:adminUserScId,token:lsToken},function (data) {
        $scope.smsPackages = data;
       // console.log('smsPackages',data);
      }, function (err) {
        $scope.smsPackagesErrorMsg = err.data.message;
      });
    };
    getSmsPackages();

    function getSMSPriceAndCount(smsCount) {
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallingSMSPricingService.get({smsCount:smsCount,scId:adminUserScId,token:lsToken},function (data) {
        $scope.smsPricing = data;
        //console.log('smsPricing',data);
      }, function (err) {
        $scope.smsPricingErrorMsg = err.data.message;
      });
    };

    var smsCountMore;

    $scope.getSmsPricing = function(smsCount) {
      if(smsCount !== '>10000'){
        getSMSPriceAndCount(smsCount);
      }
      $scope.smsPricing = [];
      /* console.log('test', $scope.smsPricing);*/
    };

    $scope.getSmsPricingMore = function(smsCount) {
      if(smsCount <10001){
        $scope.smsMsg = 'Enter more than 10000';
      }
      else if (smsCount >10000) {
        $scope.smsMsg = '';
        smsCountMore = smsCount;
        getSMSPriceAndCount(smsCount);
      }

    };

    $scope.paySms = function(paySmsData) {
      if(paySmsData === '>10000'){
        paySmsData = smsCountMore;
      }
      var adminUserScId = $cookies.get('loggedInUserScId');
      $window.open(serviceURL+'templates/paytm/paytmTransaction.php?letsservice&smsCount='+paySmsData+'&customerId='+adminUserScId);
    };

    $scope.changeCredentials = function(editCallerData){
      $scope.editCallerMsg = '';
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      var callerCredentials = {
        userName : editCallerData.username,
        password : editCallerData.password,
        scId : adminUserScId,
        callerId : $scope.editingCallerId
      };
      console.log('Caller Credentials',JSON.stringify(callerCredentials));

      ResetCallerCredentialsService.save({scId:adminUserScId, token:lsToken},callerCredentials,function (data){
        console.log(data);
        $scope.editCallerMsg = data.message;
        //getCaller();
        getScWiseCallerList();
        $timeout(function() {
          $('#editCaller').modal('hide');
        }, 2000);
      },
      function(err){
        console.log('Error in updating',err);
        $scope.editCallerMsg = 'Caller is Already Exist!';
      });
    };

    var buyLicenseMessage = 'Are you sure to buy the license?';
   var renewValidityMessage = 'Are you sure to renew the Validity?';
   var confiramtionMessage;
   $scope.buyLicenseNow = function(keyword){
     if (keyword === 'buyLicenceNow'){
       confiramtionMessage = $window.confirm(buyLicenseMessage);
     } else {
       confiramtionMessage = $window.confirm(renewValidityMessage);
     }
     if(confiramtionMessage === true) {
     var adminUserScId = $cookies.get('loggedInUserScId');
     var lsToken = TokenService.getToken(adminUserScId);
     
     NotifyLicenseService.get({scId:adminUserScId, status:keyword, token:lsToken}, function(data){
     //console.log('License response',data.message);
     $window.alert(data.message);
     }, function(err){
     console.log('Error in requesting license',err);
     });
   } else {
     console.log('Cancelled');
   }
   };

$scope.clearEditModel = function(){
     $scope.editCallerMsg = '';
     $scope.editTeleCaller = '';
   }

$('#showHideCaller').show()
  });
