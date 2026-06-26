import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 20,
  iterations: 20,
  thresholds: {
    http_req_failed: ['rate<0.10'],
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
  },
};

const baseUrl = __ENV.BASE_URL ?? 'http://localhost:3000/graphql';

export default function () {
  const response = http.post(
    baseUrl,
    JSON.stringify({
      query: `mutation CreateOrder($idempotencyKey: String!) {
        createOrder(input: {
          userId: "1",
          idempotencyKey: $idempotencyKey,
          items: [{ productId: "1", quantity: 1 }]
        }) {
          id
          status
          total
        }
      }`,
      variables: { idempotencyKey: `concurrent-order-${__VU}-${__ITER}` },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(response, {
    'status is 200': (result) => result.status === 200,
    'controlled result': (result) =>
      result.body.includes('CONFIRMED') || result.body.includes('INSUFFICIENT_STOCK'),
  });
}
