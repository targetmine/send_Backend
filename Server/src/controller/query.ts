import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD, 
	port: parseInt(process.env.DB_PORT || '5432')
});

export function connectToDB() {
	return pool.connect();
};

export function createTableQuery(query: string){
  return pool.query(query);
  // return new Promise((resolve, reject) => {
  //   pool.query(query, [], (err, result) =>{
  //     if (err)
  //       reject(err);
  //     console.log(`query result: ${result}`);
  //     resolve(true);
  //   });
    //   .catch(function(error){
    //     console.log(`query error: ${error}`);
    //     reject(error);
    //   });
  // });
}