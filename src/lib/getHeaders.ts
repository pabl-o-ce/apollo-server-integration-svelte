import { HeaderMap } from '@apollo/server';
import type { RequestEvent } from '@sveltejs/kit';

const getHeaders = (event: RequestEvent) => {
  const { request } = event;
  const headers = new HeaderMap();

  request.headers.forEach((value, key) => {
    headers.set(key, value);
  });

  return headers;
};

export { getHeaders };
