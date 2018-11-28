'use strict';

angular.module('letsService')
  .controller('CrmSupportStatsController', function ($scope,$timeout,$filter,serviceURL,$state,$window,TokenService,$rootScope,ngTableParams,GetSupportDealerListService,GetDealerOverallStatsService,GetBrandListService,GetDealerStatsByBrandNameService,GetSupportDealerStatsService,GetFiveDaysDealerStatsService,GetDealerLiveSupportStatsService,GetDealerDetailedStatsService,GetDealerDetailsService,GetOverallBrandStatsService,GetDealerTopPerformanceStatsService,SendRenewalEmailService,BrandWiseModelService,GetBrandServiceSchedulesService,GetSuperAdminDealerListService,ClickToCallService,UpdateSupportCallStatusService) {
 
   var supportLoginId = $window.sessionStorage.getItem('loggedInSupportId');
   var supportRole = $window.sessionStorage.getItem('loggedInSupportRole');
   var supportMobile = $window.sessionStorage.getItem('loginMobile');
   $scope.supportRole = $window.sessionStorage.getItem('loggedInSupportRole');

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

    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

   //var adminUserId = '369';
   var adminUserId = supportLoginId;
   
   function getSupportDealerList () {
      var lsToken = TokenService.getToken(adminUserId);
      GetSupportDealerListService.query({logInId:adminUserId,role:supportRole,token:lsToken}, function(data) {
        $scope.dealerList = data;
        console.log('dealerList +++',data);
      }, function(err) {
        $scope.dealerListErrorMsg = err.data.message;
      });
    }
    getSupportDealerList();

   /* function getSuperAdminDealerList () {
      var lsToken = TokenService.getToken(adminUserId);
      GetSuperAdminDealerListService.query({logInId:adminUserId,token:lsToken}, function(data) {
        $scope.dealerList = data;
        console.log('dealerList +++',data);
      }, function(err) {
        $scope.dealerListErrorMsg = err.data.message;
      });
    }
    getSuperAdminDealerList ();
    */

   var selectedBrand = 'all';
   function getSupportDealerStats () {
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserId);
      GetSupportDealerStatsService.get({brand:selectedBrand,logInId:adminUserId,token:lsToken}, function(data) {
        $scope.dealerStats = data;
        showLoader(false);
        console.log('Support Dealeer Stats +++',data);
      }, function(err) {
        showLoader(false);
        $scope.dealerStatsErrorMsg = err.data.message;
      });
    }
    getSupportDealerStats();


   var adminUserScId;
   $scope.getSelectedDealer = function (selDealer,status) {
      console.log(selDealer);
      adminUserScId = selDealer;
      
      if(status === 'liveStats'){
        if(selDealer === null || selDealer === undefined){
         selectedTypeForLiveStats = 'all';
         selectedValueForLiveStats = 'all';
        }
        //getDealerLiveStats();
        //$scope.dealerStatsLiveChart = {};
      } else if(status === 'overAll'){
        if(selDealer === null || selDealer === undefined){
          selectedTypeForDealerStats = 'all';
          selectedValueForDealerStats = 'all';
        }
         getDealerOverallStats();
      } else if(status === 'fiveDays'){
      if(selDealer === null || selDealer === undefined){
         selectedTypeForFiveDaysStats = 'all';
         selectedValueForFiveDaysStats = 'all';
      }
         getDealerFiveDaysStats();
      }       
   };
  
     
   function getBrandList () {
      var lsToken = TokenService.getToken(adminUserId);
      GetBrandListService.query({logInId:adminUserId,token:lsToken}, function(data) {
        console.log('brandList +++',data);
        $scope.brandList = data;
      }, function(err) {
        $scope.brandListErrorMsg = err.data.message;
      });
    }
     getBrandList();

   $scope.getSelectedBrand = function (selBrand,status) {
      console.log(selBrand);
      console.log(status);
      selectedBrand = selBrand;
      //selectedBrandName = selBrand;
      if(selBrand === null || selBrand === undefined){
         selectedBrand = 'all';
         selectedTypeForDealerStats = 'all';
         selectedValueForDealerStats = 'all';
      }
      if(status !== 'Performance'){
       getSupportDealerStats();
       getDealerOverallStats();
      // getDealerStatsByBrandName();
       getDealerFiveDaysStats();
      }
      //$scope.dealerStatsLiveChart = {};
      //getDealerLiveStats();
      if(status === 'Performance'){
         getDealerTopPerformanceStats();
      }
   };



var selectedCalender = 'Daily';
var selectedCalenderOverall = 'Daily';
var selectedTypeForDealerStats = 'all';
var selectedValueForDealerStats = 'all';
var selectedTypeForFiveDaysStats = 'all';
var selectedValueForFiveDaysStats = 'all';
var selectedTypeForLiveStats = 'all';
var selectedValueForLiveStats = 'all';
$scope.attemptedColors = ['#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F'];
$scope.connectedColors = ['#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900'];
$scope.appointmentsColors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.scComplaintColors = ['#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca'];

$scope.callerWiseConversionSeries = ['Total Calls Made','Connected', 'Appointments Taken', 'SC Complaints'];
$scope.callerWiseConversionData = [];
$scope.callerWiseConversionLables = [];
var callerWiseConnectedCalls = [];
var callerWiseAppointmentTaken = [];
var totalCallsMade = [];
var callerScComplaints = [];
/*$scope.callerWiseConnectedTotal = 0;
$scope.callerWiseAppointmentTakenTotal = 0;
$scope.callerWiseConvertedTotal = 0;*/
$scope.callerWiseConversionChart = {};
function getDealerOverallStats() {
  $scope.dataErrorMsgFourMonthConversion = false;
  $scope.callerWiseConversionChart = {};
  $scope.callerWiseConversionData = [];
$scope.callerWiseConversionLables = [];
 callerWiseConnectedCalls = [];
 callerWiseAppointmentTaken = [];
 totalCallsMade = [];
 callerScComplaints = [];
if($scope.selectedDealerOverall){
  selectedTypeForDealerStats = 'scId'
  selectedValueForDealerStats = adminUserScId;
} else if($scope.selectedBrand){
  selectedTypeForDealerStats = 'brandName'
  selectedValueForDealerStats = selectedBrand;
}

      $scope.loaderIconFourMonthConversion = true;
      var lsToken = TokenService.getToken(adminUserId);
       GetDealerOverallStatsService.get({logInId:adminUserId,type:selectedTypeForDealerStats,value:selectedValueForDealerStats,status:selectedCalenderOverall,token:lsToken},function (data) {
       console.log('Dealer  Stats :::',data);
       $scope.creDashboardDataErrorMsg = '';
       $scope.callerWiseConversionStats = data;
        var callerWiseConversionStats = data;
        if(callerWiseConversionStats.connectedCalls !== undefined && callerWiseConversionStats.connectedCalls !== null){
          angular.forEach(callerWiseConversionStats.connectedCalls,function(val,index){
          callerWiseConnectedCalls.push(parseInt(callerWiseConversionStats.connectedCalls[index].count));
            $scope.callerWiseConversionLables.push(callerWiseConversionStats.connectedCalls[index].label);
       });
        }
        if(callerWiseConversionStats.appointmentTaken !== undefined && callerWiseConversionStats.appointmentTaken !== null){
          angular.forEach(callerWiseConversionStats.appointmentTaken,function(val,index){
          callerWiseAppointmentTaken.push(parseInt(callerWiseConversionStats.appointmentTaken[index].count));
        });
        }
        if(callerWiseConversionStats.totalCallsMade !== undefined && callerWiseConversionStats.totalCallsMade !== null){
          angular.forEach(callerWiseConversionStats.totalCallsMade,function(val,index){
          totalCallsMade.push(parseInt(callerWiseConversionStats.totalCallsMade[index].count));
         });
        }
        if(callerWiseConversionStats.serviceCenterComplaint !== undefined && callerWiseConversionStats.serviceCenterComplaint !== null){
          angular.forEach(callerWiseConversionStats.serviceCenterComplaint,function(val,index){
          callerScComplaints.push(parseInt(callerWiseConversionStats.serviceCenterComplaint[index].count));
         });
        }
        
        $scope.callerWiseConversionData.push(totalCallsMade);
        $scope.callerWiseConversionData.push(callerWiseConnectedCalls);
        $scope.callerWiseConversionData.push(callerWiseAppointmentTaken);
        $scope.callerWiseConversionData.push(callerScComplaints);
        
        console.log(JSON.stringify($scope.callerWiseConversionData));
        console.log(JSON.stringify($scope.callerWiseConversionLables));
        console.log(JSON.stringify($scope.callerWiseConversionSeries));


 $scope.filteredCallerWiseConversionData = [];
       $scope.filteredCallerWiseConversionLables = [];
for(var i=0;i<4;i++){
$scope.filteredCallerWiseConversionData.push($scope.callerWiseConversionData[i]);
}
/*for(var i=0;i<10;i++){
$scope.filteredCallerWiseConversionLables.push($scope.callerWiseConversionLables[i]);
}*/

        $scope.callerWiseConversionChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.callerWiseConversionLables ,
            series: $scope.callerWiseConversionSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92', '#0083ca'],
            data: $scope.filteredCallerWiseConversionData 
        };
        
        $scope.datasetOverrideCallerWiseConversionData = [
             {
                fill: true,
                backgroundColor: $scope.attemptedColors
            },
            {
                fill: true,
                backgroundColor:$scope.connectedColors
            },
            {
                fill: true,
                backgroundColor: $scope.appointmentsColors
            },
            {
                fill: true,
                backgroundColor: $scope.scComplaintColors
            },
            ];

        $scope.loaderIconFourMonthConversion = false;
      }, function(err) {
        $scope.dataErrorMsgFourMonthConversion = true;
        $scope.loaderIconFourMonthConversion = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }

    getDealerOverallStats();



/*
$scope.dealerStatsByBrandSeries =['Total Calls Made','Connected', 'Appointments Taken', 'SC Complaints'];
$scope.dealerStatsByBrandData = [];
$scope.dealerStatsByBrandLables = [];
var callerWiseConnectedCallsByBrand = [];
var callerWiseAppointmentTakenByBrand = [];
var totalCallsMadeByBrand = [];
var callerScComplaintsByBrand = [];
$scope.dealerStatsByBrandChart = {};
var selectedBrandName = 'Honda';
function getDealerStatsByBrandName() {
  $scope.dataErrorMsgDealerStatsByBrand = false;
  $scope.dealerStatsByBrandChart = {};
  $scope.dealerStatsByBrandData = [];
  $scope.dealerStatsByBrandLables = [];
 callerWiseConnectedCallsByBrand = [];
 callerWiseAppointmentTakenByBrand = [];
 totalCallsMadeByBrand = [];
 callerScComplaintsByBrand = [];
      $scope.loaderIconDealerStatsByBrand = true;
      var lsToken = TokenService.getToken(adminUserId);
       GetDealerStatsByBrandNameService.get({logInId:adminUserId,brandName:selectedBrandName,token:lsToken},function (data) {
       console.log('Dealer  Stats  Brand Wise:::',data);
       $scope.creDashboardDataErrorMsg = '';
        $scope.dealerStatsByBrand = data;
        var dealerStatsByBrand = data;
        $scope.chartHeight = parseInt(data.connectedCalls.length)*40;
        if(dealerStatsByBrand.connectedCalls !== undefined && dealerStatsByBrand.connectedCalls !== null){
          angular.forEach(dealerStatsByBrand.connectedCalls,function(val,index){
          callerWiseConnectedCallsByBrand.push(parseInt(dealerStatsByBrand.connectedCalls[index].count));
            $scope.dealerStatsByBrandLables.push(dealerStatsByBrand.connectedCalls[index].serviceCenterName);
       });
        }
        if(dealerStatsByBrand.appointmentTaken !== undefined && dealerStatsByBrand.appointmentTaken !== null){
          angular.forEach(dealerStatsByBrand.appointmentTaken,function(val,index){
          callerWiseAppointmentTakenByBrand.push(parseInt(dealerStatsByBrand.appointmentTaken[index].count));
        });
        }
        if(dealerStatsByBrand.totalCallsMade !== undefined && dealerStatsByBrand.totalCallsMade !== null){
          angular.forEach(dealerStatsByBrand.totalCallsMade,function(val,index){
          totalCallsMadeByBrand.push(parseInt(dealerStatsByBrand.totalCallsMade[index].count));
         });
        }
        if(dealerStatsByBrand.serviceCenterComplaint !== undefined && dealerStatsByBrand.serviceCenterComplaint !== null){
          angular.forEach(dealerStatsByBrand.serviceCenterComplaint,function(val,index){
          callerScComplaintsByBrand.push(parseInt(dealerStatsByBrand.serviceCenterComplaint[index].count));
         });
        }
        
        $scope.dealerStatsByBrandData.push(totalCallsMadeByBrand);
        $scope.dealerStatsByBrandData.push(callerWiseConnectedCallsByBrand);
        $scope.dealerStatsByBrandData.push(callerWiseAppointmentTakenByBrand);
        $scope.dealerStatsByBrandData.push(callerScComplaintsByBrand);
       


 $scope.filteredDealerStatsByBrandData = [];
  for(var i=0;i<4;i++){
$scope.filteredDealerStatsByBrandData.push($scope.dealerStatsByBrandData[i]);
}

        $scope.dealerStatsByBrandChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.dealerStatsByBrandLables ,
            series: $scope.dealerStatsByBrandSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92', '#0083ca'],
            data: $scope.filteredDealerStatsByBrandData
        };
        
        $scope.datasetOverrideDealerStatsByBrandData = [
             {
                fill: true,
                backgroundColor: $scope.attemptedColors
            },
            {
                fill: true,
                backgroundColor:$scope.connectedColors
            },
            {
                fill: true,
                backgroundColor: $scope.appointmentsColors
            },
            {
                fill: true,
                backgroundColor: $scope.scComplaintColors
            },
            ];

        $scope.loaderIconDealerStatsByBrand = false;
      }, function(err) {
        $scope.dataErrorMsgDealerStatsByBrand = true;
        $scope.loaderIconDealerStatsByBrand = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }

    getDealerStatsByBrandName();
*/
 var selGraphStatus;
 var selStatusForDealer;
 $scope.exportType = false;
 $scope.getDealerDetailedStats = function(status){
  $scope.statusForDetails = status;
  if(status === 'dealerCount'){
    $scope.detailedHeader = 'Total Active Dealers';
  } else if(status === 'callerCount'){
    $scope.detailedHeader = 'Total Active Callers';
  } else if(status === 'onboardCount'){
    $scope.detailedHeader = 'Onboarded Dealers for current Month';
  } else if(status === 'renewalCount'){
    $scope.exportType = false;
    $scope.detailedHeader = 'No. of Dealers to be Renewal for current Month';
  } else if(status === 'paymentCount'){
    $scope.exportType = false;
    $scope.detailedHeader = 'No of Dealers who purchased the SMS for current Month';
  } else if(status === 'smsReacharge'){
    $scope.exportType = true;
    selStatusForDealer = status;
    $scope.detailedHeader = 'No of Dealers who needs to be Recharge SMS';
    getDealerDetailedStats('date');
  } else if(status === 'salesUpload'){
    $scope.exportType = true;
    selStatusForDealer = status;
    getDealerDetailedStats('date');
    $scope.detailedHeader = 'Dealers who delayed in Uploading Sales Data';
  } else if(status === 'jobcardUpload'){
    $scope.exportType = true;
    selStatusForDealer = status;
    $scope.detailedHeader = 'Dealers who delayed in Uploading Jobcard Data';
    getDealerDetailedStats('date');
  } else if(status === 'nonPerformer'){
    $scope.exportType = true;
    selStatusForDealer = status;
    $scope.detailedHeader = 'Last 3 Days Non Performing Dealers';
    getDealerDetailedStats('date');
  } else if(status === 'serviceSchedule'){
    selStatusForDealer = status;
    $scope.detailedHeader = 'Dealers Service Schedule';
    //getDealerDetailedStats('date');
  }
  if(status !== 'smsReacharge' && status !== 'nonPerformer' && status !=='jobcardUpload' && status !=='salesUpload' && status !== 'serviceSchedule'){
    getDealerCountMonthWise(status);
  }
  
 }

    var selectedGraphStatus;
    $scope.getDealerDetails = function (statsCount) {
      console.log('status :  :',Array.isArray(statsCount));
      if(Array.isArray(statsCount) === true) {
        console.log('graph model :  :',statsCount[0]);
        console.log('graph lable :  :',statsCount[0]._model.label);
        console.log('graph lable status :  :',statsCount[0]._model.datasetLabel);
        console.log('selected status::',selStatusForDealer);
        selectedGraphStatus = statsCount[0]._model.label;
        //if(selectedGraphStatus.toLowerCase().includes(' ')){
          var index = selectedGraphStatus.indexOf(' ');
          console.log('index ::',index);
          selectedGraphStatus = selectedGraphStatus.substring(0, index);
       // }
      }
      else if(Array.isArray(statsCount) === false){
       
      }
      console.log('Filered Date :: ',selectedGraphStatus);
      if(selStatusForDealer !== 'dealerCount' && selStatusForDealer !== 'callerCount'){
       getDealerDetailedStats(selectedGraphStatus);
      }
    };
  
  var reportType = 'submit'; 
  $rootScope.creTableData = [];
  function getDealerDetailedStats(status) {
      console.log('reportType',reportType);
      showLoader(true);
      selGraphStatus = status;
      var lsToken = TokenService.getToken(adminUserId);
      if(reportType === 'export'){
        $window.open(serviceURL+'ls_connect_sub_dealers_details/'+adminUserId+'/'+selectedBrand+'/'+selStatusForDealer+'/'+selGraphStatus+'/'+reportType+'/'+lsToken);
        console.log(serviceURL+'ls_connect_sub_dealers_details/'+adminUserId+'/'+selectedBrand+'/'+selStatusForDealer+'/'+selGraphStatus+'/'+reportType+'/'+lsToken);
        reportType = 'submit';
      }
      else if(reportType === 'submit'){
         GetDealerDetailsService.query({logInId:adminUserId,brand:selectedBrand,status:selStatusForDealer,date:selGraphStatus,exportType:reportType,token:lsToken},function (data) {
       console.log('Dealer DETAILS :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#dealerDetailedDataTableModal").modal('show');
        showLoader(false);
      }, function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#dealerDetailedDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
      }
       
  }

  $scope.exportDealerDetails =function(){
    reportType = 'export';
    getDealerDetailedStats('date');
  }

$scope.dealerStatsByMonthSeries =['Dealer Count'];
$scope.dealerStatsByMonthData = [];
$scope.dealerStatsByMonthLables = [];
var dealerCountByMonth = [];
$scope.totalPayment = 0;
$scope.dealerCountByMonthChart = {};
function getDealerCountMonthWise(status) {
  $scope.totalPayment = 0;
  console.log(selectedBrand);
  selStatusForDealer = status;
  $scope.dataErrorMsgDealerStatsByMonth = false;
  $scope.dealerCountByMonthChart = {};
  $scope.dealerStatsByMonthData = [];
  $scope.dealerStatsByMonthLables = [];
  dealerCountByMonth = [];
 
      $scope.loaderIconDealerStatsByMonth = true;
      var lsToken = TokenService.getToken(adminUserId);
       GetDealerDetailedStatsService.query({logInId:adminUserId,brand:selectedBrand,status:selStatusForDealer,token:lsToken},function (data) {
       console.log('Dealer DEtailed Stats:::',data);
       $scope.creDashboardDataErrorMsg = '';
        var dealerStatsByMonth = data;
               // $scope.totalPayment = data.amountPaid;
        angular.forEach(dealerStatsByMonth,function(val,index){
          if(!dealerStatsByMonth[index].amountPaid){
          dealerCountByMonth.push(parseInt(dealerStatsByMonth[index].count));
          $scope.dealerStatsByMonthLables.push(dealerStatsByMonth[index].label);
          } else if(dealerStatsByMonth[index].amountPaid) {
            $scope.totalPayment = parseInt(dealerStatsByMonth[index].amountPaid);
          }
        })
       console.log(' $scope.totalPayment', $scope.totalPayment);
        
        $scope.dealerStatsByMonthData.push(dealerCountByMonth);
        console.log(JSON.stringify($scope.dealerStatsByMonthData));
        console.log(JSON.stringify($scope.dealerStatsByMonthLables));
        //console.log(JSON.stringify($scope.dealerStatsByMonthLables));


 $scope.filteredDealerStatsByMonthData = [];
       //$scope.filteredCallerWiseConversionLables = [];
for(var i=0;i<1;i++){
$scope.filteredDealerStatsByMonthData.push($scope.dealerStatsByMonthData[i]);
}
/*for(var i=0;i<10;i++){
$scope.filteredCallerWiseConversionLables.push($scope.callerWiseConversionLables[i]);
}*/

  $scope.dealerCountByMonthChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.dealerStatsByMonthLables ,
            series: $scope.dealerStatsByMonthSeries,
            colors: ['#0083ca'],
            data: $scope.filteredDealerStatsByMonthData
        };
        
        $scope.datasetOverrideDealerStatsByMonthData = [
            {
                fill: true,
                backgroundColor: $scope.scComplaintColors
            },
            ];

        $scope.loaderIconDealerStatsByMonth = false;
      }, function(err) {
        $scope.dataErrorMsgDealerStatsByMonth = true;
        $scope.loaderIconDealerStatsByMonth = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    


$scope.dealerStatsFiveDaysSeries =[ 'Total Calls Made','Connected', 'Appointments Taken', 'SC Complaints'];
$scope.dealerStatsFiveDaysData = [];
$scope.dealerStatsFiveDaysLables = [];
var callerWiseConnectedCallsFiveDays = [];
var callerWiseAppointmentTakenFiveDays = [];
var totalCallsMadeFiveDays = [];
var callerScComplaintsFiveDays = [];
/*$scope.callerWiseConnectedTotal = 0;
$scope.callerWiseAppointmentTakenTotal = 0;
$scope.callerWiseConvertedTotal = 0;*/
$scope.dealerStatsFiveDaysChart = {};
function getDealerFiveDaysStats() {
  $scope.dataErrorMsgDealerStatsFiveDays = false;
  $scope.dealerStatsFiveDaysChart = {};
  $scope.dealerStatsFiveDaysData = [];
  $scope.dealerStatsFiveDaysLables = [];
 callerWiseConnectedCallsFiveDays = [];
 callerWiseAppointmentTakenFiveDays = [];
 totalCallsMadeFiveDays = [];
 callerScComplaintsFiveDays = [];
 if($scope.selectedDealerFiveDays){
  selectedTypeForFiveDaysStats = 'scId'
  selectedValueForFiveDaysStats = adminUserScId;
} else if($scope.selectedBrand){
  selectedTypeForFiveDaysStats = 'brandName'
  selectedValueForFiveDaysStats = selectedBrand;
}

      $scope.loaderIconDealerStatsFiveDays = true;
      var lsToken = TokenService.getToken(adminUserId);
       GetFiveDaysDealerStatsService.get({logInId:adminUserId,type:selectedTypeForFiveDaysStats,value:selectedValueForFiveDaysStats,token:lsToken},function (data) {
       console.log('Dealer  Stats  S DAYS ::::',data);
       $scope.creDashboardDataErrorMsg = '';
       $scope.dealerStatsFiveDays = data;
       var dealerStatsFiveDays = data;
       // $scope.chartHeight = parseInt(data.connectedCalls.length)*40;
        if(dealerStatsFiveDays.connectedCalls !== undefined && dealerStatsFiveDays.connectedCalls !== null){
          angular.forEach(dealerStatsFiveDays.connectedCalls,function(val,index){
          callerWiseConnectedCallsFiveDays.push(parseInt(dealerStatsFiveDays.connectedCalls[index].count));
          $scope.dealerStatsFiveDaysLables.push(dealerStatsFiveDays.connectedCalls[index].date);
       });
        }
        if(dealerStatsFiveDays.appointmentTaken !== undefined && dealerStatsFiveDays.appointmentTaken !== null){
          angular.forEach(dealerStatsFiveDays.appointmentTaken,function(val,index){
          callerWiseAppointmentTakenFiveDays.push(parseInt(dealerStatsFiveDays.appointmentTaken[index].count));
        });
        }
        if(dealerStatsFiveDays.totalCallsMade !== undefined && dealerStatsFiveDays.totalCallsMade !== null){
          angular.forEach(dealerStatsFiveDays.totalCallsMade,function(val,index){
          totalCallsMadeFiveDays.push(parseInt(dealerStatsFiveDays.totalCallsMade[index].count));
         });
        }
        if(dealerStatsFiveDays.serviceCenterComplaint !== undefined && dealerStatsFiveDays.serviceCenterComplaint !== null){
          angular.forEach(dealerStatsFiveDays.serviceCenterComplaint,function(val,index){
          callerScComplaintsFiveDays.push(parseInt(dealerStatsFiveDays.serviceCenterComplaint[index].count));
         });
        }

        $scope.dealerStatsFiveDaysData.push(totalCallsMadeFiveDays);
        $scope.dealerStatsFiveDaysData.push(callerWiseConnectedCallsFiveDays);
        $scope.dealerStatsFiveDaysData.push(callerWiseAppointmentTakenFiveDays);
        $scope.dealerStatsFiveDaysData.push(callerScComplaintsFiveDays);
        
        console.log(JSON.stringify($scope.dealerStatsFiveDaysData));
        console.log(JSON.stringify($scope.dealerStatsFiveDaysLables));
        console.log(JSON.stringify($scope.dealerStatsFiveDaysSeries));


 $scope.filteredDealerStatsFiveDaysData = [];
       //$scope.filteredCallerWiseConversionLables = [];
 for(var i=0;i<4;i++){
 $scope.filteredDealerStatsFiveDaysData.push($scope.dealerStatsFiveDaysData[i]);
 }
 /*for(var i=0;i<10;i++){
 $scope.filteredCallerWiseConversionLables.push($scope.callerWiseConversionLables[i]);
 }*/

        $scope.dealerStatsFiveDaysChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.dealerStatsFiveDaysLables ,
            series: $scope.dealerStatsFiveDaysSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92', '#0083ca'],
            data: $scope.filteredDealerStatsFiveDaysData
        };
        
        $scope.datasetOverrideDealerStatsFiveDaysData = [
             {
                fill: true,
                backgroundColor: $scope.attemptedColors
            },
            {
                fill: true,
                backgroundColor:$scope.connectedColors
            },
            {
                fill: true,
                backgroundColor: $scope.appointmentsColors
            },
            {
                fill: true,
                backgroundColor: $scope.scComplaintColors
            }
            ];

        $scope.loaderIconDealerStatsFiveDays = false;
      }, function(err) {
        $scope.dataErrorMsgDealerStatsFiveDays = true;
        $scope.loaderIconDealerStatsFiveDays = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }

    getDealerFiveDaysStats();


//$scope.dealerStatsLiveSeries =['Total Calls Made','Connected', 'Appointments Taken', 'SC Complaints'];
$scope.dealerStatsLiveSeries =['Total Calls Made'];
$scope.dealerStatsLivesData = [];
$scope.dealerStatsLiveLables = [];
var callerWiseConnectedCallsLive = [];
var callerWiseAppointmentTakenLive = [];
var totalCallsMadeLive = [];
var callerScComplaintsLive = [];
$scope.dealerStatsLiveChart = {};
function getDealerLiveStats() {
  $scope.dataErrorMsgDealerStatsLive = false;
  //$scope.dealerStatsLiveChart = {};
  $scope.dealerStatsLivesData = [];
  $scope.dealerStatsLiveLables = [];
 callerWiseConnectedCallsLive = [];
 callerWiseAppointmentTakenLive = [];
 totalCallsMadeLive = [];
 callerScComplaintsLive = [];
 if($scope.selectedDealerLive){
  selectedTypeForLiveStats = 'scId'
  selectedValueForLiveStats = adminUserScId;
} else if($scope.selectedBrand){
  selectedTypeForLiveStats = 'brandName'
  selectedValueForLiveStats = selectedBrand;
}

      //$scope.loaderIconDealerStatsLive = true;
      var lsToken = TokenService.getToken(adminUserId);
       GetDealerLiveSupportStatsService.get({logInId:adminUserId,type:selectedTypeForLiveStats,value:selectedValueForLiveStats,token:lsToken},function (data) {
       console.log('Dealer  LIve Stats ::::',data);
       $scope.creDashboardDataErrorMsg = '';
       $scope.dealerStatsLive = data;
       var dealerStatsLive = data;
      
        /*if(dealerStatsLive.connectedCalls !== undefined && dealerStatsLive.connectedCalls !== null){
          angular.forEach(dealerStatsLive.connectedCalls,function(val,index){
          callerWiseConnectedCallsLive.push(parseInt(dealerStatsLive.connectedCalls[index].count));
          $scope.dealerStatsLiveLables.push(dealerStatsLive.connectedCalls[index].minute);
       });
        }*/
       /* if(dealerStatsLive.appointmentTaken !== undefined && dealerStatsLive.appointmentTaken !== null){
          angular.forEach(dealerStatsLive.appointmentTaken,function(val,index){
          callerWiseAppointmentTakenLive.push(parseInt(dealerStatsLive.appointmentTaken[index].count));
        });
        }*/
        if(dealerStatsLive.totalCallsMade !== undefined && dealerStatsLive.totalCallsMade !== null){
          angular.forEach(dealerStatsLive.totalCallsMade,function(val,index){
          totalCallsMadeLive.push(parseInt(dealerStatsLive.totalCallsMade[index].count));
          $scope.dealerStatsLiveLables.push(dealerStatsLive.totalCallsMade[index].minute);
         });
        }
        /*if(dealerStatsLive.serviceCenterComplaint !== undefined && dealerStatsLive.serviceCenterComplaint !== null){
          angular.forEach(dealerStatsLive.serviceCenterComplaint,function(val,index){
          callerScComplaintsLive.push(parseInt(dealerStatsLive.serviceCenterComplaint[index].count));
         });
        }*/
        
        $scope.dealerStatsLivesData.push(totalCallsMadeLive);
        //$scope.dealerStatsLivesData.push(callerWiseConnectedCallsLive);
       // $scope.dealerStatsLivesData.push(callerWiseAppointmentTakenLive);
        //$scope.dealerStatsLivesData.push(callerScComplaintsLive);
        
        console.log('LIve',JSON.stringify($scope.dealerStatsLivesData));
        console.log('LIve',JSON.stringify($scope.dealerStatsLiveLables));
        console.log('LIve',JSON.stringify($scope.dealerStatsLiveSeries));


 $scope.filteredDealerStatsLiveData = [];
 for(var i=0;i<1;i++){
   $scope.filteredDealerStatsLiveData.push($scope.dealerStatsLivesData[i]);
 }

 setTimeout(getDealerLiveStats, 5000);

    $scope.dealerStatsLiveChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.dealerStatsLiveLables ,
            series: $scope.dealerStatsLiveSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92', '#0083ca'],
            data: $scope.filteredDealerStatsLiveData
        };
      
        //$scope.loaderIconDealerStatsLive = false;
      }, function(err) {
        $scope.dataErrorMsgDealerStatsLive = true;
       //$scope.loaderIconDealerStatsLive = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
        setTimeout(getDealerLiveStats, 5000);
      });
     // setTimeout(getDealerLiveStats, 5000);
    }

    getDealerLiveStats();


   /* var dealerStatsLive = {};
    function getLiveData(){
       var lsToken = TokenService.getToken(adminUserId);
if($scope.selectedDealerLive){
  selectedTypeForDealerStats = 'scId'
  selectedValueForDealerStats = adminUserScId;
} else if($scope.selectedBrand){
  selectedTypeForDealerStats = 'brandName'
  selectedValueForDealerStats = selectedBrand;
}
       GetDealerLiveSupportStatsService.get({logInId:adminUserId,type:selectedTypeForDealerStats,value:selectedValueForDealerStats,token:lsToken},function (data) {
       console.log('Dealer  LIve Stats ::::',data);
       $scope.creDashboardDataErrorMsg = '';
       $scope.dealerStatsLive = data;
       dealerStatsLive = data;
      }, function(err) {
        $scope.dataErrorMsgDealerStatsLive = true;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
       setTimeout(getLiveData, 5000);

       $timeout(function() {
        $scope.live = true;
       },5000);
    }

     getLiveData();


$scope.dealerStatsLiveSeries =['Total Calls Made','Connected', 'Appointments Taken', 'SC Complaints'];
$scope.dealerStatsLivesData = [];
$scope.dealerStatsLiveLables = [];
var callerWiseConnectedCallsLive = [];
var callerWiseAppointmentTakenLive = [];
var totalCallsMadeLive = [];
var callerScComplaintsLive = [];
$scope.dealerStatsLiveChart = {};
function getDealerLiveStats() {
  $scope.dataErrorMsgDealerStatsLive = false;
  $scope.dealerStatsLiveChart = {};
  $scope.dealerStatsLivesData = [];
  $scope.dealerStatsLiveLables = [];
 callerWiseConnectedCallsLive = [];
 callerWiseAppointmentTakenLive = [];
 totalCallsMadeLive = [];
 callerScComplaintsLive = [];

        if(dealerStatsLive.connectedCalls !== undefined && dealerStatsLive.connectedCalls !== null){
          angular.forEach(dealerStatsLive.connectedCalls,function(val,index){
          callerWiseConnectedCallsLive.push(parseInt(dealerStatsLive.connectedCalls[index].count));
          $scope.dealerStatsLiveLables.push(dealerStatsLive.connectedCalls[index].minute);
       });
        }
        if(dealerStatsLive.appointmentTaken !== undefined && dealerStatsLive.appointmentTaken !== null){
          angular.forEach(dealerStatsLive.appointmentTaken,function(val,index){
          callerWiseAppointmentTakenLive.push(parseInt(dealerStatsLive.appointmentTaken[index].count));
        });
        }
        if(dealerStatsLive.totalCallsMade !== undefined && dealerStatsLive.totalCallsMade !== null){
          angular.forEach(dealerStatsLive.totalCallsMade,function(val,index){
          totalCallsMadeLive.push(parseInt(dealerStatsLive.totalCallsMade[index].count));
         });
        }
        if(dealerStatsLive.serviceCenterComplaint !== undefined && dealerStatsLive.serviceCenterComplaint !== null){
          angular.forEach(dealerStatsLive.serviceCenterComplaint,function(val,index){
          callerScComplaintsLive.push(parseInt(dealerStatsLive.serviceCenterComplaint[index].count));
         });
        }
        
        $scope.dealerStatsLivesData.push(totalCallsMadeLive);
        $scope.dealerStatsLivesData.push(callerWiseConnectedCallsLive);
        $scope.dealerStatsLivesData.push(callerWiseAppointmentTakenLive);
        $scope.dealerStatsLivesData.push(callerScComplaintsLive);
        
        console.log('LIve',JSON.stringify($scope.dealerStatsLivesData));
        console.log('LIve',JSON.stringify($scope.dealerStatsLiveLables));
        console.log('LIve',JSON.stringify($scope.dealerStatsLiveSeries));


 $scope.filteredDealerStatsLiveData = [];
 for(var i=0;i<4;i++){
 $scope.filteredDealerStatsLiveData.push($scope.dealerStatsLivesData[i]);
 }
    if($scope.live){
      $scope.dealerStatsLiveChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.dealerStatsLiveLables ,
            series: $scope.dealerStatsLiveSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92', '#0083ca'],
            data: $scope.filteredDealerStatsLiveData
        };

    }
    
    }

    getDealerLiveStats();
*/

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

$scope.calenderList = [{'id':'1','name':'Daily'},{'id':'2','name':'Weekly'},{'id':'3','name':'Monthly'},{'id':'4','name':'Yearly'}]
$scope.selectedCalender = $scope.calenderList[0].name;
$scope.selectedCalenderDealer = $scope.calenderList[0].name;
$scope.getSelectedCalender = function(selCalender,status){
   if(selCalender === null || selCalender === undefined){
     selCalender = 'Daily';
   }
   selectedCalender = selCalender;
   if(status === 'brand'){
    getOverallBrandStats(selectedCalender);
   } else if(status === 'dealer'){
     selectedCalenderOverall = selCalender;
     getDealerOverallStats();
   }
}

$scope.overallBrandStatsSeries = ['Total Calls Made','Appointments Taken'];
$scope.overallBrandData = [];
$scope.overallBrandLables = [];
var callsMadeOverallBrand = [];
var appointmentTakenOverallBrand = [];
$scope.overallBrandChart = {};
function getOverallBrandStats(selCalender) {
  $scope.dataErrorMsgOverallBrandStats = false;
  $scope.overallBrandChart = {};
  $scope.overallBrandData = [];
  $scope.overallBrandLables = [];
  callsMadeOverallBrand = [];
  appointmentTakenOverallBrand = [];

      $scope.loaderIconOverallBrand = true;
      var lsToken = TokenService.getToken(adminUserId);
       GetOverallBrandStatsService.get({logInId:adminUserId,status:selCalender,token:lsToken},function (data) {
       console.log('Overall Brand Stats ::::',data);
       $scope.creDashboardDataErrorMsg = '';
       $scope.overallBrandStats = data;
       var overallBrandStats = data;
        if(overallBrandStats.totalCallsMade !== undefined && overallBrandStats.totalCallsMade !== null){
          angular.forEach(overallBrandStats.totalCallsMade,function(val,index){
          callsMadeOverallBrand.push(parseInt(overallBrandStats.totalCallsMade[index].count));
          $scope.overallBrandLables.push(overallBrandStats.totalCallsMade[index].bikeBrand);
       });
        }
        if(overallBrandStats.appointmentTaken !== undefined && overallBrandStats.appointmentTaken !== null){
          angular.forEach(overallBrandStats.appointmentTaken,function(val,index){
          appointmentTakenOverallBrand.push(parseInt(overallBrandStats.appointmentTaken[index].count));
        });
        }
        
        $scope.overallBrandData.push(callsMadeOverallBrand);
        $scope.overallBrandData.push(appointmentTakenOverallBrand);


  $scope.filteredOverallBrandStatsData = [];
  $scope.filteredOverallBrandStatsLables = [];
  for(var i=0;i<2;i++){
   $scope.filteredOverallBrandStatsData.push($scope.overallBrandData[i]);
  }
  for(var i=0;i<9;i++){
   $scope.filteredOverallBrandStatsLables.push($scope.overallBrandLables[i]);
  }

        $scope.overallBrandChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.overallBrandLables ,
            series: $scope.overallBrandStatsSeries,
            colors: ['#FB617F','#2FCF92'],
            data: $scope.filteredOverallBrandStatsData
        };
        
        $scope.datasetOverrideOverallBrandData = [
             {
                fill: true,
                backgroundColor: $scope.attemptedColors
            },
            {
                fill: true,
                backgroundColor: $scope.appointmentsColors
            }
            ];
      
        $scope.loaderIconOverallBrand = false;
      }, function(err) {
        $scope.dataErrorMsgOverallBrandStats = true;
        $scope.loaderIconOverallBrand = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }

    getOverallBrandStats(selectedCalender);


$scope.selectedBrandPerformance = 'all';
//$scope.getSelectedBrand('Honda','Performance');
$scope.dealerStatsPerformaceSeries =[ 'Total Calls Made','Connected', 'Appointments Taken'];
$scope.dealerStatsPerformaceData = [];
$scope.dealerStatsPerformaceLables = [];
var callerWiseConnectedPerformace = [];
var callerWiseAppointmentTakenPerformace = [];
var totalCallsMadePerformace = [];
$scope.dealerStatsPerformaceChart = {};
function getDealerTopPerformanceStats() {
  $scope.dataErrorMsgDealerStatsPerformace = false;
  $scope.dealerStatsPerformaceChart = {};
  $scope.dealerStatsPerformaceData = [];
  $scope.dealerStatsPerformaceLables = [];
  callerWiseConnectedPerformace = [];
  callerWiseAppointmentTakenPerformace = [];
  totalCallsMadePerformace = [];

      $scope.loaderIconDealerStatsPerformace = true;
      var lsToken = TokenService.getToken(adminUserId);
       GetDealerTopPerformanceStatsService.get({logInId:adminUserId,brand:selectedBrand,token:lsToken},function (data) {
       console.log('Dealer Top Performance Stats  ::::',data);
       $scope.creDashboardDataErrorMsg = '';
       $scope.dealerPerformanceStats = data;
       var dealerPerformanceStats = data;
      
        if(dealerPerformanceStats.connectedCalls !== undefined && dealerPerformanceStats.connectedCalls !== null){
          angular.forEach(dealerPerformanceStats.connectedCalls,function(val,index){
          callerWiseConnectedPerformace.push(parseInt(dealerPerformanceStats.connectedCalls[index].count));
          console.log('Performance Performance',dealerPerformanceStats.connectedCalls[index].count);
          $scope.dealerStatsPerformaceLables.push(dealerPerformanceStats.connectedCalls[index].dealerName);
       });
        }
        if(dealerPerformanceStats.appointmentTaken !== undefined && dealerPerformanceStats.appointmentTaken !== null){
          angular.forEach(dealerPerformanceStats.appointmentTaken,function(val,index){
          callerWiseAppointmentTakenPerformace.push(parseInt(dealerPerformanceStats.appointmentTaken[index].count));
        });
        }
        if(dealerPerformanceStats.totalCallsMade !== undefined && dealerPerformanceStats.totalCallsMade !== null){
          angular.forEach(dealerPerformanceStats.totalCallsMade,function(val,index){
          totalCallsMadePerformace.push(parseInt(dealerPerformanceStats.totalCallsMade[index].count));
         });
        }

        $scope.dealerStatsPerformaceData.push(totalCallsMadePerformace);
        $scope.dealerStatsPerformaceData.push(callerWiseConnectedPerformace);
        $scope.dealerStatsPerformaceData.push(callerWiseAppointmentTakenPerformace);
      
        console.log('Performance',JSON.stringify($scope.dealerStatsPerformaceData));

 $scope.filteredDealerStatsPerformanceData = [];
       //$scope.filteredCallerWiseConversionLables = [];
 for(var i=0;i<3;i++){
 $scope.filteredDealerStatsPerformanceData.push($scope.dealerStatsPerformaceData[i]);
 }
 /*for(var i=0;i<10;i++){
 $scope.filteredCallerWiseConversionLables.push($scope.callerWiseConversionLables[i]);
 }*/

    $scope.dealerStatsPerformaceChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          stacked: false, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}
    },
            labels: $scope.dealerStatsPerformaceLables ,
            series: $scope.dealerStatsPerformaceSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92'],
            data: $scope.dealerStatsPerformaceData
        };
        
        $scope.datasetOverrideDealerStatsPerformanceData = [
             {
                fill: true,
                backgroundColor: $scope.attemptedColors
            },
            {
                fill: true,
                backgroundColor:$scope.connectedColors
            },
            {
                fill: true,
                backgroundColor: $scope.appointmentsColors
            }
            ];

        $scope.loaderIconDealerStatsPerformace = false;
      }, function(err) {
        $scope.dataErrorMsgDealerStatsPerformace = true;
        $scope.loaderIconDealerStatsPerformace = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }

    getDealerTopPerformanceStats();

   var sendEmail = false; 
   $scope.sendMailForRenewal = function(obj){
    console.log(obj.email);
    sendEmail = $window.confirm('Are you sure to Send Email?');
      if(sendEmail){
        sendRenewalEmail(obj.email,obj.mobile,obj.validTo)
      } else if(!sendEmail){
        console.log('Cancelled Email');
      }
   }

     function sendRenewalEmail(email,mobile,validTo) {
          var lsToken = TokenService.getToken(adminUserId);
          var emailObj = {
            logInId : adminUserId,
            email : email,
            mobile : mobile,
            validTo : validTo
          }
          console.log(JSON.stringify(emailObj));
          SendRenewalEmailService.save({id: adminUserId,token:lsToken},emailObj,function (data) {
             console.log('sendRenewalEmail',data);
             $window.alert(data.message);
          }, function (err) {
            console.log(err);
           //$scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
          });
      }

      $scope.getVehicleModels = function(brandName) {
          var lsToken = TokenService.getToken(adminUserId);
          BrandWiseModelService.query({brandName: brandName},function (data) {
             console.log('Brand Wise Models',data);
             $scope.brandWiseVehicleTypes = data;
          }, function (err) {
            console.log(err);
           //$scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
          });
      }

      $scope.getServiceSchedules = function(brandModel) {
          $scope.loaderIconServiceSchedule = true;
          $scope.serviceSchedulesDataErrorMsg = '';
          var lsToken = TokenService.getToken(adminUserId);
          GetBrandServiceSchedulesService.query({logInId: adminUserId,brand:brandModel,token:lsToken},function (data) {
             console.log('service schedules',data);
             $scope.serviceSchedulesData = data;
             $scope.loaderIconServiceSchedule = false;
             $scope.serviceSchedulesDataErrorMsg = '';
          }, function (err) {
            console.log(err);
            $scope.loaderIconServiceSchedule = false;
            $scope.serviceSchedulesDataErrorMsg = err.data.message;
          });
      }

   //$scope.callerMob = "8105744625";
   $scope.showUpdateStatus = false;
   var selRecordId;
   $scope.clickToCall = function (argument) {
    $scope.showUpdateStatus = false;
     console.log(argument);
     var postCallData = {
         'dealerId':argument.dealerId,
         'logInId':adminUserId,
         'customerName':argument.scName,
         'mobile':argument.mobile,
         'callerMobile':supportMobile
       }
       console.log('Post data',postCallData);
       var lsToken = TokenService.getToken(adminUserId);
       ClickToCallService.save({loginId:adminUserId,token:lsToken},postCallData,function(data) {
       console.log('Post Call Details to backend::',data);
       $window.alert(data.message);
       selRecordId = data.recordId;
       $scope.dealerRowId = argument.slNo;
       $scope.showUpdateStatus = true;
     }, function(err) {
       $scope.showUpdateStatus = false;
       console.log(err);
       //$scope.callErrorMessage = err.data.message;
     });
   }

   $scope.updateSupportCall = function (remark) {
     $scope.updateSuccessMsg = '';
     $scope.updateErrorMessage = '';
     var postStatus = {recordId: selRecordId,status:remark};
       console.log('update status',JSON.stringify(postStatus));
       var lsToken = TokenService.getToken(adminUserId);
       UpdateSupportCallStatusService.save({loginId:adminUserId,token:lsToken},postStatus,function(data) {
       console.log('Update status resp::',data);
       $scope.updateSuccessMsg = data.message;
       $scope.updateErrorMessage = '';
       $scope.updateObj = {};
       $scope.reasonForm.$setPristine();
       $scope.showUpdateStatus = false;
     }, function(err) {
       console.log(err);
       $scope.updateSuccessMsg = '';
       $scope.updateErrorMessage = err.data.message;
     });
   }

   $scope.clearUpdateMsg = function(){
    $scope.updateSuccessMsg = '';
    $scope.updateErrorMessage = '';
   }

    $(document).ready(function(){
      $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
      });
    });

    /*$scope.uploadHistoryData = [];
    $scope.getUploadHistory = function(){
      $scope.loading = true;
      var lsToken = TokenService.getToken(adminUserScId);
      GetUploadHistoryService.query({scId:adminUserScId,token:lsToken},function (data) {
        $scope.uploadHistoryData = data;
        $scope.tableParams.reload();
        console.log('uploadHistoy',data);
        $scope.loading = false;
      }, function (err) {
        $scope.creTableData = [];
        $scope.uploadHistoryErrorMsg = err.data.message;
        console.log(err);
        $scope.loading = false;
      });
    }
    //getUploadHistory();
*/
    
  });