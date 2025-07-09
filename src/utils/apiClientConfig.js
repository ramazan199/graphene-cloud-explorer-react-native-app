import { getApiConfig } from '../config/environment';

export const API_SERVICES = {
  CLOUD: 'cloud',
  PAYMENT: 'payment'
};

const apiConfig = getApiConfig();

export const SERVICE_CONFIG = {
  [API_SERVICES.CLOUD]: {
    baseURL: apiConfig.CLOUD
  },
  [API_SERVICES.PAYMENT]: {
    baseURL: apiConfig.PAYMENT
  }
}; 