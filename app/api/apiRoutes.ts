export class ApiRoutes {
  static BASE_URL_API_TEST: string = 'https://api.hildamcouture.com/api/v1';

  static AccessToken: string = 'h';








  static FetchAllCustomers: string = '/customers/all-customers' 
  static AddCustomer: string = '/customers/add-customer'
  static DeleteCustomer: string = '/customers/delete-customer'




















    //#region Orders endpoint ---------------------------------

    static FetchAllOrders: string = '/orders/all-orders';

    static FetchOrderById: string = '/orderslist/{id}';
    static CreateOrder: string = '/orderslist';
    static UpdateOrder: string = '/orderslist/{id}';
    static DeleteOrder: string = '/deleteorder';


    static FetchInventory: string = '/inventory';
    


}