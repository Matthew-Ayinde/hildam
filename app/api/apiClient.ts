import axios from "axios"
import { ApiRoutes } from "./apiRoutes"
import { getSession } from "next-auth/react"

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL_API_TEST,
})

async function getUserToken(): Promise<string> {
  const session = await getSession()
  const token = session?.user?.token
  if (!token) throw new Error("Not authenticated - no session token available")
  return token
}

async function getUserHeaders() {
  const token = await getUserToken()
  return {
    Authorization: `Bearer ${token}`,
  }
}




    //#region Customers endpoint ---------------------------------

export async function fetchAllCustomers(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllCustomers, { headers })
  console.log(resp.data.data)
  return resp.data.data;
}

export async function fetchCustomer(customerId: any): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(`${ApiRoutes.FetchCustomer}/${customerId}`, { headers })
  return resp.data.data;
}

export async function createCustomer(formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.AddCustomer, formData, { headers });
  return resp.data;
}

export async function deleteCustomer(payload: string): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.delete(`${ApiRoutes.DeleteCustomer}/${payload}`, { headers });
  return resp;
}







    //#region Orders endpoint ---------------------------------

export async function fetchOrderslist(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllOrders, { headers })
  return resp.data;
}

export async function fetchOrderById(orderId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(`${ApiRoutes.FetchOrderById}/${orderId}`, { headers })
  console.log("Fetched order data:", resp)
  return resp.data.order;
}

export async function deleteOrder(orderId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.delete(`${ApiRoutes.DeleteOrder}/${orderId}`, { headers })
  return resp;
}

export async function createOrder(formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.CreateOrder, formData, { headers });
  return resp.data;
}

export async function editOrder(orderId: string, formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(`${ApiRoutes.EditOrder}/${orderId}`, formData, { headers });
  return resp.data;
}

export async function fetchHeadOfTailoringList(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.HeadOfTailoringList, { headers })
  return resp.data;
}

export async function acceptTailorImage(orderId: string): Promise<any> {
  const headers = await getUserHeaders()

  const resp = await API.put(`${ApiRoutes.AcceptTailorImage}/${orderId}`, {}, { headers })
  return resp.data;
}

export async function rejectTailorImage(orderId: string, feedback: any): Promise<any> {
  const headers = await getUserHeaders()

  const resp = await API.put(`${ApiRoutes.RejectTailorImage}/${orderId}`, feedback, { headers })
  return resp.data;
}














    //#region Inventory endpoint ---------------------------------


export async function fetchAllInventories(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllInventories, { headers })
  return resp.data.data;
}

export async function fetchInventory(inventoryId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(`${ApiRoutes.FetchInventory}/${inventoryId}`, { headers })
  return resp.data.data;
}

export async function createInventory(formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.CreateInventory, formData, { headers });
  return resp.data;
}

export async function editInventory(inventoryId: string, formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.put(`${ApiRoutes.EditInventory}/${inventoryId}`, formData,
    { headers });
  return resp.data;
}

export async function deleteInventory(inventoryId: string): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.delete(`${ApiRoutes.DeleteInventory}/${inventoryId}`, { headers });
  return resp;
}






    //#region Users endpoint ---------------------------------

export async function fetchAllUsers(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllUsers, { headers })
  console.log('all users', resp.data)
  return resp.data;
}

export async function fetchUser(userId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(`${ApiRoutes.FetchUser}/${userId}`, { headers })
  return resp.data.data;
}

export async function createUser(formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.CreateUser, formData, { headers });
  return resp.data;
}

export async function editUser(userId: string, formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.put(`${ApiRoutes.EditUser}/${userId}`, formData, { headers });
  return resp.data;
}

export async function deleteUser(user: string): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.delete(`${ApiRoutes.DeleteUser}/${user}`, { headers });
  return resp;
}










    //#region Payments endpoint ---------------------------------
export async function fetchAllPayments(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllPayments, { headers })
  return resp.data.data;
}

export async function fetchPayment(paymentId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(`${ApiRoutes.FetchPayment}/${paymentId}`, { headers })
  return resp.data.data;
}

export async function createPayment(payload: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.CreatePayment, payload, { headers });
  return resp.data;
}

export async function editPayment(paymentId: string, formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.put(`${ApiRoutes.EditPayment}/${paymentId}`, formData, { headers });
  return resp.data;
}

export async function deletePayment(paymentId: string): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.delete(`${ApiRoutes.DeletePayment}/${paymentId}`, { headers });
  return resp;
}














    //#region Expenses endpoint ---------------------------------
    export async function createExpense(submitData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.CreateExpense, submitData, { headers });
  return resp.data;
}
















      //#region Daily Expense endpoint ---------------------------------
export async function createBudget(submitData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.CreateBudget, submitData, { headers });
  return resp.data;
}






















      //#region Job Expense endpoint ---------------------------------
export async function createJobExpense(submitData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.CreateJobExpense, submitData, { headers });
  return resp.data;
}

export async function fetchAllJobExpenses(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllJobExpenses, { headers })
  return resp.data.data;
}

export async function fetchJobExpense(jobExpenseId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(`${ApiRoutes.FetchJobExpense}/${jobExpenseId}`, { headers })
  return resp.data.data
}

export async function editJobExpense(jobExpenseId: string, form: any): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.put(`${ApiRoutes.EditJobExpense}/${jobExpenseId}`, form, { headers })
  return resp.data;
}

export async function deleteJobExpense(jobExpenseId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.delete(`${ApiRoutes.DeleteJobExpense}/${jobExpenseId}`, { headers })
  return resp.data;
}









    //#region Head of Tailoring endpoint ---------------------------------

export async function fetchAllTailorJobs(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllTailorJobs, { headers })
  return resp.data.data;
}

export async function fetchTailorJob(tailorJobId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(`${ApiRoutes.FetchTailorJob}/${tailorJobId}`, { headers })
  console.log(resp)
  return resp.data;
}

export async function editTailorJob(tailorJobId: string, formData: any): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.post(`${ApiRoutes.EditTailorJob}/${tailorJobId}`, formData, { headers })
  return resp.data;
}

export async function SendJobToClientManager(tailorJobId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.put(`${ApiRoutes.SendJobToClientManager}/${tailorJobId}`, {}, { headers })
  return resp.data;
}









    //#region Calendar endpoint ---------------------------------

export async function fetchAllDates(payload: string): Promise<any> {
  const headers = await getUserHeaders()
  console.log("Fetching all dates with payload:", payload);
  const resp = await API.get(`${ApiRoutes.FetchAllDates}?${payload}`, { headers })
  console.log("Response from fetchAllDates APICLIENT:", resp.data);
  return resp.data;
}

export async function addCalendarDate(appointmentData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.put(ApiRoutes.AddCalendarDate, appointmentData, { headers });
  console.log("Response from addCalendarDate APICLIENT:", resp.data);
  return resp.data;
}








    //#region Notifications endpoint ---------------------------------
export async function fetchAllNotifications(): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.get(ApiRoutes.FetchAllNotifications, { headers });
  return resp.data.data;
}

export async function readNotification(id: string): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.put(`${ApiRoutes.ReadNotification}/${id}`, {}, { headers }); 
  console.log("Response from readNotification APICLIENT:", resp);
  return resp;
}

export async function readAllNotification(): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.put(ApiRoutes.ReadAllNotifications, {}, { headers }); 
  return resp.data;
}