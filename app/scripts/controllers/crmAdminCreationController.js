'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testApp
 * written BY KESHAV NAIK (MAY-30-2018)
 */
angular.module('letsService').
controller('CrmAdminCreationController',function ($scope,$http,$window,TokenService){


  $scope.openCalendar = function(e,dateFilter) {
    $scope.minDate = new Date();
    $scope.minValidToDate = new Date();
    $scope.minValidToDate.setDate($scope.minValidToDate.getDate() + 30);
      e.preventDefault();
      e.stopPropagation();
      if(dateFilter === 'FromDate') {
        $scope.isOpenFrom = true;
      } else if(dateFilter === 'ToDate') {
        $scope.isOpenTo = true;
      }
    };

  var scId;
  $scope.sendCrmData = function (crmData) {
  var loginId =1;
  var lsToken = TokenService.getToken(loginId);

    var selValidFromDate =  crmData.validFromDate.getFullYear() + '-' + (crmData.validFromDate.getMonth() + 1) + '-' + crmData.validFromDate.getDate();
    var selValidToDate =  crmData.validToDate.getFullYear() + '-' + (crmData.validToDate.getMonth() + 1) + '-' + crmData.validToDate.getDate();
     if(crmData.validFromDate > crmData.validToDate) {
        $window.alert('To Date should be greater than From Date');
      } else {
        $scope.loading = true;
        crmData.validFromDate = selValidFromDate;
        crmData.validToDate = selValidToDate;

             var data = crmData;
          console.log(JSON.stringify(data));
          console.log(data);

            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('https://letsservicecrm.co.in/crm_saas_super_admin/create_crm_crentails/'+loginId+'/'+lsToken, data,  config)
            .success(function (data, status, headers, config) {
                 console.log(data);
                 $scope.crmCredentialsSuccessMsg = ' Username : ' + data.Username+  '   Password : ' + data.Password;
                $window.alert($scope.crmCredentialsSuccessMsg);
                 scId = data.scId;
                 $scope.crmCredentialsErrorMsg = '';
                 getServiceCenter();
                 $scope.loading = false;
           
            })
            .error(function (data, status, header, config) {
                 $scope.loading = false;
                 console.log("data",data);
                 $window.alert(data.message);
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
            });
      }
}

function getServiceCenter() {
     if(scId){
var lsToken = TokenService.getToken(scId);
 $http.get('https://letsservicecrm.co.in/get_sc_branch_list/'+scId+'/'+lsToken)
                .then(function (response) {
               $scope.serviceCenter = response.data;
                //console.log("serviceCenter object",$scope.serviceCenter);
            });
}
   
    }
    getServiceCenter();

    $scope.validateMobileNumber = function (mobileNumber) {
      // console.log("manual",mobileNumber);
     // $scope.createAppointment={mobile : mobileNumber};
      var numberCount = mobileNumber.split(',');
      var keepLooping = true;
      angular.forEach(numberCount, function (val) {
        if(keepLooping) {
          var isnum = /^\d+$/.test(val);
          if(isnum) {
            var numLength = val.length;
            if(numLength === 10 ) {

            } else {
              keepLooping = false;
              resetForm('Kindly enter 10 digit mobile number');
            }
          } else {
            keepLooping = false;
            resetForm('Kindly enter multiple 10 digit mobile number comma separated.');
          }
        }
      });
    };

    function resetForm(msg) {
      $window.alert(msg);
    }

  $scope.getCityWiseServiceCenter= function() {
      var loginId =1;
      $http.get('https://letsservicetech.in/cityWiseServiceCenterList/'+loginId+'/295822529277341')
                .then(function (response) {
//console.log(response);
               $scope.cityWiseserviceCenterList = response.data;
               
            });
    }
   // getCityWiseServiceCenter();

function getBikeBrands() {
      $http.get('https://letsservicecrm.co.in/get_bike_brands')
                .then(function (response) {
//console.log(response.data);
               $scope.bikeBrands = response.data;
               
            });
    }
    getBikeBrands();


$scope.zones = [{'key':'zone1', 'name':'R3 Zone'},{'key':'zone2', 'name':'Others'}];
$scope.logics = [{'key':'logic1', 'name':'Logic-1 (KM wise)'},{'key':'logic2', 'name':'Logic-2 (Scheduled date wise)'}];



$scope.sendCrmDetailsData = function (crmDetailsData) {
var lsToken = TokenService.getToken(scId);
$scope.loading = true;
        //console.log(crmDetailsData);
var crmDetailsDataObj = {
        email: crmDetailsData.email,
        opdId: crmDetailsData.selectedServiceCenter || 0,
        scId: scId,
        branchId: crmDetailsData.branchId,
        mobile: crmDetailsData.mobile
      };
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('https://letsservicecrm.co.in/crm_saas_super_admin/update_branch_details/'+scId+'/'+lsToken, crmDetailsDataObj,  config)
            .success(function (data, status, headers, config) {
                 console.log(data);
               //$scope.crmDetailsSuccessMsg =data.message;
                  $window.alert(data.message);
                $scope.loading = false;
            })
            .error(function (data, status, header, config) {
                $scope.loading = false;
                //console.log("data",data);
                $scope.ResponseDetails = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
            });
    };

   
 });