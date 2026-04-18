import { initTRPC,TRPCError } from '@trpc/server';
import { cache } from 'react';
import { auth } from '@clerk/nextjs/server';
import superjson from 'superjson';
import  * as Sentry from "@sentry/node";
 
export const createTRPCContext = cache(async () => {
    return{};
})
 
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
   transformer: superjson,
});

const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({
        attachRpcInput : true
  }),
);
 
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(sentryMiddleware);

export const authProcedure = baseProcedure.use(async({next})=>{
  const {userId,orgId} = await auth();

  if(!userId){
    throw new TRPCError({code:'UNAUTHORIZED'})
  }

    return next({
        ctx:{userId},
    });
});

export const orgProcedure = baseProcedure.use(async({next})=>{
  const {userId,orgId} = await auth();

  if(!userId){
    throw new TRPCError({code:'UNAUTHORIZED'})
  }
  if(!orgId){
    throw new TRPCError({code:'FORBIDDEN',message:'User does not belong to an organization'})
  }

    return next({
        ctx:{userId,orgId},
    });
});