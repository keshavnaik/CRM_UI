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
  .controller('crmDetailedPageController', function ($scope,$cookies,$route,$filter,$state,$location,ngTableParams,$rootScope,$window,$http,serviceURL,TokenService,AdminLoginService,TeleCallerStatusService,TeleCallerDataTypeService,TeleCallerDateWiseDataService,TeleCallerStatsDataService,TeleCallerPerticularAppointmentDataService,TeleCallerPerticularAppointmentHistoryDataService,ServiceTypeService,AssistanceTypeService,TeleCallerReasonService,ScComplaintSubStatusService,TCAppointmentStatusUpdateService,TeleCallingSearchService,GetFeedbackTitleService,FeedBackDataService,TeleCallingCallService,GetCallerWiseServiceCenterService,CallingPendingStatsService,CallingPendingStatsDetailsService,UpdateTelecallerServiceCenterService,UpdatePickupAndDropService,PickupAndDropTokenService,PickupAndDropAssistanceAmountService,GetLatLngService,GetSCLocationBrandService,CheckAMCUserService,PickupAndDropSlotService,$stateParams,$interval,$timeout,TeleCallerWiseServiceCenterService,SendSMSService,TimeSlotSelected,UpdateCustomerPhoneService,GetPresentHourService,CreAppointmentActiveStatusService,TeleCallerLSHistoryDataService,CreateFutureReminderService,TCInsuranceStatusUpdateService) {

    /*var adminUserId = $window.sessionStorage.getItem('loggedInUserId');
    var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');*/
    //var apptIdList = [];
    //apptIdList = $window.sessionStorage.getItem('apptIdList');
    //console.log('apptIdList',apptIdList);

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginMobile = $cookies.get('loginMobile');
    var loginCallingType = $cookies.get('loginCallingType');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');

    var selectedApptId = $stateParams.apptId;
    var selectedCallerStatus = $stateParams.status;
    var nextAppointmentId;

    angular.forEach($rootScope.apptIdList, function (val,index) {
      if(selectedApptId === $rootScope.apptIdList[index]){
        nextAppointmentId = $rootScope.apptIdList[index+1];
        //$window.sessionStorage.setItem('nextAppointmentId', nextAppointmentId);
      }
    });

    /*angular.forEach(apptIdList, function (val,index) {
      if(selectedApptId === apptIdList[index]){
        nextAppointmentId = apptIdList[index+1];
      }
    });*/

    var selectedataTypeId = $stateParams.dataTypeId;
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
    //  alert($scope.date.getDate()-1);
    $scope.openCalendarStatus = function(e) {
      //$scope.minDate = new Date();
      $scope.minDate = new Date(presentDateData);
      $scope.minDateForPickAndDrop = new Date(presentDateData);
      //$scope.minDateForPickAndDrop = $scope.minDateForPickAndDrop.setDate($scope.minDateForPickAndDrop.getDate() + 1);
      if($scope.opdIdForPickAndDrop !== '0' && $scope.opdIdForPickAndDrop !== 0){
              $scope.minDateForPickAndDrop = new Date(presentDateData);
              $scope.minDateForPickAndDrop = $scope.minDateForPickAndDrop.setDate($scope.minDateForPickAndDrop.getDate() + 1);
        }
      e.preventDefault();
      e.stopPropagation();
      $scope.isOpenFromStatus = true;
    };

    $scope.teleCallingStatusForUpdate = [{'id': 1, 'description': 'Pickup and Drop'},
      {'id': 2, 'description': 'Walkin'}, {'id': 3, 'description': 'Call Later'},
      {'id': 4, 'description': 'Not Interested'},
      {'id': 6, 'description': 'Service Done'}];

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
      TeleCallerWiseServiceCenterService.query({callerId:adminUserId,id:adminUserScId,token:lsToken}, function(data) {
        console.log('serviceCenter :',data);
        $scope.serviceCenterToUpdate = data;
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterList();


    

    $scope.customerMobileNumbers = [];
    var customerMobileNumbers = [];
    //$scope.mobileArray = [];
    //var callerAppointmentStatus;
    var selectedDataTypeForHistory = selectedataTypeId;
    var scOpdId;
    var nextApptId;
    var checkActiveInactiveStatus = true;
    var callerAppointmentStatus;
    var nextApptStatus;
    function getAppointmentDetails(apptId,selStatus) {
      $scope.teleCallingStatusForUpdate = [{'id': 1, 'description': 'Pickup and Drop'},
      {'id': 2, 'description': 'Walkin'}, {'id': 3, 'description': 'Call Later'},
      {'id': 4, 'description': 'Not Interested'},
      {'id': 6, 'description': 'Service Done'}];
      
      showLoader(true);
      $scope.customerMobileNumbers = [];
      nextApptId = '';
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentDataService.query({apptId:apptId,scId:adminUserScId,status:selStatus,callerId:adminUserId,token:lsToken}, function (data) {
        console.log('data in detailed page',data[0]);
        console.log(data);
        $scope.tcAppointmentData = data[0];
         callerAppointmentStatus = data[0].callerApptStatus;
        if(checkActiveInactiveStatus){
          if(callerAppointmentStatus === 'inactive'){
            nextApptStatus = true;
            //getAppointmentDetails(nextAppointmentId);
            /*if(apptId == undefined){
              getNextAppointment(nextAppointmentId,selectedataTypeId);
            }*/
            getNextAppointment(nextAppointmentId,selectedataTypeId);
          }
         else if(callerAppointmentStatus === 'active'){
            inActiveCallerAppointmentStatus (selectedApptId,$scope.tcAppointmentData.apptStatus);
          }
        }
        customerMobileNumbers = $scope.tcAppointmentData.mobile;
        for(var i=0;i<customerMobileNumbers.length;i++){
          if(customerMobileNumbers[i].customer_mobile === $scope.tcAppointmentData.customer_mobile){
            customerMobileNumbers[i].customer_mobile = customerMobileNumbers[i].customer_mobile+'*';
            $scope.currentMobile = customerMobileNumbers[i].customer_mobile;
           }
           $scope.customerMobileNumbers.push(customerMobileNumbers[i]);
         }
        console.log('$scope.currentMobile',$scope.currentMobile);
        // $scope.getCustomerNameByPhone($scope.customerMobileNumbers,$scope.currentMobile);
        //$scope.currentMobile = $scope.mobileArray[0];
        console.log('tcAppointmentData.mobile',$scope.customerMobileNumbers);
        scOpdId = $scope.tcAppointmentData.opdId;
        $scope.opdIdForPickAndDrop = scOpdId;
        selSCId = $scope.tcAppointmentData.opdId;
        selBikeNo = $scope.tcAppointmentData.bikeNo;
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
        /*if($scope.tcAppointmentData.bikeNo === undefined || $scope.tcAppointmentData.bikeNo === null || $scope.tcAppointmentData.bikeNo === ''){
          $scope.tcAppointmentData.bikeNo= '- -';
        }*/
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
        if($scope.tcAppointmentData.insuranceDueDate !== undefined && $scope.tcAppointmentData.insuranceDueDate !== null && $scope.tcAppointmentData.insuranceDueDate !== 'NA' && $scope.tcAppointmentData.insuranceDueDate !== ''){
          $scope.teleCallingStatusForUpdate.push({'id': 7, 'description': 'Insurance Done'},{'id': 8, 'description': 'Insurance Walkin'});
        }
        getAppointmentHistoryData($scope.tcAppointmentData.chassisNo);
        //getServiceHistoryData ($scope.tcAppointmentData.chassisNo);
        showLoader(false);
        $('#tcAppointmentDetailsPage').show();
       // $('html,body').animate({scrollTop: '770px'}, 500);
      }, function (err) {
        $scope.tcAppointmentDataErrorMsg = err.data.message;
        //$window.alert('No data found for this appointment .');
        $window.alert('Selected data list is completed. Redirecting to Dashboard !!!');
        $state.go('dashboard');
        showLoader(false);
      });
    }


    $scope.getCustomerNameByPhone = function (mobileObj,currentMobile) {
      console.log(currentMobile);
      angular.forEach(mobileObj,function (val,index) {
        if(mobileObj[index].customer_mobile === currentMobile){
          $scope.tcAppointmentDataDisplay = {customer_name: mobileObj[index].customer_name};
          console.log($scope.tcAppointmentDataDisplay.customer_name);
        }
      });
    };

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

/*$timeout(function() {
          $('#editPhoneModal').modal('hide');
        }, 3000);*/
    getAppointmentDetails(selectedApptId,selectedCallerStatus);

    function inActiveCallerAppointmentStatus (apptId,apptStatus) {
      var lsToken = TokenService.getToken(adminUserScId);
      var updateObj = {
        status:'inactive',
        apptId: apptId,
        callerId:adminUserId,
        scId: adminUserScId,
        apptStatus : apptStatus
      };
      console.log(JSON.stringify(updateObj));
      CreAppointmentActiveStatusService.save({id:adminUserScId,token:lsToken},updateObj, function (data) {
        console.log('Caller Appointment status Inactive..',data);
      }, function (err) {
        console.log(err);
      });
    }

    function getAppointmentHistoryData(chassisNo) {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentHistoryDataService.query({chassisNo:chassisNo,id:adminUserScId,dataTypeId:selectedDataTypeForHistory,bikeBrand:loginBrandName,token:lsToken},function (data) {
       console.log('history data :',data);
        $scope.tcAppointmentHistoryData = data;
        $scope.tcAppointmentHistoryDataErrorMsg = '';
        if($scope.tcAppointmentHistoryData.length){
           $scope.noOfTimesCalled = $scope.tcAppointmentHistoryData.length;
        } else {
          $scope.noOfTimesCalled = '0';
        }
      }, function (err) {
        console.log('history error data',err);
        $scope.noOfTimesCalled = '0';
        $scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
      });
    }

    function getServiceHistoryData(chassisNo) {
      console.log('Chassis no', chassisNo);
      var lsToken = TokenService.getToken(adminUserScId);
      ServiceTypeService.query({chassisNo:chassisNo,id:adminUserScId,bikeBrand:loginBrandName,token:lsToken},function (data) {
        console.log('Service history data :',data);
        $scope.tcServiceHistoryData = data;
      }, function (err) {
        console.log(err);
        $scope.tcServiceHistoryDataErrorMsg = err.data.message;
      });
    }


    var selectedStausToUpdate;
    $scope.updateTeleCallingStatus = function(status,selectedTeleCallingData) {
      console.log(status);
      $scope.tcStatusUpdateMsg = '';
      selectedStausToUpdate = status;
      if(adminUserScId === '1'){
        if(status === 'Others'){
          status = 'Not Interested';
        }
      }
      getStatusReason(status);
      $scope.updateMsg = '';
      $scope.walkinStatus = {};
      $scope.updateTeleCallingAppointmentStatus = selectedTeleCallingData;
      //$scope.pickUpRequest = {bikeNo : $scope.updateTeleCallingAppointmentStatus.bikeNo};
      console.log($scope.updateTeleCallingAppointmentStatus);
      $scope.selectedStatus = status;
      if(status === 'Service Done' || status === 'Insurance Done' ){
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

$scope.yesNoCheck = function(status){
  if(status === 'Yes'){
    $scope.yesNoStatus = 'Yes';
  } else if(status === 'No'){
    $scope.yesNoStatus = 'No';
  } 
}

    function getStatusReason(statusData) {
      if(statusData === 'Insurance Walkin'){
         statusData = 'Walkin';
      }
      $scope.reasonDescription = [];
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerReasonService.query({status:statusData,id:adminUserScId,token:lsToken},function(data) {
        $scope.reasonDescription = data;
        console.log(data);
        if(selectedStausToUpdate === 'Walkin'){
           $scope.walkinStatus.remarks = $scope.reasonDescription[0].apptSubStatus;
           console.log($scope.walkinStatus.remarks);
        }
      }, function(err) {
        console.log(err);
      });
    }

   /* $scope.openCalendarStatus = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $scope.isOpenFromStatus = true;
    };
*/

$scope.skipAppointment = function(status){
  getNextAppointment(nextAppointmentId,selectedataTypeId);
}
   
    function getNextAppointment(apptId,dataTypeId) {
      /*if(apptId !== undefined){
            $state.go('crmDetailed', {apptId:apptId,dataTypeId:dataTypeId},{reload: true}); //{reload: true}
      }*/
        $state.go('crmDetailed', {apptId:apptId,dataTypeId:dataTypeId},{reload: true}); //{reload: true}
        console.log('nextAppointmentId:',apptId);
        console.log('nextAppointmentId:',nextAppointmentId);
    }
      
    getServiceCenterComplaintSubReason();
    var opdId;
    function updateTeleCallingDataStatus(teleCallerUpdateDataStatus) {
      $scope.tcStatusUpdateMsg = '';
      console.log('request1...',teleCallerUpdateDataStatus);
      console.log('request1...',JSON.stringify(teleCallerUpdateDataStatus));
      var lsToken = TokenService.getToken(adminUserScId);
      TCAppointmentStatusUpdateService.save({id:adminUserScId,token:lsToken},teleCallerUpdateDataStatus,function(data) {
        console.log('1st resp',data);
        $scope.walkinConfirmStaus = false;
        opdId = data.opdId;
        console.log('opdID : ',opdId);
        if(opdId >0){
          updateTeleCallerPickupAndDropStatus(teleCallerUpdateDataStatus);
        }
        $scope.tcStatusUpdateMsg = {msg:data.message,nextApptMsg:'Updating to Next Appointment Details'};
        $timeout( function() {$('#teleCallingStatusUpdateModal').modal('hide');}, 2000);
        $timeout( function() { getNextAppointment(nextAppointmentId,selectedataTypeId);}, 3000);
        //$rootScope.apptIdList.indexOf(selectedApptId);
      }, function(err) {
        $window.alert(err.data.message);
        console.log(err);
      });
    }

    $scope.clearUpdateMsg = function () {
      $scope.tcStatusUpdateMsg = '';
      $scope.insuranceDoneOption = {};
      $scope.insuranceDoneStatus = {};
    };

    function  getFeedBackTileList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetFeedbackTitleService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.feedbackTitleList = data;
       // console.log('feedback',data);
      }, function (err) {
        //console.log(err);
      });
    }
    getFeedBackTileList();

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
      $scope.getSelectedDate(selDate);
      if(selDate){
        selDateTime = selDate.getFullYear() + '-' + ('0' + (selDate.getMonth() + 1)).slice(-2) + '-' + ('0' + selDate.getDate()).slice(-2);
         selectedPickupDropArea = selArea.formatted_address;
         selLatLng = '';
            checkAMCUser();
            //getSCUserDistance(scLatLng,selLatLng);
            if($scope.opdIdForPickAndDrop >0){
               getAvailableSlot();
            }
        if(isAMCUser) {

        } else {
          GetLatLngService.getLocationCoordinates(selectedPickupDropArea).then(function (data) {
            selLatLng = data;
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
          console.log('time slot :',data);
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
        lastCalledStatus : pickupRequest.apptStatus
      };
      console.log('2nd req',pickupAndDropRequest);
      //console.log('2nd req',JSON.stringify(pickupAndDropRequest));
      UpdatePickupAndDropService.save({id:adminUserScId,token:lsToken},pickupAndDropRequest, function(data) {
        console.log('2nd resp',data);
        $scope.pickupAndDropStatusUpdateMsg = data.message;
        $window.alert( $scope.pickupAndDropStatusUpdateMsg);
      }, function (err) {
        console.log(err);
      });
    }

    $scope.assistanceTypes = [{'id':1,'assistanceType':'Pick Only'},
      {'id':2,'assistanceType':'Drop Only'},{'id':3,'assistanceType':'Pickup and Drop'}];

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
      /*if($scope.walkinStatus.remarks === 'Phone out of Reach' || $scope.walkinStatus.remarks === 'Switched off' || $scope.walkinStatus.remarks === 'No response to call' || $scope.walkinStatus.remarks === 'Disconnecting the call'){
         $scope.walkinCallLaterForm.$invalid = false;
      }*/

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


  function updateTeleCallingInsuranceDataStatus(teleCallerUpdateDataStatus) {
      $scope.tcStatusUpdateMsg = '';
      console.log('request1...',teleCallerUpdateDataStatus);
      var lsToken = TokenService.getToken(adminUserScId);
      TCInsuranceStatusUpdateService.save({id:adminUserScId,token:lsToken},teleCallerUpdateDataStatus,function(data) {
        console.log('1st resp',data);
        $scope.walkinConfirmStaus = false;
        opdId = data.opdId;
        console.log('opdID : ',opdId);
        $scope.tcStatusUpdateMsg = {msg:data.message,nextApptMsg:'Updating to Next Appointment Details'};
        $timeout( function() {$('#teleCallingStatusUpdateModal').modal('hide');}, 2000);
        if(selectedStausToUpdate !== 'Insurance Done' && selectedStausToUpdate !== 'Insurance Walkin'){
          $timeout( function() { getNextAppointment(nextAppointmentId,selectedataTypeId);}, 3000);
        }
        getAppointmentDetails(selectedApptId,selectedCallerStatus);
       }, function(err) {
        $window.alert(err.data.message);
        console.log(err);
      });
    }
    
 
    var teleCallerUpdateDataStatus = {};
    var assistanceAmount;
    var apptUpdateStatus = undefined;
    var apptConfirmStatus = undefined;
    var selOverDueDate;
    var selServiceDueDate;
    var apptDate;
    var renevalDate;
    $scope.insuranceDoneOption = {};
    var currentFormatedDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    $scope.updateAppointmentStatus = function(appointmentStatus,updateTeleCallingAppointmentStatus,appointmentStatusData) {
     console.log($scope.insuranceDoneOption);
     if($scope.insuranceDoneOption.selectedDate !== undefined && $scope.insuranceDoneOption.selectedDate !== null){
        renevalDate = $scope.insuranceDoneOption.selectedDate.getFullYear() + '-' + ($scope.insuranceDoneOption.selectedDate.getMonth() + 1) + '-' + $scope.insuranceDoneOption.selectedDate.getDate();
        }
       if(appointmentStatus === 'Pickup and Drop') {
          teleCallerUpdateDataStatus = {
            customerId: updateTeleCallingAppointmentStatus.customerId,
            customerName: updateTeleCallingAppointmentStatus.customer_name,
            scId: adminUserScId,
            scName: updateTeleCallingAppointmentStatus.scName,
            //customerMobile: updateTeleCallingAppointmentStatus.customer_mobile,
            customerMobile: $scope.currentMobile.substr(0,10),
            apptId:updateTeleCallingAppointmentStatus.apptId,
            callerId:adminUserId,
            status: appointmentStatus,
            remarksForSubStatus: appointmentStatusData.remarks,
            bikeBrand: updateTeleCallingAppointmentStatus.bikeBrandId,
            bikeModel: updateTeleCallingAppointmentStatus.bikeModel,
            bikeNo: appointmentStatusData.bikeNo,
            //appointmentDateTime: appointmentStatusData.selectedDate,
            //sending date in yyyy/mm/dd format for only pickup and drop status
            appointmentDateTime: selDateTime,
            timeSlot: appointmentStatusData.slot,
            address: appointmentStatusData.address,
            area: appointmentStatusData.area,
            assistanceTypeId: appointmentStatusData.assistanceTypeData,
           // serviceTypeId: appointmentStatusData.serviceTypeData.lsSTId,
            branchId:updateTeleCallingAppointmentStatus.branchId,
            assistanceAmount : appointmentStatusData.assistanceAmount,
            appointTime:appointmentStatusData.timeValue,
            lastCalledStatus : updateTeleCallingAppointmentStatus.apptStatus,
            chassisNo : updateTeleCallingAppointmentStatus.chassisNo,
            mapptId:updateTeleCallingAppointmentStatus.appt
        };
         assistanceAmount = appointmentStatusData.assistanceAmount;

          // console.log(teleCallerUpdateDataStatus.appointmentDateTime);
          // console.log(teleCallerUpdateDataStatus);
         console.log('1st req :',JSON.stringify(teleCallerUpdateDataStatus));
         $scope.pickUpRequest = {};
         $scope.pickupDropForm.$setPristine();
         //updateTeleCallingDataStatus(teleCallerUpdateDataStatus);

//OVER DUE LOGIC START
         if(updateTeleCallingAppointmentStatus.overDueDate !== undefined && updateTeleCallingAppointmentStatus.overDueDate !== 'NA' && updateTeleCallingAppointmentStatus.overDueDate !== null){
         selOverDueDate = new Date(updateTeleCallingAppointmentStatus.formattedOverDueDate);
         selOverDueDate = selOverDueDate.setHours(5,30);
         apptDate = new Date(selDateTime);
         //apptDate = apptDate.setHours(5,30);
         console.log(updateTeleCallingAppointmentStatus.formattedOverDueDate);
         //console.log( $filter('date')(apptDate,'yyyy-MM-dd hh:mm:ss'));
         console.log(apptDate > selOverDueDate);
         console.log(selOverDueDate);
         if(apptDate > selOverDueDate) {
           apptUpdateStatus = $window.confirm('The appointment for this service type can be taken till '+updateTeleCallingAppointmentStatus.overDueDate+'. Would you like to take appointment for next schedule?');
         } else if(apptDate <= selOverDueDate){
           console.log('Regular Appointment Update..!');
           updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
         }
       } else if(updateTeleCallingAppointmentStatus.overDueDate === undefined || updateTeleCallingAppointmentStatus.overDueDate === 'NA' || updateTeleCallingAppointmentStatus.overDueDate === null || updateTeleCallingAppointmentStatus.overDueDate === '0000-00-00 00:00:00'){
          if(updateTeleCallingAppointmentStatus.serviceDueDate !== undefined && updateTeleCallingAppointmentStatus.serviceDueDate !== 'NA' && updateTeleCallingAppointmentStatus.serviceDueDate !== null){
             if(updateTeleCallingAppointmentStatus.serviceDueType !== undefined && updateTeleCallingAppointmentStatus.serviceDueType !== 'NA' && updateTeleCallingAppointmentStatus.serviceDueType !== null){
                var selServiceDueType = updateTeleCallingAppointmentStatus.serviceDueType;
                var paidService = selServiceDueType.toLowerCase().includes("paid");
                if(paidService){
                selServiceDueDate = new Date(updateTeleCallingAppointmentStatus.formattedServiceDueDate);
                var graceDaysToAdd = 45;
               selServiceDueDate = selServiceDueDate.setDate(selServiceDueDate.getDate() + graceDaysToAdd);
               var filteredDueDate = $filter('date')(selServiceDueDate,'yyyy-MM-dd');
               console.log('Grace Service Due Date',selServiceDueDate);
               apptDate = appointmentStatusData.selectedDate;
               if(apptDate > selServiceDueDate) {
                  apptUpdateStatus = $window.confirm('The appointment for this service type can be taken till '+filteredDueDate+'. Would you like to take appointment for next schedule?');
                } else if(apptDate <= selServiceDueDate){
                  console.log('Regular Appointment Update..!');
                  updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
                 }
                } else {
                console.log('Not a Paid Service');
                selServiceDueDate = new Date(updateTeleCallingAppointmentStatus.formattedServiceDueDate);
                if(loginBrandName === 'Yamaha'){
                   var graceDaysForYamaha = 15;
                   selServiceDueDate = selServiceDueDate.setDate(selServiceDueDate.getDate() + graceDaysForYamaha); 
                   var filteredDueDate = $filter('date')(selServiceDueDate,'yyyy-MM-dd');
                   apptDate = appointmentStatusData.selectedDate;
                if(apptDate > selServiceDueDate) {
                  apptUpdateStatus = $window.confirm('The appointment for this service type can be taken till '+filteredDueDate+'. Would you like to take appointment for next schedule?');
                } else if(apptDate <= selServiceDueDate){
                  apptUpdateStatus = false;
                  console.log('Regular Appointment Update..!');
                  updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
                 }
                }
                else if(loginBrandName !== 'Yamaha'){
                  var filteredDueDate = $filter('date')(selServiceDueDate,'yyyy-MM-dd');
                  apptDate = appointmentStatusData.selectedDate;
                if(apptDate > selServiceDueDate) {
                  apptUpdateStatus = $window.confirm('The appointment for this service type can be taken till '+filteredDueDate+'. Would you like to take appointment for next schedule?');
                } else if(apptDate <= selServiceDueDate){
                  apptUpdateStatus = false;
                  console.log('Regular Appointment Update..!');
                  updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
                 }
                }
               }
             }
          }
       }

       if(apptUpdateStatus === true ){
          console.log('Appointment will book for Next Schedule.');
          var selApptDate = appointmentStatusData.selectedDate.getFullYear() + '-' + (appointmentStatusData.selectedDate.getMonth() + 1) + '-' + appointmentStatusData.selectedDate.getDate();
          apptConfirmStatus = $window.confirm('The appointment is booked on '+selApptDate+'. for the '+updateTeleCallingAppointmentStatus.nextApptType+'. Would you like to confirm?')
          /*if(updateTeleCallingAppointmentStatus.nextApptId !== 'NA' && updateTeleCallingAppointmentStatus.nextApptId !== null && updateTeleCallingAppointmentStatus.nextApptId !== undefined){
             teleCallerUpdateDataStatus.apptId = updateTeleCallingAppointmentStatus.nextApptId;
             console.log(JSON.stringify(teleCallerUpdateDataStatus));
             updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
          } else{
            updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
          }*/
        } else if(apptUpdateStatus === false){
           console.log('Cancelled the Appointment..!');
        }

        if(apptConfirmStatus === true ){
          console.log('Appointment will book for Next Schedule.');
            if(updateTeleCallingAppointmentStatus.nextApptId !== 'NA' && updateTeleCallingAppointmentStatus.nextApptId !== null && updateTeleCallingAppointmentStatus.nextApptId !== undefined){
             teleCallerUpdateDataStatus.apptId = updateTeleCallingAppointmentStatus.nextApptId;
             console.log(JSON.stringify(teleCallerUpdateDataStatus));
             updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
          } else{
            updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
          }
        } else if(apptConfirmStatus === false){
           console.log('Cancelled the Confirmation..!');
        }
       //OVER DUE LOGIC START
      }

    else if(appointmentStatus === 'Not Interested') {
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
           lastCalledStatus : updateTeleCallingAppointmentStatus.apptStatus,
           chassisNo : updateTeleCallingAppointmentStatus.chassisNo,
           bikeModel : updateTeleCallingAppointmentStatus.bikeModel,
           bikeNo : updateTeleCallingAppointmentStatus.bikeNo,
           mapptId:updateTeleCallingAppointmentStatus.appt
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
           chassisNo : updateTeleCallingAppointmentStatus.chassisNo,
           bikeModel : updateTeleCallingAppointmentStatus.bikeModel,
           bikeNo : updateTeleCallingAppointmentStatus.bikeNo,
           mapptId:updateTeleCallingAppointmentStatus.appt
         };
        console.log(JSON.stringify(teleCallerUpdateDataStatus));
         $scope.serviceDoneStatus = {};
         $scope.serviceDoneForm.$setPristine();
         updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
         // console.log(teleCallerUpdateDataStatus);
       }
       else if(appointmentStatus === 'Insurance Done') {
         teleCallerUpdateDataStatus = {
           customerId: updateTeleCallingAppointmentStatus.insuranceId,
           customerName: updateTeleCallingAppointmentStatus.customerName,
           status: appointmentStatus,
           //statusForSubStatus: serviceDoneSubStatus,
           subStatus: serviceDoneSubStatus,
           scId: adminUserScId,
           scName: updateTeleCallingAppointmentStatus.scName,
           customerMobile: $scope.currentMobile.substr(0,10),
           apptId:updateTeleCallingAppointmentStatus.insuranceApptId,
           callerId:adminUserId,
           remarksForSubStatus: $scope.insuranceDoneStatus.scComplaintManualRemarks,
           branchId:updateTeleCallingAppointmentStatus.insuranceBranchId,
           lastCalledStatus : updateTeleCallingAppointmentStatus.lastCalledStatus,
           renewalDate: renevalDate
          };
         console.log(JSON.stringify(teleCallerUpdateDataStatus));
         $scope.insuranceDoneStatus = {};
         $scope.insuranceDoneForm.$setPristine();
         updateTeleCallingInsuranceDataStatus(teleCallerUpdateDataStatus);
       }
       else if(appointmentStatus === 'Insurance Walkin') {
         teleCallerUpdateDataStatus = {
           customerId: updateTeleCallingAppointmentStatus.insuranceId,
           customerName: updateTeleCallingAppointmentStatus.customerName,
           status: 'Walkin',
           appointmentDateTime: appointmentStatusData.selectedDate,
           subStatus: appointmentStatusData.remarks,
           scId: adminUserScId,
           scName: updateTeleCallingAppointmentStatus.scName,
           customerMobile: $scope.currentMobile.substr(0,10),
           apptId:updateTeleCallingAppointmentStatus.insuranceApptId,
           callerId:adminUserId,
           branchId:updateTeleCallingAppointmentStatus.insuranceBranchId,
           remarksForSubStatus: appointmentStatusData.manualRemarks,
           appointTime: appointmentStatusData.timeValue,
           lastCalledStatus : updateTeleCallingAppointmentStatus.lastCalledStatus,
           dataType : 'Insurance Data'
          };
         console.log(JSON.stringify(teleCallerUpdateDataStatus));
         $scope.insuranceDoneStatus = {};
         $scope.insuranceWalkinForm.$setPristine();
         updateTeleCallingInsuranceDataStatus(teleCallerUpdateDataStatus);
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
          //customerMobile: updateTeleCallingAppointmentStatus.customer_mobile,
          customerMobile: $scope.currentMobile.substr(0,10),
          apptId:updateTeleCallingAppointmentStatus.apptId,
          callerId:adminUserId,
           branchId:updateTeleCallingAppointmentStatus.branchId,
           remarksForSubStatus: appointmentStatusData.manualRemarks,
           serviceDueDate:updateTeleCallingAppointmentStatus.serviceDueDate,
           serviceDueType:updateTeleCallingAppointmentStatus.serviceDueType,
           appointTime:appointmentStatusData.timeValue,
           lastCalledStatus : updateTeleCallingAppointmentStatus.apptStatus,
           chassisNo : updateTeleCallingAppointmentStatus.chassisNo,
           bikeModel : updateTeleCallingAppointmentStatus.bikeModel,
           bikeNo : updateTeleCallingAppointmentStatus.bikeNo,
           mapptId:updateTeleCallingAppointmentStatus.appt
        };
        console.log('selected time is',teleCallerUpdateDataStatus.appointTime);
        console.log('request obj :',teleCallerUpdateDataStatus);
         if($scope.walkinConfirmStaus === true){
           teleCallerUpdateDataStatus.status = 'walkincompleted';
           teleCallerUpdateDataStatus.subStatus = 'Yes';
         }else{

         }
        /* if(!$scope.walkinStatus.manualRemarks){
           $scope.walkinCallLaterForm.$invalid = true;
         }*/
        console.log(JSON.stringify(teleCallerUpdateDataStatus));
        $scope.walkinStatus = {};
        $scope.walkinCallLaterForm.$setPristine();
        $scope.notInterestedStatus = {};
        $scope.notInterestedForm.$setPristine();
        // updateTeleCallingDataStatus(teleCallerUpdateDataStatus);

//OVER DUE LOGIC START
    if(appointmentStatusData.remarks === 'Customer agreed to Walkin' || appointmentStatusData.remarks === 'Customer tentively agreed to Walkin' || appointmentStatusData.remarks === 'Customer will call and Confirm' || appointmentStatusData.remarks === 'Out of Station' || appointmentStatusData.remarks === 'Customer Busy' || appointmentStatusData.remarks === 'Required KMs not travelled' || appointmentStatusData.remarks === 'Phone out of Reach'|| appointmentStatusData.remarks === 'Switched off'|| appointmentStatusData.remarks === 'No response to call'|| appointmentStatusData.remarks === 'Disconnecting the call'){
        if(updateTeleCallingAppointmentStatus.overDueDate !== undefined && updateTeleCallingAppointmentStatus.overDueDate !== 'NA' && updateTeleCallingAppointmentStatus.overDueDate !== null){
         selOverDueDate = new Date(updateTeleCallingAppointmentStatus.formattedOverDueDate);
         apptDate = appointmentStatusData.selectedDate;
         if(apptDate === undefined){
           apptDate = new Date();
         }
         console.log(updateTeleCallingAppointmentStatus.formattedOverDueDate);
         console.log(selOverDueDate);
         console.log(apptDate);
         console.log(apptDate > selOverDueDate);
         if(apptDate > selOverDueDate) {
           apptUpdateStatus = $window.confirm('The appointment for this service type can be taken till '+updateTeleCallingAppointmentStatus.overDueDate+'. Would you like to take appointment for next schedule?');
         } else if(apptDate <= selOverDueDate){
           console.log('Regular Appointment Update..!');
           updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
         }
       } else if(updateTeleCallingAppointmentStatus.overDueDate === undefined || updateTeleCallingAppointmentStatus.overDueDate === 'NA' || updateTeleCallingAppointmentStatus.overDueDate === null || updateTeleCallingAppointmentStatus.overDueDate === '0000-00-00 00:00:00'){
          if(updateTeleCallingAppointmentStatus.serviceDueDate !== undefined && updateTeleCallingAppointmentStatus.serviceDueDate !== 'NA' && updateTeleCallingAppointmentStatus.serviceDueDate !== null){
             if(updateTeleCallingAppointmentStatus.serviceDueType !== undefined && updateTeleCallingAppointmentStatus.serviceDueType !== 'NA' && updateTeleCallingAppointmentStatus.serviceDueType !== null){
                var selServiceDueType = updateTeleCallingAppointmentStatus.serviceDueType;
                var paidService = selServiceDueType.toLowerCase().includes("paid");
                if(paidService){
                selServiceDueDate = new Date(updateTeleCallingAppointmentStatus.formattedServiceDueDate);
                var graceDaysToAdd = 45;
                selServiceDueDate = selServiceDueDate.setDate(selServiceDueDate.getDate() + graceDaysToAdd); 
                var filteredDueDate = $filter('date')(selServiceDueDate,'yyyy-MM-dd');
               console.log('Grace Service Due Date',filteredDueDate);
               apptDate = appointmentStatusData.selectedDate;
               if(apptDate === undefined){
                  apptDate = new Date();
               }
               if(apptDate > selServiceDueDate) {
                  apptUpdateStatus = $window.confirm('The appointment for this service type can be taken till '+filteredDueDate+'. Would you like to take appointment for next schedule?');
                } else if(apptDate <= selServiceDueDate){
                  apptUpdateStatus = false;
                  console.log('Regular Appointment Update..!');
                  updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
                 }
                } else {
                console.log('Not a Paid Service');
                selServiceDueDate = new Date(updateTeleCallingAppointmentStatus.formattedServiceDueDate);
                if(loginBrandName === 'Yamaha'){
                   var graceDaysForYamaha = 15;
                   selServiceDueDate = selServiceDueDate.setDate(selServiceDueDate.getDate() + graceDaysForYamaha); 
                   var filteredDueDate = $filter('date')(selServiceDueDate,'yyyy-MM-dd');
                   apptDate = appointmentStatusData.selectedDate;
                   if(apptDate === undefined){
                      apptDate = new Date();
                    }
                if(apptDate > selServiceDueDate) {
                  apptUpdateStatus = $window.confirm('The appointment for this service type can be taken till '+filteredDueDate+'. Would you like to take appointment for next schedule?');
                } else if(apptDate <= selServiceDueDate){
                  apptUpdateStatus = false;
                  console.log('Regular Appointment Update..!');
                  updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
                 }
                }
                else if(loginBrandName !== 'Yamaha'){
                  var filteredDueDate = $filter('date')(selServiceDueDate,'yyyy-MM-dd');
                  apptDate = appointmentStatusData.selectedDate;
                  if(apptDate === undefined){
                     apptDate = new Date();
                  }
                if(apptDate > selServiceDueDate) {
                  apptUpdateStatus = $window.confirm('The appointment for this service type can be taken till '+filteredDueDate+'. Would you like to take appointment for next schedule?');
                } else if(apptDate <= selServiceDueDate){
                  apptUpdateStatus = false;
                  console.log('Regular Appointment Update..!');
                  updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
                 }
                }
              }
             }
          }
       }
    }
    
     /*if(appointmentStatusData.remarks !== 'Customer agreed to Walkin' && appointmentStatusData.remarks !== 'Customer tentively agreed to Walkin' && appointmentStatusData.remarks !== 'Customer will call and Confirm' && appointmentStatusData.remarks !== 'Out of Station' && appointmentStatusData.remarks !== 'Customer Busy' && appointmentStatusData.remarks !== 'Required KMs not travelled'){
       updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
     }*/

        if(apptUpdateStatus === true ){
          var selApptDate;
          console.log('Appointment will book for Next Schedule.');
          if(appointmentStatusData.selectedDate){
            selApptDate = appointmentStatusData.selectedDate.getFullYear() + '-' + (appointmentStatusData.selectedDate.getMonth() + 1) + '-' + appointmentStatusData.selectedDate.getDate();
          }
          if(appointmentStatusData.remarks === 'Phone out of Reach'|| appointmentStatusData.remarks === 'Switched off'|| appointmentStatusData.remarks === 'No response to call'|| appointmentStatusData.remarks === 'Disconnecting the call'){
             apptDate = new Date(apptDate);
             var tomorrowDate = apptDate.setDate(apptDate.getDate() + 1);
             var formatedTomorrowDate = apptDate.getFullYear() + '-' + (apptDate.getMonth() + 1) + '-' +apptDate.getDate();
             console.log(formatedTomorrowDate);
             selApptDate = formatedTomorrowDate;
          }
          if(appointmentStatusData.remarks === 'Customer agreed to Walkin'){
              apptConfirmStatus = $window.confirm('The appointment is booked on '+selApptDate+'. for the '+updateTeleCallingAppointmentStatus.nextApptType+'. Would you like to confirm?')
          } else {
                apptConfirmStatus = $window.confirm('The appointment is rescheduled on '+selApptDate+'. for the '+updateTeleCallingAppointmentStatus.nextApptType+'. Would you like to confirm?')
          }
           /*if(updateTeleCallingAppointmentStatus.nextApptId !== 'NA' && updateTeleCallingAppointmentStatus.nextApptId !== null && updateTeleCallingAppointmentStatus.nextApptId !== undefined){
             teleCallerUpdateDataStatus.apptId = updateTeleCallingAppointmentStatus.nextApptId;
             console.log(JSON.stringify(teleCallerUpdateDataStatus));
             updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
          } else{
            updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
          }*/
        } else if(apptUpdateStatus === false){
           console.log('Cancelled the Appointment..!');
        }
         if(apptConfirmStatus === true ){
          console.log('Appointment will book for Next Schedule.');
            if(updateTeleCallingAppointmentStatus.nextApptId !== 'NA' && updateTeleCallingAppointmentStatus.nextApptId !== null && updateTeleCallingAppointmentStatus.nextApptId !== undefined){
             teleCallerUpdateDataStatus.apptId = updateTeleCallingAppointmentStatus.nextApptId;
             console.log(JSON.stringify(teleCallerUpdateDataStatus));
             updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
          } else{
            updateTeleCallingDataStatus(teleCallerUpdateDataStatus);
          }
        } else if(apptConfirmStatus === false){
           console.log('Cancelled the Confirmation..!');
        }

//OVER DUE LOGIC END
        
      }
    };

    $scope.feedBackObject = {};
    $scope.feedBackRemarksObject = {};
    var updateFeedbackCRMData = [];
    $scope.updateUserFeedBack = function (feedbackData,feedbackRemarksData,apptData) {
      feedbackData[4] = '';
      var feedBackDataArray = Object.keys(feedbackData);
      var feedBackLength = feedBackDataArray.length;
      var feedbackRemarksDataArray = Object.keys(feedbackRemarksData);
      if(feedBackLength >= 4) {
        angular.forEach(feedBackDataArray, function (feedbackVal) {
          var updateFeedbackData = {
            customerId: apptData.customerId,
            apptId: apptData.apptId,
            feedBackListId: feedbackVal,
            feedBackRemarks: feedbackRemarksData[feedbackVal],
            feedBackStatus: feedbackData[feedbackVal],
            scId:adminUserScId,
            loginId:adminUserId,
            rating:feedbackData[feedbackVal]
          };
          updateFeedbackCRMData.push(updateFeedbackData);
        });
        console.log(JSON.stringify());
        $scope.feedBackObject = {};
        $scope.feedBackRemarksObject = {};
        $scope.feedbackForm.$setPristine();
        sendFeedBackData(updateFeedbackCRMData);
      } else {
        $window.alert('Kindly select all the fields');
      }
    };

    function sendFeedBackData(feedBackRequest) {
      console.log(JSON.stringify(feedBackRequest));
      var lsToken = TokenService.getToken(adminUserScId);
      FeedBackDataService.save({id:adminUserScId,token:lsToken},feedBackRequest, function(data) {
        $scope.tcStatusUpdateMsg = data.message;
        updateFeedbackCRMData = [];
        //getTeleCallerStats();
        //getTeleCallingAppointmentData(adminSelectedFromDate,adminSelectedToDate,adminLoggedInId,adminLoggedInRole,adminSelectedSubStatus,adminSelectedDataType);
        //getPendingCallStats();
        $('#tcAppointmentDetailsPage').hide();
      }, function (err) {
        console.log(err);
      });
    }

    $scope.callTeleCallingCustomer = function (teleCallingData,mobile) {
      //console.log(mobile);
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
          checkActiveInactiveStatus = false;
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


    $scope.addRefferelCustomer = function(referelObj) {
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(referelObj));
      UpdateTelecallerServiceCenterService.save({id:adminUserScId,token:lsToken}, referelObj, function (data) {
        //$window.alert(data.message);
        $scope.addReferelSuccessMsg = data.message;
        checkActiveInactiveStatus = false;
        getAppointmentDetails(selectedApptId,selectedCallerStatus);
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
      //console.log('newPhoneNumber',status);
      $scope.editPhoneSuccessMsg = '';
      var editPhoneObj = {
        mobile: selMobile,
        customerName: apptObj.customer_name,
        chassisNo : apptObj.chassisNo,
        scId : adminUserScId,
        defaultNumber:defaultNumStatus,
        customerId : apptObj.customerId,
        customerStatus : selectedMobileStatus
      };
      console.log(JSON.stringify(editPhoneObj));
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateCustomerPhoneService.save({id:adminUserScId,token:lsToken}, editPhoneObj, function (data) {
        console.log(data);
        $scope.editPhoneSuccessMsg = data.message;
        checkActiveInactiveStatus = false;
        //getAppointmentDetails(selectedApptId,selectedCallerStatus);
        $timeout(function() {
          $('#editPhoneModal').modal('hide');
          $("#activeDeactivePhoneModal").modal('hide');
          getAppointmentDetails(selectedApptId,selectedCallerStatus);
        }, 2000);
        $scope.phoneObj = {};
        $scope.editPhoneForm.$setPristine();
        }, function (err) {
        console.log(err);
        $scope.editPhoneErrorMsg = err.data.message;
      });
    };

    var selectedDateToUpdate;
    var filteredSelectedDate;
    $scope.getSelectedDate = function (selDate) {
      if(selDate){
         filteredSelectedDate = selDate.getFullYear() + '-' + ('0' + (selDate.getMonth() + 1)).slice(-2) + '-' + ('0' + selDate.getDate()).slice(-2);
      }
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

    /*$scope.getSelectedReason = function (reason) {
      if(reason === 'Service Center Complaint'){
        console.log($scope.serviceCenterComplaints);
        //$scope.notInterestedForm.$invalid = true;
        if($scope.serviceCenterComplaints.length === 0){
          $scope.notInterestedForm.$invalid = true;
        }
      }
    };*/
    $scope.getSelectedReason = function (reason) {
     // alert('Alert here');
     if(reason === 'Service Center Complaint'){
       console.log($scope.serviceCenterComplaints);
       //$scope.notInterestedForm.$invalid = true;
       if($scope.serviceCenterComplaints.length === 0){
         $scope.notInterestedForm.$invalid = true;
       }
     } else if ($scope.notInterestedStatus.remarks === 'Wrong Number' || $scope.notInterestedStatus.remarks === 'Vehicle Sold' || $scope.notInterestedStatus.remarks === 'Repetitive reminder') {
       $scope.notInterestedForm.$invalid = false;
     }
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
         console.log(item);
        serviceCenterComplaints.push(item.id);
        if(serviceCenterComplaints.length > 0){
          $scope.notInterestedForm.$invalid = false;
          console.log('item : : :',item);
          if(item.id === 'Others'){
             $scope.notInterestedForm.$invalid = true;
          }
        }else if(serviceCenterComplaints.length === 0){
          $scope.notInterestedForm.$invalid = true;
        }
      },
      onItemDeselect: function(item) {
        console.log(item);
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
      getAppointmentHistoryData($scope.tcAppointmentData.chassisNo);
      getServiceHistoryData ($scope.tcAppointmentData.chassisNo);
      getLsHistory($scope.tcAppointmentData.chassisNo);
    };


    function getLsHistory(selChassisNo) {
      //console.log(selChassisNo);
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerLSHistoryDataService.query({chassisNo:selChassisNo,scId:adminUserScId,token:lsToken},function (data) {
       console.log('LS history data :',data);
       $scope.lsHistoryData = data;
       showLoader(false);
      }, function (err) {
        showLoader(false);
        console.log('LS history error data',err);
        $scope.lsHistoryDataErrorMsg = err.data.message;
      });
    }

    $scope.walkinRemarkCheck = function(){
      if($scope.walkinStatus.remarks !== undefined){
        if($scope.walkinStatus.remarks !== 'Customer agreed to Walkin' && $scope.walkinStatus.remarks !== 'Customer tentively agreed to Walkin' && $scope.walkinStatus.remarks !== 'Customer will call and Confirm' && $scope.walkinStatus.remarks !== 'Out of Station' && $scope.walkinStatus.remarks !== 'Customer Busy' && $scope.walkinStatus.remarks !== 'Required KMs not travelled'){
        $scope.walkinCallLaterForm.$invalid = false;
      }
      }else {
        $scope.walkinCallLaterForm.$invalid = true;
      }
    };

    /* $scope.walkinRemarkCheck = function(){
      if($scope.walkinStatus.remarks === 'Customer agreed to Walkin'|| $scope.walkinStatus.remarks === 'Customer will call and Confirm' || $scope.walkinStatus.remarks === 'Out of Station' || $scope.walkinStatus.remarks === 'Customer Busy'){
      if($scope.walkinStatus.remarks !== undefined){
        if($scope.walkinStatus.selectedDate !== undefined){
          $scope.walkinCallLaterForm.$invalid = false;
        }
      }
     }
      else if($scope.walkinStatus.remarks !== 'Customer agreed to Walkin' && $scope.walkinStatus.remarks !== 'Customer will call and Confirm' && $scope.walkinStatus.remarks !== 'Out of Station' && $scope.walkinStatus.remarks !== 'Customer Busy'){
        if($scope.walkinStatus.manualRemarks !== undefined){
          $scope.walkinCallLaterForm.$invalid = false;
        }
      }
     };
    */

/*$scope.notInterestedRemarkCheck = function(){
       if(serviceCenterComplaints.toString() === 'Others'){
          if($scope.notInterestedStatus.scComplaintManualRemarks === '' || $scope.notInterestedStatus.scComplaintManualRemarks === undefined){
             $scope.notInterestedForm.$invalid = true;
          }
          }
      if($scope.notInterestedStatus.scComplaintManualRemarks !== undefined){
        if($scope.notInterestedStatus.remarks === 'Service Center Complaint'){
           if($scope.serviceCenterComplaints.length === 0){
          $scope.notInterestedForm.$invalid = true;
        }
        
        } else if($scope.notInterestedStatus.remarks !== 'Service Center Complaint'){
          $scope.notInterestedForm.$invalid = false;
        }
       
      }
    };*/

    $scope.notInterestedRemarkCheck = function(){
   if(serviceCenterComplaints.toString() === 'Others'){
     if($scope.notInterestedStatus.scComplaintManualRemarks === '' || $scope.notInterestedStatus.scComplaintManualRemarks === undefined){
       $scope.notInterestedForm.$invalid = true;
     }
   }
   if($scope.notInterestedStatus.scComplaintManualRemarks !== undefined) {
     if($scope.notInterestedStatus.remarks === '' || $scope.notInterestedStatus.remarks === null || $scope.notInterestedStatus.remarks === undefined){
       $scope.notInterestedForm.$invalid = true;
     } else if($scope.notInterestedStatus.remarks === 'Service Center Complaint') {
       if($scope.serviceCenterComplaints.length === 0){
         $scope.notInterestedForm.$invalid = true;
       }
     } else if($scope.notInterestedStatus.remarks === 'Customer shifted' || $scope.notInterestedStatus.remarks === 'More Distance') {
       if($scope.notInterestedStatus.area === undefined || $scope.notInterestedStatus.area === '' || $scope.notInterestedStatus.area === null ){
         $scope.notInterestedForm.$invalid = true;
       } else {
        $scope.notInterestedForm.$invalid = false;
       }
     } else if($scope.notInterestedStatus.remarks !== 'Service Center Complaint'){
       $scope.notInterestedForm.$invalid = false;
     }
   } else {
     $scope.notInterestedForm.$invalid = false;
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

    var futureRemStatus = false;
  $scope.createFutureReminder = function(object){ 
       futureRemStatus = $window.confirm('Are you sure to create the Future Reminder?');
       if(futureRemStatus === true){
          var remObject = {
        'dateOfSale': object.dateOfSale,
        'apptId' : object.apptId,
        'reminder' : object.reminder,
        'assignedId' : object.assignedId,
        'chassisNo' : object.chassisNo,
        'bikeType' :object.bikeType,
        'lastServiceDueDate' : object.serviceDueDate,
        'scId' : adminUserScId,
        'branchId' :object.branchId
       }
       console.log(JSON.stringify(remObject));
       var lsToken = TokenService.getToken(adminUserScId);
       CreateFutureReminderService.save({scId:adminUserScId,token:lsToken},remObject,function(data) {
        console.log('FutUre Reminder Resp : :',data);
        $window.alert(data.message);
        getLsHistory($scope.tcAppointmentData.chassisNo);
      }, function (err) {
        console.log('FutUre Reminder Error Resp : :',err);
      });
    } else if(futureRemStatus === false){
        console.log('FutUre Reminder Creation Cancelled');
    }
       
    }

});
