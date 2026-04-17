import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { voicesRouter } from './voices';
import { generateKey } from 'crypto';
import { generationRouter } from './genrerations';
 
export const appRouter = createTRPCRouter({
 voices: voicesRouter,
 generations : generationRouter,
 })
// export type definition of API
export type AppRouter = typeof appRouter;