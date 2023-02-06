import { Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';

import dotenv from 'dotenv';

dotenv.config();

export interface Attribute{
	name: string;
	type: 'varchar(40)' | 'text' | 'integer' | 'double precision';
	unique: boolean;
}

export interface Element{
	name: string;
	attributes: Attribute[];
}

export interface Relation{
	name: string;
	srcElement: string;
	srcAttribute: string;
	trgElement: string;
	trgAttribute: string;
	cardinality: 'one to one' | 'one to many' | 'many to one' | 'many to many';
}

const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD, 
	port: parseInt(process.env.DB_PORT || "5432")
});

export function connectToDB(req: Request, res: Response) {
	pool.connect()
		.then(()=>{
			res.send('connected');
		})
		.catch(error =>{
			console.log(error);
		});
};

/* use this for RESTFul request (i.e. params in the web address) */
export function createRESTTable(req: Request, res: Response) {
	console.log('restTable', req.params);
	const name: string = req.params.name;
	 pool.query(`create table ${name} (id int);`,[], (err: Error, result: QueryResult<any>) => {
		if(err){ throw err; }
		res
			.status(200)
			.send('finished');
	});
};
