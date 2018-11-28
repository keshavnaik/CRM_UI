'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('crmAdminCallerDashboardController', function ($scope,$sce,serviceURL,$timeout,$filter,$cookies,ngTableParams,$rootScope,$window,TokenService,TeleCallerHourWiseDataService,CreDashboardStatsDataService,TeleCallerWeeklyWiseDataService,GetScWiseTeleCallerService,GetAdminCallerDashboardConversionStatsService,GetAdminCallerConversionService,GetCallerWiseRevenueStatsService,GetServiceCenterComplaintsService,TeleCallerCallStatsDataService,GetCallerWiseConversionStatsService,TeleCallerWiseServiceCenterService,AdminCustomerDetailsService,AdminCustomerDetailsStatusWiseService,AdminCustomerDetailsScComplaintWiseService,TeleCallerPerticularAppointmentHistoryDataService,TeleCallingCallRecordService,AdminCustomerDetailsStatsWiseService,GetSuperAdminDealerListService,GetDueTypeStatsService,TeleCallerPerticularAppointmentDataService,ServiceTypeService,TeleCallerLSHistoryDataService,CallerPerformanceMonthlyTotalPotentialStatsService,CallerPerformanceDueDatewiseStatsService,CallerPerformanceCompletePotentialStatsService,CallerPerformanceTotalDueDateStatsService,AdminCustomerCompletePotentialDetailsService,AdminCustomerPotentialDetailsService,UpdateCustomerPhoneService,CreateFutureReminderService,GetStatusWiseConversionDetailsService) {

    /*var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');
    */
    var adminUserId = $cookies.get('loggedInUserIdAdmin');
    var adminUserScId = $cookies.get('loggedInUserScIdAdmin');
    var loginBrandName = $cookies.get('loggedInUserBikeBrandAdmin');

    $scope.openCalendar = function(e,status) {
      e.preventDefault();
      e.stopPropagation();
      if(status === 'FromDate') {
        $scope.isOpenFrom = true;
      } else {
        $scope.isOpenTo = true;
      }
    };

    $scope.openCalendarStatus = function(e) {
      $scope.minDate = new Date();
      e.preventDefault();
      e.stopPropagation();
      $scope.isOpenFromStatus = true;
    };

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

     var selectedCaller = 'caller';
     var selectedBranch = 'branch';
     var selectedDataType = 'all';

  function getSuperAdminDealerList() {
      var lsToken = TokenService.getToken(adminUserId);
      GetSuperAdminDealerListService.query({logInId:adminUserId,token:lsToken}, function(data) {
        $scope.dealerList = data;
        console.log('dealerList +++',data);
      }, function(err) {
        $scope.dealerListErrorMsg = err.data.message;
      });
    }
    getSuperAdminDealerList();


$scope.getFeedbackFilter = function (status) {
      console.log(status);
      if(status){
        $scope.feedBackFilter = true;
      }else {
        $scope.feedBackFilter = false;
        $scope.tcAppointment.selectedFromDate = '';
        $scope.tcAppointment.selectedToDate = '';
        selectedFromDateConversion = 'month';
        selectedToDateConversion = 'month';
        $scope.selectedFromDate = 'month';
        $scope.selectedToDate = 'month';
        if (potentialStatus === 'performance analysis') {
          getCallLaterConversionData('Call Later',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
          getNotInterestedConversionData('Not Interested',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
          getConversionData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
          getServiceCenterComplaintsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
        } else {
          // getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
          getCallerPerformanceStats(selectedCaller,selectedBranch,potentialStatus);
          getCallerPerformanceTotalMonthyStats(selectedCaller,selectedBranch,potentialStatus);
        }
      }
    };


   $scope.getSelectedDealer = function (selDealer) {
      selectedCaller = 'caller';
      selectedBranch = 'branch';
      console.log(selDealer);
      adminUserScId = selDealer;
      $rootScope.scIdSuperAdmin = selDealer;
     getServiceCenterTeleCallerWise(adminUserScId);
     getScWiseCallerList(adminUserScId);
     $scope.getDealerPerformanceData(potentialStatus);
    };

    function getScWiseCallerList(id) {
      adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.callerList = data;
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }
    getScWiseCallerList(adminUserScId);

     function getServiceCenterTeleCallerWise(id) {
      adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
       // console.log('hi',data);
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise(adminUserScId);


    $scope.adminCallerStatsByDate = function(selFromDate,selToDate){
       //$scope.selectedFromDate = '';
       // $scope.selectedToDate  = '';
       if(selFromDate > selToDate) {
        $window.alert('To Date should be greater than From Date');
      } else {
        selectedFromDateConversion = selFromDate.getFullYear() + '-' + (selFromDate.getMonth() + 1) + '-' + selFromDate.getDate();
        selectedToDateConversion = selToDate.getFullYear() + '-' + (selToDate.getMonth() + 1) + '-' + selToDate.getDate();
        $scope.selectedFromDate = selectedFromDateConversion;
        $scope.selectedToDate = selectedToDateConversion;
        if (potentialStatus === 'performance analysis') {
          getCallLaterConversionData('Call Later',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
          getNotInterestedConversionData('Not Interested',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
          getConversionData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
          getServiceCenterComplaintsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
        } else {
          //getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
          getCallerPerformanceStats(selectedCaller,selectedBranch,potentialStatus);
          getCallerPerformanceTotalMonthyStats(selectedCaller,selectedBranch,potentialStatus);
        }
      }
    };

   $scope.getSelectedCaller = function (selCaller) {
      console.log(selCaller);
      selectedCaller = selCaller;
      if(selCaller === null){
        selectedCaller = 'caller';
      }
    $scope.getDealerPerformanceData(potentialStatus);
   };

    $scope.getSelectedBranch = function (selBranch) {
      console.log('selected branch',selBranch);
      selectedBranch = selBranch;
      if(selBranch === null){
        selectedBranch = 'branch';
      }
     $scope.getDealerPerformanceData(potentialStatus);
   };

  var selectedFromDateConversion = 'month';
  var selectedToDateConversion = 'month';
  $scope.selectedFromDate = 'month';
  $scope.selectedToDate = 'month';
  $scope.creDashboardDataDisplay = [];
  $scope.potentialServiecDue = 1;

  var potentialStatus = 'service due date';
  $scope.getDealerPerformanceData = function(status){
    $scope.selectedStatus = status;
    potentialStatus = status;
    $scope.selFilter = status;
    if(status === 'service due date' || status === 'complete'){
      $scope.callerNewStats = true; 
      $scope.callerOldStats = false; 
      $scope.performanceAnalysis = false;
      getCallerPerformanceStats(selectedCaller,selectedBranch,potentialStatus);
      getCallerPerformanceTotalMonthyStats(selectedCaller,selectedBranch,potentialStatus);
    } else if(status === 'old stats'){
      $scope.callerNewStats = false; 
      $scope.callerOldStats = true; 
      $scope.performanceAnalysis = false;
      getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
    }
    else if(status === 'performance analysis'){
      selectedFromDateConversion = 'month';
      selectedToDateConversion = 'month';
      $scope.selectedFromDate = 'month';
      $scope.selectedToDate = 'month';
      $scope.callerNewStats = false; 
      $scope.callerOldStats = false; 
      $scope.performanceAnalysis = true;
      getCallerLiveStats(adminUserScId);
      //getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
      $scope.getHourWiseTeleCallerData(selectedFromDate,adminUserId,selectedCaller,selectedBranch);
      $scope.getWeeklyWiseTeleCallerData(selectedFromDate,adminUserId,selectedCaller,selectedBranch);
      getCallLaterConversionData('Call Later',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
      getNotInterestedConversionData('Not Interested',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
      getConversionData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
      getServiceCenterComplaintsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
      getCallerWiseConversionData(selectedCaller,selectedBranch);
      getCallerWiseRevenueData(selectedType,selectedBranch);
      getDueTypeWiseStatsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
   }
   }
  $scope.getDealerPerformanceData(potentialStatus);


var selectedFromDateConversion = 'month';
var selectedToDateConversion = 'month';
$scope.selectedFromDate = 'month';
$scope.selectedToDate = 'month';
    function getCreDashboardData(selCaller,selBranch,selFromDate,selToDate) {
      var totalAllocated = 0;
      var totalAttemptedCount = 0;
      var totalConnectedCount = 0;
      var totalCallLaterCount = 0;
      var totalNotInterestedCount = 0;
      var totalServiceDoneCount = 0;
      var totalAppointmentTaken = 0;
      var totalMTDConversion = 0;
      var totalNonConverted = 0;
      var totalPendingCount= 0;
      var totalFreshCalls= 0;
      var totalTotalAttempted= 0;
      var totalAllocatedConverted= 0;
      selectedFromDateConversion = selFromDate;
      selectedToDateConversion = selToDate;
      selectedCaller = selCaller;
      selectedBranch = selBranch;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardStatsDataService.query({scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,token:lsToken},     function(data) {
        console.log('cre dashboard data :',data);
        $scope.creDashboardData = data;
        $scope.creDashboardDataErrorMsg = '';
        angular.forEach($scope.creDashboardData,function(val,index){
          if($scope.creDashboardData[index] !== undefined && $scope.creDashboardData[index] !== null){
             totalAllocated += parseInt($scope.creDashboardData[index].allocated);
             totalAttemptedCount += parseInt($scope.creDashboardData[index].attemptedCount);
             totalConnectedCount += parseInt($scope.creDashboardData[index].connectedCount);
             totalCallLaterCount += parseInt($scope.creDashboardData[index].callLaterCount);
             totalNotInterestedCount += parseInt($scope.creDashboardData[index].notInterestedCount);
             totalServiceDoneCount += parseInt($scope.creDashboardData[index].serviceDoneCount);
             totalAppointmentTaken += parseInt($scope.creDashboardData[index].appointmentTaken);
             totalMTDConversion += parseInt($scope.creDashboardData[index].MTDConversion);
             totalNonConverted += parseInt($scope.creDashboardData[index].nonConverted);
             totalPendingCount += parseInt($scope.creDashboardData[index].pendingCount);
             totalFreshCalls += parseInt($scope.creDashboardData[index].freshCalls);
             totalTotalAttempted += parseInt($scope.creDashboardData[index].totalAttempted);
             totalAllocatedConverted += parseInt($scope.creDashboardData[index].allocatedConversion);
          }  
         });
        if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
           $scope.creDashboardData.push({"dataTypename":"Total","allocated":totalAllocated,"attemptedCount":totalAttemptedCount,"connectedCount":totalConnectedCount,"callLaterCount":totalCallLaterCount,"notInterestedCount":totalNotInterestedCount,"serviceDoneCount":totalServiceDoneCount,"appointmentTaken":totalAppointmentTaken,"MTDConversion":totalMTDConversion,"nonConverted":totalNonConverted,"pendingCount":totalPendingCount,"freshCalls":totalFreshCalls,"totalAttempted":totalTotalAttempted,'allocatedConversion':totalAllocatedConverted});
        }
         // console.log(data);
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.creDashboardData = [];
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
 
    //getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);


function getCallerPerformanceStats(selCaller,selBranch,status) {
      console.log('Checking status',status);
      $scope.creDashboardDataDisplay = [];
      /*$scope.totalUniqueAttempted = '';
      $scope.totalConnected = '';*/
      var totalAllocated = 0;
      var totalAttemptedCount = 0;
      var totalConnectedCount = 0;
      var totalCallLaterCountConnected = 0;
       var totalCallLaterCountNonConnected = 0;
      var totalNotInterestedCount = 0;
      var totalServiceDoneCount = 0;
      var totalAppointmentTaken = 0;
      var totalMTDConversion = 0;
      var totalNonConverted = 0;
      var totalPendingCount= 0;
      var totalFreshCalls= 0;
      var totalTotalAttempted= 0;
      var totalPickDrop= 0;
      var totalPendingVisited= 0;
      var totalPendingNotVisited= 0;
      $scope.totalOverDueCount = 0;
      selectedCaller = selCaller;
      selectedBranch = selBranch;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      if(status === 'service due date'){
        $scope.allocatedHeader = 'Total Allocated';
        CallerPerformanceDueDatewiseStatsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,datatypeId:selectedDataType,token:lsToken}, function(data) {
        console.log('CALLER PERFORMANCE BY SERVICE DUE DATE: : :',data);
        $scope.creDashboardData = data;
        angular.forEach($scope.creDashboardData,function(val,index){

          if($scope.creDashboardData[index].uniqueAttempted){
             $scope.totalUniqueAttempted = $scope.creDashboardData[index].uniqueAttempted;
          }
          if($scope.creDashboardData[index].connectedCount){
             $scope.totalConnected = $scope.creDashboardData[index].connectedCount;
          }
          if($scope.creDashboardData[index].notConnectedCount){
             $scope.totalNonConnected = $scope.creDashboardData[index].notConnectedCount;
          } 
          if($scope.creDashboardData[index] !== undefined && $scope.creDashboardData[index] !== null){
            if($scope.creDashboardData[index].allocated !== undefined){
            totalAllocated += parseInt($scope.creDashboardData[index].allocated); 
            }
             totalAttemptedCount += parseInt($scope.creDashboardData[index].attemptedCount);
             if($scope.creDashboardData[index].notConnectedCallLaterCount !== undefined){
             totalCallLaterCountNonConnected += parseInt($scope.creDashboardData[index].notConnectedCallLaterCount);
             $scope.totalCallLaterCountNonConnected = totalCallLaterCountNonConnected;
           }
           if($scope.creDashboardData[index].pendingVisitedCount !== undefined){
             totalPendingVisited += parseInt($scope.creDashboardData[index].pendingVisitedCount);
           }
             if($scope.creDashboardData[index].pendingNonVisitedCount !== undefined){
             totalPendingNotVisited += parseInt($scope.creDashboardData[index].pendingNonVisitedCount);
           }
              if($scope.creDashboardData[index].connectedCallLaterCount !== undefined){
             totalCallLaterCountConnected += parseInt($scope.creDashboardData[index].connectedCallLaterCount);
           }
              if($scope.creDashboardData[index].notInterested !== undefined){
             totalNotInterestedCount += parseInt($scope.creDashboardData[index].notInterested);
           }
              if($scope.creDashboardData[index].serviceDone !== undefined){
             totalServiceDoneCount += parseInt($scope.creDashboardData[index].serviceDone);
           }
              if($scope.creDashboardData[index].appointmentTaken !== undefined){
             totalAppointmentTaken += parseInt($scope.creDashboardData[index].appointmentTaken);
           }
             if($scope.creDashboardData[index].pickAndDrop !== undefined){
              totalPickDrop += parseInt($scope.creDashboardData[index].pickAndDrop);
            }
             totalMTDConversion += parseInt($scope.creDashboardData[index].MTDConversion);
             totalNonConverted += parseInt($scope.creDashboardData[index].nonConverted);
            if($scope.creDashboardData[index].pendingCalls !== undefined){
              totalPendingCount += parseInt($scope.creDashboardData[index].pendingCalls);
             }
             totalFreshCalls += parseInt($scope.creDashboardData[index].freshCalls);
             totalTotalAttempted += parseInt($scope.creDashboardData[index].totalAttempted);
          }  
          if($scope.creDashboardData[index].uniqueAttempted === undefined || $scope.creDashboardData[index].uniqueAttempted === null ){
            $scope.creDashboardDataDisplay.push($scope.creDashboardData[index]);
          } 
         });
        if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
          $scope.creDashboardDataDisplay.push({"dataTypename":"Total","allocated":totalAllocated,"pendingVisitedCount":totalPendingVisited,"pendingNonVisitedCount":totalPendingNotVisited,"pickAndDrop":totalPickDrop,"attemptedCount":totalAttemptedCount,"notConnectedCallLaterCount":totalCallLaterCountNonConnected,"connectedCallLaterCount":totalCallLaterCountConnected,"notInterested":totalNotInterestedCount,"serviceDone":totalServiceDoneCount,"appointmentTaken":totalAppointmentTaken,"MTDConversion":totalMTDConversion,"nonConverted":totalNonConverted,"pendingCalls":totalPendingCount,"freshCalls":totalFreshCalls,"totalAttempted":totalTotalAttempted});
        }
         // console.log(data);
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
      } else if(status === 'complete'){
        $scope.allocatedHeader = 'Total Potential';
        showLoader(true);
              CallerPerformanceCompletePotentialStatsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,datatypeId:selectedDataType,token:lsToken},     function(data) {
        console.log('DEALER PERFORMANCE COMPLETE: : :',data);
        $scope.creDashboardData = data;
        angular.forEach($scope.creDashboardData,function(val,index){

          if($scope.creDashboardData[index].uniqueAttempted){
             $scope.totalUniqueAttempted = $scope.creDashboardData[index].uniqueAttempted;
          }
          if($scope.creDashboardData[index].connectedCount){
             $scope.totalConnected = $scope.creDashboardData[index].connectedCount;
          }
          if($scope.creDashboardData[index].notConnectedCount){
             $scope.totalNonConnected = $scope.creDashboardData[index].notConnectedCount;
          } 
          if($scope.creDashboardData[index] !== undefined && $scope.creDashboardData[index] !== null){
            if($scope.creDashboardData[index].allocated !== undefined){
            totalAllocated += parseInt($scope.creDashboardData[index].allocated); 
            }
             totalAttemptedCount += parseInt($scope.creDashboardData[index].attemptedCount);
             if($scope.creDashboardData[index].notConnectedCallLaterCount !== undefined){
             totalCallLaterCountNonConnected += parseInt($scope.creDashboardData[index].notConnectedCallLaterCount);
           }
           if($scope.creDashboardData[index].overDueCalls !== undefined){
             $scope.totalOverDueCount += parseInt($scope.creDashboardData[index].overDueCalls);
           }
            if($scope.creDashboardData[index].pendingVisitedCount !== undefined){
             totalPendingVisited += parseInt($scope.creDashboardData[index].pendingVisitedCount);
           }
             if($scope.creDashboardData[index].pendingNonVisitedCount !== undefined){
             totalPendingNotVisited += parseInt($scope.creDashboardData[index].pendingNonVisitedCount);
           }
              if($scope.creDashboardData[index].connectedCallLaterCount !== undefined){
             totalCallLaterCountConnected += parseInt($scope.creDashboardData[index].connectedCallLaterCount);
           }
              if($scope.creDashboardData[index].notInterested !== undefined){
             totalNotInterestedCount += parseInt($scope.creDashboardData[index].notInterested);
           }
              if($scope.creDashboardData[index].serviceDone !== undefined){
             totalServiceDoneCount += parseInt($scope.creDashboardData[index].serviceDone);
           }
              if($scope.creDashboardData[index].appointmentTaken !== undefined){
             totalAppointmentTaken += parseInt($scope.creDashboardData[index].appointmentTaken);
           }
             if($scope.creDashboardData[index].pickAndDrop !== undefined){
              totalPickDrop += parseInt($scope.creDashboardData[index].pickAndDrop);
            }
             totalMTDConversion += parseInt($scope.creDashboardData[index].MTDConversion);
             totalNonConverted += parseInt($scope.creDashboardData[index].nonConverted);
            if($scope.creDashboardData[index].pendingCalls !== undefined){
              totalPendingCount += parseInt($scope.creDashboardData[index].pendingCalls);
             }
             totalFreshCalls += parseInt($scope.creDashboardData[index].freshCalls);
             totalTotalAttempted += parseInt($scope.creDashboardData[index].totalAttempted);
          }  
          if($scope.creDashboardData[index].uniqueAttempted === undefined || $scope.creDashboardData[index].uniqueAttempted === null ){
            $scope.creDashboardDataDisplay.push($scope.creDashboardData[index]);
          } 
         });
        if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
          $scope.creDashboardDataDisplay.push({"dataTypename":"Total","allocated":totalAllocated,"pendingVisitedCount":totalPendingVisited,"pendingNonVisitedCount":totalPendingNotVisited,"pickAndDrop":totalPickDrop,"attemptedCount":totalAttemptedCount,"notConnectedCallLaterCount":totalCallLaterCountNonConnected,"connectedCallLaterCount":totalCallLaterCountConnected,"notInterested":totalNotInterestedCount,"serviceDone":totalServiceDoneCount,"appointmentTaken":totalAppointmentTaken,"MTDConversion":totalMTDConversion,"nonConverted":totalNonConverted,"pendingCalls":totalPendingCount,"freshCalls":totalFreshCalls,"totalAttempted":totalTotalAttempted});
        }
         // console.log(data);
        showLoader(false);
      } , function(err) {
        showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
      }
    }

    function getCallerPerformanceTotalMonthyStats(selCaller,selBranch,status) {
      $scope.dealerMonthlyStats = [];
      selectedCaller = selCaller;
      selectedBranch = selBranch;
      $scope.monthlyDataLoader = true;
      var lsToken = TokenService.getToken(adminUserScId);
      if(status === 'service due date'){
        $scope.conversionHeader = 'Caller Conversion';
        CallerPerformanceTotalDueDateStatsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,datatypeId:selectedDataType,token:lsToken},function(data) {
        console.log('TOTAL MONTHLY STATS BY SERVICE DUE DATE: : :',data);
        $scope.dealerMonthlyStats = data;
        /*if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
          $scope.creDashboardDataDisplay.push({"dataTypename":"Total","allocated":totalAllocated,"pickAndDrop":totalPickDrop,"attemptedCount":totalAttemptedCount,"notconnectedcallLeterCount":totalCallLaterCountNonConnected,"connectedcallLeterCount":totalCallLaterCountConnected,"notinterested":totalNotInterestedCount,"serviceDone":totalServiceDoneCount,"appointmentTaken":totalAppointmentTaken,"MTDConversion":totalMTDConversion,"nonConverted":totalNonConverted,"pendingCalls":totalPendingCount,"freshCalls":totalFreshCalls,"totalAttempted":totalTotalAttempted});
        }*/
        $scope.monthlyDataLoader = false;
      }, function(err) {
        $scope.monthlyDataLoader = false;
        $scope.dealerMonthlyStatsErrorMsg = err.data.message;
      });
     } else if(status === 'complete'){
      $scope.conversionHeader = 'Total Conversion';
      $scope.monthlyDataLoader = true;
      CallerPerformanceMonthlyTotalPotentialStatsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,datatypeId:selectedDataType,token:lsToken},     function(data) {
        console.log('TOTAL MONTHLY STATS COMPLETE : : :',data);
        $scope.dealerMonthlyStats = data;
        /*if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
          $scope.creDashboardDataDisplay.push({"dataTypename":"Total","allocated":totalAllocated,"pickAndDrop":totalPickDrop,"attemptedCount":totalAttemptedCount,"notconnectedcallLeterCount":totalCallLaterCountNonConnected,"connectedcallLeterCount":totalCallLaterCountConnected,"notinterested":totalNotInterestedCount,"serviceDone":totalServiceDoneCount,"appointmentTaken":totalAppointmentTaken,"MTDConversion":totalMTDConversion,"nonConverted":totalNonConverted,"pendingCalls":totalPendingCount,"freshCalls":totalFreshCalls,"totalAttempted":totalTotalAttempted});
        }*/
        $scope.monthlyDataLoader = false;
      }, function(err) {
        $scope.monthlyDataLoader = false;
        $scope.dealerMonthlyStatsErrorMsg = err.data.message;
      });
     }
    }

  $scope.getPericularCompleteStatsData = function (dataTypeName,status,dataTypeId,selReportType) {
      $scope.exportStatus = 'Customer Complete Potential Stats';
      console.log($scope.exportStatus);
      $scope.statusDisplay = status;
      if($scope.statusDisplay === 'connectedCallLater'){
         $scope.statusDisplay = 'Connected Call Later';
      } else if($scope.statusDisplay === 'pickup'){
         $scope.statusDisplay = 'Pickup & Drop';
      } else if($scope.statusDisplay === 'servicedone'){
         $scope.statusDisplay = 'Service Done';
      } else if($scope.statusDisplay === 'allocated'){
         $scope.statusDisplay = 'Allocated';
      } else if($scope.statusDisplay === 'pendingCalls'){
         $scope.statusDisplay = 'Pending Calls';
      } else if($scope.statusDisplay === 'attempted'){
         $scope.statusDisplay = 'Attempted';
      } else if($scope.statusDisplay === 'notConnectedCallLater'){
         $scope.statusDisplay = 'Non Connected Call Later';
      } else if($scope.statusDisplay === 'notinterested'){
         $scope.statusDisplay = 'Not Interested';
      } else if($scope.statusDisplay === 'appointmenttaken'){
         $scope.statusDisplay = 'Appointment Taken';
      } else if($scope.statusDisplay === 'nonconverted'){
         $scope.statusDisplay = 'Non Converted';
      } else if($scope.statusDisplay === 'pending'){
         $scope.statusDisplay = 'Pending';
      } else if($scope.statusDisplay === 'converted'){
         $scope.statusDisplay = 'Converted';
      } else if($scope.statusDisplay === 'allocatedConversion'){
         $scope.statusDisplay = 'Allocated Conversion';
      } else if($scope.statusDisplay === 'freshCalls'){
         $scope.statusDisplay = 'Fresh Calls';
      } else if($scope.statusDisplay === 'callerConversion'){
         $scope.statusDisplay = 'Caller Conversion';
      } else if($scope.statusDisplay === 'totalConversion'){
         $scope.statusDisplay = 'Toatal Conversion';
      } 
      //selectedFromDateConversion = selFromDate;
      //selectedToDateConversion = selToDate;
      selectedDataTypeName = dataTypeName;
      $rootScope.exportType = true;
      if($rootScope.signedInUserRole !== 'superAdmin' && status === 'allocated'){
        $rootScope.exportType = false;
      }
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      selectedDataTypeId = dataTypeId;
        if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
          selectedServiceDueType = 'Free';
        } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
          selectedServiceDueType = 'Paid';
        } else if (dataTypeName === 'Service Reminder Post Warranty'){
          selectedServiceDueType = 'Post Warranty';
        } else if (dataTypeName === 'Service Reminder Extended Warranty'){
          selectedServiceDueType = 'Extended Warranty';
        } else if(dataTypeName === 'Service Reminder Chain Lube Service'){
          selectedServiceDueType = 'Chain Lube Service';
        } else if (dataTypeName === 'Service Reminder Maintenance Service'){
         selectedServiceDueType = 'Maintenance Service';
        } else if (dataTypeName === 'Service Reminder Fitness Certificate'){
         selectedServiceDueType = 'Fitness Certificate';
        }
        else {
          selectedServiceDueType = 'both';
        }
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);
       reportTypeForCustomerDetails = selReportType;
       if(dataTypeId === 'all'){
        $scope.exportStatus = 'Over Due Details';
      }
       if(reportTypeForCustomerDetails === 'export'){
        if(dataTypeId !== 'all'){
          $scope.exportStatus = 'Customer Complete Potential Stats';
          console.log(serviceURL+'get_admin_pontential_allocated_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          $window.open(serviceURL+'get_admin_pontential_allocated_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
        } else if(dataTypeId === 'all'){
          $scope.exportStatus = 'Over Due Details';
          console.log(serviceURL+'get_admin_pontential_allocated_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/all/'+selectedStatsStatus+'/both/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          $window.open(serviceURL+'get_admin_pontential_allocated_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/all/'+selectedStatsStatus+'/both/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
        }
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
       } else if(reportTypeForCustomerDetails === 'submit'){
      AdminCustomerCompletePotentialDetailsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,branchId:selectedBranch,reportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
        console.log('ADMIN COMPETE POTENTIAL CUSTOMER DETAILS STATS WISE :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      },function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
    }
    };

    $scope.getPericularStatsServiceDueDateWiseData = function (dataTypeName,status,dataTypeId,selReportType) {
      $scope.exportStatus = 'Customer Potential Stats';
      console.log($scope.exportStatus);
      $scope.statusDisplay = status;
      if($scope.statusDisplay === 'connectedCallLater'){
         $scope.statusDisplay = 'Connected Call Later';
      } else if($scope.statusDisplay === 'pickup'){
         $scope.statusDisplay = 'Pickup & Drop';
      } else if($scope.statusDisplay === 'servicedone'){
         $scope.statusDisplay = 'Service Done';
      } else if($scope.statusDisplay === 'allocated'){
         $scope.statusDisplay = 'Allocated';
      } else if($scope.statusDisplay === 'attempted'){
         $scope.statusDisplay = 'Attempted';
      } else if($scope.statusDisplay === 'pendingCalls'){
         $scope.statusDisplay = 'Pending Calls';
      } else if($scope.statusDisplay === 'notConnectedCallLater'){
         $scope.statusDisplay = 'Non Connected Call Later';
      } else if($scope.statusDisplay === 'notinterested'){
         $scope.statusDisplay = 'Not Interested';
      } else if($scope.statusDisplay === 'appointmenttaken'){
         $scope.statusDisplay = 'Appointment Taken';
      } else if($scope.statusDisplay === 'nonconverted'){
         $scope.statusDisplay = 'Non Converted';
      } else if($scope.statusDisplay === 'pending'){
         $scope.statusDisplay = 'Pending';
      } else if($scope.statusDisplay === 'converted'){
         $scope.statusDisplay = 'Converted';
      } else if($scope.statusDisplay === 'allocatedConversion'){
         $scope.statusDisplay = 'Allocated Conversion';
      } else if($scope.statusDisplay === 'freshCalls'){
         $scope.statusDisplay = 'Fresh Calls';
      } else if($scope.statusDisplay === 'callerConversion'){
         $scope.statusDisplay = 'Caller Conversion';
      } else if($scope.statusDisplay === 'totalConversion'){
         $scope.statusDisplay = 'Toatal Conversion';
      } 
      //selectedFromDateConversion = selFromDate;
      //selectedToDateConversion = selToDate;
      selectedDataTypeName = dataTypeName;
      $rootScope.exportType = true;
       if($rootScope.signedInUserRole !== 'superAdmin' && status === 'allocated'){
        $rootScope.exportType = false;
      }
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      selectedDataTypeId = dataTypeId;
        if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
          selectedServiceDueType = 'Free';
        } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
          selectedServiceDueType = 'Paid';
        } else if (dataTypeName === 'Service Reminder Post Warranty'){
          selectedServiceDueType = 'Post Warranty';
        } else if (dataTypeName === 'Service Reminder Extended Warranty'){
          selectedServiceDueType = 'Extended Warranty';
        } else if(dataTypeName === 'Service Reminder Chain Lube Service'){
          selectedServiceDueType = 'Chain Lube Service';
        } else if (dataTypeName === 'Service Reminder Maintenance Service'){
         selectedServiceDueType = 'Maintenance Service';
        } else if (dataTypeName === 'Service Reminder Fitness Certificate'){
         selectedServiceDueType = 'Fitness Certificate';
        }
        else {
          selectedServiceDueType = 'both';
        }
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);

       reportTypeForCustomerDetails = selReportType;
       if(reportTypeForCustomerDetails === 'export'){
         $scope.exportStatus = 'Customer Potential Stats';
         console.log(serviceURL+'get_admin_pontential_servicedue_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
         $window.open(serviceURL+'get_admin_pontential_servicedue_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
       }else if(reportTypeForCustomerDetails === 'submit'){
      AdminCustomerPotentialDetailsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,branchId:selectedBranch,reportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
        console.log('ADMIN POTENTIAL CUSTOMER DETAILS SERVICE DUE DATE WISE STATS WISE :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      },function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
    }
    };

   $scope.statusLables = [{'key':'serviceReminder','name':'Service Reminder'},{'key':'servicefeedback','name':'Service Feedback'},{'key':'insurance','name':'Insurance'},{'key':'salesfeedback','name':'Sales Feedback'}];
   $scope.currentHourStatus = $scope.statusLables[0].name;
   $scope.currentWeeklyStatus = $scope.statusLables[0].name;
 
   var selectedStatus = 'serviceReminder'; 
   $scope.getStatusWiseHourStats = function(selStatus,label){
    selectedStatus = selStatus;
    if(selectedStatus === 'Service Reminder'){
       selectedStatus = 'serviceReminder';
    } else if(selectedStatus === 'Service Feedback'){
      selectedStatus = 'servicefeedback';
    } else if(selectedStatus === 'Insurance'){
      selectedStatus = 'insurance';
    } else if(selectedStatus === 'Sales Feedback'){
      selectedStatus = 'salesfeedback';
    }
    console.log(selectedStatus);
    $scope.getHourWiseTeleCallerData(selectedFromDate,adminUserId,selectedCaller,selectedBranch);
    $scope.getWeeklyWiseTeleCallerData(selectedFromDate,adminUserId,selectedCaller,selectedBranch);
    getCallLaterConversionData('Call Later',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
    getNotInterestedConversionData('Not Interested',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
    getServiceCenterComplaintsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
    getCallerLiveStats(adminUserScId); 
    getCallerWiseConversionData(selectedCaller,selectedBranch);
    getCallerWiseRevenueData(selectedType,selectedBranch);
    getConversionData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion); 
   }
  
   var selectedFromDate = 'today';

    var graphData = [];
    $scope.calStatsSeries = ['Attempted', 'Connected', 'Appointments'];
    $scope.calStatsColors =  ['#FB617F', '#ff9900','#2FCF92'];
    $scope.callsCountData = [];
    $scope.hourLables = [];

$scope.attemptedColors = ['#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F'];
$scope.connectedColors = ['#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900'];
$scope.appointmentsColors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.hourWiseChart = {};
    $scope.getHourWiseTeleCallerData = function (selectedDate,callerId,selCaller,selBranch){
      $scope.hourWiseChart = {};
      selectedCaller = selCaller;
      selectedBranch = selBranch;
      $scope.callsCountData = [];
      $scope.hourLables = [];
      var callsAttempted = [];
      var callsConnected = [];
      var appointmentTaken = [];
      var filteredHourLable;
      $scope.totalAppointmentsTakenHourly = 0;
      $scope.totalcallsAttemptedHourly = 0;
      $scope.totalcallsConnectedHourly = 0;
      $scope.loaderIconHourWise = true;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerHourWiseDataService.get({date:selectedFromDate,scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,status:selectedStatus,token:lsToken},function (data) {
        graphData = data;
        console.log('Hour wise data :',data);

        if(graphData.callsAttempted !== undefined && graphData.callsAttempted !== null){
          for (var k = 0; k < graphData.callsAttempted.length; k++) {
            if(graphData.callsAttempted[k] !==null){
              $scope.totalcallsAttemptedHourly += parseInt(graphData.callsAttempted[k].callsAttempted);
              //console.log('Attempted',$scope.totalcallsAttemptedHourly);
              // totalCalls.push({y: parseInt(graphData.callsAttempted[k].callsAttempted), label: graphData.callsAttempted[k].Hour});
              callsAttempted.push(parseInt(graphData.callsAttempted[k].callsAttempted));
              if(parseInt(graphData.callsAttempted[k].Hour) % 12 > 6){
                filteredHourLable = (parseInt(graphData.callsAttempted[k].Hour) % 12) +'AM';
              }
              else if(parseInt(graphData.callsAttempted[k].Hour) % 12 <= 6){
                filteredHourLable = (parseInt(graphData.callsAttempted[k].Hour) % 12) +'PM';
              }
              if((parseInt(graphData.callsAttempted[k].Hour) % 12) === 0){
                filteredHourLable = graphData.callsAttempted[k].Hour +'PM';
              }
              //console.log('++++++++++++++++++++++++=====',parseInt(graphData.callsAttempted[k].Hour)% 12);
              //filteredHourLable = parseInt(graphData.callsAttempted[k].callsAttempted)/12;
              $scope.hourLables.push(filteredHourLable);
            }
          }
        }
        if(graphData.callsConnected !== undefined && graphData.callsConnected !== null){
          for (var k1 = 0; k1 < graphData.callsConnected.length; k1++) {
            if(graphData.callsConnected[k1] !==null){
              $scope.totalcallsConnectedHourly += parseInt(graphData.callsConnected[k1].callsConnected);
              //console.log('Connetced',$scope.totalcallsConnectedHourly);
              //   connectedCalls.push({y: parseInt(graphData.callsConnected[k1].callsConnected), label:graphData.callsConnected[k1].Hour});
              callsConnected.push(parseInt(graphData.callsConnected[k1].callsConnected));
            }
          }
        }
        if(graphData.appointmentTaken !== undefined && graphData.appointmentTaken !== null){
          for (var k2 = 0; k2 < graphData.appointmentTaken.length; k2++) {
            if(graphData.appointmentTaken[k2] !==null && graphData.appointmentTaken[k2].appointmentTaken !==undefined){
              $scope.totalAppointmentsTakenHourly += parseInt(graphData.appointmentTaken[k2].appointmentTaken);
              //console.log('Appointments',$scope.totalAppointmentsTakenHourly);
              //   connectedCalls.push({y: parseInt(graphData.callsConnected[k1].callsConnected), label:graphData.callsConnected[k1].Hour});
              appointmentTaken.push(parseInt(graphData.appointmentTaken[k2].appointmentTaken));
            }
          }
        }
        $scope.callsCountData.push(callsAttempted);
        $scope.callsCountData.push(callsConnected);
        $scope.callsCountData.push(appointmentTaken);

       $scope.filteredCallsCountData = [];
       $scope.filteredHourLables = [];
for(var i=0;i<3;i++){
$scope.filteredCallsCountData.push($scope.callsCountData[i]);
}
for(var i=0;i<11;i++){
$scope.filteredHourLables.push($scope.hourLables[i]);
}

$scope.hourWiseChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.filteredHourLables ,
            series: $scope.calStatsSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92'],
            data: $scope.filteredCallsCountData 
        };
        
        $scope.datasetOverrideHourWiseData = [
             {
                fill: true,
                backgroundColor: $scope.attemptedColors
            },
            {
                fill: true,
                backgroundColor:$scope.connectedColors
            },
            {
                fill: true,
                backgroundColor: $scope.appointmentsColors
            },
            
            ];


        $scope.tcHourWiseDataErrorMsg = '';
        $scope.loaderIconHourWise = false;
      }, function (err) {
        $scope.tcHourWiseDataErrorMsg = err.data.message;
        console.log(err);
        $scope.loaderIconHourWise = false;
      });
    };
    //$scope.getHourWiseTeleCallerData(selectedFromDate,adminUserId,selectedCaller,selectedBranch);
    

    var graphDataWeekly = [];
    $scope.calStatsSeriesWeekly = ['Attempted', 'Connected', 'Appointments'];
    $scope.calStatsColorsWeekly = ['#FB617F', '#ff9900','#2FCF92'];
    $scope.callsCountDataWeekly = [];
    $scope.weeklyLables = [];
    $scope.weeklyChart = {};
    $scope.getWeeklyWiseTeleCallerData = function (selectedDate,callerId,selCaller,selBranch){
      $scope.weeklyChart = {};
      selectedCaller = selCaller;
      selectedBranch = selBranch;
      $scope.callsCountDataWeekly = [];
      $scope.weeklyLables = [];
      var callsAttemptedWeekly = [];
      var appointmentTakenWeekly = [];
      var callsConnectedWeekly = [];
      $scope.totalAppointmentsTakenWeekly = 0;
      $scope.totalcallsAttemptedWeekly = 0;
      $scope.totalcallsConnectedWeekly = 0;
      $scope.freshAppointments = 0;
      //$scope.recheduledAppointments = 0;
      $scope.loaderIconWeekWise = true;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWeeklyWiseDataService.get({date:selectedFromDate,scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,status:selectedStatus,token:lsToken},function (data) {
        graphDataWeekly = data;
        console.log('Week wise data :',data);
        if(graphDataWeekly.freshAppts !== undefined && graphDataWeekly.freshAppts !== null){
          if(graphDataWeekly.freshAppts[0]!== undefined && graphDataWeekly.freshAppts[0]!== null ){
            $scope.freshAppointments = parseInt(graphDataWeekly.freshAppts[0].freshAppts);
          }
        }

        if(graphDataWeekly.callsAttempted !== undefined && graphDataWeekly.callsAttempted !== null){
          for (var k = 0; k < graphDataWeekly.callsAttempted.length; k++) {
            if(graphDataWeekly.callsAttempted[k] !==null){
              $scope.totalcallsAttemptedWeekly += parseInt(graphDataWeekly.callsAttempted[k].callsAttempted);
              //console.log('Total Calls attempted',$scope.totalcallsAttemptedWeekly);
              callsAttemptedWeekly.push(parseInt(graphDataWeekly.callsAttempted[k].callsAttempted));
              $scope.weeklyLables.push(graphDataWeekly.callsAttempted[k].Hour);
            }
          }
        }
        if(graphDataWeekly.callsConnected !== undefined && graphDataWeekly.callsConnected !== null){
          for (var k1 = 0; k1 < graphDataWeekly.callsConnected.length; k1++) {
            if(graphDataWeekly.callsConnected[k1] !==null){
              $scope.totalcallsConnectedWeekly += parseInt(graphDataWeekly.callsConnected[k1].callsConnected);
              //console.log('Total Calls Connected',$scope.totalcallsConnectedWeekly);
              //   connectedCalls.push({y: parseInt(graphData.callsConnected[k1].callsConnected), label:graphData.callsConnected[k1].Hour});
              callsConnectedWeekly.push(parseInt(graphDataWeekly.callsConnected[k1].callsConnected));
            }
          }
        }
        if(graphDataWeekly.appointmentTaken !== undefined && graphDataWeekly.appointmentTaken !== null){
          for (var k2 = 0; k2 < graphDataWeekly.appointmentTaken.length; k2++) {
            if(graphDataWeekly.appointmentTaken[k2] !==null){
              $scope.totalAppointmentsTakenWeekly += parseInt(graphDataWeekly.appointmentTaken[k2].appointmentTaken);
              //console.log('Total Appointments',$scope.totalAppointmentsTakenWeekly);
              // console.log('Some Date',graphData.appointmentTaken[k2].appointmentTaken);
              appointmentTakenWeekly.push(parseInt(graphDataWeekly.appointmentTaken[k2].appointmentTaken));
            }
          }
        }

        //$scope.recheduledAppointments = freshAppointments - $scope.totalAppointmentsTakenWeekly;
      
        $scope.callsCountDataWeekly.push(callsAttemptedWeekly);
        $scope.callsCountDataWeekly.push(callsConnectedWeekly);
        $scope.callsCountDataWeekly.push(appointmentTakenWeekly);
         console.log(' $scope.callsCountDataWeekly pppppppppppppppppppppppppppp',JSON.stringify( $scope.callsCountDataWeekly));
         console.log(' $scope.callsCountDataWeekly length::: pppppppppppppppppppppppppppp',$scope.callsCountDataWeekly.length);
       
       $scope.filteredCallsCountDataWeekly = [];
       $scope.filteredWeeklyLables = [];
for(var i=0;i<3;i++){
$scope.filteredCallsCountDataWeekly.push($scope.callsCountDataWeekly[i]);
}
for(var i=0;i<8;i++){
$scope.filteredWeeklyLables.push($scope.weeklyLables[i]);
}

      // if($scope.callsCountDataWeekly.length === 3){
          $scope.weeklyChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.filteredWeeklyLables ,
            series: $scope.calStatsSeriesWeekly,
            colors: ['#FB617F', '#ff9900','#2FCF92'],
            data: $scope.filteredCallsCountDataWeekly 
        };
        
       /*}else {
        $scope.weeklyChart = {};
        $scope.totalAppointmentsTakenWeekly = 0;
        $scope.totalcallsAttemptedWeekly = 0;
        $scope.totalcallsConnectedWeekly = 0;
       }*/

        $scope.datasetOverrideWeeklyData = [
             {
                fill: true,
                backgroundColor: $scope.attemptedColors
            },
            {
                fill: true,
                backgroundColor:$scope.connectedColors
            },
            {
                fill: true,
                backgroundColor: $scope.appointmentsColors
            },
            
            ];

        $scope.tcHourWiseDataErrorMsg = '';
        $scope.loaderIconWeekWise = false;
      }, function (err) {
        $scope.tcHourWiseDataErrorMsg = err.data.message;
        console.log(err);
        $scope.loaderIconWeekWise = false;
      });
    };

    //$scope.getWeeklyWiseTeleCallerData(selectedFromDate,adminUserId,selectedCaller,selectedBranch);
   
   /* $scope.options = {legend: {display: true,position: 'bottom'},scales: {
          yAxes: [{id: 'y-axis-1', ticks: { beginAtZero:true,min: 0}}]
        }};*/



$scope.callerWiseConversionSeries =['Connected', 'Appointments Taken', 'Converted'];;
$scope.callerWiseConversionData = [];
$scope.callerWiseConversionLables = [];
var callerWiseConnectedCalls = [];
var callerWiseAppointmentTaken = [];
var callerWiseConverted = [];
$scope.callerWiseConnectedTotal = 0;
$scope.callerWiseAppointmentTakenTotal = 0;
$scope.callerWiseConvertedTotal = 0;
$scope.callerWiseConversionChart = {};
function getCallerWiseConversionData(selCaller,selBranch) {
  $scope.dataErrorMsgFourMonthConversion = false;
  $scope.callerWiseConversionChart = {};
  $scope.callerWiseConversionData = [];
$scope.callerWiseConversionLables = [];
var callerWiseConnectedCalls = [];
var callerWiseAppointmentTaken = [];
var callerWiseConverted = [];
    selectedCaller = selCaller;
    selectedBranch = selBranch;
      $scope.loaderIconFourMonthConversion = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetCallerWiseConversionStatsService.get({scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,dataType:selectedStatus,token:lsToken},function (data) {
       console.log('caller Wise Conversion Stats :',data);
        var callerWiseConversionStats = data;
        if(callerWiseConversionStats.connectedCalls !== undefined && callerWiseConversionStats.connectedCalls !== null){
          angular.forEach(callerWiseConversionStats.connectedCalls,function(val,index){
          callerWiseConnectedCalls.push(callerWiseConversionStats.connectedCalls[index].apptCount);
           $scope.callerWiseConnectedTotal += callerWiseConversionStats.connectedCalls[index].apptCount;
            $scope.callerWiseConversionLables.push(callerWiseConversionStats.connectedCalls[index].monthName);
          //$scope.revenueDataSeries.push(revenueStats.one[index].scType);
        });
        }
        if(callerWiseConversionStats.appointmentTaken !== undefined && callerWiseConversionStats.appointmentTaken !== null){
          angular.forEach(callerWiseConversionStats.appointmentTaken,function(val,index){
          callerWiseAppointmentTaken.push(callerWiseConversionStats.appointmentTaken[index].apptCount);
          $scope.callerWiseAppointmentTakenTotal += callerWiseConversionStats.appointmentTaken[index].apptCount;
        });
        }
        if(callerWiseConversionStats.converted !== undefined && callerWiseConversionStats.converted !== null){
          angular.forEach(callerWiseConversionStats.converted,function(val,index){
          callerWiseConverted.push(callerWiseConversionStats.converted[index].apptCount);
          $scope.callerWiseConvertedTotal += callerWiseConversionStats.converted[index].apptCount;
        });
        }
        
        $scope.callerWiseConversionData.push(callerWiseConnectedCalls);
        $scope.callerWiseConversionData.push(callerWiseAppointmentTaken);
        $scope.callerWiseConversionData.push(callerWiseConverted);
        
        console.log(JSON.stringify($scope.callerWiseConversionData));
        console.log(JSON.stringify($scope.callerWiseConversionLables));
        console.log(JSON.stringify($scope.callerWiseConversionSeries));


 $scope.filteredCallerWiseConversionData = [];
       $scope.filteredCallerWiseConversionLables = [];
for(var i=0;i<3;i++){
$scope.filteredCallerWiseConversionData.push($scope.callerWiseConversionData[i]);
}
for(var i=0;i<4;i++){
$scope.filteredCallerWiseConversionLables.push($scope.callerWiseConversionLables[i]);
}

        $scope.callerWiseConversionChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.filteredCallerWiseConversionLables ,
            series: $scope.callerWiseConversionSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92'],
            data: $scope.filteredCallerWiseConversionData 
        };
        
        $scope.datasetOverrideCallerWiseConversionData = [
             {
                fill: true,
                backgroundColor: $scope.attemptedColors
            },
            {
                fill: true,
                backgroundColor:$scope.connectedColors
            },
            {
                fill: true,
                backgroundColor: $scope.appointmentsColors
            },
            
            ];

        $scope.loaderIconFourMonthConversion = false;
      }, function(err) {
        $scope.dataErrorMsgFourMonthConversion = true;
        $scope.loaderIconFourMonthConversion = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    //getCallerWiseConversionData(selectedCaller,selectedBranch);
    


$scope.fsc1Colors = ['#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F'];
$scope.fsc2Colors = ['#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900'];
$scope.fsc3Colors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.fsc4Colors = ['#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca'];
$scope.paidColors = ['#A0B421', '#A0B421','#A0B421','#A0B421','#A0B421','#A0B421'];

$scope.revenueColors = ['#FB617F', '#ff9900','#2FCF92','#0083ca','#F0AB05','#A0B421'];
$scope.revenueDataSeries =["FSC1","FSC2","FSC3","FSC4","Paid"];
$scope.revenueData = [];
$scope.revenueLables = [];
var fsc1 = [];
var fsc2 = [];
var fsc3 = [];
var fsc4 = [];
var paid = [];
var selectedId = 'all';
var selectedType = 'caller';
var selectedReportType = 'month';
$scope.fsc1Total = 0;
$scope.fsc2Total = 0;
$scope.fsc3Total = 0;
$scope.fsc4Total = 0;
$scope.paidTotal = 0;
$scope.revenueChart ={};
$scope.dataErrorMsgRevenue = false;
function getCallerWiseRevenueData(selCaller,selBranch) {
$scope.dataErrorMsgRevenue = false;
$scope.revenueChart ={};
selectedType = selCaller;
selectedBranch = selBranch;
$scope.revenueData = [];
$scope.revenueLables = [];
fsc1 = [];
fsc2 = [];
fsc3 = [];
fsc4 = [];
paid = [];
      $scope.loaderIconRevenue = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetCallerWiseRevenueStatsService.get({id:selectedId,type:selectedType,scId:adminUserScId,brandName:loginBrandName,reportType:selectedReportType,branch:selectedBranch,dataType:selectedStatus,token:lsToken},function (data) {
       console.log('Revenue data :',data);
       console.log('Revenue data+++++++++++ :',data.FSC1);
        var revenueStats = data;
        if(revenueStats.FSC1 !== undefined && revenueStats.FSC1 !== null){
          angular.forEach(revenueStats.FSC1,function(val,index){
          fsc1.push(revenueStats.FSC1[index].totalAmount);
           $scope.fsc1Total += revenueStats.FSC1[index].totalAmount;
            $scope.revenueLables.push(revenueStats.FSC1[index].monthName);
        });
        }
        if(revenueStats.FSC2 !== undefined && revenueStats.FSC2 !== null){
          angular.forEach(revenueStats.FSC2,function(val,index){
          fsc2.push(revenueStats.FSC2[index].totalAmount);
          $scope.fsc2Total += revenueStats.FSC2[index].totalAmount;
        });
        }
        if(revenueStats.FSC3 !== undefined && revenueStats.FSC3 !== null){
          angular.forEach(revenueStats.FSC3,function(val,index){
          fsc3.push(revenueStats.FSC3[index].totalAmount);
          $scope.fsc3Total += revenueStats.FSC3[index].totalAmount;
        });
        }
        if(revenueStats.FSC4 !== undefined && revenueStats.FSC4 !== null){
          angular.forEach(revenueStats.FSC4,function(val,index){
          fsc4.push(revenueStats.FSC4[index].totalAmount);
           $scope.fsc4Total += revenueStats.FSC4[index].totalAmount;
        });
        }
        if(revenueStats.Paid !== undefined && revenueStats.Paid !== null){
          angular.forEach(revenueStats.Paid,function(val,index){
          paid.push(revenueStats.Paid[index].totalAmount);
           $scope.paidTotal += revenueStats.Paid[index].totalAmount;
        });
        }
        
        $scope.revenueData.push(fsc1);
        $scope.revenueData.push(fsc2);
        $scope.revenueData.push(fsc3);
        $scope.revenueData.push(fsc4);
        $scope.revenueData.push(paid);
        
        $scope.filteredRevenueData = [];
       $scope.filteredRevenueLables = [];
for(var i=0;i<5;i++){
$scope.filteredRevenueData.push($scope.revenueData[i]);
}
for(var i=0;i<6;i++){
$scope.filteredRevenueLables.push($scope.revenueLables[i]);
}
        $scope.revenueChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}/*,
      data : [
        [22,11,10,28,11],[9,12,30,9,22],[21,35,11,33,8]
      ]*/
    }
            ,
            labels: $scope.filteredRevenueLables ,
            series: $scope.revenueDataSeries ,
            colors: ['#FB617F', '#ff9900','#2FCF92','#0083ca','#A0B421'],
            data: $scope.filteredRevenueData 
        };
        
        $scope.datasetOverrideRevenue = [
            {
                fill: true,
                backgroundColor: $scope.fsc1Colors
            },
            {
                fill: true,
                backgroundColor:$scope.fsc2Colors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc3Colors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc4Colors
            },
            {
                fill: true,
                backgroundColor:$scope.paidColors
            }
            
            ];
        console.log(JSON.stringify($scope.revenueData));
        console.log(JSON.stringify($scope.revenueLables));
        console.log(JSON.stringify($scope.revenueDataSeries));

        $scope.optionsRevenue = {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}/*,
      data : [
        [22,11,10,28,11],[9,12,30,9,22],[21,35,11,33,8]
      ]*/
    };
        $scope.loaderIconRevenue = false;
      }, function(err) {
        $scope.dataErrorMsgRevenue = true;
        $scope.loaderIconRevenue = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    //getCallerWiseRevenueData(selectedType,selectedBranch);
    


/*$scope.weeklyAttemptedcolors = [["#FB617F"],["#FB617F"],["#FB617F"],["#FB617F"],["#FB617F"],["#FB617F"],["#FB617F"],["#FB617F"]]
$scope.weeklyConnectedcolors = [["#ff9900"],["#ff9900"],["#ff9900"],["#ff9900"],["#ff9900"],["#ff9900"],["#ff9900"],["#ff9900"]]
$scope.weeklyAppointmentcolors = [["#2FCF92"],["#2FCF92"],["#2FCF92"],["#2FCF92"],["#2FCF92"],["#2FCF92"],["#2FCF92"],["#2FCF92"]]

     $scope.weeklyChart = {
            options: {
                legend: {
                    display: true
                }
            },
            labels: $scope.weeklyLables ,
            series: ['FACEBOOK', 'GOOGLE','test'],
            colors: ['#FB617F', '#ff9900','#2FCF92'],
            data: $scope.callsCountDataWeekly
        };
        
        $scope.datasetOverrideWeekly = [
            {
                fill: true,
                backgroundColor: $scope.weeklyAttemptedcolors
            },
            {
                fill: true,
                backgroundColor:$scope.weeklyConnectedcolors
            },
            {
                fill: true,
                backgroundColor: $scope.weeklyAppointmentcolors
            }
            
            ];*/
    

    $(document).ready(function(){
      $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
      });
    });

var selectedStatusConversion;
var conversionCallLater= [['Appointment Status', 'Appointment Count']];
$scope.dataErrorMsgCallLater = false;
$scope.callLaterTotal = 0;
function getCallLaterConversionData(selStatus,selCaller,selBranch,selFromDate,selToDate) {
    selectedFromDateConversion = selFromDate;
    selectedToDateConversion = selToDate;
    $scope.callLaterTotal = 0;
  $scope.dataErrorMsgCallLater = false;
  conversionCallLater= [['Appointment Status', 'Appointment Count']];
  console.log(selBranch);
  selectedStatusConversion = selStatus
   selectedCaller = selCaller;
   selectedBranch = selBranch
      $scope.loaderIconCallLater = true;
      var lsToken = TokenService.getToken(adminUserScId);
      GetAdminCallerDashboardConversionStatsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,status:selectedStatusConversion,callerId:selectedCaller,scId:adminUserScId,branch:selectedBranch,dataType:selectedStatus,token:lsToken},     function(data) {
        console.log('Call Later data :',data);
        var callLaterData = data;
        $scope.callLaterData = data;
        console.log('++++++++++++++++++++++',$scope.callLaterData);
        angular.forEach(callLaterData,function(val,index){
          if(callLaterData[index] !== undefined && callLaterData[index] !== null ){
          conversionCallLater.push([callLaterData[index].apptSubStatus,parseInt(callLaterData[index].apptCount)]);
          $scope.callLaterTotal += parseInt(callLaterData[index].apptCount);
          }
        });
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChartCallLater);
        console.log(JSON.stringify(conversionCallLater));
        $scope.loaderIconCallLater = false;
      }, function(err) {
        $scope.dataErrorMsgCallLater = true;
        conversionCallLater= [['Appointment Status', 'Appointment Count']];
        $scope.loaderIconCallLater = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    //getCallLaterConversionData('Call Later',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);


var conversionNotInterested= [['Appointment Status', 'Appointment Count']];
$scope.dataErrorMsgNotInterested = false;
$scope.notInterestedTotal = 0;
function getNotInterestedConversionData(selStatus,selCaller,selBranch,selFromDate,selToDate) {
  selectedFromDateConversion = selFromDate;
    selectedToDateConversion = selToDate;
    $scope.notInterestedTotal = 0;
    $scope.dataErrorMsgNotInterested = false;
  conversionNotInterested= [['Appointment Status', 'Appointment Count']];
    selectedStatusConversion = selStatus
    selectedCaller = selCaller;
    selectedBranch = selBranch;
      $scope.loaderIconNotInterested = true;
      var lsToken = TokenService.getToken(adminUserScId);
      GetAdminCallerDashboardConversionStatsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,status:selectedStatusConversion,callerId:selectedCaller,scId:adminUserScId,branch:selectedBranch,dataType:selectedStatus,token:lsToken},     function(data) {
        console.log('Not Interested data :',data);
          var notInterestedData = data;
          angular.forEach(notInterestedData,function(val,index){
          if(notInterestedData[index] !== undefined && notInterestedData[index] !== null ){
 conversionNotInterested.push([notInterestedData[index].apptSubStatus,parseInt(notInterestedData[index].apptCount)]);
         $scope.notInterestedTotal += parseInt(notInterestedData[index].apptCount);
          }
        });
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChartNotInterested);
        console.log(JSON.stringify(conversionNotInterested));
        $scope.loaderIconNotInterested = false;
      }, function(err) {
        $scope.dataErrorMsgNotInterested = true;
        conversionNotInterested= [['Appointment Status', 'Appointment Count']];
        $scope.loaderIconNotInterested = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    //getNotInterestedConversionData('Not Interested',selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);


    var conversion= [['Appointment Status', 'Appointment Count']];
$scope.dataErrorMsgConversion = false;
$scope.conversionTotal = 0;
function getConversionData(selCaller,selBranch,selFromDate,selToDate) {
  selectedFromDateConversion = selFromDate;
  selectedToDateConversion = selToDate;
  $scope.conversionTotal = 0;
  $scope.dataErrorMsgConversion = false;
  conversion= [['Appointment Status', 'Appointment Count']];
  selectedCaller = selCaller;
    selectedBranch = selBranch;
      $scope.loaderIconConversion = true;
      var lsToken = TokenService.getToken(adminUserScId);
      GetAdminCallerConversionService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,callerId:selectedCaller,scId:adminUserScId,branch:selectedBranch,dataType:selectedStatus,token:lsToken},     function(data) {
        console.log('Conversion data :',data);
          $scope.conversionData = data;
          var conversionData = data;
          angular.forEach(conversionData,function(val,index){
          if(conversionData[index] !== undefined && conversionData[index] !== null ){
 conversion.push([conversionData[index].apptStatus,parseInt(conversionData[index].apptCount)]);
         $scope.conversionTotal += parseInt(conversionData[index].apptCount);
          }
        });
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChartConversion);
        console.log('conversion',JSON.stringify(conversion));
        $scope.loaderIconConversion = false;
      }, function(err) {
        $scope.dataErrorMsgConversion = true;
        $scope.loaderIconConversion = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    //getConversionData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);


var serviceCenterComplaints= [['Appointment Status', 'Appointment Count']];
$scope.dataErrorMsgScComplaint = false;
$scope.scComplaintTotal = 0;
function getServiceCenterComplaintsData(selCaller,selBranch,selFromDate,selToDate) {
  selectedFromDateConversion = selFromDate;
    selectedToDateConversion = selToDate;
    $scope.scComplaintTotal = 0;
  $scope.dataErrorMsgScComplaint = false;
  serviceCenterComplaints= [['Appointment Status', 'Appointment Count']];
   selectedCaller = selCaller;
     selectedBranch = selBranch;
      $scope.loaderIconScComplaints = true;
      var lsToken = TokenService.getToken(adminUserScId);
      GetServiceCenterComplaintsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,callerId:selectedCaller,scId:adminUserScId,branch:selectedBranch,dataType:selectedStatus,token:lsToken},function(data) {
        console.log(' Service Center Complaints data :',data);
          var scComplaintsData = data;
          angular.forEach(scComplaintsData,function(val,index){
          if(scComplaintsData[index] !== undefined && scComplaintsData[index] !== null ){
            $scope.uniqueComplaints = scComplaintsData[index].uniqueCount;
          serviceCenterComplaints.push([scComplaintsData[index].scCompliants,parseInt(scComplaintsData[index].scCount)]);
          if(scComplaintsData[index].scCount !== undefined){
              $scope.scComplaintTotal += parseInt(scComplaintsData[index].scCount);
          }
          /*if(scComplaintsData[index].scCount !== '0'){
            $scope.dataErrorMsgScComplaint = false;
          }*/
          }
        });
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChartScComplaints);
        console.log(JSON.stringify(serviceCenterComplaints));
        $scope.loaderIconScComplaints = false;
      }, function(err) {
        $scope.dataErrorMsgScComplaint = true;
        $scope.loaderIconScComplaints = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
   // getServiceCenterComplaintsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);

 /*var test = [
          ['Task', 'Hours per Day'],
          ['Work',     11],
          ['Eat',      2],
          ['Commute',  2],
          ['Watch TV', 2],
          ['Sleep',    7],
          ['Watch TV', 2],
          ['Sleep',    7]
          ];*/
      
      /*google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);*/
      function drawChartCallLater() {
        var data = google.visualization.arrayToDataTable(conversionCallLater);
        var options = {
          /*title: 'Conversion Statistics :',*/
         legend: {display: true,position: 'right'},
          is3D: true
        };
        var chart = new google.visualization.PieChart(document.getElementById('callLaterChart'));

        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            //alert('The user selected ' + topping);
            selectedGraphSubstatus = topping;
            $scope.exportStatus = 'Call Later';
            getAdminCustomerDetailsStatusWise(selectedCaller,selectedBranch,'Call Later',selectedGraphSubstatus,reportTypeForCustomerDetails);
          }
        }
        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
      }


      function drawChartNotInterested() {
        var data = google.visualization.arrayToDataTable(conversionNotInterested);
        var options = {
          /*title: 'Conversion Statistics :',*/
         legend: {display: true,position: 'right'},
          is3D: true
        };
        var chart = new google.visualization.PieChart(document.getElementById('notInterestedChart'));
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            //alert('The user selected ' + topping);
            selectedGraphSubstatus = topping;
            $scope.exportStatus = 'Not Interested';
            getAdminCustomerDetailsStatusWise(selectedCaller,selectedBranch,'Not Interested',selectedGraphSubstatus,reportTypeForCustomerDetails)
          }
        }
        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
      }
       function drawChartConversion() {
        var data = google.visualization.arrayToDataTable(conversion);
        var options = {
          /*title: 'Conversion Statistics :',*/
         legend: {display: true,position: 'right'},
          is3D: true
        };
        var chart = new google.visualization.PieChart(document.getElementById('conversionChart'));
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            //alert('The user selected ' + topping);
            selectedGraphStatus = topping;
            $scope.exportStatus = 'Conversion';
            //getAdminCustomerDetailsStatusWise(selectedCaller,selectedBranch,selectedGraphStatus,'conversion',reportTypeForCustomerDetails)
             getAdminConversionDetailsStatusWise(selectedCaller,selectedBranch,selectedGraphStatus,'conversion',reportTypeForCustomerDetails);
          }
        }
        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
      }
      function drawChartScComplaints() {
        var data = google.visualization.arrayToDataTable(serviceCenterComplaints);
        var options = {
          /*title: 'Conversion Statistics :',*/
         legend: {display: true,position: 'right'},
          is3D: true
        };
        var chart = new google.visualization.PieChart(document.getElementById('scComplaintsChart'));
      
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if(selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            //alert('The user selected ' + topping);
            selectedGraphSubstatus = topping;
            $scope.exportStatus = 'ScComplaint';
            getAdminCustomerDetailsScComplaintWise(selectedCaller,selectedBranch,'ScComplaint',selectedGraphSubstatus,reportTypeForCustomerDetails)
          }
        }
        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
      }

      /* var chart = new google.visualization.PieChart(document.getElementById('piechart_3d1'));
      */
   $scope.loaderLiveStats = false;
   function getCallerLiveStats(id) {
      adminUserScId = id;
      $scope.loaderLiveStats = true;
      var lsToken = TokenService.getToken(adminUserScId);
    TeleCallerCallStatsDataService.query({scId:adminUserScId,dataType:selectedStatus,token:lsToken},function (data) {
          console.log('Caller Live Status :',data);
          $scope.creLiveStatusData = data;
          angular.forEach($scope.creLiveStatusData,function(val,index){
          if(data[index].callingRate === undefined){
            $scope.creLiveStatusData[index].callingRate = 'NA';
          }
          if(data[index].status === 'green'){
            $scope.creLiveStatusData[index].status = 'Active';
          } else if(data[index].status === 'red'){
            $scope.creLiveStatusData[index].status = 'InActive';
          }
          });
         // console.log('$scope.creLiveStatusData',$scope.creLiveStatusData);
        $scope.loaderLiveStats = false;
      }, function(err) {
        $scope.loaderLiveStats = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    //getCallerLiveStats(adminUserScId);

    var selectedDataTypeId;
    var selectedStatsStatus;
    var selectedServiceDueType;
    var selectedDataTypeName;
    $scope.getPericularStatsData = function (dataTypeName,status,dataTypeId,selFromDate,selToDate,selReportType) {
      //console.log('dataTypeName : ',dataTypeName);
      //console.log('dataTypeId : ',dataTypeId);
      //console.log('status : ',status);
      $scope.exportStatus = 'Customer Stats';
      $scope.statusDisplay = status;
      if($scope.statusDisplay === 'connected'){
         $scope.statusDisplay = 'Connected';
      } else if($scope.statusDisplay === 'connected'){
         $scope.statusDisplay = 'Connected';
      } else if($scope.statusDisplay === 'servicedone'){
         $scope.statusDisplay = 'Service Done';
      } else if($scope.statusDisplay === 'allocated'){
         $scope.statusDisplay = 'Allocated';
      } else if($scope.statusDisplay === 'attempted'){
         $scope.statusDisplay = 'Attempted';
      } else if($scope.statusDisplay === 'calllater'){
         $scope.statusDisplay = 'Call Later';
      } else if($scope.statusDisplay === 'notinterested'){
         $scope.statusDisplay = 'Not Interested';
      } else if($scope.statusDisplay === 'appointmenttaken'){
         $scope.statusDisplay = 'Appointment Taken';
      } else if($scope.statusDisplay === 'nonconverted'){
         $scope.statusDisplay = 'Non Converted';
      } else if($scope.statusDisplay === 'pending'){
         $scope.statusDisplay = 'Pending';
      } else if($scope.statusDisplay === 'converted'){
         $scope.statusDisplay = 'Converted';
      } else if($scope.statusDisplay === 'allocatedConversion'){
         $scope.statusDisplay = 'Allocated Conversion';
      } else if($scope.statusDisplay === 'freshCalls'){
         $scope.statusDisplay = 'Fresh Calls';
      } 
      selectedFromDateConversion = selFromDate;
      selectedToDateConversion = selToDate;
      selectedDataTypeName = dataTypeName;
      $rootScope.exportType = true;
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      selectedDataTypeId = dataTypeId;
        if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
          selectedServiceDueType = 'Free';
        } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
          selectedServiceDueType = 'Paid';
        } else if (dataTypeName === 'Service Reminder Post Warranty'){
          selectedServiceDueType = 'Post Warranty';
        } else if (dataTypeName === 'Service Reminder Extended Warranty'){
          selectedServiceDueType = 'Extended Warranty';
        } else if(dataTypeName === 'Service Reminder Chain Lube Service'){
          selectedServiceDueType = 'Chain Lube Service';
        } else if (dataTypeName === 'Service Reminder Maintenance Service'){
         selectedServiceDueType = 'Maintenance Service';
        } else if (dataTypeName === 'Service Reminder Fitness Certificate'){
         selectedServiceDueType = 'Fitness Certificate';
        }
        else {
          selectedServiceDueType = 'both';
        }
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);

       reportTypeForCustomerDetails = selReportType;
       if(reportTypeForCustomerDetails === 'export'){
         $scope.exportStatus = 'Customer Stats';
         console.log(serviceURL+'get_caller_dashboard_details/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/NA/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
         $window.open(serviceURL+'get_caller_dashboard_details/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/NA/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
       }else if(reportTypeForCustomerDetails === 'submit'){
      AdminCustomerDetailsStatsWiseService.query({scId:adminUserScId,callerId:selectedCaller,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,subStatus:'NA',branchId:selectedBranch,reportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
        console.log('ADMIN CUSTOMER DETAILS STATS WISE :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      },function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
    }
    };


     //$scope.adminCustomerDetails = [];
     $rootScope.creTableData = [];
     var reportTypeForCustomerDetails = 'submit';
     var selectedGraphMonth;
     var selectedGraphStatus;
function getAdminCustomerDetails(selCaller,selBranch,selMonth,selStatus,selReportType) {
    $rootScope.exportType = true;
    selectedCaller = selCaller;
    selectedBranch = selBranch;
    selectedGraphMonth = selMonth;
    selectedGraphStatus = selStatus;
    $scope.statusDisplay = selectedGraphStatus;
    reportTypeForCustomerDetails = selReportType;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);

      if(reportTypeForCustomerDetails === 'export'){
        $scope.exportStatus === 'Month Conversion';
         $window.open(serviceURL+'get_caller_wise_last_four_month_appt_details/'+adminUserScId+'/'+selectedCaller+'/'+selectedBranch+'/'+selectedGraphMonth+'/'+selectedGraphStatus+'/'+reportTypeForCustomerDetails+'/'+selectedStatus+'/'+lsToken);
          showLoader(false); 
         reportTypeForCustomerDetails = 'submit';
      }else if(reportTypeForCustomerDetails === 'submit'){
       AdminCustomerDetailsService.query({scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,month:selectedGraphMonth,status:selectedGraphStatus,reportType:reportTypeForCustomerDetails,dataType:selectedStatus,token:lsToken},function (data) {
       console.log('ADMIN CUSTOMER DETAILS :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      }, function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
   }

    }


     var selectedGraphSubstatus;

function getAdminCustomerDetailsStatusWise(selCaller,selBranch,selStatus,selSubStatus,selReportType) {
    $rootScope.exportType = true;
    selectedCaller = selCaller;
    selectedBranch = selBranch;
    selectedGraphSubstatus = selSubStatus;
    selectedGraphStatus = selStatus;
    if(selSubStatus === 'conversion'){
      $scope.statusDisplay = selectedGraphStatus;
    } else {
       $scope.statusDisplay = selectedGraphSubstatus;
    }
    reportTypeForCustomerDetails = selReportType;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);

      if(reportTypeForCustomerDetails === 'export'){
        $scope.exportStatus = '';
         $window.open(serviceURL+'get_status_substatus_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+selectedGraphStatus+'/'+selectedGraphSubstatus+'/'+selectedCaller+'/'+selectedBranch+'/'+adminUserScId+'/'+reportTypeForCustomerDetails+'/'+selectedStatus+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
      }else if(reportTypeForCustomerDetails === 'submit'){
       AdminCustomerDetailsStatusWiseService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,status:selectedGraphStatus,subStatus:selectedGraphSubstatus,callerId:selectedCaller,branchId:selectedBranch,scId:adminUserScId,reportType:reportTypeForCustomerDetails,dataType:selectedStatus,token:lsToken},function (data) {
       console.log('ADMIN CUSTOMER DETAILS STATUS WISE:',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      }, function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
     }
    }

 function getAdminConversionDetailsStatusWise(selCaller,selBranch,selStatus,selSubStatus,selReportType){
    $rootScope.exportType = true;
    selectedCaller = selCaller;
    selectedBranch = selBranch;
    selectedGraphSubstatus = selSubStatus;
    selectedGraphStatus = selStatus;
    if(selSubStatus === 'conversion'){
      $scope.statusDisplay = selectedGraphStatus;
    } else {
       $scope.statusDisplay = selectedGraphSubstatus;
    }
    reportTypeForCustomerDetails = selReportType;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);

      if(reportTypeForCustomerDetails === 'export'){
        $scope.exportStatus = '';
         $window.open(serviceURL+'get_status_wise_conversion_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+selectedGraphStatus+'/'+selectedCaller+'/'+selectedBranch+'/'+adminUserScId+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
      }else if(reportTypeForCustomerDetails === 'submit'){
       GetStatusWiseConversionDetailsService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,status:selectedGraphStatus,callerId:selectedCaller,branchId:selectedBranch,scId:adminUserScId,reportType:reportTypeForCustomerDetails,token:lsToken},function (data) {
       console.log('ADMIN CONVERSION DETAILS STATUS WISE:',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      }, function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
     }
    }


function getAdminCustomerDetailsScComplaintWise(selCaller,selBranch,selStatus,selSubStatus,selReportType) {
    $rootScope.exportType = true;
    selectedCaller = selCaller;
    selectedBranch = selBranch;
    selectedGraphSubstatus = selSubStatus;
    selectedGraphStatus = selStatus;
    $scope.statusDisplay = selectedGraphSubstatus;
    reportTypeForCustomerDetails = selReportType;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
       if(reportTypeForCustomerDetails === 'export'){
        $scope.exportStatus = '';
         $window.open(serviceURL+'get_sc_complaint_details/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+selectedGraphStatus+'/'+selectedGraphSubstatus+'/'+selectedCaller+'/'+selectedBranch+'/'+adminUserScId+'/'+reportTypeForCustomerDetails+'/'+selectedStatus+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
       }else if(reportTypeForCustomerDetails === 'submit'){
       AdminCustomerDetailsScComplaintWiseService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,status:selectedGraphStatus,subStatus:selectedGraphSubstatus,callerId:selectedCaller,branchId:selectedBranch,scId:adminUserScId,reportType:reportTypeForCustomerDetails,dataType:selectedStatus,token:lsToken},function (data) {
       console.log('ADMIN CUSTOMER DETAILS STATUS WISE:',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      }, function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
     }
    }


    var chartLabel;
    $scope.getTcAdminStatsStatusDetail = function (statsCount) {
      console.log('status :  :',Array.isArray(statsCount));
      if(Array.isArray(statsCount) === true) {
        console.log('graph lable :  :',statsCount[0]._model.label);
        console.log('graph lable status :  :',statsCount[0]._model.datasetLabel);
        //chartLabel = statsCount[0]._model.datasetLabel;
        selectedGraphMonth = statsCount[0]._model.label;
        selectedGraphStatus = statsCount[0]._model.datasetLabel;
        $scope.exportStatus = 'Month Conversion';
      }
      /*else {
        selStatus = statsCount;
      }*/
      else if(Array.isArray(statsCount) === false){
        selStatus = statsCount;
      }
      getAdminCustomerDetails(selectedCaller,selectedBranch,selectedGraphMonth,selectedGraphStatus,reportTypeForCustomerDetails);
    };


    $rootScope.tableParams = new ngTableParams({
      page: 1,
      count: 20
    }, {
      total: $rootScope.creTableData.length,
      getData: function ($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ?
          $filter('orderBy')($rootScope.creTableData, params.orderBy()) :
          $rootScope.creTableData;

        orderedData = params.filter() ?
          $filter('filter')(orderedData, params.filter()) :
          orderedData;
        $scope.orderedData = orderedData;
        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve($scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    }, {
      counts: [10, 20]
    });
    $rootScope.tableParams.settings().counts = [10, 20, 50, 100];
    $scope.selectedPageSizes = $rootScope.tableParams.settings().counts;
    $scope.changePage = changePage;
    $scope.changePageSize = changePageSize;
    $scope.changePageSizes = changePageSizes;

    function changePage(nextPage) {
      $rootScope.tableParams.page(nextPage);
      $rootScope.tableParams.reload();
    }

    function changePageSize(newSize) {
      $rootScope.tableParams.count(newSize);
    }
    function changePageSizes(newSizes) {
      // ensure that the current page size is one of the options
      if (newSizes.indexOf($rootScope.tableParams.count()) === 0) {
        newSizes.push($rootScope.tableParams.count());
        newSizes.sort();
      }
      $rootScope.tableParams.settings({
        counts: newSizes
      });

    }

    function getAppointmentHistoryData(selChassisNo,selDataTypeId) {
      //console.log(selChassisNo);
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentHistoryDataService.query({chassisNo:selChassisNo,id:adminUserScId,dataTypeId:selDataTypeId,bikeBrand:loginBrandName,token:lsToken},function (data) {
       console.log('history data :',data);
       $scope.tcAppointmentHistoryData = data;
       showLoader(false);
      }, function (err) {
        showLoader(false);
        console.log('history error data',err);
        $scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
      });
    }

   function getLsHistory(selChassisNo) {
      //console.log(selChassisNo);
      $scope.lsHistoryData = [];
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerLSHistoryDataService.query({chassisNo:selChassisNo,scId:adminUserScId,token:lsToken},function (data) {
       console.log('LS history data :',data);
       $scope.lsHistoryData = data;
       showLoader(false);
      }, function (err) {
        showLoader(false);
        console.log('LS history error data',err);
        $scope.lsHistoryData = [];
        $scope.lsHistoryDataErrorMsg = err.data.message;
      });
    }
  
    $scope.getHistory = function(selChassisNo,selDataTypeId,selApptId,selStatus){
      //console.log(selApptId);
      if(selStatus === undefined || selStatus === null){
        selStatus = 'status';
      }
      getAppointmentHistoryData(selChassisNo,selDataTypeId);
      getTCAppointmentCallRecord(selChassisNo,selDataTypeId);
      getServiceHistoryData(selChassisNo);
      getAppointmentDetails(selApptId,selStatus);
      getLsHistory(selChassisNo);
    };

    $scope.getDetails = function(selApptId,selStatus){
      $scope.editPhoneSuccessMsg = '';
      console.log(selApptId);
      console.log(selStatus);
      if(selStatus === undefined || selStatus === null){
        selStatus = 'status';
      }
      getAppointmentDetails(selApptId,selStatus);
    };

    $scope.editPhoneNumber = function(selMobile,apptObj,defaultNumStatus,selectedMobileStatus){
      console.log('selMobile',selMobile);
      console.log('apptObj',apptObj);
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
       // checkActiveInactiveStatus = false;
        $timeout(function() {
          $('#editPhoneModal').modal('hide');
          $("#activeDeactivePhoneModal").modal('hide');
          getAppointmentDetails(apptObj.apptId,$scope.statusDisplay);
        }, 2000);
        $scope.phoneObj = {};
        $scope.editPhoneForm.$setPristine();
        }, function (err) {
        console.log(err);
        $scope.editPhoneErrorMsg = err.data.message;
      });
    };

    function getTCAppointmentCallRecord(selChassisNo,selDataTypeId) {
      $scope.callRecording = [];
      //var apptId = parseInt(selApptId);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallingCallRecordService.query({chassisNo:selChassisNo,logInId:adminUserId,scId:adminUserScId,dataTypeId:selDataTypeId,token:lsToken}, function(data) {
        $scope.callRecording = data;
        console.log('callRecording',data);
      }, function(err) {
       // console.log(err);
        var callRecordNotAvailable = {
          recordingUrl : err.data.message,
          create_ts : ''
        };
        $scope.callRecording.push(callRecordNotAvailable);
      });
    }
    $scope.viewCallRecord = function(callRecordUrl) {
      $window.open(callRecordUrl.recordingUrl,'_blank');
    };

    $scope.pauseCallRecord=function (){
     var stopRecord = document.getElementById("stopRecording");
      //console.log(stopRecord);
      stopRecord.pause();
    }

    $scope.clearRecording = function(){
     var stopRecord = document.getElementById("stopRecording");
     //console.log(stopRecord);
     stopRecord.pause();
    }

    $scope.exportCustomerDetails = function(){
      console.log('Inside Export');
      if($scope.exportStatus === 'Customer Stats'){
        console.log($scope.exportStatus);
        $scope.getPericularStatsData(selectedDataTypeName,selectedStatsStatus,selectedDataTypeId,selectedFromDateConversion,selectedToDateConversion,'export');
      }
      if($scope.exportStatus === 'Customer Complete Potential Stats'){
        console.log($scope.exportStatus);
        $scope.getPericularCompleteStatsData(selectedDataTypeName,selectedStatsStatus,selectedDataTypeId,'export');
      }
      if($scope.exportStatus === 'Customer Potential Stats'){
        console.log($scope.exportStatus);
        $scope.getPericularStatsServiceDueDateWiseData(selectedDataTypeName,selectedStatsStatus,selectedDataTypeId,'export');
      }
       if($scope.exportStatus === 'Over Due Details'){
        console.log($scope.exportStatus);
         $scope.getPericularCompleteStatsData('dataTypename','overduecalls','all','export');
     }
      if($scope.exportStatus === 'Month Conversion'){
        console.log($scope.exportStatus);
        getAdminCustomerDetails(selectedCaller,selectedBranch,selectedGraphMonth,selectedGraphStatus,'export');
      } else if($scope.exportStatus === 'Conversion'){
        getAdminConversionDetailsStatusWise(selectedCaller,selectedBranch,selectedGraphStatus,'conversion','export')
      } else if($scope.exportStatus === 'Call Later'){
        getAdminCustomerDetailsStatusWise(selectedCaller,selectedBranch,'Call Later',selectedGraphSubstatus,'export')
      } else if($scope.exportStatus === 'ScComplaint'){
        getAdminCustomerDetailsScComplaintWise(selectedCaller,selectedBranch,'ScComplaint',selectedGraphSubstatus,'export')
      } else if($scope.exportStatus === 'Not Interested'){
        getAdminCustomerDetailsStatusWise(selectedCaller,selectedBranch,'Not Interested',selectedGraphSubstatus,'export')
      }
    }

    /*$scope.getPericularStatsDataDataTypeWise = function(){
     getDueTypeWiseStatsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
     $scope.dueTypeAppointmentStatus = true;
    }

  $scope.dismissAppointmentDueTypePage = function () {
      $scope.dueTypeAppointmentStatus = false;
    };*/


$scope.fsc1DueColors = ['#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F'];
$scope.fsc2DueColors = ['#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900'];
$scope.fsc3DueColors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.fsc4DueColors = ['#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca'];
$scope.fsc5DueColors = ['#9999ff', '#9999ff','#9999ff', '#9999ff','#9999ff', '#9999ff','#9999ff', '#9999ff','#9999ff', '#9999ff','#9999ff'];
$scope.fsc6DueColors = ['#666699','#666699','#666699','#666699','#666699','#666699','#666699','#666699','#666699','#666699','#666699','#666699','#666699' ];
$scope.fsc7DueColors = ['#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc','#00ffcc'];

$scope.dueTypeStatsSeries =["FSC1","FSC2","FSC3","FSC4","FSC5","FSC6","FSC7"];
$scope.dueTypeStatsData = [];
$scope.dueTypeStatsLables = [];
var fsc1Due = [];
var fsc2Due = [];
var fsc3Due = [];
var fsc4Due = [];
var fsc5Due = [];
var fsc6Due = [];
var fsc7Due = [];
$scope.totalFreeAllocated = 0;
$scope.totalFreeAppointmentTaken = 0;
$scope.totalFreePending = 0;
$scope.totalFreeCallerConversion = 0;
$scope.totalFreeTotalConversion = 0;
$scope.dueTypeChart = {};
function getDueTypeWiseStatsData(selCaller,selBranch,selFromDate,selToDate) {
   $scope.dueTypeStatsSeries =["FSC1","FSC2","FSC3","FSC4","FSC5","FSC6","FSC7"];
   $scope.dueTypeChart = {};
    selectedFromDateConversion = selFromDate;
    selectedToDateConversion = selToDate;
    selectedCaller = selCaller;
    selectedBranch = selBranch
$scope.dueTypeStatsData = [];
$scope.dueTypeStatsLables = [];
 fsc1Due = []; 
 fsc2Due = [];
 fsc3Due = [];
 fsc4Due = [];
 fsc5Due = [];
 fsc6Due = [];
 fsc7Due = [];
 $scope.totalFreeAllocated = 0;
 $scope.totalFreeAppointmentTaken = 0;
 $scope.totalFreePending = 0;
 $scope.totalFreeCallerConversion = 0;
 $scope.totalFreeTotalConversion = 0;
     $scope.loaderIconDueType = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetDueTypeStatsService.get({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,token:lsToken},function (data) {
       console.log('Due Type Data :',data);
        var dueTypeStats = data;

/*var dueTypeStats = {"FSC1":{"0":{"apptCount":"69","apptStatus":"Allocated"},"1":{"apptCount":"154","apptStatus":"Attempted"},"2":{"apptCount":"118","apptStatus":"Connected"},"4":{"apptCount":"5","apptStatus":"Not Interested"},"3":{"apptCount":"35","apptStatus":"Call Later"},"5":{"apptCount":"25","apptStatus":"Service Done"},"6":{"apptCount":"61","apptStatus":"Appointment Taken"},"7":{"apptCount":"10","apptStatus":"Non Converted"},"8":{"apptCount":"0","apptStatus":"Pending Count"},"10":{"apptCount":"0","apptStatus":"Fresh Calls"},"9":{"apptCount":"51","apptStatus":"MTDConversion"}},
"FSC3":{"0":{"apptCount":"162","apptStatus":"Allocated"},"1":{"apptCount":"270","apptStatus":"Attempted"},"2":{"apptCount":"196","apptStatus":"Connected"},"4":{"apptCount":"14","apptStatus":"Not Interested"},"3":{"apptCount":"73","apptStatus":"Call Later"},"5":{"apptCount":"36","apptStatus":"Service Done"},"6":{"apptCount":"101","apptStatus":"Appointment Taken"},"7":{"apptCount":"37","apptStatus":"Non Converted"},"8":{"apptCount":"5","apptStatus":"Pending Count"},"10":{"apptCount":"0","apptStatus":"Fresh Calls"},"9":{"apptCount":"64","apptStatus":"MTDConversion"}},
"FSC4":{"0":{"apptCount":"126","apptStatus":"Allocated"},"1":{"apptCount":"287","apptStatus":"Attempted"},"2":{"apptCount":"206","apptStatus":"Connected"},"4":{"apptCount":"31","apptStatus":"Not Interested"},"3":{"apptCount":"75","apptStatus":"Call Later"},"5":{"apptCount":"29","apptStatus":"Service Done"},"6":{"apptCount":"86","apptStatus":"Appointment Taken"},"7":{"apptCount":"45","apptStatus":"Non Converted"},"8":{"apptCount":"6","apptStatus":"Pending Count"},"10":{"apptCount":"1","apptStatus":"Fresh Calls"},"9":{"apptCount":"41","apptStatus":"MTDConversion"}}};
*/
        if(dueTypeStats.FSC1 !== undefined && dueTypeStats.FSC1 !== null){
          angular.forEach(dueTypeStats.FSC1,function(val,index){
          fsc1Due.push(parseInt(dueTypeStats.FSC1[index].apptCount));
          $scope.dueTypeStatsLables.push(dueTypeStats.FSC1[index].apptStatus);
        });
        }
        if(dueTypeStats.FSC2 !== undefined && dueTypeStats.FSC2 !== null){
          angular.forEach(dueTypeStats.FSC2,function(val,index){
          fsc2Due.push(parseInt(dueTypeStats.FSC2[index].apptCount));
         });
        }
        if(dueTypeStats.FSC3 !== undefined && dueTypeStats.FSC3 !== null){
          angular.forEach(dueTypeStats.FSC3,function(val,index){
          fsc3Due.push(parseInt(dueTypeStats.FSC3[index].apptCount));
        });
        }
        if(dueTypeStats.FSC4 !== undefined && dueTypeStats.FSC4 !== null){
          angular.forEach(dueTypeStats.FSC4,function(val,index){
          fsc4Due.push(parseInt(dueTypeStats.FSC4[index].apptCount));
        });
        }
        if(dueTypeStats.FSC5 !== undefined && dueTypeStats.FSC5 !== null){
          angular.forEach(dueTypeStats.FSC5,function(val,index){
          fsc5Due.push(parseInt(dueTypeStats.FSC5[index].apptCount));
        }); 
        }
         if(dueTypeStats.FSC6 !== undefined && dueTypeStats.FSC6 !== null){
          angular.forEach(dueTypeStats.FSC6,function(val,index){
          fsc6Due.push(parseInt(dueTypeStats.FSC6[index].apptCount));
        });
        }
        if(dueTypeStats.FSC7 !== undefined && dueTypeStats.FSC7 !== null){
          angular.forEach(dueTypeStats.FSC7,function(val,index){
          fsc7Due.push(parseInt(dueTypeStats.FSC7[index].apptCount));
        });  
        }

        if(dueTypeStats.FSC2 === undefined && dueTypeStats.FSC4 === undefined && dueTypeStats.FSC6 === undefined){
          $scope.dueTypeStatsSeries =["FSC1","FSC3","FSC5","FSC7"];
        }
    
      if(fsc1Due.length > 0 && (fsc1Due !== undefined && fsc1Due !== null && fsc1Due !== [])){
        $scope.dueTypeStatsData.push(fsc1Due);
        $scope.totalFreeAllocated += parseInt(dueTypeStats.FSC1[0].apptCount);
        $scope.totalFreeAppointmentTaken += parseInt(dueTypeStats.FSC1[1].apptCount);
        $scope.totalFreePending += parseInt(dueTypeStats.FSC1[2].apptCount);
        $scope.totalFreeCallerConversion += parseInt(dueTypeStats.FSC1[3].apptCount);
        $scope.totalFreeTotalConversion += parseInt(dueTypeStats.FSC1[4].apptCount);
      }
      if(fsc2Due.length > 0 && (fsc2Due !== undefined && fsc2Due !== null && fsc2Due !== [])){
        $scope.dueTypeStatsData.push(fsc2Due);
        $scope.totalFreeAllocated += parseInt(dueTypeStats.FSC2[0].apptCount);
        $scope.totalFreeAppointmentTaken += parseInt(dueTypeStats.FSC2[1].apptCount);
        $scope.totalFreePending += parseInt(dueTypeStats.FSC2[2].apptCount);
        $scope.totalFreeCallerConversion += parseInt(dueTypeStats.FSC2[3].apptCount);
        $scope.totalFreeTotalConversion += parseInt(dueTypeStats.FSC2[4].apptCount);
      }
      if(fsc3Due.length > 0 && (fsc3Due !== undefined && fsc3Due !== null && fsc3Due !== [])){
        $scope.dueTypeStatsData.push(fsc3Due);
        $scope.totalFreeAllocated += parseInt(dueTypeStats.FSC3[0].apptCount);
        $scope.totalFreeAppointmentTaken += parseInt(dueTypeStats.FSC3[1].apptCount);
        $scope.totalFreePending += parseInt(dueTypeStats.FSC3[2].apptCount);
        $scope.totalFreeCallerConversion += parseInt(dueTypeStats.FSC3[3].apptCount);
        $scope.totalFreeTotalConversion += parseInt(dueTypeStats.FSC3[4].apptCount);
      }
      if(fsc4Due.length > 0 && (fsc4Due !== undefined && fsc4Due !== null && fsc4Due !== [])){
        $scope.dueTypeStatsData.push(fsc4Due);
        $scope.totalFreeAllocated += parseInt(dueTypeStats.FSC4[0].apptCount);  
        $scope.totalFreeAppointmentTaken += parseInt(dueTypeStats.FSC4[1].apptCount);
        $scope.totalFreePending += parseInt(dueTypeStats.FSC4[2].apptCount);
        $scope.totalFreeCallerConversion += parseInt(dueTypeStats.FSC4[3].apptCount);
        $scope.totalFreeTotalConversion += parseInt(dueTypeStats.FSC4[4].apptCount);
      }
      if(fsc5Due.length > 0 && (fsc5Due !== undefined && fsc5Due !== null && fsc5Due !== [])){
        $scope.dueTypeStatsData.push(fsc5Due);
        $scope.totalFreeAllocated += parseInt(dueTypeStats.FSC5[0].apptCount);
        $scope.totalFreeAppointmentTaken += parseInt(dueTypeStats.FSC5[1].apptCount);
        $scope.totalFreePending += parseInt(dueTypeStats.FSC5[2].apptCount);
        $scope.totalFreeCallerConversion += parseInt(dueTypeStats.FSC5[3].apptCount);
        $scope.totalFreeTotalConversion += parseInt(dueTypeStats.FSC5[4].apptCount);
      }
      if(fsc6Due.length > 0 && (fsc6Due !== undefined && fsc6Due !== null && fsc6Due !== [])){
        $scope.dueTypeStatsData.push(fsc6Due);
        $scope.totalFreeAllocated += parseInt(dueTypeStats.FSC6[0].apptCount); 
        $scope.totalFreeAppointmentTaken += parseInt(dueTypeStats.FSC6[1].apptCount); 
        $scope.totalFreePending += parseInt(dueTypeStats.FSC6[2].apptCount);
        $scope.totalFreeCallerConversion += parseInt(dueTypeStats.FSC6[3].apptCount);
        $scope.totalFreeTotalConversion += parseInt(dueTypeStats.FSC6[4].apptCount);
      }
       if(fsc7Due.length > 0 && (fsc7Due !== undefined && fsc7Due !== null && fsc7Due !== [])){
        $scope.dueTypeStatsData.push(fsc7Due);
        $scope.totalFreeAllocated += parseInt(dueTypeStats.FSC7[0].apptCount);
        $scope.totalFreeAppointmentTaken += parseInt(dueTypeStats.FSC7[1].apptCount);
        $scope.totalFreePending += parseInt(dueTypeStats.FSC7[2].apptCount);
        $scope.totalFreeCallerConversion += parseInt(dueTypeStats.FSC7[3].apptCount);
        $scope.totalFreeTotalConversion += parseInt(dueTypeStats.FSC7[4].apptCount);
      }

 console.log(JSON.stringify('DUE TYPE STATS++++++++++++++++++',$scope.dueTypeStatsData));
       
       $scope.filteredDueTypeStatsData = [];
       $scope.filteredDueTypeStatsLables = [];
for(var i=0;i<7;i++){
  if($scope.dueTypeStatsData[i] !== undefined){
     $scope.filteredDueTypeStatsData.push($scope.dueTypeStatsData[i]);
  }
}
for(var i=0;i<5;i++){
$scope.filteredDueTypeStatsLables.push($scope.dueTypeStatsLables[i]);
}
        $scope.dueTypeChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    }
            ,
            labels: $scope.filteredDueTypeStatsLables ,
            series: $scope.dueTypeStatsSeries ,
            colors: ['#FB617F', '#ff9900','#2FCF92','#0083ca','#9999ff','#666699','#00ffcc'],
            data: $scope.filteredDueTypeStatsData 
        };
        
        $scope.datasetOverrideDueType = [
            {
                fill: true,
                backgroundColor: $scope.fsc1DueColors
            },
            {
                fill: true,
                backgroundColor:$scope.fsc2DueColors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc3DueColors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc4DueColors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc5DueColors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc6DueColors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc7DueColors
            }
            ];
        //console.log(JSON.stringify('DUE TYPE STATS',$scope.filteredDueTypeStatsData));
        //console.log(JSON.stringify('DUE TYPE STATS',$scope.dueTypeStatsData));
        console.log(JSON.stringify($scope.dueTypeStatsLables));
        console.log(JSON.stringify($scope.dueTypeStatsSeries));

      
         $scope.loaderIconDueType = false;
      }, function(err) {
          $scope.loaderIconDueType = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    //getDueTypeWiseStatsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);

  $scope.trustAsResourceUrl1 = function (recordings) {
     //console.log(recordings);
     return $sce.trustAsResourceUrl(recordings);
   };


function getServiceHistoryData(chassisNo) {
      $scope.loaderIconService = true;
      $scope.tcServiceHistoryData = [];
      console.log('Chassis no', chassisNo);
      var lsToken = TokenService.getToken(adminUserScId);
      ServiceTypeService.query({chassisNo:chassisNo,id:adminUserScId,bikeBrand:loginBrandName,token:lsToken},function (data) {
        console.log('Service history data :',data);
        $scope.loaderIconService = false;
        $scope.tcServiceHistoryData = data; 
        $scope.tcServiceHistoryDataErrorMsg = '';
      }, function (err) {
        $scope.loaderIconService = false;
        $scope.tcServiceHistoryDataErrorMsg = 'No Data Available';
      });
    }

    $scope.customerMobileNumbers = [];
    var customerMobileNumbers = [];
  function getAppointmentDetails(apptId,selStatus) {
      $scope.customerMobileNumbers = [];
      $scope.currentMobile = null;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentDataService.query({apptId:apptId,scId:adminUserScId,status:selStatus,callerId:adminUserId,token:lsToken}, function (data) {
        console.log('data in detailed page',data[0]);
        $scope.tcAppointmentData = data[0];
        $scope.tcAppointmentDataErrorMsg = '';
        //$scope.customerMobileNumbers = $scope.tcAppointmentData.mobile;
        customerMobileNumbers = $scope.tcAppointmentData.mobile;
        /* for(var i=0;i<customerMobileNumbers.length;i++){
           console.log('customerMobileNumbers[i]',customerMobileNumbers[i]);
           $scope.customerMobileNumbers.push(customerMobileNumbers[i]);
         }*/
       /* $scope.currentMobile = $scope.customerMobileNumbers[0].customer_mobile;
        if($scope.currentMobile === null){
          $scope.currentMobile = $scope.customerMobileNumbers[0].customer_mobile;
        }
        console.log('$scope.currentMobile',$scope.currentMobile);
       */
        for(var i=0;i<customerMobileNumbers.length;i++){
          if(customerMobileNumbers[i].customer_mobile === $scope.tcAppointmentData.customer_mobile){
            customerMobileNumbers[i].customer_mobile = customerMobileNumbers[i].customer_mobile+'*';
            $scope.currentMobile = customerMobileNumbers[i].customer_mobile;
           }
           $scope.customerMobileNumbers.push(customerMobileNumbers[i]);
        }
          
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
        showLoader(false);
      }, function (err) {
        $scope.tcAppointmentDataErrorMsg = 'No Data Available';
        //$window.alert('No data found for this appointment .');
        showLoader(false);
      });
  }

 var mobileActiveStatus = false;
 var mobileDeactiveStatus = false;
 var mobilePrimaryStatus = false;
 var selectedMobileStatus;
 $scope.getUpdateMobileStatus = function(selMobile,apptObj,defaultNumStatus,selMobileStatus){
   selectedMobileStatus = selMobileStatus;
   if(selMobileStatus === 'active'){
      $timeout(function() {
      mobileActiveStatus = $window.confirm('Are you sure to Activate this Mobile No.?');
      if(mobileActiveStatus){
        console.log('Updating :',selectedMobileStatus);
        $scope.editPhoneNumber(selectedMobileNumer,apptObj,defaultNumStatus,selectedMobileStatus);
        $scope.phoneObj = {};
      } else{
       console.log('Cancelled the Activation Event');
      }  
        }, 300);
     
   } else if(selMobileStatus === 'inactive'){
      $timeout(function() {
        console.log(selectedMobileNumer);
        console.log($scope.tcAppointmentData.customer_mobile);
        if(selectedMobileNumer === $scope.tcAppointmentData.customer_mobile){
          alert('This is the Primary number.You cannot deactivate the number.');
          mobileDeactiveStatus = false;
       } else if(selectedMobileNumer !== $scope.tcAppointmentData.customer_mobile){
          mobileDeactiveStatus = $window.confirm('Are you sure to Deactivate this Mobile No.?');
       }
       if(mobileDeactiveStatus){
        console.log('Updating :',selectedMobileStatus);
        $scope.editPhoneNumber(selectedMobileNumer,apptObj,defaultNumStatus,selectedMobileStatus);
        $scope.phoneObj = {};
      } else{
        console.log('Cancelled the Deactivation Event');
      } 
       }, 300);     
  }
  else if(selMobileStatus === 'primary'){
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

 
$scope.downloadPDF = function(id) {
  var newCanvas = document.querySelector('#'+id);
  //create image from dummy canvas
  var newCanvasImg = newCanvas.toDataURL("image/jpeg", 1.0);
    //creates PDF from img
  var doc = new jsPDF('landscape');
  doc.setFontSize(20);
  doc.text(15, 15, "Super Cool Chart");
  doc.addImage(newCanvasImg, 'JPEG', 10, 10, 280, 150 );
  doc.save('new-canvas.pdf');
 };
//document.getElementById('download-pdf').addEventListener("click", downloadPDF);


  });
