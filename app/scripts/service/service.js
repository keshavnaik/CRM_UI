'use strict';

angular.module('letsService')

.factory('AdminLoginService', ['serviceURL', '$resource',
  function(serviceURL, $resource){
    return $resource(serviceURL+'lscrmsaas/crm_login/:id/:token');
 }]);


angular.module('letsService')
  .factory('TeleCallerStatusService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_appt_status_list/:id/:token');
    }]);


angular.module('letsService')
  .factory('TeleCallerDataTypeService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_dataType_list/:id/:token');
    }]);


angular.module('letsService')
  .factory('TeleCallerDateWiseDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_appointment_details/:fromDate/:toDate/:dealerId/:role/:subStatus/:dataTypeId/:loginId/:id/:token');
    }]);


angular.module('letsService')
  .factory('TeleCallerStatusWiseDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_callerwise_and_status_wise_month_details/:status/:dateRange/:scId/:callerId/:token');
    }]);

angular.module('letsService')
  .factory('TeleCallerStatsDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_appt_target_count/:loginId/:id/:token');
    }]);


angular.module('letsService')
  .factory('TeleCallerPerticularAppointmentDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_particular_appt_details/:apptId/:scId/:status/:callerId/:token');
    }]);

//apptId/:id/:callerId/:token

angular.module('letsService')
  .factory('TeleCallerPerticularAppointmentHistoryDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_particular_appt_history_details/:chassisNo/:id/:dataTypeId/:bikeBrand/:token');
    }]);


angular.module('letsService')

  .factory('ServiceTypeService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_service_history_details/:chassisNo/:id/:bikeBrand/:token');
    }]);


angular.module('letsService')

  .factory('AssistanceTypeService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'getAssistanceTypeDetail');
    }]);

angular.module('letsService')

  .factory('TeleCallerReasonService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_status_wise_substatus_list/:status/:id/:token');
    }]);



angular.module('letsService')

  .factory('ScComplaintSubStatusService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sccomplaint_status_list/:id/:token');
    }]);


angular.module('letsService')

  .factory('TCAppointmentStatusUpdateService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_crm_appointment_status/:id/:token');
    }]);


angular.module('letsService')

  .factory('TeleCallingSearchService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'search_appt_details_by_keyword/:key/:scId/:callerId/:dataTypeId/:token');
    }]);


angular.module('letsService')

  .factory('TcAdminDashboardService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_status_stats/:fromDate/:toDate/:tcId/:id/:branchId/:callerId/:datatypeId/:token');
    }]);

angular.module('letsService')

  .factory('GetFeedbackTitleService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_customer_feedback_list/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerWiseServiceCenterService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sc_branch_list/:id/:token');
    }]);

angular.module('letsService')

  .factory('GetCallerWiseServiceCenterService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_wise_sc_brach_list/:callerId/:id/:token');
    }]);

angular.module('letsService')

  .factory('GetScWiseTeleCallerService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sc_wise_caller_list/:id/:token');
    }]);


angular.module('letsService')

  .factory('TcAdminDashboardDetailService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_status_details/:fromDate/:toDate/:status/:subStatus/:tcId/:id/:branchId/:callerId/:datatypeId/:export/:feedBackListId/:token');
    }]);

angular.module('letsService')

  .factory('FeedBackDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_customer_feed_back_details/:id/:token');
    }]);


angular.module('letsService')

  .factory('TeleCallingCallService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_caller_temp_call_logs/:id/:token');
    }]);

angular.module('letsService')

  .factory('CreateTeleCallerService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/create_new_caller/:id/:token');
    }]);

angular.module('letsService')

  .factory('GetScSMSStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sms_stats/:scId/:token');
    }]);


angular.module('letsService')

  .factory('SendSMSService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/send_bulk_sms/:id/:token');
    }]);


angular.module('letsService')

  .factory('TeleCallerExcelUploadService', ['serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/upload_sc_data/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerExcelUploadJobcardDataService', ['serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/update_sc_jobcard_data/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerExcelUploadServiceReminderDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/upload_service_remainder_data/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerCSVUploadServiceReminderDataService', [ 'serviceURL','$resource','$cookies',
    function(serviceURL, $resource,$cookies){
      return $resource(serviceURL+'file_upload/'+$cookies.get('loggedInUserBikeBrand')+'/upload_service_reminder_data_v1/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerCSVUploadJobCardDataService', [ 'serviceURL','$resource','$cookies',
    function(serviceURL, $resource,$cookies){
      return $resource(serviceURL+'file_upload/'+$cookies.get('loggedInUserBikeBrand')+'/upload_job_card_data_v1/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerCSVUploadRegularDataService', [ 'serviceURL','$resource','$cookies',
    function(serviceURL, $resource,$cookies){
      return $resource(serviceURL+'file_upload/'+$cookies.get('loggedInUserBikeBrand')+'/upload_sc_data_v1/:id/:token');
    }]);


angular.module('letsService')

  .factory('TeleCallerExcelUploadSalesFeedbackDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/upload_sales_feedback_data/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerExcelUploadAMCDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/upload_amc_sc_data/:id/:token');
    }]);

  angular.module('letsService')

  .factory('TeleCallerExcelUploadAMCDataUtilityService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/upload_amc_data/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerExcelUploadExtendedWarrantyDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/upload_extended_warranty_data_suzuki/:id/:token');
    }]);
  
angular.module('letsService')

  .factory('TeleCallerPickAndDropUpdateService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'utility/create_crm_saas_pick_and_drop_appointment/:id/:token');
    }]);

/*calculating assistance amount start*/
angular.module('letsService')

  .factory('PickupAndDropAssistanceAmountService', [ 'pickupAndDropServiceURL','$resource',
    function(pickupAndDropServiceURL, $resource){
      return $resource(pickupAndDropServiceURL+'get_service_center_wise_pricing_list/:scId/:token');
    }]);

angular.module('letsService')

  .factory('GetSCLocationBrandService', [ 'pickupAndDropServiceURL','$resource',
    function(pickupAndDropServiceURL, $resource){
      return $resource(pickupAndDropServiceURL+'get_service_center_latlng/:scId/:token');
    }]);

angular.module('letsService')

  .factory('CheckAMCUserService', [ 'pickupAndDropServiceURL','$resource',
    function(pickupAndDropServiceURL, $resource){
      return $resource(pickupAndDropServiceURL+'check_amc_user/:bikeNo/:dateTime/:scId/:token');
    }]);


angular.module('letsService')

  .factory('PickupAndDropSlotService', [ 'pickupAndDropServiceURL','$resource',
    function(pickupAndDropServiceURL, $resource){
      return $resource(pickupAndDropServiceURL+'get_appt_time_slots/:date/:assistance_type/:scId/:cityId/:zoneCode/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerFeedbackRatingService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_customer_psf_rating_sub_status_stats/:fromDate/:toDate/:tcId/:id/:branchId/:callerId/:datatypeId/:token');
    }]);

angular.module('letsService')

  .factory('AddFeedbackQuestionService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_feedback_list/:scId/:token');
    }]);

angular.module('letsService')

  .factory('UpdateFeedbackQuestionService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/update_customer_feed_back_list/:scId/:token');
    }]);


angular.module('letsService')

  .factory('TeleCallerSalesFeedbackDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_wise_sales_feedback_details/:fromDate/:status/:branchId/:scId/:token');
    }]);

angular.module('letsService')

  .factory('UpdateCustomerPhoneService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_customer_mobile_number/:id/:token');
    }]);

angular.module('letsService')
  .factory('AdminProfileInformation', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_profile_details/:scId/:token');
    }]);

angular.module('letsService')
  .factory('AppointmentDueTypeStats', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_free_and_paid_appointment_stats/:fromDate/:toDate/:status/:adminId/:scId/:branchId/:callerId/:dataTypeId/:token');
    }]);

angular.module('letsService')
  .factory('ConversionDueTypeStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_free_and_paid_conversion_stats/:fromDate/:toDate/:status/:adminId/:scId/:branchId/:callerId/:dataTypeId/:token');
    }]);

angular.module('letsService')

  .factory('TCInsuranceStatusUpdateService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_crm_insurance_appointment_status/:id/:token');
    }]);

angular.module('letsService')

  .factory('NotificationCountService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_future_overdue_count/:scId/:callerId/:token');
    }]);

angular.module('letsService')

  .factory('GetInsuranceHistoryService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_insurance_appt_history_details/:chassisno/:dealerId/:token');
    }]);

  angular.module('letsService')

  .factory('GetAdminCallerDashboardConversionStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_status_substatus_stats/:fromDate/:toDate/:status/:callerId/:scId/:branch/:dataType/:token');
    }]);

angular.module('letsService')

  .factory('GetAdminCallerConversionService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_status_wise_conversion_stats/:fromDate/:toDate/:callerId/:scId/:branch/:dataType/:token');
    }]);

angular.module('letsService')

  .factory('GetCallerWiseRevenueStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_revenue_stats/:id/:type/:scId/:brandName/:reportType/:branch/:dataType/:token');
    }]);

angular.module('letsService')

  .factory('GetServiceCenterComplaintsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sc_complaint_stats/:fromDate/:toDate/:callerId/:scId/:branch/:dataType/:token');
    }]);

angular.module('letsService')

  .factory('GetServiceCenterJobcardStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_customer_visted_stats/:branchId/:scId/:brandName/:reportType/:token');
    }]);

angular.module('letsService')

  .factory('GetCallerWiseConversionStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_wise_last_four_month_appt_stats/:callerId/:scId/:branch/:dataType/:token');
    }]);


angular.module('letsService')

  .factory('GetYearWiseCustomerStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_year_wise_unique_customer_stats/:branchId/:scId/:brandName/:token');
    }]);

  angular.module('letsService')

  .factory('GetOnTimeDeliveryStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_ontime_delivery_stats/:branchId/:scId/:brandName/:token');
    }]);

angular.module('letsService')

 .factory('ResetCallerCredentialsService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'crm_saas_admin/reset_caller_credentials/:scId/:token');
   }]);

angular.module('letsService')

 .factory('NotifyLicenseService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'notify_licence_renewal/:scId/:status/:token');
   }]);

angular.module('letsService')

 .factory('CrmDateOfSaleListService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_new_customer_details/:scId/:branchId/:exportType/:bikeBrand/:token');
   }]);

 angular.module('letsService')

 .factory('UpdateDateOfSaleService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'crm_saas_admin/update_bike_dateofsale/:scId/:token');
   }]);

 
 angular.module('letsService')

 .factory('AdminCustomerDetailsService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_caller_wise_last_four_month_appt_details/:scId/:callerId/:branchId/:month/:status/:reportType/:dataType/:token');
   }]);

angular.module('letsService')

 .factory('AdminCustomerDetailsStatusWiseService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_status_substatus_details/:fromDate/:toDate/:status/:subStatus/:callerId/:branchId/:scId/:reportType/:dataType/:token');
   }]);

 angular.module('letsService')

 .factory('AdminCustomerDetailsScComplaintWiseService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_sc_complaint_details/:fromDate/:toDate/:status/:subStatus/:callerId/:branchId/:scId/:reportType/:dataType/:token');
   }]);

  angular.module('letsService')

 .factory('AdminCustomerDetailsStatsWiseService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_caller_dashboard_details/:scId/:callerId/:dataTypeId/:status/:scheduleType/:subStatus/:branchId/:reportType/:token');
   }]);

  angular.module('letsService')

 .factory('AdminCustomerCompletePotentialDetailsService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_admin_pontential_allocated_details/:fromDate/:toDate/:scId/:callerId/:dataTypeId/:status/:scheduleType/:branchId/:reportType/:token');
   }]);

 angular.module('letsService')

 .factory('AdminCustomerPotentialDetailsService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_admin_pontential_servicedue_details/:fromDate/:toDate/:scId/:callerId/:dataTypeId/:status/:scheduleType/:branchId/:reportType/:token');
   }]);
 
 angular.module('letsService')

 .factory('GetSuperAdminDealerListService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_superadmin_wise_dealer_list/:logInId/:token');
   }]);

 angular.module('letsService')

 .factory('SupportQuestionEmailService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'crm_saas_admin/send_support_query/:id/:token');
   }]);

angular.module('letsService')

 .factory('GetDueTypeStatsService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_status_and_service_type_wise_stats/:fromDate/:toDate/:scId/:callerId/:branchId/:token');
   }]);

 angular.module('letsService')

 .factory('GetCustomerVisitedCountService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_customer_repetitive_visted_stats/:scId/:token');
   }]);

angular.module('letsService')

 .factory('GetOutsideCustomerVisitService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_outside_customer_stats/:scId/:token');
   }]);

angular.module('letsService')

 .factory('GetServiceAdvisorStatsService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_service_advisor_stats/:scId/:branchId/:token');
   }]);

angular.module('letsService')

  .factory('SalesFeedBackDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_customer_sales_feed_back_details/:id/:token');
    }]);

  angular.module('letsService')

  .factory('GetBranchWiseTeleCallerService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_branch_wise_caller_list/:branchId/:id/:token');
    }]);

angular.module('letsService')

  .factory('GetFeedbackYesNoStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_service_feedback_yesno_stats/:fromDate/:toDate/:scId/:caller/:branch/:token');
    }]);
  
angular.module('letsService')

  .factory('GetFeedbackRatingStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_service_feedback_rating_stats/:fromDate/:toDate/:scId/:caller/:branch/:token');
    }]);
  
  angular.module('letsService')

  .factory('GetFeedbackDetailsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_service_feedback_details/:fromDate/:toDate/:scId/:callerId/:branchId/:feedBackListId/:feedBackStatus/:status/:exportType/:token');
    }]);


 angular.module('letsService')

  .factory('GetMonthWisePotentialCustomerService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_month_wise_potential_customer_stats/:scId/:fromDate/:toDate/:branchId/:exportType/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerLSHistoryDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_appt_scheduled_history/:chassisNo/:scId/:token');
    }]);
  
  angular.module('letsService')

  .factory('InsuranceCallRecordingService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_appt_wise_insurance_recording_list/:chassisNo/:logInId/:scId/:dataTypeId/:token');
    }]);

   angular.module('letsService')

  .factory('PostTicketDetailsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/create_ticket/:scId/:token');
    }]);
  
   angular.module('letsService')

  .factory('SalesFeedbackPerformanceStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_feedback_stats/:callerId/:scId/:dataType/:branchId/:token');
    }]);

angular.module('letsService')

  .factory('SalesFeedbackPerformanceDetailsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_feedback_stats_details/:scId/:callerId/:branchId/:status/:aniverseryType/:dataType/:reportType/:token');
    }]);

angular.module('letsService')

  .factory('GetSMSTemplateLableListService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_smstemplate_list/:scId/:token');
    }]);

angular.module('letsService')

  .factory('GetPotentialCustomerDetailsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_month_wise_potential_customer_details/:scId/:date/:status/:branchId/:reportType/:token');
    }]);

  angular.module('letsService')

  .factory('GetDealerOverallStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_calenderWise_dealer_stats/:logInId/:type/:value/:status/:token');
    }]);

  angular.module('letsService')

  .factory('GetBrandListService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_brandName_list/:logInId/:token');
    }]);

  angular.module('letsService')

  .factory('GetDealerStatsByBrandNameService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_brand_wise_stats/:logInId/:brandName/:token');
    }]);
 
 angular.module('letsService')

 .factory('GetSupportDealerListService', ['serviceURL', '$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'get_support_dealer_wise_list/:logInId/:role/:token');
   }]);

  angular.module('letsService')

  .factory('GetSupportDealerStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_dealers_info/:brand/:logInId/:token');
    }]);

  angular.module('letsService')

  .factory('GetFiveDaysDealerStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_dealer_dateWise_stats/:logInId/:type/:value/:token');
    }]);

  angular.module('letsService')

  .factory('GetDealerLiveSupportStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_dealer_live_stats/:logInId/:type/:value/:token');
    }]);

   angular.module('letsService')

  .factory('GetDealerDetailedStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_sub_dealers_info/:logInId/:brand/:status/:token');
    }]);

  angular.module('letsService')

  .factory('GetDealerDetailsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_sub_dealers_details/:logInId/:brand/:status/:date/:exportType/:token');
    }]);

  angular.module('letsService')

  .factory('GetOverallBrandStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_calenderWise_brand_stats/:logInId/:status/:token');
    }]);

   angular.module('letsService')

  .factory('GetDealerTopPerformanceStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'ls_connect_top_performer_stats/:logInId/:brand/:token');
    }]);

  angular.module('letsService')
 .factory('ClickToCallService', [ 'serviceURL','$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'crm_saas_admin/lsConnect_support_click_to_call/:loginId/:token');
   }]);

 angular.module('letsService')
 .factory('UpdateSupportCallStatusService', [ 'serviceURL','$resource',
   function(serviceURL, $resource){
     return $resource(serviceURL+'crm_saas_admin/lsConnect_support_call_status/:loginId/:token');
   }]);

 angular.module('letsService')

  .factory('InactiveDateOfSaleDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/update_invalid_chassis_status/:id/:token');
    }]);

  angular.module('letsService')

  .factory('SendRenewalEmailService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/send_renewal_mail/:id/:token');
    }]);

  angular.module('letsService')
  .factory('AdminGoogleLoginService', ['serviceURL', '$resource',
                    function(serviceURL, $resource){
      return $resource(serviceURL+'lscrmsaas/ls_connect_support_login/:id/:token');
 }]);

   angular.module('letsService')
  .factory('GetBrandServiceSchedulesService', ['serviceURL', '$resource',
                    function(serviceURL, $resource){
      return $resource(serviceURL+'get_lsConnect_service_schedule_logic/:logInId/:brand/:token');
 }]);

  angular.module('letsService')
  .factory('GetDetailsByChassisNoService', ['serviceURL', '$resource',
                    function(serviceURL, $resource){
      return $resource(serviceURL+'get_chassisNoData/:chassisNo/:scId/:token');
 }]);

  angular.module('letsService')
  .factory('GetDevConsoleCallerDetailsService', ['serviceURL', '$resource',
                    function(serviceURL, $resource){
      return $resource(serviceURL+'get_chassisNo_calldetails/:sapptId/:status/:scId/:token');
 }]);


angular.module('letsService')

  .service('GetLatLngService', ['$window', '$http', '$q', function($window, $http, $q) {
    return {
      getLocationCoordinates: function(address) {
        var deferred = $q.defer();
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyB4xBoRvGCJOG_Kv-p8pwy8QraS4ZYqE1o').then(function (data) {
          if(data.data.results[0]) {
            deferred.resolve(data.data.results[0].geometry.location.lat + ',' + data.data.results[0].geometry.location.lng);
          } else {
            deferred.resolve(false);
          }
        }, function (err) {
          console.log(err);
          deferred.reject(err);
        });
        return deferred.promise;
      }
    };
  }]);

/*calculating assistance amount end*/

/*get SMS HISTORY start*/

angular.module('letsService')

  .factory('GetSMSHistoryService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sent_sms_list/:scId/:export/:fromDate/:toDate/:token');
    }]);

/*get SMS HISTORY end*/

/*get UPLOAD HISTORY start*/
angular.module('letsService')

  .factory('GetUploadHistoryService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_file_upload_history/:scId/:token');
    }]);

/*get UPLOAD HISTORY end*/

/*get ASSIGN HISTORY start*/
angular.module('letsService')

  .factory('GetAssignHistoryService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_assigned_data_history/:scId/:token');
    }]);
/*get ASSIGN HISTORY start*/

angular.module('letsService')

  .factory('GetCallerService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_active_and_inactive_caller_list/:scId/:token');
    }]);

angular.module('letsService')

  .factory('ManageCallerService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/update_caller_status/:id/:token');
    }]);

angular.module('letsService')

  .factory('AssignCallerService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/set_caller_wise_target/:id/:token');
    }]);

angular.module('letsService')

  .factory('CallingPendingStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'caller_pending_appt_stats/:loginId/:id/:token');
    }]);

angular.module('letsService')

  .factory('CallingPendingStatsDetailsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'caller_pending_appt_stats_details/:callerId/:scId/:status/:token');
    }]);


angular.module('letsService')
  .factory('TeleCallerHourWiseDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_hour_wise_caller_stats/:date/:scId/:callerId/:branch/:status/:token');
    }]);


  angular.module('letsService')
    .factory('TeleCallerWeeklyWiseDataService', [ 'serviceURL','$resource',
      function(serviceURL, $resource){
        return $resource(serviceURL+'get_last_seven_days_caller_stats/:date/:scId/:callerId/:branch/:status/:token');
      }]);

angular.module('letsService')
  .factory('TeleCallerJobCardDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_jobcard_stats/:scId/:branchId/:token');
    }]);


angular.module('letsService')
  .factory('TeleCallerCallStatsDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_wise_live_stats/:scId/:dataType/:token');
    }]);

angular.module('letsService')
  .factory('TeleCallerDataTypeStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_datatype_stats/:fromDate/:toDate/:scId/:callerId/:token');
    }]);


angular.module('letsService')
  .factory('TeleCallerStatusDataService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_status_stats/:fromDate/:toDate/:id/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallingCallRecordService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_appt_wise_recording_list/:chassisNo/:logInId/:scId/:dataTypeId/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallingSMSPackageService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sms_package_list/:scId/:token');
    }]);


angular.module('letsService')

  .factory('TeleCallingSMSPricingService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sms_pricing/:smsCount/:scId/:token');
    }]);


angular.module('letsService')

  .factory('UpdateTelecallerServiceCenterService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_service_ceneter/:id/:token');
    }]);

angular.module('letsService')

  .factory('UpdatePickupAndDropService', ['pickupAndDropServiceURL', '$resource',
    function(pickupAndDropServiceURL, $resource){
      return $resource(pickupAndDropServiceURL+'utility/create_crm_saas_pick_and_drop_appointment/:id/:token');
    }]);

angular.module('letsService')

  .factory('UpdateTelecallingTargetService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/assign_calling_data/:id/:token');
    }]);


angular.module('letsService')

  .factory('CrmValidationService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'validate_crm_caller/:callerId/:token/:role/:sessionToken/:loginIp');
    }]);


angular.module('letsService')

  .factory('ForgotPasswordService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/send_admin_password_confirmation_otp/:id/:token');
    }]);


angular.module('letsService')

  .factory('ChangePasswordService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/update_admin_password/:id/:token');
    }]);

angular.module('letsService')

  .factory('PostServiceFeedbackService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_wise_psf_stats/:callerId/:scId/:dataType/:branchId/:token');
    }]);

angular.module('letsService')

  .factory('TeleCallerPsfDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_wise_psf_stats_details/:status/:callerId/:scId/:fromDate/:toDate/:branchId/:dataType/:token');
    }]);

angular.module('letsService')

  .factory('BrandWiseModelService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_brand_wise_model/:brandName');
    }]);


angular.module('letsService')

  .factory('CurrentTimeService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'getPresentHour');
    }]);

angular.module('letsService')

  .factory('CreDashboardDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_main_dashboard_stats/:scId/:callerId/:branchId/:token');
    }]);

angular.module('letsService')

  .factory('CreDashboardDueTypeDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_main_dashboard_duetype_stats/:scId/:callerId/:dataTypeId/:status/:token');
    }]);

angular.module('letsService')

  .factory('CreDashboardDataTableSearchService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'search_appt_details_by_datatype_keyword/:key/:scId/:callerId/:dataatypeId/:token');
    }]);

angular.module('letsService')

  .factory('CreDashboardDataTableService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_main_dashboard_details/:scId/:callerId/:dataTypeId/:status/:scheduleType/:subStatus/:branchId/:token');
    }]);

angular.module('letsService')

  .factory('CreDashboardFilterTypeDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_main_dashboard_substatus_stats/:callerId/:status/:dataTypeId/:scheduleType/:scId/:branchId/:token');
    }]);


angular.module('letsService')

  .factory('GetCallerMainDashboardOtherDatatypeStats', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_main_dashboard_other_datatype_stats/:scId/:callerId/:branchId/:token');
    }]);

angular.module('letsService')

  .factory('GetCallerDashboardOtherDatatypeStats', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_main_dashboard_details/:scId/:callerId/:dataTypeId/:status/:scheduleType/:token');
    }]);

angular.module('letsService')

  .factory('GetInsuranceDashboardStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_insurance_dashboard_stats/:scId/:callerId/:branchId/:brand/:token');
    }]);

angular.module('letsService')

  .factory('GetInsuranceDashboardDetailsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_insurance_main_dashboard_details/:scId/:callerId/:status/:branchId/:subStatus/:brand/:token');
    }]);

angular.module('letsService')

  .factory('GetPerticularInsuranceDetailsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_particular_insurance_appointment_details/:apptId/:scId/:brand/:token');
    }]);


angular.module('letsService')
  .factory('CreDashboardStatsDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_dashboard_stats/:scId/:callerId/:branchId/:token');
    }]);

angular.module('letsService')
  .factory('CreDashboardInsuranceStatsDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_insurance_dashboard_stats/:fromDate/:toDate/:scId/:callerId/:branchId/:brand/:token');
    }]);

angular.module('letsService')
  .factory('AdminInsuranceCustomerDetailsStatsWiseService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_insurance_dashboard_deatils/:fromDate/:toDate/:scId/:callerId/:status/:branchId/:bikeBrand/:reportType/:token');
    }]);

angular.module('letsService')
  .factory('GetPresentHourService', ['$resource','pickupAndDropServiceURL',function($resource,pickupAndDropServiceURL){
    return $resource(pickupAndDropServiceURL+'getPresentHour');
  }]);

angular.module('letsService')

  .factory('UpdateInsuranceCustomerPhoneService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_insurance_customer_mobile_number/:id/:token');
    }]);

angular.module('letsService')

  .factory('CreInsuranceFilterTypeDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_caller_insurance_main_dashboard_substatus_stats/:callerId/:scId/:branchId/:brand/:token');
    }]);

angular.module('letsService')

  .factory('CreAppointmentActiveStatusService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/update_caller_appt_active_status/:id/:token');
    }]);


angular.module('letsService')

  .factory('CreSalesAnnivarsaryDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_anniversary_stats/:scId/:callerId/:branchId/:aniverseryType/:token');
    }]);

  angular.module('letsService')

  .factory('CreSalesAnnivarsaryDetailsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_anniversary_stats_details/:scId/:callerId/:branchId/:status/:aniverseryType/:dataType/:token');
    }]);

angular.module('letsService')

  .factory('GetPerticularSalesDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_particular_sales_appointment_details/:apptId/:scId/:token');
    }]);

angular.module('letsService')

  .factory('UpdateSalesDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_sales_caller/update_crm_sales_appointment_status/:id/:token');
    }]);

angular.module('letsService')

  .factory('GetSalesHistoryService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_appt_history_details/:chassisNo/:scId/:token');
    }]);

angular.module('letsService')

  .factory('GetInsuranceCallerListService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_insurance_caller_list/:scId/:token');
    }]);

angular.module('letsService')

  .factory('AssignInsuranceDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/assign_insurance_calling_data/:id/:token');
    }]);

angular.module('letsService')

  .factory('DealerRevenueReportService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_dealer_wise_revenue_stats/:scId/:branchId/:token');
    }]);

angular.module('letsService')

  .factory('CallerPerformanceDueDatewiseStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_pontential_servicedue_stats/:fromDate/:toDate/:scId/:callerId/:branch/:datatypeId/:token');
    }]);

  angular.module('letsService')

  .factory('CallerPerformanceCompletePotentialStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_pontential_allocated_stats/:fromDate/:toDate/:scId/:callerId/:branch/:datatypeId/:token');
    }]);

  angular.module('letsService')

  .factory('CallerPerformanceTotalDueDateStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_pontential_servicedue_stats_total/:fromDate/:toDate/:scId/:callerId/:branch/:datatypeId/:token');
    }]);
  
  angular.module('letsService')

  .factory('CallerPerformanceMonthlyTotalPotentialStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_pontential_allocated_stats_total/:fromDate/:toDate/:scId/:callerId/:branch/:datatypeId/:token');
    }]);

angular.module('letsService')

  .factory('DealerWiseDataReportService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_dealer_wise_data_report_stats/:scId/:branchId/:token');
    }]);

angular.module('letsService')

  .factory('SupportToolService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_admin/lsConnect_support_tools/:id/:token');
    }]);

angular.module('letsService')

  .factory('GetUnAssignedDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_branch_and_dataType_wise_unassigned_data_count/:scId/:branchId/:dataTypeId/:dataTypeName/:token');
    }]);
 
 angular.module('letsService')
  .factory('PSFPerformanceDashboardStatsDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_dashboard_psf_stats/:fromDate/:toDate/:scId/:callerId/:branchId/:token');
    }]);

angular.module('letsService')
  .factory('PSFPerformancesStatsDetailedService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_admin_dashboard_psf_details/:fromDate/:toDate/:scId/:callerId/:branchId/:status/:reportType/:token');
    }]);

angular.module('letsService')
  .factory('SalesFeedbackCallRecordingService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_appt_wise_sales_feedback_recording_list/:chassisNo/:logInId/:scId/:token');
    }]);

angular.module('letsService')
  .factory('SalesFeedbackYesNoDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_feedback_yesno_stats/:fromDate/:toDate/:scId/:callerId/:branchId/:token');
    }]);
  
angular.module('letsService')
  .factory('SalesFeedbackRatingDataService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_feedback_rating_stats/:fromDate/:toDate/:scId/:callerId/:branchId/:token');
    }]);

angular.module('letsService')
  .factory('SalesFeedbackDetailsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_feedback_details/:fromDate/:toDate/:scId/:callerId/:branchId/:feedBackListId/:feedBackStatus/:status/:exportType/:token');
    }]);

angular.module('letsService')
  .factory('CreateFutureReminderService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'crm_saas_caller/create_future_appointment/:scId/:token');
    }]);

angular.module('letsService')
  .factory('GetStatusWiseConversionDetailsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_status_wise_conversion_details/:fromDate/:toDate/:status/:callerId/:branchId/:scId/:reportType/:token');
    }]);

angular.module('letsService')
  .factory('UpdateDealerRenevalAndExpiryService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_dealer_list_to_update_expiry_date/:scId/:token');
    }]);

  angular.module('letsService')
  .factory('GetSuperAdminListService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_super_admin_list/:scId/:token');
    }]);

   angular.module('letsService')
  .factory('GetSmsTemplateAccessBranchListService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sms_access_status_branch_wise/:scId/:status/:loginId/:token');
    }]);

 angular.module('letsService')
  .factory('GetServiceFeedbackYesNoDefaultStatsService', [ 'serviceURL','$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_service_feedback_yesno_default/:fromDate/:toDate/:scId/:caller/:branch/:token');
    }]);

  angular.module('letsService')
  .factory('GetSalesFeedbackYesNoDefaultStatsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_sales_feedback_yesno_default/:fromDate/:toDate/:scId/:callerId/:branchId/:token');
    }]);

  angular.module('letsService')
  .factory('GetSupportBranchDetailsService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'get_branch_details/:scId/:branchId/:token');
    }]);

   angular.module('letsService')
  .factory('TeleCallerExcelUploadInsuranceDataService', ['serviceURL', '$resource','$cookies',
    function(serviceURL, $resource, $cookies){
      return $resource(serviceURL+'file_upload/'+$cookies.get('loggedInUserBikeBrand')+'/upload_insurance_job_card_data_v1/:id/:token');
    }]);

   angular.module('letsService')
  .factory('GetSupportUserListService', ['serviceURL', '$resource','$cookies',
    function(serviceURL, $resource, $cookies){
      return $resource(serviceURL+'get_support_members/:loginId/:token');
    }]);

   angular.module('letsService')
  .factory('GetSalesRevenueStatsService', ['serviceURL', '$resource','$cookies',
    function(serviceURL, $resource, $cookies){
      return $resource(serviceURL+'get_sales_revenue_stats/:status/:scId/:token');
    }]);

   angular.module('letsService')
  .factory('UpdateFcmTokenService', ['serviceURL', '$resource','$cookies',
    function(serviceURL, $resource, $cookies){
      return $resource(serviceURL+'lscrmsaas/updateFcmToken/:id/:token');
    }]);

  angular.module('letsService')
  .factory('GetFeedbckHistoryService', ['serviceURL', '$resource','$cookies',
    function(serviceURL, $resource, $cookies){
      return $resource(serviceURL+'get_feedback_customer_history/:customerId/:status/:scId/:token');
    }]);

  angular.module('letsService')
  .factory('GetSalesJobcardDataService', ['serviceURL', '$resource','$cookies',
    function(serviceURL, $resource, $cookies){
      return $resource(serviceURL+'get_day_wise_sales_job_card_stats/:fromDate/:toDate/:branchId/:scId/:token');
    }]);

  angular.module('letsService')
  .factory('GetSalesJobcardStatsDetailedService', ['serviceURL', '$resource','$cookies',
    function(serviceURL, $resource, $cookies){
      return $resource(serviceURL+'get_day_wise_sales_job_card_details/:date/:status/:scId/:branch/:reportType/:token');
    }]);
  
  /*angular.module('letsService')
  .factory('AutenticationService', ['serviceURL', '$resource',
    function(serviceURL, $resource){
      return $resource(serviceURL+'userAuthenticate/:uscId/:auth');
    }]);*/
 
  angular.module('letsService')
  .factory('TokenService', [
    function(){
      return {
        getToken : function(str) {
          str = str+'lsCrmSaasApis';
          var lsToken;
          var hash = 0;
          if (str.length === 0) {return hash;}
          for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash * 8)-hash)+char;
          }
          lsToken = hash;
          return lsToken;
        }
      };
    }]);

angular.module('letsService')
  .factory('PickupAndDropTokenService', [
    function(){
      return {
        getToken : function(str) {
          str = str+'LetsServiceAPIs';
          var lsToken;
          var hash = 0;
          if (str.length === 0) {return hash;}
          for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash * 8)-hash)+char;
          }
          lsToken = hash;
          return lsToken;
        }
      };
    }]);

angular.module('letsService')
  .factory('TimeSlotSelected', [ function () {
    return {
      getTime : function () {
        return [{'timeSelect':'8-9 AM','value':'8'},{'timeSelect':'9-10 AM','value':'9'},{'timeSelect':'10-11 AM','value':'10'},
          {'timeSelect':'11-12 AM','value':'11'},{'timeSelect':'12-1 PM','value':'12'},{'timeSelect':'1-2 PM','value':'13'},{'timeSelect':'2-3 PM','value':'14'},
          {'timeSelect':'3-4 PM','value':'15'},{'timeSelect':'4-5 PM','value':'16'},{'timeSelect':'5-6 PM','value':'17'},{'timeSelect':'6-7 PM','value':'18'}];
      }
    };
  }]);

/*angular.module('letsService')
  .factory('TestService', ['$resource',
    function($resource){
      return $resource('http://crmstagging-env.us-west-2.elasticbeanstalk.com/test', {}, {
        query: {
          method: 'GET',
          isArray: true,
          headers: { 'Content-Type': 'application/json','Accept': 'crmHeaderToken','X-Requested-With': 'XMLHttpRequest'}
        }
      });
}]);*/

/*angular.module('letsService')
  .factory('TestService', ['$resource',
    function($resource){
      return $resource('http://crmstagging-env.us-west-2.elasticbeanstalk.com/test');
}]);*/


/*angular.module('letsService')
  .factory('CreDashboardFilterTypeDataService', ['$resource',
    function($resource){
      return $resource('http://192.168.25.129/crm_test_v2.5/index.php/get_caller_main_dashboard_substatus_stats/:callerId/:status/:dataTypeId/:scheduleType/:scId/:branchId/:token', {}, {
        query: {
          method: 'GET',
          isArray: false,
          headers: { 'Content-Type': 'application/json','Accept': 'crmHeaderToken'}
        }
      });
}]);*/

(function() {
  'use strict';

  angular.module('toastr', [])
    .factory('toastr', toastr);

  toastr.$inject = ['$animate', '$injector', '$document', '$rootScope', '$sce', 'toastrConfig', '$q'];

  function toastr($animate, $injector, $document, $rootScope, $sce, toastrConfig, $q) {
    var container;
    var index = 0;
    var toasts = [];

    var previousToastMessage = '';
    var openToasts = {};

    var containerDefer = $q.defer();

    var toast = {
      active: active,
      clear: clear,
      error: error,
      info: info,
      remove: remove,
      success: success,
      warning: warning,
      refreshTimer: refreshTimer
    };

    return toast;

    /* Public API */
    function active() {
      return toasts.length;
    }

    function clear(toast) {
      // Bit of a hack, I will remove this soon with a BC
      if (arguments.length === 1 && !toast) { return; }

      if (toast) {
        remove(toast.toastId);
      } else {
        for (var i = 0; i < toasts.length; i++) {
          remove(toasts[i].toastId);
        }
      }
    }

    function error(message, title, optionsOverride) {
      var type = _getOptions().iconClasses.error;
      return _buildNotification(type, message, title, optionsOverride);
    }

    function info(message, title, optionsOverride) {
      var type = _getOptions().iconClasses.info;
      return _buildNotification(type, message, title, optionsOverride);
    }

    function success(message, title, optionsOverride) {
      var type = _getOptions().iconClasses.success;
      return _buildNotification(type, message, title, optionsOverride);
    }

    function warning(message, title, optionsOverride) {
      var type = _getOptions().iconClasses.warning;
      return _buildNotification(type, message, title, optionsOverride);
    }

    function refreshTimer(toast, newTime) {
      if (toast && toast.isOpened && toasts.indexOf(toast) >= 0) {
          toast.scope.refreshTimer(newTime);
      }
    }

    function remove(toastId, wasClicked) {
      var toast = findToast(toastId);

      if (toast && ! toast.deleting) { // Avoid clicking when fading out
        toast.deleting = true;
        toast.isOpened = false;
        $animate.leave(toast.el).then(function() {
          if (toast.scope.options.onHidden) {
            toast.scope.options.onHidden(!!wasClicked, toast);
          }
          toast.scope.$destroy();
          var index = toasts.indexOf(toast);
          delete openToasts[toast.scope.message];
          toasts.splice(index, 1);
          var maxOpened = toastrConfig.maxOpened;
          if (maxOpened && toasts.length >= maxOpened) {
            toasts[maxOpened - 1].open.resolve();
          }
          if (lastToast()) {
            container.remove();
            container = null;
            containerDefer = $q.defer();
          }
        });
      }

      function findToast(toastId) {
        for (var i = 0; i < toasts.length; i++) {
          if (toasts[i].toastId === toastId) {
            return toasts[i];
          }
        }
      }

      function lastToast() {
        return !toasts.length;
      }
    }

    /* Internal functions */
    function _buildNotification(type, message, title, optionsOverride) {
      if (angular.isObject(title)) {
        optionsOverride = title;
        title = null;
      }

      return _notify({
        iconClass: type,
        message: message,
        optionsOverride: optionsOverride,
        title: title
      });
    }

    function _getOptions() {
      return angular.extend({}, toastrConfig);
    }

    function _createOrGetContainer(options) {
      if(container) { return containerDefer.promise; }

      container = angular.element('<div></div>');
      container.attr('id', options.containerId);
      container.addClass(options.positionClass);
      container.css({'pointer-events': 'auto'});

      var target = angular.element(document.querySelector(options.target));

      if ( ! target || ! target.length) {
        throw 'Target for toasts doesn\'t exist';
      }

      $animate.enter(container, target).then(function() {
        containerDefer.resolve();
      });

      return containerDefer.promise;
    }

    function _notify(map) {
      var options = _getOptions();

      if (shouldExit()) { return; }

      var newToast = createToast();

      toasts.push(newToast);

      if (ifMaxOpenedAndAutoDismiss()) {
        var oldToasts = toasts.slice(0, (toasts.length - options.maxOpened));
        for (var i = 0, len = oldToasts.length; i < len; i++) {
          remove(oldToasts[i].toastId);
        }
      }

      if (maxOpenedNotReached()) {
        newToast.open.resolve();
      }

      newToast.open.promise.then(function() {
        _createOrGetContainer(options).then(function() {
          newToast.isOpened = true;
          if (options.newestOnTop) {
            $animate.enter(newToast.el, container).then(function() {
              newToast.scope.init();
            });
          } else {
            var sibling = container[0].lastChild ? angular.element(container[0].lastChild) : null;
            $animate.enter(newToast.el, container, sibling).then(function() {
              newToast.scope.init();
            });
          }
        });
      });

      return newToast;

      function ifMaxOpenedAndAutoDismiss() {
        return options.autoDismiss && options.maxOpened && toasts.length > options.maxOpened;
      }

      function createScope(toast, map, options) {
        if (options.allowHtml) {
          toast.scope.allowHtml = true;
          toast.scope.title = $sce.trustAsHtml(map.title);
          toast.scope.message = $sce.trustAsHtml(map.message);
        } else {
          toast.scope.title = map.title;
          toast.scope.message = map.message;
        }

        toast.scope.toastType = toast.iconClass;
        toast.scope.toastId = toast.toastId;
        toast.scope.extraData = options.extraData;

        toast.scope.options = {
          extendedTimeOut: options.extendedTimeOut,
          messageClass: options.messageClass,
          onHidden: options.onHidden,
          onShown: generateEvent('onShown'),
          onTap: generateEvent('onTap'),
          progressBar: options.progressBar,
          tapToDismiss: options.tapToDismiss,
          timeOut: options.timeOut,
          titleClass: options.titleClass,
          toastClass: options.toastClass
        };

        if (options.closeButton) {
          toast.scope.options.closeHtml = options.closeHtml;
        }

        function generateEvent(event) {
          if (options[event]) {
            return function() {
              options[event](toast);
            };
          }
        }
      }

      function createToast() {
        var newToast = {
          toastId: index++,
          isOpened: false,
          scope: $rootScope.$new(),
          open: $q.defer()
        };
        newToast.iconClass = map.iconClass;
        if (map.optionsOverride) {
          angular.extend(options, cleanOptionsOverride(map.optionsOverride));
          newToast.iconClass = map.optionsOverride.iconClass || newToast.iconClass;
        }

        createScope(newToast, map, options);

        newToast.el = createToastEl(newToast.scope);

        return newToast;

        function cleanOptionsOverride(options) {
          var badOptions = ['containerId', 'iconClasses', 'maxOpened', 'newestOnTop',
                            'positionClass', 'preventDuplicates', 'preventOpenDuplicates', 'templates'];
          for (var i = 0, l = badOptions.length; i < l; i++) {
            delete options[badOptions[i]];
          }

          return options;
        }
      }

      function createToastEl(scope) {
        var angularDomEl = angular.element('<div toast></div>'),
          $compile = $injector.get('$compile');
        return $compile(angularDomEl)(scope);
      }

      function maxOpenedNotReached() {
        return options.maxOpened && toasts.length <= options.maxOpened || !options.maxOpened;
      }

      function shouldExit() {
        var isDuplicateOfLast = options.preventDuplicates && map.message === previousToastMessage;
        var isDuplicateOpen = options.preventOpenDuplicates && openToasts[map.message];

        if (isDuplicateOfLast || isDuplicateOpen) {
          return true;
        }

        previousToastMessage = map.message;
        openToasts[map.message] = true;

        return false;
      }
    }
  }
}());

(function() {
  'use strict';

  angular.module('toastr')
    .constant('toastrConfig', {
      allowHtml: false,
      autoDismiss: false,
      closeButton: false,
      closeHtml: '<button>&times;</button>',
      containerId: 'toast-container',
      extendedTimeOut: 1000,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      maxOpened: 0,
      messageClass: 'toast-message',
      newestOnTop: true,
      onHidden: null,
      onShown: null,
      onTap: null,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      progressBar: false,
      tapToDismiss: true,
      target: 'body',
      templates: {
        toast: 'directives/toast/toast.html',
        progressbar: 'directives/progressbar/progressbar.html'
      },
      timeOut: 5000,
      titleClass: 'toast-title',
      toastClass: 'toast'
    });
}());

(function() {
  'use strict';

  angular.module('toastr')
    .directive('progressBar', progressBar);

  progressBar.$inject = ['toastrConfig'];

  function progressBar(toastrConfig) {
    return {
      require: '^toast',
      templateUrl: function() {
        return toastrConfig.templates.progressbar;
      },
      link: linkFunction
    };

    function linkFunction(scope, element, attrs, toastCtrl) {
      var intervalId, currentTimeOut, hideTime;

      toastCtrl.progressBar = scope;

      scope.start = function(duration) {
        if (intervalId) {
          clearInterval(intervalId);
        }

        currentTimeOut = parseFloat(duration);
        hideTime = new Date().getTime() + currentTimeOut;
        intervalId = setInterval(updateProgress, 10);
      };

      scope.stop = function() {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };

      function updateProgress() {
        var percentage = ((hideTime - (new Date().getTime())) / currentTimeOut) * 100;
        element.css('width', percentage + '%');
      }

      scope.$on('$destroy', function() {
        // Failsafe stop
        clearInterval(intervalId);
      });
    }
  }
}());

(function() {
  'use strict';

  angular.module('toastr')
    .controller('ToastController', ToastController);

  function ToastController() {
    this.progressBar = null;

    this.startProgressBar = function(duration) {
      if (this.progressBar) {
        this.progressBar.start(duration);
      }
    };

    this.stopProgressBar = function() {
      if (this.progressBar) {
        this.progressBar.stop();
      }
    };
  }
}());

(function() {
  'use strict';

  angular.module('toastr')
    .directive('toast', toast);

  toast.$inject = ['$injector', '$interval', 'toastrConfig', 'toastr'];

  function toast($injector, $interval, toastrConfig, toastr) {
    return {
      templateUrl: function() {
        return toastrConfig.templates.toast;
      },
      controller: 'ToastController',
      link: toastLinkFunction
    };

    function toastLinkFunction(scope, element, attrs, toastCtrl) {
      var timeout;

      scope.toastClass = scope.options.toastClass;
      scope.titleClass = scope.options.titleClass;
      scope.messageClass = scope.options.messageClass;
      scope.progressBar = scope.options.progressBar;

      if (wantsCloseButton()) {
        var button = angular.element(scope.options.closeHtml),
          $compile = $injector.get('$compile');
        button.addClass('toast-close-button');
        button.attr('ng-click', 'close(true, $event)');
        $compile(button)(scope);
        element.children().prepend(button);
      }

      scope.init = function() {
        if (scope.options.timeOut) {
          timeout = createTimeout(scope.options.timeOut);
        }
        if (scope.options.onShown) {
          scope.options.onShown();
        }
      };

      element.on('mouseenter', function() {
        hideAndStopProgressBar();
        if (timeout) {
          $interval.cancel(timeout);
        }
      });

      scope.tapToast = function () {
        if (angular.isFunction(scope.options.onTap)) {
          scope.options.onTap();
        }
        if (scope.options.tapToDismiss) {
          scope.close(true);
        }
      };

      scope.close = function (wasClicked, $event) {
        if ($event && angular.isFunction($event.stopPropagation)) {
          $event.stopPropagation();
        }
        toastr.remove(scope.toastId, wasClicked);
      };
      
      scope.refreshTimer = function(newTime) {
        if (timeout) {
          $interval.cancel(timeout);
          timeout = createTimeout(newTime || scope.options.timeOut);
        }
      };

      element.on('mouseleave', function() {
        if (scope.options.timeOut === 0 && scope.options.extendedTimeOut === 0) { return; }
        scope.$apply(function() {
          scope.progressBar = scope.options.progressBar;
        });
        timeout = createTimeout(scope.options.extendedTimeOut);
      });

      function createTimeout(time) {
        toastCtrl.startProgressBar(time);
        return $interval(function() {
          toastCtrl.stopProgressBar();
          toastr.remove(scope.toastId);
        }, time, 1);
      }

      function hideAndStopProgressBar() {
        scope.progressBar = false;
        toastCtrl.stopProgressBar();
      }

      function wantsCloseButton() {
        return scope.options.closeHtml;
      }
    }
  }
}());

angular.module("toastr").run(["$templateCache", function($templateCache) {$templateCache.put("directives/progressbar/progressbar.html","<div class=\"toast-progress\"></div>\n");
$templateCache.put("directives/toast/toast.html","<div class=\"{{toastClass}} {{toastType}}\" ng-click=\"tapToast()\">\n  <div ng-switch on=\"allowHtml\">\n    <div ng-switch-default ng-if=\"title\" class=\"{{titleClass}}\" aria-label=\"{{title}}\">{{title}}</div>\n    <div ng-switch-default class=\"{{messageClass}}\" aria-label=\"{{message}}\">{{message}}</div>\n    <div ng-switch-when=\"true\" ng-if=\"title\" class=\"{{titleClass}}\" ng-bind-html=\"title\"></div>\n    <div ng-switch-when=\"true\" class=\"{{messageClass}}\" ng-bind-html=\"message\"></div>\n  </div>\n  <progress-bar ng-if=\"progressBar\"></progress-bar>\n</div>\n");}]);
