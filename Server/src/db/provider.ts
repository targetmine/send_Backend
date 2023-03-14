import { Pool } from 'pg';
import dotenv from 'dotenv';
import { rejects } from 'assert';
import { resolve } from 'path';

dotenv.config();

const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD, 
	port: parseInt(process.env.DB_PORT || '5432'),
	idleTimeoutMillis: 1000 // close idle clients after one second
});

export namespace provider {

	export function query(text: string, params: any[]): Promise<string>{
		
		return new Promise((resolve, reject) =>{
			const start = Date.now();
			pool
				.query(text, params)
				.then( res => {
					const duration = Date.now() - start;
					console.log(`OK: ${text} ${duration} ${res.rowCount}`);
					resolve(`OK: ${text}`);
				})
				.catch(error => {
					console.error(`ERROR: ${text}`);
					reject(`${text}\n${error.message}`);
				});
		});


	}

}
