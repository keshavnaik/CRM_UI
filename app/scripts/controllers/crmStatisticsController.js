'use strict';

/**
 * @ngdoc function
 * @name testApp.controller:MainCtrl
 * @description
 *  written BY KESHAV NAIK
 * Controller of the testApp
 */
angular.module('letsService')
  .controller('crmStatisticsController', function ($scope,$filter,$cookies,ngTableParams,$rootScope,$window,TokenService,TeleCallerHourWiseDataService,CreDashboardStatsDataService,TeleCallerWeeklyWiseDataService) {

    var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');

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

     var selectedBranch = 'branch';
     var selectedFromDateStats = 'month';
     var selectedToDateStats = 'month'; 
     var selectedDataType = 'callerdashboard';
     var selectedCaller = 'caller';

    function getCreDashboardData() {
      var totalAllocated = 0;
      var totalAttemptedCount = 0;
      var totalConnectedCount = 0;
      var totalCallLaterCount = 0;
      var totalNotInterestedCount = 0;
      var totalServiceDoneCount = 0;
      var totalAppointmentTaken = 0;
      var totalMTDConversion = 0;
      var totalNonConverted = 0;
      var totalPendingCount= 0;
      var totalTotalAttempted= 0;
      showLoader(true);
      var lsToken = TokenService.getToken(adminUserScId);
      CreDashboardStatsDataService.query({scId:adminUserScId,callerId:adminUserId,branchId:selectedBranch,token:lsToken},     function(data) {
        console.log('cre dashboard data :',data);
        $scope.creDashboardData = data;
         angular.forEach($scope.creDashboardData,function(val,index){
          if($scope.creDashboardData[index] !== undefined && $scope.creDashboardData[index] !== null){
             totalAllocated += parseInt($scope.creDashboardData[index].allocated);
             totalAttemptedCount += parseInt($scope.creDashboardData[index].attemptedCount);
             totalConnectedCount += parseInt($scope.creDashboardData[index].connectedCount);
             totalCallLaterCount += parseInt($scope.creDashboardData[index].callLaterCount);
             totalNotInterestedCount += parseInt($scope.creDashboardData[index].notInterested);
             totalServiceDoneCount += parseInt($scope.creDashboardData[index].serviceDone);
             totalAppointmentTaken += parseInt($scope.creDashboardData[index].appointmentTaken);
             totalMTDConversion += parseInt($scope.creDashboardData[index].MTDConversion);
             totalNonConverted += parseInt($scope.creDashboardData[index].nonConverted);
             totalPendingCount += parseInt($scope.creDashboardData[index].pendingCount);
             totalTotalAttempted += parseInt($scope.creDashboardData[index].totalAttempted);
          }  
         });
        if($scope.creDashboardData[0] !== undefined && $scope.creDashboardData[0] !== null){
          $scope.creDashboardData.push( {"dataTypename":"Total","allocated":totalAllocated,"attemptedCount":totalAttemptedCount,"connectedCount":totalConnectedCount,"callLaterCount":totalCallLaterCount,"notInterested":totalNotInterestedCount,"serviceDone":totalServiceDoneCount,"appointmentTaken":totalAppointmentTaken,"MTDConversion":totalMTDConversion,"nonConverted":totalNonConverted,"pendingCount":totalPendingCount,"totalAttempted":totalTotalAttempted});
        }
        // console.log(data);
        showLoader(false);
      }, function(err) {
        showLoader(false);
        $scope.creDashboardDataErrorMsg = err.data.message;
      });
    }
    getCreDashboardData();
       
   
   $scope.statusLables = [{'key':'serviceReminder','name':'Service Reminder'},{'key':'servicefeedback','name':'Service Feedback'},{'key':'insurance','name':'Insurance'},{'key':'salesfeedback','name':'Sales Feedback'}];
   $scope.currentHourStatus = $scope.statusLables[0].name;
   $scope.currentWeeklyStatus = $scope.statusLables[0].name;

   var selectedStatus = 'serviceReminder'; 
   $scope.getStatusWiseHourStats = function(selStatus,label){
    selectedStatus = selStatus;
    if(selectedStatus === 'Service Reminder'){
       selectedStatus = 'serviceReminder';
    } else if(selectedStatus === 'Service Feedback'){
      selectedStatus = 'servicefeedback';
    } else if(selectedStatus === 'Insurance'){
      selectedStatus = 'insurance';
    } else if(selectedStatus === 'Sales Feedback'){
      selectedStatus = 'salesfeedback';
    }
    console.log(selectedStatus);
    if(label === 'daily'){
      $scope.getHourWiseTeleCallerData(selectedFromDate,adminUserId,selectedCaller,selectedBranch);
     } else if(label === 'weekly'){
      $scope.getWeeklyWiseTeleCallerData(selectedFromDate,adminUserId,selectedCaller,selectedBranch);
     }
   }

    var selectedFromDate = 'today';
     

    var graphData = [];
    $scope.attemptedColors = ['#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F','#FB617F','#FB617F', '#FB617F','#FB617F','#FB617F','#FB617F'];
    $scope.connectedColors = ['#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900','#ff9900','#ff9900', '#ff9900','#ff9900','#ff9900','#ff9900'];
    $scope.appointmentsColors = ['#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92','#2FCF92', '#2FCF92','#2FCF92','#2FCF92','#2FCF92'];

    $scope.calStatsSeries = ['Attempted', 'Connected', 'Appointments'];
    $scope.calStatsColors =  ['#FB617F', '#ff9900','#2FCF92'];
    $scope.callsCountData = [];
    $scope.hourLables = [];

    $scope.getHourWiseTeleCallerData = function (selectedDate,callerId){
      $scope.callsCountData = [];
      $scope.hourLables = [];
      var callsAttempted = [];
      var callsConnected = [];
      var appointmentTaken = [];
      var filteredHourLable;
      $scope.totalAppointmentsTakenHourly = 0;
      $scope.totalcallsAttemptedHourly = 0;
      $scope.totalcallsConnectedHourly = 0;
      $scope.loaderIconHourWise = true;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerHourWiseDataService.get({date:selectedFromDate,scId:adminUserScId,callerId:adminUserId,branch:selectedBranch,status:selectedStatus,token:lsToken},function (data) {
        graphData = data;
        $scope.dataErrorMsgHourWise = false;
        console.log('Hour wise data :',data);

        if(graphData.callsAttempted !== undefined && graphData.callsAttempted !== null){
          for (var k = 0; k < graphData.callsAttempted.length; k++) {
            if(graphData.callsAttempted[k] !==null){
              $scope.totalcallsAttemptedHourly += parseInt(graphData.callsAttempted[k].callsAttempted);
              //console.log('Attempted',$scope.totalcallsAttemptedHourly);
              // totalCalls.push({y: parseInt(graphData.callsAttempted[k].callsAttempted), label: graphData.callsAttempted[k].Hour});
              callsAttempted.push(parseInt(graphData.callsAttempted[k].callsAttempted));
              if(parseInt(graphData.callsAttempted[k].Hour) % 12 > 6){
                filteredHourLable = (parseInt(graphData.callsAttempted[k].Hour) % 12) +'AM';
              }
              else if(parseInt(graphData.callsAttempted[k].Hour) % 12 <= 6){
                filteredHourLable = (parseInt(graphData.callsAttempted[k].Hour) % 12) +'PM';
              }
              if((parseInt(graphData.callsAttempted[k].Hour) % 12) === 0){
                filteredHourLable = graphData.callsAttempted[k].Hour +'PM';
              }
              //console.log('++++++++++++++++++++++++=====',parseInt(graphData.callsAttempted[k].Hour)% 12);
              //filteredHourLable = parseInt(graphData.callsAttempted[k].callsAttempted)/12;
              $scope.hourLables.push(filteredHourLable);
            }
          }
        }
        if(graphData.callsConnected !== undefined && graphData.callsConnected !== null){
          for (var k1 = 0; k1 < graphData.callsConnected.length; k1++) {
            if(graphData.callsConnected[k1] !==null){
              $scope.totalcallsConnectedHourly += parseInt(graphData.callsConnected[k1].callsConnected);
              //console.log('Connetced',$scope.totalcallsConnectedHourly);
              //   connectedCalls.push({y: parseInt(graphData.callsConnected[k1].callsConnected), label:graphData.callsConnected[k1].Hour});
              callsConnected.push(parseInt(graphData.callsConnected[k1].callsConnected));
            }
          }
        }
        if(graphData.appointmentTaken !== undefined && graphData.appointmentTaken !== null){
          for (var k2 = 0; k2 < graphData.appointmentTaken.length; k2++) {
            if(graphData.appointmentTaken[k2] !==null){
              $scope.totalAppointmentsTakenHourly += parseInt(graphData.appointmentTaken[k2].appointmentTaken);
              //console.log('Appointments',$scope.totalAppointmentsTakenHourly);
              //   connectedCalls.push({y: parseInt(graphData.callsConnected[k1].callsConnected), label:graphData.callsConnected[k1].Hour});
              appointmentTaken.push(parseInt(graphData.appointmentTaken[k2].appointmentTaken));
            }
          }
        }
        $scope.callsCountData.push(callsAttempted);
        $scope.callsCountData.push(callsConnected);
        $scope.callsCountData.push(appointmentTaken);


$scope.hourWiseChart = {
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
            labels: $scope.hourLables ,
            series: $scope.calStatsSeries,
            colors: ['#FB617F', '#ff9900','#2FCF92'],
            data: $scope.callsCountData 
        };
        
        $scope.datasetOverrideHourWiseData = [
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
            
            ];

        $scope.tcHourWiseDataErrorMsg = '';
        $scope.loaderIconHourWise = false;
      }, function (err) {
        $scope.dataErrorMsgHourWise = true;
        $scope.tcHourWiseDataErrorMsg = err.data.message;
        console.log(err);
        $scope.loaderIconHourWise = false;
      });
    };

    $scope.getHourWiseTeleCallerData(selectedFromDate,adminUserId);

    var graphDataWeekly = [];
    $scope.calStatsSeriesWeekly = ['Attempted', 'Connected', 'Appointments'];
    $scope.calStatsColorsWeekly = ['#FB617F', '#ff9900','#2FCF92'];
    $scope.callsCountDataWeekly = [];
    $scope.weeklyLables = [];

    $scope.getWeeklyWiseTeleCallerData = function (selectedDate,callerId){
      $scope.callsCountDataWeekly = [];
      $scope.weeklyLables = [];
      var callsAttemptedWeekly = [];
      var appointmentTakenWeekly = [];
      var callsConnectedWeekly = [];
      $rootScope.totalAppointmentsTakenWeekly = 0;
      $rootScope.totalcallsAttemptedWeekly = 0;
      $rootScope.totalcallsConnectedWeekly = 0;
      $scope.loaderIconWeeklyWise = true;
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerWeeklyWiseDataService.get({date:selectedFromDate,scId:adminUserScId,callerId:adminUserId,branch:selectedBranch,status:selectedStatus,token:lsToken},function (data) {
        graphDataWeekly = data;
        $scope.dataErrorMsgWeekWise = false;
        console.log('Week wise data :',data);
        if(graphDataWeekly.callsAttempted !== undefined && graphDataWeekly.callsAttempted !== null){
          for (var k = 0; k < graphDataWeekly.callsAttempted.length; k++) {
            if(graphDataWeekly.callsAttempted[k] !==null){
              $rootScope.totalcallsAttemptedWeekly += parseInt(graphDataWeekly.callsAttempted[k].callsAttempted);
              //console.log('Total Calls attempted',$scope.totalcallsAttemptedWeekly);
              callsAttemptedWeekly.push(parseInt(graphDataWeekly.callsAttempted[k].callsAttempted));
              $scope.weeklyLables.push(graphDataWeekly.callsAttempted[k].Hour);
            }
          }
        }
        if(graphDataWeekly.callsConnected !== undefined && graphDataWeekly.callsConnected !== null){
          for (var k1 = 0; k1 < graphDataWeekly.callsConnected.length; k1++) {
            if(graphDataWeekly.callsConnected[k1] !==null){
              $rootScope.totalcallsConnectedWeekly += parseInt(graphDataWeekly.callsConnected[k1].callsConnected);
              //console.log('Total Calls Connected',$scope.totalcallsConnectedWeekly);
              //   connectedCalls.push({y: parseInt(graphData.callsConnected[k1].callsConnected), label:graphData.callsConnected[k1].Hour});
              callsConnectedWeekly.push(parseInt(graphDataWeekly.callsConnected[k1].callsConnected));
            }
          }
        }
        if(graphDataWeekly.appointmentTaken !== undefined && graphDataWeekly.appointmentTaken !== null){
          for (var k2 = 0; k2 < graphDataWeekly.appointmentTaken.length; k2++) {
            if(graphDataWeekly.appointmentTaken[k2] !==null){
              $rootScope.totalAppointmentsTakenWeekly += parseInt(graphDataWeekly.appointmentTaken[k2].appointmentTaken);
              //console.log('Total Appointments',$scope.totalAppointmentsTakenWeekly);
              // console.log('Some Date',graphData.appointmentTaken[k2].appointmentTaken);
              appointmentTakenWeekly.push(parseInt(graphDataWeekly.appointmentTaken[k2].appointmentTaken));
            }
          }
        }
        //$scope.colours = ['#0083ca', '#661a00','#00cc00'];
        /*$scope.datasetOverride = [
          {
            fill: true,
            backgroundColor: [' #ff0000', '#661a00','#00cc00']
          }];*/
        $scope.callsCountDataWeekly.push(callsAttemptedWeekly);
        $scope.callsCountDataWeekly.push(callsConnectedWeekly);
        $scope.callsCountDataWeekly.push(appointmentTakenWeekly);

$scope.weeklyChart = {
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
            labels: $scope.weeklyLables ,
            series: $scope.calStatsSeriesWeekly,
            colors: ['#FB617F', '#ff9900','#2FCF92'],
            data: $scope.callsCountDataWeekly 
        };
        
        $scope.datasetOverrideWeeklyData = [
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
            
            ];

        $scope.tcHourWiseDataErrorMsg = '';
        $scope.loaderIconWeeklyWise = false;
      }, function (err) {
        $scope.dataErrorMsgWeekWise = true;
        $scope.tcHourWiseDataErrorMsg = err.data.message;
        console.log(err);
        $scope.loaderIconWeeklyWise = false;
      });
    };

    $scope.getWeeklyWiseTeleCallerData(selectedFromDate,adminUserId);
    /*$scope.options = {legend: {display: true,position: 'bottom'},scales: {
          yAxes: [{id: 'y-axis-1', ticks: { beginAtZero:true,min: 0}}]
        }};*/

    $(document).ready(function(){
      $('[data-toggle="popover"]').popover({
        placement : 'top',
        trigger : 'hover'
      });
    });


  });
