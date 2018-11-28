

'use strict';

angular.module('letsService')
  .controller('TCManageController', function ($scope,$window,$http,$cookies,$timeout,$state,TokenService,CreateTeleCallerService,TeleCallerWiseServiceCenterService, GetCallerService, ManageCallerService,AssignCallerService,TeleCallerStatusService,TeleCallerDataTypeService,GetScWiseTeleCallerService,UpdateTelecallingTargetService) {

    /*var adminUserId = $window.sessionStorage.getItem('loggedInUserId');
    var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');
    var adminUserRole = $window.sessionStorage.getItem('loggedInUserRole');*/

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var adminUserRole = $cookies.get('loggedInUserRole');

    function getServiceCenterTeleCallerWise() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
       // console.log('hi',data);
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise();

/*
    $scope.getServiceCenterTeleCallerWise = function(callerId) {
      console.log('callerId :',callerId);
      var lsToken = TokenService.getToken(adminUserScId);
      GetCallerWiseServiceCenterService.query({callerId:callerId,id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
        // console.log('hi',data);
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    };*/



    $scope.createTeleCaller = function (callerData) {
      $scope.callerCreateMsg = '';
      $scope.callerCreateErrorMsg ='';
      var lsToken = TokenService.getToken(adminUserScId);
      var serviceCenters = [];
      var selectedServiceCenters = callerData.selectedServiceCenter;
      for(var count=0;count < selectedServiceCenters.length;count++){
        serviceCenters.push(selectedServiceCenters[count]);
      }
      var callData = {
        username: callerData.username,
        password: callerData.password,
        mobile: callerData.mobile,
        role: adminUserRole,
        adminId: adminUserId,
        branchIds:serviceCenters.toString(),
        scId: adminUserScId
      };
       console.log(callData);
      $scope.createTellecaller = {};
      $scope.createTelecallerForm.$setPristine();
      $scope.callerCreateMsg = false;
      CreateTeleCallerService.save({id:adminUserScId,token:lsToken}, callData, function (data) {
        $scope.callerCreateMessageAlert = false;
        $scope.callerCreateErrorMessageAlert = false;
        console.log(data);
        $scope.callerCreateMsg = ' Username : ' + data.Username+  '   Password : ' + data.Password;
        $scope.callerCreateErrorMsg = '';
        $timeout(function() {
          $scope.callerCreateMessageAlert = true;
        }, 3000);
      }, function (err) {
        console.log(err);
        $scope.callerCreateErrorMsg = err.data.message;
        $timeout(function() {
          $scope.callerCreateErrorMessageAlert = true;
        }, 3000);
      });
    };


    function getCaller() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetCallerService.query({scId:adminUserScId,token:lsToken}, function (data) {
        $scope.saasCaller = data;
      }, function (err) {
        console.log(err);
      });
    }

    getCaller();


    $scope.updateCallerStatus = function (caller) {
      var updateStatus, updateStatusMsg;
      if(caller.status === 'active') {
        updateStatus = 'inactive';
        updateStatusMsg = 'Are you sure you want to deactivate caller ' + caller.username;
      } else if (caller.status === 'inactive') {
        updateStatus = 'active';
        updateStatusMsg = 'Are you sure you want to activate caller ' + caller.username;
      } else {
      }
      var confirmUpdation = $window.confirm(updateStatusMsg);
      if(confirmUpdation) {
        var callerData = {
          status: updateStatus,
          callerId: caller.loginId,
          adminId: adminUserId,
          scId: adminUserScId
        };
        var id = parseInt(Math.random() * 100);
        var lsToken = TokenService.getToken(id);
        ManageCallerService.save({id:id,token:lsToken}, callerData, function (data) {
          $window.alert(data.message);
          getCaller();
        }, function (err) {
          console.log(err);
        });
      }
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
        //$scope.teleCallingStatus= data;
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

    /*function getDataTypes() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerDataTypeService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.dataTypes = data;
      }, function (err) {
        $scope.datatypeErrorMsg = err.data.message;
      });
    }
    getDataTypes();*/

    /*function getScWiseCallerList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.callerList = data;
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }
    getScWiseCallerList();*/

    var adminSelectedFromDate;
    var adminSelectedToDate;

    function updateTeleCallingTarget(targetData) {
      $scope.loading = true;
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateTelecallingTargetService.save({id:adminUserScId,token:lsToken},targetData,function (data) {
        $window.alert(data.message);
        $scope.updateTelecallerTargetMsg = data.message;
        $scope.loading = false;
      }, function (err) {
        $scope.updateTelecallerTargetErrorMsg = err.data.message;
      });
    }

    var selectedServiceCenterNames = [];
    var selectedDataTypeNames = [];
    var selectedCallerNames = [];

    $scope.teleCallingAssignTarget = function(tcData) {
        var serviceCentersToAssign = [];
        var dataTypesToAssign = [];
        var targetData = {
         /* status : tcData.selectedStatus,*/
          adminId: adminUserId,
          branchId: selectedServiceCenter.toString() ,
          dataTypeId:selectedDataType.toString() ,
          callerId: selectedCaller.toString(),
         /* branchName: selectedServiceCenterNames.toString(),
          dataTypeName: selectedDataTypeNames.toString(),
          callerName: selectedCallerNames.toString(),*/
          scId: adminUserScId
        };
        console.log(JSON.stringify(targetData));
        updateTeleCallingTarget(targetData);
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
    }
    getServiceCenterToAssign();

    var selectedServiceCenter = [];

    $scope.updateTCServiceCenter = {
      onItemSelect: function(item) {
        selectedServiceCenter.push(parseInt(item.id));
       // console.log(selectedServiceCenter.toString());
      },
      onItemDeselect: function(item) {
        var updateSelectedServiceCenter = selectedServiceCenter.indexOf(parseInt(item.id));
        selectedServiceCenter.splice(updateSelectedServiceCenter,1);
       // console.log(updateSelectedServiceCenter.toString());
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
        //console.log(selectedDataType.toString());
      },
      onItemDeselect: function(item) {
        var updateSelectedDataType = selectedDataType.indexOf(parseInt(item.id));
        selectedDataType.splice(updateSelectedDataType,1);
       // console.log(selectedDataType.toString());
      }
    };
    $scope.resetAssignDataType = function() {
      $scope.manageDataType = [];
      selectedDataType = [];
    };

    $scope.resetAssignDataType();

    /*end*/


    $scope.teleCallerDataCallerData = [];
    $scope.manageCallerSettings = {displayProp: 'label'};
    var  selectedCaller = [];


    function getScWiseCallerList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.callerList = data;
        console.log('callerList',data);
        angular.forEach(data, function(val) {
          $scope.teleCallerDataCallerData.push({id:val.loginId,label:val.username,slNo:val.slNo});
        });
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }
    getScWiseCallerList();



    $scope.updateTCCaller = {
      onItemSelect: function(item) {
        selectedCaller.push(parseInt(item.id));
        //console.log(selectedDataType.toString());
      },
      onItemDeselect: function(item) {
        var updateSelectedCaller = selectedCaller.indexOf(parseInt(item.id));
        selectedCaller.splice(updateSelectedCaller,1);
        // console.log(selectedDataType.toString());
      }
    };
    $scope.resetAssignCaller = function() {
      $scope.manageCaller = [];
      selectedCaller = [];
    };
    $scope.resetAssignCaller();




    $scope.deAssignCallingData = function() {
      //console.log(selectedServiceCenter);
     // console.log(selectedDataType);

    /*  for(var s=0; s < selectedServiceCenter.length;s++){
        selectedServiceCenterNames.push($scope.teleCallerServiceCenterData[s].label);
      }
      for(var d=0; d < selectedDataType.length;d++){
        selectedDataTypeNames.push($scope.teleCallerDataTypeData[d].label);
      }
      for(var c=0; c < selectedCaller.length;c++){
        selectedCallerNames.push($scope.teleCallerDataCallerData[c].label);
      }

      console.log('service centres',selectedServiceCenterNames);
      console.log('data types',selectedDataTypeNames);
      console.log('callers ',selectedCallerNames);
    */
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

  });
