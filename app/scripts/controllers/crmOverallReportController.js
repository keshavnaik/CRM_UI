'use strict';

angular.module('letsService')
  .controller('CrmOverallReportController', function ($scope,$timeout,serviceURL,$cookies,GetScSMSStatsService, $window, TokenService,TeleCallerWiseServiceCenterService,DealerRevenueReportService,GetSuperAdminDealerListService,DealerWiseDataReportService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');


  function getSuperAdminDealerList() {
      var lsToken = TokenService.getToken(adminUserId);
      GetSuperAdminDealerListService.query({logInId:adminUserId,token:lsToken}, function(data) {
        $scope.dealerList = data;
        console.log('dealerList +++',data);
      }, function(err) {
        $scope.dealerListErrorMsg = err.data.message;
      });
    }
    getSuperAdminDealerList();

    var selectedBranch = 'branch';
    $scope.getSelectedDealer = function (selDealer) {
      selectedBranch = 'branch';
      console.log(selDealer);
      adminUserScId = selDealer;
      //$rootScope.scIdSuperAdmin = selDealer;
      getDealerRevenueReport(selectedBranch);
      getDealerWiseDataReport(selectedBranch);
      getServiceCenterTeleCallerWise();
    };

  function getServiceCenterTeleCallerWise() {
      //adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
        console.log('hi+++++++++++++',data);
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise();
   
   $scope.getSelectedBranch = function (selBranch) {
      console.log('selected branch',selBranch);
      selectedBranch = selBranch;
      if(selBranch === null){
        selectedBranch = 'branch';
      }
      getDealerRevenueReport(selectedBranch);
      getDealerWiseDataReport(selectedBranch);
  };

   $scope.loaderIconRevenue = false;
   $scope.revenueHeaders = [];
   function getDealerRevenueReport(selBranch) {
      $scope.loaderIconRevenue = true;
      selectedBranch = selBranch;
      var lsToken = TokenService.getToken(adminUserScId);
      DealerRevenueReportService.query({scId:adminUserScId,branchId:selectedBranch,token:lsToken},function(data) {
        console.log(' Dealer Revenue Report :',data);
        $scope.revenueReport = data;
        if($scope.revenueReport !== undefined && $scope.revenueReport !== null){
          $scope.revenueHeaders.push($scope.revenueReport[0].monthName4);
            $scope.revenueHeaders.push($scope.revenueReport[0].monthName3);
            $scope.revenueHeaders.push($scope.revenueReport[0].monthName2);
            $scope.revenueHeaders.push($scope.revenueReport[0].monthName1);
            $scope.revenueHeaders.push($scope.revenueReport[0].monthName0);
           angular.forEach($scope.revenueReport,function(val,index){
             if($scope.revenueReport[index].month4 === null){
               $scope.revenueReport[index].month4 = '0';
            }
            if($scope.revenueReport[index].month3 === null){
               $scope.revenueReport[index].month3 = '0';
            }
            if($scope.revenueReport[index].month2 === null){
               $scope.revenueReport[index].month2 = '0';
            }
            if($scope.revenueReport[index].month1 === null){
               $scope.revenueReport[index].month1 = '0';
            }
            if($scope.revenueReport[index].month0 === null){
               $scope.revenueReport[index].month0 = '0';
            }
          });
        }
        $scope.loaderIconRevenue = false;
      }, function(err) {
        $scope.loaderIconRevenue = false;
        $scope.revenueReportErrorMsg = err.data.message;
      });
    }
 $scope.loaderIconDataReport = false;
 $scope.dealerWiseDataHeaders = [];
 function getDealerWiseDataReport(selBranch) {
      $scope.loaderIconDataReport = true;
      selectedBranch = selBranch;
      var lsToken = TokenService.getToken(adminUserScId);
      DealerWiseDataReportService.query({scId:adminUserScId,branchId:selectedBranch,token:lsToken},function(data) {
        console.log(' Dealer Wise Data Report :',data);
        $scope.dealerWiseDataReport = data;
        if($scope.dealerWiseDataReport !== undefined && $scope.dealerWiseDataReport !== null){
          $scope.dealerWiseDataHeaders.push($scope.dealerWiseDataReport[0].monthName4);
            $scope.dealerWiseDataHeaders.push($scope.dealerWiseDataReport[0].monthName3);
            $scope.dealerWiseDataHeaders.push($scope.dealerWiseDataReport[0].monthName2);
            $scope.dealerWiseDataHeaders.push($scope.dealerWiseDataReport[0].monthName1);
            $scope.dealerWiseDataHeaders.push($scope.dealerWiseDataReport[0].monthName0);
           angular.forEach($scope.dealerWiseDataReport,function(val,index){
             if($scope.dealerWiseDataReport[index].month4 === null){
               $scope.dealerWiseDataReport[index].month4 = '0';
            }
            if($scope.dealerWiseDataReport[index].month3 === null){
               $scope.dealerWiseDataReport[index].month3 = '0';
            }
            if($scope.dealerWiseDataReport[index].month2 === null){
               $scope.dealerWiseDataReport[index].month2 = '0';
            }
            if($scope.dealerWiseDataReport[index].month1 === null){
               $scope.dealerWiseDataReport[index].month1 = '0';
            }
            if($scope.dealerWiseDataReport[index].month0 === null){
               $scope.dealerWiseDataReport[index].month0 = '0';
            }
          });
        }
        $scope.loaderIconDataReport = false;
      }, function(err) {
        $scope.loaderIconDataReport = false;
        $scope.dealerWiseDataReportErrorMsg = err.data.message;
      });
    }

      getDealerRevenueReport(selectedBranch);
      getDealerWiseDataReport(selectedBranch);
  });