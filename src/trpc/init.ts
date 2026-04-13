import { initTRPC,TRPCError } from '@trpc/server';
import { cache } from 'react';
import { auth } from '@clerk/nextjs/server';
import superjson from 'superjson';
 
export const createTRPCContext = cache(async () => {
    return{};
})
 
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
   transformer: superjson,
});
 
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const authProcedure = t.procedure.use(async({next})=>{
  const {userId,orgId} = await auth();

  if(!userId){
    throw new TRPCError({code:'UNAUTHORIZED'})
  }

    return next({
        ctx:{userId},
    });
});

export const orgProcedure = t.procedure.use(async({next})=>{
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