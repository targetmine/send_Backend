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

	export async function query(text: string, params: any[]){
		const start = Date.now();
		try{
			const res = await pool.query(text, params);
			const duration = Date.now() - start;
			console.log(`query executed ${text} ${duration} ${res.rowCount}`);
			return res;
		} catch (e: any){
			throw new Error(`Error running query ${text}\n${e.message}`);
		}

	}

	export async function createTable(tableName: string, columns: any[]){
	// export function createTables(elements: Element[], relations: Relation[]) {
		let text = `CREATE TABLE ${tableName} ( `;
// 		columns.forEach((att: Attribute, idx: number) => { 
// 			if(idx !== 0) text += ', ' 
// 			text += `${att.name} ${att.type}` ;
// 		});
// 	text += `);`;

// 	const start = Date.now();
// 	const res = await pool.query(text);
// 	const duration = Date.now() - start;
// 	console.log(`query executed ${text} ${duration} ${res.rowCount}`);	
// 	return res;
}

}
