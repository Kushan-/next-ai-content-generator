//'use server'
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { POSTGRES_DB_URI, POSTGRES_DB_NAME } from '../../utils/envConfig';


// console.log("postgres->", process.env.POSTGRES_DB_URI, POSTGRES_DB_URI)
const sql = neon(`${POSTGRES_DB_URI}`);
export const db = drizzle(sql,{schema});
