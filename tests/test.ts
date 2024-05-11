import { startServerAndCreateSvelteKitHandler } from '../src/startServerAndCreateSvelteKitHandler';
import { ApolloServer, ApolloServerOptions, BaseContext } from '@apollo/server';
import {
  CreateServerForIntegrationTestsOptions,
  defineIntegrationTestSuite,
} from '@apollo/server-integration-testsuite';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { RequestEvent } from '@sveltejs/kit';

describe('svelteKitHandler', () => {
  defineIntegrationTestSuite(
    async (serverOptions: ApolloServerOptions<BaseContext>, testOptions?: CreateServerForIntegrationTestsOptions) => {
      const server = new ApolloServer(serverOptions);
      const handler = startServerAndCreateSvelteKitHandler(server, testOptions);

      const httpServer = createServer(async (req, res) => {
        const event: RequestEvent = {
          request: req,
          url: new URL(req.url || '/', `http://${req.headers.host}`),
          params: {},
          locals: {},
          platform: {
            env: process.env,
            context: {},
          },
        };

        const response = await handler(event);

        res.statusCode = response.status;
        for (const [key, value] of Object.entries(response.headers)) {
          res.setHeader(key, value);
        }
        res.end(response.body);
      });

      await new Promise<void>(resolve => {
        httpServer.listen({ port: 0 }, resolve);
      });

      const { port } = httpServer.address() as AddressInfo;

      return {
        async extraCleanup() {
          await new Promise<void>(resolve => {
            httpServer.close(() => resolve());
          });
        },
        server,
        url: `http://localhost:${port}`,
      };
    },
    {
      noIncrementalDelivery: true,
      serverIsStartedInBackground: true,
    },
  );
});
