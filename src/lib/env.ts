import {z} from "zod";
import {createEnv} from "@t3-oss/env-nextjs";

export const env = createEnv ({
    server: {
        DATABASE_URL: z.string().min(1),
        APP_URL: z.string().min(1),
        R2_ACCOUNT_ID: z.string().min(1),
       R2_ACCESS_KEY_ID: z.string().min(1),
       R2_SECRET_ACCESS_KEY: z.string().min(1),
       R2_BUCKET_NAME: z.string().min(1),
       CHATTERBOX_API_KEY: z.string().min(1),
       CHATTERBOX_API_URL: z.url(),
    },
    runtimeEnv:{
        DATABASE_URL: process.env.DATABASE_URL,
        APP_URL: process.env.APP_URL,
        R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
        R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
        CHATTERBOX_API_KEY: process.env.CHATTERBOX_API_KEY,
        CHATTERBOX_API_URL: process.env.CHATTERBOX_API_URL,

    },
    skipValidation : !!process.env.SKIP_ENV_VALIDATION, 
});
