import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';
import { authRouter } from './routers/auth';
import { mailboxRouter } from './routers/mailbox';
import { mailRouter } from './routers/mail';
import { packageRouter } from './routers/package';
import { userRouter } from './routers/user';
import cors from 'cors';

const appRouter = router({
  auth: authRouter,
  mailbox: mailboxRouter,
  mail: mailRouter,
  package: packageRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
});

const port = 3000;
server.listen(port);
console.log(`Server listening on port ${port}`);