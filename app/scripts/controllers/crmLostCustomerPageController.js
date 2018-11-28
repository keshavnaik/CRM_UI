'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('crmLostCustomerPageController', function ($scope,$filter,ngTableParams,$cookies,$rootScope,$window,$http,serviceURL,TokenService,AdminLoginService,TeleCallerStatusService,TeleCallerDataTypeService,TeleCallerDateWiseDataService,TeleCallerStatsDataService,TeleCallerPerticularAppointmentDataService,TeleCallerPerticularAppointmentHistoryDataService,ServiceTypeService,AssistanceTypeService,TeleCallerReasonService,ScComplaintSubStatusService,TCAppointmentStatusUpdateService,TeleCallingSearchService,GetFeedbackTitleService,FeedBackDataService,TeleCallingCallService,GetCallerWiseServiceCenterService,CallingPendingStatsService,CallingPendingStatsDetailsService,UpdateTelecallerServiceCenterService,UpdatePickupAndDropService,PickupAndDropTokenService,PickupAndDropAssistanceAmountService,GetLatLngService,GetSCLocationBrandService,CheckAMCUserService,PickupAndDropSlotService,TeleCallerStatusWiseDataService,TeleCallerWiseServiceCenterService,CreDashboardDataService,CreDashboardDueTypeDataService,CreDashboardDataTableService,CreDashboardDataTableSearchService,GetCallerMainDashboardOtherDatatypeStats,CreDashboardFilterTypeDataService) {

   /* var adminUserId = $window.sessionStorage.getItem('loggedInUserId');
    var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');
    var adminUserRole = $window.sessionStorage.getItem('loggedInUserRole');*/

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var adminUserRole = $cookies.get('loggedInUserRole');
    // $scope.adminUserIdUtility = adminUserScId;


    $scope.openCalendar = function(e,status) {
      e.preventDefault();
      e.stopPropagation();
      if(status === 'FromDate') {
        $scope.isOpenFrom = true;
      } else {
        $scope.isOpenTo = true;
      }
    };

    //  alert($scope.date.getDate()-1);
    $scope.openCalendarStatus = function(e) {
      $scope.minDate = new Date();
      e.preventDefault();
      e.stopPropagation();
      $scope.isOpenFromStatus = true;
    };

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }


    var selectedDataTypeId;
    var selectedStatsStatus;
    var selectedServiceDueType;
    var subStatus = 'noSubStatus';
    var selectedBranch = 'all';
    $scope.creFilteredDataTypes = false;


    $scope.getSelectedServiceCenter = function (selBranch) {
      console.log(selBranch);
      selectedBranch = selBranch;
      if(selBranch === null){
        selectedBranch = 'all';
      }
      getCreDashboardData(selectedBranch);
    };

    function getCreDashboardData(selBranch) {
      var totalAllocated = 0;
      var totalAttemptedCount = 0;
      var totalCallLaterCount = 0;
      var totalNotInterestedCount = 0;
      var totalNonConverted = 0;
      var totalPendingCount= 0;
      var totalFreshCalls= 0;
      var totalTotalAttempted= 0;
      selectedBranch = selBranch;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      GetCallerMainDashboardOtherDatatypeStats.query({scId:adminUserScId,callerId:adminUserId,branchId:selectedBranch,token:lsToken},     function(data) {
        console.log('cre dashboard data  Others :',data);
        $scope.creDashboardData = data;
          angular.forEach($scope.creDashboardData,function(val,index){
          if($scope.creDashboardData[index] !== undefined && $scope.creDashboardData[index] !== null){
             totalAllocated += parseInt($scope.creDashboardData[index].allocated);
             totalAttemptedCount += parseInt($scope.creDashboardData[index].attemptedCount);
             totalCallLaterCount += parseInt($scope.creDashboardData[index].callLaterCount);
             totalNotInterestedCount += parseInt($scope.creDashboardData[index].notInterested);
             totalNonConverted += parseInt($scope.creDashboardData[index].nonConverted);
             totalPendingCount += parseInt($scope.creDashboardData[index].pendingCount);
             totalFreshCalls += parseInt($scope.creDashboardData[index].freshCalls);
             totalTotalAttempted += parseInt($scope.creDashboardData[index].totalAttempted);
          }  
         });
        if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
          $scope.creDashboardData.push({"dataTypename":"Total","allocated":totalAllocated,"attemptedCount":totalAttemptedCount,"callLaterCount":totalCallLaterCount,"nonConverted":totalNonConverted,"pendingCount":totalPendingCount,"freshCalls":totalFreshCalls,"notInterested":totalNotInterestedCount,"totalAttempted":totalTotalAttempted});
        }
        showLoader(false);
      }, function(err) {
        console.log('cre dashboard data  Others error');
        showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCreDashboardData(selectedBranch);

    $scope.creTableData = [];
    $rootScope.apptIdOthersList = [];
    $scope.showTableOthers = false;

    /*$scope.selDataType;
    $scope.selDataTypeValue;*/
   $scope.getPericularStatsData = function (dataTypeName,status,dataTypeId,selectedDatatypeValue) {   //console.log('dataTypeName : ',dataTypeName);
     if(status !== 'pendingcalls'){
       $scope.showTableOthers = false;
      }
      console.log('dataTypeId : ',dataTypeId);
      showLoader(true);
      $rootScope.selDataType = dataTypeName;
       console.log('highlight dataTypeName : ',$rootScope.selDataType);
      $rootScope.selDataTypeValueOthers = selectedDatatypeValue;
      console.log('highlight',$scope.selDataTypeValue);

      $rootScope.defaultDataTypenameOthers = dataTypeName;
      selectedDataTypeId = dataTypeId;
      $rootScope.defaultDataTypeIdOthers = dataTypeId;
      if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
        selectedServiceDueType = 'Free';
      } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
        selectedServiceDueType = 'Paid';
      }else{
        selectedServiceDueType = 'Both';
      }
      selectedStatsStatus = status;
      $rootScope.defaultStatusOthers = status;
      $scope.selectedStatus = selectedStatsStatus;
      $scope.selectedDueType = selectedServiceDueType;
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardFilterTypeDataService.get({callerId:adminUserId,status:selectedStatsStatus,dataTypeId:selectedDataTypeId,scheduleType:selectedServiceDueType,scId:adminUserScId,branchId:selectedBranch,token:lsToken}, function(data) {
        console.log('CRE filtered count success :',data);
        $scope.creFilteredDataTypes = data;
        $scope.statusOption = {};
        //$scope.getPerticularStatsTableData(dataTypeName,status,dataTypeId,subStatus,$rootScope.selDataTypeValue);
        if(!$scope.creFilteredDataTypes){
          $scope.creFilteredDataTypes = false;
          // $scope.getPerticularStatsTableData(dataTypeName,status,dataTypeId,subStatus);
        }
        showLoader(false);
      },function(err) {
        console.log("Error", err);
        showLoader(false);
        $scope.creFilteredDataTypesErrorMsg = err.data.message;
      },function(err) {
        console.log(err);
      });
    };

    $scope.getPericularStatsData($rootScope.defaultDataTypenameOthers,$rootScope.defaultStatusOthers,$rootScope.defaultDataTypeIdOthers,$rootScope.selDataTypeValueOthers);

    $scope.getPerticularStatsTableData = function(dataTypeName,status,dataTypeId,selSubStatus,selectedDatatypeValue) {
       $rootScope.selDataType = dataTypeName;
       console.log('highlight dataTypeName : ',$rootScope.selDataType);
      $rootScope.selDataTypeValueOthers = selectedDatatypeValue;
     // console.log('dataTypeName',dataTypeName);
     // console.log('dataTypeId',dataTypeId);
      showLoader(true);
      subStatus = selSubStatus;
      $rootScope.defaultDataTypenameOthers = dataTypeName;
      $rootScope.defaultSubStatusOthers = selSubStatus;
      selectedDataTypeId = dataTypeId;
      $rootScope.defaultDataTypeIdOthers = dataTypeId;
      if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
        selectedServiceDueType = 'Free';
      } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
        selectedServiceDueType = 'Paid';
      }else{
        selectedServiceDueType = 'Both';
      }
      selectedStatsStatus = status;
      $rootScope.defaultStatusOthers = status;
      $scope.selectedStatus = selectedStatsStatus;
      $scope.selectedDueType = selectedServiceDueType;
      console.log('status', selectedStatsStatus);
      console.log('Due type',selectedServiceDueType);
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardDataTableService.query({scId:adminUserScId,callerId:adminUserId,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,subStatus:subStatus,branchId:selectedBranch,token:lsToken}, function(data) {
        console.log('cre Table Data success :',data);
        $scope.creTableDataErrorMsg = '';
        $scope.creTableData = data;
        $scope.showTableOthers = true;
        selectedStatsStatus = status;
        /*angular.forEach($scope.creTableData, function (val,index) {
          $rootScope.apptIdOthersList.push($scope.creTableData[index].apptId);
        });*/
        $scope.newToken = lsToken;
        $scope.tableParams.reload();
        showLoader(false);
        $scope.tableParams.page(1);
      }, function(err) {
        console.log("Error", err);
        showLoader(false);
        $scope.creTableData = [];
        $scope.tableParams.reload();
        $scope.creTableDataErrorMsg = err.data.message;
       if(selSubStatus !== undefined && selSubStatus !== null && selSubStatus !== ''){
           $scope.showTableOthers = true;
           $rootScope.tableParams.reload();
           $scope.creTableDataErrorMsg = err.data.message;
        }
        $scope.creTableDataErrorMsg = err.data.message;
      },function(err) {
        console.log(err);
      });
    };

    $scope.getPerticularStatsTableData($rootScope.defaultDataTypenameOthers,$rootScope.defaultStatusOthers,$rootScope.defaultDataTypeIdOthers,$rootScope.defaultSubStatusOthers,$rootScope.selDataTypeValueOthers);


   /* $rootScope.tcAppointmentSearch = function (keyword) {
      console.log(keyword);
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallingSearchService.query({key:keyword,id:adminUserScId,callerId:adminUserId,token:lsToken}, function (data) {
        console.log('cre Search Table Data :',data);
        $scope.creTableDataErrorMsg = '';
        $scope.creTableData = data;
        $scope.tableParams.reload();
        showLoader(false);
        $scope.crePerticularStatsData = true;
      }, function(err) {
        $scope.crePerticularStatsData = true;
        $scope.creTableData = [];
        $scope.tableParams.reload();
        showLoader(false);
        $scope.creTableDataErrorMsg = err.data.message;
      });
    };*/



    $scope.tableParams = new ngTableParams({
      page: 1,
      count: 20
    }, {
      total: $scope.creTableData.length,
      getData: function ($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ?
          $filter('orderBy')($scope.creTableData, params.orderBy()) :
          $scope.creTableData;

        orderedData = params.filter() ?
          $filter('filter')(orderedData, params.filter()) :
          orderedData;
        $scope.orderedData = orderedData;

        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve($scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         //$scope.creTableData = $scope.users;
         angular.forEach($scope.users, function (val,index) {
          $rootScope.apptIdOthersList.push($scope.users[index].apptId);
        });
      }
    }, {
      counts: [10, 20]
    });
    $scope.tableParams.settings().counts = [10, 20, 50, 100];
    $scope.selectedPageSizes = $scope.tableParams.settings().counts;
    $scope.changePage = changePage;
    $scope.changePageSize = changePageSize;
    $scope.changePageSizes = changePageSizes;

    function changePage(nextPage) {
      $scope.tableParams.page(nextPage);
      $scope.tableParams.reload();
    }

    function changePageSize(newSize) {
      $scope.tableParams.count(newSize);
    }
    function changePageSizes(newSizes) {
      // ensure that the current page size is one of the options
      if (newSizes.indexOf($scope.tableParams.count()) === 0) {
        newSizes.push($scope.tableParams.count());
        newSizes.sort();
      }
      $scope.tableParams.settings({
        counts: newSizes
      });

    }

    function getServiceCenterTeleCallerWise() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetCallerWiseServiceCenterService.query({callerId:adminUserId,id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise();

    $(document).ready(function(){
      $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
      });
    });


  });
