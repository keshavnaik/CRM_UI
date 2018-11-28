'use strict';

angular.module('letsService')
  .controller('CrmUploadController', function ($scope,$state,$timeout,$cookies,$rootScope,$window,TokenService, TcAdminDashboardService,TeleCallerWiseServiceCenterService,TeleCallerDataTypeService,GetBranchWiseTeleCallerService,TcAdminDashboardDetailService,serviceURL,TeleCallerExcelUploadService,TeleCallingSearchService,TeleCallingCallRecordService,TeleCallerExcelUploadJobcardDataService,TeleCallerPerticularAppointmentHistoryDataService,TeleCallerExcelUploadServiceReminderDataService,TeleCallerJobCardDataService,TeleCallerCallStatsDataService,TeleCallerFeedbackRatingService,GetFeedbackTitleService,AddFeedbackQuestionService,TeleCallerExcelUploadSalesFeedbackDataService,BrandWiseModelService,TeleCallerExcelUploadAMCDataService,TeleCallerCSVUploadServiceReminderDataService,TeleCallerCSVUploadJobCardDataService,AppointmentDueTypeStats,ConversionDueTypeStatsService,TeleCallerCSVUploadRegularDataService,AssignCallerService,TeleCallerStatusService,UpdateTelecallingTargetService,GetScWiseTeleCallerService,GetInsuranceCallerListService,AssignInsuranceDataService,GetUnAssignedDataService,TeleCallerExcelUploadExtendedWarrantyDataService,TeleCallerExcelUploadAMCDataUtilityService,TeleCallerExcelUploadInsuranceDataService) {

    /*var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');
    var loggedInVersionCode = $cookies.get('loggedInVersionCode');
    var loggedInFileUploadStatus = $cookies.get('csvFileUploadStatus');*/
    var adminUserId = $cookies.get('loggedInUserIdAdmin');
    //var adminUserScId = $cookies.get('loggedInUserScIdAdmin');
    var adminUserScId = $cookies.get('loggedInUserScId');
    //var loginBrandName = $cookies.get('loggedInUserBikeBrandAdmin');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');
    /* var loggedInVersionCode = $cookies.get('loggedInVersionCodeAdmin');*/
    var loggedInVersionCode = $cookies.get('loggedInVersionCode');
    /*var loggedInFileUploadStatus = $cookies.get('csvFileUploadStatusAdmin');*/
    var loggedInFileUploadStatus = $cookies.get('csvFileUploadStatus');

    $scope.loginBrandName = $cookies.get('loggedInUserBikeBrand');
    $scope.loggedInModelCode = $cookies.get('loggedInModelCode');

    $scope.csvStatus = true;
    if(loggedInFileUploadStatus === 'Yes'){
      loggedInFileUploadStatus = true;
    }else if(loggedInFileUploadStatus === 'No'){
      loggedInFileUploadStatus = false;
    }
    $scope.csvUploadStatus = loggedInFileUploadStatus;

    $scope.adminUserIdUtility = adminUserScId;
    $scope.openCalendar = function(e,dateFilter) {
      e.preventDefault();
      e.stopPropagation();
      if(dateFilter === 'FromDate') {
        $scope.isOpenFrom = true;
      } else if(dateFilter === 'ToDate') {
        $scope.isOpenTo = true;
      }
    };

    $scope.getSubOption = function (name) {
      alert(name);
    };

  	var selFromDatedata = 'month';
  	var selToDateData = 'month';
  	var selExport = 'submit';
    var selSeviceCenter = 'branch';
    var selDataType = 'datatype';
    var selCaller = 'caller';
    var selStatus = 'status';
    var selSubStatus = 'noStatus';
    var selectedFeedbackListId = 'feedback';

    function getDataTypesForUpload() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerDataTypeService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.dataTypesForUpload = data;
        console.log(' $scope.dataTypesForUpload :', $scope.dataTypesForUpload);
        for(var i=0;i<data.length;i++){
          if(data[i].description === 'Non Convereted Data'){
            data[i].description ='Job Card Data';
          }
        }
      }, function (err) {
        $scope.datatypeErrorMsg = err.data.message;
      });
    }
    getDataTypesForUpload();

    function getServiceCenterTeleCallerWise() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise();

    $scope.dataForAssign = [{'id':'1','name':'Sales'},{'id':'2','name':'Insurance'}];

    var selectedServiceCenter;
    var selectedBikeType;
    var selectedAMCCount;
    var selectedValidMonth;

    $scope.getSelectedServiceCenter = function (selServiceCenter) {
      if(selServiceCenter === null || selServiceCenter === undefined){
         $('#uploadDataMapping').hide();
      }
      console.log(selServiceCenter);

      if(selectedDataType.length === 0){
          $scope.assignForm.$invalid = true;
      }
       if(selectedCaller.length === 0){
          $scope.assignForm.$invalid = true;
      }
      selectedServiceCenter = selServiceCenter;
      $scope.callerList = [];
      $scope.teleCallerDataCallerData = [];
      getScWiseCallerList(selectedServiceCenter);
      if(selectedServiceCenter !== undefined && selectedServiceCenter.length !== 0){
        if(selectedDataType !== undefined && selectedDataType.length !== 0){
           getUnassignedData(selectedDataType,'caller'); 
        }
        if($scope.selectedSIDataType !== undefined){
           getUnassignedData('dataTypeId',$scope.selectedSIDataType);  
        }
      }
    };

        function getBrandWiseModels(brandName) {
          var lsToken = TokenService.getToken(adminUserScId);
          BrandWiseModelService.query({brandName: brandName},function (data) {
             console.log('Brand Wise Models',data);
             $scope.brandWiseVehicleTypes = data;
          }, function (err) {
            console.log(err);
           // $scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
          });
        }

       getBrandWiseModels(loginBrandName);

       // $scope.vehicleTypesForYamaha = [{'bikeId':'1','bikeType':'bike'},{'bikeId':'2','bikeType':'scooter'}];
       // $scope.vehicleTypesForRE = [{'bikeId':'1','bikeType':'Royal Enfield'},{'bikeId':'2','bikeType':'Royal Enfield Himalayan'}];

    $scope.getSelectedBikeType = function (selBikeType) {
      selectedBikeType = selBikeType;
      console.log(selBikeType);
     /* if(selectedBikeType === 'Royal Enfield'){
        selectedBikeType = 'royal_enfield';
      } else if(selectedBikeType === 'Royal Enfield Himalayan'){
        selectedBikeType = 'royal_enfield_himalayan';
      }*/

    };

    $scope.getSelectedAMCCount = function (selAMCCount) {
      selectedAMCCount = selAMCCount;
      console.log(selAMCCount);
    };

    $scope.getSelectedValidMonth = function (selValidMonth) {
      selectedValidMonth = selValidMonth;
      console.log(selValidMonth);
    };

    var selectedDataType;
    var selectedDataDesc;
    $scope.getSelectedDataType = function (selDataTypeToUpload,selDataTypeDescToUpload) {
      selectedDataType = selDataTypeToUpload;
      selectedDataDesc = selDataTypeDescToUpload;
      console.log(selectedDataDesc);
      console.log(selectedDataType);
      $scope.selectedDataType = selectedDataType;
      $scope.selectedDataTypeDesc = selectedDataDesc;
      $scope.selectedDataTypeIdForUpload = selDataTypeToUpload;
      console.log(selectedDataDesc);
     /* if(selDataType === 'others'){
        selectedDataType = $scope.campDataName;
      }*/
     /* if($scope.campDataName !== undefined){
        selectedDataType = $scope.campDataName;
      }*/
    };

    $scope.getSelectedDataTypeForCsv = function (selDataTypeToUpload,selDataTypeDescToUpload) {
      if((selDataTypeDescToUpload === 'Service Reminder' || selDataTypeDescToUpload === 'Service Remainder' || selDataTypeDescToUpload === 'Job Card Data')){
        $scope.csvStatus = false;
      }else {
        $scope.csvStatus = true;
      }
      selectedDataType = selDataTypeToUpload;
      selectedDataDesc = selDataTypeDescToUpload;
      console.log(selectedDataDesc);
      console.log(selectedDataType);
      $scope.selectedDataType = selectedDataType;
      $scope.selectedDataTypeDesc = selectedDataDesc;
      $scope.selectedDataTypeIdForUpload = selDataTypeToUpload;
      console.log(selectedDataDesc);
      /* if(selDataType === 'others'){
         selectedDataType = $scope.campDataName;
       }*/
      /* if($scope.campDataName !== undefined){
         selectedDataType = $scope.campDataName;
       }*/
    };



$scope.assignCallerStatus = function (assignData) {
     var assignDataObj = {
       callerId: assignData.loginId,
       logInId: adminUserId,
       walkInCount: assignData.walkInCount,
       pickAndDropCount: assignData.pickAndDropCount,
       scId:adminUserScId
     };
     var lsToken = TokenService.getToken(adminUserScId);
     AssignCallerService.save({id:adminUserScId,token:lsToken}, assignDataObj, function (data) {
       $window.alert(data.message);
       getCaller();
     }, function (err) {
       console.log(err);
     });
   };

   $scope.openCalendar = function(e,dateFilter) {
     e.preventDefault();
     e.stopPropagation();
     if(dateFilter === 'FromDate') {
       $scope.isOpenFrom = true;
     } else if(dateFilter === 'ToDate') {
       $scope.isOpenTo = true;
     }
   };

   function getStatus() {
     var lsToken = TokenService.getToken(adminUserScId);
     TeleCallerStatusService.query({id:adminUserScId,token:lsToken},function (data) {
       $scope.teleCallingStatus= [];
       console.log(data);
       
       angular.forEach(data, function (val,index) {
         if(data[index].description !== 'Status Not Changed'){
           $scope.teleCallingStatus.push(data[index]);
         }
       });
       console.log(JSON.stringify($scope.teleCallingStatus));
     }, function (err) {
       $scope.statusErrorMsg = err.data.message;
     });
   }
   getStatus();

   var adminSelectedFromDate;
   var adminSelectedToDate;

   function updateTeleCallingTarget(targetData) {
     $scope.loading = true;
     var lsToken = TokenService.getToken(adminUserScId);
     UpdateTelecallingTargetService.save({id:adminUserScId,token:lsToken},targetData,function (data) {
       $window.alert(data.message);
       $state.reload();
       $scope.updateTelecallerTargetMsg = data.message;
       $scope.loading = false;
     }, function (err) {
       console.log(err);
       $scope.updateTelecallerTargetErrorMsg = err.data.message;
     });
   }


   function updateTeleCallingTargetSI(targetData) {
     $scope.loading = true;
     var lsToken = TokenService.getToken(adminUserScId);
     AssignInsuranceDataService.save({id:adminUserScId,token:lsToken},targetData,function (data) {
       $window.alert(data.message);
       $state.reload();
       $scope.updateTelecallerTargetMsgSI = data.message;
       $scope.loading = false;
     }, function (err) {
       $scope.updateTelecallerTargetErrorMsgSI = err.data.message;
     });
   }
   
   var assignedType = 'total';
   var selectedServiceCenterNames = [];
   var selectedDataTypeNames = [];
   var selectedCallerNames = [];
$scope.teleCallingAssignTarget = function(tcData) {
       var serviceCentersToAssign = [];
       var dataTypesToAssign = [];
       var targetData = {
         adminId: adminUserId,
         branchId: selectedServiceCenter.toString() ,
         dataTypeId:selectedDataType.toString() ,
         callerId: selectedCaller.toString(),
         scId: adminUserScId,
         assignedType : assignedType
       };
       console.log(JSON.stringify(targetData));
       updateTeleCallingTarget(targetData);
   };

   var callerIdToAssign;
   $scope.teleCallingAssignSI= function(tcData) {
       var serviceCentersToAssign = [];
       var dataTypesToAssign = [];
       if($scope.selectedSIDataType === 'Sales'){
          callerIdToAssign = selectedCaller.toString();
       }
       else if($scope.selectedSIDataType === 'Insurance'){
          callerIdToAssign = selectedCallerSI.toString();
       }
       var targetData = {
         adminId: adminUserId,
         branchId: $scope.selectedSIBranch ,
         dataType: $scope.selectedSIDataType,
         callerId: callerIdToAssign,
         scId: adminUserScId,
         assignedType : assignedType
       };
       console.log(JSON.stringify(targetData));
       updateTeleCallingTargetSI(targetData);
   };



   /*Multiple selection service center and data type*/

   $scope.teleCallerServiceCenterData = [];
   $scope.manageServiceCenterSettings = {displayProp: 'label'};

   function getServiceCenterToAssign() {
     var lsToken = TokenService.getToken(adminUserScId);
     TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
       angular.forEach(data, function(val) {
         $scope.teleCallerServiceCenterData.push({id:val.scId,label:val.scName});
       });
     }, function(err) {
       $scope.serviceCenterErrorMsg = err.data.message;
     });
     console.log('data typed',selectedDataType);
   }
   getServiceCenterToAssign();

   var selectedServiceCenter = [];

   $scope.updateTCServiceCenter = {
     onItemSelect: function(item) {
       selectedServiceCenter.push(parseInt(item.id));
     },
     onItemDeselect: function(item) {
       var updateSelectedServiceCenter = selectedServiceCenter.indexOf(parseInt(item.id));
       selectedServiceCenter.splice(updateSelectedServiceCenter,1);
     }
   };
   $scope.resetAssignServiceCenter = function() {
     $scope.manageServiceCenter = [];
     selectedServiceCenter = [];
   };

   $scope.resetAssignServiceCenter();
   $scope.teleCallerDataTypeData = [];
   $scope.manageDataTypeSettings = {displayProp: 'label'};

   function getDataTypes() {
    var lsToken = TokenService.getToken(adminUserScId);
    TeleCallerDataTypeService.query({id:adminUserScId,token:lsToken},function (data) {
    angular.forEach(data, function(val) {
    $scope.teleCallerDataTypeData.push({id:val.dataTypeId,label:val.description});
    });
    }, function (err) {
    $scope.datatypeErrorMsg = err.data.message;
    });
    }
    getDataTypes();

   var selectedDataType = [];

   $scope.updateTCDataType = {
     onItemSelect: function(item) {
       selectedDataType.push(parseInt(item.id));
      if(selectedDataType.length > 0){
        if(selectedCaller.length === 0){
          $scope.assignForm.$invalid = true;
      }else{
         $scope.assignForm.$invalid = false;
      }
         
        }
    else if(selectedDataType.length === 0){
          $scope.assignForm.$invalid = true;
      }
      getUnassignedData(selectedDataType,'caller');
     },
     onItemDeselect: function(item) {
       var updateSelectedDataType = selectedDataType.indexOf(parseInt(item.id));
       selectedDataType.splice(updateSelectedDataType,1);
      if(selectedDataType.length > 0){
           if(selectedCaller.length === 0){
          $scope.assignForm.$invalid = true;
      }else{
         $scope.assignForm.$invalid = false;
      }
        }
    else if(selectedDataType.length === 0){
          $scope.assignForm.$invalid = true;
      }
      getUnassignedData(selectedDataType,'caller');
     }
   };


   if(selectedDataType === []){
      $scope.assignForm.$invalid = true;
   }
   $scope.resetAssignDataType = function() {
     $scope.manageDataType = [];
     selectedDataType = [];
   };

   $scope.resetAssignDataType();

   /*end*/


   $scope.teleCallerDataCallerData = [];
   $scope.manageCallerSettings = {displayProp: 'label'};
   var  selectedCaller = [];


   function getScWiseCallerList(selBranch) {
     var lsToken = TokenService.getToken(adminUserScId);
     GetScWiseTeleCallerService.query({branchId:selBranch,id:adminUserScId,token:lsToken},function (data) {
       $scope.callerList = data;
       console.log('callerList',data);
       angular.forEach(data, function(val) {
         $scope.teleCallerDataCallerData.push({id:val.loginId,label:val.username,slNo:val.slNo});
       });
     }, function (err) {
       $scope.callerListErrorMsg = err.data.message;
     });
   }
   
  $scope.updateTCCaller = {
     onItemSelect: function(item) {
       selectedCaller.push(parseInt(item.id));
        if($scope.selectedSIDataType !== 'Sales'){
       if(selectedCaller.length > 0){
          $scope.assignForm.$invalid = false;
        }
    else if(selectedCaller.length === 0){
          $scope.assignForm.$invalid = true;
      }
    }
     },
     onItemDeselect: function(item) {
       var updateSelectedCaller = selectedCaller.indexOf(parseInt(item.id));
       selectedCaller.splice(updateSelectedCaller,1);
       if($scope.selectedSIDataType !== 'Sales'){
        if(selectedCaller.length > 0){
          $scope.assignForm.$invalid = false;
        }
    else if(selectedCaller.length === 0){
          $scope.assignForm.$invalid = true;
      }
    }
     }
   };

   $scope.resetAssignCaller = function() {
     $scope.manageCaller = [];
     selectedCaller = [];
   };
   $scope.resetAssignCaller();


   $scope.teleCallerDataCallerDataSI = [];
   $scope.manageCallerSettingsSI = {displayProp: 'label'};
   var  selectedCallerSI = [];


   function getInsuranceCallerList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetInsuranceCallerListService.query({scId:adminUserScId,token:lsToken},function (data) {
        $scope.insuranceCallerList = data;
        console.log('insurance Caller List ::::',data);
        angular.forEach(data, function(val) {
         $scope.teleCallerDataCallerDataSI.push({id:val.logInId,label:val.username});
       });
        console.log('$scope.teleCallerDataCallerDataSI',$scope.teleCallerDataCallerDataSI);
      }, function (err) {
        $scope.insuranceCallerListErrorMsg = err.data.message;
      });
    }
    getInsuranceCallerList();

   
  $scope.updateTCCallerSI = {
     onItemSelect: function(item) {
       selectedCallerSI.push(parseInt(item.id));
       if(selectedCallerSI.length > 0){
          $scope.assignFormSI.$invalid = false;
        }
    else if(selectedCallerSI.length === 0){
          $scope.assignFormSI.$invalid = true;
      }
     },
     onItemDeselect: function(item) {
       var updateSelectedCaller = selectedCallerSI.indexOf(parseInt(item.id));
       selectedCallerSI.splice(updateSelectedCaller,1);
        if(selectedCallerSI.length > 0){
          $scope.assignFormSI.$invalid = false;
        }
    else if(selectedCallerSI.length === 0){
          $scope.assignFormSI.$invalid = true;
      }
     }
   };

   $scope.resetAssignCallerSI = function() {
     $scope.manageCallerSI = [];
     selectedCallerSI = [];
   };
   $scope.resetAssignCallerSI();



   $scope.deAssignCallingData = function() {
     
        var serviceCentersToAssign = [];
       var dataTypesToAssign = [];
       var deAssignData = {
         adminId: adminUserId,
         branchId: selectedServiceCenter.toString() ,
         dataTypeId:selectedDataType.toString() ,
         callerId: selectedCaller.toString(),
         //  names: selectedServiceCenterNames.toString(),
         scId: adminUserScId
       };
       console.log(JSON.stringify(deAssignData));
    //   updateTeleCallingTarget(targetData);

   };

   $scope.unAssignedLables = [{'id':'1','name':'Unassigned Data'},{'id':'2','name':'Total Data'}];

  function getUnassignedData(selDataType,selDataTypeName){
    console.log('selectedServiceCenter',selectedServiceCenter);
    if(selectedServiceCenter !== undefined && selectedServiceCenter.length !== 0){
     console.log('selDataType',selDataType);
     console.log('selDataTypeName',selDataTypeName);
     var dataTypeIds = selDataType.toString();
     var lsToken = TokenService.getToken(adminUserScId);
     GetUnAssignedDataService.get({scId:adminUserScId,branchId:selectedServiceCenter,dataTypeId:dataTypeIds,dataTypeName:selDataTypeName,token:lsToken},function (data) {
       $scope.unAssignedData = data;
       console.log('unAssignedCount',data);
     }, function (err) {
       $scope.showAssignCaller = true;
       $scope.unAssignedCountErrorMsg = err.data.message;
       $scope.unAssignedData = '';
     });
    } else if(selectedServiceCenter.length === 0){
      $window.alert('Kindly Select the Branch..!');
    }
   }

   $scope.getSIDataType = function(selDataType){
    getUnassignedData('dataTypeId',selDataType);
   }

   $scope.getAssignType = function(selAssignType){
    assignedType = selAssignType;
    if(assignedType === 'Unassigned Data'){
      assignedType = 'unassigned';
    } else if(assignedType === 'Total Data'){
      assignedType = 'total'; 
    }
    if(selAssignType !== undefined && selAssignType !== null){
        $scope.showCaller = true;
    } else {
      $scope.showCaller = false;
    }
   }

   $scope.getSIAssignType = function(selAssignType){
     assignedType = selAssignType;
     if(assignedType === 'Unassigned Data'){
      assignedType = 'unassigned';
    } else if(assignedType === 'Total Data'){
      assignedType = 'total'; 
    }
     if(selAssignType !== undefined && selAssignType !== null){
        $scope.showSICaller = true;
    } else {
      $scope.showSICaller = false;
    }
   }



    /* Excel Upload */
    var oFileIn;
    //var selectedFileName;

    $(function() {
      oFileIn = document.getElementById('teleCallingSMSXlFileInput');
      if(oFileIn.addEventListener) {
        oFileIn.addEventListener('change', filePicked, false);
      }
    });

    var teleCallerXlToJson, teleCallerXlErrorRowNum, teleCallerXlErrorMsg, teleCallerXlInvalidDateFlag ;
    var uploadStatus;
    var fileColumnNames = [];
    //var uploadColumn = {};
    $('#uploadDataMapping').hide();
    $('#uploadDataMappingForServiceRemainder').hide();
    $('#uploadDataMappingForSalesFeedback').hide();
    $('#uploadDataMappingExtendedWarranty').hide();
    $('#uploadDataMappingInsurance').hide();
    function filePicked(oEvent) {
      if(selectedServiceCenter === undefined || selectedDataType === undefined){
        $window.alert('Kindly select the ServiceCenter/DataType to upload the file.');
        $('input[type="file"]').val(null);
      }
     /* if(selectedServiceCenter === undefined || selectedDataType === undefined){
        if(selectedDataDesc ==='Service Reminder') {
          $window.alert('Kindly select the ServiceCenter/DataType to upload the file.');
        }
        $('input[type="file"]').val(null);
      }*/
      /*if(selectedDataDesc ==='Service Reminder'){
        if(uploadColumn.bikeType === undefined){
          $window.alert('Kindly select the Vehicle Type to upload the file.');
          $('input[type="file"]').val(null);
        }
      }*/
      /*if(selectedDataDesc ==='Service Reminder'){
        if(uploadColumn.bikeType !== undefined){
          uploadStatus = $window.confirm('Are you sure this is the file you want to upload?');
          $('input[type="file"]').val(null);
        }
      }*/
      if(selectedServiceCenter !==undefined && selectedDataType !== undefined){
         uploadStatus = $window.confirm('Are you sure this is the file you want to upload?');
      }

      if(uploadStatus === true){
        $timeout(function() {
        if(selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack' && selectedDataDesc !=='Extended Warranty' && selectedDataDesc !=='Insurance Job Card'){
          $('#uploadDataMapping').show();
          $('#uploadDataMappingForServiceRemainder').hide();
          $('#uploadDataMappingForSalesFeedback').hide();
          $('#uploadDataMappingExtendedWarranty').hide();
          $('#uploadDataMappingInsurance').hide();
          $('html, body').animate({
            'scrollTop' : $("#uploadDataMapping").position().top
          });
        }
       else if(selectedDataDesc ==='Service Reminder' || selectedDataDesc ==='Service Remainder'){
         // $scope.MappingForServiceRemainder = true;
          $('#uploadDataMappingForServiceRemainder').show();
          $('#uploadDataMappingForSalesFeedback').hide();
          $('#uploadDataMapping').hide();
          $('#uploadDataMappingExtendedWarranty').hide();
          $('#uploadDataMappingInsurance').hide();
          $('html, body').animate({
            'scrollTop' : $("#uploadDataMappingForServiceRemainder").position().top
          });
        }
          else if(selectedDataDesc ==='Sales FeedBack'){
            // $scope.MappingForServiceRemainder = true;
            $('#uploadDataMappingForSalesFeedback').show();
            $('#uploadDataMappingForServiceRemainder').hide();
            $('#uploadDataMapping').hide();
            $('#uploadDataMappingExtendedWarranty').hide();
            $('#uploadDataMappingInsurance').hide();
            $('html, body').animate({
              'scrollTop' : $("#uploadDataMappingForSalesFeedback").position().top
            });
          }
          else if(selectedDataDesc ==='Extended Warranty'){
            // $scope.MappingForServiceRemainder = true;
            $('#uploadDataMappingExtendedWarranty').show();
            $('#uploadDataMappingForSalesFeedback').hide();
            $('#uploadDataMappingForServiceRemainder').hide();
            $('#uploadDataMapping').hide();
            $('#uploadDataMappingInsurance').hide();
            $('html, body').animate({
              'scrollTop' : $("#uploadDataMappingExtendedWarranty").position().top
            });
          }
          else if(selectedDataDesc ==='Insurance Job Card'){
            // $scope.MappingForServiceRemainder = true;
            $('#uploadDataMappingExtendedWarranty').hide();
            $('#uploadDataMappingForSalesFeedback').hide();
            $('#uploadDataMappingForServiceRemainder').hide();
            $('#uploadDataMapping').hide();
            $('#uploadDataMappingInsurance').show();
            $('html, body').animate({
              'scrollTop' : $("#uploadDataMappingInsurance").position().top
            });
          }
          
        }, 1000);
        //getUploadedFileColumnNames();

        //$scope.loading = true;
        // Get The File From The Input
        var oFile = oEvent.target.files[0];
        //console.log('oFile',oFile);
        var sFilename = oFile.name;
        //selectedFileName = sFilename;

        /*if(selectedFileName !== $rootScope.selectedFileName){
          $window.alert('The Selected File is not matching. Kindly select the same file you have uploaded.');
          $('#uploadDataMapping').hide();
          $('#uploadDataMappingForServiceRemainder').hide();
          $('#uploadDataMappingForSalesFeedback').hide();
          $('input[type="file"]').val(null);
        }*/

        // Create A File Reader HTML5
        console.log(sFilename.substr(-5));
        if(sFilename.substr(-4) !== '.xls') {/*&& sFilename.substr(-5) !== '.xlsx'*/
          $window.alert('Only .xls file format is allowed');
          $('#uploadDataMapping').hide();
          $('#uploadDataMappingForServiceRemainder').hide();
          $('#uploadDataMappingForSalesFeedback').hide();
          $('#uploadDataMappingExtendedWarranty').hide();
          $('#uploadDataMappingInsurance').hide();
        }
        var reader = new FileReader();

        // Ready The Event For When A File Gets Selected
        reader.onload = function(e) {
          var data = e.target.result;
          var cfb = XLS.CFB.read(data, {type: 'binary'});
          var wb = XLS.parse_xlscfb(cfb);
        //  console.log('cfb',cfb);
          //console.log('wb',wb);
          // Loop Over Each Sheet
          wb.SheetNames.forEach(function(sheetName) {
            // Obtain The Current Row As CSV
            //var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
          //console.log('file ',new CSVReader(new FileReader(sheetName)));
            var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
            console.log('oJS',oJS);

            /* angular.element(document.querySelector('#my_file_output')).html(sCSV);*/
           // console.log(oJS);
           // $scope.loading = true;
           // console.log(oJS.length);
            if( oJS.length > 0 ){
              teleCallerXlToJson = oJS;
              /*mapping uploaded file column start*/
             /* angular.forEach( teleCallerXlToJson[0], function (v, k) {
                $scope.loadingMapData = true;
                if(k !== 'undefined'){
                  fileColumnNames.push(k);
                }
              });*/
              for(var k1 = 0; k1 < teleCallerXlToJson.length; k1++) {
                angular.forEach(teleCallerXlToJson[k1], function (v, k) {
                    fileColumnNames.push(k);
                });
              }
              var columnMatch;
              // console.log('all column names : ',fileColumnNames);
              var uniqueColumns=[];
              var filteredColumns = function(ele, index, array){
                columnMatch = array[index];
                for(var index in uniqueColumns){
                  if(uniqueColumns[index] === columnMatch)
                    return true;
                }
                uniqueColumns.push(columnMatch);
              };
              fileColumnNames.forEach(filteredColumns);
              //console.log(uniqueColumns);
              $scope.uploadedFileColumnNames = uniqueColumns;
              console.log('column names: ',$scope.uploadedFileColumnNames);

            }
          });
        };

        // Tell JS To Start Reading The File.. You could delay this if desired
        reader.readAsBinaryString(oFile);

      }else{
        $scope.loading = false;
        console.log('File Cancelled!');
        $('input[type="file"]').val(null);
      }

    }


    /*function getUploadedFileColumnNames() {
      $scope.uploadedFileColumnNames = fileColumnNames;
      $scope.loading = false;
    }*/


    /*Date Format while uploading Data*/
    $scope.dateFormat = ['yyyy/mm/dd','mm/dd/yyyy','dd/mm/yyyy'];

    /*mapping data start*/
    var uploadedServiceDueDate;
    $scope.mapUplodedData = function (mappedColumn) {
        /*$('#xlsUploadDiv').show();
        $('#xlsButtonDiv').hide();
        $scope.xlsRequest = {xlsFile :'null'};*/
      //console.log('column',mappedColumn);
      uploadedServiceDueDate = mappedColumn.serviceDueDate;
      if(mappedColumn){
        var teleCallerFilteredXlData = [];
        var teleCallerValidationOutput = teleCallerXlValidateSheet();
        if(teleCallerValidationOutput === true) {
          for(var m1 = 0; m1 < teleCallerXlToJson.length; m1++) {
            teleCallerXlInvalidDateFlag = false ;
            var teleCallerXlRowObj = {};
            var teleCallerXlRowObjToUploadJobcardData = {};
            var teleCallerXlRowObjToUploadServiceReminderData = {};
            var teleCallerXlRowObjToUploadSalesFeedbackData = {};
            var teleCallerXlRowObjToUploadExtendedWarrantyData = {};
            var teleCallerXlRowObjToUploadInsuranceData = {};

            teleCallerXlRowObj.model = teleCallerXlToJson[m1][mappedColumn.model];
            teleCallerXlRowObj.chassisNo = teleCallerXlToJson[m1][mappedColumn.chassisNo];
            teleCallerXlRowObj.registrationNo = teleCallerXlToJson[m1][mappedColumn.regNo];
            teleCallerXlRowObj.customerName = teleCallerXlToJson[m1][mappedColumn.customerName ];
            teleCallerXlRowObj.addressDetail = teleCallerXlToJson[m1][mappedColumn.address];
            teleCallerXlRowObj.mobile = teleCallerXlToJson[m1][mappedColumn.mobile];
            teleCallerXlRowObj.presentServiceDueType = teleCallerXlToJson[m1][mappedColumn.serviceDueType];
            teleCallerXlRowObj.serviceAvailedAt = teleCallerXlToJson[m1][mappedColumn.serviceAvailedAt];
            teleCallerXlRowObj.lastServiceType = teleCallerXlToJson[m1][mappedColumn.lastServiceType];
            teleCallerXlRowObj.lastServiceKM = teleCallerXlToJson[m1][mappedColumn.lastServiceKm];
            teleCallerXlRowObj.dateOfSale = teleCallerXlToJson[m1][mappedColumn.dateOfSale];
            teleCallerXlRowObj.lastServiceDate = teleCallerXlToJson[m1][mappedColumn.lastServiceDate];
          if(selectedDataType === '5' && adminUserScId !=='58'){
            teleCallerXlRowObj.validFrom = teleCallerXlToJson[m1][mappedColumn.validFrom];
            teleCallerXlRowObj.validTo = teleCallerXlToJson[m1][mappedColumn.validTo];
          }
           if(selectedDataType === '4'){
              teleCallerXlRowObj.presentServiceDueDate = teleCallerXlToJson[m1][mappedColumn.serviceDate];
            }
            else if(selectedDataType !== '4'){
              teleCallerXlRowObj.presentServiceDueDate = teleCallerXlToJson[m1][mappedColumn.serviceDueDate];
            }
            teleCallerXlRowObj.serviceAvailedDate = teleCallerXlToJson[m1][mappedColumn.serviceAvailedDate];
            teleCallerXlRowObj.dateFormat = mappedColumn.dateFormat;
            teleCallerXlRowObj.version = loggedInVersionCode;

            teleCallerXlRowObj.amcCount = selectedAMCCount;
            teleCallerXlRowObj.validMonth = selectedValidMonth;

            teleCallerXlRowObj.dealerId = adminUserScId;
            teleCallerXlRowObj.logInId = adminUserId;
            teleCallerXlRowObj.branchId = selectedServiceCenter;
            teleCallerXlRowObj.dataTypeId = selectedDataType;
            //teleCallerXlRowObj.xlsFilePath = xlsFilePath;

            teleCallerXlRowObjToUploadJobcardData.registrationNo = teleCallerXlToJson[m1][mappedColumn.regNo];
            teleCallerXlRowObjToUploadJobcardData.customerName = teleCallerXlToJson[m1][mappedColumn.customerName ];
            teleCallerXlRowObjToUploadJobcardData.mobile = teleCallerXlToJson[m1][mappedColumn.mobile];
            teleCallerXlRowObjToUploadJobcardData.serviceAmount = teleCallerXlToJson[m1][mappedColumn.serviceAmount];
            teleCallerXlRowObjToUploadJobcardData.serviceKm = teleCallerXlToJson[m1][mappedColumn.serviceKm];
            teleCallerXlRowObjToUploadJobcardData.advisorName = teleCallerXlToJson[m1][mappedColumn.advisorName];
            teleCallerXlRowObjToUploadJobcardData.jobCardNo = teleCallerXlToJson[m1][mappedColumn.jobCardNo];
            teleCallerXlRowObjToUploadJobcardData.dateOfSale = teleCallerXlToJson[m1][mappedColumn.dateOfSale];

            teleCallerXlRowObjToUploadJobcardData.dealerId = adminUserScId;
            teleCallerXlRowObjToUploadJobcardData.branchId = selectedServiceCenter;
            teleCallerXlRowObjToUploadJobcardData.chassisNo = teleCallerXlToJson[m1][mappedColumn.chassisNo];
            teleCallerXlRowObjToUploadJobcardData.jobCardDate = teleCallerXlToJson[m1][mappedColumn.serviceDate];
            teleCallerXlRowObjToUploadJobcardData.bikeModel = teleCallerXlToJson[m1][mappedColumn.bikeModel];
            teleCallerXlRowObjToUploadJobcardData.serviceType = teleCallerXlToJson[m1][mappedColumn.serviceType];
            teleCallerXlRowObjToUploadJobcardData.bikeBrand = loginBrandName;
            teleCallerXlRowObjToUploadJobcardData.dateFormat = mappedColumn.dateFormat;
            teleCallerXlRowObjToUploadJobcardData.version = loggedInVersionCode;
            teleCallerXlRowObjToUploadJobcardData.mechanic = teleCallerXlToJson[m1][mappedColumn.mechanic];;

            //teleCallerXlRowObjToUploadJobcardData.dealerCode = teleCallerXlToJson[m1][mappedColumn.dealerCode];
            //teleCallerXlRowObjToUploadJobcardData.modelCode = teleCallerXlToJson[m1][mappedColumn.modelCode];
        
            teleCallerXlRowObjToUploadServiceReminderData.model = teleCallerXlToJson[m1][mappedColumn.model];
            teleCallerXlRowObjToUploadServiceReminderData.dateOfSale = teleCallerXlToJson[m1][mappedColumn.dateOfSale];
            teleCallerXlRowObjToUploadServiceReminderData.registrationNo = teleCallerXlToJson[m1][mappedColumn.regNo];
            teleCallerXlRowObjToUploadServiceReminderData.customerName = teleCallerXlToJson[m1][mappedColumn.customerName ];
            teleCallerXlRowObjToUploadServiceReminderData.mobile = teleCallerXlToJson[m1][mappedColumn.mobile];
            teleCallerXlRowObjToUploadServiceReminderData.addressDetail = teleCallerXlToJson[m1][mappedColumn.address];
            teleCallerXlRowObjToUploadServiceReminderData.dealerId = adminUserScId;
            teleCallerXlRowObjToUploadServiceReminderData.branchId = selectedServiceCenter;
            teleCallerXlRowObjToUploadServiceReminderData.logInId = adminUserId;
            teleCallerXlRowObjToUploadServiceReminderData.chassisNo = teleCallerXlToJson[m1][mappedColumn.chassisNo];
            teleCallerXlRowObjToUploadServiceReminderData.bikeType = selectedBikeType;
            teleCallerXlRowObjToUploadServiceReminderData.dataTypeId = selectedDataType;
            teleCallerXlRowObjToUploadServiceReminderData.dateFormat = mappedColumn.dateFormat;
            teleCallerXlRowObjToUploadServiceReminderData.version = loggedInVersionCode;
            //teleCallerXlRowObjToUploadServiceReminderData.xlsFilePath = xlsFilePath;

            teleCallerXlRowObjToUploadServiceReminderData.modelCode = teleCallerXlToJson[m1][mappedColumn.modelCode];
            teleCallerXlRowObjToUploadServiceReminderData.modelCodeAccess = $scope.loggedInModelCode;
        
            teleCallerXlRowObjToUploadSalesFeedbackData.model = teleCallerXlToJson[m1][mappedColumn.model];
            teleCallerXlRowObjToUploadSalesFeedbackData.dateOfSale = teleCallerXlToJson[m1][mappedColumn.dateOfSale];
            //  teleCallerXlRowObjToUploadServiceReminderData.registrationNo = teleCallerXlToJson[m1][mappedColumn.regNo];
            teleCallerXlRowObjToUploadSalesFeedbackData.customerName = teleCallerXlToJson[m1][mappedColumn.customerName ];
            teleCallerXlRowObjToUploadSalesFeedbackData.mobile = teleCallerXlToJson[m1][mappedColumn.mobile];
            teleCallerXlRowObjToUploadSalesFeedbackData.addressDetail = teleCallerXlToJson[m1][mappedColumn.address];
            teleCallerXlRowObjToUploadSalesFeedbackData.dealerId = adminUserScId;
            teleCallerXlRowObjToUploadSalesFeedbackData.branchId = selectedServiceCenter;
            teleCallerXlRowObjToUploadSalesFeedbackData.logInId = adminUserId;
            teleCallerXlRowObjToUploadSalesFeedbackData.chassisNo = teleCallerXlToJson[m1][mappedColumn.chassisNo];
            // teleCallerXlRowObjToUploadServiceReminderData.bikeType = selectedBikeType;
            teleCallerXlRowObjToUploadSalesFeedbackData.dataTypeId = selectedDataType;
            teleCallerXlRowObjToUploadSalesFeedbackData.dateFormat = mappedColumn.dateFormat;
            teleCallerXlRowObjToUploadSalesFeedbackData.version = loggedInVersionCode;
            //teleCallerXlRowObjToUploadSalesFeedbackData.xlsFilePath = xlsFilePath;
            
            teleCallerXlRowObjToUploadExtendedWarrantyData.model = teleCallerXlToJson[m1][mappedColumn.model];
            teleCallerXlRowObjToUploadExtendedWarrantyData.dateOfSale = teleCallerXlToJson[m1][mappedColumn.dateOfSale];
            teleCallerXlRowObjToUploadExtendedWarrantyData.customerName = teleCallerXlToJson[m1][mappedColumn.customerName ];
            teleCallerXlRowObjToUploadExtendedWarrantyData.mobile = teleCallerXlToJson[m1][mappedColumn.mobile];
            teleCallerXlRowObjToUploadExtendedWarrantyData.addressDetail = teleCallerXlToJson[m1][mappedColumn.address];
            teleCallerXlRowObjToUploadExtendedWarrantyData.dealerId = adminUserScId;
            teleCallerXlRowObjToUploadExtendedWarrantyData.branchId = selectedServiceCenter;
            teleCallerXlRowObjToUploadExtendedWarrantyData.logInId = adminUserId;
            teleCallerXlRowObjToUploadExtendedWarrantyData.chassisNo = teleCallerXlToJson[m1][mappedColumn.chassisNo];
            teleCallerXlRowObjToUploadExtendedWarrantyData.dataTypeId = selectedDataType;
            teleCallerXlRowObjToUploadExtendedWarrantyData.dateFormat = mappedColumn.dateFormat;
            teleCallerXlRowObjToUploadExtendedWarrantyData.version = loggedInVersionCode;
            teleCallerXlRowObjToUploadExtendedWarrantyData.phoneNumber = teleCallerXlToJson[m1][mappedColumn.mobileRes];
            teleCallerXlRowObjToUploadExtendedWarrantyData.startDate = teleCallerXlToJson[m1][mappedColumn.warrantyCommenceDate];
            teleCallerXlRowObjToUploadExtendedWarrantyData.expireDate = teleCallerXlToJson[m1][mappedColumn.warrantyExpiryDate];
            teleCallerXlRowObjToUploadExtendedWarrantyData.bikeNo = teleCallerXlToJson[m1][mappedColumn.regNo];
            teleCallerXlRowObjToUploadExtendedWarrantyData.dealerName = teleCallerXlToJson[m1][mappedColumn.dealerName];
            teleCallerXlRowObjToUploadExtendedWarrantyData.modelCode = teleCallerXlToJson[m1][mappedColumn.modelCode];
            
            teleCallerXlRowObjToUploadInsuranceData.customerName = teleCallerXlToJson[m1][mappedColumn.customerName ];
            teleCallerXlRowObjToUploadInsuranceData.dealerId = adminUserScId;
            teleCallerXlRowObjToUploadInsuranceData.branchId = selectedServiceCenter;
            teleCallerXlRowObjToUploadInsuranceData.logInId = adminUserId;
            teleCallerXlRowObjToUploadInsuranceData.chassisNo = teleCallerXlToJson[m1][mappedColumn.chassisNo];
            teleCallerXlRowObjToUploadInsuranceData.dataTypeId = selectedDataType;
            teleCallerXlRowObjToUploadInsuranceData.dateFormat = mappedColumn.dateFormat;
            //teleCallerXlRowObjToUploadInsuranceData.version = loggedInVersionCode;
            teleCallerXlRowObjToUploadInsuranceData.policyNo = teleCallerXlToJson[m1][mappedColumn.policyNo];
            teleCallerXlRowObjToUploadInsuranceData.policyStartDate = teleCallerXlToJson[m1][mappedColumn.policyStartDate];
            teleCallerXlRowObjToUploadInsuranceData.policyEndDate = teleCallerXlToJson[m1][mappedColumn.policyEndDate];
            teleCallerXlRowObjToUploadInsuranceData.bikeNo = teleCallerXlToJson[m1][mappedColumn.bikeNo];
            teleCallerXlRowObjToUploadInsuranceData.totalPremium = teleCallerXlToJson[m1][mappedColumn.totalPremium];
        
            if(selectedDataType !=='3' && selectedDataType !=='5' && (selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack' && selectedDataDesc !=='Extended Warranty' && selectedDataDesc !=='Insurance Job Card')){
              teleCallerFilteredXlData.push(teleCallerXlRowObj);
            }else if(selectedDataType ==='3'){
              teleCallerFilteredXlData.push(teleCallerXlRowObjToUploadJobcardData);
            }
            else if(selectedDataDesc ==='Service Reminder' ||selectedDataDesc ==='Service Remainder'){
              teleCallerFilteredXlData.push(teleCallerXlRowObjToUploadServiceReminderData);
            }
            else if(selectedDataDesc ==='Sales FeedBack'){
              teleCallerFilteredXlData.push(teleCallerXlRowObjToUploadSalesFeedbackData);
            } else if(selectedDataType ==='5'){
              teleCallerFilteredXlData.push(teleCallerXlRowObj);
            } else if(selectedDataDesc ==='Extended Warranty'){
              teleCallerFilteredXlData.push(teleCallerXlRowObjToUploadExtendedWarrantyData);
            } else if(selectedDataDesc ==='Insurance Job Card'){
              teleCallerFilteredXlData.push(teleCallerXlRowObjToUploadInsuranceData);
            }
            // teleCallerFilteredXlData.push(teleCallerXlRowObj);
          }
         // console.log('test----',teleCallerFilteredXlData);

          if(!$scope.csvUploadStatus){
            if(selectedDataType !=='3' && selectedDataType !=='5' && (selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack' && selectedDataDesc !=='Extended Warranty' && selectedDataDesc !=='Insurance Job Card')){
              uploadTelecallerData(teleCallerFilteredXlData);
            }else if(selectedDataType ==='3'){
              uploadTelecallerJobcardData(teleCallerFilteredXlData);
            } else if(selectedDataDesc ==='Service Reminder' || selectedDataDesc ==='Service Remainder'){
              uploadTelecallerServiceReminderData(teleCallerFilteredXlData);
            } else if(selectedDataDesc ==='Sales FeedBack'){
              uploadTelecallerSalesFeedbackData(teleCallerFilteredXlData);
            } else if(selectedDataType ==='5' && adminUserScId === '58'){
              uploadTelecallerAMCData(teleCallerFilteredXlData);
            }  else if(selectedDataType === '5' && adminUserScId !=='58'){
               uploadTelecallerAMCDataForUtility(teleCallerFilteredXlData);
            } else if(selectedDataDesc ==='Extended Warranty'){
              uploadTelecallerExtendedWarrantyData(teleCallerFilteredXlData);
            } else if(selectedDataDesc ==='Insurance Job Card'){
              uploadTelecallerInsuranceData(teleCallerFilteredXlData);
            }
          }

          /*if(selectedDataType !=='3' && selectedDataType !=='5' && (selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack')){
            uploadTelecallerData(teleCallerFilteredXlData);
          }else if(selectedDataType ==='3'){
            uploadTelecallerJobcardData(teleCallerFilteredXlData);
          } else if(selectedDataDesc ==='Service Reminder' || selectedDataDesc ==='Service Remainder'){
            uploadTelecallerServiceReminderData(teleCallerFilteredXlData);
          } else if(selectedDataDesc ==='Sales FeedBack'){
            uploadTelecallerSalesFeedbackData(teleCallerFilteredXlData);
          }else if(selectedDataType ==='5'){
            uploadTelecallerAMCData(teleCallerFilteredXlData);
          }*/

          if($scope.csvUploadStatus){
            if(selectedDataType !=='3' && selectedDataType !=='5' && (selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack' && selectedDataDesc !=='Insurance Job Card')){
              uploadTelecallerRegularData(teleCallerFilteredXlData);
            } else if(selectedDataType ==='5' && adminUserScId === '58'){
              uploadTelecallerAMCData(teleCallerFilteredXlData);
            } else if(selectedDataType === '5' && adminUserScId !=='58'){
               uploadTelecallerAMCDataForUtility(teleCallerFilteredXlData);
            } else if(selectedDataDesc ==='Insurance Job Card'){
              uploadTelecallerInsuranceData(teleCallerFilteredXlData);
            }
          }

        } else {
          $scope.loading = false;
          $window.alert(teleCallerXlErrorMsg);
          $window.location.reload();
        }
      }



    };
    /*mapping data end*/
    var fileUploadSuccessMsg = 'Data is uploading...Kindly wait for 15 minutes to reflect in dashboard..!';

    function uploadTelecallerData(uploadDataInput) {
      //console.log('regular data request :',uploadDataInput);
      console.log(JSON.stringify(uploadDataInput));
      $scope.loading = true;
      $scope.loadingMapping = true;
      $scope.uploadColumn = {};
      $scope.MapUploadDataForm.$setPristine();
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerExcelUploadService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
         // console.log('upload response regular data :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
          console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error); 
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
        $scope.loadingMapping = false;
        $('#uploadDataMapping').hide();
        $('input[type="file"]').val(null);
        }, 3000);
    }

    function uploadTelecallerJobcardData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      //console.log('jobcard request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
     console.log(JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadJobcardDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
       // $window.alert(data.message);
        //  console.log('upload response jobcard :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
          console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
          $scope.loadingMapping = false;
          $('#uploadDataMapping').hide();
          $('input[type="file"]').val(null);
        }, 3000);
    }


    function uploadTelecallerServiceReminderData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
     //console.log('service reminder request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
       console.log(JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadServiceReminderDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
         console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
        $scope.loadingMapping = false;
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        }, 3000);
    }

    function uploadTelecallerSalesFeedbackData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      //console.log('service reminder request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadSalesFeedbackDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
         // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
        $scope.loadingMapping = false;
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        }, 3000);
    }

    function uploadTelecallerAMCData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      console.log('AMC Data request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadAMCDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
        $scope.loadingMapping = false;
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        }, 3000);
    }

    function uploadTelecallerAMCDataForUtility(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      console.log('AMC Data Utility request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log('Utility',JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadAMCDataUtilityService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
        $scope.loadingMapping = false;
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        }, 3000);
    }


    function uploadTelecallerExtendedWarrantyData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      console.log('Extended Warranty Data request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log('Extended Warranty :  :',JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadExtendedWarrantyDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
        $scope.loadingMapping = false;
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        }, 3000);
    }

    function uploadTelecallerRegularData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      console.log('AMC Data request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(uploadDataInput));
      TeleCallerCSVUploadRegularDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
        $scope.loadingMapping = false;
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        }, 3000);
    }


    function uploadTelecallerInsuranceData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      console.log('Insurance Data  request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log('Insurance',JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadInsuranceDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
        console.log('upload response Insurance :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
          $scope.loading = false;
        $scope.loadingMapping = false;
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('#uploadDataMappingExtendedWarranty').hide();
        $('#uploadDataMappingInsurance').hide();
        $('input[type="file"]').val(null);
        }, 3000);
    }

    function teleCallerXlValidateSheet() {
      angular.forEach( teleCallerXlToJson, function (indexOfObj) {
        angular.forEach( indexOfObj, function (v, k) {
       //  delete indexOfObj[k];
         //indexOfObj[ k.replace(/\s/g, '').toLowerCase() ] = v.trim();
        });
      });
      var teleCallerXlKeyvalues = ['customername', 'mobile', 'serviceduedate'];
      /*-- valid column name--*/
      if(teleCallerXlToJson !== undefined || teleCallerXlToJson !== null || teleCallerXlToJson !== []){
        for(var pos = 0; pos < teleCallerXlToJson.length; pos++) {
          var teleCallerXlKeysArray = [];
          teleCallerXlKeysArray = Object.keys( teleCallerXlToJson[pos] );
          if(teleCallerXlKeysArray !== undefined || teleCallerXlKeysArray !== null || teleCallerXlKeysArray !== []){
            /*if( !teleCallerXlKeysArray.containsArray( teleCallerXlKeyvalues )) {
              teleCallerXlErrorRowNum = pos + 1 ;
              teleCallerXlErrorMsg = ' Either Column Name does not matches with the given format or Value is Empty for mandatory fields at row ' + (teleCallerXlErrorRowNum + 1) +
                ' . Column name should be these - Customer Name, Address, Mobile, Model, Chassis No, Registration No, Date Of Sale,' +
                ' Service Due Type, Service Due Date, Service Availed At, Service Availed Date, Last Service Type, Last Service Date, Last Service KM ';
              return false;
            }*/
          }

        }
      }



      for(var l1 = 0; l1 < teleCallerXlToJson.length; l1++){

        /*-- mandatory field value, mobile length,serviceType value, assistanceType value validation--*/
        var obj = teleCallerXlToJson[l1];
       /* if(selectedDataType !=='3'){
          //console.log('uploading other than jobcard data');
          if(teleCallerIsEmptyStr(obj[uploadedServiceDueDate],'Service Due Date') ) {
            teleCallerXlErrorRowNum = l1 + 1 ;
            teleCallerXlErrorMsg = ' Some mandatory fields are empty in your sheet at row ' + (teleCallerXlErrorRowNum + 1) + ' .';
            return false;
          } /!*else if( obj.mobile.length!==10 || (!/^\d+$/.test( obj.mobile )) ) {
            teleCallerXlErrorRowNum = l1 + 1 ;
            teleCallerXlErrorMsg = ' Kindly enter a 10 digit valid mobile number at row ' + (teleCallerXlErrorRowNum + 1) + ' .';
            return false;
          }*!/
        }*//*else if(selectedDataType ==='3'){
          console.log('uploading jobcard data');
          if(teleCallerIsEmptyStr(obj.chassisno,'Chassis No.') || teleCallerIsEmptyStr(obj.serviceduedate,'Service Due Date') ) {
            teleCallerXlErrorRowNum = l1 + 1 ;
            teleCallerXlErrorMsg = ' Some mandatory fields are empty in your sheet at row ' + (teleCallerXlErrorRowNum + 1) + ' .';
            return false;
          }
        }*/

      }
      return true;
    }

//validate sheet ends

    function teleCallerIsEmptyStr ( str,strName) {
     // console.log(str);
     /* if(!str || str === undefined){
          $window.alert('Empty row/column '+strName+' in the sheet.');
      }
      return (str === null || !str.trim() );*/
    }

    Array.prototype.containsArray = function ( array) {
      var indexPos, lastPos;
      if( arguments[1] ) {
        indexPos = arguments[1]; lastPos = arguments[2];
      } else {
        indexPos = 0; lastPos = 0;
        this.sort(); array.sort();
      }
      return indexPos === array.length ||
        ( lastPos = this.indexOf( array[indexPos], lastPos ) ) > -1 &&
        this.containsArray( array, ++indexPos, ++lastPos );
    };




    $scope.dismissFeedbackPage = function () {
      $scope.feedbackDetailStatus = false;
    };

    $scope.getFeedbackList = function (status,feedbackListId) {
      selStatus = status;
      selectedFeedbackListId = feedbackListId;
      getTcAdminStatsDetail(selFromDatedata,selToDateData,selStatus,selSubStatus,selSeviceCenter,selDataType,selCaller,selExport,selectedFeedbackListId);
    };



    $scope.amcCounts = [{'count':'1'},{'count':'2'},{'count':'3'}];
    $scope.validMonths = [{'id':'1', 'month':'Jan'},{'id':'2','month':'Feb'},{'id':'3','month':'March'},{'id':'4','month':'April'},{'id':'5','month':'May'},
      {'id':'6','month':'June'},{'id':'7','month':'July'},{'id':'8','month':'August'},{'id':'9','month':'Sept'},
      {'id':'10','month':'Oct'},{'id':'11','month':'Nov'},{'id':'12','month':'Dec'}];


    $scope.csvFileRequest = {};
    var csvObject = {};
   // var csvServiceReminderObject = {};
    $scope.uploadCsvFile = function (fileUrl) {
      console.log('File Path : ',fileUrl);
      csvObject = {
        dealerId : adminUserScId,
        logInId : adminUserId,
        branchId : selectedServiceCenter,
        dataTypeId : selectedDataType,
        version : loggedInVersionCode,
        bikeType : selectedBikeType,
        brandName: loginBrandName,
        filePath : fileUrl
      };
      //$scope.csvFileRequest = {};
     // $scope.uploadCSVForm.$setPristine();

     // console.log('csv File Object',csvServiceReminderObject);
      console.log('csv File Object',JSON.stringify(csvObject));
     if(selectedDataDesc ==='Service Reminder' || selectedDataDesc ==='Service Remainder'){
       $scope.csvFileRequest = {};
       $scope.selectedServiceCenterForUpload = null;
       $scope.selectedDataTypeDesc = undefined;
       uploadTelecallerServiceReminderCSVData(csvObject);
      }else if(selectedDataType ==='3'){
       $scope.csvFileRequest = {};
       $scope.selectedServiceCenterForUpload = null;
       $scope.selectedDataTypeDesc = undefined;
       uploadTelecallerJobCardCSVData(csvObject);
     }

    };


    function uploadTelecallerServiceReminderCSVData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      //console.log('service reminder CSV request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(uploadDataInput));
      TeleCallerCSVUploadServiceReminderDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        console.log('csv upload resp',data);
        //$window.alert(data.message);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
           $scope.loading = false;
        }, 3000);
    }

    function uploadTelecallerJobCardCSVData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      //$scope.csvFileRequest = {};
      //$scope.uploadCSVForm.$setPristine();
      //console.log('service reminder CSV request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(uploadDataInput));
      TeleCallerCSVUploadJobCardDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        //$window.alert(data.message);
        //console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
      $timeout(function() {
          $window.alert(fileUploadSuccessMsg);
           $scope.loading = false;
        }, 3000);
    }

   //$scope.fileUploadStatus = true;
   $scope.xlsFileRequest = {};
   $('#xlsButtonDiv').hide();
   var xlsFilePath;
   $scope.uploadXLSFile = function (file) {
    //console.log($rootScope.selectedFileName);
    console.log('XLS File Path :::',file);
    xlsFilePath = file;
    $('#xlsUploadDiv').hide();
    $('#xlsButtonDiv').show();
    //$scope.xlsRequest = {xlsFile :true};
   }

  });
