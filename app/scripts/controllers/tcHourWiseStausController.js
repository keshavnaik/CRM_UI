

'use strict';

angular.module('letsService')
  .controller('TCHourWiseStatusController', function ($scope,$window,$cookies,TokenService,GetScWiseTeleCallerService,TeleCallerHourWiseDataService,TeleCallerDataTypeStatsService) {

    //var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');

    var adminUserScId = $cookies.get('loggedInUserScId');

    $scope.openCalendar = function(e,dateFilter) {
      e.preventDefault();
      e.stopPropagation();
      if(dateFilter === 'FromDate') {
        $scope.isOpenFrom = true;
      } else if(dateFilter === 'ToDate') {
        $scope.isOpenTo = true;
      }
    };

    var lsToken = TokenService.getToken(adminUserScId);
    var selectedCallerId = 'caller';
    var selectedFromDate = 'today';


    function getScWiseCallerList() {
      var lsToken = TokenService.getToken(adminUserScId);
      GetScWiseTeleCallerService.query({id:adminUserScId,token:lsToken},function (data) {
        console.log('caller list',data);
        $scope.callerList = data;
        $scope.callerList.values =   $scope.callerList;

      }, function (err) {
        $scope.callerListErrorMsg = err.data.message;
      });
    }
    getScWiseCallerList();

    function getDataTypeStats(selectedDate,callerId) {
      if(selectedDate !== 'today'){
        selectedFromDate = selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth() + 1)).slice(-2) + '-' + ('0' + selectedDate.getDate()).slice(-2);
      }
      else if(selectedDate === 'today'){
        selectedFromDate = selectedDate;
      }
      if(callerId !== 'caller'){
        selectedCallerId = callerId.loginId;
      }else if(callerId === 'caller'){
        selectedCallerId = callerId;
      }
      var lsToken = TokenService.getToken(adminUserScId);
      TeleCallerDataTypeStatsService.query({fromDate:selectedFromDate,toDate:selectedFromDate,scId:adminUserScId,callerId:selectedCallerId,token:lsToken},function (data) {
        console.log('data Type Stats',data);
        $scope.dataTypeStats = data;
        $scope.dataTypeStatsErrorMsg = '';
      }, function (err) {
        $scope.dataTypeStatsErrorMsg = err.data.message;
        $scope.dataTypeStats = [];
      });
    }
    getDataTypeStats(selectedFromDate,selectedCallerId);

    $scope.selectedCallerName = '';
    $scope.getCallerNmae = function (callerName) {
      $scope.selectedCallerName = callerName;
      //console.log($scope.selectedCallerName);
    };

    var graphData = [];
  //  var totalCalls = [];
  //  var connectedCalls = [];

    var chart;
    $scope.calStatsSeries = ['  Total Calls ', '  Connected Calls '];
    $scope.calStatsColors = ['#FF0000', '#008000'];
    $scope.callsCountData = [];
    $scope.hourLables = [];
  //  var callsAttempted = [];
  //  var callsConnected = [];

    $scope.getHourWiseTeleCallerData = function (selectedDate,callerId){
      $scope.callsCountData = [];
      $scope.hourLables = [];
      var callsAttempted = [];
      var callsConnected = [];
      getDataTypeStats(selectedDate,callerId);
      if(callerId !== 'caller'){
        selectedCallerId = callerId.loginId;
      }else if(callerId === 'caller'){
        selectedCallerId = callerId;
      }
      $scope.loading = true;
      if(selectedDate !== 'today'){
        selectedFromDate = selectedDate.getFullYear() + '-' + ('0' + (selectedDate.getMonth() + 1)).slice(-2) + '-' + ('0' + selectedDate.getDate()).slice(-2);
      }
      else if(selectedDate === 'today'){
        selectedFromDate = selectedDate;
      }
       var lsToken = TokenService.getToken(adminUserScId);

     // console.log(selectedFromDate);
      //console.log(selectedCallerId);
      //console.log(selectedCallerName);
      //console.log(adminUserScId);
      //console.log(lsToken);

      TeleCallerHourWiseDataService.get({date:selectedFromDate,scId:adminUserScId,callerId:selectedCallerId,token:lsToken},function (data) {
        graphData = data;
         console.log('Hour wise data :',data);
          for (var k = 0; k < graphData.callsAttempted.length; k++) {
            if(graphData.callsAttempted[k] !==null){
             // totalCalls.push({y: parseInt(graphData.callsAttempted[k].callsAttempted), label: graphData.callsAttempted[k].Hour});
              callsAttempted.push(parseInt(graphData.callsAttempted[k].callsAttempted));
              $scope.hourLables.push(graphData.callsAttempted[k].Hour);
            }
          }
          for (var k1 = 0; k1 < graphData.callsConnected.length; k1++) {
            if(graphData.callsConnected[k1] !==null){
           //   connectedCalls.push({y: parseInt(graphData.callsConnected[k1].callsConnected), label:graphData.callsConnected[k1].Hour});
              callsConnected.push(parseInt(graphData.callsConnected[k1].callsConnected));
            }
          }
        $scope.callsCountData.push(callsAttempted);
        $scope.callsCountData.push(callsConnected);
        console.log('calls Count Data',JSON.stringify($scope.callsCountData));
        console.log('hourLables',JSON.stringify($scope.hourLables));
        //console.log('totalCalls',JSON.stringify(totalCalls));
        //console.log('connectedCalls',JSON.stringify(connectedCalls));
        //chart.render();
        /*chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          title:{
            text: ''
          },
          axisY: {
            title: "No. of calls count"
          },
          legend: {
            cursor:"pointer",
            itemclick : toggleDataSeries
          },
          toolTip: {
            shared: true,
            content: ''
          },
          data: [{
            type: "bar",
            showInLegend: true,
            name: "Total Calls",
            color: "red",
            dataPoints: totalCalls
          },
            {
              type: "bar",
              showInLegend: true,
              name: "Connected Calls",
              color: "green",
              dataPoints: connectedCalls
            }]
        });
        chart.render();
         totalCalls = [];
         connectedCalls = [];*/
      //  $scope.selectedCallerName = '';
        $scope.tcHourWiseDataErrorMsg = '';
        $scope.loading = false;
      }, function (err) {
        $scope.tcHourWiseDataErrorMsg = err.data.message;
        console.log(err);
        $scope.loading = false;
      });
    };

    $scope.getHourWiseTeleCallerData(selectedFromDate,selectedCallerId);


     /* function toolTipFormatter(e) {
        var str = "";
        var total = 0 ;
        var str3;
        var str2 ;
        for (var i = 0; i < e.entries.length; i++){
          var str1 = "<span style= \"color:"+e.entries[i].dataSeries.color + "\">" + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong> <br/>" ;
          total = e.entries[i].dataPoint.y + total;
          str = str.concat(str1);
        }
        str2 = "<strong>" + e.entries[0].dataPoint.label + "</strong> <br/>";
        str3 = "<span style = \"color:Tomato\">Total: </span><strong>" + total + "</strong><br/>";
        return (str2.concat(str)).concat(str3);
      }

      function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        }
        else {
          e.dataSeries.visible = true;
        }
        chart.render();
      }*/

  //  };
    $scope.options = {legend: {display: true}};

  });
