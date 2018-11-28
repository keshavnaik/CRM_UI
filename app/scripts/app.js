'use strict';

var letsService = angular
  .module('letsService', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTable',
    'ngCookies',
    'ngS3upload',
    'ngIdle',
    'ngTouch', 'ui.bootstrap','ui.bootstrap.datetimepicker','angular-input-stars','google.places','ui.router','chart.js','ngResource','notifications','ui.grid','directive.g+signin','toastr','angularjs-dropdown-multiselect','ui.grid.pagination'
    ]);/*,'toastr','directive.g+signin'*/

//letsService.value('serviceURL','https://letsservicecrm.in/');  /*Production url*/
//letsService.value('serviceURL','https://letsservicecrm.co.in/'); /*Production url*/
//letsService.value('serviceURL','http://192.168.25.129/crm_test_v2.7/index.php'); /*Test url*/
letsService.value('serviceURL','http://crmstagging-env.us-west-2.elasticbeanstalk.com/');/*local*/

letsService.value('pickupAndDropServiceURL','https://letsservicetech.in/');  /*Production url*/
//letsService.value('pickupAndDropServiceURL','http://letsservicetech.co.in/');  /*Test url*/
//letsService.value('pickupAndDropServiceURL','http://letsservicetech.co.in/');/*local*/

letsService.filter('rounded',function(){
    return function(val){
      return Math.ceil(val);
    };
  });


letsService.filter('formatDate', function(dateFilter) {
  var formattedDate = '';
  return function(dt) {
    if(dt) {
      formattedDate = dateFilter(new Date(dt.split('-').join('/')), 'd/MMM/yyyy h:mm:ss a');
      return formattedDate;
    } else {

    }
  };
});

letsService.filter('formatTime', function(dateFilter) {
  var formattedDate = '';
  return function(dt) {
    if(dt) {
      formattedDate = dateFilter(new Date(dt.split('-').join('/')), 'h:mm a');
      return formattedDate;
    } else {
      return 'NA';
    }
  };
});


angular.module('letsService').filter('unique', function () {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];

      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
});


angular.module('directive.g+signin', []).
  directive('googlePlusSignin', ['$window', '$rootScope', function ($window, $rootScope) {
      var ending = /\.apps\.googleusercontent\.com$/;

      return {
          restrict: 'E',
          transclude: true,
          template: '<span></span>',
          replace: true,
          link: function (scope, element, attrs, ctrl, linker) {
              attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');
              attrs.$set('data-clientid', attrs.clientid);
              var defaults = {
                  onsuccess: onSignIn,
                  cookiepolicy: 'single_host_origin',
                  onfailure: onSignInFailure,
                  scope: 'profile email',
                  longtitle: false,
                  theme: 'dark',
                  autorender: true,
                  //access_type : online,
                  customtargetid: 'googlebutton'
              };

              defaults.clientid = attrs.clientid;

              // Overwrite default values if explicitly set
              angular.forEach(Object.getOwnPropertyNames(defaults), function (propName) {
                  if (attrs.hasOwnProperty(propName)) {
                      defaults[propName] = attrs[propName];
                  }
              });
              var isAutoRendering = (defaults.autorender !== undefined && (defaults.autorender === 'true' || defaults.autorender === true));
              if (!isAutoRendering && defaults.customtargetid === "googlebutton") {
                  console.log("element", element);
                  element[0].innerHTML =
                  '<div id="googlebutton">' +
                  ' <div class="google-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 14 14" class="abcRioButtonSvg">' +
                  '   <g><path d="m7.228,7.958l-.661-.514c-.201-.166-.476-.386-.476-.79 0-.405 .275-.663 .513-.901 .769-.606 1.538-1.25 1.538-2.611 0-1.256-.632-1.862-.94-2.24h.899l.899-.902h-3.622c-.989,0-2.235,.147-3.278,1.01-.788,.68-1.172,1.618-1.172,2.464 0,1.433 1.098,2.885 3.04,2.885 .183,0 .384-.018 .586-.036-.092,.22-.183,.405-.183,.717 0,.569 .048,.809 .305,1.14-.824,.055-2.119,.12-3.254,.819-1.082,.644-1.411,1.717-1.411,2.379 0,1.361 1.281,2.629 3.938,2.629 3.149,0 4.816-1.747 4.816-3.474 .001-1.269-.731-1.894-1.537-2.575zm-4.689-5.384c0-.479 .091-.975 .402-1.361 .293-.368 .806-.607 1.283-.607 1.519,0 2.306,2.06 2.306,3.383 0,.33-.037,.918-.457,1.341-.294,.295-.786,.515-1.244,.515-1.575,0-2.29-2.041-2.29-3.271zm2.308,10.66c-1.96,0-3.224-.938-3.224-2.243s1.063-1.691 1.466-1.839c.77-.256 1.788-.348 1.788-.348s.456,.026 .665,.019c1.115,.546 1.997,1.487 1.997,2.428 0,1.138-.935,1.983-2.692,1.983z"></path></g>' +
                  ' </svg></div>' +
                  ' <div class="sign-in-text">Sign in</div>' +
                  '</div>';
              }

              // Default language
              // Supported languages: https://developers.google.com/+/web/api/supported-languages
              attrs.$observe('language', function (value) {
                  $window.___gcfg = {
                      lang: value ? value : 'en'
                  };
              });

              // Some default values, based on prior versions of this directive
              function onSignIn(authResult) {
                  $rootScope.$broadcast('event:google-plus-signin-success', authResult);
              };
              function onSignInFailure() {
                  $rootScope.$broadcast('event:google-plus-signin-failure', null);
              };

              // Asynchronously load the G+ SDK.
              var po = document.createElement('script');
              po.type = 'text/javascript';
              po.async = true;
              po.src = 'https://apis.google.com/js/client:platform.js';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(po, s);

              linker(function (el, tScope) {
                  po.onload = function () {
                      if (el.length) {
                          element.append(el);
                      }
                      //Initialize Auth2 with our clientId
                      gapi.load('auth2', function () {
                          var googleAuthObj =
                          gapi.auth2.init({
                              client_id: defaults.clientid,
                              cookie_policy: defaults.cookiepolicy
                          });

                          if (isAutoRendering) {
                              gapi.signin2.render(element[0], defaults);
                          } else {
                              googleAuthObj.attachClickHandler(defaults.customtargetid, {}, defaults.onsuccess, defaults.onfailure);
                          }
                      });
                  };
              });

          }
      }
  }])
.run();


 letsService.config(function ($routeProvider, $httpProvider, $stateProvider,$urlRouterProvider,ChartJsProvider,KeepaliveProvider, IdleProvider) {
  
 	  $httpProvider.defaults.headers.common = {};
 	  $httpProvider.defaults.headers.get = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.option = {};
    $httpProvider.defaults.headers.patch = {};

        IdleProvider.idle(1800);
        IdleProvider.timeout(5);
        KeepaliveProvider.interval(10);


   ChartJsProvider.setOptions({
     responsive: true,
     maintainAspectRatio: true
   });


      $stateProvider

      .state('/',{
      	url: '/',
      	templateUrl: 'views/crmLogin.html',
        controller:'CrmLoginCtrl'
      })

        .state('dashboard',{
          url: '/dashboard',
          templateUrl: 'views/crmDashboard.html',
          controller:'crmDashboardController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        /*.state('tcAdminDashboard',{
          url: '/tcAdminDashboard',
          templateUrl: 'views/tcAdminDashboard.html',
          controller: 'TCAdminDashboardController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })
*/
        .state('menu',{
          url: '/menu/createCaller',
          templateUrl: 'views/tcCreate.html',
          controller:'TCManageController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('SMS',{
          url: '/menu/sms',
          templateUrl: 'views/crmSms.html',
          controller:'SMSController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('SMSHistory',{
          url: '/menu/smsHistory',
          templateUrl: 'views/crmSmsHistory.html',
          controller:'SMSHistoryController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('status',{
          url: '/menu/status',
          templateUrl: 'views/tcStatus.html',
          controller:'TCStatusController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('teleCallerStatus',{
          url: '/menu/tcStatus',
          templateUrl: 'views/teleCallerStatus.html',
          controller:'TeleCallerStatusController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('teleCallerHourWiseStatus',{
          url: '/menu/tcStatusHourWise',
          templateUrl: 'views/teleCallerHourWiseStatus.html',
          controller:'TCHourWiseStatusController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('uploadHistory',{
          url: '/menu/uploadHistory',
          templateUrl: 'views/crmUploadHistory.html',
          controller:'TCUploadHistoryController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })
        .state('assignHistory',{
          url: '/menu/assignHistory',
          templateUrl: 'views/crmAssignHistory.html',
          controller:'TCAssignHistoryController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('PSF',{
          url: '/menu/psf',
          templateUrl: 'views/crmPsf.html',
          controller:'PSFController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })
        .state('updatePSF',{
          url: '/menu/updatePSF',
          templateUrl: 'views/feedbackUpdate.html',
          controller:'FeedbackUpdateController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })
        .state('salesFeedback',{
          url: '/menu/salesFeedback',
          templateUrl: 'views/salesFeedback.html',
          controller:'SalesFeedbackController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('crmDetailed',{
          url:'/crmDetailed/:apptId/:dataTypeId/:status',
          templateUrl:'views/detailedPage.html',
          controller:'crmDetailedPageController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('lostCustomer',{
          url:'/lostCustomer',
          templateUrl:'views/crmLostCustomerPage.html',
          controller:'crmLostCustomerPageController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('lostCustomerDetailed',{
          url:'/lostCustomerDetailed/:apptId/:dataTypeId/:status',
          templateUrl:'views/lostCustomerDetailedPage.html',
          controller:'LostCustomerDetailedPageController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('psfDetailed',{
          url:'/menu/psfDetailed/:apptId/:dataTypeId/:status',
          templateUrl:'views/crmPsfDetailedPage.html',
          controller:'crmPSFDetailedPageController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('salesFeedbackDetailed',{
          url:'/menu/salesFeedbackDetailed/:apptId/:dataTypeId:/status',
          templateUrl:'views/crmSalesFeedbackDetailedPage.html',
          controller:'crmSalesFeedbackDetailedController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('statistics',{
           url:'/statistics',
           templateUrl:'views/crmStatistics.html',
           controller:'crmStatisticsController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
         })

        .state('Profile',{
          url: '/menu/profile',
          templateUrl: 'views/adminProfile.html',
          controller:'profileController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('insurance',{
          url: '/insurance',
          templateUrl: 'views/crmInsurance.html',
          controller:'CrmInsuranceController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('insuranceStats',{
          url: '/insuranceStats',
          templateUrl: 'views/crmInsuranceStats.html',
          controller:'CrmInsuranceStatsController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('insuranceDetailed',{
          url: '/insuranceDetailed/:apptId/:dataTypeId',
          templateUrl: 'views/crmInsuranceDetailedPage.html',
          controller:'CrmInsuranceDetailedController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('serviceCenterPerformance',{
          url: '/serviceCenterPerformance',
          templateUrl: 'views/crmServiceCenterPerformance.html',
          controller:'ServiceCenterPerformanceController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

         .state('tcAdminDashboard',{
          url: '/tcAdminDashboard',
          templateUrl: 'views/crmAdminCallerDashboard.html',
          controller:'crmAdminCallerDashboardController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        }) 
 
        .state('upload',{
          url: '/upload',
          templateUrl: 'views/crmUpload.html',
          controller:'CrmUploadController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('BuySMS',{
         url: '/menu/buySms',
         templateUrl: 'views/crmBuySms.html',
         controller:'BuySMSController',
         resolve: {
           checkAdminLogin : function($rootScope) {
             $rootScope.checkAdminLogin();
             $rootScope.checkInternetAvailability();
           }
         }
       })

        .state('updateDateOfSale',{
         url: '/menu/updateDateOfSale',
         templateUrl: 'views/crmUpdateDateOfSale.html',
         controller:'CrmUpdateDateOfSaleController',
         resolve: {
           checkAdminLogin : function($rootScope) {
             $rootScope.checkAdminLogin();
             $rootScope.checkInternetAvailability();
           }
         }
       })

       .state('aboutUs',{
        url: '/aboutUs',
        templateUrl: 'views/aboutUs.html',
        // controller:'aboutUsController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })

       .state('support',{
        url: '/support',
        templateUrl: 'views/supportPage.html',
        // controller:'SupportPageController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })

       .state('faqSupport',{
        url: '/support/faqSupport',
        templateUrl: 'views/faqSupportPage.html',
        // controller:'SupportPageController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })

       .state('adminFaqs',{
        url: '/support/faqSupport/adminFaqs',
        templateUrl: 'views/adminFaqQuestions.html',
        // controller:'SupportPageController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })

       .state('callerFaqs',{
        url: '/support/faqSupport/callerFaqs',
        templateUrl: 'views/callerFaqQuestions.html',
        // controller:'SupportPageController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })

       .state('uploadFaqs',{
        url: '/support/faqSupport/uploadFaqs',
        templateUrl: 'views/uploadFaqQuestions.html',
        // controller:'SupportPageController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })

       .state('emailSupport',{
        url: '/support/emailSupport',
        templateUrl: 'views/emailSupport.html',
        controller:'EmailSupportPageController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })

      .state('sales',{
        url: '/sales',
        templateUrl: 'views/crmSalesDashboard.html',
        controller:'CrmSalesDashboardController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })

      .state('salesDetailed',{
        url: '/salesDetailed/:apptId/:dataTypeId',
        templateUrl: 'views/crmSalesDetailedPage.html',
        controller:'CrmSalesDetailedController',
        resolve: {
          checkAdminLogin : function($rootScope) {
            $rootScope.checkAdminLogin();
            $rootScope.checkInternetAvailability();
          }
        }
      })
      
      .state('psfPerformance',{
          url: '/psfPerformance',
          templateUrl: 'views/crmPsfPerformance.html',
          controller:'PSFPerformanceController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })

      .state('salesFeedbackPerformance',{
          url: '/salesFeedbackPerformance',
          templateUrl: 'views/crmSalesFeedbackPerformance.html',
          controller:'SalesFeedbackPerformanceController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })
          
        .state('insurancePerformance',{
          url: '/insurancePerformance',
          templateUrl: 'views/crmInsurancePerformance.html',
          controller:'crmInsurancePerformanceController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })  

        .state('dealerPerformance',{
          url: '/dealerPerformance',
          templateUrl: 'views/crmDealerPerformance.html',
          controller:'CrmDealerPerformanceController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })  

        .state('manageSMS',{
          url: '/manageSMS',
          templateUrl: 'views/crmManageSMS.html',
          controller:'ManageSMSController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.checkAdminLogin();
              $rootScope.checkInternetAvailability();
            }
          }
        })  

        .state('onboard',{
          url: '/onboard',
          templateUrl: 'views/crmAdminCreation.html',
          controller:'CrmAdminCreationController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              $rootScope.letsServiceLogout('abc');
              $rootScope.checkInternetAvailability();
            }
          }
        }) 

        .state('overallReport',{
          url: '/overallReport',
          templateUrl: 'views/crmOverallReport.html',
          controller:'CrmOverallReportController',
          resolve: {
            checkAdminLogin : function($rootScope) {
             $rootScope.checkAdminLogin();
             $rootScope.checkInternetAvailability();
            }
          }
        })

        .state('supportView',{
          url: '/supportView',
          templateUrl: 'views/crmSupportTool.html',
          controller:'CrmSupportToolController',
          resolve: {
            checkAdminLogin : function($rootScope) {
              //$rootScope.letsServiceLogout('abc');
              $rootScope.checkInternetAvailability();
            }
          }
        })      

        .state('adminTickets',{
         url: '/adminTickets',
         templateUrl: 'views/adminTicketView.html',
         controller:'AdminTicketViewController',
         resolve: {
           checkAdminLogin : function($rootScope) {
             //$rootScope.letsServiceLogout('abc');
             $rootScope.checkInternetAvailability();
           }
         }
       })
         .state('supportStats',{
         url: '/supportStats',
         templateUrl: 'views/supportStats.html',
         controller:'CrmSupportStatsController',
         resolve: {
           checkAdminLogin : function($rootScope) {
             //$rootScope.letsServiceLogout('abc');
             $rootScope.checkInternetAvailability();
           }
         }
       })
         .state('supportTool',{
          url: '/supportTool',
          templateUrl: 'views/crmSupportLogin.html',
          controller:'CrmSupportLoginCtrl',
           resolve: {
           checkAdminLogin : function($rootScope) {
             $rootScope.letsServiceLogout('abc');
             $rootScope.checkInternetAvailability();
           }
         }
        })
         .state('devConsole',{
          url: '/devConsole',
          templateUrl: 'views/crmDeveloperConsole.html',
          controller:'CrmDeveloperConsoleCtrl',
           resolve: {
             checkAdminLogin : function($rootScope) {
             $rootScope.letsServiceLogout('abc');
             $rootScope.checkInternetAvailability();
           }
         }
        })
      ;

   //$urlRouterProvider.otherwise('/');

  });

letsService.run(function($http,$rootScope,$cookies,$state,$window,CrmValidationService,$location,TeleCallingSearchService,TokenService,NotificationCountService,GetPresentHourService,toastr) {

  if(screen.width <= 480 ) {
        $window.alert('This portal cannot be accessable in mobile.');
    }
 
  $rootScope.letsServiceInitialization = function() {
    $rootScope.signedInUser = $cookies.get('loggedInUserName');
    $rootScope.signedInUserRole = $cookies.get('loggedInUserRole');
    $rootScope.signedInBrand = $cookies.get('loggedInUserBikeBrand');
    $rootScope.signedInScId = $cookies.get('loggedInUserScId');
    //$rootScope.signedInScToken = $cookies.get('loggedInScToken');
    if($rootScope.signedInUser){
      //$http.defaults.headers.common['Accept'] = 'mytoken';
      getPresentHour();
      getNotificationCount();
    }
    //$http.defaults.headers.common['Accept'] = 'mytoken';
  };

   $rootScope.letsServiceSupportInitialization = function() {
   console.log($window.sessionStorage.getItem('loggedInUser'));
   $rootScope.signedInSupportUser = $window.sessionStorage.getItem('loggedInUser');
   $rootScope.signedInSupportRole = $window.sessionStorage.getItem('loggedInSupportRole');
  };

  $rootScope.letsServiceSupportInitialization();

  $rootScope.letsServiceSupportLogout = function(createStatus) {
    $window.sessionStorage.clear();
    $window.localStorage.clear();
    $rootScope.signedInSupportUser = null;
    $rootScope.signedInSupportRole = null;
    //$rootScope.letsServiceSupportInitialization();
    $window.location.href = '#/';
  };


  /*if($cookies.get('loggedInUserName')){
    if ($cookies.get('loggedInUserRole') === 'caller') {
      if(($location.path() !== '/') && ($location.path() !== '/dashboard')){

      } else{
        $location.path('/dashboard');
      }
    } else {
      $location.path('/tcAdminDashboard');
    }
  } else {
    $location.path('/');
  }*/

  /*if ($window.sessionStorage.getItem('loggedInUser')) { 
      if( ($location.path() === '/supportTool') || ($location.path() === '/supportView') || ($location.path() === '/supportStats')) {
       $rootScope.letsServiceSupportLogout();
       $location.path('/supportTool');
     }
   } 
*/
  if($cookies.get('loggedInUserName')){
   if ($cookies.get('loggedInUserRole') === 'caller') {
     if(($location.path() !== '/') && ($location.path() !== '/dashboard')){

     } else if($location.path() === '/') {
       $location.path('/dashboard');
     }
   } else if(($location.path() !== '/') && ($location.path() !== '/tcAdminDashboard')){

   }
     else {
       $location.path('/tcAdminDashboard');
     }
 }
 else {
  //$location.path('/');
  if($location.path() === '/onboard'){
     $location.path('/onboard');
  } else if($location.path() === '/supportTool') {
    $location.path('/supportTool');
  } else if($location.path() === '/supportView') {
    $location.path('/supportView');
  } else if($location.path() === '/supportStats') {
    $location.path('/supportStats');
  } else if($location.path() === '/devConsole') {
    $location.path('/devConsole');
  } else if($location.path() === '/adminTickets') {
    $location.path('/adminTickets');
  }
  else {
    $location.path('/');
  }
   
 }


  $rootScope.letsServiceInitialization();

  $rootScope.letsServiceLogout = function(createStatus) {
    //$cookies.remove('username');
    $window.sessionStorage.clear();
    $window.localStorage.clear();
    //$rootScope.letsServiceSupportInitialization();

    $cookies.remove('loggedInUserId');
    $cookies.remove('loggedInUserScId');
    $cookies.remove('loggedInUserRole');
    $cookies.remove('loggedInUserName');
    $cookies.remove('loggedInUserToken');
    $cookies.remove('loggedInUserSessionToken');
    $cookies.remove('loggedInUserBikeBrand');
    $cookies.remove('loggedInVersionCode');
    $cookies.remove('csvFileUploadStatus');
    $cookies.remove('NotificationCount');
    $cookies.remove('insuranceAccess');
    //$cookies.remove('randomId');
    $rootScope.overdueFilterCounts = '';

      $cookies.remove('loggedInUserIdAdmin');
      $cookies.remove('loggedInUserScIdAdmin');
      $cookies.remove('loggedInUserRoleAdmin');
      $cookies.remove('loggedInUserNameAdmin');
      $cookies.remove('loggedInUserTokenAdmin');
      $cookies.remove('loggedInUserSessionTokenAdmin');
      $cookies.remove('loggedInUserBikeBrandAdmin');
      $cookies.remove('loggedInVersionCodeAdmin');
      $cookies.remove('csvFileUploadStatusAdmin');
      $cookies.remove('insuranceAccessAdmin');
      //$cookies.remove('loggedInScToken');
      $cookies.remove('loggedInZone');
      $cookies.remove('loginIpAddress');

    $rootScope.letsServiceInitialization();
    if(createStatus){
      //console.log(createStatus);
      $rootScope.signedInUser = false;
      $state.go('onboard');
    } else {
      $window.location.href = '#/';
      getIPAddess();
    }
  };


  $rootScope.checkAdminLogin = function() {
    var loggedInUserId = $cookies.get('loggedInUserId');
    var loggedInUserRole = $cookies.get('loggedInUserRole');
    var loggedInUserToken = $cookies.get('loggedInUserToken');
    var loggedInUserSessionToken = $cookies.get('loggedInUserSessionToken');
    var loginIpAddress = $cookies.get('loginIpAddress');
    if(loginIpAddress === undefined || loginIpAddress === null){
       loginIpAddress = 'NA';
    }
    CrmValidationService.get({callerId:loggedInUserId,token:loggedInUserToken,role:loggedInUserRole,sessionToken:loggedInUserSessionToken,loginIp:loginIpAddress},function(data) {
    // console.log('Authentication Response: ',data);
       getIPAddess();
       console.log('Dynamic IP ::',$cookies.get('loginIpAddress'));
      }, function(err) {
    //  console.log(err);
      $rootScope.invalidUserLogoutMsg = err.data.message;
      $("#loggedOutMsgModal").modal('show');
      //alert($rootScope.invalidUserLogoutMsg);
      $rootScope.letsServiceLogout();
    });
  };

  $rootScope.checkInternetAvailability = function() {
    var internetStatus = navigator.onLine;
    if(internetStatus) {

    } else {
      $window.alert('Congrats, Now you have a Life as It Seems Your System is not connected to the Internet. Connect to the Internet and get going');
      $rootScope.letsServiceLogout();
    }
  };

  var currentState;
  $rootScope.$on('$stateChangeSuccess',
  function(event, toState, toParams, fromState, fromParams) {
    $state.current = toState;
    console.log('CURRUNT STATE : :',toState.name);
    currentState = toState.name;
   }
  )
  
  var searchedDataType = 'general';
  $rootScope.dataTypeForBranch = searchedDataType;
  $rootScope.tcAppointmentSearch = function (keyword) {
      $rootScope.defaultStatus = 'status';
      $rootScope.defaultDataTypename = '';
      $rootScope.defaultDataTypeId = '';
      $rootScope.defaultSubStatus = '';
      $rootScope.selDataTypeValue = '';
      if(currentState === 'dashboard'){
        searchedDataType = 'sr';
        $rootScope.dataTypeForBranch = searchedDataType;
      } else if(currentState === 'lostCustomer' || currentState === 'lostCustomerDetailed'){
        searchedDataType = 'others';
        $rootScope.dataTypeForBranch = searchedDataType;
      } else if(currentState === 'insurance' || currentState === 'insuranceDetailed' || currentState === 'insurancePerformance'){
        searchedDataType = 'Insurance';
        $rootScope.dataTypeForBranch = searchedDataType;
      } else if(currentState === 'PSF' || currentState === 'psfDetailed' || currentState === 'psfPerformance'){
        searchedDataType = 'Psf';
        $rootScope.dataTypeForBranch = searchedDataType;
      } else if(currentState === 'sales' || currentState === 'salesDetailed' || currentState === 'salesFeedbackPerformance'){
        searchedDataType = 'Sales';
        $rootScope.dataTypeForBranch = searchedDataType;
      }
    console.log('DATA TYPE SEARCHING FOR : :',searchedDataType);
    var loggedInUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    // console.log(keyword);
    if($rootScope.signedInUserRole === 'caller'){
        if(searchedDataType === 'Insurance'){
           $state.go('insurance');
        } else if(searchedDataType === 'Sales'){
           $state.go('sales');
        } else if(searchedDataType === 'Psf'){
           $state.go('PSF');
        } 
        else{
           $state.go('dashboard');
        }
        //$state.go('dashboard');
    }
     else if($rootScope.signedInUserRole === 'admin'){
       loggedInUserId = 'caller';
       if(searchedDataType === 'Insurance'){
           $state.go('insurancePerformance');
        } else if(searchedDataType === 'Sales'){
           $state.go('salesFeedbackPerformance');
        } else if(searchedDataType === 'Psf'){
           $state.go('psfPerformance');
        }
         else{
            $state.go('tcAdminDashboard');
        }
    }
     else if($rootScope.signedInUserRole === 'superAdmin'){
       loggedInUserId = 'caller';
       adminUserScId = $rootScope.scIdSuperAdmin;
       $state.go('tcAdminDashboard');
    }
    
    var lsToken = TokenService.getToken(adminUserScId);
    TeleCallingSearchService.query({key:keyword,scId:adminUserScId,callerId:loggedInUserId,dataTypeId:searchedDataType,token:lsToken}, function (data) {
      console.log('cre Search Table Data global :',data);
      $rootScope.creTableDataErrorMsg = '';
        $rootScope.creTableData = data;
        $rootScope.globalSerarchStatus = true;
        $rootScope.showTable =true;
        $rootScope.tableParams.reload();
        if($rootScope.signedInUserRole === 'admin' || $rootScope.signedInUserRole === 'superAdmin'){
          $rootScope.exportType = false;
           $("#adminDataTableModal").modal('show');
          }
          searchedDataType = 'general';
    }, function(err) {
      if($rootScope.signedInUserRole === 'admin' || $rootScope.signedInUserRole === 'superAdmin'){
           $("#adminDataTableModal").modal('show');
          }
      $rootScope.creTableData = [];
      $rootScope.showTable = true;
      $rootScope.tableParams.reload();
      $rootScope.creTableDataErrorMsg = err.data.message;
      console.log(err);
    });
  };

  function getPresentHour() {
    GetPresentHourService.get(function (data) {
      $rootScope.currentDate = data.date;
      console.log('Todays Date',$rootScope.currentDate);
      var formatedCurrentDate = new Date($rootScope.currentDate);
      $rootScope.newDate = formatedCurrentDate.setDate(formatedCurrentDate.getDate()+2);
    }, function (err) {

    });
  }

  function getNotificationCount(){
    var loggedInUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var lsToken = TokenService.getToken(adminUserScId);
    NotificationCountService.get({scId:adminUserScId,callerId:loggedInUserId,token:lsToken}, function(data) {
      console.log('CRE over due total counts :',data);
      $cookies.put('NotificationCount', data.apptCount);
      // $rootScope.overdueFilterCounts = data.apptCount;
      $rootScope.overdueFilterCounts = $cookies.get('NotificationCount');
      // $cookies.put('NotificationCount', data.apptCount);
      // console.log(' $rootScope.overdueFilterCounts', $rootScope.overdueFilterCounts);
    }, function(err) {
       $rootScope.overdueFilterCounts = '0';
    });
  }

  /* To disable the console logs start*/
  /*(function () {
    var method;
    var noop = function noop() { };
    var methods = [
      'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
      'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
      'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
      'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
      method = methods[length];
      console[method] = noop;
    }
  }());*/
/* To disable the console logs  end*/

 /*GET CLIENT PUBLIC IP ADDRESS START*/
    function getIPAddess(){
      $http.get('https://api.ipify.org/?format&callback')
                .then(function (response) {
                  console.log('Logged In PUBLIC IP ADDRESS : : :',response.data);
                  $rootScope.loginIpAddress = $cookies.put('loginIpAddress', response.data);
                  if(!$rootScope.signedInUser && !$rootScope.signedInSupportRole){
                     document.getElementById("ip").innerHTML = $cookies.get('loginIpAddress');
                  }
            });
    }
    getIPAddess();
/* GET CLIENT PUBLIC IP ADDRESS END*/

 /*Adding Firbase Sript Start*/
/* var config = {
   apiKey: "AIzaSyBhLbgUVsKeZJnN7yw06hI86VQaSAtRKfM",
   authDomain: "testproject-a139e.firebaseapp.com",
   databaseURL: "https://testproject-a139e.firebaseio.com",
   projectId: "testproject-a139e",
   storageBucket: "testproject-a139e.appspot.com",
   messagingSenderId: "583942697180"
 };
 firebase.initializeApp(config);

   const messaging = firebase.messaging();
   messaging.requestPermission()
           .then(function(){
               console.log("PERMISION GRANTED");
               console.log(messaging.getToken());
               return messaging.getToken();
           })
           .then(function(token){
               console.log('TOKEN::',token);
               $cookies.put('loginFcmToken', token);
           })
           .catch(function(err){
               console.log('Error Occurred.' + err)
           });

   messaging.onMessage(function(payload) {
     console.log("Message received. ", payload);
      var notificationTitle = payload.notification.title;
      var bodyDisplay = payload.notification.body;
      var notificationOptions = {
          body: bodyDisplay,
          icon: 'https://s3-us-west-2.amazonaws.com/bikedetailimages/logo_footer.png',
          image: 'https://s3-us-west-2.amazonaws.com/bikedetailimages/logo_footer.png'
      }
      var notification = new Notification(notificationTitle,notificationOptions);
   });*/

    /*Adding Firbase Sript End*/
    
});
