import type { RequestEvent } from '@sveltejs/kit';

const getBody = (event: RequestEvent) => {
    const { request } = event;
    if (request.body) {
      return request.headers.get('content-type') === 'application/json' ? request.json() : request.text();
    } else {
      return null;
    }
};

export { getBody };
