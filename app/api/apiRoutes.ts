export class ApiRoutes {
  static BASE_URL_API_TEST: string = 'https://api.hildamcouture.com/api/v1';

  static AccessToken: string = 'h';







    //#region Customers endpoint ---------------------------------

  static FetchAllCustomers: string = '/customers/all-customers'
  static FetchCustomer: string = '/customers/customer' 
  static AddCustomer: string = '/customers/add-customer'
  static DeleteCustomer: string = '/customers/delete-customer'
  static EditCustomer: string = '/customers/edit-customer'

  static FetchCustomerChart: string = '/customers/customer-chart'

  static ImportCustomerData: string = '/customers/import-customer-data'
  static ExportCustomerData: string = '/customers/export-customer-data'








  



    //#region Orders endpoint ---------------------------------

    static FetchAllOrders: string = '/orders/all-orders';
    static FetchOrderById: string = '/orders/order';
    static CreateOrder: string = '/orders/create-order';
    static EditOrder: string = '/orders/edit-order';
    static DeleteOrder: string = '/orders/delete-order';
    static HeadOfTailoringList: string = '/orders/list-of-head-of-tailoring';
    static AcceptTailorImage: string = '/orders/accept-tailor-style';
    static RejectTailorImage: string = '/orders/reject-tailor-style';
    static CloseOrder: string = '/orders/close-order';










    //#region Payment endpoint ---------------------------------

    static FetchAllPayments: string = '/payments/all-payments';
    static FetchPayment: string = '/payments/payment';
    static CreatePayment: string = '/payments/add-payment';
    static EditPayment: string = '/payments/edit-payment';
    static DeletePayment: string = '/payments/delete-payment';
    static FetchPaymentChart: string = '/payments/payment-chart-information';











    
    //#region Inventory endpoint ---------------------------------
    static FetchAllInventories: string = '/inventories/all-inventories';
    static FetchInventory: string = '/inventories/inventory';
    static CreateInventory: string = '/inventories/add-inventory';
    static EditInventory: string = '/inventories/edit-inventory';
    static DeleteInventory: string = '/inventories/delete-inventory';

    




    
    //#region Users endpoint ---------------------------------
    static FetchAllUsers: string = '/users/all-users';
    static DeleteUser: string = '/users/delete-user';
    static EditUser: string = '/users/edit-user';
    static CreateUser: string = '/users/create-user';
    static FetchUser: string = '/users/user';









    //#region Expense endpoint ---------------------------------
  static CreateExpense: string = '/job-expenses/add-expense'
  


















      //#region Calendar endpoint ---------------------------------
    static FetchAllDates: string = '/orders/get-fitting-dates';
    static FetchAllDatesHot: string = '/tailoring/get-fitting-dates';
    static AddCalendarDate: string = '/orders/add-calendar-date';

















      //#region Daily Expense endpoint ---------------------------------
    static CreateBudget: string = '/daily-expenses/create-budget';
    static GetAllBudgets: string = '/daily-expenses/all-budgets';
  static GetBudget: string = '/daily-expenses/budget';
  static CreateOperationalExpense = "/daily-expenses/create-expense"
  static GetBudgetBreakdown: string = '/daily-expenses/budget-breakdown?budget_id';
static DeleteExpense: string = '/daily-expenses/delete-expense';



















      //#region Store Requests endpoint ---------------------------------

  static FetchAllStoreRequests: string = '/store-requests/all-store-requests';
  static FetchStoreRequest: string = '/store-requests/store-request';
  static AcceptStoreRequest: string = '/store-requests/accept-store-requests-by-order';
  static RejectStoreRequest: string = '/store-requests/reject-store-requests-by-order';
  static DeleteStoreRequest: string = '/store-requests/delete-store-request';









      //#region Job Expense endpoint ---------------------------------
  static CreateJobExpense: string = '/job-expenses/add-expense'
  static FetchAllJobExpenses: string = '/job-expenses/all-expenses'
  static FetchJobExpense: string = '/job-expenses/expense'
  static EditJobExpense: string = '/job-expenses/edit-expense'
  static DeleteJobExpense: string = '/job-expenses/delete-expense'










  







    //#region Head of Tailoring endpoint ---------------------------------
    static FetchAllTailorJobs: string = '/tailoring/all-tailoring-jobs';
    static FetchTailorJob: string = '/tailoring/tailor-job'
    static EditTailorJob: string = '/tailoring/update-tailor-job'
    static SendJobToClientManager: string = 'tailoring/send-to-client-manager'
    static RequestInventory: string = '/tailoring/request-inventory'
    static FetchAllInventoryRequests: string = '/tailoring/grouped-store-requests'
    static FetchInventoryRequest: string = '/tailoring/inventory-request'














    //#region Notifications endpoint ---------------------------------
  static FetchAllNotifications: string = '/notifications/all-notifications';
  static ReadNotification: string = '/notifications/read-notification';
  static ReadAllNotifications: string = '/notifications/read-all-notifications';



















    //#region Budget endpoint ---------------------------------
  

}