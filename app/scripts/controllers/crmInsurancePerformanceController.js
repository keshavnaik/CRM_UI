angular.module('letsService')
  .controller('crmInsurancePerformanceController', function ($scope,$sce,serviceURL,$timeout,$filter,$cookies,ngTableParams,$rootScope,$window,TokenService,CreDashboardInsuranceStatsDataService,AdminInsuranceCustomerDetailsStatsWiseService,TeleCallerPerticularAppointmentHistoryDataService,ServiceTypeService,TeleCallingCallRecordService,GetPerticularInsuranceDetailsService,GetSuperAdminDealerListService,GetScWiseTeleCallerService,TeleCallerWiseServiceCenterService,GetInsuranceHistoryService,InsuranceCallRecordingService,UpdateInsuranceCustomerPhoneService) {

    var adminUserId = $cookies.get('loggedInUserIdAdmin');
    var adminUserScId = $cookies.get('loggedInUserScIdAdmin');
    var loginBrandName = $cookies.get('loggedInUserBikeBrandAdmin');

    $scope.openCalendar = function(e,status) {
      e.preventDefault();
      e.stopPropagation();
      if(status === 'FromDate') {
        $scope.isOpenFrom = true;
      } else {
        $scope.isOpenTo = true;
      }
    };

    $scope.openCalendarStatus = function(e) {
      $scope.minDate = new Date();
      e.preventDefault();
      e.stopPropagation();
      $scope.isOpenFromStatus = true;
    };

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

     var selectedCaller = 'caller';
     var selectedBranch = 'branch';
     var selectedDataType = 'all';

  var selectedFromDateConversion = 'month';
  var selectedToDateConversion = 'month';
  $scope.selectedFromDate = 'month';
  $scope.selectedToDate = 'month';

    function getInsuranceStatsData(selCaller,selBranch,selFromDate,selToDate) {
      selectedFromDateConversion = selFromDate;
      selectedToDateConversion = selToDate;
      selectedCaller = selCaller;
      selectedBranch = selBranch;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardInsuranceStatsDataService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,brand:loginBrandName,token:lsToken}, function(data) {
        console.log('cre dashboard data :',data);
        $scope.creDashboardData = data;
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
   
   getInsuranceStatsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);

    $rootScope.creTableData = [];
    var selectedDataTypeId;
    var selectedStatsStatus;
    var selectedServiceDueType;
    var selectedDataTypeName;
    var selectedReportType = 'submit';
    $scope.getPericularStatsData = function (dataTypeName,status,dataTypeId,selFromDate,selToDate) {
      $scope.exportStatus = 'Insurance Stats';
      $scope.statusDisplay = status;
      selectedFromDateConversion = selFromDate;
      selectedToDateConversion = selToDate;
      selectedDataTypeName = dataTypeName;
      $rootScope.exportType = true;
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);

      if(selectedReportType === 'export'){
        $window.open(serviceURL+'get_admin_insurance_dashboard_deatils/'+selectedFromDateConversion+'/'+selectedToDateConversion+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedStatsStatus+'/'+selectedBranch+'/'+loginBrandName+'/'+selectedReportType+'/'+lsToken);
        showLoader(false);
        selectedReportType = 'submit';
      } 
      else if(selectedReportType === 'submit'){
        AdminInsuranceCustomerDetailsStatsWiseService.query({fromDate:selectedFromDateConversion,toDate:selectedToDateConversion,scId:adminUserScId,callerId:selectedCaller,status:selectedStatsStatus,branchId:selectedBranch,bikeBrand:loginBrandName,reportType:selectedReportType,token:lsToken}, function(data) {
        console.log('ADMIN CUSTOMER DETAILS STATS WISE :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      },function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
      }
      
    };

     $scope.exportCustomerDetails = function(){
        console.log('Inside Export');
        selectedReportType = 'export';
        if($scope.exportStatus === 'Insurance Stats'){
        console.log($scope.exportStatus);
        $scope.getPericularStatsData(selectedDataTypeName,selectedStatsStatus,selectedDataTypeId,selectedFromDateConversion,selectedToDateConversion,'export');
      }
     }

     $rootScope.tableParams = new ngTableParams({
      page: 1,
      count: 20
    }, {
      total: $rootScope.creTableData.length,
      getData: function ($defer, params) {
        // use build-in angular filter
        var orderedData = params.sorting() ?
          $filter('orderBy')($rootScope.creTableData, params.orderBy()) :
          $rootScope.creTableData;

        orderedData = params.filter() ?
          $filter('filter')(orderedData, params.filter()) :
          orderedData;
        $scope.orderedData = orderedData;
        params.total(orderedData.length); // set total for recalc pagination
        $defer.resolve($scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    }, {
      counts: [10, 20]
    });
    $rootScope.tableParams.settings().counts = [10, 20, 50, 100];
    $scope.selectedPageSizes = $rootScope.tableParams.settings().counts;
    $scope.changePage = changePage;
    $scope.changePageSize = changePageSize;
    $scope.changePageSizes = changePageSizes;

    function changePage(nextPage) {
      $rootScope.tableParams.page(nextPage);
      $rootScope.tableParams.reload();
    }

    function changePageSize(newSize) {
      $rootScope.tableParams.count(newSize);
    }
    function changePageSizes(newSizes) {
      // ensure that the current page size is one of the options
      if (newSizes.indexOf($rootScope.tableParams.count()) === 0) {
        newSizes.push($rootScope.tableParams.count());
        newSizes.sort();
      }
      $rootScope.tableParams.settings({
        counts: newSizes
      });

    }
    $scope.getHistory = function(selChassisNo,selDataTypeId,selApptId,selStatus){
      console.log(selStatus);
      if(selStatus === undefined){
        selStatus = 'status';
      }
      getAppointmentHistoryData(selChassisNo,selDataTypeId);
      getTCAppointmentCallRecord(selChassisNo,selDataTypeId);
      getServiceHistoryData(selChassisNo);
      getAppointmentDetails(selApptId,selStatus);
    };

    function getAppointmentHistoryData(selChassisNo,selDataTypeId) {
      //console.log(selChassisNo);
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      GetInsuranceHistoryService.query({chassisno:selChassisNo,dealerId:adminUserScId,token:lsToken},function (data) {
       console.log('history data :',data);
       $scope.tcAppointmentHistoryData = data;
       showLoader(false);
      }, function (err) {
        showLoader(false);
        console.log('history error data',err);
        $scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
      });
    }


    function getTCAppointmentCallRecord(selChassisNo,selDataTypeId) {
      $scope.callRecording = [];
      //var apptId = parseInt(selApptId);
      var lsToken = TokenService.getToken(adminUserScId);
      InsuranceCallRecordingService.query({chassisNo:selChassisNo,logInId:adminUserId,scId:adminUserScId,dataTypeId:selDataTypeId,token:lsToken}, function(data) {
        $scope.callRecording = data;
        console.log('callRecording',data);
      }, function(err) {
       // console.log(err);
        var callRecordNotAvailable = {
          recordingUrl : err.data.message,
          create_ts : ''
        };
        $scope.callRecording.push(callRecordNotAvailable);
      });
    }

    $scope.viewCallRecord = function(callRecordUrl) {
      $window.open(callRecordUrl.recordingUrl,'_blank');
    };


   $scope.trustAsResourceUrl1 = function (recordings) {
     console.log(recordings);
     return $sce.trustAsResourceUrl(recordings);
   };

   $scope.pauseCallRecord=function (){
     var stopRecord = document.getElementById("stopRecording");
      console.log(stopRecord);
      stopRecord.pause();
    }

   $scope.clearRecording = function(){
     var stopRecord = document.getElementById("stopRecording");
     console.log(stopRecord);
     stopRecord.pause();
    }

function getServiceHistoryData(chassisNo) {
      $scope.loaderIconService = true;
      $scope.tcServiceHistoryData = [];
      console.log('Chassis no', chassisNo);
      var lsToken = TokenService.getToken(adminUserScId);
      ServiceTypeService.query({chassisNo:chassisNo,id:adminUserScId,token:lsToken},function (data) {
        console.log('Service history data :',data);
        $scope.loaderIconService = false;
        $scope.tcServiceHistoryData = data; 
        $scope.tcServiceHistoryDataErrorMsg = '';
      }, function (err) {
        $scope.loaderIconService = false;
        $scope.tcServiceHistoryDataErrorMsg = 'No Data Available';
      });
    }

    $scope.getDetails = function(selApptId,selStatus){
      $scope.editPhoneSuccessMsg = '';
      console.log(selApptId);
      console.log(selStatus);
      if(selStatus === undefined || selStatus === null){
        selStatus = 'status';
      }
      getAppointmentDetails(selApptId,selStatus);
    };

    $scope.editPhoneNumber = function(selMobile,apptObj){
      console.log('selMobile',selMobile);
      //console.log('newPhoneNumber',status);
      $scope.editPhoneSuccessMsg = '';
       var editPhoneObj = {
        mobile: selMobile,
        customerName: apptObj.customerName,
        chassisNo : apptObj.chassisNo,
        scId : adminUserScId,
        defaultNumber:'',
        customerId : apptObj.customerId,
        customerStatus : 'new'
      };
      console.log(JSON.stringify(editPhoneObj));
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateInsuranceCustomerPhoneService.save({id:adminUserScId,token:lsToken}, editPhoneObj, function (data) {
        console.log(data);
        $scope.editPhoneSuccessMsg = data.message;
       // checkActiveInactiveStatus = false;
        getAppointmentDetails(apptObj.apptId,$scope.statusDisplay);
        $timeout(function() {
          $('#editPhoneModal').modal('hide');
          /*$("#activeDeactivePhoneModal").modal('hide');
          getAppointmentDetails(apptObj.apptId,$scope.statusDisplay);*/
        }, 3000);
        $scope.phoneObj = {};
        $scope.editPhoneForm.$setPristine();
        }, function (err) {
        console.log(err);
        $scope.editPhoneErrorMsg = err.data.message;
      });
    };
    
    $scope.customerMobileNumbers = [];
    var customerMobileNumbers = [];
    function getAppointmentDetails(apptId,selStatus) {
      $scope.customerMobileNumbers = [];
      $scope.currentMobile = null;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      GetPerticularInsuranceDetailsService.query({apptId:apptId,scId:adminUserScId,brand:loginBrandName,token:lsToken}, function (data) {
        console.log('data in detailed page',data[0]);
        $scope.tcAppointmentData = data[0];
        $scope.tcAppointmentDataErrorMsg = '';
        customerMobileNumbers = $scope.tcAppointmentData.mobile;
         for(var i=0;i<customerMobileNumbers.length;i++){
          if(customerMobileNumbers[i].customerMobile === $scope.tcAppointmentData.customerMobile){
            customerMobileNumbers[i].customerMobile = customerMobileNumbers[i].customerMobile+'*';
            $scope.currentMobile = customerMobileNumbers[i].customerMobile;
           }
           $scope.customerMobileNumbers.push(customerMobileNumbers[i]);
        }
        if($scope.tcAppointmentData.customer_address === undefined || $scope.tcAppointmentData.customer_address === null || $scope.tcAppointmentData.customer_address === ''){
          $scope.tcAppointmentData.customer_address= '- -';
        }
        if($scope.tcAppointmentData.chassisNo === undefined || $scope.tcAppointmentData.chassisNo === null || $scope.tcAppointmentData.chassisNo === ''){
          $scope.tcAppointmentData.chassisNo= '- -';
        }
        if($scope.tcAppointmentData.bikeBrand === undefined || $scope.tcAppointmentData.bikeBrand === null || $scope.tcAppointmentData.bikeBrand === ''){
          $scope.tcAppointmentData.bikeBrand= '- -';
        }
        if($scope.tcAppointmentData.lastServiceType === undefined || $scope.tcAppointmentData.lastServiceType === null || $scope.tcAppointmentData.lastServiceType === ''){
          $scope.tcAppointmentData.lastServiceType= '- -';
        }
        if($scope.tcAppointmentData.scName === undefined || $scope.tcAppointmentData.scName === null || $scope.tcAppointmentData.scName === ''){
          $scope.tcAppointmentData.scName= '- -';
        }
        if($scope.tcAppointmentData.bikeNo === undefined || $scope.tcAppointmentData.bikeNo === null || $scope.tcAppointmentData.bikeNo === ''){
          $scope.tcAppointmentData.bikeNo= '- -';
        }
        if($scope.tcAppointmentData.bikeModel === undefined || $scope.tcAppointmentData.bikeModel === null || $scope.tcAppointmentData.bikeModel === ''){
          $scope.tcAppointmentData.bikeModel= '- -';
        }
        if($scope.tcAppointmentData.bikeType === undefined || $scope.tcAppointmentData.bikeType === null || $scope.tcAppointmentData.bikeType === ''){
          $scope.tcAppointmentData.bikeType= '- -';
        }
        if($scope.tcAppointmentData.dateOfSale === undefined || $scope.tcAppointmentData.dateOfSale === null || $scope.tcAppointmentData.dateOfSale === '' || $scope.tcAppointmentData.dateOfSale === '0000-00-00 00:00:00'){
          $scope.tcAppointmentData.dateOfSale= '- -';
        }
        if($scope.tcAppointmentData.serviceDueDate === undefined || $scope.tcAppointmentData.serviceDueDate === null || $scope.tcAppointmentData.serviceDueDate === ''|| $scope.tcAppointmentData.serviceDueDate === '0000-00-00 00:00:00'){
          $scope.tcAppointmentData.serviceDueDate= '- -';
        }
        if($scope.tcAppointmentData.serviceDueType === undefined || $scope.tcAppointmentData.serviceDueType === null || $scope.tcAppointmentData.serviceDueType === ''){
          $scope.tcAppointmentData.serviceDueType= '- -';
        }
        if($scope.tcAppointmentData.lastServiceDate === undefined || $scope.tcAppointmentData.lastServiceDate === null || $scope.tcAppointmentData.lastServiceDate === '' || $scope.tcAppointmentData.lastServiceDate === '0000-00-00 00:00:00'){
          $scope.tcAppointmentData.lastServiceDate= '- -';
        }
        if($scope.tcAppointmentData.serviceAvailedAt === undefined || $scope.tcAppointmentData.serviceAvailedAt === null || $scope.tcAppointmentData.serviceAvailedAt === ''){
          $scope.tcAppointmentData.serviceAvailedAt= '- -';
        }
        showLoader(false);
      }, function (err) {
        $scope.tcAppointmentDataErrorMsg = 'No Data Available';
        //$window.alert('No data found for this appointment .');
        showLoader(false);
      });
    }

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
      selectedCaller = 'caller';
      selectedBranch = 'branch';
      console.log(selDealer);
      adminUserScId = selDealer;
      getServiceCenterTeleCallerWise(adminUserScId);
      getScWiseCallerList(adminUserScId);
      getInsuranceStatsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
      };

      function getServiceCenterTeleCallerWise(id) {
      console.log('==============',id);
      adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWiseServiceCenterService.query({id:adminUserScId,token:lsToken}, function(data) {
        $scope.serviceCenter = data;
       // console.log('hi',data);
      }, function(err) {
        $scope.serviceCenterErrorMsg = err.data.message;
      });
    }
    getServiceCenterTeleCallerWise(adminUserScId);

   $scope.getSelectedBranch = function (selBranch) {
       console.log('selected branch',selBranch);
      selectedBranch = selBranch;
      if(selBranch === null){
        selectedBranch = 'branch';
      }
      console.log('==============++++++++++++++++++',selectedBranch);
      getInsuranceStatsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
   };

function getScWiseCallerList(id) {
      adminUserScId = id;
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.callerList = data;
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }
    getScWiseCallerList(adminUserScId);

 $scope.getSelectedCaller = function (selCaller) {
      console.log(selCaller);
      selectedCaller = selCaller;
      if(selCaller === null){
        selectedCaller = 'caller';
      }
       getInsuranceStatsData(selectedCaller,selectedBranch,selectedFromDateConversion,selectedToDateConversion);
   };


});