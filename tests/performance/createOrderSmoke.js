import http from "k6/http";
import { check, sleep } from "k6";

const API_TOKEN = __ENV.API_TOKEN;
const ENDPOINT =
  "https://z072j-235y-nhjq-dot-neptune-cicd.ew.r.appspot.com/api/v1/orders/create";

export let options = {
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(99)<500"],
  },
  scenarios: {
    smoke_test: {
      executor: "constant-vus",
      vus: 3,
      duration: "30s",
    },
  },
};

export default function () {
  let payload = JSON.stringify({
    product_id: 3,
    quantity: 50,
    delivery_date: "2025-03-10",
    price_per_unit: 8.99,
    discount_rate: 0.5,
    note: "Some notes",
  });

  let headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  };

  let response = http.post(ENDPOINT, payload, { headers });

  let success = check(response, {
    "Response status is 201": (r) => r.status === 201,
  });

  if (!success) {
    console.log(`❌ FAILED: Status=${response.status}, Body=${response.body}`);
  }

  sleep(5);
}
