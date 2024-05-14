import type { RequestEvent } from '@sveltejs/kit';

const isSvelteApiRequest = (event: RequestEvent): boolean => {
  return event.url.pathname.startsWith('/api');
};

export { isSvelteApiRequest };
