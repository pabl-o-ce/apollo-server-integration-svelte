import { ApolloServer, BaseContext, ContextFunction } from '@apollo/server';
import type { RequestEvent } from '@sveltejs/kit';
import { parse } from 'url';
import { getBody } from './lib/getBody';
import { getHeaders } from './lib/getHeaders';
import { isSvelteApiRequest } from './lib/isServerSideRequest';

interface Options<Context extends BaseContext> {
  context?: ContextFunction<[RequestEvent], Context>;
}

const defaultContext: ContextFunction<[], any> = async () => ({});

function startServerAndCreateSvelteKitHandler<Context extends BaseContext = object>(
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
        method: request.method,
        search: parse(request.url).search || '',
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

    if (isSvelteApiRequest(event)) {
      return new Response(body.join(''), {
        headers,
        status: httpGraphQLResponse.status || 200,
      });
    } else {
      return {
        status: httpGraphQLResponse.status || 200,
        headers,
        body: body.join(''),
      };
    }
  }

  return handler;
}

export { startServerAndCreateSvelteKitHandler };
