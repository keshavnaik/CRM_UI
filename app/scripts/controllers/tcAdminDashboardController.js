'use strict';

angular.module('letsService')
  .controller('TCAdminDashboardController', function ($scope,$timeout,$cookies,$rootScope,$window,TokenService, TcAdminDashboardService,TeleCallerWiseServiceCenterService,TeleCallerDataTypeService,GetScWiseTeleCallerService,TcAdminDashboardDetailService,serviceURL,TeleCallerExcelUploadService,TeleCallingSearchService,TeleCallingCallRecordService,TeleCallerExcelUploadJobcardDataService,TeleCallerPerticularAppointmentHistoryDataService,TeleCallerExcelUploadServiceReminderDataService,TeleCallerJobCardDataService,TeleCallerCallStatsDataService,TeleCallerFeedbackRatingService,GetFeedbackTitleService,AddFeedbackQuestionService,TeleCallerExcelUploadSalesFeedbackDataService,BrandWiseModelService,TeleCallerExcelUploadAMCDataService,TeleCallerCSVUploadServiceReminderDataService,TeleCallerCSVUploadJobCardDataService,AppointmentDueTypeStats,ConversionDueTypeStatsService,TeleCallerCSVUploadRegularDataService) {

    /*var adminUserId = $window.sessionStorage.getItem('loggedInUserId');
    var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');
    var loginBrandName = $window.sessionStorage.getItem('loggedInUserBikeBrand');
    var loggedInVersionCode = $window.sessionStorage.getItem('loggedInVersionCode');*/

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');
    var loggedInVersionCode = $cookies.get('loggedInVersionCode');
    var loggedInFileUploadStatus = $cookies.get('csvFileUploadStatus');

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

  	function getTcAdminDashboardStats(selFromDate,selToDate,selSeviceCenter,selDataType,selCaller) {
     // console.log('stats  input : ',selFromDate,selToDate,selSeviceCenter,selCaller,selDataType);
  	  $scope.loadingStats = true;
  			var lsToken = TokenService.getToken(adminUserScId);
      selSeviceCenter = selSeviceCenter || 'branch';
      selDataType = selDataType || 'datatype';
      selCaller = selCaller  || 'caller';
     // getFeedbackRatings(selFromDatedata,selToDateData,selSeviceCenter,selCaller,selDataType);

      TcAdminDashboardService.get({fromDate:selFromDate,toDate:selToDate,tcId:adminUserId,id:adminUserScId,branchId:selSeviceCenter,callerId:selCaller,datatypeId:selDataType,token:lsToken}, function (data) {
       // console.log('url ::  '+serviceURL+'get_admin_status_details/'+selFromDate+'/'+selToDate+'/'+selStatus+'/'+selSubStatus+'/'+adminUserId+'/'+adminUserScId+'/'+selSeviceCenter+'/'+selCaller+'/'+selDataType+'/'+selExport+'/'+lsToken);
        $scope.tcStatusStats = data;
        $scope.loadingStats = false;
  			console.log('hai admin',data);
      //  getFeedbackRatings(selFromDatedata,selToDateData,selSeviceCenter,selCaller,selDataType);
        $scope.tcAdminStatsLabels = ['Free Service Count', 'Paid Service Count'];
        $scope.serviceTypeGraphColors = ['#adadad','#0083ca'];

  			$scope.tcAdminStatsData = [parseInt($scope.tcStatusStats.freeScCount),parseInt($scope.tcStatusStats.paidScCount)];
  			$scope.showChartStats = parseInt($scope.tcStatusStats.freeScCount) + parseInt($scope.tcStatusStats.paidScCount);

        $scope.serviceComplaintLabel = [];
        $scope.scServiceComplaintData = [];

        angular.forEach($scope.tcStatusStats.scComplaint, function (key, value) {
          $scope.serviceComplaintLabel.push(value);
          //console.log( $scope.serviceComplaintLabel);
          $scope.scServiceComplaintData.push(key);
        });

        $scope.serviceCentreComplaintsGraphColors = ['#004266','#0083ca','#adadad','#dbdbdb'];
        $scope.tcAdminStatsConvertedCountLabels = ['Free Converted Count', 'Paid Converted Count'];
        $scope.serviceConvertedGraphColors = ['#adadad','#0083ca'];
        $scope.serviceCentrePDGraphColors = ['#adadad','#0083ca'];
        $scope.tcAdminStatsConvertedCountData = [parseInt($scope.tcStatusStats.freeConvertedCount),parseInt($scope.tcStatusStats.paidConvertedCount)];
        $scope.showChartConvertedCountStats = parseInt($scope.tcStatusStats.freeConvertedCount) + parseInt($scope.tcStatusStats.paidConvertedCount);

        $scope.pickupandDropStatsData = [];
        $scope.pickupandDropStatsLabels = [];
        $scope.pickupandDropStatsSeries = ['Pickup and Drop Completed', 'Pending Pickup and Drop'];
        var pickupandDropPendingStats = [];
        var pickupandDropCompletedStats = [];
        var conversionData = $scope.tcStatusStats.conversionChart;

        if(conversionData !== undefined){
          angular.forEach(conversionData.pickupAndDropConversion,function(val) {
            if(val.month !== null && val.day !== null){
              var pickAndDRopStatsDate = val.month +' '+ val.day;
              $scope.pickupandDropStatsLabels.push(pickAndDRopStatsDate);
            }
            pickupandDropCompletedStats.push(val.completed);
            pickupandDropPendingStats.push(val.progress);
          });
        }

        $scope.pickupandDropStatsData.push(pickupandDropCompletedStats);
        $scope.pickupandDropStatsData.push(pickupandDropPendingStats);

        $scope.walkinStatsLabels = [];
        $scope.walkinStatsSeries = ['Walkin Completed', 'Pending Walkin'];
        var walkinPendingStats = [];
        var walkinCompletedStats = [];
        $scope.walkinStatsData = [];
        if(conversionData !== undefined) {
          angular.forEach(conversionData.walkInConversion, function (val) {
            if (val.month !== null && val.day !== null) {
              var walkinStatsDate = val.month + ' ' + val.day;
              $scope.walkinStatsLabels.push(walkinStatsDate);
            }
            walkinCompletedStats.push(val.completed);
            walkinPendingStats.push(val.progress);
          });
        }
        $scope.walkinStatsData.push(walkinCompletedStats);
        $scope.walkinStatsData.push(walkinPendingStats);
        $scope.loading = false;
       // getFeedbackRatings(selFromDatedata,selToDateData,selSeviceCenter,selCaller,selDataType);

      }, function (err) {
        console.log(err);
        $scope.tcStatusStatsErrorMsg = err.data.message;
        $scope.loading = false;
        $scope.loadingStats = false;
  		});
  	}

  	var selFromDatedata = 'month';
  	var selToDateData = 'month';
  	var selExport = 'submit';
    var selSeviceCenter = 'branch';
    var selDataType = 'datatype';
    var selCaller = 'caller';
    var selStatus = 'status';
    var selSubStatus = 'noStatus';
    var selectedFeedbackListId = 'feedback';



    getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);

    $scope.teleCallingDataByDate = function(tcData,exportType) {
     // console.log(exportType);
     // console.log('Request : ',tcData);
      if(exportType === 'export'){
        selExport = 'export';
      }
     /* var fromDateData = tcData.selectedFromDate;
      var toDateData = tcData.selectedToDate;*/
       selFromDatedata = tcData.selectedFromDate;
       selToDateData = tcData.selectedToDate;

      if(selFromDatedata > selToDateData) {
        $window.alert('To Date should be greater than From Date');
      } else {
        selFromDatedata = selFromDatedata.getFullYear() + '-' + (selFromDatedata.getMonth() + 1) + '-' + selFromDatedata.getDate();
        selToDateData = selToDateData.getFullYear() + '-' + (selToDateData.getMonth() + 1) + '-' + selToDateData.getDate();
        selFromDatedata = selFromDatedata;
        selToDateData = selToDateData;
        selSeviceCenter = tcData.selectedServiceCenter;
        selDataType = tcData.selectedDataType;
        selCaller = tcData.selectedCaller;
        getTcAdminDashboardStats(selFromDatedata,selToDateData,tcData.selectedServiceCenter,tcData.selectedDataType,tcData.selectedCaller);
        //getFeedbackRatings(selFromDatedata,selToDateData,selSeviceCenter,selCaller,selDataType);
      }
    };


    //getFeedbackRatings(selFromDatedata,selToDateData,selSeviceCenter,selCaller,selDataType);


    $rootScope.tcAppointmentSearch = function(tcSearchText) {
      if(tcSearchText) {
        $scope.loading = true;
        var lsToken = TokenService.getToken(adminUserScId);
        TeleCallingSearchService.query({key:tcSearchText,id:adminUserScId,token:lsToken}, function (data) {
          $scope.tcAdminStatsGrid.data = data;
          for(var i=0;i<$scope.tcAdminStatsGrid.data.length;i++){
            if($scope.tcAdminStatsGrid.data[i].serviceDueType === undefined || $scope.tcAdminStatsGrid.data[i].serviceDueType === null || $scope.tcAdminStatsGrid.data[i].serviceDueType === ''){
              $scope.tcAdminStatsGrid.data[i].serviceDueType= 'NA';
            }
            if($scope.tcAdminStatsGrid.data[i].apptStatus === undefined || $scope.tcAdminStatsGrid.data[i].apptStatus === null || $scope.tcAdminStatsGrid.data[i].apptStatus === ''){
              $scope.tcAdminStatsGrid.data[i].apptStatus= 'NA';
            }
            if($scope.tcAdminStatsGrid.data[i].serviceDueDate === undefined || $scope.tcAdminStatsGrid.data[i].serviceDueDate === null || $scope.tcAdminStatsGrid.data[i].serviceDueDate === ''){
              $scope.tcAdminStatsGrid.data[i].serviceDueDate= 'NA';
            }
            if($scope.tcAdminStatsGrid.data[i].apptSubStatus === undefined || $scope.tcAdminStatsGrid.data[i].apptSubStatus === null || $scope.tcAdminStatsGrid.data[i].apptSubStatus === ''){
              $scope.tcAdminStatsGrid.data[i].apptSubStatus= 'NA';
            }
          }
          $scope.appointmentDataErrorMsg ='';
          $scope.loading = false;
        }, function (err) {
          $scope.appointmentDataErrorMsg = err.data.message;
          $scope.loading = false;
          $scope.tcAdminStatsGrid.data = [];
        });
      }
    };

    function getTcAdminStatsDetail(fromDate,toDate,selStatus,selSubStatus,selSeviceCenter,selDataType,selCaller,selExport,feedbackListId) {
      console.log(fromDate+'/'+toDate+'/'+selStatus+'/'+selSubStatus);
      $scope.loading = true;
      var lsToken = TokenService.getToken(adminUserScId);
      selSeviceCenter = selSeviceCenter || 'branch';
      selDataType = selDataType || 'datatype';
      selCaller = selCaller  || 'caller';
      selectedFeedbackListId = feedbackListId;

      if(selStatus === 'freeScCount' || selStatus === 'paidScCount'){
        $scope.dueTypeAppointmentStatus = true;
        getAppointmentDueTypeStats(fromDate,toDate,selStatus,selSeviceCenter,selCaller,selDataType)
      }
      else if(selStatus === 'freeConvertedCount' || selStatus === 'paidConvertedCount'){
        $scope.dueTypeAppointmentStatus = true;
        getConversionDueTypeStats(fromDate,toDate,selStatus,selSeviceCenter,selCaller,selDataType)
      }
      TcAdminDashboardDetailService.query({fromDate:fromDate,toDate:toDate,status:selStatus,subStatus:selSubStatus,tcId:adminUserId,id:adminUserScId,branchId:selSeviceCenter,callerId:selCaller,datatypeId:selDataType,export:selExport,feedBackListId:selectedFeedbackListId,token:lsToken}, function (data) {
      console.log('url ::  '+serviceURL+'get_admin_status_details/'+fromDate+'/'+toDate+'/'+selStatus+'/'+selSubStatus+'/'+adminUserId+'/'+adminUserScId+'/'+selSeviceCenter+'/'+selCaller+'/'+selDataType+'/'+selExport+'/'+selectedFeedbackListId+'/'+lsToken);
        console.log('table data: ',data);
        $scope.tcAdminStatsGrid.data = data;
        $scope.tcAdminStatsGridErrorMsg = '';
        for(var i=0;i<$scope.tcAdminStatsGrid.data.length;i++){
          if($scope.tcAdminStatsGrid.data[i].serviceDueType === undefined || $scope.tcAdminStatsGrid.data[i].serviceDueType === null || $scope.tcAdminStatsGrid.data[i].serviceDueType === ''){
            $scope.tcAdminStatsGrid.data[i].serviceDueType= 'NA';
          }
          if($scope.tcAdminStatsGrid.data[i].apptStatus === undefined || $scope.tcAdminStatsGrid.data[i].apptStatus === null || $scope.tcAdminStatsGrid.data[i].apptStatus === ''){
            $scope.tcAdminStatsGrid.data[i].apptStatus= 'NA';
          }
          if($scope.tcAdminStatsGrid.data[i].serviceDueDate === undefined || $scope.tcAdminStatsGrid.data[i].serviceDueDate === null || $scope.tcAdminStatsGrid.data[i].serviceDueDate === ''){
            $scope.tcAdminStatsGrid.data[i].serviceDueDate= 'NA';
          }
          if($scope.tcAdminStatsGrid.data[i].apptSubStatus === undefined || $scope.tcAdminStatsGrid.data[i].apptSubStatus === null || $scope.tcAdminStatsGrid.data[i].apptSubStatus === ''){
            $scope.tcAdminStatsGrid.data[i].apptSubStatus= 'NA';
          }
        }

        /*if(selStatus === 'freeScCount' || selStatus === 'paidScCount'){
          if(selStatus === 'freeScCount'){
            selStatus = 'free';
          }else if(selStatus === 'paidScCount') {
            selStatus = 'paid';
          }
          $scope.dueTypeAppointmentStatus = true;
          getAppointmentDueTypeStats(fromDate,toDate,selStatus,selSeviceCenter,selCaller,selDataType)
        }
        else if(selStatus === 'freeConvertedCount' || selStatus === 'paidConvertedCount'){
          if(selStatus === 'freeConvertedCount'){
            selStatus = 'free';
          }else if(selStatus === 'paidConvertedCount'){
            selStatus = 'paid';
          }
          $scope.dueTypeAppointmentStatus = true;
          getConversionDueTypeStats(fromDate,toDate,selStatus,selSeviceCenter,selCaller,selDataType)
        }
*/
        $scope.loading = false;
      }, function (err) {
        console.log('table data error :',err);
        $scope.tcAdminStatsGridErrorMsg = err.data.message;
        $scope.loading = false;
        $scope.tcAdminStatsGrid.data = [];
      });
    }

    getTcAdminStatsDetail(selFromDatedata,selToDateData,selStatus,selSubStatus,selSeviceCenter,selDataType,selCaller,selExport,selectedFeedbackListId);

    $scope.getDueTypeDetailedList = function (subStatus) {
      getTcAdminStatsDetail(selFromDatedata,selToDateData,selStatus,subStatus,selSeviceCenter,selDataType,selCaller,selExport,selectedFeedbackListId);
    };

    $scope.dismissAppointmentDueTypePage = function () {
      $scope.dueTypeAppointmentStatus = false;
    };

    function getAppointmentDueTypeStats(fromDate,toDate,selStatus,selSeviceCenter,selCaller,selDataType) {
      $scope.loadingStats = true;
      var lsToken = TokenService.getToken(adminUserScId);
      AppointmentDueTypeStats.query({fromDate:fromDate,toDate:toDate,status:selStatus,adminId:adminUserId,scId:adminUserScId,branchId:selSeviceCenter,callerId:selCaller,dataTypeId:selDataType,token:lsToken},function (data) {
        $scope.appointmentDueTypeStats = data;
        $scope.loadingStats = false;
        }, function (err) {
        $scope.loadingStats = false;
        $scope.appointmentDueTypeStatsErrorMsg = err.data.message;
      });
    }

    function getConversionDueTypeStats(fromDate,toDate,selStatus,selSeviceCenter,selCaller,selDataType) {
      $scope.loadingStats = true;
      var lsToken = TokenService.getToken(adminUserScId);
      ConversionDueTypeStatsService.query({fromDate:fromDate,toDate:toDate,status:selStatus,adminId:adminUserId,scId:adminUserScId,branchId:selSeviceCenter,callerId:selCaller,dataTypeId:selDataType,token:lsToken},function (data) {
        $scope.appointmentDueTypeStats = data;
        $scope.loadingStats = false;
        }, function (err) {
        $scope.loadingStats = false;
        $scope.appointmentDueTypeStatsErrorMsg = err.data.message;
      });
    }


    var chartLabel;
    $scope.getTcAdminStatsStatusDetail = function (statsCount) {
     // console.log('status graph :  :',statsCount[0]._model.label);
      //console.log('status :  :',statsCount);
      console.log('status :  :',Array.isArray(statsCount));
      if(Array.isArray(statsCount) === true) {
        console.log('status graph :  :', statsCount[0]._model.label);
        chartLabel = statsCount[0]._model.label;

        /*else if(Array.isArray(statsCount) === false){
          selStatus = statsCount;
        }*/
        //var chartLabel = statsCount[0]._model.label;
        //chartLabel = chartLabel.split(' : ');
        if (chartLabel === 'Free Converted Count') {
          selStatus = 'freeConvertedCount';
          // $scope.tcStatsDesc = 'Free Converted Count';
        } else if (chartLabel === 'Paid Converted Count') {
          selStatus = 'paidConvertedCount';
          //   $scope.tcStatsDesc = 'Paid Converted Count';
        } else if (chartLabel === 'Free Service Count') {
          selStatus = 'freeScCount';
          // $scope.tcStatsDesc = 'Free Service Count';
        } else if (chartLabel === 'Paid Service Count') {
          selStatus = 'paidScCount';
          // $scope.tcStatsDesc = 'Paid Service Count';
        } else if (chartLabel === 'Unaddressed Issue') {
          selStatus = 'SC Complaint';
          selSubStatus = 'Unaddressed Issue';
          //$scope.tcStatsDesc = 'Unaddressed Issues';
        } else if (chartLabel === 'Non Responsive Service Team') {
          selStatus = 'SC Complaint';
          selSubStatus = 'Non Responsive Service Team';
          //$scope.tcStatsDesc = 'Non Responsive Service Team';
        } else if (chartLabel === 'Water Wash Complaints') {
          selStatus = 'SC Complaint';
          selSubStatus = 'Water Wash Complaints';
          //$scope.tcStatsDesc = 'Water Wash Complaints';
        } else if (chartLabel === 'Uninformed Parts Changed') {
          selStatus = 'SC Complaint';
          selSubStatus = 'Uninformed Parts Changed';
          //$scope.tcStatsDesc = 'Uninformed Parts Changed';
        }

      }
      /*else {
        selStatus = statsCount;
      }*/
      else if(Array.isArray(statsCount) === false){
        selStatus = statsCount;
      }
      getTcAdminStatsDetail(selFromDatedata,selToDateData,selStatus,selSubStatus,selSeviceCenter,selDataType,selCaller,selExport,selectedFeedbackListId);
    };


    function getDataTypes() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerDataTypeService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.dataTypes = data;
      }, function (err) {
        $scope.datatypeErrorMsg = err.data.message;
      });
    }
    getDataTypes();

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

    function getScWiseCallerList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        $scope.callerList = data;
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }
    getScWiseCallerList();

    $scope.tcAdminStatsGrid = {
      paginationPageSizes: [25, 50, 75],
      paginationPageSize: 25,
      enableFiltering: true,
      enableColumnResizing: true,
      enableSorting: true,
      columnDefs: [
        { name: 'slNo', displayName: 'Sl No.', width: 80},
        { name: 'customer_name', displayName: 'Customer Name'},
        { name: 'customer_mobile', displayName: 'Mobile'},
        { name: 'serviceDueType', displayName: 'Service Type'},
        { name: 'serviceDueDate', displayName: 'Date/Time'},
        { name: 'apptStatus', displayName: 'Status'},
        { name: 'apptSubStatus', displayName: 'Sub Status'},
        { name: 'record', displayName: 'Call Record', cellTemplate: '<div><center><button class="btn btn-primary btn-sm" style="background-color: #0083ca;color:#FFFFFF;border-radius: 15px;padding: 0px 25px 0px 25px;outline:0;border:none !important;" ng-click="grid.appScope.getCallRecord(row)">View</button></center></div>', width: 170}]
    };

    $scope.getCallRecord = function (tcData) {
      getTCAppointmentCallRecord(tcData.entity);
      //console.log(tcData);
      var chassisNumber = tcData.entity.chassisNo;
      var dataTypeId = tcData.entity.dataTypeId;
      getAppointmentHistoryData(chassisNumber,dataTypeId);
      $('#callRecordModal').modal();
    };

    function getTCAppointmentCallRecord(tcData) {
      $scope.callRecording = [];
      var apptId = parseInt(tcData.apptId);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallingCallRecordService.query({apptId:apptId,logInId:adminUserId,scId:adminUserScId,token:lsToken}, function(data) {
        $scope.callRecording = data;
       // console.log('callRecording',data);
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

    function getAppointmentHistoryData(chassisNo,dataTypeId) {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerPerticularAppointmentHistoryDataService.query({chassisNo:chassisNo,id:adminUserScId,dataTypeId:dataTypeId,token:lsToken},function (data) {
        // console.log(data);
        $scope.tcAppointmentHistoryData = data;
      }, function (err) {
        $scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
      });
    }


    var selectedServiceCenter;
    var selectedBikeType;
    var selectedAMCCount;
    var selectedValidMonth;

    $scope.getSelectedServiceCenter = function (selServiceCenter) {
      console.log(selServiceCenter);
      selectedServiceCenter = selServiceCenter;
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


    /* Excel Upload */
    var oFileIn;

    $(function() {
      oFileIn = document.getElementById('teleCallingSMSXlFileInput');
      if(oFileIn.addEventListener) {
        oFileIn.addEventListener('change', filePicked, false);
      }
    });

    var teleCallerXlToJson, teleCallerXlErrorRowNum, teleCallerXlErrorMsg, teleCallerXlInvalidDateFlag ;
    var uploadStatus;
    var fileColumnNames = [];
   // var uploadColumn = {};
    $('#uploadDataMapping').hide();
    $('#uploadDataMappingForServiceRemainder').hide();
    $('#uploadDataMappingForSalesFeedback').hide();
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
        if(selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack'){
          $('#uploadDataMapping').show();
          $('#uploadDataMappingForServiceRemainder').hide();
          $('#uploadDataMappingForSalesFeedback').hide();
          $('html, body').animate({
            'scrollTop' : $("#uploadDataMapping").position().top
          });
        }
       else if(selectedDataDesc ==='Service Reminder' || selectedDataDesc ==='Service Remainder'){
         // $scope.MappingForServiceRemainder = true;
          $('#uploadDataMappingForServiceRemainder').show();
          $('#uploadDataMappingForSalesFeedback').hide();
          $('#uploadDataMapping').hide();
          $('html, body').animate({
            'scrollTop' : $("#uploadDataMappingForServiceRemainder").position().top
          });
        }
          else if(selectedDataDesc ==='Sales FeedBack'){
            // $scope.MappingForServiceRemainder = true;
            $('#uploadDataMappingForSalesFeedback').show();
            $('#uploadDataMappingForServiceRemainder').hide();
            $('#uploadDataMapping').hide();
            $('html, body').animate({
              'scrollTop' : $("#uploadDataMappingForSalesFeedback").position().top
            });
          }
        }, 1000);
        //getUploadedFileColumnNames();

        //$scope.loading = true;
        // Get The File From The Input
        var oFile = oEvent.target.files[0];
        //console.log('oFile',oFile);
        var sFilename = oFile.name;
        // Create A File Reader HTML5
        console.log(sFilename.substr(-5));
        if(sFilename.substr(-4) !== '.xls') {/*&& sFilename.substr(-5) !== '.xlsx'*/
          $window.alert('Only .xls file format is allowed');
          $('#uploadDataMapping').hide();
          $('#uploadDataMappingForServiceRemainder').hide();
          $('#uploadDataMappingForSalesFeedback').hide();
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
    $scope.dateFormat = ['yyyy/mm/dd','mm/dd/yyyy'];

    /*mapping data start*/
    var uploadedServiceDueDate;
    $scope.mapUplodedData = function (mappedColumn) {
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
           /* teleCallerXlRowObj.presentServiceDueDate = teleCallerXlToJson[m1][mappedColumn.serviceDueDate];
           */
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

            teleCallerXlRowObjToUploadJobcardData.registrationNo = teleCallerXlToJson[m1][mappedColumn.regNo];
            teleCallerXlRowObjToUploadJobcardData.customerName = teleCallerXlToJson[m1][mappedColumn.customerName ];
            teleCallerXlRowObjToUploadJobcardData.mobile = teleCallerXlToJson[m1][mappedColumn.mobile];

            teleCallerXlRowObjToUploadJobcardData.dealerId = adminUserScId;
            teleCallerXlRowObjToUploadJobcardData.branchId = selectedServiceCenter;
            teleCallerXlRowObjToUploadJobcardData.chassisNo = teleCallerXlToJson[m1][mappedColumn.chassisNo];
            teleCallerXlRowObjToUploadJobcardData.jobCardDate = teleCallerXlToJson[m1][mappedColumn.serviceDate];
            teleCallerXlRowObjToUploadJobcardData.bikeModel = teleCallerXlToJson[m1][mappedColumn.bikeModel];
            teleCallerXlRowObjToUploadJobcardData.serviceType = teleCallerXlToJson[m1][mappedColumn.serviceType];
            teleCallerXlRowObjToUploadJobcardData.bikeBrand = loginBrandName;
            teleCallerXlRowObjToUploadJobcardData.dateFormat = mappedColumn.dateFormat;
            teleCallerXlRowObjToUploadJobcardData.version = loggedInVersionCode;

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


            if(selectedDataType !=='3' && selectedDataType !=='5' && (selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack')){
              teleCallerFilteredXlData.push(teleCallerXlRowObj);
            }else if(selectedDataType ==='3'){
              teleCallerFilteredXlData.push(teleCallerXlRowObjToUploadJobcardData);
            }
            else if(selectedDataDesc ==='Service Reminder' ||selectedDataDesc ==='Service Remainder'){
              teleCallerFilteredXlData.push(teleCallerXlRowObjToUploadServiceReminderData);
            }
            else if(selectedDataDesc ==='Sales FeedBack'){
              teleCallerFilteredXlData.push(teleCallerXlRowObjToUploadSalesFeedbackData);
            }else if(selectedDataType ==='5'){
              teleCallerFilteredXlData.push(teleCallerXlRowObj);
            }
            // teleCallerFilteredXlData.push(teleCallerXlRowObj);
          }
         // console.log('test----',teleCallerFilteredXlData);

          if(!$scope.csvUploadStatus){
            if(selectedDataType !=='3' && selectedDataType !=='5' && (selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack')){
              uploadTelecallerData(teleCallerFilteredXlData);
            }else if(selectedDataType ==='3'){
              uploadTelecallerJobcardData(teleCallerFilteredXlData);
            } else if(selectedDataDesc ==='Service Reminder' || selectedDataDesc ==='Service Remainder'){
              uploadTelecallerServiceReminderData(teleCallerFilteredXlData);
            } else if(selectedDataDesc ==='Sales FeedBack'){
              uploadTelecallerSalesFeedbackData(teleCallerFilteredXlData);
            }else if(selectedDataType ==='5'){
              uploadTelecallerAMCData(teleCallerFilteredXlData);
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
            if(selectedDataType !=='3' && selectedDataType !=='5' && (selectedDataDesc !=='Service Reminder' && selectedDataDesc !=='Service Remainder' && selectedDataDesc !=='Sales FeedBack')){
              uploadTelecallerRegularData(teleCallerFilteredXlData);
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

    function uploadTelecallerData(uploadDataInput) {
      //console.log('regular data request :',uploadDataInput);
      console.log(JSON.stringify(uploadDataInput));
      $scope.loading = true;
      $scope.loadingMapping = true;
      $scope.uploadColumn = {};
      $scope.MapUploadDataForm.$setPristine();
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerExcelUploadService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        $window.alert(data.message);
        getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);
        //   console.log('upload response regular data :',data);
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
    }

    function uploadTelecallerJobcardData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      //console.log('jobcard request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
     console.log(JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadJobcardDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        $window.alert(data.message);
        getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);
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
    }


    function uploadTelecallerServiceReminderData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
     //console.log('service reminder request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
       console.log(JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadServiceReminderDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        $window.alert(data.message);
        getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
         console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
    }

    function uploadTelecallerSalesFeedbackData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      //console.log('service reminder request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadSalesFeedbackDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        $window.alert(data.message);
        getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
    }

    function uploadTelecallerAMCData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      console.log('AMC Data request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(uploadDataInput));
      TeleCallerExcelUploadAMCDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        $window.alert(data.message);
        getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
    }


    function uploadTelecallerRegularData(uploadDataInput) {
      $scope.loading = true;
      $scope.loadingMapping = true;
      console.log('AMC Data request :',uploadDataInput);
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(JSON.stringify(uploadDataInput));
      TeleCallerCSVUploadRegularDataService.save({id:adminUserScId,token:lsToken},uploadDataInput,function(data){
        $window.alert(data.message);
        getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
        fileColumnNames = [];
        $('#uploadDataMapping').hide();
        $('#uploadDataMappingForServiceRemainder').hide();
        $('#uploadDataMappingForSalesFeedback').hide();
        $('input[type="file"]').val(null);
        // $window.location.reload();
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
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



    var jobcardList = [];
   // var jobCardData = [];
    $scope.jobcardMonthData = [];
    var jobCardCount = [];
    $scope.jobcardCountData = [];
    $scope.getTCJobcardData = function(selectedBranchId){
      jobCardCount = [];
      $scope.jobcardMonthData = [];
      $scope.jobcardCountData = [];
      if(selectedBranchId === null){
        selectedBranchId = 'sc';
      }
      console.log('selectedBranchId',selectedBranchId);
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerJobCardDataService.query({scId:adminUserScId,branchId:selectedBranchId,token:lsToken},function (data) {
       console.log('jobcard list',data);
        jobcardList = data;
        //console.log(JSON.stringify(data));
        for (var k = 0; k < jobcardList.length; k++) {
          if(jobcardList[k] !==null){
           // jobCardData.push({label: jobcardList[k].month, y: parseInt(jobcardList[k].count)});
            $scope.jobcardMonthData.push(jobcardList[k].month);
            jobCardCount.push(parseInt(jobcardList[k].count));
          }
        }
       // console.log(JSON.stringify(jobCardData));
        $scope.jobcardCountData.push(jobCardCount);
        $scope.jobcardSeries = ['Count '];
       // console.log(JSON.stringify($scope.jobcardMonthData));
        //console.log(JSON.stringify($scope.jobcardCountData));
        //chart.render();
      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    };

    $scope.getTCJobcardData('sc');


   // window.onload = function () {

    /*  var chart = new CanvasJS.Chart("chartContainer", {
        theme:"light2",
        animationEnabled: true,
        title:{
          text: ""
        },
        axisY :{
          includeZero: false,
          title: "Calls Count",
          suffix: ""
        },
        toolTip: {
          shared: "true"
        },
        legend:{
          cursor:"pointer",
          itemclick : toggleDataSeries
        },
        data: [
          {
            type: "spline",
            showInLegend: true,
            yValueFormatString: "",
            name: "Count",
            dataPoints: jobCardData
          }]
      });
      //chart.render();

      function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        chart.render();
      }
*/
   // }
    $scope.callerStatsGraphColors = [];
    var callerStatsList = [];
    $scope.callerNamesData = [];
    var callerCallCount = [];
    $scope.callerCallCountData = [];
    var updatedTime = [];
    $scope.updatedTime = [];
    $scope.callerCallCountSeries = [];
    function getCallerStatsData() {
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerCallStatsDataService.query({scId:adminUserScId,token:lsToken},function (data) {
        console.log('caller stats data',data);
        callerStatsList = data;
        //console.log(JSON.stringify(data));
        for (var k = 0; k < callerStatsList.length; k++) {
          if(callerStatsList[k] !==null){

           /* if(callerStatsList[k].update_ts === undefined){
              callerStatsList[k].update_ts = '';
            }*/

            // jobCardData.push({label: jobcardList[k].month, y: parseInt(jobcardList[k].count)});
           // $scope.callerNamesData.push(callerStatsList[k].callername);
            if(callerStatsList[k].update_ts === ""){
              callerStatsList[k].update_ts = 'NA';
            }
            $scope.callerNamesData.push(callerStatsList[k].callername+ '('+callerStatsList[k].update_ts+')');
            if(callerStatsList[k].status === 'red'){
              callerStatsList[k].status = '#FF0000';
              //$scope.callerStatsGraphColors =['#FF0000'];
            }
             if(callerStatsList[k].status === 'green'){
              callerStatsList[k].status = '#008000';
              //$scope.callerStatsGraphColors =['#008000'];
            }
            $scope.callerStatsGraphColors.push(callerStatsList[k].status);
            //console.log('test test : ',$scope.callerStatsGraphColors);
            //$scope.callerStatsGraphColors.push(callerStatsList[k].status);

             callerCallCount.push(parseInt(callerStatsList[k].apptCount));
             console.log('callerCallCount',callerCallCount);
             //updatedTime.push('Call Count',callerStatsList[k].update_ts);

           /* if(callerStatsList[k].update_ts === ""){
              callerStatsList[k].update_ts = 'NA';
            }
            $scope.updatedTime.push(callerStatsList[k].update_ts);
            console.log('$scope.updatedTime++++',$scope.updatedTime);
           */ console.log(callerStatsList[k].update_ts);
            //$scope.callerCallCountSeries.push(updatedTime);
          }
        }


        $scope.callerCallCountSeries.push(updatedTime);
        console.log(JSON.stringify($scope.callerStatsGraphColors));
      //  callerCallCount.push([0]);
        // console.log(JSON.stringify(jobCardData));
        $scope.datasetOverride = [
          {
            fill: true,
            backgroundColor: $scope.callerStatsGraphColors
          }];
        $scope.callerCallCountSeries = ['Call Count'];
        console.log('$scope.callerCallCountSeries',$scope.callerCallCountSeries);
        $scope.callerCallCountData.push(callerCallCount);
       // $scope.callerCallCountData.push([0,0]);

      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
      setTimeout(getCallerStatsData, 300000);
      $scope.callerStatsGraphColors = [];
      var callerStatsList = [];
      $scope.callerNamesData = [];
      var callerCallCount = [];
      $scope.callerCallCountData = [];
    }
    getCallerStatsData();

    //setTimeout(getCallerStatsData, 100);

    /* $scope.labels = $scope.callerNamesData;
        $scope.series = ['  Call Count '];

        $scope.data = $scope.callerCallCountData;

    */

    //$scope.options = {legend: {display: true}};


    $scope.chartParamsCallerStats = {
      options: {
        //barShowStroke: false,
        scales: {
          yAxes: [{id: 'y-axis-1', ticks: { beginAtZero:true,min: 0}}]
        }
      }
    };

    /*$scope.getFeedbackRatingDetails = function () {
      //getFeedbackRatings();
    //  $scope.feedbackDetailStatus = $scope.feedbackDetailStatus ? false : true;
    };*/

/*FEEDBACCK RATING IN ADMIN*/
    /*var satisfiedTotal = [];
    var notSatisfiedTotal= [];
    $scope.satisfiedTotal = 0;
    $scope.notSatisfiedTotal = 0;
    function getFeedbackRatings (fromDate,toDate,branch,caller,dataType) {
      console.log('getFeedbackRatings input : ',fromDate,toDate,branch,caller,dataType);
      $scope.loadingFeedbackBlock = true;
      var lsToken = TokenService.getToken(adminUserScId);
      /!*selFromDatedata = fromDate;
      selToDateData = toDate;
      selSeviceCenter = branch;
      selDataType = caller;
      selCaller = dataType;*!/
      TeleCallerFeedbackRatingService.query({fromDate:fromDate,toDate:toDate,tcId:adminUserId,id:adminUserScId,branchId:branch,callerId:caller,datatypeId:dataType,token:lsToken},function (data) {
        $scope.feedbackRatings = data;
        $scope.loadingFeedbackBlock = false;
        console.log('feedbackRatings',data);
      for (var i= 0; i < $scope.feedbackRatings.length;i++){
        satisfiedTotal.push(parseInt($scope.feedbackRatings[i].Satisfied));
        notSatisfiedTotal.push(parseInt($scope.feedbackRatings[i].notSatisfied));
        }
        var totalSatisfied=0;
        var totalNotSatisfied=0;
        for(var satisfied =0;satisfied< satisfiedTotal.length;satisfied++)
        { totalSatisfied += satisfiedTotal[satisfied]; }

        for(var notSatisfied =0;notSatisfied< satisfiedTotal.length;notSatisfied++)
        { totalNotSatisfied += notSatisfiedTotal[notSatisfied]; }

        $scope.satisfiedTotal =totalSatisfied;
        $scope.notSatisfiedTotal =totalNotSatisfied;
         satisfiedTotal = [];
         notSatisfiedTotal= [];
      }, function (err) {
        $scope.feedbackRatings = [];
        console.log('TESTING feed error');
        console.log('feedbackRatings err: ',err);
        $scope.loadingFeedbackBlock = false;
        $scope.feedbackRatingsErrorMsg = err.message;
      });
    }*/


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
      csvObject ={
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

      //console.log('csv File Object',csvServiceReminderObject);
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
        $window.alert(data.message);
        getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
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
        $window.alert(data.message);
        getTcAdminDashboardStats(selFromDatedata,selToDateData,selSeviceCenter,selDataType,selCaller);
        // console.log('upload response service reminder :',data);
        $scope.loading = false;
        $scope.loadingMapping = false;
      },function(err){
        console.log(err);
        $scope.loading = false;
        $scope.loadingMapping = false;
        $window.alert(err.data.error);
      });
    }

   //$scope.fileUploadStatus = true;
  });
