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

import { Request, Response } from 'express';
import { createTables, runContainer } from './docker';
import { connectToDB } from './query';

export function createContainer(req: Request, res: Response) {
	let eles = req.body[0];
	let rels = req.body[1];
	runContainer()
		.then((data)=>{
			console.log(`Container running:\n ${data}`);
			// res.send(data);
			return connectToDB();
		})
		.then(()=>{
			console.log('connected');
			let pros = createTables(eles, rels);
			// console.log(pros);
			return Promise.all(pros); //true;
			// return pros;
		})
		// .then((data) => {
		// 	console.log(`Tables?: ${data}`);
		// 	return Promise.all(data);
		// })
		.then(() => {
			console.log('tables created');
			return true;
		})
		.catch(error =>{
			console.log('error', error);
			res.status(500).send(error);
		});
};

// /* use this for RESTFul request (i.e. params in the web address) */
// export function createRESTTable(req: Request, res: Response) {
// 	console.log('restTable', req.params);
// 	const name: string = req.params.name;
// 	 pool.query(`create table ${name} (id int);`,[], (err: Error, result: QueryResult<any>) => {
// 		if(err){ throw err; }
// 		res
// 			.status(200)
// 			.send('finished');
// 	});
// };
