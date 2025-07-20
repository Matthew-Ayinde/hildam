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


export async function fetchAllCustomers(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllCustomers, { headers })
  console.log(resp.data.data)
  return resp.data.data;
}

export async function createCustomer(formData: any): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.post(ApiRoutes.AddCustomer, {formData}, { headers });
  console.log(resp);
  return resp;
}

export async function deleteCustomer(payload: string): Promise<any> {
  const headers = await getUserHeaders();
  const resp = await API.delete(`${ApiRoutes.DeleteCustomer}/${payload}`, { headers });
  console.log(resp);
  return resp;
}


export async function fetchOrderslist(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchAllOrders, { headers })
  return resp.data.data;
}

export async function deleteOrder(orderId: string): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.delete(`${ApiRoutes.DeleteOrder}/${orderId}`, { headers })
  console.log("Delete response:", resp)
  return resp;
}

export async function fetchInventory(): Promise<any> {
  const headers = await getUserHeaders()
  const resp = await API.get(ApiRoutes.FetchInventory, { headers })
  return resp.data.data;
}