import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  JWT_SECRET_KEY: z.string().min(1),
  JWT_EXPIRE_TIME: z.union([z.string(), z.number()]),
});

export const ENV = envSchema.parse(process.env);
