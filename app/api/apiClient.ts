import axios from 'axios';
import { ApiRoutes } from './apiRoutes';
import { useMsal } from '@azure/msal-react';
import { CreatePageBannerType } from '../../components/models/IPageBannerType';
import { CreateArticleType } from '../../components/models/IArticleType';
import { CorporateCodeType } from '../../components/models/ICorporateCodeType';
import {
  CustomExchangeRateType,
  ExchangeRateType,
} from '../../components/models/IExchangeRateType';
import { IncludedCarrierType } from '../../components/models/IncludedCarrierType';
import { NdcNgnPricing, NgPricing, NgTwoPricing, NdcTwoPricing } from '../../components/Modal/PricingModel';
import { BannerCategoryRequest } from '../../components/models/IBanner';
import { CreateFlightDealRequest } from '../../components/models/IFlightDeals';
import { OfficeRequest } from '../../components/models/IOffice';
import { BookingConfiguration } from '../../components/models/IBookingConfiguration';
import { AirlineRestrictionRequest } from '../../components/models/IAirlineRestriction';
import { AdminUserRequest } from '../../components/models/IAdminUser';

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL,

});

/**
 * API hook to fetch active user
 * @returns The function to fetch active user
 */
export function useFetchActiveUser() {
  // Set the instance and accounts
  const { instance, accounts } = useMsal();

  /**
   * Fetches the active user
   * @returns The active user
   */
  async function fetchActiveUser() {
    // Fetch the authentication result
    const response = await instance.acquireTokenSilent({
      scopes: [
        'openid profile email offline_access api://e96d7ed5-e5f0-4616-a633-e5acb4ed6612/myapi',
      ],
      account: accounts[0],
    });

    // Return response
    return response;
  }

  // Return fetchActiveUser
  return fetchActiveUser;
}

export function useFetchAllOrders() {
  const fetchActiveUser = useFetchActiveUser();

  /**
   * Fetches the price markups
   * @returns Return the AxiosResponse for this request
   */
  async function fetchAllOrders() {
    // Get the active user
    const activeUser = await fetchActiveUser();

    // Fetch the price markups
    let response = await API.get(ApiRoutes.FetchAllOrders, {
      headers: {
        Authorization: `Bearer ${ApiRoutes.AccessToken}`,
      },
    });

    // Return the response
    return response;
  }

  // Return request function
  return useFetchAllOrders;
}
