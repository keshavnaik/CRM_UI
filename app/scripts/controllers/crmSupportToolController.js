'use strict';

angular.module('letsService')
  .controller('CrmSupportToolController', function ($scope,$http,$filter,$timeout,serviceURL,$state,$window,TokenService,GetSuperAdminDealerListService,SupportToolService,TeleCallerWiseServiceCenterService,GetScWiseTeleCallerService,UpdateDealerRenevalAndExpiryService,AdminProfileInformation,GetSuperAdminListService,GetSMSTemplateLableListService,GetSmsTemplateAccessBranchListService,GetSupportBranchDetailsService,GetSupportUserListService) {
 
   var supportLoginId = $window.sessionStorage.getItem('loggedInSupportId');
   var supportRole = $window.sessionStorage.getItem('loggedInSupportRole');
   var supportMobile = $window.sessionStorage.getItem('loginMobile');
 
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

 //var adminUserId = '369';
 var adminUserId = supportLoginId;
 var adminUserIdSuper = '369';
 function getSuperAdminDealerList () {
      var lsToken = TokenService.getToken(adminUserIdSuper);
      GetSuperAdminDealerListService.query({logInId:adminUserIdSuper,token:lsToken}, function(data) {
        $scope.dealerList = data;
         angular.forEach(data, function(val) {
         $scope.dealerDataList.push({id:val.scId,label:val.scName,slNo:val.slNo});
       });
        console.log('dealerList +++',data);
      }, function(err) {
        $scope.dealerListErrorMsg = err.data.message;
      });
    }

  var selectedStatus;
  $scope.getSupportStatus = function(status){
      $scope.supportAccess = status;
      selectedStatus = status;
      if(status !== 'createDealer' && status !== 'clickToCall' && status !== 'updateExpiryDate'){
        getSuperAdminDealerList();
      }
      if(status === 'createDealer'){
         $window.open('https://letsserviceconnect.com/#/onboard','_blank');
      }
      if(status === 'updateExpiryDate'){
         getExpiryDealerList(adminUserId);
      }    
      if(selectedStatus === 'superadminupdate'){
       getSuperAdminUserList();
      }
      if(selectedStatus === 'addsmstemplate'){
       getLableList();
     }
     if(selectedStatus === 'assigndealer'){
       getSupportUserList();
     }
     if(status === 'dealerStats'){
         $window.open('https://letsserviceconnect.com/#/supportStats','_blank');
      }
    }

   $scope.dealerCheck = function(){
      console.log(selectedDealer);
     if(selectedDealer.length === 0){
       $scope.createSuperAdminForm.$invalid = true;
       $scope.assignDealersForm.$invalid = true;
     }
   }

   $scope.dealerDataList = [];
   $scope.manageDealerSettings = {displayProp: 'label'};
   var  selectedDealer = [];
   
  $scope.updateDealer = {
     onItemSelect: function(item) {
       selectedDealer.push(parseInt(item.id));
        if(selectedDealer.length > 0){
          $scope.createSuperAdminForm.$invalid = false;
          $scope.assignDealersForm.$invalid = false;
        }
    else if(selectedDealer.length === 0){
          $scope.createSuperAdminForm.$invalid = true;
          $scope.assignDealersForm.$invalid = true;
      }
     },
     onItemDeselect: function(item) {
       var updateSelectedCaller = selectedDealer.indexOf(parseInt(item.id));
       selectedDealer.splice(updateSelectedCaller,1);
        if(selectedDealer.length > 0){
          $scope.createSuperAdminForm.$invalid = false;
          $scope.assignDealersForm.$invalid = false;
        }
        else if(selectedDealer.length === 0){
          $scope.createSuperAdminForm.$invalid = true;
          $scope.assignDealersForm.$invalid = true;
        }
     }
   };

   $scope.resetDealer = function() {
     $scope.manageDealer = [];
     selectedDealer = [];
   };
   $scope.resetDealer();

  $scope.createSuperAdmin = function(obj) {
       var superAdminData = {
       	 username : obj.username,
       	 password : obj.password,
         scIds : selectedDealer.toString(),
         logInId : adminUserId,
         status : selectedStatus
       };
       console.log(JSON.stringify(superAdminData));
       submitSupportStatus(superAdminData);
   };

   $scope.getCsvAccess = function(obj){
   	var csvData = {
       	 yesno : obj.yesNo,
         scId : obj.selectedDealer,
         logInId : adminUserId,
         status : selectedStatus
       };
       console.log(JSON.stringify(csvData));
        $scope.csvObj = {};
        $scope.csvAccessForm.$setPristine();
       submitSupportStatus(csvData);
   }
   
   $scope.getOtpAccess = function(obj){
   	var otpData = {
       	 yesno : obj.yesNo,
         scId : obj.selectedDealer,
         logInId : adminUserId,
         status : selectedStatus
       };
       console.log(JSON.stringify(otpData));
        $scope.otpObj = {};
        $scope.otpAccessForm.$setPristine();
       submitSupportStatus(otpData);
   }

   $scope.getInsuranceAccess = function(obj){
   	var insuranceData = {
       	 yesno : obj.yesNo,
         scId : obj.selectedDealer,
         logInId : adminUserId,
         status : selectedStatus,
         callerId : obj.selectedCaller
       };

       console.log(JSON.stringify(insuranceData));
        $scope.insuranceObj = {};
        $scope.insuranceAccessForm.$setPristine();
       submitSupportStatus(insuranceData);
   }

   $scope.updateFreshCallDays = function(obj){
   	var freshCallData = {
   		   scId : obj.selectedDealer,
       	 days : obj.day,
       	 logInId : adminUserId,
         status : selectedStatus
       };
       console.log(JSON.stringify(freshCallData));
        $scope.freshCallObj = {};
        $scope.freshCallForm.$setPristine();
       submitSupportStatus(freshCallData);
   }

   $scope.updateCallerCount = function(obj){
   	var callerCountData = {
   		   scId : obj.selectedDealer,
       	 callerCount : obj.callerCount,
       	 logInId : adminUserId,
         status : selectedStatus
       };
       console.log(JSON.stringify(callerCountData));
        $scope.callerCountObj = {};
        $scope.callerCountForm.$setPristine();
       submitSupportStatus(callerCountData);
   }

   $scope.updateAdminDetails = function(obj){
   	 var adminDetails = {
   		   scId : obj.selectedDealer,
       	 email : obj.email,
       	 mobile: obj.mobile,
       	 logInId : adminUserId,
         status : selectedStatus
       };
       console.log(JSON.stringify(adminDetails));
       $scope.adminDetailObj = {};
       $scope.adminDetailForm.$setPristine();
       submitSupportStatus(adminDetails);
   }

    $scope.updateAdminBranchDetails = function(obj){
   	var adminBranchDetails = {
       branchName : $scope.selectedBranch,
   		 branchId : selectedBranchId,
   		 dealerCode : obj.dealerCode,
   		   scId : obj.selectedDealer,
       	 email : obj.email,
       	 mobile: obj.mobile,
       	 logInId : adminUserId,
         status : selectedStatus,
         opdId : obj.opdId
       };
       console.log(JSON.stringify(adminBranchDetails));
        $scope.adminBranchDetailObj = {};
        $scope.adminBranchDetailForm.$setPristine();
        submitSupportStatus(adminBranchDetails);
        $scope.selectedBranch = '';
   }

$scope.nDays = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30']

function submitSupportStatus(submitObj) {
     $scope.successMsg = '';
     var lsToken = TokenService.getToken(adminUserId);
     SupportToolService.save({id:adminUserId,token:lsToken},submitObj, function (data) {
       console.log('data::',data);
       if(selectedStatus !== 'adddays'){
          $window.alert(data.message);
       }
       $scope.successMsg = data.message;
     }, function (err) {
       console.log(err);
     });
   };

   var adminUserScId;
   $scope.getSelectedDealer = function (selDealer) {
      console.log(selDealer);
      adminUserScId = selDealer;
     getServiceCenterTeleCallerWise(adminUserScId);
     if(selectedStatus === 'insuranceaccess'){
        getScWiseCallerList(adminUserScId);
     }
      if(selectedStatus === 'updateRenevalDate' || selectedStatus === 'updateExpiryDate'){
       getAdminProfile(adminUserScId);
     }
     if(selectedStatus === 'deactivatecaller'){
       getScWiseCallerList(selDealer);
     }
     if(selectedStatus === 'smsaccess' || selectedStatus === 'addnewbranch'){
       getServiceCenterTeleCallerWise(selDealer);
     }
     if(selectedStatus === 'addsmstemplate'){
      if(currentStatus !== undefined && currentStatus !== null){
        getSmsTemplateAccessBranchList();
      }
     }
   };

   function getServiceCenterTeleCallerWise(id) {
      adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
        $scope.serviceCenter.values = $scope.serviceCenter;
        //console.log('hi',data);
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }

    function getScWiseCallerList(id) {
      adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.callerList = data;
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }


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
    
    function resetForm(msg){
      $window.alert(msg);
    }

    function getExpiryDealerList(id) {
      adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateDealerRenevalAndExpiryService.query({scId:adminUserScId,token:lsToken},function (data) {
        $scope.expiryDealerList = data;
        console.log('Expiry Dealer List::',$scope.expiryDealerList);
      }, function (err) {
        $scope.expiryDealerList = err.data.message;
      });
    }

    $scope.updateDealerExpiry = function(dealerObj){
     console.log(dealerObj);
      var selValidFromDate =  dealerObj.validFromDate.getFullYear() + '-' + (dealerObj.validFromDate.getMonth() + 1) + '-' + dealerObj.validFromDate.getDate();
      var selValidToDate =  dealerObj.validToDate.getFullYear() + '-' + (dealerObj.validToDate.getMonth() + 1) + '-' + dealerObj.validToDate.getDate();
     if(dealerObj.validFromDate > dealerObj.validToDate) {
        $window.alert('To Date should be greater than From Date');
      } else {
          var updateObj = {
      scId : dealerObj.selectedDealer,
      logInId : adminUserId,
      validFrom : selValidFromDate,
      validTo : selValidToDate,
      status : selectedStatus
     }
        console.log(JSON.stringify(updateObj));
        $scope.dealerObj = {};
        $scope.renevalExpiryForm.$setPristine();
        submitSupportStatus(updateObj);
        getExpiryDealerList(adminUserId);
      }
   
    }


    function getAdminProfile(id) {
      adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      AdminProfileInformation.query({scId:adminUserScId,token:lsToken}, function(data) {
        $scope.adminDetails = data[0];
        console.log('Profile :  :',data);
      }, function(err) {
        console.log("Error", err);
      });
    }
    

    $scope.updateDealerReneval = function(dealerObj){
      console.log(dealerObj);
      var selValidFromDate =  dealerObj.validFromDate.getFullYear() + '-' + (dealerObj.validFromDate.getMonth() + 1) + '-' + dealerObj.validFromDate.getDate();
      var selValidToDate =  dealerObj.validToDate.getFullYear() + '-' + (dealerObj.validToDate.getMonth() + 1) + '-' + dealerObj.validToDate.getDate();
      if(dealerObj.validFromDate > dealerObj.validToDate) {
        $window.alert('To Date should be greater than From Date');
      } else {
        var updateRenevalObj = {
      scId : dealerObj.selectedDealer,
      logInId : adminUserId,
      validFrom : selValidFromDate,
      validTo : selValidToDate,
      status : selectedStatus
     }
        console.log(JSON.stringify(updateRenevalObj));
        $scope.dealerRenevalObj = {};
        $scope.renevalForm.$setPristine();
        submitSupportStatus(updateRenevalObj);
      }
      
    }

    $scope.updateTicketDetails = function(ticketObj){
      var updateTicketObj = {
      scId : ticketObj.selectedDealer,
      logInId : adminUserId,
      email : ticketObj.email,
      status : selectedStatus
     }
      $scope.ticketObj = {};
      $scope.ticketDetailForm.$setPristine();
      console.log(JSON.stringify(updateTicketObj));
      submitSupportStatus(updateTicketObj);
    }

    $scope.deactivateCaller = function(callerObj){
     var updateCallerObj = {
      scId : callerObj.selectedDealer,
      logInId : adminUserId,
      callerId : callerObj.selectedCaller,
      status : selectedStatus
     }
      $scope.callerObj = {};
      $scope.deactivateCallerForm.$setPristine();
      console.log(JSON.stringify(updateCallerObj));
      submitSupportStatus(updateCallerObj);
    }

    $scope.deactivateDealer = function(dealerObj){
    var updateDealerObj = {
      scId : dealerObj.selectedDealer,
      logInId : adminUserId,
      callerId : dealerObj.selectedCaller,
      status : selectedStatus
     }
      $scope.dealerObj = {};
      $scope.deactivateDealerForm.$setPristine();
      console.log(JSON.stringify(updateDealerObj));
      submitSupportStatus(updateDealerObj);
      getSuperAdminDealerList();
    }

    function getSuperAdminUserList () {
      var lsToken = TokenService.getToken(adminUserId);
      GetSuperAdminListService.query({scId:adminUserId,token:lsToken}, function(data) {
        $scope.superAdminList = data;
        console.log('Super Admin User List +++',data);
      }, function(err) {
        $scope.superAdminListErrorMsg = err.data.message;
      });
    }

     $scope.updateSuperAdmin = function(obj) {
       var superAdminData = {
         logInId : adminUserId,
         superAdminId : obj.selectedSuperAdmin,
         newdealers : selectedDealer.toString(),
         status : selectedStatus
       };
       $scope.superAdminObj = {};
       $scope.createSuperAdminForm.$setPristine();
       console.log(JSON.stringify(superAdminData));
       submitSupportStatus(superAdminData);
   };

   $scope.updateModelCode = function(obj){
     var modelObj = {
         logInId : adminUserId,
         scId : obj.selectedDealer,
         yesno : obj.yesNo,
         status : selectedStatus
       };
       $scope.modelObj = {};
       $scope.updateModelCodeForm.$setPristine();
       console.log(JSON.stringify(modelObj));
       submitSupportStatus(modelObj);
   }

   $scope.teleCallingStatusForUpdate = [
      {'id': 2, 'description': 'Walkin'}, {'id': 3, 'description': 'Call Later'}];
   
    function getLableList () {
      var lsToken = TokenService.getToken(adminUserId);
      GetSMSTemplateLableListService.query({scId:adminUserId,token:lsToken}, function(data) {
        $scope.labelList = data;
        console.log('Lable List +++',data);
      }, function(err) {
        $scope.labelListErrorMsg = err.data.message;
      });
    }

    function getSmsTemplateAccessBranchList () {
      $scope.branchList = [];
      var lsToken = TokenService.getToken(adminUserId);
      GetSmsTemplateAccessBranchListService.query({scId:adminUserScId,status:currentStatus,loginId:adminUserId,token:lsToken}, function(data) {
        $scope.branchList = data;
        console.log('Branch List +++',data);
      }, function(err) {
        $scope.branchListErrorMsg = err.data.message;
      });
    }

    var currentStatus;
    $scope.getSelectedStatus = function(status){
      console.log(status);
      currentStatus = status;
      getSmsTemplateAccessBranchList();
    }

    $scope.trackMsg = function(){
     console.log($scope.scSMS.message);
    }
    
    var selectedLable;
    //var selectedLableVal;
    //var smsTemplate;
    $scope.getSelectedLable = function(lable){
      if(lable === undefined){
        lable = '';
      }
      console.log('lable',lable);
      selectedLable = lable;
      if($scope.scSMS !== undefined){
        //smsTemplate = $scope.scSMS.message+selectedLableVal;
        $scope.scSMS.message = $scope.scSMS.message+selectedLable; 
        console.log($scope.scSMS.message);
        //console.log('smsTemplate',smsTemplate);
      }
      else if($scope.scSMS === undefined){
        $scope.scSMS = {message: ''};
        $scope.scSMS.message = $scope.scSMS.message+selectedLable; 
      }
    }

    $scope.createSmsTemplate = function(obj){
      var dealerObj = {
         logInId : adminUserId,
         scId : obj.selectedDealer,
         smsstatus : obj.smsstatus,
         template : $scope.scSMS.message,
         smssubstatus : '',
         status : selectedStatus,
         action : 'create'
       };
       $scope.dealerObj = {};
       $scope.createSmsTemplateForm.$setPristine();
       $scope.scSMS = {message: ''};
       $scope.currentStatus = '';
       console.log(JSON.stringify(dealerObj));
       submitSupportStatus(dealerObj);
    }

    $scope.updateSmsTemplate = function(obj){
      var dealerObj = {
         logInId : adminUserId,
         scId : obj.selectedDealer,
         appointmentstatus : obj.smsstatus,
         smsstatus : obj.yesNo,
         status : selectedStatus,
         branchId : obj.selectedBranch.toString()
       };
       $scope.smsObj = {};
       $scope.updateSmsTemplateForm.$setPristine();
       console.log(JSON.stringify(dealerObj));
       submitSupportStatus(dealerObj);
    }

     $scope.clearUpdateMsg = function(){
      $scope.successMsg = '';
      $scope.crmRequest = {};
      $scope.addBranchObj = {};
      $scope.dateCalcObj = {};
      $scope.smsObj = {};
      $scope.dealerObj = {};
      $scope.modelObj = {};
      $scope.superAdminObj = {};
      $scope.callerObj = {};
      $scope.ticketObj = {};
      $scope.dealerRenevalObj = {};
      $scope.adminBranchDetailObj = {};
      $scope.adminDetailObj = {};
      $scope.callerCountObj = {};
      $scope.freshCallObj = {};
      $scope.insuranceObj = {};
      $scope.otpObj = {};
      $scope.csvObj = {};
     }
    
    $scope.addNewBranch = function(obj){
      var newBranchObj = {
         logInId : adminUserId,
         scId : obj.selectedDealer,
         status : selectedStatus,
         email : obj.email,
         mobileNo : obj.mobile,
         branchName : obj.selectedBranch,
         dealerCode : obj.dealerCode,
         opdId : obj.opdId || '0'
       };
       $scope.addBranchObj = {};
       $scope.addNewBranchForm.$setPristine();
       console.log(JSON.stringify(newBranchObj));
       submitSupportStatus(newBranchObj);
    }

    $scope.getDateCalculator = function(obj){
      var selDate = obj.date.getFullYear() + '-' + (obj.date.getMonth() + 1) + '-' + obj.date.getDate();
       var dateCalcObj = {
         logInId : adminUserId,
         status : selectedStatus,
         dateofsale : selDate,
         adddays : obj.days
       };
       $scope.dateCalcObj = {};
       $scope.dateCalculatorForm.$setPristine();
       console.log(JSON.stringify(dateCalcObj));
       submitSupportStatus(dateCalcObj);
    }

    $scope.getCityWiseServiceCenter = function(){
       var loginId =1;
      $http.get('https://letsservicetech.in/cityWiseServiceCenterList/'+loginId+'/295822529277341')
                .then(function (response) {
                  //console.log(response);
               $scope.cityWiseserviceCenterList = response.data;
            });
    }
    
    var selectedBranchId;
    $scope.getBranchDetailData = function(branchObj){
      console.log(branchObj);
      $scope.selectedBranch = branchObj.scName;
      selectedBranchId = branchObj.scId;
      $scope.getCityWiseServiceCenter();
      getBranchDetails(branchObj.scId);
    }

    function getBranchDetails(branchId) {
     var lsToken = TokenService.getToken(adminUserScId);
     GetSupportBranchDetailsService.query({scId:adminUserScId,branchId:branchId,token:lsToken}, function (data) {
       console.log('Branch details data::',data);
       $scope.adminBranchDetailObj.email = data[0].email;
       $scope.adminBranchDetailObj.mobile =  data[0].mobileNo;
       $scope.adminBranchDetailObj.dealerCode = data[0].dealerCode;
       $scope.adminBranchDetailObj.opdId = data[0].opdId;
       //$scope.adminBranchDetailObj.opdId = '1';
     }, function (err) {
       console.log(err);
     });
   };

   function getSupportUserList() {
     var lsToken = TokenService.getToken(adminUserId);
     GetSupportUserListService.query({loginId:adminUserId,token:lsToken}, function (data) {
       console.log('Support Users data::',data);
       $scope.supportUsers = data;
     }, function (err) {
       console.log(err);
     });
   };

    $scope.assignDealers = function(obj){
       var assignObj = {
         logInId : adminUserId,
         status : selectedStatus,
         scIds : selectedDealer.toString(),
         supportId : obj.selectedSupportUser
       };
       $scope.assignDealersObj = {};
       $scope.assignDealersForm.$setPristine();
       console.log(JSON.stringify(assignObj));
       submitSupportStatus(assignObj);
    }
    
    $scope.updateDealerIpAddress =function(obj){
      var ipObj = {
         logInId : adminUserId,
         status : selectedStatus,
         scId : obj.selectedDealer,
         ipAddress : obj.ipAddress
       };
       $scope.ipObj = {};
       $scope.ipAddressForm.$setPristine();
       console.log(JSON.stringify(ipObj));
       submitSupportStatus(ipObj);
    }

    $scope.getEWAccess = function(obj){
       var ewObj = {
         logInId : adminUserId,
         status : selectedStatus,
         scId : obj.selectedDealer
       };
       $scope.EWObj = {};
       $scope.EWAccessForm.$setPristine();
       console.log(JSON.stringify(ewObj));
       submitSupportStatus(ewObj);
    }

    $scope.deleteServiceReminderData =function(obj){
      if(selectedChassisNo){
        var deleteSRObj = {
         logInId : adminUserId,
         status : selectedStatus,
         scId : obj.selectedDealer,
         chassisNo : selectedChassisNo
       };
       $scope.deleteDataObj = {};
       $scope.deleteDataForm.$setPristine();
       console.log(JSON.stringify(deleteSRObj));
       submitSupportStatus(deleteSRObj);
       selectedChassisNo = '';
       $('input[type="file"]').val(null);
      } else {
        $window.alert('Kindly upload the File!');
      }
    }


     /* Excel Upload */
    var oFileIn;

    $(function() {
      oFileIn = document.getElementById('teleCallingSMSXlFileInput');
      if(oFileIn.addEventListener) {
        oFileIn.addEventListener('change', filePicked, false);
      }

     /* document.getElementById("teleCallingSMSXlFileInput").onchange = function () {
        document.getElementById("uploadFile").value = this.value;
      };*/
    });

    var teleCallerXlToJson, teleCallerXlErrorRowNum, teleCallerXlErrorMsg, teleCallerXlInvalidDateFlag ;
    var uploadStatus;
    var fileColumnNames = [];
    var teleCallerFilteredXlData = [];
    var selectedChassisNo;
    function filePicked(oEvent) {
      teleCallerFilteredXlData = [];
      uploadStatus = $window.confirm('Are you sure this is the file you want to upload?');

      //$timeout(function() {
        if(uploadStatus === true){
          // console.log('uploadStatus',uploadStatus);
          //$scope.loading = true;
        }else{
          $scope.loading = false;
          console.log('File Cancelled!');
          $('input[type="file"]').val(null);
        }
      //}, 3000);


      // Get The File From The Input
      var oFile = oEvent.target.files[0];
     // console.log('oFile',oFile);
      var sFilename = oFile.name;
      //console.log(sFilename);
      // Create A File Reader HTML5
      if(sFilename.substr(-4) !== '.xls') { /*  && sFilename.substr(-5) !== '.xlsx'*/
        $window.alert('Only .xls file format is allowed');
      }
      var reader = new FileReader();

      // Ready The Event For When A File Gets Selected
      reader.onload = function(e) {
        var data = e.target.result;
       // console.log('data',data);
        var cfb = XLS.CFB.read(data, {type: 'binary'});
       // console.log('cfb',cfb);
        var wb = XLS.parse_xlscfb(cfb);
        //console.log('wb',wb);
        // Loop Over Each Sheet
        wb.SheetNames.forEach(function(sheetName) {
          // Obtain The Current Row As CSV
          //var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);

          var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
         //console.log('oJS',oJS);

          /* angular.element(document.querySelector('#my_file_output')).html(sCSV);
           console.log(oJS);*/
          //$scope.loading = true;
          if( oJS.length > 0 ){
            teleCallerXlToJson = oJS;
            //console.log('oJS: ',oJS);
            var teleCallerValidationOutput = teleCallerXlValidateSheet();
            if(teleCallerValidationOutput === true) {
               teleCallerXlToJson = $filter('unique')(teleCallerXlToJson,'chassisno');
              for(var m1 = 0; m1 < teleCallerXlToJson.length; m1++) {
                teleCallerXlInvalidDateFlag = false ;
                var teleCallerXlRowObj = {};
                teleCallerXlRowObj = teleCallerXlToJson[m1].chassisno;
                if(teleCallerXlToJson[m1].chassisno !== undefined){
                   teleCallerFilteredXlData.push(teleCallerXlRowObj);
                }
              }
              selectedChassisNo = teleCallerFilteredXlData.toString();
              console.log('Selected Chassis Numbers ::',selectedChassisNo);
            } else {
             //$scope.loading = false;
              $window.alert(teleCallerXlErrorMsg);
              $window.location.reload();
            }
          }
        });
      };

      // Tell JS To Start Reading The File.. You could delay this if desired
      reader.readAsBinaryString(oFile);
    }

    function teleCallerXlValidateSheet() {
      angular.forEach( teleCallerXlToJson, function (indexOfObj) {
        angular.forEach( indexOfObj, function (v, k) {
          delete indexOfObj[k];
          indexOfObj[ k.replace(/\s/g, '').toLowerCase() ] = v.trim();
        });
      });
      /*-- valid column name--*/
      if(teleCallerXlToJson !== undefined || teleCallerXlToJson !== null || teleCallerXlToJson !== []){
        for(var pos = 0; pos < teleCallerXlToJson.length; pos++) {
          var teleCallerXlKeysArray = [];
          teleCallerXlKeysArray = Object.keys( teleCallerXlToJson[pos] );
          if(teleCallerXlKeysArray !== undefined || teleCallerXlKeysArray !== null || teleCallerXlKeysArray !== []){
          }
        }
      }

      console.log('Chassis numbers : ',JSON.stringify(teleCallerXlToJson));
      for(var l1 = 0; l1 < teleCallerXlToJson.length; l1++){
        /*-- mandatory field value, mobile length,serviceType value, assistanceType value validation--*/
          var obj = teleCallerXlToJson[l1];
          console.log('row object::',obj);
       // if(obj.mobile !== undefined){
          if( teleCallerIsEmptyStr(obj.chassisno) ) {
            teleCallerXlErrorRowNum = l1 + 1 ;
            teleCallerXlErrorMsg = ' Some mandatory fields are empty in your sheet at row ' + (teleCallerXlErrorRowNum + 1) + ' .';
            return false;
          }
       // }
      }
      return true;
    }

  //validate sheet ends
    function teleCallerIsEmptyStr (str) {
      console.log(str);
      if(str !== undefined) {
        if (!str || str === undefined) {
          $window.alert('Empty row/column in the sheet.');
        }
      return (str === null || !str.trim() );
    }
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

  });