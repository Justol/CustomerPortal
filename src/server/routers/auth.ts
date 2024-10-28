import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { generateId } from 'lucia';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = generateId(15);

      try {
        const user = await ctx.auth.createUser({
          userId,
          key: {
            providerId: "email",
            providerUserId: input.email,
            password: input.password
          },
          attributes: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            role: "CUSTOMER"
          }
        });

        const session = await ctx.auth.createSession({
          userId: user.userId,
          attributes: {}
        });

        return session;
      } catch (e) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already in use',
        });
      }
    }),

  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const key = await ctx.auth.useKey(
          "email",
          input.email,
          input.password
        );
        const session = await ctx.auth.createSession({
          userId: key.userId,
          attributes: {}
        });
        return session;
      } catch (e) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        });
      }
    }),

  signOut: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.auth.invalidateSession(ctx.session.sessionId);
      return { success: true };
    }),

  me: protectedProcedure
    .query(({ ctx }) => {
      return ctx.user;
    }),
});