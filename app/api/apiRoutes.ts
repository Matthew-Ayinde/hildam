export class ApiRoutes {
  static BASE_URL_API_TEST: string = 'https://api.hildamcouture.com/api/v1';

  static AccessToken: string = 'h';







    //#region Customers endpoint ---------------------------------

  static FetchAllCustomers: string = '/customers/all-customers'
  static FetchCustomer: string = '/customers/customer' 
  static AddCustomer: string = '/customers/add-customer'
  static DeleteCustomer: string = '/customers/delete-customer'




    //#region Orders endpoint ---------------------------------

    static FetchAllOrders: string = '/orders/all-orders';
    static FetchOrderById: string = '/orderslist/{id}';
    static CreateOrder: string = '/orders/create-order';
    static UpdateOrder: string = '/orderslist/{id}';
    static DeleteOrder: string = '/deleteorder';

    static HeadOfTailoringList: string = 'orders/list-of-head-of-tailoring'




    
    //#region Inventory endpoint ---------------------------------
    static FetchInventory: string = '/inventory';
    




    
    //#region Users endpoint ---------------------------------
    static FetchAllUsers: string = '/users/all-users';
    static DeleteUser: string = '/users/delete-user';
    static EditUser: string = '/users/edit-user';
    static CreateUser: string = '/users/create-user';
    static FetchUser: string = '/users/user';


}