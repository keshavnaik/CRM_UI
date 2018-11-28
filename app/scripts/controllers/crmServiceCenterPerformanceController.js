'use strict';

angular.module('letsService')
  .controller('ServiceCenterPerformanceController', function ($scope,serviceURL,$cookies,$window,$rootScope,TokenService,GetCallerWiseRevenueStatsService,GetServiceCenterJobcardStatsService,GetYearWiseCustomerStatsService,GetOnTimeDeliveryStatsService,TeleCallerWiseServiceCenterService,GetSuperAdminDealerListService,GetCustomerVisitedCountService,GetOutsideCustomerVisitService,GetServiceAdvisorStatsService,GetMonthWisePotentialCustomerService,AdminCustomerDetailsService,ngTableParams,$filter,GetPotentialCustomerDetailsService,GetSalesJobcardDataService,GetSalesJobcardStatsDetailedService) {

   /*var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');*/

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
    console.log('==============',selDealer);
    selectedBranch = 'branch';
      console.log(selDealer);
      adminUserScId = selDealer;
      getServiceCenterTeleCallerWise(selDealer);
      getCallerWiseRevenueData();
      getCallerWiseRevenueDataWeekly();
      getServiceCenterJobcardStats();
      getServiceCenterJobcardWeeklyStats();
      getYearWiseCustomerStats();
      getOnTimeDeliveryStats();
      getCustomerServiceCountChartData();
      getOutsideCustomerVisitedStats();
      getServiceAdvisorStats();
      getMonthWisePotentialCustomerStats('submit');
      getMonthWiseSalesJobcardStats();
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
      getCallerWiseRevenueData();
      getCallerWiseRevenueDataWeekly();
      getServiceCenterJobcardStats();
      getServiceCenterJobcardWeeklyStats();
      getYearWiseCustomerStats();
      getOnTimeDeliveryStats();
      getServiceAdvisorStats();
      getMonthWisePotentialCustomerStats('submit');
      getMonthWiseSalesJobcardStats();
    };

    $scope.options = {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}/*,
      data : [
        [22,11,10,28,11],[9,12,30,9,22],[21,35,11,33,8]
      ]*/
    };
    
var selectedStatus = 'serviceReminder'; 

$scope.fsc1Colors = ['#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F'];
$scope.fsc2Colors = ['#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900'];
$scope.fsc3Colors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.fsc4Colors = ['#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca'];
$scope.paidColors = ['#A0B421', '#A0B421','#A0B421','#A0B421','#A0B421','#A0B421'];
$scope.othersJobcardColors = ['#b3d1d1','#b3d1d1','#b3d1d1','#b3d1d1','#b3d1d1','#b3d1d1','#b3d1d1','#b3d1d1'];

$scope.revenueColors = ['#FB617F', '#ff9900','#2FCF92','#0083ca','#A0B421'];
$scope.revenueDataSeries =["FSC1","FSC2","FSC3","FSC4","Paid",'Others'];
$scope.revenueData = [];
$scope.revenueLables = [];
var fsc1 = [];
var fsc2 = [];
var fsc3 = [];
var fsc4 = [];
var paid = [];
var othersRevenue = [];
var selectedId = 'all';
var selectedType = 'sc';
var selectedBranch = 'branch';
var selectedReportType = 'month';
$scope.fsc1Total = 0;
$scope.fsc2Total = 0;
$scope.fsc3Total = 0;
$scope.fsc4Total = 0;
$scope.paidTotal = 0;
function getCallerWiseRevenueData() {
  $scope.revenueColors = ['#FB617F', '#ff9900','#2FCF92','#0083ca','#A0B421'];
$scope.revenueDataSeries =["FSC1","FSC2","FSC3","FSC4","Paid",'Others'];
$scope.revenueData = [];
$scope.revenueLables = [];
 fsc1 = [];
 fsc2 = [];
 fsc3 = [];
 fsc4 = [];
 paid = [];
 othersRevenue = [];
$scope.fsc1Total = 0;
$scope.fsc2Total = 0;
$scope.fsc3Total = 0;
$scope.fsc4Total = 0;
$scope.paidTotal = 0;
      $scope.loaderIconRevenue = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetCallerWiseRevenueStatsService.get({id:selectedId,type:selectedType,scId:adminUserScId,brandName:loginBrandName,reportType:selectedReportType,branch:selectedBranch,dataType:selectedStatus,token:lsToken},function (data) {
       console.log('Revenue data :',data);
        var revenueStats = data;
        if(revenueStats.FSC1 !== undefined && revenueStats.FSC1 !== null){
          angular.forEach(revenueStats.FSC1,function(val,index){
          fsc1.push(revenueStats.FSC1[index].totalAmount);
          $scope.fsc1Total += revenueStats.FSC1[index].totalAmount;
            $scope.revenueLables.push(revenueStats.FSC1[index].monthName);
        });
        }

         /*for(var i=0;i< revenueStats.FSC1.length-1;i++){
           console.log('revenue---',revenueStats.FSC1[i].totalAmount);
          $scope.fsc1Total += revenueStats.FSC1[i].totalAmount;
         }*/

        if(revenueStats.FSC2 !== undefined && revenueStats.FSC2 !== null){
          angular.forEach(revenueStats.FSC2,function(val,index){
          fsc2.push(revenueStats.FSC2[index].totalAmount);
          $scope.fsc2Total += revenueStats.FSC2[index].totalAmount;
        });
        }


        if(revenueStats.FSC3 !== undefined && revenueStats.FSC3 !== null){
          angular.forEach(revenueStats.FSC3,function(val,index){
          fsc3.push(revenueStats.FSC3[index].totalAmount);
          $scope.fsc3Total += revenueStats.FSC3[index].totalAmount;
        });
        }
        if(revenueStats.FSC4 !== undefined && revenueStats.FSC4 !== null){
          angular.forEach(revenueStats.FSC4,function(val,index){
          fsc4.push(revenueStats.FSC4[index].totalAmount);
           $scope.fsc4Total += revenueStats.FSC4[index].totalAmount;
        });
        }
        if(revenueStats.Paid !== undefined && revenueStats.Paid !== null){
          angular.forEach(revenueStats.Paid,function(val,index){
          paid.push(revenueStats.Paid[index].totalAmount);
           $scope.paidTotal += revenueStats.Paid[index].totalAmount;
        });
        }
        if(revenueStats.Others !== undefined && revenueStats.Others !== null){
          angular.forEach(revenueStats.Others,function(val,index){
          othersRevenue.push(revenueStats.Others[index].totalAmount);
          // $scope.paidTotal += revenueStats.Paid[index].totalAmount;
        });
        }
        
        
        $scope.revenueData.push(fsc1);
        $scope.revenueData.push(fsc2);
        $scope.revenueData.push(fsc3);
        $scope.revenueData.push(fsc4);
        $scope.revenueData.push(paid);
        $scope.revenueData.push(othersRevenue);

        $scope.revenueChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}/*,
      data : [
        [22,11,10,28,11],[9,12,30,9,22],[21,35,11,33,8]
      ]*/
    }
            ,
            labels: $scope.revenueLables ,
            series: $scope.revenueDataSeries ,
            colors: ['#FB617F', '#ff9900','#2FCF92','#0083ca','#A0B421','#b3d1d1'],
            data: $scope.revenueData 
        };
        
        $scope.datasetOverrideRevenue = [
            {
                fill: true,
                backgroundColor: $scope.fsc1Colors
            },
            {
                fill: true,
                backgroundColor:$scope.fsc2Colors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc3Colors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc4Colors
            },
            {
                fill: true,
                backgroundColor:$scope.paidColors
            },
            {
                fill: true,
                backgroundColor:$scope.othersJobcardColors
            }
            ];
        
        //console.log(JSON.stringify($scope.revenueData));
        //console.log(JSON.stringify($scope.revenueLables));
        //console.log(JSON.stringify($scope.revenueDataSeries));
      $scope.loaderIconRevenue = false;
      }, function(err) {
        $scope.loaderIconRevenue = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCallerWiseRevenueData();


$scope.fsc1ColorsWeekly = ['#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F'];
$scope.fsc2ColorsWeekly = ['#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900'];
$scope.fsc3ColorsWeekly = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92'];
$scope.fsc4ColorsWeekly = ['#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca'];
$scope.paidColorsWeekly = ['#A0B421', '#A0B421','#A0B421','#A0B421','#A0B421','#A0B421','#A0B421','#A0B421', '#A0B421','#A0B421','#A0B421','#A0B421','#A0B421','#A0B421','#A0B421', '#A0B421','#A0B421','#A0B421','#A0B421','#A0B421','#A0B421','#A0B421', '#A0B421','#A0B421','#A0B421','#A0B421','#A0B421','#A0B421','#A0B421', '#A0B421','#A0B421'];

$scope.revenueDataSeriesWeekly =["FSC1","FSC2","FSC3","FSC4","Paid",'Others'];
$scope.revenueDataWeekly= [];
$scope.revenueLablesWeekly = [];
var fsc1Weekly = [];
var fsc2Weekly = [];
var fsc3Weekly = [];
var fsc4Weekly = [];
var paidWeekly = [];
var othersRevenueWeekly = [];
var selectedReportTypeWeekly = 'day';
$scope.fsc1WeeklyTotal = 0;
$scope.fsc2WeeklyTotal = 0;
$scope.fsc3WeeklyTotal = 0;
$scope.fsc4WeeklyTotal = 0;
$scope.paidWeeklyTotal = 0;
function getCallerWiseRevenueDataWeekly() {
  $scope.revenueDataSeriesWeekly =["FSC1","FSC2","FSC3","FSC4","Paid",'Others'];
$scope.revenueDataWeekly= [];
$scope.revenueLablesWeekly = [];
 fsc1Weekly = [];
 fsc2Weekly = [];
 fsc3Weekly = [];
 fsc4Weekly = [];
 paidWeekly = [];
 othersRevenueWeekly = [];
$scope.fsc1WeeklyTotal = 0;
$scope.fsc2WeeklyTotal = 0;
$scope.fsc3WeeklyTotal = 0;
$scope.fsc4WeeklyTotal = 0;
$scope.paidWeeklyTotal = 0;
     $scope.loaderIconRevenueWeekly = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetCallerWiseRevenueStatsService.get({id:selectedId,type:selectedType,scId:adminUserScId,brandName:loginBrandName,reportType:selectedReportTypeWeekly,branch:selectedBranch,dataType:selectedStatus,token:lsToken},function (data) {
       console.log('Revenue data weekly :',data);
        var revenueStatsWeekly = data;
        if(revenueStatsWeekly.FSC1 !== undefined && revenueStatsWeekly.FSC1 !== null){
          angular.forEach(revenueStatsWeekly.FSC1,function(val,index){
          fsc1Weekly.push(revenueStatsWeekly.FSC1[index].totalAmount);
          $scope.fsc1WeeklyTotal += revenueStatsWeekly.FSC1[index].totalAmount;
            $scope.revenueLablesWeekly.push(revenueStatsWeekly.FSC1[index].date);
        });
        }
        if(revenueStatsWeekly.FSC2 !== undefined && revenueStatsWeekly.FSC2 !== null){
          angular.forEach(revenueStatsWeekly.FSC2,function(val,index){
          fsc2Weekly.push(revenueStatsWeekly.FSC2[index].totalAmount);
          $scope.fsc2WeeklyTotal += revenueStatsWeekly.FSC2[index].totalAmount;
        });
        }
        if(revenueStatsWeekly.FSC3 !== undefined && revenueStatsWeekly.FSC3 !== null){
          angular.forEach(revenueStatsWeekly.FSC3,function(val,index){
          fsc3Weekly.push(revenueStatsWeekly.FSC3[index].totalAmount);
          $scope.fsc3WeeklyTotal += revenueStatsWeekly.FSC3[index].totalAmount;
        });
        }
        if(revenueStatsWeekly.FSC4 !== undefined && revenueStatsWeekly.FSC4 !== null){
          angular.forEach(revenueStatsWeekly.FSC4,function(val,index){
          fsc4Weekly.push(revenueStatsWeekly.FSC4[index].totalAmount);
          $scope.fsc4WeeklyTotal += revenueStatsWeekly.FSC4[index].totalAmount;
        });
        }
        if(revenueStatsWeekly.Paid !== undefined && revenueStatsWeekly.Paid !== null){
          angular.forEach(revenueStatsWeekly.Paid,function(val,index){
          paidWeekly.push(revenueStatsWeekly.Paid[index].totalAmount);
          $scope.paidWeeklyTotal += revenueStatsWeekly.Paid[index].totalAmount;
        });
        }
        if(revenueStatsWeekly.Others !== undefined && revenueStatsWeekly.Others !== null){
          angular.forEach(revenueStatsWeekly.Others,function(val,index){
          othersRevenueWeekly.push(revenueStatsWeekly.Others[index].totalAmount);
          //$scope.paidWeeklyTotal += revenueStatsWeekly.Paid[index].totalAmount;
        });
        }
        
        
        $scope.revenueDataWeekly.push(fsc1Weekly);
        $scope.revenueDataWeekly.push(fsc2Weekly);
        $scope.revenueDataWeekly.push(fsc3Weekly);
        $scope.revenueDataWeekly.push(fsc4Weekly);
        $scope.revenueDataWeekly.push(paidWeekly);
        $scope.revenueDataWeekly.push(othersRevenueWeekly);

$scope.revenueChartWeekly = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}/*,
      data : [
        [22,11,10,28,11],[9,12,30,9,22],[21,35,11,33,8]
      ]*/
    }
            ,
            labels: $scope.revenueLablesWeekly ,
            series: $scope.revenueDataSeriesWeekly ,
            colors: ['#FB617F', '#ff9900','#2FCF92','#0083ca','#A0B421','#b3d1d1'],
            data: $scope.revenueDataWeekly 
        };
        
        $scope.datasetOverrideRevenueWeekly = [
            {
                fill: true,
                backgroundColor: $scope.fsc1ColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.fsc2ColorsWeekly
            },
            {
                fill: true,
                backgroundColor: $scope.fsc3ColorsWeekly
            },
            {
                fill: true,
                backgroundColor: $scope.fsc4ColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.paidColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.othersJobcardColors
            }
            
            ];


        //console.log(JSON.stringify($scope.revenueDataWeekly));
        //console.log(JSON.stringify($scope.revenueLablesWeekly));
        //console.log(JSON.stringify($scope.revenueDataSeriesWeekly));
        
       $scope.loaderIconRevenueWeekly = false;
      }, function(err) {
        $scope.loaderIconRevenueWeekly = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCallerWiseRevenueDataWeekly();


$scope.jobcardDataSeries =["FSC1","FSC2","FSC3","FSC4","Paid","Others"];
$scope.jobcardData= [];
$scope.jobcardDataLables = [];
var fsc1Jobcard = [];
var fsc2Jobcard = [];
var fsc3Jobcard = [];
var fsc4Jobcard = [];
var paidJobcard = [];
var othersJobcard = [];
var selectedReportTypeJobcard = 'month';
//var selectedBranchId = 'all';
$scope.fsc1JobcardTotal = 0;
$scope.fsc2JobcardTotal = 0;
$scope.fsc3JobcardTotal = 0;
$scope.fsc4JobcardTotal = 0;
$scope.paidJobcardTotal = 0;
function getServiceCenterJobcardStats() {
  $scope.jobcardDataSeries =["FSC1","FSC2","FSC3","FSC4","Paid","Others"];
$scope.jobcardData= [];
$scope.jobcardDataLables = [];
 fsc1Jobcard = [];
 fsc2Jobcard = [];
 fsc3Jobcard = [];
 fsc4Jobcard = [];
 paidJobcard = [];
 othersJobcard = [];
$scope.fsc1JobcardTotal = 0;
$scope.fsc2JobcardTotal = 0;
$scope.fsc3JobcardTotal = 0;
$scope.fsc4JobcardTotal = 0;
$scope.paidJobcardTotal = 0;
      $scope.loaderIconJobcard = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetServiceCenterJobcardStatsService.get({branchId:selectedBranch,scId:adminUserScId,brandName:loginBrandName,reportType:selectedReportTypeJobcard,token:lsToken},function (data) {
       console.log('Jobcard Stats :',data);
        var jobcardStats = data;
        if(jobcardStats.FSC1 !== undefined && jobcardStats.FSC1 !== null){
          angular.forEach(jobcardStats.FSC1,function(val,index){
          fsc1Jobcard.push(parseInt(jobcardStats.FSC1[index].totalCount));
           $scope.fsc1JobcardTotal += parseInt(jobcardStats.FSC1[index].totalCount);
            $scope.jobcardDataLables.push(jobcardStats.FSC1[index].monthName);
        });
        }
        if(jobcardStats.FSC2 !== undefined && jobcardStats.FSC2 !== null){
          angular.forEach(jobcardStats.FSC2,function(val,index){
          fsc2Jobcard.push(parseInt(jobcardStats.FSC2[index].totalCount));
           $scope.fsc2JobcardTotal += parseInt(jobcardStats.FSC2[index].totalCount);
        });
        }
        if(jobcardStats.FSC3 !== undefined && jobcardStats.FSC3 !== null){
          angular.forEach(jobcardStats.FSC3,function(val,index){
          fsc3Jobcard.push(parseInt(jobcardStats.FSC3[index].totalCount));
           $scope.fsc3JobcardTotal += parseInt(jobcardStats.FSC3[index].totalCount);
        });
        }
        if(jobcardStats.FSC4 !== undefined && jobcardStats.FSC4 !== null){
          angular.forEach(jobcardStats.FSC4,function(val,index){
          fsc4Jobcard.push(parseInt(jobcardStats.FSC4[index].totalCount));
           $scope.fsc4JobcardTotal += parseInt(jobcardStats.FSC4[index].totalCount);
        });
        }
        if(jobcardStats.Paid !== undefined && jobcardStats.Paid !== null){
          angular.forEach(jobcardStats.Paid,function(val,index){
          paidJobcard.push(parseInt(jobcardStats.Paid[index].totalCount));
           $scope.paidJobcardTotal += parseInt(jobcardStats.Paid[index].totalCount);
        });
        }
        if(jobcardStats.Others !== undefined && jobcardStats.Others !== null){
          angular.forEach(jobcardStats.Others,function(val,index){
          othersJobcard.push(parseInt(jobcardStats.Others[index].totalCount));
           //$scope.paidJobcardTotal += parseInt(jobcardStats.Paid[index].totalCount);
        });
        }
        
        $scope.jobcardData.push(fsc1Jobcard);
        $scope.jobcardData.push(fsc2Jobcard);
        $scope.jobcardData.push(fsc3Jobcard);
        $scope.jobcardData.push(fsc4Jobcard);
        $scope.jobcardData.push(paidJobcard);
        $scope.jobcardData.push(othersJobcard);


$scope.jobcardChart = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}/*,
      data : [
        [22,11,10,28,11],[9,12,30,9,22],[21,35,11,33,8]
      ]*/
    }
            ,
            labels: $scope.jobcardDataLables ,
            series: $scope.jobcardDataSeries ,
            colors: ['#FB617F', '#ff9900','#2FCF92','#0083ca','#A0B421','#b3d1d1'],
            data: $scope.jobcardData 
        };
        
        $scope.datasetOverrideJobcard = [
            {
                fill: true,
                backgroundColor: $scope.fsc1Colors
            },
            {
                fill: true,
                backgroundColor:$scope.fsc2Colors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc3Colors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc4Colors
            },
            {
                fill: true,
                backgroundColor:$scope.paidColors
            },
            {
                fill: true,
                backgroundColor:$scope.othersJobcardColors
            }
            
            ];
        
        //console.log(JSON.stringify($scope.jobcardData));
        //console.log(JSON.stringify($scope.revenueLablesJobcard));
        //console.log(JSON.stringify($scope.jobcardDataSeries));
        
         $scope.loaderIconJobcard = false;
      }, function(err) {
        $scope.loaderIconJobcard = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getServiceCenterJobcardStats();



$scope.jobcardDataSeriesWeekly =["FSC1","FSC2","FSC3","FSC4","Paid",'Others'];
$scope.jobcardDataWeekly= [];
$scope.jobcardDataLablesWeekly = [];
var fsc1JobcardWeekly = [];
var fsc2JobcardWeekly = [];
var fsc3JobcardWeekly = [];
var fsc4JobcardWeekly = [];
var paidJobcardWeekly = [];
var othersJobcardWeekly = [];

var selectedReportTypeJobcardWeekly = 'day';
//var selectedBranchId = 'all';
$scope.fsc1JobcardTotalWeekly = 0;
$scope.fsc2JobcardTotalWeekly = 0;
$scope.fsc3JobcardTotalWeekly = 0;
$scope.fsc4JobcardTotalWeekly = 0;
$scope.paidJobcardTotalWeekly = 0;
function getServiceCenterJobcardWeeklyStats() {
  $scope.jobcardDataSeriesWeekly =["FSC1","FSC2","FSC3","FSC4","Paid",'Others'];
$scope.jobcardDataWeekly= [];
$scope.jobcardDataLablesWeekly = [];
 fsc1JobcardWeekly = [];
 fsc2JobcardWeekly = [];
 fsc3JobcardWeekly = [];
 fsc4JobcardWeekly = [];
 paidJobcardWeekly = [];
 othersJobcardWeekly = [];
$scope.fsc1JobcardTotalWeekly = 0;
$scope.fsc2JobcardTotalWeekly = 0;
$scope.fsc3JobcardTotalWeekly = 0;
$scope.fsc4JobcardTotalWeekly = 0;
$scope.paidJobcardTotalWeekly = 0;
     $scope.loaderIconJobcardWeekly = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetServiceCenterJobcardStatsService.get({branchId:selectedBranch,scId:adminUserScId,brandName:loginBrandName,reportType:selectedReportTypeJobcardWeekly,token:lsToken},function (data) {
       console.log('Jobcard Stats  Weekly:',data);
        var jobcardStatsWeekly = data;
        if(jobcardStatsWeekly.FSC1 !== undefined && jobcardStatsWeekly.FSC1 !== null){
          angular.forEach(jobcardStatsWeekly.FSC1,function(val,index){
          fsc1JobcardWeekly.push(parseInt(jobcardStatsWeekly.FSC1[index].totalCount));
          $scope.fsc1JobcardTotalWeekly += parseInt(jobcardStatsWeekly.FSC1[index].totalCount);
          $scope.jobcardDataLablesWeekly.push(jobcardStatsWeekly.FSC1[index].date);
        });
        }
        if(jobcardStatsWeekly.FSC2 !== undefined && jobcardStatsWeekly.FSC2 !== null){
          angular.forEach(jobcardStatsWeekly.FSC2,function(val,index){
          fsc2JobcardWeekly.push(parseInt(jobcardStatsWeekly.FSC2[index].totalCount));
          $scope.fsc2JobcardTotalWeekly += parseInt(jobcardStatsWeekly.FSC2[index].totalCount);
        });
        }
        if(jobcardStatsWeekly.FSC3 !== undefined && jobcardStatsWeekly.FSC3 !== null){
          angular.forEach(jobcardStatsWeekly.FSC3,function(val,index){
          fsc3JobcardWeekly.push(parseInt(jobcardStatsWeekly.FSC3[index].totalCount));
          $scope.fsc3JobcardTotalWeekly += parseInt(jobcardStatsWeekly.FSC3[index].totalCount);
        });
        }
        if(jobcardStatsWeekly.FSC4 !== undefined && jobcardStatsWeekly.FSC4 !== null){
          angular.forEach(jobcardStatsWeekly.FSC4,function(val,index){
          fsc4JobcardWeekly.push(parseInt(jobcardStatsWeekly.FSC4[index].totalCount));
          $scope.fsc4JobcardTotalWeekly += parseInt(jobcardStatsWeekly.FSC4[index].totalCount);
        });
        }
        if(jobcardStatsWeekly.Paid !== undefined && jobcardStatsWeekly.Paid !== null){
          angular.forEach(jobcardStatsWeekly.Paid,function(val,index){
          paidJobcardWeekly.push(parseInt(jobcardStatsWeekly.Paid[index].totalCount));
          $scope.paidJobcardTotalWeekly += parseInt(jobcardStatsWeekly.Paid[index].totalCount);
        });
        }
         if(jobcardStatsWeekly.Others !== undefined && jobcardStatsWeekly.Others !== null){
          angular.forEach(jobcardStatsWeekly.Others,function(val,index){
          othersJobcardWeekly.push(parseInt(jobcardStatsWeekly.Others[index].totalCount));
         // $scope.paidJobcardTotalWeekly += parseInt(jobcardStatsWeekly.Paid[index].totalCount);
        });
        }
        
        $scope.jobcardDataWeekly.push(fsc1JobcardWeekly);
        $scope.jobcardDataWeekly.push(fsc2JobcardWeekly);
        $scope.jobcardDataWeekly.push(fsc3JobcardWeekly);
        $scope.jobcardDataWeekly.push(fsc4JobcardWeekly);
        $scope.jobcardDataWeekly.push(paidJobcardWeekly);
        $scope.jobcardDataWeekly.push(othersJobcardWeekly);

$scope.jobcardChartWeekly = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}/*,
      data : [
        [22,11,10,28,11],[9,12,30,9,22],[21,35,11,33,8]
      ]*/
    }
            ,
            labels: $scope.jobcardDataLablesWeekly ,
            series: $scope.jobcardDataSeriesWeekly ,
            colors: ['#FB617F', '#ff9900','#2FCF92','#0083ca','#A0B421','#b3d1d1'],
            data: $scope.jobcardDataWeekly 
        };
        
        $scope.datasetOverrideJobcardWeekly = [
            {
                fill: true,
                backgroundColor: $scope.fsc1ColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.fsc2ColorsWeekly
            },
            {
                fill: true,
                backgroundColor: $scope.fsc3ColorsWeekly
            },
            {
                fill: true,
                backgroundColor: $scope.fsc4ColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.paidColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.othersJobcardColors
            }
            
            ];

        console.log(JSON.stringify($scope.jobcardDataWeekly));
        console.log(JSON.stringify($scope.jobcardDataLablesWeekly));
        console.log(JSON.stringify($scope.jobcardDataSeriesWeekly));
        
        $scope.loaderIconJobcardWeekly = false;
      }, function(err) {
        $scope.loaderIconJobcardWeekly = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getServiceCenterJobcardWeeklyStats();


/*Last 30 Days Jobcard Stats start*/
$scope.jobcardDataSeriesLast30Days =["FSC1","FSC2","FSC3","FSC4","Paid",'Others'];
$scope.jobcardDataLast30Days= [];
$scope.jobcardDataLablesLast30Days = [];
var fsc1JobcardLast30Days = [];
var fsc2JobcardLast30Days = [];
var fsc3JobcardLast30Days = [];
var fsc4JobcardLast30Days = [];
var paidJobcardLast30Days = [];
var othersJobcardLast30Days = [];

var selectedReportTypeJobcardLast30Days = 'day';
//var selectedBranchId = 'all';
$scope.fsc1JobcardTotalLast30Days = 0;
$scope.fsc2JobcardTotalLast30Days = 0;
$scope.fsc3JobcardTotalLast30Days = 0;
$scope.fsc4JobcardTotalLast30Days = 0;
$scope.paidJobcardTotalLast30Days = 0;
function getServiceCenterJobcardLast30DaysStats() {
  $scope.jobcardDataSeriesLast30Days =["FSC1","FSC2","FSC3","FSC4","Paid",'Others'];
$scope.jobcardDataLast30Days= [];
$scope.jobcardDataLablesLast30Days = [];
 fsc1JobcardLast30Days = [];
 fsc2JobcardLast30Days = [];
 fsc3JobcardLast30Days = [];
 fsc4JobcardLast30Days = [];
 paidJobcardLast30Days = [];
 othersJobcardLast30Days = [];
$scope.fsc1JobcardTotalLast30Days = 0;
$scope.fsc2JobcardTotalLast30Days = 0;
$scope.fsc3JobcardTotalLast30Days = 0;
$scope.fsc4JobcardTotalLast30Days = 0;
$scope.paidJobcardTotalLast30Days = 0;
     $scope.loaderIconJobcardLast30Days = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetServiceCenterJobcardStatsService.get({branchId:selectedBranch,scId:adminUserScId,brandName:loginBrandName,reportType:selectedReportTypeJobcardLast30Days,token:lsToken},function (data) {
       console.log('Jobcard Stats  Last 30 Days:',data);
        var jobcardStatsLast30Days = data;
        if(jobcardStatsLast30Days.FSC1 !== undefined && jobcardStatsLast30Days.FSC1 !== null){
          angular.forEach(jobcardStatsLast30Days.FSC1,function(val,index){
          fsc1JobcardLast30Days.push(parseInt(jobcardStatsLast30Days.FSC1[index].totalCount));
          $scope.fsc1JobcardTotalLast30Days += parseInt(jobcardStatsLast30Days.FSC1[index].totalCount);
          $scope.jobcardDataLablesLast30Days.push(jobcardStatsLast30Days.FSC1[index].date);
        });
        }
        if(jobcardStatsLast30Days.FSC2 !== undefined && jobcardStatsLast30Days.FSC2 !== null){
          angular.forEach(jobcardStatsLast30Days.FSC2,function(val,index){
          fsc2JobcardLast30Days.push(parseInt(jobcardStatsLast30Days.FSC2[index].totalCount));
          $scope.fsc2JobcardTotalLast30Days += parseInt(jobcardStatsLast30Days.FSC2[index].totalCount);
        });
        }
        if(jobcardStatsLast30Days.FSC3 !== undefined && jobcardStatsLast30Days.FSC3 !== null){
          angular.forEach(jobcardStatsLast30Days.FSC3,function(val,index){
          fsc3JobcardLast30Days.push(parseInt(jobcardStatsLast30Days.FSC3[index].totalCount));
          $scope.fsc3JobcardTotalLast30Days += parseInt(jobcardStatsLast30Days.FSC3[index].totalCount);
        });
        }
        if(jobcardStatsLast30Days.FSC4 !== undefined && jobcardStatsLast30Days.FSC4 !== null){
          angular.forEach(jobcardStatsLast30Days.FSC4,function(val,index){
          fsc4JobcardLast30Days.push(parseInt(jobcardStatsLast30Days.FSC4[index].totalCount));
          $scope.fsc4JobcardTotalLast30Days += parseInt(jobcardStatsLast30Days.FSC4[index].totalCount);
        });
        }
        if(jobcardStatsLast30Days.Paid !== undefined && jobcardStatsLast30Days.Paid !== null){
          angular.forEach(jobcardStatsLast30Days.Paid,function(val,index){
          paidJobcardLast30Days.push(parseInt(jobcardStatsLast30Days.Paid[index].totalCount));
          $scope.paidJobcardTotalLast30Days += parseInt(jobcardStatsLast30Days.Paid[index].totalCount);
        });
        }
         if(jobcardStatsLast30Days.Others !== undefined && jobcardStatsLast30Days.Others !== null){
          angular.forEach(jobcardStatsLast30Days.Others,function(val,index){
          othersJobcardLast30Days.push(parseInt(jobcardStatsLast30Days.Others[index].totalCount));
         // $scope.paidJobcardTotalWeekly += parseInt(jobcardStatsWeekly.Paid[index].totalCount);
        });
        }
        
        $scope.jobcardDataLast30Days.push(fsc1JobcardLast30Days);
        $scope.jobcardDataLast30Days.push(fsc2JobcardLast30Days);
        $scope.jobcardDataLast30Days.push(fsc3JobcardLast30Days);
        $scope.jobcardDataLast30Days.push(fsc4JobcardLast30Days);
        $scope.jobcardDataLast30Days.push(paidJobcardLast30Days);
        $scope.jobcardDataLast30Days.push(othersJobcardLast30Days);

$scope.jobcardChartLast30Days = {
             options: {
      tooltipEvents: [],
      showTooltips: true,
      tooltipCaretSize: 0,
      onAnimationComplete: function () {
        this.showTooltip(this.segments, true);
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true, ticks: { beginAtZero:true,min: 0}
        }]
      },
      legend: {display: true,position: 'bottom'}/*,
      data : [
        [22,11,10,28,11],[9,12,30,9,22],[21,35,11,33,8]
      ]*/
    }
            ,
            labels: $scope.jobcardDataLablesLast30Days ,
            series: $scope.jobcardDataSeriesLast30Days ,
            colors: ['#FB617F', '#ff9900','#2FCF92','#0083ca','#A0B421','#b3d1d1'],
            data: $scope.jobcardDataLast30Days 
        };
        
        $scope.datasetOverrideJobcardLast30Days = [
            {
                fill: true,
                backgroundColor: $scope.fsc1ColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.fsc2ColorsWeekly
            },
            {
                fill: true,
                backgroundColor: $scope.fsc3ColorsWeekly
            },
            {
                fill: true,
                backgroundColor: $scope.fsc4ColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.paidColorsWeekly
            },
            {
                fill: true,
                backgroundColor:$scope.othersJobcardColors
            }
            
            ];

        console.log(JSON.stringify($scope.jobcardDataLast30Days));
        console.log(JSON.stringify($scope.jobcardDataLablesLast30Days));
        console.log(JSON.stringify($scope.jobcardDataSeriesLast30Days));
        
        $scope.loaderIconJobcardLast30Days = false;
      }, function(err) {
        $scope.loaderIconJobcardLast30Days = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    //getServiceCenterJobcardLast30DaysStats();


/*Last 30 Days Jobcard Stats End*/

$scope.yearWiseDataColors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.yearWiseDataSeries = ['Count'];
$scope.yearWiseData = [];
$scope.yearWiseDataLables = [];
var yearWiseCount = [];
function getYearWiseCustomerStats() {
$scope.yearWiseDataSeries =['Count'];
$scope.yearWiseData= [];
$scope.yearWiseDataLables = [];
var yearWiseCount = [];
     $scope.loaderIconUniqueCustomers = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetYearWiseCustomerStatsService.query({branchId:selectedBranch,scId:adminUserScId,brandName:loginBrandName,token:lsToken},function (data) {
       console.log('Year Wise Customer Stats :',data);
        var yearWiseCustomerStats = data;
       // if(yearWiseCustomerStats.totalCount !== undefined && yearWiseCustomerStats.year !== null){
          angular.forEach(yearWiseCustomerStats,function(val,index){
          yearWiseCount.push(parseInt(yearWiseCustomerStats[index].totalCount));
            $scope.yearWiseDataLables.push(yearWiseCustomerStats[index].year);
            //$scope.yearWiseDataSeries.push(yearWiseCustomerStats[index].year);
        });
       // }
        
        $scope.yearWiseData.push(yearWiseCount);
        //console.log(JSON.stringify($scope.yearWiseData));
        //console.log(JSON.stringify($scope.yearWiseDataLables));
        //console.log(JSON.stringify($scope.yearWiseDataSeries));
        
$scope.yearWiseDataChart = {
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
            labels: $scope.yearWiseDataLables ,
            series: $scope.yearWiseDataSeries ,
            colors: ['#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92'],
            data: $scope.yearWiseData 
        };
        
        $scope.datasetOverrideYearWiseData = [
             {
                fill: true,
                backgroundColor: $scope.yearWiseDataColors
            }
            ];

       /* $scope.optionsYearWise = {legend: {display: true,position: 'bottom'},scales: {
          yAxes: [{id: 'y-axis-1', ticks: { beginAtZero:true,min: 0}}]
        }};*/
        $scope.loaderIconUniqueCustomers = false;
      }, function(err) {
        $scope.loaderIconUniqueCustomers = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getYearWiseCustomerStats();

    
$scope.onTimeDataColors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.onTimeDeliveryDataSeries =['Rate(%)'];
$scope.onTimeDeliveryData= [];
$scope.onTimeDeliveryDataLables = [];
//$scope.onTimeDeliveryDataColors = ['#2FCF92'];
var onTimeDeliveryCount = [];
//var selectedBranchId = 'all';
function getOnTimeDeliveryStats() {
$scope.onTimeDataColors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.onTimeDeliveryDataSeries =['Rate(%)'];
$scope.onTimeDeliveryData= [];
$scope.onTimeDeliveryDataLables = [];
var onTimeDeliveryCount = [];
      $scope.loaderIconSameDayDelivery = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetOnTimeDeliveryStatsService.query({branchId:selectedBranch,scId:adminUserScId,brandName:loginBrandName,token:lsToken},function (data) {
       console.log('on Time Delivery Stats :',data);
        var onTimeDeliveryStats = data;
       // if(yearWiseCustomerStats.totalCount !== undefined && yearWiseCustomerStats.year !== null){
          angular.forEach(onTimeDeliveryStats,function(val,index){
          onTimeDeliveryCount.push(onTimeDeliveryStats[index].onTime);
            $scope.onTimeDeliveryDataLables.push(onTimeDeliveryStats[index].monthName);
            //$scope.yearWiseDataSeries.push(yearWiseCustomerStats[index].year);
        });
       // }
        $scope.onTimeDeliveryData.push(onTimeDeliveryCount);
        //console.log(JSON.stringify($scope.onTimeDeliveryData));
        //console.log(JSON.stringify($scope.onTimeDeliveryDataLables));
        //console.log(JSON.stringify($scope.onTimeDeliveryDataSeries));
        
       $scope.onTimeDataChart = {
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
            labels: $scope.onTimeDeliveryDataLables ,
            series: $scope.onTimeDeliveryDataSeries ,
            colors: ['#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92'],
            data: $scope.onTimeDeliveryData 
        };
        
        $scope.datasetOverrideOnTimeData = [
             {
                fill: true,
                backgroundColor: $scope.onTimeDataColors
            }
            ];
         $scope.loaderIconSameDayDelivery = false;
      }, function(err) {
       $scope.loaderIconSameDayDelivery = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getOnTimeDeliveryStats();
 
 var customerServicedCountData= [['No. Of Time Visited', 'Customer Count']];
$scope.dataErrorMsgCustomerServicedCount = false;
$scope.customerVisitedTotal = 0;
function getCustomerServiceCountChartData() {
$scope.dataErrorMsgCustomerServicedCount = false;
$scope.customerVisitedTotal = 0;
  customerServicedCountData= [['No. Of Time Visited', 'Customer Count']];
      //showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      GetCustomerVisitedCountService.query({scId:adminUserScId,token:lsToken},function(data) {
        console.log('Customer Serviced Count Data :',data);
          var customerVisitedData = data;
          angular.forEach(customerVisitedData,function(val,index){
             if(customerVisitedData[index] !== undefined && customerVisitedData[index] !== null ){
                customerServicedCountData.push([customerVisitedData[index].visitsCount,parseInt(customerVisitedData[index].apptCount)]);
                $scope.customerVisitedTotal += parseInt(customerVisitedData[index].apptCount);
              }
         });
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChartCustomerVisited);
        console.log('Customer visited data : ',JSON.stringify(customerServicedCountData));
        //showLoader(false);
      }, function(err) {
        $scope.dataErrorMsgCustomerServicedCount = true;
        customerServicedCountData= [['No. Of Time Visited', 'Customer Count']];
        //showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCustomerServiceCountChartData();

    function drawChartCustomerVisited() {
        var data = google.visualization.arrayToDataTable(customerServicedCountData);
        var options = {
          /*title: 'Customer Service Statistics :',*/
           pieHole: 0.4,
          /*pieSliceText:'value',*/
         sliceVisibilityThreshold: 0,
         legend: {display: true,position: 'right'}
        };
        var chart = new google.visualization.PieChart(document.getElementById('customerVisited'));
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            //alert('The user selected ' + topping);
            //selectedGraphSubstatus = topping;
            //$scope.exportStatus = 'Not Interested';
            getPerticularPotentialData(topping);
          }
        }
        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
      }

function getPerticularPotentialData(selectedType) {
      var lsToken = TokenService.getToken(adminUserScId);
      console.log(serviceURL+'get_customer_repetitive_visted_details/'+adminUserScId+'/'+selectedType+'/'+lsToken);
      $window.open(serviceURL+'get_customer_repetitive_visted_details/'+adminUserScId+'/'+selectedType+'/'+lsToken);
    };

        




$scope.outSideCustomerVisitedDataColors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.outSideCustomerVisitedDataSeries =['Our Customers','Other Dealership Customers'];
$scope.outSideCustomerVisitedData= [];
$scope.outSideCustomerVisitedDataLables = [];
var ourCustomerCount = [];
var outSideCustomerCount = [];
function getOutsideCustomerVisitedStats() {
$scope.outSideCustomerVisitedDataSeries = ['Our Customers','Other Dealership Customers'];
$scope.outSideCustomerVisitedData= [];
$scope.outSideCustomerVisitedDataLables = [];
ourCustomerCount = [];
outSideCustomerCount = [];
     $scope.loaderIconOtherCustomers = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetOutsideCustomerVisitService.get({scId:adminUserScId,token:lsToken},function (data) {
       console.log('Out Side Customer Visited Stats :',data);
        var outSideCustomerVisitedStats = data;
        if(outSideCustomerVisitedStats.our_customer_count !== undefined && outSideCustomerVisitedStats.our_customer_count !== null){
          angular.forEach(outSideCustomerVisitedStats.our_customer_count,function(val,index){
          ourCustomerCount.push(parseInt(outSideCustomerVisitedStats.our_customer_count[index].our_customer));
            $scope.outSideCustomerVisitedDataLables.push(outSideCustomerVisitedStats.our_customer_count[index].monthName);
        });
        }
        if(outSideCustomerVisitedStats.outside_customer_count !== undefined && outSideCustomerVisitedStats.outside_customer_count !== null){
          angular.forEach(outSideCustomerVisitedStats.outside_customer_count,function(val,index){
          outSideCustomerCount.push(parseInt(outSideCustomerVisitedStats.outside_customer_count[index].outside_customer));
        });
        }
        
        $scope.outSideCustomerVisitedData.push(ourCustomerCount);
        $scope.outSideCustomerVisitedData.push(outSideCustomerCount);
        console.log(JSON.stringify($scope.outSideCustomerVisitedData));
        //console.log(JSON.stringify($scope.outSideCustomerVisitedDataLables));
        console.log(JSON.stringify($scope.outSideCustomerVisitedDataSeries));
        
$scope.outSideCustomerDataChart = {
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
            labels: $scope.outSideCustomerVisitedDataLables ,
            series: $scope.outSideCustomerVisitedDataSeries ,
            colors: ['#FB617F', '#ff9900','#2FCF92'],
            data: $scope.outSideCustomerVisitedData 
        };
        
        $scope.datasetOverrideOutSideCustomerData = [
             {
                fill: true,
                backgroundColor: $scope.fsc1Colors
            },
            {
                fill: true,
                backgroundColor:$scope.fsc2Colors
            },
            {
                fill: true,
                backgroundColor: $scope.fsc3Colors
            }
            ];
        $scope.loaderIconOtherCustomers = false;
      }, function(err) {
        $scope.loaderIconOtherCustomers = false;
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getOutsideCustomerVisitedStats();


var serviceAdvisorDataColors1 = ['#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F'];
var serviceAdvisorDataColors2 = ['#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900'];
$scope.serviceAdvisorDataSeries = ['Appointments','Revenue'];
$scope.serviceAdvisorData= [];
$scope.serviceAdvisorDataLables = [];
var appointments = [];
var revenue = [];
function getServiceAdvisorStats() {
$scope.serviceAdvisorDataSeries = ['Appointments','Revenue'];
$scope.serviceAdvisorData= [];
$scope.serviceAdvisorDataLables = [];
appointments = [];
revenue = [];
     $scope.loaderIconServiceAdvisor = true;
      var lsToken = TokenService.getToken(adminUserScId);
       GetServiceAdvisorStatsService.get({scId:adminUserScId,branchId:selectedBranch,token:lsToken},function (data) {
       console.log('Service Advisor Stats :',data);
        var serviceAdvisorStats = data;
        $scope.dataErrorMsgServiceAdviserStats = '';
        if(serviceAdvisorStats.appointment !== undefined && serviceAdvisorStats.appointment !== null){
          angular.forEach(serviceAdvisorStats.appointment,function(val,index){
          appointments.push(parseInt(serviceAdvisorStats.appointment[index].count));
          $scope.serviceAdvisorDataLables.push(serviceAdvisorStats.appointment[index].addvisor_name);
        });
        }
        if(serviceAdvisorStats.revenue !== undefined && serviceAdvisorStats.revenue !== null){
          angular.forEach(serviceAdvisorStats.revenue,function(val,index){
          revenue.push(parseInt(serviceAdvisorStats.revenue[index].amount));
        });
        }
        
        $scope.serviceAdvisorData.push(appointments);
        $scope.serviceAdvisorData.push(revenue);
        console.log(JSON.stringify($scope.serviceAdvisorData));
        console.log(JSON.stringify($scope.serviceAdvisorDataSeries));
        
$scope.serviceAdvisorDataChart = {
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
            labels: $scope.serviceAdvisorDataLables ,
            series: $scope.serviceAdvisorDataSeries ,
            colors: ['#FB617F', '#ff9900'],
            data: $scope.serviceAdvisorData 
        };
        
        $scope.datasetOverrideServiceAdvisorData = [
             {
                fill: true,
                backgroundColor: serviceAdvisorDataColors1
            },
            {
                fill: true,
                backgroundColor:serviceAdvisorDataColors2
            }
            ];
        $scope.loaderIconServiceAdvisor = false;
      }, function(err) {
        $scope.loaderIconServiceAdvisor = false;
        $scope.dataErrorMsgServiceAdviserStats = err.data.message;
      });
    }
    getServiceAdvisorStats();



/*$scope.validMonths = [{'id':'1', 'month':'Jan'},{'id':'2','month':'Feb'},{'id':'3','month':'March'},{'id':'4','month':'April'},{'id':'5','month':'May'},
      {'id':'6','month':'June'},{'id':'7','month':'July'},{'id':'8','month':'August'},{'id':'9','month':'Sept'},
      {'id':'10','month':'Oct'},{'id':'11','month':'Nov'},{'id':'12','month':'Dec'}];
$scope.validYears = [{'id':'1', 'year':'2018'}];
   var selectedYear = 'year';
   var selectedMonth = 'month';
   $scope.getSelectedYear = function (selYear) {
       console.log('selected year',selYear);
      selectedYear = selYear;
      if(selYear === null){
        selectedYear = 'year';
      }
        console.log('==============++++++++++++++++++',selectedYear);
     getMonthWisePotentialCustomerStats();
    };

    $scope.monthDisplay = 'Month';
    $scope.getSelectedMonth = function (selMonthObj) {
       console.log('selected month',selMonthObj);
      $scope.monthDisplay = selMonthObj.month;
      selectedMonth = selMonthObj.id;
      if(selectedMonth === null){
        selectedMonth = 'month';
      }
      console.log('==============++++++++++++++++++',selectedMonth);
     getMonthWisePotentialCustomerStats();
    };*/

      var selectedFromDate = 'month';
      var selectedToDate = 'month';
      var exportType = 'submit';
    $scope.adminPotentiaStatsByDate = function(selFromDate,selToDate){
       //$scope.selectedFromDate = '';
      // $scope.selectedToDate  = '';
      $scope.potentialCustomerDataDataSeries = ['Potential Data'];
      $scope.potentialCustomerData = [];
      $scope.potentialCustomerDataLables = [];
      potentialData = [];
      $scope.totalPotentialCustomers = 0;
       if(selFromDate > selToDate) {
        $window.alert('To Date should be greater than From Date');
      } else {
       selectedFromDate = selFromDate.getFullYear() + '-' + (selFromDate.getMonth() + 1) + '-' + selFromDate.getDate();
       selectedToDate = selToDate.getFullYear() + '-' + (selToDate.getMonth() + 1) + '-' + selToDate.getDate();
       getMonthWisePotentialCustomerStats('submit');
      }
    };

    $scope.salesJobStatsByDate = function(selFromDate,selToDate){
      $scope.salesJobcardDataSeries = ['Jobcard Data','Sales Data'];
      $scope.salesJobcardData= [];
      $scope.salesJobcardDataLables = [];
      salesData = [];
      jobcardData = [];
      $scope.totalSales = 0;
      $scope.totalJobcard = 0;
       if(selFromDate > selToDate) {
        $window.alert('To Date should be greater than From Date');
      } else {
       selectedFromDate = selFromDate.getFullYear() + '-' + (selFromDate.getMonth() + 1) + '-' + selFromDate.getDate();
       selectedToDate = selToDate.getFullYear() + '-' + (selToDate.getMonth() + 1) + '-' + selToDate.getDate();
       getMonthWiseSalesJobcardStats();
      }
    }

    $scope.exportPotentialCustomerStats = function(){
    getMonthWisePotentialCustomerStats('export');
    };


$scope.potentialCustomerDataColors = ['#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca','#0083ca', '#0083ca','#0083ca'];
$scope.visitedCustomerDataColors = ['#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F'];
$scope.potentialCustomerDataDataSeries =['Potential Data','Visited Customers'];
$scope.potentialCustomerData= [];
$scope.potentialCustomerDataLables = [];
var potentialData = [];
var visitedCustomerData = [];
$scope.totalPotentialCustomers = 0;
$scope.totalVisitedCustomers = 0;
function getMonthWisePotentialCustomerStats(status) {
$scope.potentialCustomerDataDataSeries = ['Potential Data','Visited Customers'];
$scope.potentialCustomerData= [];
$scope.potentialCustomerDataLables = [];
potentialData = [];
visitedCustomerData = [];
$scope.loaderIconPotentialCustomer = true;
var lsToken = TokenService.getToken(adminUserScId);
exportType = status;
if(exportType === 'export'){
  $scope.loaderIconPotentialCustomer = false;
    //exportType = 'export';
  console.log(serviceURL+'get_month_wise_potential_customer_stats/'+adminUserScId+'/'+selectedFromDate+'/'+selectedToDate+'/'+selectedBranch+'/'+exportType+'/'+lsToken);       
  $window.open(serviceURL+'get_month_wise_potential_customer_stats/'+adminUserScId+'/'+selectedFromDate+'/'+selectedToDate+'/'+selectedBranch+'/'+exportType+'/'+lsToken);       
  exportType === 'submit'; 
} else if(exportType === 'submit'){
  $scope.totalPotentialCustomers = 0;
  $scope.totalVisitedCustomers = 0;
       GetMonthWisePotentialCustomerService.get({scId:adminUserScId,fromDate:selectedFromDate,toDate:selectedToDate,branchId:selectedBranch,exportType:exportType,token:lsToken},function (data) {
       console.log('Potential Customer Stats :',data);
        var potentialCustomerStats = data;
        $scope.dataErrorMsgPotentialCustomerStats = '';
        if(potentialCustomerStats.potentialData !== undefined && potentialCustomerStats.potentialData !== null){
          angular.forEach(potentialCustomerStats.potentialData,function(val,index){
          potentialData.push(parseInt(potentialCustomerStats.potentialData[index].apptCount));
          $scope.totalPotentialCustomers += parseInt(potentialCustomerStats.potentialData[index].apptCount);
          $scope.potentialCustomerDataLables.push(potentialCustomerStats.potentialData[index].day);
        });
        }
        if(potentialCustomerStats.vistedCustomers !== undefined && potentialCustomerStats.vistedCustomers !== null){
          angular.forEach(potentialCustomerStats.vistedCustomers,function(val,index){
          visitedCustomerData.push(parseInt(potentialCustomerStats.vistedCustomers[index].apptCount));
          $scope.totalVisitedCustomers += parseInt(potentialCustomerStats.vistedCustomers[index].apptCount);
        });
        }
        $scope.potentialCustomerData.push(potentialData);
        $scope.potentialCustomerData.push(visitedCustomerData);
        console.log('potentialCustomerData',JSON.stringify($scope.potentialCustomerData));
       // console.log(JSON.stringify($scope.potentialCustomerDataDataSeries));
        console.log('potentialCustomerLables',JSON.stringify($scope.potentialCustomerDataLables));
        
    $scope.monthWisePotentialCustomerDataChart = {
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
            labels: $scope.potentialCustomerDataLables ,
            series: $scope.potentialCustomerDataDataSeries ,
            colors: ['#0083ca','#FB617F'],
            data: $scope.potentialCustomerData 
        };
        
        $scope.datasetOverrideMonthWisePotentialCustomerData = [
             {
                fill: true,
                backgroundColor: $scope.potentialCustomerDataColors
            },
            {
                fill: true,
                backgroundColor: $scope.visitedCustomerDataColors
            }
            ];
        $scope.loaderIconPotentialCustomer = false;
      }, function(err) {
        $scope.loaderIconPotentialCustomer = false;
        $scope.dataErrorMsgPotentialCustomerStats = err.data.message;
      });
  }
    }
    getMonthWisePotentialCustomerStats('submit');
   
    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }

    var chartLabel;
    $scope.getTcAdminStatsStatusDetail = function (statsCount) {
      var currentYear = new Date();
      console.log(statsCount);
      console.log('status :  :',Array.isArray(statsCount));
      if(Array.isArray(statsCount) === true) {
        console.log('graph lable :  :',statsCount[0]._model.label);
        console.log('graph lable status :  :',statsCount[0]._model.datasetLabel);
        //chartLabel = statsCount[0]._model.datasetLabel;
        selectedGraphMonth = statsCount[0]._model.label+'-'+currentYear.getFullYear();
        selectedGraphStatus = statsCount[0]._model.datasetLabel;
        console.log('sel month::',selectedGraphMonth);
        $scope.exportStatus = 'Potential Data';
      }
      else if(Array.isArray(statsCount) === false){
        selStatus = statsCount;
      }
      if(selectedGraphStatus === 'Potential Data' || selectedGraphStatus === 'Visited Customers'){
         getAdminCustomerDetails(selectedBranch,selectedGraphMonth,selectedGraphStatus,reportTypeForCustomerDetails);
      }
      else if(selectedGraphStatus === 'Sales Data' || selectedGraphStatus === 'Jobcard Data'){
         getSalesJobcardDetails(selectedBranch,selectedGraphMonth,selectedGraphStatus,reportTypeForCustomerDetails);
      }
    };

     $rootScope.creTableData = [];
     var reportTypeForCustomerDetails = 'submit';
     var selectedGraphMonth;
     var selectedGraphStatus;
  function getAdminCustomerDetails(selBranch,selMonth,selStatus,selReportType) {
    $rootScope.exportType = true;
    selectedBranch = selBranch;
    selectedGraphMonth = selMonth;
    selectedGraphStatus = selStatus;
    $scope.statusDisplay = selectedGraphStatus;
    reportTypeForCustomerDetails = selReportType;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      if(reportTypeForCustomerDetails === 'export'){
         $scope.exportStatus = '';
         $window.open(serviceURL+'get_month_wise_potential_customer_details/'+adminUserScId+'/'+selectedGraphMonth+'/'+selectedGraphStatus+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
         showLoader(false); 
         reportTypeForCustomerDetails = 'submit';
      } else if(reportTypeForCustomerDetails === 'submit'){
       GetPotentialCustomerDetailsService.query({scId:adminUserScId,date:selectedGraphMonth,status:selectedGraphStatus,branchId:selectedBranch,reportType:reportTypeForCustomerDetails,token:lsToken},function (data) {
       console.log('ADMIN Potential customer DETAILS :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      }, function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
     }
    }

 function getSalesJobcardDetails(selBranch,selMonth,selStatus,selReportType) {
    $rootScope.exportType = true;
    selectedBranch = selBranch;
    selectedGraphMonth = selMonth;
    selectedGraphStatus = selStatus;
    $scope.statusDisplay = selectedGraphStatus;
    reportTypeForCustomerDetails = selReportType;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      if(reportTypeForCustomerDetails === 'export'){
         $scope.exportStatus = '';
         console.log(serviceURL+'get_day_wise_sales_job_card_details/'+selectedGraphMonth+'/'+selectedGraphStatus+'/'+adminUserScId+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
         $window.open(serviceURL+'get_day_wise_sales_job_card_details/'+selectedGraphMonth+'/'+selectedGraphStatus+'/'+adminUserScId+'/'+selectedBranch+'/'+reportTypeForCustomerDetails+'/'+lsToken);
         showLoader(false); 
         reportTypeForCustomerDetails = 'submit';
      } else if(reportTypeForCustomerDetails === 'submit'){
       GetSalesJobcardStatsDetailedService.query({date:selectedGraphMonth,status:selectedGraphStatus,scId:adminUserScId,branch:selectedBranch,reportType:reportTypeForCustomerDetails,token:lsToken},function (data) {
       console.log('ADMIN SALES AND JOBCARD customer DETAILS :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableModal").modal('show');
        showLoader(false);
      }, function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
     }
    }

  $scope.exportCustomerDetails = function(){
    console.log('selectedGraphStatus',selectedGraphStatus);
    if(selectedGraphStatus === 'Potential Data' || selectedGraphStatus === 'Visited Customers'){
       getAdminCustomerDetails(selectedBranch,selectedGraphMonth,selectedGraphStatus,'export');
    }
    else if(selectedGraphStatus === 'Sales Data' || selectedGraphStatus === 'Jobcard Data'){
       getSalesJobcardDetails(selectedBranch,selectedGraphMonth,selectedGraphStatus,'export');
     }
   }


$scope.salesJobcardDataSeries = ['Jobcard Data','Sales Data'];
$scope.salesJobcardData= [];
$scope.salesJobcardDataLables = [];
var salesData = [];
var jobcardData = [];
$scope.totalSales = 0;
$scope.totalJobcard = 0;
function getMonthWiseSalesJobcardStats() {
$scope.salesJobcardDataSeries = ['Jobcard Data','Sales Data'];
$scope.salesJobcardData = [];
$scope.salesJobcardDataLables = [];
salesData = [];
jobcardData = [];
$scope.loaderIconSalesJobcardData = true;
var lsToken = TokenService.getToken(adminUserScId);
  $scope.totalSalesJobcard = 0;
       GetSalesJobcardDataService.get({fromDate:selectedFromDate,toDate:selectedToDate,branchId:selectedBranch,scId:adminUserScId,token:lsToken},function (data) {
       console.log('Sales Jobcard Customer Stats :',data);
        var salesJobcardStats = data;
        $scope.dataErrorMsgSalesJobcardData = '';
        if(salesJobcardStats.salesCount !== undefined && salesJobcardStats.salesCount !== null){
          angular.forEach(salesJobcardStats.salesCount,function(val,index){
          salesData.push(parseInt(salesJobcardStats.salesCount[index].Count));
          $scope.totalSales = parseInt(salesJobcardStats.totalSalesCount);
          $scope.salesJobcardDataLables.push(salesJobcardStats.salesCount[index].Day);
        });
        }
        if(salesJobcardStats.jobcardCount !== undefined && salesJobcardStats.jobcardCount !== null){
          angular.forEach(salesJobcardStats.jobcardCount,function(val,index){
          jobcardData.push(parseInt(salesJobcardStats.jobcardCount[index].Count));
          $scope.totalJobcard = parseInt(salesJobcardStats.totalJobcardCount);
        });
        }
        $scope.salesJobcardData.push(jobcardData);
        $scope.salesJobcardData.push(salesData);
        console.log('Sales Jobcard Data',JSON.stringify($scope.salesJobcardData));       
        $scope.monthWiseSalesJobcardDataChart = {
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
            labels: $scope.salesJobcardDataLables,
            series: $scope.salesJobcardDataSeries,
            colors: ['#0083ca','#FB617F'],
            data: $scope.salesJobcardData 
        };
        $scope.datasetOverrideMonthWiseSalesJobcardData = [
            {
                fill: true,
                backgroundColor: $scope.potentialCustomerDataColors
            },
            {
                fill: true,
                backgroundColor: $scope.visitedCustomerDataColors
            }
            ];
        $scope.loaderIconSalesJobcardData = false;
      }, function(err) {
        $scope.loaderIconSalesJobcardData = false;
        $scope.dataErrorMsgSalesJobcardData = err.data.message;
      });
    }
    getMonthWiseSalesJobcardStats();


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


$scope.downloadPDF = function(id) {
  var newCanvas = document.querySelector('#'+id);
  //create image from dummy canvas
  var newCanvasImg = newCanvas.toDataURL("image/jpeg", 1.0);
    //creates PDF from img
  var doc = new jsPDF('landscape');
  doc.setFontSize(20);
  doc.text(15, 15, "Super Cool Chart");
  doc.addImage(newCanvasImg, 'JPEG', 10, 10, 280, 150 );
  doc.save('new-canvas.pdf');
 };

    $(document).ready(function(){
      $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
      });
    });

  });
