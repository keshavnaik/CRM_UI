'use strict';

angular.module('letsService')
	.controller('BuySMSController', function ($scope,$timeout,serviceURL,$cookies,GetScSMSStatsService, $window, TokenService, SendSMSService,TeleCallingSMSPackageService,TeleCallingSMSPricingService,GetSMSHistoryService) {

		function getSmsPackages() {
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallingSMSPackageService.query({scId:adminUserScId,token:lsToken},function (data) {
        $scope.smsPackages = data;
       // console.log('smsPackages',data);
      }, function (err) {
        $scope.smsPackagesErrorMsg = err.data.message;
      });
    }

    getSmsPackages();

    function getSMSPriceAndCount(smsCount) {
      var adminUserScId = $cookies.get('loggedInUserScId');
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallingSMSPricingService.get({smsCount:smsCount,scId:adminUserScId,token:lsToken},function (data) {
        $scope.smsPricing = data;
        //console.log('smsPricing',data);
      }, function (err) {
        $scope.smsPricingErrorMsg = err.data.message;
      });
    }

    var smsCountMore;

    $scope.getSmsPricing = function(smsCount) {
      if(smsCount !== '>10000'){
        getSMSPriceAndCount(smsCount);
      }
      $scope.smsPricing = [];
      /* console.log('test', $scope.smsPricing);*/
    };

    $scope.getSmsPricingMore = function(smsCount) {
      if(smsCount <10001){
        $scope.smsMsg = 'Enter more than 10000';
      }
      else if (smsCount >10000) {
        $scope.smsMsg = '';
        smsCountMore = smsCount;
        getSMSPriceAndCount(smsCount);
      }

    };


    $scope.paySms = function(paySmsData) {
      if(paySmsData === '>10000'){
        paySmsData = smsCountMore;
      }
      var adminUserScId = $cookies.get('loggedInUserScId');
      $window.open(serviceURL+'templates/paytm/paytmTransaction.php?letsservice&smsCount='+paySmsData+'&customerId='+adminUserScId);
    };
	})