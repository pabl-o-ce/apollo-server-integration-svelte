import type { RequestEvent } from '@sveltejs/kit';

const isServerSideRequest = (event: RequestEvent): boolean => {
  return event.url.pathname.startsWith('/graphql');
};

export { isServerSideRequest };
