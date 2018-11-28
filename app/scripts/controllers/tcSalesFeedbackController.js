'use strict';

angular.module('letsService')
  .controller('SalesFeedbackController', function ($scope,$window,$filter,$rootScope,ngTableParams,$cookies,TokenService,GetCallerWiseServiceCenterService,TeleCallerStatusService,serviceURL,TeleCallerSalesFeedbackDataService,TeleCallerPerticularAppointmentDataService,TeleCallerPerticularAppointmentHistoryDataService,GetFeedbackTitleService,TeleCallerReasonService,FeedBackDataService,TCAppointmentStatusUpdateService,TeleCallingSearchService,PostServiceFeedbackService,TeleCallerPsfDataService,TeleCallerWiseServiceCenterService,TeleCallingCallService,UpdateTelecallerServiceCenterService,TimeSlotSelected) {

    /*var adminUserId = $window.sessionStorage.getItem('loggedInUserId');
    var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');*/
    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');

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

    var selectedFromDate = 'fromDate';
    var selectedToDate = 'toDate';
    var selectedBranch = 'branch';
    var selectedStatus = 'freshData';
    var selectedDataType = 'Sales Feedback';

    function getPSFStats() {
      $scope.loading = true;
      var lsToken = TokenService.getToken(adminUserScId);
      PostServiceFeedbackService.query({callerId:adminUserId,scId:adminUserScId,dataType:selectedDataType,token:lsToken}, function(data) {
        $scope.psfStats = data[0];
        $scope.loading = false;
        console.log('psfStats : ',$scope.psfStats);
      }, function(err) {
        $scope.loading = false;
        $scope.psfStatsErrorMsg = err.data.message;
      });
    }
    getPSFStats();

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



    $scope.getFeedbackFilter = function (status) {
      // console.log(status);
      if(status){
        $scope.feedBackFilter = true;
      }else {
        $scope.feedBackFilter = false;
      }
    };

    $rootScope.tcAppointmentSearch = function (keyword) {
      console.log(keyword);
      $scope.loading = true;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallingSearchService.query({key:keyword,id:adminUserScId,callerId:adminUserId,token:lsToken}, function (data) {
        console.log('cre Search Table Data :',data);
        $scope.creTableDataErrorMsg = '';
        $scope.creTableData = data;
        $scope.tableParams.reload();
        $scope.loading = false;
        $scope.crePerticularStatsData = true;
      }, function(err) {
        $scope.crePerticularStatsData = true;
        $scope.creTableData = [];
        $scope.tableParams.reload();
        $scope.loading = false;
        $scope.creTableDataErrorMsg = err.data.message;
      });
    };


    $scope.psfDataByDate = function (psfData) {
      if(psfData.selectedFromDate > psfData.selectedToDate) {
        $window.alert('From Date cannot be greater than To Date');
      }
      selectedFromDate = psfData.selectedFromDate.getFullYear() + '-' + ('0' + (psfData.selectedFromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + psfData.selectedFromDate.getDate()).slice(-2);
      selectedToDate = psfData.selectedToDate.getFullYear() + '-' + ('0' + (psfData.selectedToDate.getMonth() + 1)).slice(-2) + '-' + ('0' + psfData.selectedToDate.getDate()).slice(-2);
      selectedBranch = psfData.selectedServiceCenter;
      if(psfData.selectedStatus === 'Call Later'){
        selectedStatus = 'callLater';
      }
      if(psfData.selectedStatus === 'Walkin'){
        selectedStatus = 'walkIn';
      }
      //selectedStatus = psfData.selectedStatus;

      $scope.getPericularStatsData(selectedStatus,selectedFromDate,selectedToDate,selectedBranch);
      /*adminSelectedFromDate = adminSelectedFromDate;
      adminSelectedToDate = adminSelectedToDate;
      adminSelectedSubStatus = tcData.selectedStatus;
      adminSelectedDataType = tcData.selectedDataType;*/

    };
     $rootScope.defaultStatusFeedbackSales = 'freshData';
    $scope.getPSFDataStatsWise = function (status) {
      selectedStatus = status;
      $rootScope.defaultStatusFeedbackSales = status;
      $scope.getPericularStatsData(selectedStatus,selectedFromDate,selectedToDate,selectedBranch);
    };


    $scope.creTableData = [];
    $rootScope.apptIdList = [];
    $scope.getPericularStatsData = function (status, fromDate, toDate, branchId) {
      $scope.loading = true;
      selectedFromDate = fromDate;
      selectedToDate = toDate;
      selectedBranch = branchId;
      selectedStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(serviceURL+selectedStatus+'/'+adminUserId+'/'+adminUserScId+'/'+selectedFromDate+'/'+selectedToDate+'/'+selectedBranch+'/'+selectedDataType+'/'+lsToken);
      TeleCallerPsfDataService.query({status:selectedStatus,callerId:adminUserId,scId:adminUserScId,fromDate:selectedFromDate,toDate:selectedToDate,branchId:selectedBranch,dataType:selectedDataType,token:lsToken},function (data) {
        console.log(serviceURL+selectedStatus+'/'+adminUserId+'/'+adminUserScId+'/'+selectedFromDate+'/'+selectedToDate+'/'+selectedBranch+'/'+selectedDataType+'/'+lsToken);
        console.log('PSF table data :',data);
        $scope.creTableDataErrorMsg = '';
        $scope.creTableData = data;
        angular.forEach($scope.creTableData, function (val,index) {
          $rootScope.apptIdList.push($scope.creTableData[index].apptId);
        });
        console.log('appt Id List',$rootScope.apptIdList);
        $scope.tableParams.reload();
        $scope.tableParams.page(1);
        $scope.loading = false;
      }, function(err) {
        console.log("Error", err);
        $scope.loading = false;
        $scope.creTableData = [];
        $scope.tableParams.reload();
        $scope.creTableDataErrorMsg = err.data.message;
      });
    };


    //$scope.getPericularStatsData($window.sessionStorage.getItem('selDataTypeName'),$window.sessionStorage.getItem('selStatus'),$window.sessionStorage.getItem('selDataTypeId'));
    //$scope.getPericularStatsData($rootScope.testDataTypename,$rootScope.testStatus,$rootScope.testDataTypeId);
    $scope.getPericularStatsData(selectedStatus,selectedFromDate,selectedToDate,selectedBranch);


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


  });
