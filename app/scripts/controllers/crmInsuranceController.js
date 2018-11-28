'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK (March-09-2018)
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('CrmInsuranceController', function ($scope,$cookies,$rootScope,$filter,ngTableParams,TokenService,GetInsuranceDashboardStatsService,GetInsuranceDashboardDetailsService,GetCallerWiseServiceCenterService,CreInsuranceFilterTypeDataService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');
    $scope.insuranceAccess = $cookies.get('insuranceAccess');

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

    $rootScope.creTableData = [];
    $rootScope.apptIdList = [];
    $rootScope.showTable = false;
    var selectedStatsStatus;
    var selectedBranch = 'all';
    var selectedSubStatus = 'noSubStatus';

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
      GetInsuranceDashboardStatsService.query({scId:adminUserScId,callerId:adminUserId,branchId:selectedBranch,brand:loginBrandName,token:lsToken},function(data) {
        console.log('cre Insurance dashboard data :',data);
        $scope.creDashboardData = data;
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCreInsuranceDashboardData(selectedBranch);

    $scope.getPericularStatsData = function (status) {
      if(status === 'dueCalls'){
       $rootScope.showTable = false;
      }
      showLoader(true);
      selectedStatsStatus = status;
      $rootScope.defaultStatusInsurance = status;
      var lsToken = TokenService.getToken(adminUserScId);
      CreInsuranceFilterTypeDataService.get({callerId:adminUserId,scId:adminUserScId,branchId:selectedBranch,brand:loginBrandName,token:lsToken}, function(data) {
        console.log('CRE filtered count success :',data);
        $scope.creFilteredDataTypes = data;
        $scope.statusOption = {};
        //$scope.getPerticularStatsTableData(selectedStatsStatus,selectedSubStatus);
        showLoader(false);
      },function(err) {
        console.log("Error", err);
        showLoader(false);
        $scope.creFilteredDataTypesErrorMsg = err.data.message;
      },function(err) {
        console.log(err);
      });
    };

    $scope.getPerticularStatsTableData = function(status,subStatus) {
      console.log('status',status);
      showLoader(true);
      selectedStatsStatus = status;
      $rootScope.defaultStatusInsurance = status;
      selectedSubStatus = subStatus;
      $rootScope.defaultSubStatusInsurance = subStatus;
       var lsToken = TokenService.getToken(adminUserScId);
      GetInsuranceDashboardDetailsService.query({scId:adminUserScId,callerId:adminUserId,status:selectedStatsStatus,branchId:selectedBranch,subStatus:selectedSubStatus,brand:loginBrandName,token:lsToken}, function(data) {
        console.log('cre Table Insurance Data success :',data);
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.creTableData = data;
        angular.forEach($rootScope.creTableData, function (val,index) {
          $rootScope.apptIdList.push($rootScope.creTableData[index].apptId);
        });
        $rootScope.tableParams.reload();
        showLoader(false);
        $rootScope.showTable = true;
        $rootScope.tableParams.page(1);
      }, function(err) {
        console.log("Error", err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        if(subStatus !== undefined && subStatus !== null && subStatus !== ''){
           $rootScope.showTable = true;
        }
        showLoader(false);
        $rootScope.creTableDataErrorMsg = err.data.message;
      },function(err) {
        console.log(err);
      });
    };


    $scope.getPerticularStatsTableData($rootScope.defaultStatusInsurance,$rootScope.defaultSubStatusInsurance);

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


