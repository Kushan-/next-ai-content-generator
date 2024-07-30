/** @type { import("drizzle-kit").Config } */
import { aiOutputSchema } from './app/api/pgOperation/schema'
import { POSTGRES_DB_URI } from './utils/envConfig';

console.log('POSTGRES_DB_URI ->', process.env.POSTGRES_DB_URI, POSTGRES_DB_URI)
export default {
  schema: './src/lib/schema.tsx',
  dialect: 'postgresql',
  dbCredentials: {
    url: `${POSTGRES_DB_URI}`,
  }
};