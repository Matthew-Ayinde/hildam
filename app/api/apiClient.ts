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
    'Content-Type': 'application/json',
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

export async function fetchHeadOfTailoringList(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.HeadOfTailoringList, { headers })
  return resp.data;
}











    //#region Inventory endpoint ---------------------------------


export async function fetchInventory(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchInventory, { headers })
  return resp.data.data;
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
