import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
  },
};

const baseUrl = __ENV.BASE_URL ?? 'http://localhost:3000/graphql';

export default function () {
  const idempotencyKey = `load-test-order-${__VU}-${__ITER}`;
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
      variables: { idempotencyKey },
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(response, {
    'status is 200': (result) => result.status === 200,
    'order confirmed or expected business error': (result) =>
      result.body.includes('CONFIRMED') || result.body.includes('INSUFFICIENT_STOCK'),
  });
}
