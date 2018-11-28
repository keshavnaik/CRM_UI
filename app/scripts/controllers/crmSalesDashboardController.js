'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK (March-09-2018)
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('CrmSalesDashboardController', function ($scope,$cookies,$rootScope,$filter,ngTableParams,TokenService,GetInsuranceDashboardStatsService,GetInsuranceDashboardDetailsService,GetCallerWiseServiceCenterService,CreSalesAnnivarsaryDataService,CreSalesAnnivarsaryDetailsService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');

    $scope.insuranceAccess = $cookies.get('insuranceAccess');

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

    $rootScope.creTableData = [];
    $rootScope.apptIdListSales = [];
    $rootScope.showTable = false;
    var selectedStatsStatus;
    var selectedBranch = 'branch';
    var selectedSubStatus = 'noSubStatus';
    var selectedAnivarsaryType = '1 year';

    $scope.getSelectedServiceCenter = function (selBranch) {
      console.log(selBranch);
      selectedBranch = selBranch;
      if(selBranch === null){
        selectedBranch = 'branch';
      }
      getCreSalesDashboardData(selectedBranch,selectedAnivarsaryType);
    };

    $scope.getSelectedAnivarsaryType = function (selType) {
      //console.log(selType);
      selectedAnivarsaryType = selType;
      if(selType === null){
        selectedAnivarsaryType = '1 year';
      }
      getCreSalesDashboardData(selectedBranch,selectedAnivarsaryType);
    };


    function getCreSalesDashboardData(selBranch,selSalesType) {
      var totalAllocated = 0;
      var totalAttemptedCount = 0;
      var totalCallLaterCount = 0;
      var totalPendingCount= 0;
      var totalFreshCalls= 0;
      selectedBranch = selBranch;
      selectedAnivarsaryType = selSalesType;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
         CreSalesAnnivarsaryDataService.query({scId:adminUserScId,callerId:adminUserId,branchId:selectedBranch,aniverseryType:selectedAnivarsaryType,token:lsToken},function(data) {
        console.log('cre SALES dashboard data :',data);
        $scope.creDashboardData = data;
        angular.forEach($scope.creDashboardData,function(val,index){
          if($scope.creDashboardData[index] !== undefined && $scope.creDashboardData[index] !== null){
             totalAllocated += parseInt($scope.creDashboardData[index].allocated);
             totalAttemptedCount += parseInt($scope.creDashboardData[index].attemptedCount);
             totalCallLaterCount += parseInt($scope.creDashboardData[index].callLaterCount);
             totalPendingCount += parseInt($scope.creDashboardData[index].pendingCount);
             totalFreshCalls += parseInt($scope.creDashboardData[index].freshCalls);
          }  
         });
        if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
          $scope.creDashboardData.push({"allocated":totalAllocated,"freshCalls":totalFreshCalls,"attemptedCount":totalAttemptedCount,"callLaterCount":totalCallLaterCount,"pendingCount":totalPendingCount,"dataType":"Total"});
        }
         $scope.creDashboardDataErrorMsg = '';
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.creDashboardData = null;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCreSalesDashboardData(selectedBranch,selectedAnivarsaryType);

   /* $scope.getPericularStatsData = function (status) {
      showLoader(true);
      selectedStatsStatus = status;
      $rootScope.defaultStatusInsurance = status;
      var lsToken = TokenService.getToken(adminUserScId);
      CreInsuranceFilterTypeDataService.get({scId:adminUserScId,callerId:adminUserId,branchId:selectedBranch,token:lsToken}, function(data) {
        console.log('CRE filtered count success :',data);
        $scope.creFilteredDataTypes = data;
        $scope.getPerticularStatsTableData(selectedStatsStatus,selectedSubStatus);
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
    $scope.getPerticularStatsTableData = function(status,selDataType) {
      selectedAnivarsaryType = '1 Year';
      console.log('status',status);
      if(selDataType === 'Welcome Calls'){
         selectedAnivarsaryType = '3 day'
      }
      else if(selDataType === 'Warranty Calls'){
         selectedAnivarsaryType = '2  Year'
      }
      showLoader(true);
      selectedStatsStatus = status;
      $rootScope.defaultStatusSales = status;
      //selectedSubStatus = subStatus;
      $rootScope.defaultDataTypeSales = selDataType;
      console.log('$rootScope.defaultDataTypeSales++++++++++++++++++',$rootScope.defaultDataTypeSales);
       var lsToken = TokenService.getToken(adminUserScId);
      CreSalesAnnivarsaryDetailsService.query({scId:adminUserScId,callerId:adminUserId,branchId:selectedBranch,status:selectedStatsStatus,aniverseryType:selectedAnivarsaryType,dataType:selDataType,token:lsToken}, function(data) {
        console.log('cre Table Sales  Data success :',data);
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.creTableData = data;
        angular.forEach($rootScope.creTableData, function (val,index) {
          $rootScope.apptIdListSales.push($rootScope.creTableData[index].apptId);
        });
        $rootScope.tableParams.reload();
        showLoader(false);
        $rootScope.showTable = true;
        $rootScope.tableParams.page(1);
      }, function(err) {
        console.log("Error", err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $rootScope.creTableDataErrorMsg = err.data.message;
      },function(err) {
        console.log(err);
      });
    };


    $scope.getPerticularStatsTableData($rootScope.defaultStatusSales,$rootScope.defaultDataTypeSales);

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

    $scope.salesTypes = [{"desc":"1 Year","name":"1st Anniversary"},{"desc":"2 Year","name":"2nd Anniversary"}
    ,{"desc":"3 Year","name":"3rd Anniversary"},{"desc":"4 Year","name":"4th Anniversary"}];

    $(document).ready(function(){
      $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
      });
    });


  });


