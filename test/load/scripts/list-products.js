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
  const response = http.post(
    baseUrl,
    JSON.stringify({
      query: `query {
        products(pagination: { limit: 20, offset: 0 }) {
          data { id name price stock }
          pageInfo { limit offset total }
        }
      }`,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  check(response, {
    'status is 200': (result) => result.status === 200,
    'has products data': (result) => result.body.includes('products'),
  });
}
