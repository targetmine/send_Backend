import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'node:fs/promises';

dotenv.config();

// const pool = new Pool({
// 	host: process.env.DB_HOST,
// 	user: process.env.DB_USER,
// 	database: process.env.DB_NAME,
// 	password: process.env.DB_PASSWORD, 
// 	port: parseInt(process.env.DB_PORT || '5432'),
// 	idleTimeoutMillis: 1000 // close idle clients after one second
// });

const connectionString = 'postgresql://postgres:example@datasharing_db:5433/postgres';
const pool = new Pool({
	connectionString
});

export namespace provider {

	// save the provided model as a JSON structured file in the database
	export function saveModel(model:any): Promise<string>{
		const result: Promise<string> = new Promise(async(resolve, reject) => {
			try{
				const eles = JSON.stringify(model.elements);
				const rels = JSON.stringify(model.relations);
				const mod = `{\n\t"elements": ${eles},\n\t"relations": ${rels}\n}`;
				await fs.writeFile(`${process.env.DATA_FOLDER}/model.json`, mod);
				resolve('Writing MODEL OK;');
			} catch(e: any){
				const msg =(`Writing MODEL FAILED;`);
				console.log(msg);
				reject(msg);
			}
		});
		return result;
	}

	// create a single table in the database
	export async function createTable(table: any): Promise<string>{
		const result: Promise<string> = new Promise(async(resolve, reject) => {
			try{
			
				console.log(pool);
				const client = await pool.connect();
				try{
					const text =`CREATE TABLE ${table.name} (`+
						`${table.columns.join()}, `+
						`PRIMARY KEY (${table.primaryKeys.join()})`+
						`);`
					await client.query(text, []);
					const msg = (`Create ${table.name} OK;`);
					console.log(msg)
					resolve(msg);
				} catch(e: any) {
					const msg = (`Create ${table.name} FAILED;`);
					console.log(msg)
					reject(msg);
				} finally {
					client.release();
				}
			} catch(e: any) {
				const msg = `Create ${table.name} unable to connect to DB;`;
				// console.log(msg);
				reject({msg: msg});
			}
			
		});
		return result;
	}

	export function addColumn(table: string, columns: any[]): Promise<string>{
		const result: Promise<string> = new Promise(async(resolve, reject) => {
			const client = await pool.connect();
			try{
				await client.query('BEGIN'); // handle the addition of columns as transaction
				let text = `ALTER TABLE ${table}\n`;
				let i = 1;
				for (const c of columns){
					text += `ADD COLUMN ${c.name} ${c.type}`; // for each column
					text += i < columns.length ? `,\n` : `;`;
					i += 1;
				}
				const result = await client.query(text, []);
				await client.query('COMMIT');
				const msg = `ALTER TABLE ${table} OK;`;
				console.log(msg);
				resolve(msg)
			} catch(e: any) {
				// if there was any problem, rollback and reject with the error msg
				await client.query('ROLLBACK'); 
				const msg = `ALTER TABLE ${table} FAILED;`;
				console.log(msg);
				reject(msg);
			} finally {
				client.release();
			}
		});
		return result;
	}
	
	export function insertTransaction(
		table: string, 
		primaryKeys: string[], 
		columns: string[], 
		data: any[]
	): Promise<string>{
		const start = Date.now();
		let count: number = 0;
		return new Promise(async (resolve, reject) =>{
			const client = await pool.connect();
			try{
				await client.query('BEGIN');
				const k = primaryKeys.join();
				const cols = columns.join();
				for (const d of data){
					const values = d.join();
					let text = `INSERT INTO ${table} (${cols}) `+
					`VALUES (${values}) `+
					`ON CONFLICT (${k}) DO UPDATE SET `+
					columns.map((c) => `${c} = excluded.${c}`).join()+
					`;`;			
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
