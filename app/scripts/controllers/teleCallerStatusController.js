

'use strict';

angular.module('letsService')
  .controller('TeleCallerStatusController', function ($scope,$window,$cookies,TokenService,TeleCallerStatusDataService) {

    /*var adminUserId = $window.sessionStorage.getItem('loggedInUserId');
    var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');
    var adminUserRole = $window.sessionStorage.getItem('loggedInUserRole');*/

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var adminUserRole = $cookies.get('loggedInUserRole');


    $scope.openCalendar = function(e,dateFilter) {
      e.preventDefault();
      e.stopPropagation();
      if(dateFilter === 'FromDate') {
        $scope.isOpenFrom = true;
      } else if(dateFilter === 'ToDate') {
        $scope.isOpenTo = true;
      }
    };

      $scope.getTeleCallerStatusDataByDate = function (tcStatusData) {
        $scope.loading = true;
        var lsToken = TokenService.getToken(adminUserScId);
        if(tcStatusData.selectedFromDate > tcStatusData.selectedToDate) {
          $window.alert('From Date cannot be greater than To Date');
        } else {
          var selectedFromDate = tcStatusData.selectedFromDate.getFullYear() + '-' + ('0' + (tcStatusData.selectedFromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + tcStatusData.selectedFromDate.getDate()).slice(-2);
          var selectedToDate = tcStatusData.selectedToDate.getFullYear() + '-' + ('0' + (tcStatusData.selectedToDate.getMonth() + 1)).slice(-2) + '-' + ('0' + tcStatusData.selectedToDate.getDate()).slice(-2);
          TeleCallerStatusDataService.query({fromDate:selectedFromDate,toDate:selectedToDate,id:adminUserScId,token:lsToken},function (data) {
           // console.log(selectedFromDate+'/'+selectedToDate+'/'+adminUserScId+'/'+lsToken);
            $scope.teleCallerStatusData = data;
            $scope.loading = false;
            console.log(data);
          }, function (err) {
            $scope.loading = false;
            $scope.teleCallerStatusErrorData = err.data.message;
          });
        }
    };

  });
