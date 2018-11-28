'use strict';

angular.module('letsService')
  .controller('ManageSMSController', function ($scope,$timeout,serviceURL,$cookies,GetScSMSStatsService, $window, TokenService, SendSMSService,TeleCallingSMSPackageService,TeleCallingSMSPricingService,GetSMSHistoryService) {



$scope.teleCallingStatusForUpdate = [{'id': 1, 'description': 'Pickup and Drop'},
      {'id': 2, 'description': 'Walkin'}, {'id': 3, 'description': 'Call Later'},
      {'id': 4, 'description': 'Not Interested'},
      {'id': 6, 'description': 'Service Done'}];

  });