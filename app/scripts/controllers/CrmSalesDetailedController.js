'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK
 * Controller of the testApp
 * Controller of the testApp
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('CrmSalesDetailedController', function ($scope,$cookies,$route,$filter,$state,$location,ngTableParams,$rootScope,$window,$http,serviceURL,TokenService,AdminLoginService,TeleCallerStatusService,TeleCallerDataTypeService,TeleCallerDateWiseDataService,TeleCallerStatsDataService,GetPerticularInsuranceDetailsService,GetInsuranceHistoryService,ServiceTypeService,AssistanceTypeService,TeleCallerReasonService,ScComplaintSubStatusService,TCInsuranceStatusUpdateService,TeleCallingSearchService,GetFeedbackTitleService,SalesFeedBackDataService,TeleCallingCallService,GetCallerWiseServiceCenterService,CallingPendingStatsService,CallingPendingStatsDetailsService,UpdateTelecallerServiceCenterService,UpdatePickupAndDropService,PickupAndDropTokenService,PickupAndDropAssistanceAmountService,GetLatLngService,GetSCLocationBrandService,CheckAMCUserService,PickupAndDropSlotService,$stateParams,$interval,$timeout,TeleCallerWiseServiceCenterService,SendSMSService,TimeSlotSelected,UpdateCustomerPhoneService,GetPresentHourService,GetPerticularSalesDataService,UpdateSalesDataService,GetSalesHistoryService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');

    var loginMobile = $cookies.get('loginMobile');
    var loginCallingType = $cookies.get('loginCallingType');

    var customerMobileForFeedback; 
    var customerBranchIdForFeedback;  
    var customerIdForFeedback;
    var apptIdForFeedback;
    var lastCalledStatusForFeedback;
    var selectedApptId = $stateParams.apptId;
    var nextAppointmentId;

    angular.forEach($rootScope.apptIdListSales, function (val,index) {
      if(selectedApptId === $rootScope.apptIdListSales[index]){
        nextAppointmentId = $rootScope.apptIdListSales[index+1];
      }
    });

    var selectedataTypeId = $stateParams.dataTypeId;
    console.log('selectedataTypeId',selectedataTypeId);
    console.log('apptId',selectedApptId);

    var presentDateData;
    function getPresentDate() {
      GetPresentHourService.get(function (data) {
        console.log('present date : ',data);
        presentDateData = data.date;
      }, function (err) {
      });
    }
    getPresentDate();

    $scope.openCalendarStatus = function(e) {
      //$scope.minDate = new Date();
      //getPresentDate();
      $scope.minDate = new Date(presentDateData);
      e.preventDefault();
      e.stopPropagation();
      $scope.isOpenFromStatus = true;
    };


    $scope.teleCallingStatusForUpdate = [{'id': 2, 'description': 'Call Later'},
    {'id': 1, 'description': 'Walkin'},
      {'id': 3, 'description': 'Not Interested'},{'id': 4, 'description': 'Service Done'}
      ,{'id': 5, 'description': 'Feedback'}];

    if(adminUserScId ==='1'){
      if($scope.teleCallingStatusForUpdate){
        for(var count=0;count < $scope.teleCallingStatusForUpdate.length;count++){
          if($scope.teleCallingStatusForUpdate[count].description === 'Not Interested'){
            $scope.teleCallingStatusForUpdate[count].description = 'Others';
          }
        }
      }
    }

    var serviceCenterListForServiceDoneStatus = {};
    $scope.serviceCenterListForServiceDone = {};
    function getServiceCenterServiceDoneStatus() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        serviceCenterListForServiceDoneStatus = data;
        serviceCenterListForServiceDoneStatus.push({scName:'Others'});
        $scope.serviceCenterListForServiceDone = serviceCenterListForServiceDoneStatus;
        console.log('service center for service done',$scope.serviceCenterListForServiceDone);
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }


    function getServiceCenterList() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        console.log('serviceCenter :',data);
        $scope.serviceCenterToUpdate = data;
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterList();


    $scope.customerMobileNumbers = [];
    var customerMobileNumbers = [];
    var selectedDataTypeForHistory = selectedataTypeId;
    var scOpdId;
    var nextApptId;
    function getAppointmentDetails(apptId) {
      showLoader(true);
      $scope.customerMobileNumbers = [];
      nextApptId = '';
      var lsToken = TokenService.getToken(adminUserScId);
      GetPerticularSalesDataService.query({apptId:apptId,scId:adminUserScId,token:lsToken}, function (data) {
        console.log('Sales data in detailed page',data[0]);
        $scope.callType = selectedataTypeId;
      //  console.log(data);
        $scope.tcAppointmentData = data[0];
        customerMobileNumbers = $scope.tcAppointmentData.mobile;

       for(var i=0;i<customerMobileNumbers.length;i++){
           if(customerMobileNumbers[i].customer_mobile === $scope.tcAppointmentData.customer_mobile){
            customerMobileNumbers[i].customer_mobile = customerMobileNumbers[i].customer_mobile+'*';
            $scope.currentMobile = customerMobileNumbers[i].customer_mobile;
           }
          $scope.customerMobileNumbers.push(customerMobileNumbers[i]);
        }
        console.log('$scope.currentMobile',$scope.currentMobile);
        //$scope.getCustomerNameByPhone($scope.customerMobileNumbers,$scope.currentMobile);

        scOpdId = $scope.tcAppointmentData.opdId;
        $scope.opdIdForPickAndDrop = scOpdId;
        if($scope.tcAppointmentData.customer_address === undefined || $scope.tcAppointmentData.customer_address === null || $scope.tcAppointmentData.customer_address === ''){
          $scope.tcAppointmentData.customer_address= '- -';
        }
        if($scope.tcAppointmentData.chassisNo === undefined || $scope.tcAppointmentData.chassisNo === null || $scope.tcAppointmentData.chassisNo === ''){
          $scope.tcAppointmentData.chassisNo= '- -';
        }
        if($scope.tcAppointmentData.bikeBrand === undefined || $scope.tcAppointmentData.bikeBrand === null || $scope.tcAppointmentData.bikeBrand === ''){
          $scope.tcAppointmentData.bikeBrand= '- -';
        }
        if($scope.tcAppointmentData.lastServiceType === undefined || $scope.tcAppointmentData.lastServiceType === null || $scope.tcAppointmentData.lastServiceType === ''){
          $scope.tcAppointmentData.lastServiceType= '- -';
        }
        if($scope.tcAppointmentData.branchName === undefined || $scope.tcAppointmentData.branchName === null || $scope.tcAppointmentData.branchName === ''){
          $scope.tcAppointmentData.branchName= '- -';
        }
        if($scope.tcAppointmentData.bikeNo === undefined || $scope.tcAppointmentData.bikeNo === null || $scope.tcAppointmentData.bikeNo === ''){
          $scope.tcAppointmentData.bikeNo= '- -';
        }
        if($scope.tcAppointmentData.bikeModel === undefined || $scope.tcAppointmentData.bikeModel === null || $scope.tcAppointmentData.bikeModel === ''){
          $scope.tcAppointmentData.bikeModel= '- -';
        }
        if($scope.tcAppointmentData.bikeType === undefined || $scope.tcAppointmentData.bikeType === null || $scope.tcAppointmentData.bikeType === ''){
          $scope.tcAppointmentData.bikeType= '- -';
        }
        if($scope.tcAppointmentData.dateOfSale === undefined || $scope.tcAppointmentData.dateOfSale === null || $scope.tcAppointmentData.dateOfSale === '' || $scope.tcAppointmentData.dateOfSale === '0000-00-00 00:00:00'){
          $scope.tcAppointmentData.dateOfSale= '- -';
        }
        if($scope.tcAppointmentData.serviceDueDate === undefined || $scope.tcAppointmentData.serviceDueDate === null || $scope.tcAppointmentData.serviceDueDate === ''|| $scope.tcAppointmentData.serviceDueDate === '0000-00-00 00:00:00'){
          $scope.tcAppointmentData.serviceDueDate= '- -';
        }
        if($scope.tcAppointmentData.serviceDueType === undefined || $scope.tcAppointmentData.serviceDueType === null || $scope.tcAppointmentData.serviceDueType === ''){
          $scope.tcAppointmentData.serviceDueType= '- -';
        }
        if($scope.tcAppointmentData.lastServiceDate === undefined || $scope.tcAppointmentData.lastServiceDate === null || $scope.tcAppointmentData.lastServiceDate === '' || $scope.tcAppointmentData.lastServiceDate === '0000-00-00 00:00:00'){
          $scope.tcAppointmentData.lastServiceDate= '- -';
        }
        if($scope.tcAppointmentData.serviceAvailedAt === undefined || $scope.tcAppointmentData.serviceAvailedAt === null || $scope.tcAppointmentData.serviceAvailedAt === ''){
          $scope.tcAppointmentData.serviceAvailedAt= '- -';
        }
        showLoader(false);
      }, function (err) {
        $scope.tcAppointmentDataErrorMsg = err.data.message;
        $window.alert('Selected data list is completed. Redirecting to Dashboard !!!');
        $state.go('sales');
        showLoader(false);
      });
    }

    $scope.getCustomerNameByPhone = function (mobileObj,currentMobile) {
      console.log(currentMobile);
      angular.forEach(mobileObj,function (val,index) {
        if(mobileObj[index].customer_mobile === currentMobile){
          $scope.tcAppointmentDataDisplay = {customer_name: mobileObj[index].customer_name};
        }
      });
    };


    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }
    getAppointmentDetails(selectedApptId);

    function getSalesAppointmentHistoryData(chassisNo) {
      var lsToken = TokenService.getToken(adminUserScId);
      GetSalesHistoryService.query({chassisNo:chassisNo,scId:adminUserScId,token:lsToken},function (data) {
       console.log('Sales history data :',data);
        $scope.tcAppointmentHistoryData = data;
      }, function (err) {
        console.log('Sales history error data',err);
        $scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
      });
    }

    var selectedStausToUpdate;
    $scope.updateTeleCallingStatus = function(status,selectedTeleCallingData) {
       console.log(status);
       console.log(selectedTeleCallingData);
      $scope.tcStatusUpdateMsg = '';
      selectedStausToUpdate = status;
      if(adminUserScId === '1'){
        if(status === 'Others'){
          status = 'Not Interested';
        }
      }
     if(status === 'Aniversary Yes'){
        updateAnniversaryYes(selectedTeleCallingData);
      }
      $scope.reasonDescriptionForSales = [];
      customerIdForFeedback = selectedTeleCallingData.customerId;
      customerMobileForFeedback = selectedTeleCallingData.customer_mobile.substr(0,10);
      customerBranchIdForFeedback  = selectedTeleCallingData.branchId;
      apptIdForFeedback = selectedTeleCallingData.apptId;
      lastCalledStatusForFeedback = selectedTeleCallingData.lastCalledStatus;
      getStatusReason(status);
      $scope.updateMsg = '';
      $scope.walkinStatus = {};
      $scope.updateTeleCallingAppointmentStatus = selectedTeleCallingData;
      $scope.selectedStatus = status;
      if(status === 'Feedback'){
          getFeedBackTileList();
        }
        if(status === 'Service Done'){
          getServiceCenterServiceDoneStatus();
        }
    };

    var serviceDoneSubStatus;
    $scope.updateServiceDoneStatus = function(serviceDoneOption) {
      serviceDoneSubStatus = serviceDoneOption;
      if(serviceDoneOption === 'Others'){
        $scope.serviceDoneForm.$invalid = true;
      }
    };

    $scope.reasonDescriptionForSales = [];
    function getStatusReason(statusData) {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerReasonService.query({status:statusData,id:adminUserScId,token:lsToken},function(data) {
        $scope.reasonDescription = data;
        angular.forEach(data,function(val,index){
          if(data[index].apptSubStatus !== 'Service Center Complaint'){
            $scope.reasonDescriptionForSales.push({'apptSubStatus':data[index].apptSubStatus,'slNo':data[index].slNo});
          }
        });
      }, function(err) {
        console.log(err);
      });
    }

$scope.yesNoCheck = function(status){
  if(status === 'Yes'){
    $scope.yesNoStatus = 'Yes';
  } else if(status === 'No'){
    $scope.yesNoStatus = 'No';
  } 
}
function updateAnniversaryYes(updateTeleCallingAppointmentStatus){
 console.log(updateTeleCallingAppointmentStatus);
 /*$scope.tcStatusUpdateMsg = {msg:'Updated Successfully..!',nextApptMsg:'Updating to Next Appointment Details'};
 $('#teleCallingStatusUpdateModal').modal('show');
 $timeout( function() { getNextAppointment(nextAppointmentId,selectedataTypeId);}, 3000);
 */   
  var teleCallerUpdateDataStatus = {
          customerId: updateTeleCallingAppointmentStatus.customerId,
          customerName: updateTeleCallingAppointmentStatus.customer_name,
          status: 'connected',
          appointmentDateTime: '',
          subStatus: 'Yes',
          scId: adminUserScId,
          scName: updateTeleCallingAppointmentStatus.scName,
          customerMobile: updateTeleCallingAppointmentStatus.customer_mobile.substr(0,10),
          apptId:updateTeleCallingAppointmentStatus.apptId,
          callerId:adminUserId,
           branchId:updateTeleCallingAppointmentStatus.branchId,
           remarksForSubStatus: '',
           appointTime:'',
           lastCalledStatus : updateTeleCallingAppointmentStatus.lastCalledStatus,
           chassisNo : updateTeleCallingAppointmentStatus.chassisNo,
           dataType : selectedataTypeId,
           confirmStatus : ''
        };
      console.log(JSON.stringify(teleCallerUpdateDataStatus));
      updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
}

   $scope.skipAppointment = function(){
     getNextAppointment(nextAppointmentId,selectedataTypeId);
   }
    function getNextAppointment(apptId,dataTypeId) {
        $state.go('salesDetailed', {apptId:apptId,dataTypeId:dataTypeId},{reload: true});
     }



    getServiceCenterComplaintSubReason();
    var opdId;
    function updateTeleCallingDataStatus(teleCallerUpdateDataStatus) {
      $scope.tcStatusUpdateMsg = '';
      console.log('request1...',teleCallerUpdateDataStatus);
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateSalesDataService.save({id:adminUserScId,token:lsToken},teleCallerUpdateDataStatus,function(data) {
        console.log('1st resp',data);
        $scope.walkinConfirmStaus = false;
        opdId = data.opdId;
        console.log('opdID : ',opdId);
        if(teleCallerUpdateDataStatus.status === 'connected'){
          $scope.tcStatusUpdateMsg = {msg:data.message,nextApptMsg:'Updating to Next Appointment Details'};
          $('#teleCallingStatusUpdateModal').modal('show');
          $timeout( function() { getNextAppointment(nextAppointmentId,selectedataTypeId);}, 3000);
        }
        $scope.tcStatusUpdateMsg = {msg:data.message,nextApptMsg:'Updating to Next Appointment Details'};
        $timeout( function() {$('#teleCallingStatusUpdateModal').modal('hide');}, 2000);
        $timeout( function() { getNextAppointment(nextAppointmentId,selectedataTypeId);}, 3000);
       }, function(err) {
        $window.alert(err.data.message);
        console.log(err);
      });
    }
    $scope.clearUpdateMsg = function () {
      $scope.tcStatusUpdateMsg = '';
    };

     $scope.feedbackTitleList = [];
    function  getFeedBackTileList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetFeedbackTitleService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.feedbackTitleList = [];
            console.log('feedback question list :',data);
            angular.forEach(data, function(val) {
              var feedbackData = {description:val.description,feedBackListId:val.feedBackListId,feedBackType:val.feedBackType,questionType:val.questionType,feedBackStatus:'',feedBackRemarks:'',rating:'',loginId:adminUserId,scId:adminUserScId,customerId:customerIdForFeedback,mobile:customerMobileForFeedback,branchId:customerBranchIdForFeedback,apptId:apptIdForFeedback,lastCalledStatus: lastCalledStatusForFeedback};
               if(val.feedBackType === 'sales'){
                 $scope.feedbackTitleList.push(feedbackData);
              }
            });
       // console.log('feedback',data);
      }, function (err) {
        //console.log(err);
      });
    }

        $scope.noFeedbackMsg = 'Contact Admin for adding Feedback Questions.';
        $scope.feedBackObject = {};
        $scope.feedBackRemarksObject = {};
        $scope.updateUserFeedBack = function (feedbackData,feedbackRemarksData,apptData) {
          sendFeedBackData($scope.feedbackTitleList,apptData);
        };

        function sendFeedBackData(feedBackRequest,apptData) {
          $scope.tcStatusUpdateMsg = '';
          console.log(JSON.stringify(feedBackRequest));
          var lsToken = TokenService.getToken(adminUserScId);
          SalesFeedBackDataService.save({id:adminUserScId,token:lsToken},feedBackRequest, function(data) {
            console.log('Feedback Post :',data);
             $scope.noFeedbackMsg = '';
            $scope.tcStatusUpdateMsg = {msg:data.message,nextApptMsg:'Updating to Next Appointment Details'};
            $timeout( function() { getNextAppointment(nextAppointmentId,selectedataTypeId);}, 2000);
          }, function (err) {
            console.log(err);
          });
        }
    

    var updatedDate;
    var updatedTime;
    $scope.checkDatesByReason = function (selectedReason,selDate) {
      console.log(selectedReason);
       if (selectedStausToUpdate === 'Call Later') {
      if( $scope.walkinStatus.remarks !== 'Customer will call and Confirm' && $scope.walkinStatus.remarks !== 'Out of Station' && $scope.walkinStatus.remarks !== 'Customer Busy'){
        $scope.walkinCallLaterForm.$invalid = false;
        if( selectedReason === null || selectedReason === undefined){
        $scope.walkinCallLaterForm.$invalid = true;
        }
      }
      if( selectedReason === 'Customer will call and Confirm' || selectedReason === 'Out of Station' || selectedReason === 'Customer Busy'){
         $scope.walkinStatus.selectedDate = '';
         $scope.walkinStatus.timeValue = '';
      }
    }

      var myDate = $filter('date')(new Date(), 'yyyy-MM-dd');
      if (selectedStausToUpdate === 'Call Later') {
        if ((selectedReason === 'Phone out of Reach' || selectedReason === 'Switched off' || selectedReason === 'No response to call' || selectedReason === 'Disconnecting the call') && $filter('date')(selDate, 'yyyy-MM-dd') === myDate) {
          var currentDay = new Date();
          var nextDay = new Date(currentDay);
          nextDay.setDate(currentDay.getDate()+1);
          updatedDate = nextDay;
          $scope.walkinStatus = {
            selectedDate : updatedDate,
            timeValue : updatedTime,
            remarks : selectedReason
          };
          if(nextDay.getDay() === 0){
            var secondNextDay = new Date(currentDay);
            secondNextDay.setDate(currentDay.getDate()+2);
            updatedDate = secondNextDay;
            $scope.walkinStatus = {
              selectedDate : updatedDate,
              timeValue : updatedTime,
              remarks : selectedReason
            };
          }
          $window.alert('Appointment will be scheduled for ' +updatedDate+ ' as you have selected ' +selectedReason);
        }
      }
    };

    var teleCallerUpdateDataStatus = {};
    var assistanceAmount;
    $scope.updateAppointmentStatus = function(appointmentStatus,updateTeleCallingAppointmentStatus,appointmentStatusData) {
      console.log('obj::::',updateTeleCallingAppointmentStatus);
      console.log('BRANCH ID::::',updateTeleCallingAppointmentStatus.branchId);
      if(appointmentStatus === 'Not Interested') {
         teleCallerUpdateDataStatus = {
          customerId: updateTeleCallingAppointmentStatus.customerId,
          customerName: updateTeleCallingAppointmentStatus.customer_name,
          status: appointmentStatus,
         // statusForSubStatus: appointmentStatusData.scComplaintRemarks,
           statusForSubStatus : serviceCenterComplaints,
          subStatus: appointmentStatusData.remarks,
          scId: adminUserScId,
          scName: updateTeleCallingAppointmentStatus.scName,
          customerMobile: updateTeleCallingAppointmentStatus.customer_mobile.substr(0,10),
          apptId:updateTeleCallingAppointmentStatus.apptId,
          callerId:adminUserId,
           remarksForSubStatus: appointmentStatusData.scComplaintManualRemarks,
           branchId:updateTeleCallingAppointmentStatus.branchId,
           area :appointmentStatusData.area,
           lastCalledStatus : updateTeleCallingAppointmentStatus.lastCalledStatus,
           chassisNo : updateTeleCallingAppointmentStatus.chassisNo,
           dataType : selectedataTypeId
        };
         console.log(JSON.stringify(teleCallerUpdateDataStatus));
        $scope.notInterestedStatus = {};
        $scope.notInterestedForm.$setPristine();

        updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
       // console.log(teleCallerUpdateDataStatus);
        //console.log(JSON.stringify(teleCallerUpdateDataStatus));
      }
      else if(appointmentStatus === 'Service Done') {
         teleCallerUpdateDataStatus = {
           customerId: updateTeleCallingAppointmentStatus.customerId,
           customerName: updateTeleCallingAppointmentStatus.customer_name,
           status: appointmentStatus,
           //statusForSubStatus: serviceDoneSubStatus,
           subStatus: serviceDoneSubStatus,
           scId: adminUserScId,
           scName: updateTeleCallingAppointmentStatus.scName,
           customerMobile: updateTeleCallingAppointmentStatus.customer_mobile.substr(0,10),
           apptId:updateTeleCallingAppointmentStatus.apptId,
           callerId:adminUserId,
           remarksForSubStatus: $scope.serviceDoneStatus.scComplaintManualRemarks,
           branchId:updateTeleCallingAppointmentStatus.branchId,
           lastCalledStatus : updateTeleCallingAppointmentStatus.apptStatus,
           dataType : selectedataTypeId
         };
        console.log(JSON.stringify(teleCallerUpdateDataStatus));
         $scope.serviceDoneStatus = {};
         $scope.serviceDoneForm.$setPristine();
         updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
         // console.log(teleCallerUpdateDataStatus);
       }
      else {
         teleCallerUpdateDataStatus = {
          customerId: updateTeleCallingAppointmentStatus.customerId,
          customerName: updateTeleCallingAppointmentStatus.customer_name,
          status: appointmentStatus,
          appointmentDateTime: appointmentStatusData.selectedDate,
          subStatus: appointmentStatusData.remarks,
          scId: adminUserScId,
          scName: updateTeleCallingAppointmentStatus.scName,
          customerMobile: updateTeleCallingAppointmentStatus.customer_mobile.substr(0,10),
          apptId:updateTeleCallingAppointmentStatus.apptId,
          callerId:adminUserId,
           branchId:updateTeleCallingAppointmentStatus.branchId,
           remarksForSubStatus: appointmentStatusData.manualRemarks,
           appointTime:appointmentStatusData.timeValue,
           lastCalledStatus : updateTeleCallingAppointmentStatus.lastCalledStatus,
           chassisNo : updateTeleCallingAppointmentStatus.chassisNo,
           dataType : selectedataTypeId
        };
        console.log('selected time is',teleCallerUpdateDataStatus.appointTime);
        console.log(JSON.stringify(teleCallerUpdateDataStatus));
        $scope.walkinStatus = {};
        $scope.walkinCallLaterForm.$setPristine();
        $scope.notInterestedStatus = {};
        $scope.notInterestedForm.$setPristine();
      updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
      }
    };

    $scope.callTeleCallingCustomer = function (teleCallingData,mobile) {
      console.log(mobile);
      var lsToken = TokenService.getToken(adminUserScId);
      var callData = {
        customerName: teleCallingData.customer_name,
        customerMobile: mobile,
        customerId: teleCallingData.customerId,
        apptId: teleCallingData.apptId,
        callerId:adminUserId,
        scId: adminUserScId,
        dataType : 'Sales Anniversary',
        callerMobile: loginMobile,
        callingType: loginCallingType
      };
      console.log(JSON.stringify(callData));
      TeleCallingCallService.save({id:adminUserScId,token:lsToken}, callData, function (data) {
        console.log('calling resp:',data);
        $window.alert(data.message);
      }, function (err) {
        //console.log('calling resp error:',err);
        $window.alert(err.data.error);
        console.log(err);
      });
    };

    $scope.updateServiceCenter = function(apptId,oldScId,newScId) {
        var lsToken = TokenService.getToken(adminUserScId);
        var updateData = {
          old_scId: oldScId,
          new_scId: newScId,
          apptId: apptId,
          callerId:adminUserId,
          scId: adminUserScId
        };
        console.log(JSON.stringify(updateData));
        UpdateTelecallerServiceCenterService.save({id:adminUserScId,token:lsToken}, updateData, function (data) {
          //$window.alert(data.message);
          $scope.updateServiceCenterSuccessMsg = data.message;
          getAppointmentDetails(selectedApptId);
          $timeout(function() {
            $('#updateServiceCenterModal').modal('hide');
          }, 3000);
          $scope.serviceCenterObj = {};
          $scope.updateServiceCenterForm.$setPristine();
        }, function (err) {
          console.log(err);
          $scope.updateServiceCenterErrorMsg = err.data.message;
        });
    };


    $scope.addRefferelCustomer = function(referelObj) {
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(referelObj));
      UpdateTelecallerServiceCenterService.save({id:adminUserScId,token:lsToken}, referelObj, function (data) {
        //$window.alert(data.message);
        $scope.addReferelSuccessMsg = data.message;
        getAppointmentDetails(selectedApptId);
        $timeout(function() {
          $('#updateServiceCenterModal').modal('hide');
        }, 3000);
        $scope.referelObj = {};
        $scope.addRefferelForm.$setPristine();
      }, function (err) {
        console.log(err);
        $scope.addReferelErrorMsg = err.data.message;
      });
    };


    function resetForm(msg) {
      $window.alert(msg);
      $scope.scSMS = {};
      $scope.sendSMSForm.$setPristine();
    }

    $scope.sendSCSMS = function (smsData,mobile) {
      $scope.loading = true;
      var sendSMSData = {
        scId: $cookies.get('loggedInUserScId'),
        logInId: $cookies.get('loggedInUserId'),
        mobileNumber: mobile,
        message: smsData.message,
        charCount: smsData.message.length
      };
      console.log(JSON.stringify(sendSMSData));
      var id = parseInt(Math.random() * 100);
      var lsToken = TokenService.getToken(id);
      SendSMSService.save({id:id,token:lsToken}, sendSMSData, function (data) {
        console.log(data);
        resetForm(data.message);
        //getSCSMSStats();
        $scope.loading = false;
      }, function (err) {
        console.log(err);
        resetForm(err.data.message);
        $scope.loading = false;
      });
    };


    $scope.clearPhoneUpdateMsg = function(){
      $scope.editPhoneSuccessMsg = '';
    };
    $scope.clearServiceCenterUpdateMsg = function(){
      $scope.updateServiceCenterSuccessMsg = '';
    };
    $scope.clearReferenceSuccessMsg = function(){
      $scope.addReferelSuccessMsg = '';
    };

    $scope.editPhoneNumber = function(selMobile,apptObj,defaultNumStatus,selectedMobileStatus){
      console.log('selMobile',selMobile);
      $scope.editPhoneSuccessMsg = '';
       var editPhoneObj = {
        mobile: selMobile,
        customerName: apptObj.customer_name,
        chassisNo : apptObj.chassisNo,
        scId : adminUserScId,
        defaultNumber:defaultNumStatus,
        customerId : apptObj.customerId,
        customerStatus : selectedMobileStatus,
        dataType :'Sales'
      };
      console.log(JSON.stringify(editPhoneObj));
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateCustomerPhoneService.save({id:adminUserScId,token:lsToken}, editPhoneObj, function (data) {
        console.log(data);
        $scope.editPhoneSuccessMsg = data.message;
        //getAppointmentDetails(selectedApptId);
        $timeout(function() {
          $('#editPhoneModal').modal('hide');
          $("#activeDeactivePhoneModal").modal('hide');
          getAppointmentDetails(selectedApptId);
        }, 2000);
        $scope.phoneObj = {};
        $scope.editPhoneForm.$setPristine();
        }, function (err) {
        console.log(err);
        $scope.editPhoneErrorMsg = err.data.message;
      });
    };

    var selectedDateToUpdate;
    $scope.getSelectedDate = function (selDate) {
      var filteredSelectedDate = selDate.getFullYear() + '-' + ('0' + (selDate.getMonth() + 1)).slice(-2) + '-' + ('0' + selDate.getDate()).slice(-2);
      selectedDateToUpdate = filteredSelectedDate;
      console.log(selectedDateToUpdate);
      getPresentHour();
      $scope.timeSlot = [];
    };

    $scope.actualTimeSlot = TimeSlotSelected.getTime();
    $scope.timeSlot = [];
    var presentHourData;
    function getPresentHour() {
      GetPresentHourService.get(function (data) {
         console.log('present date : ',data);
        presentHourData = data.hour;
        if(selectedDateToUpdate === data.date){
          angular.forEach($scope.actualTimeSlot, function (val,index) {
            if($scope.actualTimeSlot[index].value > parseInt(presentHourData)){
              $scope.timeSlot.push({'timeSelect': $scope.actualTimeSlot[index].timeSelect,'value' : $scope.actualTimeSlot[index].value});
            }
          });
        }
        else if(selectedDateToUpdate !== data.date){
          $scope.timeSlot = $scope.actualTimeSlot;
        }
      }, function (err) {
      });
    }

    $scope.getSelectedReason = function (reason) {
      console.log(reason);
    };

    $scope.serviceCenterComplaintData = [];
    $scope.serviceCenterComplaintSettings = {displayProp: 'label'};
    var  serviceCenterComplaints = [];


    function getServiceCenterComplaintSubReason() {
      var lsToken = TokenService.getToken(adminUserScId);
      ScComplaintSubStatusService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenterComplaintSubStatus = data;
        //console.log('callerList',data);
        angular.forEach(data, function(val) {
          $scope.serviceCenterComplaintData.push({id:val.subStatusDescription,label:val.subStatusDescription,slNo:val.slNo});
        });
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }

    $scope.updateServiceCenterComplaints = {
      onItemSelect: function(item) {
        serviceCenterComplaints.push(item.id);
        if(serviceCenterComplaints.length > 0){
          $scope.notInterestedForm.$invalid = false;
        }else if(serviceCenterComplaints.length === 0){
          $scope.notInterestedForm.$invalid = true;
        }
      },
      onItemDeselect: function(item) {
        var updateSelectedCaller = serviceCenterComplaints.indexOf(item.label);
        serviceCenterComplaints.splice(updateSelectedCaller,1);
        if(serviceCenterComplaints.length > 0){
          $scope.notInterestedForm.$invalid = false;
        }else if(serviceCenterComplaints.length === 0){
          $scope.notInterestedForm.$invalid = true;
        }
      }
    };

    $scope.resetServiceCenterComplaints = function() {
      $scope.serviceCenterComplaints = [];
      serviceCenterComplaints = [];
    };

    $scope.resetServiceCenterComplaints();

    $scope.getHistory = function(){
      getSalesAppointmentHistoryData($scope.tcAppointmentData.chassisNo);
    };


    /*$scope.walkinRemarkCheck = function(){
      if($scope.walkinStatus.remarks !== undefined){
        $scope.walkinCallLaterForm.$invalid = false;
      }else {
        $scope.walkinCallLaterForm.$invalid = true;
      }
    }*/

    $scope.walkinRemarkCheck = function(){
      if($scope.walkinStatus.remarks !== undefined){
        if($scope.walkinStatus.remarks !== 'Customer agreed to Walkin' && $scope.walkinStatus.remarks !== 'Customer tentively agreed to Walkin' && $scope.walkinStatus.remarks !== 'Customer will call and Confirm' && $scope.walkinStatus.remarks !== 'Out of Station' && $scope.walkinStatus.remarks !== 'Customer Busy' && $scope.walkinStatus.remarks !== 'Required KMs not travelled'){
          $scope.walkinCallLaterForm.$invalid = false;
        }
      } else {
        $scope.walkinCallLaterForm.$invalid = true;
      }
    };


 var mobileActiveStatus = false;
 var mobileDeactiveStatus = false;
 var mobilePrimaryStatus = false;
 var selectedMobileStatus;
 $scope.getUpdateMobileStatus = function(selMobile,apptObj,defaultNumStatus,selMobileStatus){
   selectedMobileStatus = selMobileStatus;
   if(selMobileStatus === 'primary'){
      $timeout(function() {
        console.log(selectedMobileNumer);
        console.log($scope.tcAppointmentData.customer_mobile);
        if(selectedMobileNumer === $scope.tcAppointmentData.customer_mobile){
          alert('This is already a Primary Number');
          mobilePrimaryStatus = false;
       } else if(selectedMobileNumer !== $scope.tcAppointmentData.customer_mobile){
          mobilePrimaryStatus = $window.confirm('Are you sure to make this Mobile No. as Primary?');
       }
       if(mobilePrimaryStatus){
        console.log('Updating :',selectedMobileStatus);
        $scope.editPhoneNumber(selectedMobileNumer,apptObj,defaultNumStatus,selectedMobileStatus);
        $scope.phoneObj = {};
      } else{
        console.log('Cancelled the Making Primary Event');
      } 
       }, 300);     
  }
 } 

 $("#activeDeactivePhoneModal").modal('hide');
 var selectedMobileNumer;
 $scope.updateMobileStatus = function(currentMobile){
  $scope.mobileDisplay = currentMobile;
  if(currentMobile.substr(0,10) === $scope.tcAppointmentData.customer_mobile){
    $scope.primaryStatus = true;
  } else if(currentMobile.substr(0,10) !== $scope.tcAppointmentData.customer_mobile){
    $scope.primaryStatus = false;
  }
  $scope.editPhoneSuccessMsg = '';
  $scope.editPhoneErrorMsg = '';
  console.log(currentMobile);
  if(currentMobile !== null){
     selectedMobileNumer = currentMobile.substr(0,10);
     $("#activeDeactivePhoneModal").modal('show');
  }
 }

 $scope.clearActiveInactiveModal = function(){
  $("#activeDeactivePhoneModal").modal('hide');
 }

    });
