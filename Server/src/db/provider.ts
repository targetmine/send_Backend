import { Pool } from 'pg';
import dotenv from 'dotenv';

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

	export function createTables(tables: any[]): Promise<string>{
		const start = Date.now();
		let count = 0;
		return new Promise( async (resolve, reject) =>{
			const client = await pool.connect();
			try{
				await client.query('BEGIN');
				for (const table of tables){
					const text =`CREATE TABLE ${table.name} (`+
						`${table.columns.join()}, `+
						`PRIMARY KEY (${table.primaryKeys.join()})`+
						`);`
					
					const result = await client.query(text, []);
					count += result.rowCount;
				}
				await client.query('COMMIT');
				resolve(`OK - Create tables; Row count: ${count}`);
			 } catch(e) {
				await client.query('ROLLBACK');
				reject(e);
			 } finally {
				client.release();
			 }


		});
	}
	
	// let queries: Promise<string>[] = [];
	// for (const ele of eles){
	// 	let text = `CREATE TABLE ${ele.name} (`;
	// 	ele.attributes.forEach((att: Attribute, idx: number) => { 
	// 		if(idx !== 0) 
	// 			text += ', ' 
	// 		text += `${att.name} ${att.type}` ;
	// 	});
	// 	text += `);`;
	// 	queries.push(provider.query(text,[]));
	// }
		// 		}
			
				
		// 		const result = await client.query(text, params);
				
		// 		const duration = Date.now() - start;
		// 		console.log(`OK: ${text} ${duration} ${res.rowCount}`);
		// 		resolve(`OK: ${text}`);
				
		// 	} catch(error) {
		// 			console.error(`ERROR: ${text}`);
		// 			reject(`${text}\n${error.message}`);
		// 		});
		

	
	export function insertTransaction(table: string, columns: string[], data: any[]): Promise<string>{
		const start = Date.now();
		let count: number = 0;
		return new Promise(async (resolve, reject) =>{
			const client = await pool.connect();
			try{
				await client.query('BEGIN');
				const cols = columns.join();
				for (const d of data){
					const values = d.join();
					const text = `INSERT INTO ${table} (${cols}) VALUES (${values});`
					console.log(text);
				
					const result = await client.query(text, []);
					count += result.rowCount;
				}
				await client.query('COMMIT');
				resolve(`OK - Insert into ${table}; Row count: ${count}`);
			} catch(e){
				await client.query('ROLLBACK');
				reject(e);
			} finally {
				client.release();
			}

		});
	}

}
