import { getApiToken } from "../utils/apiHelpers";

export const baseURL =
  "https://z072j-235y-nhjq-dot-neptune-cicd.ew.r.appspot.com";

export const endpoints = {
  createOrder: `${baseURL}/api/v1/orders/create`,
  reset: `${baseURL}/api/v1/reset`,
};

export const apiToken = getApiToken();

export const requiredFields = [
  "price_per_unit",
  "delivery_date",
  "quantity",
  "product_id",
];

export const productIdNegativeCaseValues = [null, false, "hello", "10", 10.5];
export const quantityNegativeCaseValues = [null, false, "hello", "10", 10.5, -1, 0];
export const deliveryDateNegativeCaseValues = [
  null,
  false,
  "hello",
  10,
  "2025-01-98",
  "2025",
  "2025-01",
  "2025-01-30T12:00:00Z",
];
export const pricePerUnitNegativeCaseValues = [null, true, "hello", "0.01", 0.009];
export const discountRateNegativeCaseValues = [null, true, "hello", "0.5", -0.01, 1.01]
export const noteNegativeCaseValues = [null, false, 105]
