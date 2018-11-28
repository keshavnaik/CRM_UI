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
  .controller('crmSalesFeedbackDetailedController', function ($scope,$cookies,$route,$filter,$state,$location,ngTableParams,$rootScope,$window,$http,serviceURL,TokenService,AdminLoginService,TeleCallerStatusService,TeleCallerDataTypeService,TeleCallerDateWiseDataService,TeleCallerStatsDataService,TeleCallerPerticularAppointmentDataService,TeleCallerPerticularAppointmentHistoryDataService,ServiceTypeService,AssistanceTypeService,TeleCallerReasonService,ScComplaintSubStatusService,TCAppointmentStatusUpdateService,TeleCallingSearchService,GetFeedbackTitleService,FeedBackDataService,TeleCallingCallService,GetCallerWiseServiceCenterService,CallingPendingStatsService,CallingPendingStatsDetailsService,UpdateTelecallerServiceCenterService,UpdatePickupAndDropService,PickupAndDropTokenService,PickupAndDropAssistanceAmountService,GetLatLngService,GetSCLocationBrandService,CheckAMCUserService,PickupAndDropSlotService,$stateParams,$interval,$timeout,TeleCallerWiseServiceCenterService,SendSMSService,TimeSlotSelected,UpdateCustomerPhoneService,GetPresentHourService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginMobile = $cookies.get('loginMobile');
    var loginCallingType = $cookies.get('loginCallingType');

    var customerIdForFeedback;
    var apptIdForFeedback;
    var lastCalledStatusForFeedback;
    var selectedApptId = $stateParams.apptId;
    var nextAppointmentId;

    angular.forEach($rootScope.apptIdList, function (val,index) {
      if(selectedApptId === $rootScope.apptIdList[index]){
        nextAppointmentId = $rootScope.apptIdList[index+1];
      }
    });

    var selectedataTypeId = $stateParams.dataTypeId;
    var selectedCallerStatus = $stateParams.status;
    console.log('apptId',selectedApptId);

     var presentDateData;
    function getPresentDate() {
      GetPresentHourService.get(function (data) {
        console.log('present date : ',data);
        presentDateData = data;
      }, function (err) {
      });
    }
  

    $scope.openCalendar = function(e,status) {
      e.preventDefault();
       getPresentDate();
      $scope.minDate = new Date(presentDateData.date);
      e.stopPropagation();
      if(status === 'FromDate') {
        $scope.isOpenFrom = true;
      } else {
        $scope.isOpenTo = true;
      }
    };
    

     $scope.openCalendarStatus = function(e) {
      //$scope.minDate = new Date();
       getPresentDate();
      $scope.minDate = new Date(presentDateData.date);
      e.preventDefault();
      e.stopPropagation();
      $scope.isOpenFromStatus = true;
    };


    $scope.customerMobileNumbers = [];
    var customerMobileNumbers = [];
    // var customerMobileNumbersArr = [];
    var selectedDataTypeForHistory = selectedataTypeId;
    var scOpdId;
    var nextApptId;
    function getAppointmentDetails(apptId,selStatus) {
      showLoader(true);
      $scope.customerMobileNumbers = [];
      nextApptId = '';
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentDataService.query({apptId:apptId,scId:adminUserScId,status:selStatus,callerId:adminUserId,token:lsToken}, function (data) {
        console.log('data in detailed page',data[0]);
        console.log(data);
        $scope.tcAppointmentData = data[0];
        customerMobileNumbers = $scope.tcAppointmentData.mobile;
        for(var i=0;i<customerMobileNumbers.length;i++){
          $scope.customerMobileNumbers.push(customerMobileNumbers[i].customer_mobile);
        }
        $scope.currentMobile = $scope.customerMobileNumbers[0];
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
        if($scope.tcAppointmentData.scName === undefined || $scope.tcAppointmentData.scName === null || $scope.tcAppointmentData.scName === ''){
          $scope.tcAppointmentData.scName= '- -';
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
        getAppointmentHistoryData($scope.tcAppointmentData.chassisNo);
        getServiceHistoryData ($scope.tcAppointmentData.chassisNo);
        showLoader(false);
        $('#tcAppointmentDetailsPage').show();
        // $('html,body').animate({scrollTop: '770px'}, 500);
      }, function (err) {
        $scope.tcAppointmentDataErrorMsg = err.data.message;
        //$window.alert('No data found for this appointment .');
        $window.alert('Selected data list is completed. Redirecting to Dashboard !!!');
        $state.go('salesFeedback');
        showLoader(false);
      });
    }

    // $scope.customerMobileNumbers = customerMobileNumbers;

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

    getAppointmentDetails(selectedApptId,selectedCallerStatus);

    function getServiceCenterList() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({callerId:adminUserId,id:adminUserScId,token:lsToken}, function(data) {
        console.log('serviceCenter :',data);
        $scope.serviceCenterToUpdate = data;
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterList();

    function getServiceCenterTeleCallerWise() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetCallerWiseServiceCenterService.query({callerId:adminUserId,id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise();
    $scope.teleCallingStatus = [{"apptStatusId":"3","description":"Call Later","slNo":5},{"apptStatusId":"2","description":"Walkin","slNo":6}];


    function getStatusReason(statusData) {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerReasonService.query({status:statusData,id:adminUserScId,token:lsToken},function(data) {
        $scope.reasonDescription = data;
        console.log('$scope.reasonDescription::',$scope.reasonDescription);
      }, function(err) {
        console.log(err);
      });
    }


    var selectedDataTypeForHistory;

    $('#tcAppointmentDetailsPage').hide();
    $scope.getTCPSFDetailsData = function(tcAppointmentData) {
      var apptId = tcAppointmentData.entity.apptId;
      selectedDataTypeForHistory = tcAppointmentData.entity.dataTypeId;

      //var chassisNo = tcAppointmentData.entity.chassisNo;
      /*if(tcAppointmentData.entity.chassisNo === undefined || tcAppointmentData.entity.chassisNo === null){
        chassisNo= 'NA';
      }*/
      getAppointmentDetails(selectedApptId,selectedCallerStatus);
      //getAppointmentHistoryData(chassisNo);
    };


    $scope.teleCallingStatusForPsfUpdate = [
      {'id': 2, 'description': 'Walkin'}, {'id': 3, 'description': 'Call Later'},
      {'id': 6, 'description': 'Feedback'}];

    function getAppointmentHistoryData(chassisNo) {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentHistoryDataService.query({chassisNo:chassisNo,id:adminUserScId,dataTypeId:selectedDataTypeForHistory,token:lsToken},function (data) {
        // console.log(data);
        $scope.tcAppointmentHistoryData = data;
         if($scope.tcAppointmentHistoryData.length){
           $scope.noOfTimesCalled = $scope.tcAppointmentHistoryData.length;
        } else {
          $scope.noOfTimesCalled = '0';
        }
      }, function (err) {
        $scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
      });
    }

    function getServiceHistoryData(chassisNo) {
      console.log('Chassis no', chassisNo);
      var lsToken = TokenService.getToken(adminUserScId);
      ServiceTypeService.query({chassisNo:chassisNo,id:adminUserScId,token:lsToken},function (data) {
        console.log('Service history data :',data);
        $scope.tcServiceHistoryData = data;
      }, function (err) {
        console.log(err);
        $scope.tcServiceHistoryDataErrorMsg = err.data.message;
      });
    }

    function  getFeedBackTileList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetFeedbackTitleService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.feedbackTitleList = [];
        console.log('feedback question list :',data);
        angular.forEach(data, function(val) {
          var feedbackData = {description:val.description,feedBackListId:val.feedBackListId,feedBackType:val.feedBackType,questionType:val.questionType,feedBackStatus:'',feedBackRemarks:'',rating:'',loginId:adminUserId,scId:adminUserScId,customerId:customerIdForFeedback,apptId:apptIdForFeedback,lastCalledStatus:lastCalledStatusForFeedback};
          $scope.feedbackTitleList.push(feedbackData);
        });
      }, function (err) {
        //console.log(err);
      });
    }
    //getFeedBackTileList();

    $scope.feedbackWalkinData = {walkin:'',feedbackWalkinDate:'',feedbackWalkinTime:''};
    $scope.feedbackPickAndDropData = {pickAndDrop:'',feedbackPickDropDate:'',feedbackPickDropTime:'',feedbackPickDropSlot :'',feedbackPickDropAddress:'',feedbackPickDropArea:'',feedbackPickDropAssistanceTypeData:'',feedbackPickDropAssistanceAmount:'',feedbackPickDropRemarks:''};

    var selectedStausToUpdate;
    $scope.updateTeleCallingStatus = function(status,selectedTeleCallingData) {
      console.log('selectedTeleCallingData',selectedTeleCallingData.customerId);
      customerIdForFeedback = selectedTeleCallingData.customerId;
      apptIdForFeedback = selectedTeleCallingData.apptId;
      lastCalledStatusForFeedback = selectedTeleCallingData.lastCalledStatus;
      getFeedBackTileList();
      $scope.tcStatusUpdateMsg = '';
      selectedStausToUpdate = status;
      getStatusReason(status);
      $scope.updateMsg = '';
      $scope.walkinStatus = {};
      $scope.updateTeleCallingAppointmentStatus = selectedTeleCallingData;
      //console.log('customerId',customerId);
      $scope.selectedStatus = status;

    };


    $scope.dealerFeedback = {};
    $scope.feedBackObject = {};
    $scope.feedBackRemarksObject = {};
    $scope.updateUserFeedBack = function (feedbackData,feedbackRemarksData,apptData) {
      sendFeedBackData($scope.feedbackTitleList,apptData);
    };

    var feedbackWalkin = false ;
    var feedbackPickDrop = false ;
    $scope.getWalkinReason = function (walkinSatus) {
      feedbackWalkin = true;
      getStatusReason(walkinSatus);
    };


    $scope.checkPickDrop = function () {
      feedbackPickDrop = true;
    };

    function sendFeedBackData(feedBackRequest,apptData) {
      console.log(JSON.stringify(feedBackRequest));
      var lsToken = TokenService.getToken(adminUserScId);
      FeedBackDataService.save({id:adminUserScId,token:lsToken},feedBackRequest, function(data) {
        console.log('Feedback Post :',data);
        teleCallerUpdateDataStatus = {
          customerId: apptData.customerId,
          customerName: apptData.customer_name,
          status: 'walkin',
          appointmentDateTime: $scope.feedbackWalkinData.feedbackWalkinDate,
          subStatus: $scope.feedbackWalkinData.walkin,
          scId: adminUserScId,
          scName: apptData.scName,
          customerMobile: apptData.customer_mobile,
          apptId:apptData.apptId,
          callerId:adminUserId,
          branchId:apptData.branchId,
          //remarksForSubStatus: appointmentStatusData.manualRemarks,
          appointTime:$scope.feedbackWalkinData.feedbackWalkinTime,
          lastCalledStatus : apptData.lastCalledStatus
        };

        teleCallerUpdateDataStatusPickupAndDrop = {
          customerId: apptData.customerId,
          customerName: apptData.customer_name,
          scId: adminUserScId,
          scName: apptData.scName,
          customerMobile: apptData.customer_mobile,
          apptId:apptData.apptId,
          callerId:adminUserId,
          status: 'Pickup and Drop',
          remarks:  $scope.feedbackPickAndDropData.feedbackPickDropRemarks,
          bikeBrand: apptData.bikeBrandId,
          bikeModel: apptData.bikeModel,
          bikeNo: apptData.bikeNo,
          //appointmentDateTime: appointmentStatusData.selectedDate,
          appointmentDateTime: $scope.feedbackPickAndDropData.feedbackPickDropDate,
          timeSlot: $scope.feedbackPickAndDropData.feedbackPickDropSlot,
          address: $scope.feedbackPickAndDropData.feedbackPickDropAddress,
          area: $scope.feedbackPickAndDropData.feedbackPickDropArea,
          assistanceTypeId: $scope.feedbackPickAndDropData.feedbackPickDropAssistanceTypeData,
          // serviceTypeId: appointmentStatusData.serviceTypeData.lsSTId,
          branchId: apptData.branchId,
          assistanceAmount : $scope.feedbackPickAndDropData.feedbackPickDropAssistanceAmount,
          appointTime: $scope.feedbackPickAndDropData.feedbackPickDropTime,
          lastCalledStatus : apptData.lastCalledStatus
        };

        if(feedbackWalkin){
          updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
        }
        if(feedbackPickDrop){
          updateTeleCallingDataStatus(teleCallerUpdateDataStatusPickupAndDrop);
        }
        $scope.tcStatusUpdateMsg = {msg:data.message,nextApptMsg:'Updating to Next Appointment Details'};
        $timeout( function() {$('#teleCallingStatusUpdateModal').modal('hide');}, 2000);
        $timeout( function() { getNextAppointment(nextAppointmentId,selectedataTypeId);}, 4000);
      }, function (err) {
        console.log(err);
      });
    }
    

$scope.skipAppointment = function(){
  getNextAppointment(nextAppointmentId,selectedataTypeId);
} 
    function getNextAppointment(apptId,dataTypeId) {
      $state.go('salesFeedbackDetailed', {apptId:apptId,dataTypeId:dataTypeId},{reload: true}); //{reload: true}
      console.log('nextAppointmentId:',apptId);
      console.log('nextAppointmentId:',nextAppointmentId);
    }
    var opdId;
    function updateTeleCallingDataStatus(teleCallerUpdateDataStatus) {
      $scope.tcStatusUpdateMsg = '';
      console.log('request1...',teleCallerUpdateDataStatus);
      var lsToken = TokenService.getToken(adminUserScId);
      TCAppointmentStatusUpdateService.save({id:adminUserScId,token:lsToken},teleCallerUpdateDataStatus,function(data) {
        console.log('1st resp feedback',data);
        opdId = data.opdId;
        if(opdId >0){
          updateTeleCallerPickupAndDropStatus(teleCallerUpdateDataStatus);
        }
        $scope.tcStatusUpdateMsg = {msg:data.message,nextApptMsg:'Updating to Next Appointment Details'};
        $timeout( function() {$('#teleCallingStatusUpdateModal').modal('hide');}, 2000);
        $timeout( function() { getNextAppointment(nextAppointmentId,selectedataTypeId);}, 3000);
      }, function(err) {
        $window.alert(err.data.message);
        console.log(err);
      });
    }

    var teleCallerUpdateDataStatus = {};
    var teleCallerUpdateDataStatusPickupAndDrop = {};
    var assistanceAmount;
    $scope.updateAppointmentStatus = function(appointmentStatus,updateTeleCallingAppointmentStatus,appointmentStatusData) {

      teleCallerUpdateDataStatus = {
        customerId: updateTeleCallingAppointmentStatus.customerId,
        customerName: updateTeleCallingAppointmentStatus.customer_name,
        status: appointmentStatus,
        appointmentDateTime: appointmentStatusData.selectedDate,
        subStatus: appointmentStatusData.remarks || $scope.walkinSubStatus,
        scId: adminUserScId,
        scName: updateTeleCallingAppointmentStatus.scName,
        customerMobile: updateTeleCallingAppointmentStatus.customer_mobile,
        apptId:updateTeleCallingAppointmentStatus.apptId,
        callerId:adminUserId,
        branchId:updateTeleCallingAppointmentStatus.branchId,
        remarksForSubStatus: appointmentStatusData.manualRemarks,
        appointTime:appointmentStatusData.timeValue,
        lastCalledStatus : updateTeleCallingAppointmentStatus.lastCalledStatus
      };
      //console.log(teleCallerUpdateDataStatus);
      $scope.walkinStatus = {};
      $scope.walkinCallLaterForm.$setPristine();
      updateTeleCallingDataStatus(teleCallerUpdateDataStatus);

    };


    function  updateTeleCallerPickupAndDropStatus(pickupRequest) {
      var lsToken = PickupAndDropTokenService.getToken(adminUserScId);
      var pickupAndDropRequest = {
        opdId: opdId,
        customerId: pickupRequest.customerId,
        customerName: pickupRequest.customerName,
        customerMobile: pickupRequest.customerMobile,
        callerId:adminUserId,
        bikeBrand: pickupRequest.bikeBrand,
        bikeModel: pickupRequest.bikeModel,
        bikeNo: pickupRequest.bikeNo,
        appointmentDateTime: pickupRequest.appointmentDateTime,
        timeSlot: pickupRequest.timeSlot,
        address: pickupRequest.address,
        area: pickupRequest.area,
        assistanceTypeId: pickupRequest.assistanceTypeId,
        assistanceAmount : assistanceAmount,
        lastCalledStatus : pickupRequest.lastCalledStatus
      };
      console.log('2nd req in feedback pickup and drop',pickupAndDropRequest);
      //console.log('2nd req',JSON.stringify(pickupAndDropRequest));
      UpdatePickupAndDropService.save({id:adminUserScId,token:lsToken},pickupAndDropRequest, function(data) {
        console.log('2nd resp',data);
        $scope.pickupAndDropStatusUpdateMsg = data.message;
        $window.alert( $scope.pickupAndDropStatusUpdateMsg);
      }, function (err) {
        console.log(err);
      });
    }




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
        callerMobile: loginMobile,
        callingType: loginCallingType
      };
      console.log(JSON.stringify(callData));  
      TeleCallingCallService.save({id:adminUserScId,token:lsToken}, callData, function (data) {
        //console.log('calling resp:',data);
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
        getAppointmentDetails(selectedApptId,selectedCallerStatus);
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

    $scope.editPhoneNumber = function(newPhoneNumber,apptObj){
      console.log('newPhoneNumber',newPhoneNumber);
      $scope.editPhoneSuccessMsg = '';
      var editPhoneObj = {
        mobile: newPhoneNumber,
        customerName: apptObj.customer_name,
        chassisNo : apptObj.chassisNo,
        scId : adminUserScId
      };
      console.log(JSON.stringify(editPhoneObj));
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateCustomerPhoneService.save({id:adminUserScId,token:lsToken}, editPhoneObj, function (data) {
        console.log(data);
        $scope.editPhoneSuccessMsg = data.message;
        getAppointmentDetails(selectedApptId,selectedCallerStatus);
        $timeout(function() {
          $('#editPhoneModal').modal('hide');
        }, 3000);
        $scope.phoneObj = {};
        $scope.editPhoneForm.$setPristine();
      }, function (err) {
        console.log(err);
        $scope.editPhoneErrorMsg = err.data.message;
      });
    };


    $scope.assistanceTypes = [{'id':1,'assistanceType':'Pick Only'},
      {'id':2,'assistanceType':'Drop Only'},{'id':3,'assistanceType':'Pickup and Drop'}];

    /*calculating pickup and drop assistance amount start*/
    var isAMCUser = false;
    var scLatLng, selSCId, selBikeNo, selDateTime, selBrandId, selZoneCode;
    $scope.getSCDetail = function (scId) {
      var lsToken = PickupAndDropTokenService.getToken(scId);
      scLatLng = '';
      getPickupDropPricing();
      GetSCLocationBrandService.get({scId:scId,token:lsToken}, function (data) {
        console.log('sc lat long',data);
        scLatLng = data.latlng;
        selZoneCode = data.zoneCode;
      }, function (err) {
        console.log('sc lat long error',err);
      });
    };

    function checkAMCUser () {
      if(selSCId && selBikeNo && selDateTime) {
        $scope.calculatedAssistanceAmount = '';
        $scope.assistanceAmountTax = '';
        var lsToken = PickupAndDropTokenService.getToken(selSCId);
        CheckAMCUserService.get({bikeNo:selBikeNo,dateTime:selDateTime,scId:selSCId,token:lsToken}, function (data) {
          if(data.message) {
            isAMCUser = true;
            $scope.calculatedAssistanceAmount = 0;
            $scope.assistanceAmountTax = 'Total payable assistance amount will be 0 + Tax';
            $scope.pickUpRequest.assistanceAmount = $scope.calculatedAssistanceAmount;
          } else {
            isAMCUser = false;
            getSCUserDistance(scLatLng,selLatLng);
          }
        }, function (err) {
          isAMCUser = false;
          getSCUserDistance(scLatLng,selLatLng);
        });
        $scope.isAMCUser = isAMCUser;
      } else {
        isAMCUser = false;
      }
    }

    var selAssistanceType;
    $scope.getAssistanceType = function (selectedAssistanceType) {
      selAssistanceType = selectedAssistanceType;
      $scope.getSCDetail(scOpdId);
    };

    function calculateAssistanceAmount(actualDistance) {
      if(isAMCUser) {
        $scope.calculatedAssistanceAmount = 0;
        $scope.assistanceAmountTax = 'Total payable assistance amount will be 0 + Tax';
        $scope.pickUpRequest.assistanceAmount = $scope.calculatedAssistanceAmount;
        console.log('AMC calculatedAssistanceAmount;',$scope.calculatedAssistanceAmount);
        $scope.pickUpRequest.assistanceAmount = $scope.calculatedAssistanceAmount;
      } else {
        var loopDistance = true;
        $scope.calculatedAssistanceAmount = '';
        $scope.assistanceAmountTax = '';
        actualDistance = Math.ceil(actualDistance);
        var slotRange, totalAssistancePrice;
        var pricingLength = pickUpDropPricing.length;
        pricingLength = pricingLength - 1;
        angular.forEach(pickUpDropPricing, function (val,index) {
          if(selAssistanceType === 3) {
            slotRange = val.priceSlotPickAndDrop.split(' - ');
            if(actualDistance <= parseInt(slotRange[0]) && loopDistance) {
              loopDistance = false;
              totalAssistancePrice = parseInt(val.priceBySlotPickAndDrop);
            } else if ((parseInt(actualDistance) >= parseInt(slotRange[0])) && (parseInt(actualDistance) <= parseInt(slotRange[1])) && loopDistance) {
              totalAssistancePrice = parseInt(val.priceBySlotPickAndDrop);
              loopDistance = false;
            } else if ((parseInt(actualDistance) >= parseInt(slotRange[1])) && loopDistance) {
              if(index >= pricingLength) {
                loopDistance = false;
                var extraDistance = actualDistance - parseInt(slotRange[1]);
                totalAssistancePrice = parseInt(val.priceBySlotPickAndDrop) + (2 * (extraDistance * parseInt(val.generalServicePricePerKm)));
              } else {
                loopDistance = true;
              }
            } else {

            }
            $scope.calculatedAssistanceAmount = totalAssistancePrice;
            $scope.assistanceAmountTax = 'Total payable assistance amount will be ' + totalAssistancePrice + ' + Tax';
            console.log('pick and drop both calculatedAssistanceAmount;',$scope.calculatedAssistanceAmount);
            $scope.pickUpRequest.assistanceAmount = $scope.calculatedAssistanceAmount;
          } else if(selAssistanceType === 1 || selAssistanceType === 2) {
            slotRange = val.priceSlotPickAndDrop.split(' - ');
            if(actualDistance <= parseInt(slotRange[0]) && loopDistance) {
              loopDistance = false;
              totalAssistancePrice = parseInt(val.priceBySlotPickDrop);
            } else if ((parseInt(actualDistance) >= parseInt(slotRange[0])) && (parseInt(actualDistance) <= parseInt(slotRange[1])) && loopDistance) {
              totalAssistancePrice = parseInt(val.priceBySlotPickDrop);
              loopDistance = false;
            } else if ((parseInt(actualDistance) >= parseInt(slotRange[1])) && loopDistance) {
              if(index >= pricingLength) {
                loopDistance = false;
                var extraDistance = actualDistance - parseInt(slotRange[1]);
                totalAssistancePrice = parseInt(val.priceBySlotPickDrop) + (extraDistance * parseInt(val.generalServicePricePerKm));
              } else {
                loopDistance = true;
              }
            } else {

            }
            $scope.calculatedAssistanceAmount = totalAssistancePrice;
            $scope.assistanceAmountTax = 'Total payable assistance amount will be ' + totalAssistancePrice + ' + Tax';
            console.log('pick OR drop calculatedAssistanceAmount;',$scope.calculatedAssistanceAmount);
            $scope.pickUpRequest.assistanceAmount = $scope.calculatedAssistanceAmount;
          } else {

          }
        });
      }
    }

    var calculatedDistance;
    function getSCUserDistance(scLatLng,selLatLng) {
      calculatedDistance = '';
      scLatLng = scLatLng.split(',');
      selLatLng = selLatLng.split(',');
      if(scLatLng[0] && scLatLng[1] && selLatLng[0] && selLatLng[1]) {
        var originAddress = {lat: parseFloat(scLatLng[0]), lng: parseFloat(scLatLng[1])};
        var destinationAddress = {lat: parseFloat(selLatLng[0]), lng: parseFloat(selLatLng[1])};
        var distanceService = new google.maps.DistanceMatrixService;
        distanceService.getDistanceMatrix({
          origins: [originAddress],
          destinations: [destinationAddress],
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, function(response, status) {
          calculatedDistance = response.rows[0].elements[0].distance.text;
          calculatedDistance = calculatedDistance.split(' ');
          calculatedDistance = calculatedDistance[0];
          calculateAssistanceAmount(calculatedDistance);
        });
      }
    }


    var selectedPickupDropArea, selLatLng;
    $scope.getPickupDropArea = function (selArea,selDate) {
      //selDateTime = selDate;
      if(selDate){
        selDateTime = selDate.getFullYear() + '-' + ('0' + (selDate.getMonth() + 1)).slice(-2) + '-' + ('0' + selDate.getDate()).slice(-2);
        //console.log('selected date : ',selDate);
        // console.log('selected date : ',selDateTime);
        selectedPickupDropArea = selArea.formatted_address;
        selLatLng = '';
        if(isAMCUser) {

        } else {
          GetLatLngService.getLocationCoordinates(selectedPickupDropArea).then(function (data) {
            //console.log('latlong :',data);
            selLatLng = data;
            //$scope.getSCDetail(adminUserScId);
            checkAMCUser();
            getSCUserDistance(scLatLng,selLatLng);
            if($scope.opdIdForPickAndDrop >0){
              getAvailableSlot();
            }
          }, function (err) {
            //console.log(err);
          });
        }
      }else{
        console.log('Date Not Selected Yet...');
      }

    };

    function getAvailableSlot () {
      var selCityId = '1';
      var lsToken = PickupAndDropTokenService.getToken(selCityId);
      PickupAndDropSlotService.query({date:selDateTime,assistance_type:selAssistanceType,scId:scOpdId,cityId:selCityId,zoneCode:selZoneCode,token:lsToken}, function (data) {
        // toastr.success('Updating available slots','LetsService');
        $scope.timeSlotData = data;
        //console.log('time slot :',data);
      }, function (err) {
        $window.alert(err.data.message);
        //$scope.timeSlotDataError = err;
      });
    }

    var pickUpDropPricing = [];
    function getPickupDropPricing () {
      pickUpDropPricing = [];
      var lsToken = PickupAndDropTokenService.getToken(scOpdId);
      PickupAndDropAssistanceAmountService.query({scId:scOpdId,token:lsToken}, function (data) {
        $scope.scPricing = data;
        //console.log('service center pricing : ',data);
        angular.forEach(data, function (val) {
          pickUpDropPricing.push(val);
        });
      }, function (err) {
        //  console.log(err);
      });
    }

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

  });
