import dotenv from "dotenv";
import { OrderRequest } from "../types";
import { APIRequestContext, expect } from "@playwright/test";
import { apiToken, endpoints } from "../testData/api.data";
dotenv.config();

export const getApiToken = (): string => {
  const token = process.env.API_TOKEN;
  if (token == undefined) {
    throw new Error("API_TOKEN environment variable not set");
  }
  return token;
};

export const validateCreateOrderResponseBody = ({
  requestBody,
  responseBody,
  currentOrderCount,
}: {
  requestBody: OrderRequest;
  responseBody: any;
  currentOrderCount: number;
}) => {
  expect.soft(responseBody).toHaveProperty("current_orders");
  expect.soft(responseBody.current_orders).toEqual(currentOrderCount);
  expect.soft(responseBody).toHaveProperty("order_details");
  const orderDetails = responseBody.order_details;
  // Confirmation Code
  expect.soft(orderDetails).toHaveProperty("confirmation_code");
  expect.soft(typeof orderDetails.confirmation_code).toBe("string");
  expect.soft(orderDetails.confirmation_code).not.toEqual("");
  // Delivery Date
  expect.soft(orderDetails).toHaveProperty("delivery_date");
  expect.soft(orderDetails.delivery_date).toEqual(requestBody.delivery_date);
  // Discount Applied
  expect.soft(orderDetails).toHaveProperty("discount_applied");
  if (requestBody.discount_rate !== undefined) {
    expect
      .soft(orderDetails.discount_applied)
      .toEqual(requestBody.discount_rate);
  } else {
    expect.soft(orderDetails.discount_applied).toEqual(0);
  }
  // Order Id
  expect.soft(orderDetails).toHaveProperty("order_id");
  expect.soft(typeof orderDetails.order_id).toBe("string");
  expect.soft(orderDetails.order_id).not.toEqual("");
  // Price Per Unit
  expect.soft(orderDetails).toHaveProperty("price_per_unit");
  expect.soft(orderDetails.price_per_unit).toEqual(requestBody.price_per_unit);
  // Product Id
  expect.soft(orderDetails).toHaveProperty("product_id");
  expect.soft(orderDetails.product_id).toEqual(requestBody.product_id);
  // Quantity
  expect.soft(orderDetails).toHaveProperty("quantity");
  expect.soft(orderDetails.quantity).toEqual(requestBody.quantity);
  // Total Amount
  expect.soft(orderDetails).toHaveProperty("total_amount");
  expect.soft(orderDetails.total_amount).toBeGreaterThanOrEqual(0.01);
};

// This is a workaround for getting the orders count, since we do not have access to other methods,
// the function calls create order and gets the orders count from the response body
export const getCurrentOrdersCountCreateOrder = async ({
  request,
}: {
  request: APIRequestContext;
}): Promise<number> => {
  const requestBody: OrderRequest = {
    product_id: 2,
    quantity: 15,
    delivery_date: "2025-01-30",
    price_per_unit: 5.9,
    discount_rate: 0.51,
    note: "Some notes",
  };
  const response = await request.post(endpoints.createOrder, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    data: requestBody,
  });
  const responseBody = await response.json();
  const ordersCount = responseBody.current_orders;
  return ordersCount;
};
