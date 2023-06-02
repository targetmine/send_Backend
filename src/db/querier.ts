import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'node:fs/promises';

dotenv.config();

const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD, 
	port: parseInt(process.env.DB_PORT || '5432'),
	idleTimeoutMillis: 1000 // close idle clients after one second
});

export namespace querier {

	export function getModel(): Promise<any>{
		return fs.readFile('model.json');
	}

	export function getElement(name: string, attributes?: string[], rows?: number): Promise<any>{
		return new Promise(async(resolve, reject) => {
			const client = await pool.connect();
			try{
				const atts = attributes? attributes.join(',') : '*';
				
				let text = `SELECT ${atts} `+
					`FROM ${name} `;
				text += rows ? `LIMIT ${rows};` : ';';
				
				const result = await client.query(text, []);
				resolve(result.rows);
			} catch (e) {
				reject('problem');
			} finally {
				client.release();
			}
		});
	}

}