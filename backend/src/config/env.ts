import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: Number(process.env.PORT ?? 3000),
  TVMAZE_BASE_URL: process.env.TVMAZE_BASE_URL ?? "https://api.tvmaze.com",
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

export default env;
