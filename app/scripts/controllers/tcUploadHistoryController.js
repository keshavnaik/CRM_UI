

'use strict';

angular.module('letsService')
  .controller('TCUploadHistoryController', function ($scope,$window,$filter,$rootScope,ngTableParams,$cookies,TokenService,GetUploadHistoryService) {
    
    var loggedInFileUploadStatus = $cookies.get('csvFileUploadStatus');
   
    $scope.creTableData = [];
    function getUploadHistory(){
      $scope.loading = true;
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      GetUploadHistoryService.query({scId:adminUserScId,token:lsToken},function (data) {
        // $scope.smsHistoy = data;
        //$scope.uploadHistoryGrid.data = data;
        $scope.creTableData = data;
        $scope.tableParams.reload();
        console.log('uploadHistoy',data);
        $scope.loading = false;
      }, function (err) {
        $scope.creTableData = [];
        $scope.uploadHistoryErrorMsg = err.data.message;
        console.log(err);
        $scope.loading = false;
      });
    }
    getUploadHistory();

 if($rootScope.signedInUserRole !== 'caller'){
    if(loggedInFileUploadStatus === 'Yes'){
      $scope.uploadLead = true;
      $scope.failLead = true;
     /* $scope.uploadHistoryGrid = {
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      enableFiltering: true,
      enableColumnResizing: true,
      enableSorting: true,
      columnDefs: [
        { name: 'slNo', displayName: 'Sl No.', width: 80},
        { name: 'leadsInCsv', displayName: 'Leads In File', width: 130},
        { name: 'leadsCreated', displayName: 'Leads Created',width: 130},
        { name: 'leadsFailed', displayName: 'Leads Failed', width: 130},
        { name: 'duplicateLeads', displayName: 'Duplicate Leads', width: 130},
        { name: 'dataType', displayName: 'Data Type', width: 200},
        { name: 'branchName', displayName: 'Branch',width: 200},
        { name: 'create_ts', displayName: 'Uploaded Time',width: 200},
        { name: 'filePath', displayName: 'Uploaded Data', cellTemplate: '<div><center><button class="btn btn-primary btn-sm" style="background-color: #0083ca;color:#FFFFFF;border-radius: 15px;padding: 0px 25px 0px 25px;outline:0;border:none !important;" ng-click="grid.appScope.exportUploadHistory(row)">Export</button></center></div>', width: 150},
        { name: 'summaryFile', displayName: 'Failed Leads', cellTemplate: '<button class="btn btn-primary btn-sm" style="background-color: #0083ca;color:#FFFFFF;border-radius: 15px;padding: 0px 25px 0px 25px;outline:0;border:none !important;" ng-click="grid.appScope.exportUploadFailedHistory(row)">Export</button>', width: 150}]
    };*/
    } else if(loggedInFileUploadStatus === 'No'){
      $scope.uploadLead = false;
      $scope.failLead = true;
      /*$scope.uploadHistoryGrid = {
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      enableFiltering: true,
      enableColumnResizing: true,
      enableSorting: true,
      columnDefs: [
        { name: 'slNo', displayName: 'Sl No.', width: 80},
        { name: 'leadsInCsv', displayName: 'Leads In File', width: 130},
        { name: 'leadsCreated', displayName: 'Leads Created',width: 130},
        { name: 'leadsFailed', displayName: 'Leads Failed', width: 130},
        { name: 'duplicateLeads', displayName: 'Duplicate Leads', width: 130},
        { name: 'dataType', displayName: 'Data Type', width: 200},
        { name: 'branchName', displayName: 'Branch',width: 200},
        { name: 'create_ts', displayName: 'Uploaded Time',width: 200},
        { name: 'summaryFile', displayName: 'Failed Leads', cellTemplate: '<div><center><button class="btn btn-primary btn-sm" style="background-color: #0083ca;color:#FFFFFF;border-radius: 15px;padding: 0px 25px 0px 25px;outline:0;border:none !important;" ng-click="grid.appScope.exportUploadFailedHistory(row)">Export</button></center></div>', width: 150}]
    };*/
    }
    
  }

 if($rootScope.signedInUserRole === 'caller'){
  $scope.uploadLead = false;
  $scope.failLead = true;
   /*$scope.uploadHistoryGrid = {
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      enableFiltering: true,
      enableColumnResizing: true,
      enableSorting: true,
      columnDefs: [
        { name: 'slNo', displayName: 'Sl No.', width: 80},
        { name: 'leadsInCsv', displayName: 'Leads In File', width: 130},
        { name: 'leadsCreated', displayName: 'Leads Created',width: 130},
        { name: 'leadsFailed', displayName: 'Leads Failed', width: 130},
        { name: 'duplicateLeads', displayName: 'Duplicate Leads', width: 200},
        { name: 'branchName', displayName: 'Branch',width: 200},
        { name: 'dataType', displayName: 'Data Type', width: 250},
        { name: 'create_ts', displayName: 'Uploaded Time',width: 300}]
      };*/
 }
    

    /*$scope.exportUploadHistory = function (selRow) {
      console.log(selRow);
       if(selRow.entity.filePath === null){
       $window.alert('No Data Available..!');
      }
      $window.open(selRow.entity.filePath,'_blank');
    };
    $scope.exportUploadFailedHistory = function (selRow) {
      console.log(selRow);
      if(selRow.entity.summaryFile === null){
       $window.alert('No Data Available..!');
      }
      $window.open(selRow.entity.summaryFile,'_blank');
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

    $scope.exportUploadHistory = function (selRow) {
      console.log(selRow);
       if(selRow.filePath === null || selRow.filePath === undefined || selRow.filePath === ''){
       $window.alert('No Data Available..!');
      }
      $window.open(selRow.filePath,'_blank');
    };
    $scope.exportUploadFailedHistory = function (selRow) {
      console.log(selRow);
      if(selRow.summaryFile === null || selRow.summaryFile === undefined || selRow.summaryFile === ''){
       $window.alert('No Data Available..!');
      }
      $window.open(selRow.summaryFile,'_blank');
    };


  });
