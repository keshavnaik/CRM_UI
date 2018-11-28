'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK (March-09-2018)
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('CrmUpdateDateOfSaleController', function ($scope,$cookies,$rootScope,$filter, serviceURL,$window,TokenService,CrmDateOfSaleListService,GetPresentHourService,UpdateDateOfSaleService,$timeout,BrandWiseModelService,InactiveDateOfSaleDataService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');
    var loginZone = $cookies.get('loggedInZone');
    $scope.loggedInFileUploadStatus = $cookies.get('csvFileUploadStatus');
    
    //  alert($scope.date.getDate()-1);
    $scope.openCalendarStatus = function(e) {
      $scope.maxDate = presentDateData;
      e.preventDefault();
      e.stopPropagation();
      $scope.isOpenFromStatus = true;
    };

   var presentDateData;
    function getPresentDate() {
      GetPresentHourService.get(function (data) {
        console.log('present date : ',data);
        presentDateData = data.date;
      }, function (err) {
      });
    }
    getPresentDate();
    

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

     var selectedBranch = 'branch';
     var displayList = 'submit';
    function getDateOfSaleData(selBranch) {
      selectedBranch = selBranch;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      CrmDateOfSaleListService.query({scId:adminUserScId,branchId:selectedBranch,exportType:displayList,bikeBrand:loginBrandName,token:lsToken},function(data) {
        console.log(' Date Of Sale List :',data);
        $scope.dateOfSaleData = data;
        angular.forEach($scope.dateOfSaleData,function(val,index){
        $scope.dateOfSaleData[index].create_ts = new Date($scope.dateOfSaleData[index].create_ts);
        })
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.dateOfSaleDataErrorMsg = err.data.message;
      });
    }
    getDateOfSaleData(selectedBranch);

var selectedChassisNo;
$scope.updateDateOfSaleMsg = '';
var selectedVehicleType;
$scope.updateDateOfSale = function(dateOfSaleObj) {
   console.log(selDateOfSaleObj);
   var filteredDateOfSale = dateOfSaleObj.selectedDate.getFullYear() + '-' + (dateOfSaleObj.selectedDate.getMonth() + 1) + '-' + dateOfSaleObj.selectedDate.getDate();
   $scope.updateDateOfSaleMsgErrorMsg = '';
     console.log(dateOfSaleObj);
     var dateOfSaleObj = {
      scId :adminUserScId,
      chassisNo : selDateOfSaleObj.chassisNo,
      dateOfSale : filteredDateOfSale,
      customer_name : selDateOfSaleObj.customer_name,
      customer_mobile :selDateOfSaleObj.customer_mobile,
      bikeBrand : loginBrandName,
      bikeNo : selDateOfSaleObj.bikeNo,
      branchId : selDateOfSaleObj.scBranchId,
      loginId : adminUserId,
      zone : loginZone,
      customer_address : 'NA',
      bikeType : selectedVehicleType,
      bikeModel : selectedBikeTypeModel
     }
      console.log(JSON.stringify(dateOfSaleObj));
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateDateOfSaleService.save({scId:adminUserScId,token:lsToken},dateOfSaleObj,function(data) {
        console.log('Update Date Of Sale data :',data);
        $scope.updateDateOfSaleMsg = data.message;
        $scope.updateDateOfSaleMsgErrorMsg = '';
        $scope.dateOfSale = {};
        $scope.updateDateOfSaleForm.$setPristine();
        getDateOfSaleData(selectedBranch);
        $timeout(function() {
          $('#updateDateOfSaleModal').modal('hide');
        }, 3000);
      }, function(err) {
        console.log(err);
        $scope.dateOfSale = {};
        $scope.updateDateOfSaleForm.$setPristine();
        $scope.updateDateOfSaleMsgErrorMsg = err.data.message;
      });
    }
    
    var selDateOfSaleObj = {};
    $scope.getDateOfSaleObj = function(obj){
      $scope.updateDateOfSaleMsg = '';
      selDateOfSaleObj = obj;
      $scope.bikeModel = selDateOfSaleObj.bikeModel;
      selectedBikeTypeModel = selDateOfSaleObj.bikeModel;
      console.log(selDateOfSaleObj);
      if($scope.loggedInFileUploadStatus === 'No'){
         getBrandWiseModels(loginBrandName);
      }
    }

    $scope.clearUpdateMsg = function(){
      $scope.updateDateOfSaleMsgErrorMsg = '';
    }

    $scope.exportUpdateDateOfSaleCustomers = function(){
      console.log('Export button');
      var displayList = 'export'; 
      var lsToken = TokenService.getToken(adminUserScId);
      $window.open(serviceURL+'get_new_customer_details/'+adminUserScId+'/'+selectedBranch+'/'+displayList+'/'+loginBrandName+'/'+lsToken);
      };
 

      $scope.brandWiseVehicle = {};
      function getBrandWiseModels(brandName) {
          var lsToken = TokenService.getToken(adminUserScId);
          BrandWiseModelService.query({brandName: brandName},function (data) {
             console.log('Brand Wise Models',data);
             $scope.brandWiseVehicleTypes = data;
             $scope.brandWiseVehicle.values = $scope.brandWiseVehicleTypes;
          }, function (err) {
            console.log(err);
           //$scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
          });
      }
       
      
      var selectedBikeModel;
      var selectedBikeTypeModel;
      $scope.modelArr = [];
      $scope.getSelectedBikeType = function (selBikeType) {
      $scope.modelArr = [];
      selectedVehicleType = selBikeType.key;
      console.log('selectedVehicleType',selectedVehicleType);
      selectedBikeModel = selBikeType.value;
      console.log(selBikeType);
      if(selDateOfSaleObj.bikeModel === null || selDateOfSaleObj.bikeModel === ''){
      $scope.multipleModel = selectedBikeModel.toLowerCase().includes("/");
      //if($scope.multipleModel){
        var selectedBikeType = selectedBikeModel;
        $scope.modelArr = selectedBikeType.split('/');
     // }
     }

      $scope.getSelectedBikeTypeModel = function (selBikeTypeModel) {
       console.log(selBikeTypeModel);
       selectedBikeTypeModel = selBikeTypeModel;
      }
     
    };

    var inactiveDos =false;
    $scope.inactiveDateOfSale = function(dateOfSaleObj){
      inactiveDos = $window.confirm('Are you sure to Inactive?');
      if(inactiveDos){
        inactiveDateOfSaleData(dateOfSaleObj.chassisNo)
      } else if(!inactiveDos){
        console.log('Cancelled DOS');
      }
    }
    
    function inactiveDateOfSaleData(chassisNo) {
          var lsToken = TokenService.getToken(adminUserScId);
          var dosObj = {
            scId : adminUserScId,
            chassisNo : chassisNo
          }
          console.log(JSON.stringify(dosObj));
          InactiveDateOfSaleDataService.save({id: adminUserScId,token:lsToken},dosObj,function (data) {
             console.log('InactiveDateOfSaleData',data);
             $window.alert(data.message);
             getDateOfSaleData(selectedBranch);
          }, function (err) {
            console.log(err);
           //$scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
          });
      }
      
   
  });
