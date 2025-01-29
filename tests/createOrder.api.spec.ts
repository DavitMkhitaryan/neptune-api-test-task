import { test, expect } from "@playwright/test";
import {
  apiToken,
  baseURL,
  deliveryDateNegativeCaseValues,
  discountRateNegativeCaseValues,
  endpoints,
  noteNegativeCaseValues,
  pricePerUnitNegativeCaseValues,
  productIdNegativeCaseValues,
  quantityNegativeCaseValues,
  requiredFields,
} from "../testData/api.data";
import {
  getCurrentOrdersCountCreateOrder,
  validateCreateOrderResponseBody,
} from "../utils/apiHelpers";
import { OrderRequest } from "../types";

test.describe("Create Order Endpoint API Tests", () => {
  let currentTestCaseNumber: number = 1;
  test.beforeAll(async ({ request }) => {
    const response = await request.post(endpoints.reset, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
    expect(response.status()).toEqual(200);
  });
  test(`TC${currentTestCaseNumber} - Sending a create order request with content type “application/x-www-form-urlencoded” and valid request body is successful`, async ({
    request,
  }) => {
    const requestBody = new URLSearchParams();
    requestBody.append("product_id", "1");
    requestBody.append("quantity", "10");
    requestBody.append("delivery_date", "2025-01-30");
    requestBody.append("price_per_unit", "20.5");
    requestBody.append("discount_rate", "0.15");
    requestBody.append("note", "Priority Delivery");

    const response = await request.post(endpoints.createOrder, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: requestBody.toString(),
    });

    expect(response.status()).toEqual(201);
  });
  currentTestCaseNumber++;

  test(`TC${currentTestCaseNumber} - Creating order with only required request body properties and valid values is successful and returns valid response body`, async ({
    request,
  }) => {
    const requestBody: OrderRequest = {
      product_id: 1,
      quantity: 20,
      delivery_date: "2025-01-30",
      price_per_unit: 10.5,
    };

    const orderCountBefore = await getCurrentOrdersCountCreateOrder({
      request,
    });

    const response = await request.post(endpoints.createOrder, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      data: requestBody,
    });

    expect(response.status()).toEqual(201);
    const responseBody = await response.json();
    validateCreateOrderResponseBody({
      requestBody,
      responseBody,
      currentOrderCount: orderCountBefore + 1,
    });
  });
  currentTestCaseNumber++;
  test(`TC${currentTestCaseNumber} - Creating order with all required and optional request body properties and valid values is successful and returns valid response body`, async ({
    request,
  }) => {
    const requestBody: OrderRequest = {
      product_id: 2,
      quantity: 15,
      delivery_date: "2025-01-30",
      price_per_unit: 5.9,
      discount_rate: 0.51,
      note: "Some notes",
    };

    const orderCountBefore = await getCurrentOrdersCountCreateOrder({
      request,
    });

    const response = await request.post(endpoints.createOrder, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      data: requestBody,
    });

    expect(response.status()).toEqual(201);
    const responseBody = await response.json();
    validateCreateOrderResponseBody({
      requestBody,
      responseBody,
      currentOrderCount: orderCountBefore + 1,
    });
  });
  currentTestCaseNumber++;

  for (let requiredProperty of requiredFields) {
    test(`TC${currentTestCaseNumber} - Creating order with missing “${requiredProperty}" required request body property returns 400 error`, async ({
      request,
    }) => {
      let requestBody: Partial<OrderRequest> = {
        product_id: 2,
        quantity: 15,
        delivery_date: "2025-01-30",
        price_per_unit: 5.9,
        discount_rate: 0.51,
        note: "Some notes",
      };

      delete requestBody[`${requiredProperty}`];

      const response = await request.post(endpoints.createOrder, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      expect(response.status()).toEqual(400);
    });
    currentTestCaseNumber++;
  }

  test.describe("Product Id Property Checks", () => {
    for (let value of productIdNegativeCaseValues) {
      test(`TC${currentTestCaseNumber} - Sending create order request with “product_id” value being ${value} returns 400 error`, async ({
        request,
      }) => {
        let requestBody = {
          product_id: value,
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

        expect(response.status()).toEqual(400);
      });
      currentTestCaseNumber++;
    }

    test(`TC${currentTestCaseNumber} - Sending create order request with “product_id” value being 16 returns 201 and and corresponding response body value is matching`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
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

      expect(response.status()).toEqual(201);
      const responseBody = await response.json();
      const orderDetails = responseBody.order_details;
      expect.soft(orderDetails).toHaveProperty("product_id");
      expect.soft(orderDetails.product_id).toEqual(requestBody.product_id);
    });
    currentTestCaseNumber++;
  });

  test.describe("Quantity Property Checks", () => {
    for (let value of quantityNegativeCaseValues) {
      test(`TC${currentTestCaseNumber} - Sending create order request with “quantity” value being ${value} returns 400 error`, async ({
        request,
      }) => {
        let requestBody = {
          product_id: 1,
          quantity: value,
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

        expect(response.status()).toEqual(400);
      });
      currentTestCaseNumber++;
    }

    test(`TC${currentTestCaseNumber} - Sending create order request with “quantity” value being 1 returns 201 and corresponding response body value is matching`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
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

      expect(response.status()).toEqual(201);
      const responseBody = await response.json();
      const orderDetails = responseBody.order_details;
      expect.soft(orderDetails).toHaveProperty("quantity");
      expect.soft(orderDetails.quantity).toEqual(requestBody.quantity);
    });
    currentTestCaseNumber++;

    test(`TC${currentTestCaseNumber} - Sending create order request with “quantity” value being 1000000000 returns 201 and corresponding response body value is matching`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
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

      expect(response.status()).toEqual(201);
      const responseBody = await response.json();
      const orderDetails = responseBody.order_details;
      expect.soft(orderDetails).toHaveProperty("quantity");
      expect.soft(orderDetails.quantity).toEqual(requestBody.quantity);
    });
    currentTestCaseNumber++;
  });

  test.describe("Delivery Date Property Checks", () => {
    for (let value of deliveryDateNegativeCaseValues) {
      test(`TC${currentTestCaseNumber} - Sending create order request with “delivery_date” value being ${value} returns 400 error`, async ({
        request,
      }) => {
        let requestBody = {
          product_id: 1,
          quantity: 10,
          delivery_date: value,
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

        expect(response.status()).toEqual(400);
      });
      currentTestCaseNumber++;
    }

    test(`TC${currentTestCaseNumber} - Sending create order request with “delivery_date” value being "2025-01-30" returns 201 and corresponding response body value is matching`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
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

      expect(response.status()).toEqual(201);
      const responseBody = await response.json();
      const orderDetails = responseBody.order_details;
      expect.soft(orderDetails).toHaveProperty("delivery_date");
      expect
        .soft(orderDetails.delivery_date)
        .toEqual(requestBody.delivery_date);
    });
    currentTestCaseNumber++;
  });

  test.describe("Price Per Unit Property Checks", () => {
    for (let value of pricePerUnitNegativeCaseValues) {
      test(`TC${currentTestCaseNumber} - Sending create order request with “price_per_unit” value being ${value} returns 400 error`, async ({
        request,
      }) => {
        let requestBody = {
          product_id: 1,
          quantity: 10,
          delivery_date: "2025-01-30",
          price_per_unit: value,
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

        expect(response.status()).toEqual(400);
      });
      currentTestCaseNumber++;
    }

    test(`TC${currentTestCaseNumber} - Sending create order request with “price_per_unit” value being 0.01 returns 201 and corresponding response body value is matching`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
        quantity: 15,
        delivery_date: "2025-01-30",
        price_per_unit: 0.01,
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

      expect(response.status()).toEqual(201);
      const responseBody = await response.json();
      const orderDetails = responseBody.order_details;
      expect.soft(orderDetails).toHaveProperty("price_per_unit");
      expect
        .soft(orderDetails.price_per_unit)
        .toEqual(requestBody.price_per_unit);
    });
    currentTestCaseNumber++;
  });

  test.describe("Discount Rate Property Checks", () => {
    for (let value of discountRateNegativeCaseValues) {
      test(`TC${currentTestCaseNumber} - Sending create order request with “discount_rate” value being ${value} returns 400 error`, async ({
        request,
      }) => {
        let requestBody = {
          product_id: 1,
          quantity: 10,
          delivery_date: "2025-01-30",
          price_per_unit: 1,
          discount_rate: value,
          note: "Some notes",
        };

        const response = await request.post(endpoints.createOrder, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          data: requestBody,
        });

        expect(response.status()).toEqual(400);
      });
      currentTestCaseNumber++;
    }

    test(`TC${currentTestCaseNumber} - Sending create order request with “discount_rate” value being 0 returns 201 and corresponding response body value is matching`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
        quantity: 15,
        delivery_date: "2025-01-30",
        price_per_unit: 0.01,
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

      expect(response.status()).toEqual(201);
      const responseBody = await response.json();
      const orderDetails = responseBody.order_details;
      expect.soft(orderDetails).toHaveProperty("discount_applied");
      expect
        .soft(orderDetails.discount_applied)
        .toEqual(requestBody.discount_rate);
    });
    currentTestCaseNumber++;

    test(`TC${currentTestCaseNumber} - Sending create order request with “discount_rate” value being 1 returns 201 and corresponding response body value is matching`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
        quantity: 15,
        delivery_date: "2025-01-30",
        price_per_unit: 0.01,
        discount_rate: 1,
        note: "Some notes",
      };

      const response = await request.post(endpoints.createOrder, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      expect(response.status()).toEqual(201);
      const responseBody = await response.json();
      const orderDetails = responseBody.order_details;
      expect.soft(orderDetails).toHaveProperty("discount_applied");
      expect
        .soft(orderDetails.discount_applied)
        .toEqual(requestBody.discount_rate);
    });
    currentTestCaseNumber++;

    test(`TC${currentTestCaseNumber} - Sending create order request with “discount_rate” value being 0.55 returns 201 and corresponding response body value is matching`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
        quantity: 15,
        delivery_date: "2025-01-30",
        price_per_unit: 0.01,
        discount_rate: 0.55,
        note: "Some notes",
      };

      const response = await request.post(endpoints.createOrder, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      expect(response.status()).toEqual(201);
      const responseBody = await response.json();
      const orderDetails = responseBody.order_details;
      expect.soft(orderDetails).toHaveProperty("discount_applied");
      expect
        .soft(orderDetails.discount_applied)
        .toEqual(requestBody.discount_rate);
    });
    currentTestCaseNumber++;
  });

  test.describe("Note Property Checks", () => {
    for (let value of noteNegativeCaseValues) {
      test(`TC${currentTestCaseNumber} - Sending create order request with “note” value being ${value} returns 400 error`, async ({
        request,
      }) => {
        let requestBody = {
          product_id: 1,
          quantity: 10,
          delivery_date: "2025-01-30",
          price_per_unit: 1,
          discount_rate: 0.1,
          note: value,
        };

        const response = await request.post(endpoints.createOrder, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          data: requestBody,
        });

        expect(response.status()).toEqual(400);
      });
      currentTestCaseNumber++;
    }

    test(`TC${currentTestCaseNumber} - Sending create order request with “note” value being "Some notes" returns 201`, async ({
      request,
    }) => {
      let requestBody = {
        product_id: 16,
        quantity: 15,
        delivery_date: "2025-01-30",
        price_per_unit: 0.01,
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

      expect(response.status()).toEqual(201);
    });
    currentTestCaseNumber++;
  });

  test(`TC${currentTestCaseNumber} - Sending create order request with extra invalid property returns 400 error`, async ({
    request,
  }) => {
    const requestBody = {
      product_id: 2,
      quantity: 15,
      delivery_date: "2025-01-30",
      price_per_unit: 5.9,
      discount_rate: 0.51,
      note: "Some notes",
      invalidPropert: "Some Value",
    };

    const response = await request.post(endpoints.createOrder, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      data: requestBody,
    });

    expect(response.status()).toEqual(400);
  });
  currentTestCaseNumber++;

  test(`TC${currentTestCaseNumber} - Sending create order request with no “Authorization” header returns 401 error`, async ({
    request,
  }) => {
    const requestBody = {
      product_id: 2,
      quantity: 15,
      delivery_date: "2025-01-30",
      price_per_unit: 5.9,
      discount_rate: 0.51,
      note: "Some notes",
      invalidPropert: "Some Value",
    };

    const response = await request.post(endpoints.createOrder, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      data: requestBody,
    });

    expect(response.status()).toEqual(401);
  });
  currentTestCaseNumber++;

  test(`TC${currentTestCaseNumber} - Sending create order request with invalid “Authorization” bearer token returns 401 error`, async ({
    request,
  }) => {
    const requestBody = {
      product_id: 2,
      quantity: 15,
      delivery_date: "2025-01-30",
      price_per_unit: 5.9,
      discount_rate: 0.51,
      note: "Some notes",
      invalidPropert: "Some Value",
    };

    const response = await request.post(endpoints.createOrder, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      data: requestBody,
    });

    expect(response.status()).toEqual(401);
  });
  currentTestCaseNumber++;
});
