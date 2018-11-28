'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('crmDashboardController', function ($scope,$filter,$anchorScroll,$state,ngTableParams,$rootScope,$timeout,$window,$http,serviceURL,TokenService,AdminLoginService,TeleCallerStatusService,TeleCallerDataTypeService,TeleCallerDateWiseDataService,TeleCallerStatsDataService,TeleCallerPerticularAppointmentDataService,TeleCallerPerticularAppointmentHistoryDataService,ServiceTypeService,AssistanceTypeService,TeleCallerReasonService,ScComplaintSubStatusService,TCAppointmentStatusUpdateService,TeleCallingSearchService,GetFeedbackTitleService,FeedBackDataService,TeleCallingCallService,GetCallerWiseServiceCenterService,CallingPendingStatsService,CallingPendingStatsDetailsService,UpdateTelecallerServiceCenterService,UpdatePickupAndDropService,PickupAndDropTokenService,PickupAndDropAssistanceAmountService,GetLatLngService,GetSCLocationBrandService,CheckAMCUserService,PickupAndDropSlotService,TeleCallerStatusWiseDataService,TeleCallerWiseServiceCenterService,CreDashboardDataService,CreDashboardDueTypeDataService,CreDashboardDataTableService,$cookies,CreDashboardFilterTypeDataService,CreAppointmentActiveStatusService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
   // var adminUserRole = $cookies.get('loggedInUserRole');

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


    function getCreDashboardData(selBranch) {
      var totalAllocated = 0;
      var totalAttemptedCount = 0;
      var totalCallLaterCount = 0;
      var totalNotInterestedCount = 0;
      var totalNonConverted = 0;
      var totalPendingCount= 0;
      var totalFreshCalls= 0;
      var totalOverDueCalls = 0;
      var totalTotalAttempted= 0;
      selectedBranch = selBranch;
      $scope.creDashboardDataErrorMsg = '';
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardDataService.query({scId:adminUserScId,callerId:adminUserId,branchId:selectedBranch,token:lsToken},function(data) {
        console.log('cre dashboard data :',data);
        $scope.creDashboardData = data;
        angular.forEach($scope.creDashboardData,function(val,index){
          if($scope.creDashboardData[index] !== undefined && $scope.creDashboardData[index] !== null){
             totalAllocated += parseInt($scope.creDashboardData[index].allocated);
             totalAttemptedCount += parseInt($scope.creDashboardData[index].attemptedCount);
             totalCallLaterCount += parseInt($scope.creDashboardData[index].callLaterCount);
             totalNotInterestedCount += parseInt($scope.creDashboardData[index].notInterested);
             totalOverDueCalls += parseInt($scope.creDashboardData[index].overDueCalls);
             totalNonConverted += parseInt($scope.creDashboardData[index].nonConverted);
             totalPendingCount += parseInt($scope.creDashboardData[index].pendingCount);
             totalFreshCalls += parseInt($scope.creDashboardData[index].freshCalls);
             totalTotalAttempted += parseInt($scope.creDashboardData[index].totalAttempted);
            }  
         });
        if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
          $scope.creDashboardData.push({"dataTypename":"Total","allocated":totalAllocated,"attemptedCount":totalAttemptedCount,"callLaterCount":totalCallLaterCount,"nonConverted":totalNonConverted,"pendingCount":totalPendingCount,"freshCalls":totalFreshCalls,"overDueCalls":totalOverDueCalls,"notInterested":totalNotInterestedCount,"totalAttempted":totalTotalAttempted});
        }
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.creDashboardData = [];
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCreDashboardData(selectedBranch);

    $rootScope.creTableData = [];
    $rootScope.apptIdList = [];
    $scope.filteredServiceDueTypes = [];
    $rootScope.showTable = false;

    $scope.getSelectedServiceCenter = function (selBranch) {
      console.log(selBranch);
      selectedBranch = selBranch;
      if(selBranch === null){
        selectedBranch = 'all';
      }
      getCreDashboardData(selectedBranch);
    };

  
   $scope.selDataType;
   $scope.selDataTypeValue;
   $scope.getPericularStatsData = function (dataTypeName,status,dataTypeId,selectedDatatypeValue) {   //console.log('dataTypeName : ',dataTypeName);
      //console.log('dataTypeId : ',dataTypeId);
      //console.log('status : ',status);
      if(status !== 'pendingcalls'){
       $rootScope.showTable = false;
      }
      $scope.selDataType = dataTypeName;
      $rootScope.selDataTypeValue = selectedDatatypeValue;
      console.log('highlight',$scope.selDataTypeValue);
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      $rootScope.defaultDataTypename = dataTypeName;
        selectedDataTypeId = dataTypeId;
      $rootScope.defaultDataTypeId = dataTypeId;
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
      selectedStatsStatus = status;
      $rootScope.defaultStatus = status;
      $scope.selectedStatus = selectedStatsStatus;
      $scope.selectedDueType = selectedServiceDueType;
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardFilterTypeDataService.get({callerId:adminUserId,status:selectedStatsStatus,dataTypeId:selectedDataTypeId,scheduleType:selectedServiceDueType,scId:adminUserScId,branchId:selectedBranch,token:lsToken}, function(data) {
        console.log('CRE filtered count success :',data);
        $scope.creFilteredDataTypes = data;
        $scope.statusOption = {};
       // $scope.getPerticularStatsTableData(dataTypeName,status,dataTypeId,subStatus,$rootScope.selDataTypeValue);
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


    $scope.getPericularStatsData($rootScope.defaultDataTypename,$rootScope.defaultStatus,$rootScope.defaultDataTypeId,$rootScope.selDataTypeValue);

   $scope.getPerticularStatsTableData = function(dataTypeName,status,dataTypeId,selSubStatus,selectedDatatypeValue) {  // console.log('dataTypeName',dataTypeName);
      console.log('+++++++++++++++++++++++++++++++=',selSubStatus);
      $scope.selDataType = dataTypeName;
      $rootScope.selDataTypeValue = selectedDatatypeValue;
       console.log('highlight',$scope.selDataTypeValue);
        $rootScope.selDataTypeStatusValue = status;
      //console.log('dataTypeId',dataTypeId);
      //console.log('status',status);
      //console.log('selSubStatus',selSubStatus);
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      subStatus = selSubStatus;
      $rootScope.defaultSubStatus = selSubStatus;
     // $cookies.put('defaultSubStatus', selSubStatus);
      //$window.sessionStorage.setItem('defaultSubStatus', selSubStatus);
      $rootScope.defaultDataTypename = dataTypeName;
    //  $cookies.put('defaultDataTypename', dataTypeName);
     // $window.sessionStorage.setItem('defaultDataTypename', dataTypeName);
      selectedDataTypeId = dataTypeId;
      $rootScope.defaultDataTypeId = dataTypeId;
      //$cookies.put('defaultDataTypeId', dataTypeId);
      //$window.sessionStorage.setItem('defaultDataTypeId', dataTypeId);
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
      selectedStatsStatus = status;
      $rootScope.defaultStatus = status;
      //$cookies.put('defaultStatus', status);
     // $window.sessionStorage.setItem('defaultStatus', status);
      $scope.selectedStatus = selectedStatsStatus;
      $scope.selectedDueType = selectedServiceDueType;
      //console.log('status', selectedStatsStatus);
      //console.log('Due type',selectedServiceDueType);
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardDataTableService.query({scId:adminUserScId,callerId:adminUserId,dataTypeId:selectedDataTypeId,status:selectedStatsStatus,scheduleType:selectedServiceDueType,subStatus:subStatus,branchId:selectedBranch,token:lsToken}, function(data) {
        console.log('cre Table Data success :',data);
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.creTableData = data;
        var serviceDueTypes =  $filter('unique')( $rootScope.creTableData,'serviceDueType');
        $scope.filteredServiceDueTypes.push({id: '', title: ''});
        angular.forEach(serviceDueTypes,function (val,index) {
          $scope.filteredServiceDueTypes.push({id: serviceDueTypes[index].serviceDueType, title: serviceDueTypes[index].serviceDueType});
        });
        console.log(' $scope.filteredServiceDueTypes ++++++++++', $scope.filteredServiceDueTypes);
        $rootScope.showTable = true;
        selectedStatsStatus = status;
        /*angular.forEach($rootScope.creTableData, function (val,index) {
          $rootScope.apptIdList.push($rootScope.creTableData[index].apptId);
        });*/
        $rootScope.tableParams.reload();
        showLoader(false);
        $scope.crePerticularStatsData = true;
        $rootScope.tableParams.page(1);
      }, function(err) {
        console.log("Error", err);
         if(!$rootScope.globalSerarchStatus){
          $rootScope.creTableData = [];
          $rootScope.tableParams.reload();
        }
        if(selSubStatus !== undefined && selSubStatus !== null && selSubStatus !== ''){
           $rootScope.showTable = true;
           $rootScope.tableParams.reload();
           $rootScope.creTableDataErrorMsg = err.data.message;
        }
        if($rootScope.globalSerarchStatus){
           $rootScope.showTable = true;
           $rootScope.tableParams.reload();
           $rootScope.globalSerarchStatus = false;
        }
        //$rootScope.showTable = true;
        showLoader(false);
        $rootScope.creTableDataErrorMsg = err.data.message;
      },function(err) {
        console.log(err);
      });
    };


    $scope.getPerticularStatsTableData($rootScope.defaultDataTypename,$rootScope.defaultStatus,$rootScope.defaultDataTypeId,$rootScope.defaultSubStatus,$rootScope.selDataTypeValue);

   /* $rootScope.tcAppointmentSearch = function (keyword) {
     // console.log(keyword);
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
        // console.log('$scope.users$scope.users$scope.users$scope.users',$scope.users);
        //$rootScope.creTableData = $scope.users;
        //console.log('$rootScope.creTableData',$rootScope.creTableData);
         angular.forEach($scope.users, function (val,index) {
          $rootScope.apptIdList.push($scope.users[index].apptId);
        });
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

    /*$rootScope.goBackward =function (apptId) {
      alert(apptId);
      $state.go('dashboard');
      $scope.backwardStatus = true;
      $scope.getPericularStatsData($rootScope.defaultDataTypename,$rootScope.defaultStatus,$rootScope.defaultDataTypeId,$rootScope.selDataTypeValue);
      $scope.getPerticularStatsTableData($rootScope.defaultDataTypename,$rootScope.defaultStatus,$rootScope.defaultDataTypeId,$rootScope.defaultSubStatus,$rootScope.selDataTypeValue);
    };*/

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


     
$(window).on("scroll", function() {

   if($(window).scrollTop() > 100) {
alert(2);
       $(".header").addClass("active");
   } else {
alert(3);
       //remove the background property so it comes transparent again (defined in your css)
      $(".header").removeClass("active");
   }
});

$(window).scroll(function () { alert('scrolled') })

angular.element($window).bind("scroll", function(e) {
    alert('scrolled')
})

window.onscroll = function (){
    console.log('window was scrolled!');
};

  });

