import type { RequestEvent } from '@sveltejs/kit';

const getBody = async (event: RequestEvent) => {
  const { request } = event;
  return request.headers.get('content-type') === 'application/json' ? request.json() : request.text();
};

export { getBody };
