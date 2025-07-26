interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  type?: string
  year?: string
  month?: string
  week?: string
}

interface OrderData {
  customer_name: string
  order_id: string
  clothing_name: string
  first_fitting_date: string
  second_fitting_date: string
  collection_date: string
}

interface DayData {
  date: string
  orders: OrderData[]
  total: number
}

interface MonthData {
  month: string
  first_fitting_count: number
  second_fitting_count: number
  collection_count: number
}

interface AddCalendarDatePayload {
  order_id: string
  collection_date: string
  first_fitting_date: string
  second_fitting_date: string
}

class ApiService {
  private baseUrl = "https://hildam.com/api/v1"

  private getAuthHeaders(): HeadersInit {
    const token = sessionStorage.getItem("authToken")
    if (!token) {
      throw new Error("No authentication token found. Please log in again.")
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please log in again.")
      }
      if (response.status === 403) {
        throw new Error("Access denied. Insufficient permissions.")
      }
      if (response.status === 404) {
        throw new Error("Resource not found.")
      }
      if (response.status >= 500) {
        throw new Error("Server error. Please try again later.")
      }
      throw new Error(`Request failed with status ${response.status}`)
    }

    try {
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error("Invalid response format from server.")
    }
  }

  async getFittingDates(params: { year?: number; month?: string; week?: string }): Promise<
    ApiResponse<DayData[] | MonthData[]>
  > {
    try {
      const searchParams = new URLSearchParams()
      console.log("Fetching fitting dates with params:", searchParams)

      if (params.year) searchParams.append("year", params.year.toString())
      if (params.month) searchParams.append("month", params.month)
      if (params.week) searchParams.append("week", params.week)

      const response = await fetch(`${this.baseUrl}/orders/get-fitting-dates?${searchParams.toString()}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      })

      
      return await this.handleResponse<DayData[] | MonthData[]>(response)
    } catch (error) {
      console.error("Error fetching fitting dates:", error)
      throw error
    }
  }

  async addCalendarDate(payload: AddCalendarDatePayload): Promise<ApiResponse<OrderData>> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/add-calendar-date`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      return await this.handleResponse<OrderData>(response)
    } catch (error) {
      console.error("Error adding calendar date:", error)
      throw error
    }
  }
}

export const apiService = new ApiService()
export type { OrderData, DayData, MonthData, AddCalendarDatePayload }
