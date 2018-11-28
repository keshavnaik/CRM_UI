'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('CrmDealerPerformanceController', function ($scope,$sce,serviceURL,$filter,$cookies,ngTableParams,$rootScope,$window,TokenService,CreDashboardStatsDataService,DealerPerformanceStatsService,DealerPerformanceCompleteStatsService,GetScWiseTeleCallerService,TeleCallerWiseServiceCenterService,GetSuperAdminDealerListService,DealerPerformanceTotalMonthlyStatsService,DealerPerformanceMonthlyOverallStatsService,AdminCustomerDetailsStatsWiseService,TeleCallerPerticularAppointmentHistoryDataService,TeleCallerLSHistoryDataService,TeleCallingCallRecordService,ServiceTypeService,TeleCallerPerticularAppointmentDataService,AdminCustomerCompletePotentialDetailsService,AdminCustomerPotentialDetailsService) {

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

    $scope.getSelectedDealer = function (selDealer) {
      selectedCaller = 'caller';
      selectedBranch = 'branch';
      console.log(selDealer);
      adminUserScId = selDealer;
      $rootScope.scIdSuperAdmin = selDealer;
      getServiceCenterTeleCallerWise(adminUserScId);
      getScWiseCallerList(adminUserScId);
      getDealerDashboardData(selectedCaller,selectedBranch,potentialStatus);
      getTotalMonthyStats(selectedCaller,selectedBranch,potentialStatus);
      getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
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

    $scope.getSelectedCaller = function (selCaller) {
      console.log(selCaller);
      selectedCaller = selCaller;
      if(selCaller === null){
        selectedCaller = 'caller';
      }
      getDealerDashboardData(selectedCaller,selectedBranch,potentialStatus);
      getTotalMonthyStats(selectedCaller,selectedBranch,potentialStatus);
      getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
    };

    $scope.getSelectedBranch = function (selBranch) {
      console.log('selected branch',selBranch);
      selectedBranch = selBranch;
      if(selBranch === null){
        selectedBranch = 'branch';
      }
      getDealerDashboardData(selectedCaller,selectedBranch,potentialStatus);
      getTotalMonthyStats(selectedCaller,selectedBranch,potentialStatus);
      getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
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
      getDealerDashboardData(selectedCaller,selectedBranch,potentialStatus);
      getTotalMonthyStats(selectedCaller,selectedBranch,potentialStatus);
    } else if(status === 'old stats'){
      $scope.callerNewStats = false; 
      $scope.callerOldStats = true; 
      getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
    }
   }
  $scope.getDealerPerformanceData(potentialStatus);

    function getDealerDashboardData(selCaller,selBranch,status) {
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
        DealerPerformanceStatsService.query({scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,datatypeId:selectedDataType,token:lsToken},     function(data) {
        console.log('DEALER PERFORMANCE BY SERVICE DUE DATE: : :',data);
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
              DealerPerformanceCompleteStatsService.query({scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,datatypeId:selectedDataType,token:lsToken},     function(data) {
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
      }, function(err) {
        showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
      }
    }

    function getTotalMonthyStats(selCaller,selBranch,status) {
      $scope.dealerMonthlyStats = [];
      selectedCaller = selCaller;
      selectedBranch = selBranch;
      $scope.monthlyDataLoader = true;
      var lsToken = TokenService.getToken(adminUserScId);
      if(status === 'service due date'){
        $scope.conversionHeader = 'Current Month Caller Conversion';
        DealerPerformanceTotalMonthlyStatsService.query({scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,datatypeId:selectedDataType,token:lsToken},function(data) {
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
      DealerPerformanceMonthlyOverallStatsService.query({scId:adminUserScId,callerId:selectedCaller,branch:selectedBranch,datatypeId:selectedDataType,token:lsToken},     function(data) {
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
      CreDashboardStatsDataService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,dataType:selectedDataType,token:lsToken},     function(data) {
        console.log('cre dashboard data :',data);
        $scope.creDashboardData = data;
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
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
 

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
          selectedServiceDueType = 'Warranty';
        } 
        else {
          selectedServiceDueType = 'both';
        }
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);

       reportTypeForCustomerDetails = selReportType;
       if(reportTypeForCustomerDetails === 'export'){
         $scope.exportStatus = 'Customer Stats';
         console.log(serviceURL+'get_caller_dashboard_deatils/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
         $window.open(serviceURL+'get_caller_dashboard_deatils/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
       }else if(reportTypeForCustomerDetails === 'submit'){
      AdminCustomerDetailsStatsWiseService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,branchId:selectedBranch,reportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
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
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      selectedDataTypeId = dataTypeId;
        if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
          selectedServiceDueType = 'Free';
        } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
          selectedServiceDueType = 'Paid';
        } else if (dataTypeName === 'Service Reminder Post Warranty'){
          selectedServiceDueType = 'Warranty';
        } 
        else {
          selectedServiceDueType = 'both';
        }
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);

       reportTypeForCustomerDetails = selReportType;
       if(reportTypeForCustomerDetails === 'export'){
         $scope.exportStatus = 'Customer Complete Potential Stats';
         console.log(serviceURL+'get_caller_dashboard_details_v2/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
         $window.open(serviceURL+'get_caller_dashboard_details_v2/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
       }else if(reportTypeForCustomerDetails === 'submit'){
      AdminCustomerCompletePotentialDetailsService.query({scId:adminUserScId,callerId:selectedCaller,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,branchId:selectedBranch,reportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
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
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      selectedDataTypeId = dataTypeId;
        if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
          selectedServiceDueType = 'Free';
        } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
          selectedServiceDueType = 'Paid';
        } else if (dataTypeName === 'Service Reminder Post Warranty'){
          selectedServiceDueType = 'Warranty';
        } 
        else {
          selectedServiceDueType = 'both';
        }
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);

       reportTypeForCustomerDetails = selReportType;
       if(reportTypeForCustomerDetails === 'export'){
         $scope.exportStatus = 'Customer Potential Stats';
         console.log(serviceURL+'get_caller_dashboard_details_v2/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
         $window.open(serviceURL+'get_caller_dashboard_details_v2/'+adminUserScId+'/'+selectedCaller+'/'+selectedDataTypeId+'/'+selectedStatsStatus+'/'+selectedServiceDueType+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
       }else if(reportTypeForCustomerDetails === 'submit'){
      AdminCustomerPotentialDetailsService.query({scId:adminUserScId,callerId:selectedCaller,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,branchId:selectedBranch,reportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
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
        $scope.exportStatus = '';
         $window.open(serviceURL+'get_caller_wise_last_four_month_appt_details/'+adminUserScId+'/'+selectedCaller+'/'+selectedBranch+'/'+selectedGraphMonth+'/'+selectedGraphStatus+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false); 
         reportTypeForCustomerDetails = 'submit';
      }else if(reportTypeForCustomerDetails === 'submit'){
       AdminCustomerDetailsService.query({scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,month:selectedGraphMonth,status:selectedGraphStatus,reportType:reportTypeForCustomerDetails,token:lsToken},function (data) {
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
        //console.log('orderedDataorderedData',params.filter());
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

    $scope.clearUpdateMsg = function(){
    //getAdminCustomerDetails(selectedCaller,selectedBranch,selectedGraphMonth,selectedGraphStatus,reportTypeForCustomerDetails);
    //$("#adminDataTableModal").modal('hide');
    //$("#adminDataTableModal").remove();
    //$rootScope.creTableData = [];
    }

     function getAppointmentHistoryData(selChassisNo,selDataTypeId) {
      //console.log(selChassisNo);
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentHistoryDataService.query({chassisNo:selChassisNo,id:adminUserScId,dataTypeId:selDataTypeId,token:lsToken},function (data) {
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
      console.log(stopRecord);
      stopRecord.pause();
    }

    $scope.clearRecording = function(){
     var stopRecord = document.getElementById("stopRecording");
     console.log(stopRecord);
    stopRecord.pause();
  }

  $scope.trustAsResourceUrl1 = function (recordings) {
     console.log(recordings);
     return $sce.trustAsResourceUrl(recordings);
   };

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
    }
function getServiceHistoryData(chassisNo) {
      $scope.loaderIconService = true;
      $scope.tcServiceHistoryData = [];
      console.log('Chassis no', chassisNo);
      var lsToken = TokenService.getToken(adminUserScId);
      ServiceTypeService.query({chassisNo:chassisNo,id:adminUserScId,token:lsToken},function (data) {
        console.log('Service history data :',data);
        $scope.loaderIconService = false;
        $scope.tcServiceHistoryData = data; 
        $scope.tcServiceHistoryDataErrorMsg = '';
      }, function (err) {
        $scope.loaderIconService = false;
        $scope.tcServiceHistoryDataErrorMsg = 'No Data Available';
      });
    }

    function getAppointmentDetails(apptId,selStatus) {
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentDataService.query({apptId:apptId,scId:adminUserScId,status:selStatus,callerId:adminUserId,token:lsToken}, function (data) {
        console.log('data in detailed page',data[0]);
        $scope.tcAppointmentData = data[0];
        $scope.tcAppointmentDataErrorMsg = '';
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

$(document).ready(function(){
      $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
      });
    });


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
         getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
     }
    };

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
      getCreDashboardData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
     }
    
    };

    /*var selectedDataTypeId;
    var selectedStatsStatus;
    var selectedServiceDueType;
    $scope.getPericularStatsData = function (dataTypeName,status,dataTypeId,selFromDate,selToDate) {
      //console.log('dataTypeName : ',dataTypeName);
      //console.log('dataTypeId : ',dataTypeId);
      //console.log('status : ',status);
      $scope.statusDisplay = status;
      selectedFromDateConversion = selFromDate;
      selectedToDateConversion = selToDate;
      $rootScope.exportType = false;
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      selectedDataTypeId = dataTypeId;
        if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
          selectedServiceDueType = 'Free';
        } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
          selectedServiceDueType = 'Paid';
        } else if (dataTypeName === 'Service Reminder Post Warranty'){
          selectedServiceDueType = 'Warranty';
        } 
        else {
          selectedServiceDueType = 'both';
        }
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);
      AdminCustomerDetailsStatsWiseService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,branchId:selectedBranch,token:lsToken}, function(data) {
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

    }*/
});