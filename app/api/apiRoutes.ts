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
    static FetchOrderById: string = '/orders/order';
    static CreateOrder: string = '/orders/create-order';
    static EditOrder: string = '/orders/edit-order';
    static DeleteOrder: string = '/orders/delete-order';
    static HeadOfTailoringList: string = '/orders/list-of-head-of-tailoring';




    
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


}