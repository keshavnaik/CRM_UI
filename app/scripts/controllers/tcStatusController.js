'use strict';

angular.module('letsService')
  .controller('TCStatusController', function ($scope,$window,$cookies,TokenService,TeleCallerWiseServiceCenterService,GetScWiseTeleCallerService,TeleCallerReasonService,TeleCallerStatusService,TeleCallerStatusDataService,serviceURL,GetSuperAdminDealerListService) {

   /* var adminUserId = $window.sessionStorage.getItem('loggedInUserId');
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

    /*function getStatus() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerStatusService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.teleCallingStatus = data;
        $scope.teleCallingStatus.push({apptStatusId:'All',description:'All'});
        console.log('status',data);
      }, function (err) {
        $scope.statusErrorMsg = err.data.message;
      });
    }
    getStatus();
    */
    var selReportType = 'report';
    $scope.reportTypes  = [{'key':'serviceduedate','description':'Service Due Date'},{'key':'calldate','description':'Call Date'},{'key':'rescheduledate','description':'Rescheduled Date'},{'key':'jobcardDate','description':'Jobcard Date'},{'key':'overduedate','description':'Over Due Date'}];
    $scope.teleCallingStatus = [{'key':'walkin','description':'Walkin'},{'key':'pickup and drop','description':'Pickup And Drop'},{'key':'call later','description':'Call Later'},{'key':'not interested','description':'Not Interested'},{'key':'service done','description':'Service Done'},{'key':'insurance','description':'Insurance'},{'key':'job card','description':'Jobcard'},{'key':'non converted','description':'Non Converted'},{'key':'Service PSF','description':'Service PSF'},{'key':'Sales PSF','description':'Sales PSF'},{'key':'other dealership customers','description':'Other Dealership Customers'},{'key':'own dealership customers','description':'Own Dealership Customers'},{'key':'conversions','description':'Caller Conversion'},{'key':'All','description':'All'}];

    $scope.getSubStatus = function(subStatus) {
      $scope.teleCallingSubStatus = [];
      $scope.selectedStatusDesc = subStatus;
      if(subStatus === 'Sales PSF'){
           $scope.psfTypes = [{'key':'feedback','description':'Feedback'},{'key':'walkin','description':'Walkin'},{'key':'call later','description':'Call Later'},{'key':'not interested','description':'Not Interested'},{'key':'all','description':'All'}];
      } else if(subStatus === 'Service PSF'){
           $scope.psfTypes = [{'key':'feedback','description':'Feedback'},{'key':'walkin','description':'Walkin'},{'key':'pickup and drop','description':'Pickup And Drop'},{'key':'call later','description':'Call Later'},{'key':'not interested','description':'Not Interested'},{'key':'all','description':'All'}];
      }
      $scope.teleCallingSubStatus = [];
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerReasonService.query({status:subStatus,id:adminUserScId,token:lsToken},function(data) {
        $scope.teleCallingSubStatus = data;
        //console.log('teleCallingSubStatus',data);
      }, function(err) {
        console.log(err);
      });
    };

    function getServiceCenterTeleCallerWise() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise();

    function getScWiseCallerList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.callerList = data;
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }
    getScWiseCallerList();

    var selStatus = 'status';
    var selSubStatus = 'subStatus';
    var selBranch = 'branch';
    var selCaller = 'caller';

    $scope.getReportType = function(selType){
      $scope.selectedType = selType;
      if(selType === 'serviceduedate'){
        $scope.teleCallingStatus = [{'key':'walkin','description':'Walkin'},{'key':'pickup and drop','description':'Pickup And Drop'},{'key':'call later','description':'Call Later'},{'key':'not interested','description':'Not Interested'},{'key':'service done','description':'Service Done'},{'key':'non converted','description':'Non Converted'},{'key':'insurance','description':'Insurance'},{'key':'other dealership customers','description':'Other Dealership Customers'},{'key':'own dealership customers','description':'Own Dealership Customers'},{'key':'All','description':'All'}];
        } else if(selType === 'jobcardDate'){
          $scope.teleCallingStatus = [{'key':'conversions','description':'Caller Conversion'},{'key':'job card','description':'Jobcard'}];
        } else if(selType === 'overduedate'){
          selStatus = 'overdue customers';
        } 
        else {
          $scope.teleCallingStatus = [{'key':'walkin','description':'Walkin'},{'key':'pickup and drop','description':'Pickup And Drop'},{'key':'call later','description':'Call Later'},{'key':'not interested','description':'Not Interested'},{'key':'service done','description':'Service Done'},{'key':'insurance','description':'Insurance'},{'key':'non converted','description':'Non Converted'},{'key':'Service PSF','description':'Service PSF'},{'key':'Sales PSF','description':'Sales PSF'},{'key':'other dealership customers','description':'Other Dealership Customers'},{'key':'own dealership customers','description':'Own Dealership Customers'},{'key':'All','description':'All'}];
        }
    }

    $scope.psfTypes = [{'key':'feedback','description':'Feedback'},{'key':'walkin','description':'Walkin'},{'key':'pickup and drop','description':'Pickup And Drop'},{'key':'call later','description':'Call Later'},{'key':'not interested','description':'Not Interested'},{'key':'all','description':'All'}];
    var selectedPsfType = '';
    $scope.getTeleCallerStatusList = function (tcStatusData) {
      var lsToken = TokenService.getToken(adminUserScId);
      if(tcStatusData.selectedFromDate > tcStatusData.selectedToDate) {
          $window.alert('From Date cannot be greater than To Date');
        } else {
            selReportType = tcStatusData.reportType;
            selBranch = tcStatusData.selectedServiceCenter || 'branch';
            selCaller = tcStatusData.selectedCaller || 'caller';
            selStatus = tcStatusData.selectedStatus || 'status';
             console.log('tcStatusData.selectedPsfType',tcStatusData.selectedPsfType);
           
            if(tcStatusData.selectedStatus === 'Service PSF'){
               selectedPsfType = '-servicepsf';
               if(tcStatusData.selectedPsfType){
                 selStatus = tcStatusData.selectedPsfType;
                } else {
                   selectedPsfType = '';
                }
             }  
             else if(tcStatusData.selectedStatus === 'Sales PSF'){
                selectedPsfType = '-salespsf';
                if(tcStatusData.selectedPsfType){
                 selStatus = tcStatusData.selectedPsfType;
                } else {
                   selectedPsfType = '';
                }
             } else {
               selectedPsfType = ''; 
             }
            selSubStatus = tcStatusData.selectedSubStatus || 'subStatus';
            if($scope.selectedType === 'overduedate'){
               selStatus = 'overdue customers';
            } 
          var selectedFromDate = tcStatusData.selectedFromDate.getFullYear() + '-' + ('0' + (tcStatusData.selectedFromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + tcStatusData.selectedFromDate.getDate()).slice(-2);
          var selectedToDate = tcStatusData.selectedToDate.getFullYear() + '-' + ('0' + (tcStatusData.selectedToDate.getMonth() + 1)).slice(-2) + '-' + ('0' + tcStatusData.selectedToDate.getDate()).slice(-2);
          console.log(serviceURL+'lsConnectReports/'+selectedFromDate+'/'+selectedToDate+'/'+selStatus+selectedPsfType+'/'+selSubStatus+'/'+selBranch+'/'+selCaller+'/'+adminUserScId+'/'+selReportType+'/'+lsToken);
          $window.open(serviceURL+'lsConnectReports/'+selectedFromDate+'/'+selectedToDate+'/'+selStatus+selectedPsfType+'/'+selSubStatus+'/'+selBranch+'/'+selCaller+'/'+adminUserScId+'/'+selReportType+'/'+lsToken);
        }
    };

    $scope.getPsfType = function(selPsfType){
      $scope.teleCallingSubStatus = [];
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerReasonService.query({status:selPsfType,id:adminUserScId,token:lsToken},function(data) {
        $scope.teleCallingSubStatus = data;
        console.log('teleCallingSubStatus',data);
      }, function(err) {
        console.log(err);
      });
    }

  $scope.MTDReports = [{'name':'Service Center Complaint Customers','key':'mtdsccomplaints'},{'name':'Appointment Taken','key':'mtdappointments'},{'name':'Call Later','key':'mtdcalllater'},{'name':'Jobcard Data','key':'mtdjobcard'},{'name':'Conversions','key':'mtdconversion'},{'name':'Pending Calls (Service Reminder)','key':'mtdpendingcalls'}];
  $scope.otherReports = [{'name':'Today Appointments','key':'todayappts'},{'name':'Today Call Later','key':'todaycalllater'},{'name':'Today Service Center Complaint','key':'todaysccomplaints'},{'name':'Today Jobcard Data','key':'todayjobcard'},/*{'name':'Today Potential Data','key':'todaypotential'},*/{'name':'Tomorrow Appointments','key':'tmrwappts'}];

   var mtdSelectedFromDate = 'month';
   var mtdSelectedToDate = 'month';
   var mtdSelectedSubStatus = 'subStatus';
   var mtdSelectedCaller = 'caller';
   var mtdSelectedBranch = 'branch';
   $scope.getMtdReport = function (selectedMtdReportType){
     mtdSelectedBranch = 'branch';
     mtdSelectedCaller = 'caller';
     selReportType = 'report';
     mtdSelectedBranch = selectedMtdReportType.selectedBranch || 'branch';
    /* if(mtdSelectedBranch === undefined){
        mtdSelectedBranch = 'branch';
     } else if(mtdSelectedCaller === undefined){
        mtdSelectedCaller = 'caller';
     }*/
     mtdSelectedCaller = selectedMtdReportType.selectedCaller || 'caller';
     console.log('selected report type', selectedMtdReportType);
     var lsToken = TokenService.getToken(adminUserScId);
     console.log(serviceURL+'lsConnectReports/'+mtdSelectedFromDate+'/'+mtdSelectedToDate+'/'+selectedMtdReportType.selectedType+'/'+mtdSelectedSubStatus+'/'+mtdSelectedBranch+'/'+mtdSelectedCaller+'/'+adminUserScId+'/'+selReportType+'/'+lsToken);
     $window.open(serviceURL+'lsConnectReports/'+mtdSelectedFromDate+'/'+mtdSelectedToDate+'/'+selectedMtdReportType.selectedType+'/'+mtdSelectedSubStatus+'/'+mtdSelectedBranch+'/'+mtdSelectedCaller+'/'+adminUserScId+'/'+selReportType+'/'+lsToken);
     $scope.reportType = {};
     $scope.mtdReportsForm.$setPristine();
   };

   $scope.getOtherReport = function (selectedOtherReportType){
     selReportType = 'report';
     console.log('selected report type', selectedOtherReportType);
     var lsToken = TokenService.getToken(adminUserScId);
     console.log(serviceURL+'lsConnectReports/'+mtdSelectedFromDate+'/'+mtdSelectedToDate+'/'+selectedOtherReportType.selectedType+'/'+mtdSelectedSubStatus+'/'+selectedOtherReportType.selectedBranch+'/'+mtdSelectedCaller+'/'+adminUserScId+'/'+selReportType+'/'+lsToken);
     $window.open(serviceURL+'lsConnectReports/'+mtdSelectedFromDate+'/'+mtdSelectedToDate+'/'+selectedOtherReportType.selectedType+'/'+mtdSelectedSubStatus+'/'+selectedOtherReportType.selectedBranch+'/'+mtdSelectedCaller+'/'+adminUserScId+'/'+selReportType+'/'+lsToken);
   };

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

    $scope.getSelectedDealer = function (selDealer) {
      selCaller = 'caller';
      selBranch = 'branch';
      console.log(selDealer);
      adminUserScId = selDealer;
      getServiceCenterTeleCallerWise();
      getScWiseCallerList();
   };

   $scope.getCallerList =function(selReportType){
    if(selReportType === 'mtdpendingcalls'){
      getScWiseCallerList();
    }
   }

  });
