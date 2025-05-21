// src/config.mjs
import dotenv from 'dotenv';

dotenv.config();

export default {
  current: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  development: {
    type: 'development',
    port: Number(process.env.DEV_PORT) || 3000,
    mongodb: process.env.DEV_MONGODB_URI
  },

  production: {
    type: 'production',
    port: Number(process.env.PROD_PORT) || 3000,
    mongodb: process.env.PROD_MONGODB_URI
  }
};
