import { ApolloServer } from '@apollo/server';
import type { BaseContext, ContextFunction } from '@apollo/server';
import type { RequestEvent } from '@sveltejs/kit';
import { getBody } from './getBody.js';
import { getHeaders } from './getHeaders.js';

interface Options<Context extends BaseContext> {
  context?: ContextFunction<[RequestEvent], Context>;
}

const defaultContext: ContextFunction<[], any> = async () => ({});

export type RequestHandler = (event: RequestEvent) => Promise<Response>;

export function startServerAndCreateSvelteKitHandler<Context extends BaseContext = object>(
  server: ApolloServer<Context>,
  options?: Options<Context>
) {
  
  server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();

  const contextFunction = options?.context || defaultContext;

  async function handler(event: RequestEvent) {
    const { request } = event;

    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      context: () => contextFunction(event),
      httpGraphQLRequest: {
        body: await getBody(event),
        headers: getHeaders(event),
        method: request.method || 'POST',
        search: request.url ? new URL(request.url).search || '' : '',
      },
    });

    const body = [];
    if (httpGraphQLResponse.body.kind === 'complete') {
      body.push(httpGraphQLResponse.body.string);
    } else {
      for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
        body.push(chunk);
      }
    }

    const headers: Record<string, string> = {};
    for (const [key, value] of httpGraphQLResponse.headers) {
      headers[key] = value;
    }

    return new Response(body.join(''), {
        headers,
        status: httpGraphQLResponse.status || 200,
    });
  }

  return handler;
}
