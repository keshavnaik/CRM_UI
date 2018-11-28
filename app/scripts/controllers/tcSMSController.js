'use strict';

angular.module('letsService')
  .controller('SMSController', function ($scope,$timeout,$filter,serviceURL,$cookies,GetScSMSStatsService, $window, TokenService, SendSMSService,TeleCallingSMSPackageService,TeleCallingSMSPricingService,GetSMSHistoryService,GetSuperAdminDealerListService) {

 var adminUserId = $cookies.get('loggedInUserId');
 var adminUserScId = $cookies.get('loggedInUserScId');

    function getSCSMSStats() {
      $scope.loading = true;
      var lsToken = TokenService.getToken(adminUserScId);
      GetScSMSStatsService.get({scId:adminUserScId,token:lsToken}, function (data) {
        $scope.scSMSStats = data;
        $scope.loading = false;
       // console.log(data);
      }, function (err) {
        $scope.loading = false;
        console.log(err);
      });
    }

    getSCSMSStats();


    $scope.sendSCSMS = function (smsData) {
      $scope.loading = true;
      var sendSMSData = {
        scId: $cookies.get('loggedInUserScId'),
        logInId: $cookies.get('loggedInUserId'),
        mobileNumber: smsData.mobileNumber,
        message: smsData.message,
        charCount: smsData.message.length
      };
      $scope.scSMS = {};
      $scope.sendSMSForm.$setPristine();
      console.log(JSON.stringify(sendSMSData));
      var id = parseInt(Math.random() * 100);
      var lsToken = TokenService.getToken(id);
      SendSMSService.save({id:id,token:lsToken}, sendSMSData, function (data) {
        console.log(data);
        $scope.loading = false;
        //resetForm(data.message);
        getSCSMSStats();
      }, function (err) {
        console.log(err);
        resetForm(err.data.message);
        $scope.loading = false;
      });
      $timeout(function() {
          $window.alert('SMSs are sending successfully..It will be reflect in SMS History soon.!');
           $scope.loading = false;
        }, 3000);
    };
     
    //$scope.scSMS = {mobileNumber : teleCallerFilteredXlData}; 
    $scope.validateMobileNumber = function (mobileNumber) {
      //console.log("manual",mobileNumber);
      $scope.scSMS = {mobileNumber : mobileNumber};
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

    function resetForm(msg) {
      $window.alert(msg);
      /*$timeout(function() {
           $window.alert(msg);
        }, 1000);*/
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
    function filePicked(oEvent) {
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
               teleCallerXlToJson = $filter('unique')(teleCallerXlToJson,'mobile');
              for(var m1 = 0; m1 < teleCallerXlToJson.length; m1++) {
                teleCallerXlInvalidDateFlag = false ;
                var teleCallerXlRowObj = {};
                teleCallerXlRowObj = teleCallerXlToJson[m1].mobile;
                teleCallerFilteredXlData.push(teleCallerXlRowObj);
              }
              //console.log(JSON.stringify(teleCallerFilteredXlData));
              // console.log("upload",teleCallerFilteredXlData.toString());
              //$scope.loading = false;

              $scope.validateMobileNumber(teleCallerFilteredXlData.toString());
              //$scope.scSMS = {mobileNumber : teleCallerFilteredXlData.toString()};
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

      console.log('mobile numbers : ',JSON.stringify(teleCallerXlToJson));
      for(var l1 = 0; l1 < teleCallerXlToJson.length; l1++){

        /*-- mandatory field value, mobile length,serviceType value, assistanceType value validation--*/
          var obj = teleCallerXlToJson[l1];

     //   if(obj.mobile !== undefined){
          if( teleCallerIsEmptyStr(obj.mobile) ) {
            teleCallerXlErrorRowNum = l1 + 1 ;
            teleCallerXlErrorMsg = ' Some mandatory fields are empty in your sheet at row ' + (teleCallerXlErrorRowNum + 1) + ' .';
            return false;
          } else if( obj.mobile.length!==10 || (!/^\d+$/.test( obj.mobile )) ) {
            teleCallerXlErrorRowNum = l1 + 1 ;
            teleCallerXlErrorMsg = ' Kindly enter a 10 digit valid mobile number at row ' + (teleCallerXlErrorRowNum + 1) + ' .';
            return false;
          }
       // }

      /*  if(obj.mobile === undefined) {
          if (teleCallerIsEmptyStr(obj.undefined)) {
            teleCallerXlErrorRowNum = l1 + 1;
            teleCallerXlErrorMsg = ' Some mandatory fields are empty in your sheet at row ' + (teleCallerXlErrorRowNum + 1) + ' .';
            return false;
          } /!*else if (obj.undefined.length !== 10 || (!/^\d+$/.test(obj.undefined))) {
            teleCallerXlErrorRowNum = l1 + 1;
            teleCallerXlErrorMsg = ' Kindly enter a 10 digit valid mobile number at row ' + (teleCallerXlErrorRowNum + 1) + ' .';
            return false;
          }*!/
        }*/

      }
      return true;
    }

//validate sheet ends

    function teleCallerIsEmptyStr (str) {
      console.log(str);
     // if(str === undefined) {
        if (!str || str === undefined) {
          $window.alert('Empty row/column in the sheet.');
        }
    //  }
      return (str === null || !str.trim() );
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
      console.log(selDealer);
      adminUserScId = selDealer;
      getSCSMSStats();
   };


  });
