import { auth } from './lucia';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';

export async function createContext({ req, res }: CreateHTTPContextOptions) {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();
  
  return {
    auth,
    session,
    user: session?.user
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;