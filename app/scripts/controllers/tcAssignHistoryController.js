

'use strict';

angular.module('letsService')
  .controller('TCAssignHistoryController', function ($scope,$window,$cookies,ngTableParams,$filter,TokenService,GetAssignHistoryService) {

    $scope.creTableData = []; 
    function getAssignHistory(){
      $scope.loading = true;
     // var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      GetAssignHistoryService.query({scId:adminUserScId,token:lsToken},function (data) {
        // $scope.smsHistoy = data;
        //$scope.assignHistoryGrid.data = data;
        $scope.creTableData = data;
        $scope.tableParams.reload();
        console.log('assignHistoy',data);
        $scope.loading = false;
      }, function (err) {
        $scope.creTableData = [];
        $scope.assignHistoryErrorMsg = err.data.message;
        console.log(err);
        $scope.loading = false;
      });
    }
    getAssignHistory();

    /*$scope.assignHistoryGrid = {
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      enableFiltering: true,
      enableColumnResizing: true,
      enableSorting: true,
      columnDefs: [
        { name: 'slNo', displayName: 'Sl No.', width: 80},
        { name: 'description', displayName: 'Description',width: 1300},


        { name: 'create_ts', displayName: 'Assigned Time', width: 160}]
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
