'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK (March-09-2018)
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('CrmInsuranceStatsController', function ($scope,$cookies,$rootScope,$filter,ngTableParams,TokenService,GetInsuranceDashboardStatsService,GetInsuranceDashboardDetailsService,GetCallerWiseServiceCenterService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

    $scope.creTableData = [];
    $rootScope.apptIdList = [];
    $scope.showTable = false;
    var selectedStatsStatus;
    var selectedBranch = 'all';

    var subStatus = 'noSubStatus';


    $scope.getSelectedServiceCenter = function (selBranch) {
      console.log(selBranch);
      selectedBranch = selBranch;
      if(selBranch === null){
        selectedBranch = 'all';
      }
      getCreInsuranceDashboardData(selectedBranch);
    };

    function getCreInsuranceDashboardData(selBranch) {
      selectedBranch = selBranch;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      GetInsuranceDashboardStatsService.query({scId:adminUserScId,callerId:adminUserId,branchId:selectedBranch,token:lsToken},function(data) {
        console.log('cre Insurance dashboard data :',data);
        $scope.creDashboardData = data;
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCreInsuranceDashboardData(selectedBranch);

   /* $scope.getPericularStatsData = function (dataTypeName,status,dataTypeId) {
      //console.log('dataTypeName : ',dataTypeName);
      //console.log('dataTypeId : ',dataTypeId);
      //console.log('status : ',status);
      showLoader(true);
      $rootScope.defaultDataTypename = dataTypeName;
      selectedDataTypeId = dataTypeId;
      $rootScope.defaultDataTypeId = dataTypeId;
      if( dataTypeName === 'Regular Data Free' || dataTypeName === 'Service Reminder Free'){
        selectedServiceDueType = 'Free';
      } else if (dataTypeName === 'Regular Data Paid' || dataTypeName === 'Service Reminder Paid'){
        selectedServiceDueType = 'Paid';
      }
      selectedStatsStatus = status;
      $rootScope.defaultStatus = status;
      $scope.selectedStatus = selectedStatsStatus;
      $scope.selectedDueType = selectedServiceDueType;
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardFilterTypeDataService.get({callerId:adminUserId,status:selectedStatsStatus,dataTypeId:selectedDataTypeId,scheduleType:selectedServiceDueType,scId:adminUserScId,branchId:selectedBranch,token:lsToken}, function(data) {
        console.log('CRE filtered count success :',data);
        $scope.creFilteredDataTypes = data;
        $scope.getPerticularStatsTableData(dataTypeName,status,dataTypeId,subStatus);
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
*/
    $scope.getPerticularStatsTableData = function(status) {
      console.log('status',status);
      showLoader(true);
      selectedStatsStatus = status;
       var lsToken = TokenService.getToken(adminUserScId);
      GetInsuranceDashboardDetailsService.query({scId:adminUserScId,callerId:adminUserId,status:selectedStatsStatus,branchId:selectedBranch,token:lsToken}, function(data) {
        console.log('cre Table Insurance Data success :',data);
        $scope.creTableDataErrorMsg = '';
        $scope.creTableData = data;
        angular.forEach($scope.creTableData, function (val,index) {
          $rootScope.apptIdList.push($scope.creTableData[index].apptId);
        });
        $scope.tableParams.reload();
        showLoader(false);
        $scope.showTable = true;
        $scope.tableParams.page(1);
      }, function(err) {
        console.log("Error", err);
        $scope.creTableData = [];
        $scope.tableParams.reload();
        showLoader(false);
        $scope.creTableDataErrorMsg = err.data.message;
      },function(err) {
        console.log(err);
      });
    };

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


