'use strict';

angular.module('letsService')
  .controller('SalesFeedbackPerformanceController', function ($scope,$sce,$cookies,$filter,$timeout,serviceURL,ngTableParams,$rootScope,TokenService,GetScWiseTeleCallerService,TeleCallerWiseServiceCenterService,CreDashboardStatsDataService,AdminCustomerDetailsStatsWiseService,SalesFeedbackCallRecordingService,GetSalesHistoryService,GetAdminCallerDashboardConversionStatsService,$window,GetYearWiseCustomerStatsService,GetSuperAdminDealerListService,SalesFeedbackYesNoDataService,SalesFeedbackRatingDataService,SalesFeedbackDetailsService,GetPerticularSalesDataService,ServiceTypeService,SalesFeedbackPerformanceStatsService,SalesFeedbackPerformanceDetailsService,UpdateCustomerPhoneService,GetSalesFeedbackYesNoDefaultStatsService,GetFeedbckHistoryService) {

   /*var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var loginBrandName = $cookies.get('loggedInUserBikeBrand');*/

    var adminUserId = $cookies.get('loggedInUserIdAdmin');
    var adminUserScId = $cookies.get('loggedInUserScIdAdmin');
    var loginBrandName = $cookies.get('loggedInUserBikeBrandAdmin'); 
   
    function showLoader(loadingStatus) {
      $scope.loaderIcon = loadingStatus;
    }
     var selectedCaller = 'caller';
     var selectedBranch = 'branch';
     var selectedFromDate = 'month';
     var selectedToDate = 'month';
     //var selectedDataType = 'psf';
     $scope.selectedFromDate = 'month';
     $scope.selectedToDate = 'month';
     var aniverseryType = '1 Year';


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
      getServiceCenterTeleCallerWise(adminUserScId);
      getScWiseCallerList(adminUserScId);
      getCrePsfDashboardData(selectedCaller,selectedBranch,adminUserScId);
      getFeedbackYesNoStats();
      getFeedbackRatingStats();
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
      getCrePsfDashboardData(selectedCaller,selectedBranch,adminUserScId);
      getFeedbackYesNoStats();
      getFeedbackRatingStats();
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
      getCrePsfDashboardData(selectedCaller,selectedBranch,adminUserScId);
      getFeedbackYesNoStats();
      getFeedbackRatingStats();
    };

 function getCrePsfDashboardData(selCaller,selBranch,id) {
      selectedCaller = selCaller;
      selectedBranch = selBranch;
      adminUserScId = id;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      SalesFeedbackPerformanceStatsService.query({scId:adminUserScId,callerId:selectedCaller,dataType:aniverseryType,branchId:selectedBranch,token:lsToken},function(data) {
        console.log('Sales Feedback Performance dashboard data :',data);
        $scope.creDashboardData = data;
        $scope.creDashboardDataErrorMsg = '';
        // console.log(data);
        showLoader(false);
      }, function(err) {
         showLoader(false);
         $scope.creDashboardData = [];
         $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }

    getCrePsfDashboardData(selectedCaller,selectedBranch,adminUserScId);

    var selectedDataTypeId;
    var selectedStatsStatus;
    var selectedServiceDueType;
    $rootScope.creTableData = [];
    var selectedDataTypeName;
 $scope.getPericularStatsData = function (dataTypeName,status) {
      //console.log('dataTypeName : ',dataTypeName);
      //console.log('dataTypeId : ',dataTypeId);
      //console.log('status : ',status);
      $scope.statusDisplay = status;
      selectedDataTypeName = dataTypeName;
      //selectedFromDate = selFromDate;
      //selectedToDate = selToDate;
      $rootScope.exportType = true;
      $scope.filteredServiceDueTypes = [];
      showLoader(true);
      selectedStatsStatus = status;
      var lsToken = TokenService.getToken(adminUserScId);
      if(reportTypeForCustomerDetails === 'export'){
        $scope.exportStatus = '';
         $window.open(serviceURL+'get_sales_feedback_stats_details/'+adminUserScId+'/'+selectedCaller+'/'+selectedBranch+'/'+selectedStatsStatus+'/'+aniverseryType+'/'+selectedDataTypeName+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
       }else if(reportTypeForCustomerDetails === 'submit'){
      SalesFeedbackPerformanceDetailsService.query({scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,status:selectedStatsStatus,aniverseryType:aniverseryType,dataType:selectedDataTypeName,reportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
        console.log('ADMIN SALES PSF CUSTOMER DETAILS STATS WISE :',data);
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
        reportTypeForCustomerDetails = 'export';
        console.log(reportTypeForCustomerDetails);
        $scope.getPericularStatsData(selectedDataTypeName,selectedStatsStatus);
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

$scope.feedBackDataColors1= ['#2FCF92','#FB617F'];
$scope.feedBackDataColors2 = ['#2FCF92','#FB617F'];
$scope.feedBackDataSeries =[];
$scope.feedBackData = [];
$scope.feedBackDataLables = [];
var feedBackStats = [];
function getFeedbackYesNoStats() {
$scope.feedBackDataChart = [];
$scope.feedBackDataSeries =[];
$scope.feedBackData= [];
$scope.feedBackDataLables = ['Yes','No'];
var feedBackCount1 = [];
var feedBackCount2 = [];
var feedBackCount3 = [];
var feedBackCount4 = [];
var feedBackCount5 = [];
var feedBackCount6 = [];
var feedBackCount7 = [];
var feedBackCount8 = [];
var feedBackCount9 = [];
var feedBackCount10 = [];
var feedBackCount11 = [];
var feedBackCount12 = [];
var feedBackCount13 = [];
var feedBackCount14 = [];
var feedBackCount15 = [];
     $scope.loaderIconFeedBack = true;
      $scope.feedBackYesNoDataErrorMsg = '';
      var lsToken = TokenService.getToken(adminUserScId);
       SalesFeedbackYesNoDataService.query({fromDate:selectedFromDate,toDate:selectedToDate,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,token:lsToken},function (data) {
       console.log('Sales FeedBack Yes No Stats :',data);
       feedBackStats = data;
       $scope.feedBackStats = data;
       $scope.feedBackYesNoDataErrorMsg = '';
/*var feedBackStats = [
{"feedBackListId":"2","yes":"5","no":"4","slNo":1},
{"feedBackListId":"3","yes":"7","no":"8","slNo":1},
{"feedBackListId":"3","yes":"7","no":"8","slNo":1}
];*/
           //for(var i = 0; i< yearWiseCustomerStats.length; i++){
             if(feedBackStats[0] !== undefined && feedBackStats[0] !== null ){
                    feedBackCount1.push(parseInt(feedBackStats[0].yes));
                    feedBackCount1.push(parseInt(feedBackStats[0].no));
 $scope.feedBackDataChart1 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[0].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount1]
        };
             }

             if(feedBackStats[1] !== undefined && feedBackStats[1] !== null ){
                    feedBackCount2.push(parseInt(feedBackStats[1].yes));
                    feedBackCount2.push(parseInt(feedBackStats[1].no));
 $scope.feedBackDataChart2 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[1].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount2]
        };
             }

             if(feedBackStats[2] !== undefined && feedBackStats[2] !== null ){
                    feedBackCount3.push(parseInt(feedBackStats[2].yes));
                    feedBackCount3.push(parseInt(feedBackStats[2].no));
 $scope.feedBackDataChart3 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[2].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount3]
        };
             }

             if(feedBackStats[3] !== undefined && feedBackStats[3] !== null ){
                    feedBackCount4.push(parseInt(feedBackStats[3].yes));
                    feedBackCount4.push(parseInt(feedBackStats[3].no));
 $scope.feedBackDataChart4 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[3].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount4]
        };
             }

             if(feedBackStats[4] !== undefined && feedBackStats[4] !== null ){
                    feedBackCount5.push(parseInt(feedBackStats[4].yes));
                    feedBackCount5.push(parseInt(feedBackStats[4].no));
 $scope.feedBackDataChart5 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[4].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount5]
        };
             }

             if(feedBackStats[5] !== undefined && feedBackStats[5] !== null ){
                    feedBackCount6.push(parseInt(feedBackStats[5].yes));
                    feedBackCount6.push(parseInt(feedBackStats[5].no));
 $scope.feedBackDataChart6 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[5].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount6]
        };
             }

             if(feedBackStats[6] !== undefined && feedBackStats[6] !== null ){
                    feedBackCount7.push(parseInt(feedBackStats[6].yes));
                    feedBackCount7.push(parseInt(feedBackStats[6].no));
 $scope.feedBackDataChart7 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[6].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount7]
        };
             }
             if(feedBackStats[7] !== undefined && feedBackStats[7] !== null ){
                    feedBackCount8.push(parseInt(feedBackStats[7].yes));
                    feedBackCount8.push(parseInt(feedBackStats[7].no));
 $scope.feedBackDataChart8 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[7].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount8]
        };
             }
             if(feedBackStats[8] !== undefined && feedBackStats[8] !== null ){
                    feedBackCount9.push(parseInt(feedBackStats[8].yes));
                    feedBackCount9.push(parseInt(feedBackStats[8].no));
 $scope.feedBackDataChart9 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[8].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount8]
        };
             }
              if(feedBackStats[9] !== undefined && feedBackStats[9] !== null ){
                    feedBackCount10.push(parseInt(feedBackStats[9].yes));
                    feedBackCount10.push(parseInt(feedBackStats[9].no));
 $scope.feedBackDataChart10 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[9].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount10]
        };
             }

             if(feedBackStats[10] !== undefined && feedBackStats[10] !== null ){
                    feedBackCount11.push(parseInt(feedBackStats[10].yes));
                    feedBackCount11.push(parseInt(feedBackStats[10].no));
 $scope.feedBackDataChart11 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[10].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount11]
        };
             }

             if(feedBackStats[11] !== undefined && feedBackStats[11] !== null ){
                    feedBackCount12.push(parseInt(feedBackStats[11].yes));
                    feedBackCount12.push(parseInt(feedBackStats[11].no));
 $scope.feedBackDataChart12 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[11].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount12]
        };
             }
             if(feedBackStats[12] !== undefined && feedBackStats[12] !== null ){
                    feedBackCount13.push(parseInt(feedBackStats[12].yes));
                    feedBackCount13.push(parseInt(feedBackStats[12].no));
 $scope.feedBackDataChart13 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[12].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount13]
        };
             }

              if(feedBackStats[13] !== undefined && feedBackStats[13] !== null ){
                    feedBackCount14.push(parseInt(feedBackStats[13].yes));
                    feedBackCount14.push(parseInt(feedBackStats[13].no));
 $scope.feedBackDataChart14 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[13].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount14]
        };
             }

             if(feedBackStats[14] !== undefined && feedBackStats[14] !== null ){
                    feedBackCount15.push(parseInt(feedBackStats[14].yes));
                    feedBackCount15.push(parseInt(feedBackStats[14].no));
 $scope.feedBackDataChart15 = {
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
      }
    },
            labels: $scope.feedBackDataLables,
            series: [feedBackStats[14].feedBackListId],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCount15]
        };
             }
                       

            //}

if($scope.feedBackDataChart1){
  $scope.feedBackDataChart.push($scope.feedBackDataChart1);
}
if($scope.feedBackDataChart2){
$scope.feedBackDataChart.push($scope.feedBackDataChart2);
}
if($scope.feedBackDataChart3){
$scope.feedBackDataChart.push($scope.feedBackDataChart3);
}
if($scope.feedBackDataChart4){
$scope.feedBackDataChart.push($scope.feedBackDataChart4);
}
if($scope.feedBackDataChart5){
  $scope.feedBackDataChart.push($scope.feedBackDataChart5);
}
if($scope.feedBackDataChart6){
$scope.feedBackDataChart.push($scope.feedBackDataChart6);
}
if($scope.feedBackDataChart7){
$scope.feedBackDataChart.push($scope.feedBackDataChart7);
}
if($scope.feedBackDataChart8){
$scope.feedBackDataChart.push($scope.feedBackDataChart8);
}
if($scope.feedBackDataChart9){
  $scope.feedBackDataChart.push($scope.feedBackDataChart9);
}
if($scope.feedBackDataChart10){
$scope.feedBackDataChart.push($scope.feedBackDataChart10);
}
if($scope.feedBackDataChart11){
$scope.feedBackDataChart.push($scope.feedBackDataChart11);
}
if($scope.feedBackDataChart12){
$scope.feedBackDataChart.push($scope.feedBackDataChart12);
}
if($scope.feedBackDataChart13){
$scope.feedBackDataChart.push($scope.feedBackDataChart13);
}
if($scope.feedBackDataChart14){
$scope.feedBackDataChart.push($scope.feedBackDataChart14);
}
if($scope.feedBackDataChart15){
$scope.feedBackDataChart.push($scope.feedBackDataChart15);
}
        
        $scope.datasetOverrideFeedBackChartData = [
             {
                fill: true,
                backgroundColor: $scope.feedBackDataColors1
            },
            {
                fill: true,
                backgroundColor: $scope.feedBackDataColors2
            }
            ];
        $scope.loaderIconFeedBack = false;
      }, function(err) {
        $scope.loaderIconFeedBack = false;
        $scope.feedBackYesNoDataErrorMsg = err.data.message;
      });
    }
    getFeedbackYesNoStats();


    var chartLabel;
    var chartLabelStatus;
    var selectedFeedbackListId;
    var feedBackYesNoStatus = 'yesNo';
    var selectedDefaltStatus;
    $scope.getFeedbackYesNoDetail = function (details) {
      $scope.exportStatus = feedBackYesNoStatus;
      if(Array.isArray(details) === true) {
        console.log('graph details :  :',details);
        console.log('graph lable status :  :',details[0]._model.datasetLabel);
        chartLabel = details[0]._model.datasetLabel;
        chartLabelStatus = details[0]._model.label;
      }
      else if(Array.isArray(details) === false){
        //chartLabel = details;
      }
       console.log('chartLabel',chartLabel);
      angular.forEach(feedBackStats,function(val,index){
        if(feedBackStats[index] !== undefined){
           if(feedBackStats[index].feedBackListId === chartLabel){
          selectedFeedbackListId = feedBackStats[index].feedBackListId;
          console.log('Feedback List Id ::',selectedFeedbackListId);
         }
      }
       
      });
       if(defaultDetails){
         selectedDefaltStatus = details;
         getFeedbackYesNoCustomerDetails('1',details,feedBackYesNoStatus,'submit');
      }
      if(!defaultDetails){
           getFeedbackYesNoCustomerDetails(selectedFeedbackListId,chartLabelStatus,feedBackYesNoStatus,'submit');
      }
      //getFeedbackYesNoCustomerDetails(selectedFeedbackListId,chartLabelStatus,feedBackYesNoStatus,'submit');
    };

    var reportTypeForCustomerDetails = 'submit';
    function getFeedbackYesNoCustomerDetails(selFeedbackId,selStatus,selFeedbackStatus,selExportType) {
      console.log('selFeedbackId : ',selFeedbackId);
      //console.log('selStatus : ',selStatus);
      $scope.statusDisplay = selStatus;
      //selectedFromDate = selFromDate;
      //selectedToDate = selToDate;
      $rootScope.exportType = true;
      reportTypeForCustomerDetails = selExportType;
      console.log(selectedFromDate);
      console.log(selectedFromDate);
      showLoader(true);
      selectedStatsStatus = selStatus;
      var lsToken = TokenService.getToken(adminUserScId);
       if(reportTypeForCustomerDetails === 'export'){
          $window.open(serviceURL+'get_sales_feedback_details/'+selectedFromDate+'/'+selectedToDate+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedBranch+'/'+selFeedbackId+'/'+selectedStatsStatus+'/'+selFeedbackStatus+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          console.log(serviceURL+'get_sales_feedback_details/'+selectedFromDate+'/'+selectedToDate+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedBranch+'/'+selFeedbackId+'/'+selectedStatsStatus+'/'+selFeedbackStatus+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
      }
      else if (reportTypeForCustomerDetails === 'submit'){
      SalesFeedbackDetailsService.query({fromDate:selectedFromDate,toDate:selectedToDate,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,feedBackListId:selFeedbackId,feedBackStatus:selectedStatsStatus,status:selFeedbackStatus,exportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
        console.log('FEEDBACK YES/NO CUSTOMER DETAILS STATS :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableFeedbackModal").modal('show');
        showLoader(false);
      },function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableFeedbackModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
     }
  }

$scope.feedBackRatingDataColors1= ['#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92'];
$scope.feedBackRatingDataColors2 = ['#2FCF92','#2FCF92'];
$scope.feedBackRatingDataSeries =[];
$scope.feedBackRatingData = [];
$scope.feedBackRatingDataLables = [];
var feedBackRatingStats = [];
function getFeedbackRatingStats() {
$scope.feedBackRatingDataChart = [];
$scope.feedBackRatingDataSeries =[];
$scope.feedBackRatingData= [];
$scope.feedBackRatingDataLables = ['Rating-1','Rating-2','Rating-3','Rating-4','Rating-5'];
var feedBackRatingCount1 = [];
var feedBackRatingCount2 = [];
var feedBackRatingCount3 = [];
var feedBackRatingCount4 = [];
var feedBackRatingCount5 = [];
var feedBackRatingCount6 = [];
var feedBackRatingCount7 = [];
var feedBackRatingCount8 = [];
var feedBackRatingCount9 = [];
var feedBackRatingCount10 = [];
     $scope.loaderIconFeedBackRating = true;
     $scope.feedBackRatingDataErrorMsg = '';
      var lsToken = TokenService.getToken(adminUserScId);
       SalesFeedbackRatingDataService.query({fromDate:selectedFromDate,toDate:selectedToDate,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,token:lsToken},function (data) {
       console.log('Sales FeedBack Rating Stats :',data);
       feedBackRatingStats = data;
       $scope.feedBackRatingStats = data;
       $scope.feedBackRatingDataErrorMsg = '';
/*var feedBackStats = [
{"feedBackListId":"2","yes":"5","no":"4","slNo":1},
{"feedBackListId":"3","yes":"7","no":"8","slNo":1},
{"feedBackListId":"3","yes":"7","no":"8","slNo":1}
];*/
           //for(var i = 0; i< feedBackRatingStats.length; i++){
             if(feedBackRatingStats[0] !== undefined && feedBackRatingStats[0] !== null ){
                    feedBackRatingCount1.push(parseInt(feedBackRatingStats[0].rating1));
                    feedBackRatingCount1.push(parseInt(feedBackRatingStats[0].rating2));
                    feedBackRatingCount1.push(parseInt(feedBackRatingStats[0].rating3));
                    feedBackRatingCount1.push(parseInt(feedBackRatingStats[0].rating4));
                    feedBackRatingCount1.push(parseInt(feedBackRatingStats[0].rating5));
 $scope.feedBackRatingDataChart1 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[0].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount1]
        };
             }

             if(feedBackRatingStats[1] !== undefined && feedBackRatingStats[1] !== null ){
                    feedBackRatingCount2.push(parseInt(feedBackRatingStats[1].rating1));
                    feedBackRatingCount2.push(parseInt(feedBackRatingStats[1].rating2));
                    feedBackRatingCount2.push(parseInt(feedBackRatingStats[1].rating3));
                    feedBackRatingCount2.push(parseInt(feedBackRatingStats[1].rating4));
                    feedBackRatingCount2.push(parseInt(feedBackRatingStats[1].rating5));
 
 $scope.feedBackRatingDataChart2 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[1].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount2]
        };
             }

             if(feedBackRatingStats[2] !== undefined && feedBackRatingStats[2] !== null ){
                   feedBackRatingCount3.push(parseInt(feedBackRatingStats[2].rating1));
                    feedBackRatingCount3.push(parseInt(feedBackRatingStats[2].rating2));
                    feedBackRatingCount3.push(parseInt(feedBackRatingStats[2].rating3));
                    feedBackRatingCount3.push(parseInt(feedBackRatingStats[2].rating4));
                    feedBackRatingCount3.push(parseInt(feedBackRatingStats[2].rating5));
 $scope.feedBackRatingDataChart3 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[2].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount3]
        };
             }

             if(feedBackRatingStats[3] !== undefined && feedBackRatingStats[3] !== null ){
                   feedBackRatingCount4.push(parseInt(feedBackRatingStats[3].rating1));
                    feedBackRatingCount4.push(parseInt(feedBackRatingStats[3].rating2));
                    feedBackRatingCount4.push(parseInt(feedBackRatingStats[3].rating3));
                    feedBackRatingCount4.push(parseInt(feedBackRatingStats[3].rating4));
                    feedBackRatingCount4.push(parseInt(feedBackRatingStats[3].rating5));
 $scope.feedBackRatingDataChart4 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[3].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount4]
        };
             }

             if(feedBackRatingStats[4] !== undefined && feedBackRatingStats[4] !== null ){
                    feedBackRatingCount5.push(parseInt(feedBackRatingStats[4].rating1));
                    feedBackRatingCount5.push(parseInt(feedBackRatingStats[4].rating2));
                    feedBackRatingCount5.push(parseInt(feedBackRatingStats[4].rating3));
                    feedBackRatingCount5.push(parseInt(feedBackRatingStats[4].rating4));
                    feedBackRatingCount5.push(parseInt(feedBackRatingStats[4].rating5));
 $scope.feedBackRatingDataChart5 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[4].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount5]
        };
             }

             if(feedBackRatingStats[5] !== undefined && feedBackRatingStats[5] !== null ){
                   feedBackRatingCount6.push(parseInt(feedBackRatingStats[5].rating1));
                    feedBackRatingCount6.push(parseInt(feedBackRatingStats[5].rating2));
                    feedBackRatingCount6.push(parseInt(feedBackRatingStats[5].rating3));
                    feedBackRatingCount6.push(parseInt(feedBackRatingStats[5].rating4));
                    feedBackRatingCount6.push(parseInt(feedBackRatingStats[5].rating5));
 $scope.feedBackRatingDataChart6 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[5].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount6]
        };
             }

             if(feedBackRatingStats[6] !== undefined && feedBackRatingStats[6] !== null ){
                    feedBackRatingCount7.push(parseInt(feedBackRatingStats[6].rating1));
                    feedBackRatingCount7.push(parseInt(feedBackRatingStats[6].rating2));
                    feedBackRatingCount7.push(parseInt(feedBackRatingStats[6].rating3));
                    feedBackRatingCount7.push(parseInt(feedBackRatingStats[6].rating4));
                    feedBackRatingCount7.push(parseInt(feedBackRatingStats[6].rating5));
 $scope.feedBackRatingDataChart7 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[6].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount7]
        };
             }
             if(feedBackRatingStats[7] !== undefined && feedBackRatingStats[7] !== null ){
                    feedBackRatingCount8.push(parseInt(feedBackRatingStats[7].rating1));
                    feedBackRatingCount8.push(parseInt(feedBackRatingStats[7].rating2));
                    feedBackRatingCount8.push(parseInt(feedBackRatingStats[7].rating3));
                    feedBackRatingCount8.push(parseInt(feedBackRatingStats[7].rating4));
                    feedBackRatingCount8.push(parseInt(feedBackRatingStats[7].rating5));
 $scope.feedBackRatingDataChart8 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[7].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount8]
        };
             }
             if(feedBackRatingStats[8] !== undefined && feedBackRatingStats[8] !== null ){
                    feedBackRatingCount9.push(parseInt(feedBackRatingStats[8].rating1));
                    feedBackRatingCount9.push(parseInt(feedBackRatingStats[8].rating2));
                    feedBackRatingCount9.push(parseInt(feedBackRatingStats[8].rating3));
                    feedBackRatingCount9.push(parseInt(feedBackRatingStats[8].rating4));
                    feedBackRatingCount9.push(parseInt(feedBackRatingStats[8].rating5));
 $scope.feedBackRatingDataChart9 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[8].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount9]
        };
             }
              if(feedBackRatingStats[9] !== undefined && feedBackRatingStats[9] !== null ){
                    feedBackRatingCount10.push(parseInt(feedBackRatingStats[9].rating1));
                    feedBackRatingCount10.push(parseInt(feedBackRatingStats[9].rating2));
                    feedBackRatingCount10.push(parseInt(feedBackRatingStats[9].rating3));
                    feedBackRatingCount10.push(parseInt(feedBackRatingStats[9].rating4));
                    feedBackRatingCount10.push(parseInt(feedBackRatingStats[9].rating5));
 $scope.feedBackRatingDataChart10 = {
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
      }
    },
            labels: $scope.feedBackRatingDataLables,
            series: [feedBackRatingStats[9].feedBackListId],
            colors: [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ],
            data: [feedBackRatingCount10]
        };
             }
                       

            //}

if($scope.feedBackRatingDataChart1){
  $scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart1);
}
if($scope.feedBackRatingDataChart2){
$scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart2);
}
if($scope.feedBackRatingDataChart3){
$scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart3);
}
if($scope.feedBackRatingDataChart4){
$scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart4);
}
if($scope.feedBackRatingDataChart5){
  $scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart5);
}
if($scope.feedBackRatingDataChart6){
$scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart6);
}
if($scope.feedBackRatingDataChart7){
$scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart7);
}
if($scope.feedBackRatingDataChart8){
$scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart8);
}
if($scope.feedBackRatingDataChart9){
  $scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart9);
}
if($scope.feedBackRatingDataChart10){
$scope.feedBackRatingDataChart.push($scope.feedBackRatingDataChart10);
}
        
        $scope.datasetOverrideFeedBackRatingChartData = [
            {
                fill: true,
                backgroundColor: ['#FB617F','#FB617F','#FB617F','#2FCF92','#2FCF92']
            }
            ];
        $scope.loaderIconFeedBackRating = false;
      }, function(err) {
        $scope.loaderIconFeedBackRating = false;
        $scope.feedBackRatingDataErrorMsg = err.data.message;
      });
    }
    getFeedbackRatingStats();



    var ratingChartLabel;
    var ratingChartLabelStatus;
    var selectedRatingFeedbackListId;
    var feedBackStatus = 'rating';
    $scope.getFeedbackRatingDetail = function (details) {
      $scope.exportStatus = feedBackStatus;
      if(Array.isArray(details) === true) {
        console.log('graph lable :  :',details[0]._model.datasetLabel);
        console.log('graph lable status :  :',details[0]._model.datasetLabel);
        ratingChartLabel = details[0]._model.datasetLabel;
        ratingChartLabelStatus = details[0]._model.label;
        if(ratingChartLabelStatus === 'Rating-1'){
           ratingChartLabelStatus = '1';
        } else if(ratingChartLabelStatus === 'Rating-2'){
           ratingChartLabelStatus = '2';
        } else if(ratingChartLabelStatus === 'Rating-3'){
           ratingChartLabelStatus = '3';
        } else if(ratingChartLabelStatus === 'Rating-4'){
           ratingChartLabelStatus = '4';
        }else if(ratingChartLabelStatus === 'Rating-5'){
           ratingChartLabelStatus = '5';
        }
      }
      else if(Array.isArray(details) === false){
        //chartLabel = details;
      }
      angular.forEach(feedBackStats,function(val,index){
        if(feedBackRatingStats[index] !== undefined){
          console.log(ratingChartLabel);
          //console.log(feedBackRatingStats[index].feedBackQuestion);
          if(feedBackRatingStats[index].feedBackListId === ratingChartLabel){
          selectedRatingFeedbackListId = feedBackRatingStats[index].feedBackListId;
          console.log('selectedRatingFeedbackListId',selectedRatingFeedbackListId);
          console.log('Feedback List Id ::',selectedRatingFeedbackListId);
       }
        }
      });
      getFeedbackRatingCustomerDetails(selectedRatingFeedbackListId,ratingChartLabelStatus,feedBackStatus,'submit');
    };


    function getFeedbackRatingCustomerDetails(selFeedbackId,selStatus,selFeedbackStatus,selExportType) {
      console.log('selFeedbackId : ',selFeedbackId);
      console.log('selStatus : ',selStatus);
      console.log('selFeedbackStatus : ',selFeedbackStatus);
      $scope.statusDisplay = 'Rating-'+selStatus;
      //selectedFromDate = selFromDate;
      //selectedToDate = selToDate;
      $rootScope.exportType = true;
      reportTypeForCustomerDetails = selExportType;
      showLoader(true);
      selectedStatsStatus = selStatus;
      var lsToken = TokenService.getToken(adminUserScId);
      if(reportTypeForCustomerDetails === 'export'){
          $window.open(serviceURL+'get_sales_feedback_details/'+selectedFromDate+'/'+selectedToDate+'/'+adminUserScId+'/'+selectedCaller+'/'+selectedBranch+'/'+selFeedbackId+'/'+selectedStatsStatus+'/'+selFeedbackStatus+'/'+reportTypeForCustomerDetails+'/'+lsToken);
          showLoader(false);
          reportTypeForCustomerDetails = 'submit';
      }
      else if (reportTypeForCustomerDetails === 'submit'){
        SalesFeedbackDetailsService.query({fromDate:selectedFromDate,toDate:selectedToDate,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,feedBackListId:selFeedbackId,feedBackStatus:selectedStatsStatus,status:selFeedbackStatus,exportType:reportTypeForCustomerDetails,token:lsToken}, function(data) {
       console.log('FEEDBACK RATING CUSTOMER DETAILS STATS :',data);
        $rootScope.creTableData = data;
        $rootScope.creTableDataErrorMsg = '';
        $rootScope.tableParams.reload();
        $rootScope.tableParams.page(1);
        $("#adminDataTableFeedbackModal").modal('show');
        showLoader(false);
      },function(err) {
        console.log(err);
        $rootScope.creTableData = [];
        $rootScope.tableParams.reload();
        showLoader(false);
        $("#adminDataTableFeedbackModal").modal('show');
        $rootScope.creTableDataErrorMsg = err.data.message;
      });
      }
       
    }

$scope.exportFeedbackCustomerDetails = function(selExportStatus){
    console.log(selExportStatus);
        if(!defaultDetails){
      if(selExportStatus ==='yesNo'){
       getFeedbackYesNoCustomerDetails(selectedFeedbackListId,chartLabelStatus,feedBackYesNoStatus,'export');
    }
     else if(selExportStatus ==='rating'){
         getFeedbackRatingCustomerDetails(selectedRatingFeedbackListId,ratingChartLabelStatus,feedBackStatus,'export');
     }
   }
      if(defaultDetails){
        getFeedbackYesNoCustomerDetails('1',selectedDefaltStatus,feedBackYesNoStatus,'export');
      }

    }
    
function getAppointmentHistoryData(selChassisNo,selDataTypeId) {
      //console.log(selChassisNo);
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      GetSalesHistoryService.query({chassisNo:selChassisNo,scId:adminUserScId,token:lsToken},function (data) {
       console.log('history data :',data);
       $scope.tcAppointmentHistoryData = data;
       showLoader(false);
      }, function (err) {
        showLoader(false);
        console.log('history error data',err);
        $scope.tcAppointmentHistoryDataErrorMsg = err.data.message;
      });
    }

    $scope.getHistory = function(selChassisNo,selDataTypeId,selApptId,selStatus,customerId){
      console.log(selApptId);
      if(selStatus === undefined){
        selStatus = 'status';
      }
      getAppointmentHistoryData(selChassisNo,selDataTypeId);
      getTCAppointmentCallRecord(selChassisNo,selDataTypeId);
      getServiceHistoryData(selChassisNo);
      getAppointmentDetails(selApptId,selStatus);
      getFeedbackHistoryData(customerId);
    };

    var feedbackType = 'sales';
    function getFeedbackHistoryData(customerId) {
      $scope.loaderIconService = true;
      $scope.tcFeedbackHistoryData = [];
      console.log('Customer Id', customerId);
      var lsToken = TokenService.getToken(adminUserScId);
      GetFeedbckHistoryService.query({customerId:customerId,status:feedbackType,scId:adminUserScId,token:lsToken},function (data) {
        console.log('Sales Feedback history data :',data);
        $scope.loaderIconService = false;
        $scope.tcFeedbackHistoryData = data; 
        $scope.tcFeedbackHistoryDataErrorMsg = '';
      }, function (err) {
        $scope.loaderIconService = false;
        $scope.tcFeedbackHistoryDataErrorMsg = err.data.message;
      });
    }

    function getTCAppointmentCallRecord(selChassisNo,selDataTypeId) {
      $scope.callRecording = [];
      //var apptId = parseInt(selApptId);
      var lsToken = TokenService.getToken(adminUserScId);
      SalesFeedbackCallRecordingService.query({chassisNo:selChassisNo,logInId:adminUserId,scId:adminUserScId,token:lsToken}, function(data) {
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

    $scope.customerMobileNumbers = [];
    var customerMobileNumbers = [];
  function getAppointmentDetails(apptId,selStatus) {
      $scope.customerMobileNumbers = [];
      showLoader(true);
      console.log('appt id - '+apptId+'status- '+selStatus);
      var lsToken = TokenService.getToken(adminUserScId);
      GetPerticularSalesDataService.query({apptId:apptId,scId:adminUserScId,token:lsToken}, function (data) {
        console.log('data in detailed page',data[0]);
        $scope.tcAppointmentData = data[0];
        $scope.tcAppointmentDataErrorMsg = '';
        customerMobileNumbers = $scope.tcAppointmentData.mobile;
        for(var i=0;i<customerMobileNumbers.length;i++){
          if(customerMobileNumbers[i].customer_mobile === $scope.tcAppointmentData.customer_mobile){
            customerMobileNumbers[i].customer_mobile = customerMobileNumbers[i].customer_mobile+'*';
            $scope.currentMobile = customerMobileNumbers[i].customer_mobile;
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

    $scope.getDetails = function(selApptId,selStatus){
      $scope.editPhoneSuccessMsg = '';
      console.log(selApptId);
      console.log(selStatus);
      if(selStatus === undefined || selStatus === null){
        selStatus = 'status';
      }
      getAppointmentDetails(selApptId,selStatus);
    };

    $scope.editPhoneNumber = function(selMobile,apptObj,defaultNumStatus,selectedMobileStatus){
      console.log('selMobile',selMobile);
      console.log('apptObj',apptObj);
      $scope.editPhoneSuccessMsg = '';
      var editPhoneObj = {
        mobile: selMobile,
        customerName: apptObj.customer_name,
        chassisNo : apptObj.chassisNo,
        scId : adminUserScId,
        defaultNumber:defaultNumStatus,
        customerId : apptObj.customerId,
        customerStatus : selectedMobileStatus,
        dataType :'Sales'
      };
      console.log(JSON.stringify(editPhoneObj));
      var lsToken = TokenService.getToken(adminUserScId);
      UpdateCustomerPhoneService.save({id:adminUserScId,token:lsToken}, editPhoneObj, function (data) {
        console.log(data);
        $scope.editPhoneSuccessMsg = data.message;
       // checkActiveInactiveStatus = false;
        $timeout(function() {
          $('#editPhoneModal').modal('hide');
          $("#activeDeactivePhoneModal").modal('hide');
          getAppointmentDetails(apptObj.apptId,$scope.statusDisplay);
        }, 2000);
        $scope.phoneObj = {};
        $scope.editPhoneForm.$setPristine();
        }, function (err) {
        console.log(err);
        $scope.editPhoneErrorMsg = err.data.message;
      });
    };

     var mobileActiveStatus = false;
 var mobileDeactiveStatus = false;
 var mobilePrimaryStatus = false;
 var selectedMobileStatus;
 $scope.getUpdateMobileStatus = function(selMobile,apptObj,defaultNumStatus,selMobileStatus){
   selectedMobileStatus = selMobileStatus;
   if(selMobileStatus === 'active'){
      $timeout(function() {
      mobileActiveStatus = $window.confirm('Are you sure to Activate this Mobile No.?');
      if(mobileActiveStatus){
        console.log('Updating :',selectedMobileStatus);
        $scope.editPhoneNumber(selectedMobileNumer,apptObj,defaultNumStatus,selectedMobileStatus);
        $scope.phoneObj = {};
      } else{
       console.log('Cancelled the Activation Event');
      }  
        }, 300);
     
   } else if(selMobileStatus === 'inactive'){
      $timeout(function() {
        console.log(selectedMobileNumer);
        console.log($scope.tcAppointmentData.customer_mobile);
        if(selectedMobileNumer === $scope.tcAppointmentData.customer_mobile){
          alert('This is the Primary number.You cannot deactivate the number.');
          mobileDeactiveStatus = false;
       } else if(selectedMobileNumer !== $scope.tcAppointmentData.customer_mobile){
          mobileDeactiveStatus = $window.confirm('Are you sure to Deactivate this Mobile No.?');
       }
       if(mobileDeactiveStatus){
        console.log('Updating :',selectedMobileStatus);
        $scope.editPhoneNumber(selectedMobileNumer,apptObj,defaultNumStatus,selectedMobileStatus);
        $scope.phoneObj = {};
      } else{
        console.log('Cancelled the Deactivation Event');
      } 
       }, 300);     
  }
  else if(selMobileStatus === 'primary'){
      $timeout(function() {
        console.log(selectedMobileNumer);
        console.log($scope.tcAppointmentData.customer_mobile);
        if(selectedMobileNumer === $scope.tcAppointmentData.customer_mobile){
          alert('This is already a Primary Number');
          mobilePrimaryStatus = false;
       } else if(selectedMobileNumer !== $scope.tcAppointmentData.customer_mobile){
          mobilePrimaryStatus = $window.confirm('Are you sure to make this Mobile No. as Primary?');
       }
       if(mobilePrimaryStatus){
        console.log('Updating :',selectedMobileStatus);
        $scope.editPhoneNumber(selectedMobileNumer,apptObj,defaultNumStatus,selectedMobileStatus);
        $scope.phoneObj = {};
      } else{
        console.log('Cancelled the Making Primary Event');
      } 
       }, 300);     
  }
 } 

 $("#activeDeactivePhoneModal").modal('hide');
 var selectedMobileNumer;
 $scope.updateMobileStatus = function(currentMobile){
  $scope.mobileDisplay = currentMobile;
  if(currentMobile.substr(0,10) === $scope.tcAppointmentData.customer_mobile){
    $scope.primaryStatus = true;
  } else if(currentMobile.substr(0,10) !== $scope.tcAppointmentData.customer_mobile){
    $scope.primaryStatus = false;
  }
  $scope.editPhoneSuccessMsg = '';
  $scope.editPhoneErrorMsg = '';
  console.log(currentMobile);
  if(currentMobile !== null){
     selectedMobileNumer = currentMobile.substr(0,10);
     $("#activeDeactivePhoneModal").modal('show');
  }
 }

 $scope.clearActiveInactiveModal = function(){
  $("#activeDeactivePhoneModal").modal('hide');
 }



/*$scope.feedBackDataDefaultSeries =[];
$scope.feedBackDataDefault = [];
$scope.feedBackDataDefaultLables = [];
var feedBackStatsDefault = [];
function getFeedbackYesNoDefaultStats() {
$scope.feedBackDataDefaultChart = [];
$scope.feedBackDataDefaultSeries =[];
$scope.feedBackDataDefault= [];
$scope.feedBackDataDefaultLables = ['Yes','No'];
var feedBackCountDefault1 = [];
var feedBackCountDefault2 = [];
      $scope.loaderIconFeedBack = true;
      $scope.feedBackDefaultYesNoDataErrorMsg = '';
      var lsToken = TokenService.getToken(adminUserScId);
       GetSalesFeedbackYesNoDefaultStatsService.query({fromDate:selectedFromDate,toDate:selectedToDate,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,token:lsToken},function (data) {
       console.log('FeedBack Sales Default Yes No Stats :',data);
       feedBackStatsDefault = data;
       $scope.feedBackStatsDefault = data;
       $scope.feedBackDefaultYesNoDataErrorMsg = '';
             if(feedBackStatsDefault[0] !== undefined && feedBackStatsDefault[0] !== null ){
                    feedBackCountDefault1.push(parseInt(feedBackStatsDefault[0].yes));
                    feedBackCountDefault1.push(parseInt(feedBackStatsDefault[0].no));
 $scope.feedBackDataDefaultChart1 = {
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
      }
    },
            labels: $scope.feedBackDataDefaultLables,
            series: [feedBackStatsDefault[0].feedBackQuestion],
            colors: ['#2FCF92','#FB617F'],
            data: [feedBackCountDefault1]
        };
             }                

            //}

if($scope.feedBackDataDefaultChart1){
  $scope.feedBackDataDefaultChart.push($scope.feedBackDataDefaultChart1);
}
        
        $scope.datasetOverrideFeedBackDefaultChartData = [
             {
                fill: true,
                backgroundColor: $scope.feedBackDataColors1
            },
            {
                fill: true,
                backgroundColor: $scope.feedBackDataColors2
            }
            ];
        $scope.loaderIconFeedBack = false;
      }, function(err) {
        $scope.loaderIconFeedBack = false;
        $scope.feedBackDefaultYesNoDataErrorMsg = err.data.message;
      });
    }
    getFeedbackYesNoDefaultStats();
*/

$scope.feedBackDataDefaultSeries =[];
//$scope.feedBackDataDefault = [];
$scope.feedBackDataDefaultLables = [];
var feedBackStatsDefault = [];
var feedBackDataDefaultData = [['Yes','No']];
function getFeedbackYesNoDefaultStats() {
$scope.feedBackDataDefaultChart = [];
$scope.feedBackDataDefaultSeries =[];
//$scope.feedBackDataDefault= [];
feedBackDataDefaultData = [['Yes','No']];
var feedBackCountDefault1 = [];
var feedBackCountDefault2 = [];
      $scope.loaderIconFeedBack = true;
      $scope.feedBackDefaultYesNoDataErrorMsg = '';
      var lsToken = TokenService.getToken(adminUserScId);
       GetSalesFeedbackYesNoDefaultStatsService.query({fromDate:selectedFromDate,toDate:selectedToDate,scId:adminUserScId,callerId:selectedCaller,branchId:selectedBranch,token:lsToken},function (data) {
       console.log('FeedBack Default Yes No Stats :',data);
       $scope.feedBackStatsDefault = data;
       feedBackStatsDefault = data;
       $scope.feedBackStatsDefault = data;
       $scope.feedBackDefaultYesNoDataErrorMsg = '';
             if(feedBackStatsDefault[0] !== undefined && feedBackStatsDefault[0] !== null ){
               feedBackDataDefaultData.push(['Yes',parseInt(feedBackStatsDefault[0].yes)]);
               feedBackDataDefaultData.push(['No',parseInt(feedBackStatsDefault[0].no)]);
             }  
             $scope.feedBackDataDefaultData = feedBackDataDefaultData; 
             console.log('feedBackDataDefaultData+++++++++++++',feedBackDataDefaultData);             
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChartPsfDefaultStats);
        $scope.loaderIconFeedBack = false;
      }, function(err) {
        feedBackDataDefaultData = [['Yes','No']];
        $scope.loaderIconFeedBack = false;
        $scope.feedBackDefaultYesNoDataErrorMsg = err.data.message;
      });
    }
    getFeedbackYesNoDefaultStats();

 var defaultDetails = false;
 function drawChartPsfDefaultStats() {
        var data = google.visualization.arrayToDataTable(feedBackDataDefaultData);
        var options = {
           pieHole: 0.4,
         sliceVisibilityThreshold: 0,
         legend: {display: true,position: 'right'}
        };
        var chart = new google.visualization.PieChart(document.getElementById('psfDefaultStats'));
        function selectHandler() {
          defaultDetails = true;
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            console.log(topping);
            $scope.getFeedbackYesNoDetail(topping);
          }
        }
        google.visualization.events.addListener(chart, 'select', selectHandler);    
        chart.draw(data, options);
      }


    $(document).ready(function(){
      $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
      });
    });

  });
