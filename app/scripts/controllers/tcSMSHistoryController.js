'use strict';

angular.module('letsService')
  .controller('SMSHistoryController', function ($scope,$timeout,$cookies,$filter,ngTableParams,serviceURL, $window, TokenService,GetSMSHistoryService) {

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
    $scope.creTableData = [];
    function getSmsHistory(exportStatus){
      $scope.loading = true;
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      GetSMSHistoryService.query({scId:adminUserScId,export:exportStatus,fromDate:selectedFromDate,toDate:selectedToDate,token:lsToken},function (data) {
        //$scope.smsHistoy = data;
        //$scope.smsHistoryGrid.data = data;
        $scope.smsHistoryErrorMsg = '';
        $scope.creTableData = data;
        $scope.tableParams.reload();
        console.log('smsHistoy',data);
        $scope.loading = false;
      }, function (err) {
        $scope.creTableData = [];
        $scope.smsHistoryErrorMsg = err.data.message;
        console.log(err);
        $scope.loading = false;
      });
    }
    getSmsHistory('submit');

    $scope.exportSmsHistory = function(exportStatus){
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      $window.open(serviceURL+'get_sent_sms_list/'+adminUserScId+'/'+exportStatus+'/'+selectedFromDate+'/'+selectedToDate+'/'+lsToken);
    };
    
    $scope.adminCallerStatsByDate = function(selFromDate,selToDate){
       if(selFromDate > selToDate) {
        $window.alert('To Date should be greater than From Date');
      } else {
        selectedFromDate = selFromDate.getFullYear() + '-' + (selFromDate.getMonth() + 1) + '-' + selFromDate.getDate();
        selectedToDate = selToDate.getFullYear() + '-' + (selToDate.getMonth() + 1) + '-' + selToDate.getDate();
       }
       getSmsHistory('submit');
       //$scope.tcAppointment = {};
       //$scope.dateForm.$setPristine();
       //selectedFromDate = 'date';
       //selectedToDate = 'date'; 
    };

    /*$scope.smsHistoryGrid = {
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      enableFiltering: true,
      enableColumnResizing: true,
      enableSorting: true,
      columnDefs: [
        { name: 'slNo', displayName: 'Sl No.', width: 80},
        { name: 'mobile', displayName: 'Mobile', width: 200},
        { name: 'message', displayName: 'Message'},
        { name: 'status', displayName: 'Status',width: 200},
        { name: 'create_ts', displayName: 'Sent Date', width: 200}]
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
