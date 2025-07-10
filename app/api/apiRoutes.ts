export class ApiRoutes {
  static BASE_URL_API_TEST: string = 'https://hildam.insightpublicis.com/api';

  static AccessToken: string = 'h';

    //#region Orders endpoint ---------------------------------

    static FetchAllOrders: string = '/orderslist';

    static FetchOrderById: string = '/orderslist/{id}';
    static CreateOrder: string = '/orderslist';
    static UpdateOrder: string = '/orderslist/{id}';
    static DeleteOrder: string = '/deleteorder';


    static FetchInventory: string = '/inventory';


}