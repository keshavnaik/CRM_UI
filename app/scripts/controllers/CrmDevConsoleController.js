'use strict';

angular.module('letsService')
	.controller('CrmDeveloperConsoleCtrl', function($scope,$window,$rootScope,$timeout,$filter,ngTableParams,$cookies,TokenService,GetDetailsByChassisNoService,GetSuperAdminDealerListService,GetDevConsoleCallerDetailsService){

	/*var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var adminUserRole = $cookies.get('loggedInUserRole');*/

    var adminUserId = '369';
    var adminUserScId;
    var selChassisNo;

     function getSuperAdminDealerList () {
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
      console.log(selDealer);
      adminUserScId = selDealer;
      //$scope.getDetailsByChassisNo(selChassisNo);
    };

    $scope.getDetailsByChassisNo = function(chassisNo){
      $scope.salesDetailsErrorMsg = false;
      $scope.insuranceDetailsErrorMsg = false;
      $scope.psfDetailsErrorMsg = false;
      $scope.detailsErrorMsg = '';
      $scope.loader = true;
      console.log(chassisNo);
      selChassisNo = chassisNo;
      var lsToken = TokenService.getToken(adminUserScId);
      GetDetailsByChassisNoService.get({chassisNo:selChassisNo,scId:adminUserScId,token:lsToken}, function(data) {
        $scope.details = data.appointment_details;
        $scope.detailsErrorMsg = '';
        $scope.serviceDetails = data.serviceDetails;
        $scope.jobcardDetails = data.jobcardDetails;
        $scope.salesDetails = data.salesDetails;
        $scope.insuranceDetails = data.insuranceDetails;
        $scope.psfDetails = data.psfDetails;
        if(!Array.isArray($scope.salesDetails)){
           $scope.salesDetailsErrorMsg = true;
        }
        if(!Array.isArray($scope.insuranceDetails)){
           $scope.insuranceDetailsErrorMsg = true;
        }
        if(!Array.isArray($scope.psfDetails)){
           $scope.psfDetailsErrorMsg = true;
        }
        console.log('details by chassis no.::',data);
        $scope.loader = false;
      }, function(err) {
          $scope.details = [];
          $scope.serviceDetails = [];
          $scope.jobcardDetails = [];
      	  $scope.loader = false;
          $scope.detailsErrorMsg = err.data.message;
      });
    }

    $rootScope.creTableData = [];
    var selectedStatus;
    $scope.getCallerDetailsDetails = function(sapptId,status) {
           $scope.loader = true;
           selectedStatus = status;
           var lsToken = TokenService.getToken(adminUserScId);
           GetDevConsoleCallerDetailsService.query({sapptId:sapptId,status:selectedStatus,scId:adminUserScId,token:lsToken},function (data) {
           console.log('DEV CONSOLE CALL DETAILS :',data);
            $rootScope.creTableData = data;
            $rootScope.creTableDataErrorMsg = '';
            $rootScope.tableParams.reload();
            $rootScope.tableParams.page(1);
            $("#adminDataTableModal").modal('show');
            $scope.loader = false;
          }, function(err) {
            console.log(err);
            $rootScope.creTableData = [];
            $rootScope.tableParams.reload();
            $scope.loader = false;
            $("#adminDataTableModal").modal('show');
            $rootScope.creTableDataErrorMsg = err.data.message;
          });
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

});